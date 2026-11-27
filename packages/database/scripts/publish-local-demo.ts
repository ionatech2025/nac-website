/**
 * Local-only helper: ensure published demo content so the public site can be tested.
 * Idempotent — updates existing rows by slug/name where possible; never deletes.
 */
import { prisma } from "../src/client";
import { ensureAboutPage } from "../src/public-organisation";
import { ensureSiteSettings } from "../src/public-site-settings";
import { SITE_SETTING_KEYS } from "../src/site-settings-keys";
import { loadStarterYouthSpaces } from "../src/youth-space-starter";

async function upsertSetting(key: string, value: object) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

async function ensureTeam() {
  const members = [
    {
      name: "Peniel Rwendeire",
      roleTitle: "Executive Director",
      biography:
        "Leads NAC’s strategy, partnerships, and network coordination across Uganda.",
      sortOrder: 0,
    },
    {
      name: "Patricia Nakitto",
      roleTitle: "Programme lead",
      biography:
        "Coordinates programme delivery across governance, climate resilience, and youth organising.",
      sortOrder: 1,
    },
  ];

  for (const member of members) {
    const existing = await prisma.teamMember.findFirst({
      where: { name: member.name },
      select: { id: true },
    });
    if (existing) {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: { ...member, status: "PUBLISHED" },
      });
    } else {
      await prisma.teamMember.create({
        data: { ...member, status: "PUBLISHED" },
      });
    }
  }
}

async function ensureProgrammes() {
  const programmes = [
    {
      title: "Governance and Participation",
      slug: "gap",
      summary:
        "Empowerment training for leaders so they can influence change in the communities they represent.",
      body: "GAP strengthens youth participation in governance and budgeting. NAC works with partners so young people can shape local decisions and hold duty bearers to account.",
      sortOrder: 0,
      strategies: [
        {
          title: "Leadership empowerment",
          body: "Train newly elected and community leaders for effective, inclusive leadership.",
        },
        {
          title: "Youth budgeting tools",
          body: "Use Youth Go Budget and SLOGBAA to organise youth around fiscal processes.",
        },
      ],
    },
    {
      title: "Youth Climate Resilience",
      slug: "ycr",
      summary:
        "Urban sustainability initiatives with young people living in vulnerable communities.",
      body: "YCR increases wellbeing and climate resilience through community-led urban sustainability work in Kampala’s vulnerable settlements.",
      sortOrder: 1,
      strategies: [
        {
          title: "Community clean-ups and greening",
          body: "Support youth-led clean-ups and green spaces that reduce flood and waste risks.",
        },
      ],
    },
    {
      title: "Community Journalism",
      slug: "community-journalism",
      summary: "Putting community issues in front of duty bearers and stakeholders.",
      body: "Community Journalism supports young people to document and amplify local issues so duty bearers and stakeholders can respond.",
      sortOrder: 2,
      strategies: [],
    },
    {
      title: "Youth Organizing and Strengthening",
      slug: "youth-organizing",
      summary:
        "Organising and strengthening youth spaces and civil society pathways.",
      body: "This programme builds capacity for youth organisations and the physical youth spaces where young people organise, learn, and lead.",
      sortOrder: 3,
      strategies: [],
    },
  ];

  for (const programme of programmes) {
    const { strategies, ...data } = programme;
    const row = await prisma.programme.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        summary: data.summary,
        body: data.body,
        sortOrder: data.sortOrder,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      create: {
        ...data,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    if (strategies.length === 0) continue;
    const existingStrategies = await prisma.programmeStrategy.count({
      where: { programmeId: row.id },
    });
    if (existingStrategies > 0) continue;
    await prisma.programmeStrategy.createMany({
      data: strategies.map((strategy, index) => ({
        programmeId: row.id,
        title: strategy.title,
        body: strategy.body,
        sortOrder: index,
      })),
    });
  }
}

async function ensureArticles() {
  const articles = [
    {
      title: "Youth spaces expand urban gardens across Kampala",
      slug: "youth-spaces-urban-gardens",
      excerpt:
        "Kampala youth spaces are expanding urban gardens as learning and livelihood hubs.",
      body: "Kampala youth spaces are expanding urban gardens as learning and livelihood hubs, with seedlings and demonstration sessions for visitors.\n\nYoung people lead the work, linking climate action to everyday community needs.",
      author: "NAC Communications",
    },
    {
      title: "Network partners gather for Youth CSO Market",
      slug: "youth-cso-market",
      excerpt:
        "Member organisations met to share tools, stories, and opportunities for collaboration.",
      body: "Member organisations met to share tools, stories, and opportunities for collaboration at the annual Youth CSO Market.\n\nThe gathering strengthens peer learning across NAC’s network.",
      author: "NAC Communications",
    },
    {
      title: "Budget literacy sessions open for youth leaders",
      slug: "budget-literacy-sessions",
      excerpt:
        "Governance and Participation continues budget literacy sessions with Youth Go Budget.",
      body: "Governance and Participation continues budget literacy sessions with Youth Go Budget so young people can follow local public finance decisions.",
      author: "NAC Communications",
    },
  ];

  for (const [index, article] of articles.entries()) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        ...article,
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - index * 86_400_000),
      },
      create: {
        ...article,
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - index * 86_400_000),
      },
    });
  }
}

async function ensureKeyFigures() {
  const figures = [
    { label: "Organisations in the network", value: "89+", sortOrder: 0 },
    { label: "Youth spaces", value: "15", sortOrder: 1 },
    { label: "Regions reached", value: "4", sortOrder: 2 },
  ];
  const count = await prisma.keyFigure.count();
  if (count > 0) return;
  await prisma.keyFigure.createMany({ data: figures });
}

async function ensureFeaturedConcepts() {
  const concepts = [
    {
      title: "Safe spaces for young people",
      summary: "Youth spaces as hubs for organising, learning, and enterprise.",
      destinationUrl: "/youth-spaces",
      sortOrder: 0,
    },
    {
      title: "Youth voice in budgets",
      summary: "Tools and training so young people can influence local budgeting.",
      destinationUrl: "/programs/gap",
      sortOrder: 1,
    },
  ];
  for (const concept of concepts) {
    const existing = await prisma.featuredConcept.findFirst({
      where: { title: concept.title },
      select: { id: true },
    });
    if (existing) {
      await prisma.featuredConcept.update({
        where: { id: existing.id },
        data: { ...concept, status: "PUBLISHED" },
      });
    } else {
      await prisma.featuredConcept.create({
        data: { ...concept, status: "PUBLISHED" },
      });
    }
  }
}

async function ensureMembers() {
  const orgs = [
    {
      name: "Holistic Action for Development and Empowerment",
      slug: "hade",
      bio: "HADE works with young people in Kampala on organisation strengthening and community action.",
      websiteUrl: null as string | null,
      sortOrder: 0,
    },
    {
      name: "Civic Action Hub",
      slug: "civact",
      bio: "Civic Action Hub supports youth civic engagement and accountability initiatives.",
      websiteUrl: null,
      sortOrder: 1,
    },
  ];
  for (const org of orgs) {
    await prisma.memberOrganisation.upsert({
      where: { slug: org.slug },
      update: { ...org, status: "PUBLISHED", publishedAt: new Date() },
      create: { ...org, status: "PUBLISHED", publishedAt: new Date() },
    });
  }
}

async function ensureOpportunity() {
  const type =
    (await prisma.opportunityType.findFirst({ where: { slug: "job" } })) ??
    (await prisma.opportunityType.create({
      data: { name: "Job", slug: "job", sortOrder: 0 },
    }));

  await prisma.opportunity.upsert({
    where: { slug: "programme-officer-kampala" },
    update: {
      title: "Programme Officer – Kampala",
      description:
        "Support NAC programme delivery with member organisations and youth spaces in Kampala.",
      typeId: type.id,
      contactEmail: "activecitizenuganda@gmail.com",
      openingDate: new Date("2026-01-01"),
      closingDate: new Date("2026-12-31"),
      applicationInstructions: "Email your CV and a short cover note.",
      status: "PUBLISHED",
      manualStatus: "NONE",
    },
    create: {
      title: "Programme Officer – Kampala",
      slug: "programme-officer-kampala",
      description:
        "Support NAC programme delivery with member organisations and youth spaces in Kampala.",
      typeId: type.id,
      contactEmail: "activecitizenuganda@gmail.com",
      openingDate: new Date("2026-01-01"),
      closingDate: new Date("2026-12-31"),
      applicationInstructions: "Email your CV and a short cover note.",
      status: "PUBLISHED",
      manualStatus: "NONE",
    },
  });
}

async function ensureEvent() {
  const startAt = new Date();
  startAt.setDate(startAt.getDate() + 14);
  startAt.setHours(10, 0, 0, 0);
  const endAt = new Date(startAt);
  endAt.setHours(13, 0, 0, 0);

  await prisma.event.upsert({
    where: { slug: "youth-cso-network-day" },
    update: {
      title: "Youth CSO Network Day",
      description:
        "A half-day gathering for NAC member organisations to share updates and plan joint actions.",
      startAt,
      endAt,
      timezone: "Africa/Kampala",
      location: "Kisaasi Youth Space, Kampala",
      status: "PUBLISHED",
    },
    create: {
      title: "Youth CSO Network Day",
      slug: "youth-cso-network-day",
      description:
        "A half-day gathering for NAC member organisations to share updates and plan joint actions.",
      startAt,
      endAt,
      timezone: "Africa/Kampala",
      location: "Kisaasi Youth Space, Kampala",
      status: "PUBLISHED",
    },
  });
}

async function ensureVideo() {
  const existing = await prisma.videoLink.findFirst({
    where: { title: "NAC youth spaces overview" },
    select: { id: true },
  });
  const data = {
    title: "NAC youth spaces overview",
    description: "A short look at youth-friendly spaces across Uganda.",
    provider: "YOUTUBE" as const,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sortOrder: 0,
    status: "PUBLISHED" as const,
  };
  if (existing) {
    await prisma.videoLink.update({ where: { id: existing.id }, data });
  } else {
    await prisma.videoLink.create({ data });
  }
}

async function main() {
  await ensureSiteSettings();
  await upsertSetting(SITE_SETTING_KEYS.contact, {
    physicalAddress:
      "Shaniela Courts, Plot 106, Nsubuga Road, Off Kisaasi-Kyanja Road, Kampala, Uganda",
    postalAddress: "P.O. Box 801199 Ntinda, Uganda",
    phone: "+256 (0) 393 216240",
    phoneAlt: "+256 774 843 081",
    tollFree: "+256 (0) 800 111 423",
    email: "activecitizenuganda@gmail.com",
    whatsapp: "256774843081",
  });
  await upsertSetting(SITE_SETTING_KEYS.social, {
    facebook: "https://facebook.com/networkforactivecitizens",
    x: "https://twitter.com/activecitizensu",
    instagram: "",
    youtube: "",
    linkedin: "https://linkedin.com/company/network-for-active-citizens",
    tiktok: "",
  });
  await upsertSetting(SITE_SETTING_KEYS.external, {
    youthGoBudget: "https://youthgobudgetapp.org",
    slogbaa: "https://slogbaa.org",
  });

  await ensureAboutPage();
  await prisma.aboutPage.update({
    where: { id: "about" },
    data: {
      title: "About us",
      mission:
        "To build youth resilience in Uganda through capability development and policy outreach.",
      vision: "A resilient and prosperous Uganda.",
      whatWeDo:
        "Founded in 2017, Network for Active Citizens (NAC) brings together grassroots, youth-led and refugee-led organisations. We create spaces for young people to connect, identify shared priorities, and access resources so they can lead the development change they want in their communities.",
      why: "Young people need organised platforms to influence governance, climate resilience, and community wellbeing. NAC exists so youth organisations can work together with strength and clarity.",
    },
  });

  await loadStarterYouthSpaces(prisma);
  await prisma.youthSpace.updateMany({
    where: { status: "DRAFT" },
    data: { status: "PUBLISHED" },
  });

  await ensureTeam();
  await ensureProgrammes();
  await ensureArticles();
  await ensureKeyFigures();
  await ensureFeaturedConcepts();
  await ensureMembers();
  await ensureOpportunity();
  await ensureEvent();
  await ensureVideo();

  const summary = {
    teamPublished: await prisma.teamMember.count({ where: { status: "PUBLISHED" } }),
    programmes: await prisma.programme.count({ where: { status: "PUBLISHED" } }),
    articles: await prisma.article.count({ where: { status: "PUBLISHED" } }),
    youthSpaces: await prisma.youthSpace.count({ where: { status: "PUBLISHED" } }),
    members: await prisma.memberOrganisation.count({ where: { status: "PUBLISHED" } }),
    slides: await prisma.slideshowImage.count({ where: { status: "PUBLISHED" } }),
    opportunities: await prisma.opportunity.count({ where: { status: "PUBLISHED" } }),
    events: await prisma.event.count({ where: { status: "PUBLISHED" } }),
    videos: await prisma.videoLink.count({ where: { status: "PUBLISHED" } }),
    keyFigures: await prisma.keyFigure.count(),
  };
  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
