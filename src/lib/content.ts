/**
 * Central content model for NZ Constructions.
 * All copy sourced from docs/nz_webpage_setup.docx.md and shaped for the site.
 */

export const site = {
  name: "NZ Constructions",
  shortName: "NZ",
  tagline: "Innovative Floor Plans  |  Building Designs",
  location: "Hyderabad, Telangana, India",
  phone: "+91 XXXXX XXXXX",
  email: "info@nzconstruction.com",
  web: "www.nzconstruction.com",
  established: 2026,
};

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const hero = {
  eyebrow: "We build spaces, you live the dream",
  headlineLines: ["Building Dreams", "with Excellence,", "Precision & Trust"],
  sub: "With 200+ successfully constructed homes and 100+ completed architectural planning, building design and elevation projects, NZ Constructions is a trusted, leading construction company in Hyderabad, India.",
  ctaPrimary: { label: "Get Free Consultation", href: "/contact" },
  ctaSecondary: { label: "View Our Projects", href: "/projects" },
};

export const stats = [
  { value: 200, suffix: "+", label: "Homes Constructed", icon: "home" },
  { value: 100, suffix: "+", label: "Plans & Designs Delivered", icon: "ruler" },
  { value: 15, suffix: "+", label: "Years of Experience", icon: "badge" },
  { value: 180, suffix: "+", label: "Happy Clients", icon: "star" },
];

export const whyChoose = {
  eyebrow: "Why NZ Constructions",
  title: "Engineered around your peace of mind.",
  intro:
    "Six commitments that turn a construction project into a calm, predictable journey — from the first sketch to the day you get your keys.",
  items: [
    {
      icon: "architect",
      title: "Experienced Architects & Engineers",
      body: "A senior in-house team with 15+ years designing and delivering homes across Hyderabad.",
    },
    {
      icon: "layers",
      title: "End-to-End Construction",
      body: "One accountable partner from concept and approvals through to the final handover.",
    },
    {
      icon: "clock",
      title: "On-Time Delivery",
      body: "Milestone-driven scheduling and weekly progress so your project lands on time.",
    },
    {
      icon: "tag",
      title: "Transparent Pricing",
      body: "Itemised, fixed quotations with no hidden costs — you always know where the money goes.",
    },
    {
      icon: "diamond",
      title: "Premium Materials",
      body: "Specified, certified materials and trusted vendors for a build that lasts generations.",
    },
    {
      icon: "compass",
      title: "Modern Design Approach",
      body: "Contemporary, sustainable and functional spaces designed to stand the test of time.",
    },
  ],
};

export type ServiceSummary = {
  icon: string;
  title: string;
  body: string;
  from?: string;
  image: string;
};

export const services: ServiceSummary[] = [
  {
    icon: "floorplan",
    title: "Architectural Floor Plans",
    body: "Transform your ideas into professional architectural plans with accurate layouts and intelligent space planning.",
    from: "₹1,999",
    image: "/images/ambient/blueprint.jpg",
  },
  {
    icon: "elevation",
    title: "Building Elevation Design",
    body: "Modern, contemporary, traditional and luxury elevation designs tailored to your vision.",
    from: "₹2,999",
    image: "/images/ambient/facade.jpg",
  },
  {
    icon: "crane",
    title: "Construction Services",
    body: "Complete residential and commercial construction — from foundation to handover.",
    from: "Custom",
    image: "/images/ambient/construction.jpg",
  },
  {
    icon: "sofa",
    title: "Interior Design",
    body: "Functional and aesthetically pleasing interiors that feel unmistakably yours.",
    from: "Custom",
    image: "/images/projects/interior-living.jpg",
  },
  {
    icon: "beam",
    title: "Structural Design",
    body: "Safe and durable structural planning for residential and commercial projects.",
    from: "₹5,999",
    image: "/images/ambient/concrete.jpg",
  },
  {
    icon: "chat",
    title: "Construction Consultation",
    body: "Expert guidance for planning, budgeting, approvals and execution at every stage.",
    from: "₹999",
    image: "/images/ambient/architect-desk.jpg",
  },
];

/* Detailed pricing for the Services page */
export type Plan = {
  name: string;
  price: string;
  note?: string;
  features: string[];
  featured?: boolean;
};
export type ServiceDetail = {
  icon: string;
  title: string;
  description: string;
  deliverables?: string[];
  plans: Plan[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    icon: "floorplan",
    title: "Architectural Floor Plans",
    description:
      "Professional floor planning with efficient space utilisation and modern architectural standards.",
    deliverables: ["2D Floor Plans", "Site Layout Plans", "Room Planning", "Dimensioned Drawings"],
    plans: [
      { name: "Basic", price: "₹1,999", features: ["Basic Floor Plan", "2 Revisions"] },
      {
        name: "Standard",
        price: "₹4,999",
        featured: true,
        features: ["Detailed Floor Plan", "Furniture Layout", "5 Revisions"],
      },
      {
        name: "Premium",
        price: "₹9,999",
        features: ["Complete Architectural Package", "Unlimited Revisions", "Consultation Support"],
      },
    ],
  },
  {
    icon: "elevation",
    title: "Building Elevation Design",
    description: "Premium exterior design solutions for residential and commercial projects.",
    plans: [
      { name: "Basic", price: "₹2,999", features: ["Single Elevation Concept", "2 Revisions"] },
      {
        name: "Standard",
        price: "₹6,999",
        featured: true,
        features: ["Detailed 3D Elevation", "Material Palette", "5 Revisions"],
      },
      {
        name: "Premium",
        price: "₹12,999",
        features: ["Photoreal Elevation Suite", "Night-view Render", "Unlimited Revisions"],
      },
    ],
  },
  {
    icon: "chat",
    title: "Construction Consultation",
    description: "Expert guidance for project planning, budgeting, approvals and execution.",
    plans: [
      { name: "Online Consultation", price: "₹999", features: ["60-min Video Session", "Written Summary"] },
      {
        name: "Site Visit",
        price: "₹2,999",
        featured: true,
        features: ["On-site Inspection", "Feasibility Notes", "Budget Direction"],
      },
      {
        name: "Project Package",
        price: "₹4,999",
        features: ["End-to-end Advisory", "Approvals Guidance", "Vendor Shortlist"],
      },
    ],
  },
  {
    icon: "beam",
    title: "Structural Design",
    description: "Safe and durable structural planning for residential, commercial and industrial builds.",
    plans: [
      { name: "Residential", price: "₹5,999", features: ["RCC Structural Design", "Foundation Plan"] },
      {
        name: "Commercial",
        price: "₹14,999",
        featured: true,
        features: ["Multi-storey Design", "Load Analysis", "Site Coordination"],
      },
      {
        name: "Industrial",
        price: "Custom Quote",
        note: "Tailored to scope",
        features: ["Heavy-load Engineering", "Compliance & Safety", "Dedicated Engineer"],
      },
    ],
  },
];

export type Project = {
  name: string;
  category: string;
  type: "Residential" | "Commercial";
  location: string;
  year: number;
  description: string;
  image: string;
};

export const projects: Project[] = [
  {
    name: "Aurelia Villa",
    category: "Luxury Villa",
    type: "Residential",
    location: "Jubilee Hills, Hyderabad",
    year: 2024,
    description: "A 6,200 sq.ft. villa with floating staircases, a cantilevered pool deck and a glass-wrapped courtyard.",
    image: "/images/projects/villa.jpg",
  },
  {
    name: "Skyline Residences",
    category: "Apartments",
    type: "Residential",
    location: "Gachibowli, Hyderabad",
    year: 2024,
    description: "A 14-storey residential tower of 96 homes with sky gardens and a double-height arrival lobby.",
    image: "/images/projects/apartment.jpg",
  },
  {
    name: "The Banjara Duplex",
    category: "Duplex Home",
    type: "Residential",
    location: "Banjara Hills, Hyderabad",
    year: 2023,
    description: "Twin duplex residences sharing a sculpted concrete spine and private landscaped terraces.",
    image: "/images/projects/duplex.jpg",
  },
  {
    name: "Casa Serene",
    category: "Independent House",
    type: "Residential",
    location: "Kondapur, Hyderabad",
    year: 2023,
    description: "A warm, light-filled family home organised around a central reflecting court.",
    image: "/images/projects/house-aerial.jpg",
  },
  {
    name: "NZ Corporate Tower",
    category: "Office Building",
    type: "Commercial",
    location: "HITEC City, Hyderabad",
    year: 2024,
    description: "A Grade-A office tower with a unitised glass facade and a five-storey landscaped atrium.",
    image: "/images/projects/office.jpg",
  },
  {
    name: "The Forum Retail",
    category: "Retail Complex",
    type: "Commercial",
    location: "Madhapur, Hyderabad",
    year: 2022,
    description: "A mixed-use retail destination with sweeping daylight voids and flexible storefronts.",
    image: "/images/projects/retail.jpg",
  },
  {
    name: "Lumen Workspace",
    category: "Office Interior",
    type: "Commercial",
    location: "Financial District, Hyderabad",
    year: 2024,
    description: "A 40,000 sq.ft. workplace fit-out blending acoustic comfort with biophilic design.",
    image: "/images/projects/commercial.jpg",
  },
  {
    name: "Logiport Warehouse",
    category: "Warehouse",
    type: "Commercial",
    location: "Shamshabad, Hyderabad",
    year: 2023,
    description: "A high-bay logistics facility engineered for heavy loads and rapid throughput.",
    image: "/images/projects/warehouse.jpg",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "NZ Construction delivered our dream home exactly as promised. Professional team and excellent quality.",
    name: "Rajesh & Sunita",
    role: "Villa Owners · Jubilee Hills",
    rating: 5,
  },
  {
    quote:
      "From the floor plan to the final handover, every milestone was on time and on budget. The transparency was refreshing.",
    name: "Aravind Reddy",
    role: "Duplex Owner · Banjara Hills",
    rating: 5,
  },
  {
    quote:
      "Their elevation design completely transformed our building. Modern, elegant and exactly what we imagined.",
    name: "Fatima Begum",
    role: "Apartment Developer · Gachibowli",
    rating: 5,
  },
];

export const about = {
  eyebrow: "About NZ Constructions",
  who: "NZ Constructions is a trusted construction and architectural design company based in Hyderabad, India, delivering high-quality residential and commercial projects with innovation, precision and commitment.",
  mission:
    "To provide exceptional construction and design solutions that exceed client expectations while maintaining quality, transparency and professionalism.",
  vision: "To become one of India's most trusted construction and architectural design companies.",
  achievements: [
    "200+ Successfully Constructed Homes",
    "100+ Plans, Building & Elevation Designs Completed",
    "180+ Happy Clients",
    "15+ Years of Industry Experience",
    "Leading Construction Company in Hyderabad, India",
  ],
  hours: [
    { day: "Monday – Friday", time: "10:00 AM – 8:00 PM" },
    { day: "Saturday – Sunday", time: "12:00 PM – 6:00 PM" },
  ],
};

export const contactForm = {
  fields: ["Full Name", "Phone Number", "Email Address", "Service Required", "Message"],
  serviceOptions: services.map((s) => s.title),
};

export const footer = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  services: [
    "Architectural Floor Plans",
    "Elevation Design",
    "Construction Services",
    "Interior Design",
    "Structural Design",
  ],
  social: [
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "Facebook", href: "#", icon: "facebook" },
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "YouTube", href: "#", icon: "youtube" },
  ],
};

export const marqueeWords = [
  "Floor Plans",
  "Elevations",
  "Villas",
  "Duplexes",
  "Apartments",
  "Interiors",
  "Structural Design",
  "Turnkey Builds",
  "Consultation",
];
