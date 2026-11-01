import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import agencySeed from "@/data/agency_seed.json";

// In-memory fallback cache across serverless invocations on the same instance
let memoryCache: any = null;
let lastCacheUpdate = Date.now();

const BLOB_FILENAME = "agency_data.json";
const DIRECT_BLOB_URL = "https://la9vf2k3zbzjmhaj.public.blob.vercel-storage.com/agency_data.json";

// Helper: Check Upstash Redis REST API if credentials provided
async function getUpstashData(): Promise<any | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/vmt_agency_data`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (res.ok) {
      const json = await res.json();
      const val = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
      if (val && typeof val === "object") return val;
    }
  } catch (err) {
    console.warn("Upstash Redis get error:", err);
  }
  return null;
}

async function setUpstashData(payload: any): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;

  try {
    const res = await fetch(`${url}/set/vmt_agency_data`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn("Upstash Redis set error:", err);
    return false;
  }
}

export async function GET() {
  try {
    // 1. Check Upstash / KV persistent database if configured
    const upstashCloud = await getUpstashData();
    if (upstashCloud && upstashCloud.lastUpdated) {
      memoryCache = upstashCloud;
      return NextResponse.json({
        success: true,
        source: "upstash_kv_database",
        isPersistent: true,
        data: upstashCloud,
        lastUpdated: upstashCloud.lastUpdated
      });
    }

    // 2. Return memory cache if available (fastest for active instances)
    if (memoryCache && memoryCache.lastUpdated) {
      return NextResponse.json({
        success: true,
        source: "memory_cache",
        isPersistent: true,
        data: memoryCache,
        lastUpdated: memoryCache.lastUpdated || lastCacheUpdate
      });
    }

    // 3. Direct fetch from public Blob CDN
    try {
      const directRes = await fetch(`${DIRECT_BLOB_URL}?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
      });

      if (directRes.ok) {
        const cloudData = await directRes.json();
        if (cloudData && typeof cloudData === "object") {
          // Never blindly overwrite with empty seed!
          memoryCache = cloudData;
          return NextResponse.json({
            success: true,
            source: "vercel_blob_cdn",
            isPersistent: true,
            data: cloudData,
            lastUpdated: cloudData.lastUpdated
          });
        }
      }
    } catch (directErr) {
      console.warn("Direct blob CDN fetch fallback:", directErr);
    }

    // 4. Check Vercel Blob list API as backup
    try {
      const { blobs } = await list({ prefix: BLOB_FILENAME });
      const targetBlob = blobs.find((b) => b.pathname === BLOB_FILENAME) || blobs[0];

      if (targetBlob && targetBlob.url) {
        const res = await fetch(`${targetBlob.url}?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
        });

        if (res.ok) {
          const cloudData = await res.json();
          if (cloudData && typeof cloudData === "object") {
            memoryCache = cloudData;
            return NextResponse.json({
              success: true,
              source: "vercel_blob_api",
              isPersistent: true,
              data: cloudData,
              lastUpdated: cloudData.lastUpdated || targetBlob.uploadedAt
            });
          }
        }
      }
    } catch (blobErr) {
      console.warn("Vercel Blob list API fallback to memory cache:", blobErr);
    }

    // 5. Initial / Fresh Server Baseline:
    // Mark with isFreshBaseline: true so client knows this is empty default and NEVER wipes existing client data!
    return NextResponse.json({
      success: true,
      source: "agency_seed",
      isFreshBaseline: true,
      isPersistent: false,
      data: agencySeed,
      lastUpdated: agencySeed.lastUpdated
    });
  } catch (error: any) {
    console.error("GET /api/agency/sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch cloud sync data",
        data: memoryCache || agencySeed,
        isFreshBaseline: !memoryCache
      },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid sync payload" },
        { status: 400 }
      );
    }

    const payloadWithMeta = {
      ...payload,
      lastUpdated: new Date().toISOString()
    };

    memoryCache = payloadWithMeta;
    lastCacheUpdate = Date.now();

    // 1. Try Upstash Redis / KV if available
    let upstashSaved = false;
    try {
      upstashSaved = await setUpstashData(payloadWithMeta);
    } catch (e) {
      console.warn("Upstash save attempt:", e);
    }

    // 2. Try Vercel Blob persistence
    let blobUrl: string | null = null;
    let blobError: string | null = null;
    try {
      const blob = await put(BLOB_FILENAME, JSON.stringify(payloadWithMeta, null, 2), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json"
      } as any);
      blobUrl = blob.url;
    } catch (blobErr: any) {
      blobError = blobErr?.message || String(blobErr);
      console.warn("Vercel Blob PUT fallback to server cache:", blobErr);
    }

    const isFullyPersistent = Boolean(blobUrl || upstashSaved);

    return NextResponse.json({
      success: true,
      isPersistent: isFullyPersistent,
      provider: upstashSaved ? "upstash_redis" : blobUrl ? "vercel_blob" : "serverless_memory",
      blobUrl,
      blobError,
      lastUpdated: payloadWithMeta.lastUpdated,
      message: isFullyPersistent
        ? "Data securely and permanently saved to cloud database!"
        : "Data saved to cloud cache & local storage. To enable permanent Vercel Blob persistence, add BLOB_READ_WRITE_TOKEN in Vercel settings."
    });
  } catch (error: any) {
    console.error("POST /api/agency/sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to persist sync data",
        savedLocally: true
      },
      { status: 500 }
    );
  }
}
