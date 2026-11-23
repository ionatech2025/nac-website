/**
 * Appendix A youth spaces (Q3: Kunya once). Seed until CMS publish helpers.
 */

export type SeedSpace = {
  name: string;
  location?: string;
  managingPartner?: string;
  description: string;
  services: string[];
  mapUrl?: string;
};

export type SeedRegion = {
  name: string;
  spaces: SeedSpace[];
};

export const YOUTH_SPACES_INTRO =
  "NAC has established 15 youth spaces that work as youth co-creation, youth enterprise incubation and refugee engagement hubs in West Nile, the Central region, and eastern and western Uganda. Grassroots organisations use them for administrative support, shared capacity and collective civic action.";

export const SEED_YOUTH_REGIONS: SeedRegion[] = [
  {
    name: "Kampala",
    spaces: [
      {
        name: "Kisaasi Youth Space",
        location: "Kisaasi, Kampala",
        description:
          "A shared workspace and virtual office address for 20 organisations, and home of the annual Youth CSO Market for 30+ youth-led groups.",
        services: [
          "Shared workspace and virtual office addresses",
          "Youth Café with free or subsidised Wi-Fi, computers and printing",
          "English classes for newly arrived urban refugees",
          "Annual Youth CSO Market",
        ],
      },
      {
        name: "Kinawataka Youth Space",
        location: "Kinawataka, Kampala",
        managingPartner:
          "OBOIVU (One By One Initiative for Vulnerable Communities in Uganda), an NAC member",
        description:
          "A community reading and learning space with an urban garden and a local small enterprise.",
        services: [
          "Reading space and cinema",
          "Night reading",
          "Urban garden with free seedlings",
          "Local small enterprise",
        ],
      },
      {
        name: "Kamwanyi Youth Space",
        location: "Shore of Lake Victoria, Kampala",
        managingPartner:
          "HADE (Holistic Action for Development and Empowerment), an NAC member",
        description:
          "A women-led multifunctional space on the shore of Lake Victoria supporting 20+ youth social entrepreneurs.",
        services: [
          "Youth social enterprise support",
          "Women-led multifunctional space",
          "Container shop for water hyacinth and bamboo products",
        ],
      },
      {
        name: "Kitintale Youth Space",
        location: "Kitintale, Kampala",
        managingPartner: "Civact, an NAC member",
        description:
          "A civic meeting space connecting young people with local leaders.",
        services: [
          "Village meetings",
          "Youth parliament with local leaders",
          "Partner meetings",
        ],
      },
      {
        name: "Kawempe Youth Centre",
        location: "Kawempe, Kampala",
        managingPartner: "Kawempe Youth Centre (KYC)",
        description: "A youth centre with an urban garden and a community library.",
        services: ["Urban garden", "Community library"],
      },
      {
        name: "Kyebando Youth Space",
        location: "Kyebando, Kampala",
        managingPartner: "Eco Smart Innovations Initiative",
        description: "An open community space for learning, play and skilling.",
        services: [
          "Free internet",
          "Shelter from heat",
          "Children's play",
          "Learning",
          "CSO and NGO events",
          "Skilling",
        ],
      },
      {
        name: "Kanyanya Youth Space",
        location: "Near Kanyanya Church of Uganda Primary School, Kampala",
        managingPartner: "Sustainable Community Initiative for Empowerment",
        description:
          "A public green space and social hub promoting children's right to play and learning.",
        services: ["Children's play", "Learning", "Social hub"],
      },
      {
        name: "Kirombe Youth Space",
        location: "Kirombe, Kampala",
        managingPartner: "Footmarks Initiative Uganda",
        description:
          "A public green space with an urban agriculture demonstration garden.",
        services: [
          "Urban agriculture demonstration garden",
          "CSO and NGO events",
          "Skills development",
        ],
      },
      {
        name: "Kunya Youth Space",
        location: "Uganda Youth Primary School, Kampala",
        managingPartner: "Afrikovikoo Hub with the school; She for Change (women-led)",
        description:
          "A public green space at Uganda Youth Primary School with an urban farming demonstration garden and vocational training.",
        services: [
          "Urban farming demonstration garden",
          "Vocational training",
          "Self-employable skills",
          "Peer learning on digital skills",
          "Women's savings group meetings",
        ],
      },
    ],
  },
  {
    name: "West Nile",
    spaces: [
      {
        name: "Arua Youth Space",
        location: "Arua",
        managingPartner: "Host Hub Innovation Centre (established 2021)",
        description:
          "A co-working and peer-learning hub that works with regional media on digital storytelling.",
        services: [
          "Co-working and peer learning",
          "Regional media partnerships (NBS West Nile Region, Capital FM West Nile)",
          "Digital storytelling (Next Creata Fellowship)",
        ],
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Arua+Uganda",
      },
      {
        name: "Yumbe Youth Space",
        location: "Yumbe",
        managingPartner: "HADE",
        description:
          "A shared base where 10 local organisations collaborate, with reliable electricity, internet and workspace.",
        services: [
          "Shared workspace for 10 local organisations",
          "Reliable electricity and internet",
          "Collaboration base",
        ],
      },
    ],
  },
  {
    name: "Western Uganda",
    spaces: [
      {
        name: "Ntugamo Youth Space",
        location: "Ntugamo",
        description:
          "The only youth space in western Uganda — a meeting point for political youth leaders on local budgets and government programmes.",
        services: [
          "Youth leaders' meetings on local budgets",
          "Engagement on government programmes",
        ],
      },
    ],
  },
  {
    name: "Eastern Uganda",
    spaces: [
      {
        name: "Mayuge Youth CSO Space",
        location: "Mayuge",
        managingPartner: "Hope Alive initiative",
        description: "A community CSO hub, library and resource centre.",
        services: [
          "Community CSO hub",
          "Community library",
          "Resource centre",
          "Meeting point for sports groups",
        ],
      },
    ],
  },
];
