import React from "react";

export function JsonLd() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Vishal Media Tech",
    "image": "https://vishalmediatech.com/og-image.jpg",
    "@id": "https://vishalmediatech.com",
    "url": "https://vishalmediatech.com",
    "telephone": "+918655957779",
    "email": "vishalmediatech@gmail.com",
    "priceRange": "₹₹",
    "founder": {
      "@type": "Person",
      "name": "Vishal Jaiswal",
      "jobTitle": "Founder & Chief Meta Ads Strategist",
      "description": "4+ Years Experience in Meta Ads & Digital Growth Marketing"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Market Road",
      "addressLocality": "Khalilabad",
      "addressRegion": "Sant Kabir Nagar, Uttar Pradesh",
      "postalCode": "272175",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.7766,
      "longitude": 83.0734
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Khalilabad" },
      { "@type": "AdministrativeArea", "name": "Gorakhpur" },
      { "@type": "AdministrativeArea", "name": "Sant Kabir Nagar" },
      { "@type": "AdministrativeArea", "name": "Basti" },
      { "@type": "AdministrativeArea", "name": "Deoria" },
      { "@type": "AdministrativeArea", "name": "Purvanchal, Uttar Pradesh" }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://facebook.com/vishalmediatech",
      "https://instagram.com/vishalmediatech",
      "https://linkedin.com/company/vishalmediatech"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
