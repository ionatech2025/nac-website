-- ISSUE-001: programme gallery (max 3); drop single imageId
-- ISSUE-002: structured About Us + images (max 2)

CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL DEFAULT 'about',
    "title" TEXT NOT NULL DEFAULT 'About us',
    "mission" TEXT NOT NULL DEFAULT '',
    "vision" TEXT NOT NULL DEFAULT '',
    "whatWeDo" TEXT NOT NULL DEFAULT '',
    "why" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AboutPageImage" (
    "id" UUID NOT NULL,
    "aboutPageId" TEXT NOT NULL DEFAULT 'about',
    "mediaId" UUID NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutPageImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProgrammeGalleryImage" (
    "id" UUID NOT NULL,
    "programmeId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProgrammeGalleryImage_pkey" PRIMARY KEY ("id")
);

-- Migrate existing programme cover into gallery as first image
INSERT INTO "ProgrammeGalleryImage" ("id", "programmeId", "mediaId", "caption", "sortOrder")
SELECT gen_random_uuid(), "id", "imageId", NULL, 0
FROM "Programme"
WHERE "imageId" IS NOT NULL;

-- Migrate PageContent about body into AboutPage.whatWeDo
INSERT INTO "AboutPage" ("id", "title", "mission", "vision", "whatWeDo", "why", "updatedAt")
SELECT 'about', "title", '', '', "body", '', "updatedAt"
FROM "PageContent"
WHERE "key" = 'about'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "AboutPage" ("id", "title", "mission", "vision", "whatWeDo", "why", "updatedAt")
VALUES ('about', 'About us', '', '', '', '', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "Programme" DROP CONSTRAINT IF EXISTS "Programme_imageId_fkey";
ALTER TABLE "Programme" DROP COLUMN IF EXISTS "imageId";

CREATE INDEX "AboutPageImage_aboutPageId_sortOrder_idx" ON "AboutPageImage"("aboutPageId", "sortOrder");
CREATE INDEX "ProgrammeGalleryImage_programmeId_sortOrder_idx" ON "ProgrammeGalleryImage"("programmeId", "sortOrder");

ALTER TABLE "AboutPageImage" ADD CONSTRAINT "AboutPageImage_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AboutPageImage" ADD CONSTRAINT "AboutPageImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProgrammeGalleryImage" ADD CONSTRAINT "ProgrammeGalleryImage_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProgrammeGalleryImage" ADD CONSTRAINT "ProgrammeGalleryImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
