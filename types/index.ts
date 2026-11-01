export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  technologies: string[];
  image: string;
  results: string;
  description: string;
  liveUrl?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  business: string;
  role: string;
  image: string;
  rating: number;
  review: string;
  growthMetric: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
  iconName: string;
  stat?: string;
}
