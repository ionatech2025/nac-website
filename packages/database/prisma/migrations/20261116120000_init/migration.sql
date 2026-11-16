-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OpportunityManualStatus" AS ENUM ('NONE', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VideoProvider" AS ENUM ('YOUTUBE', 'VIMEO');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('NEW', 'REVIEWED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DeviceClass" AS ENUM ('MOBILE', 'TABLET', 'DESKTOP', 'UNKNOWN');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageContent" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyFigure" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeyFigure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "imageId" UUID,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammeStrategy" (
    "id" UUID NOT NULL,
    "programmeId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProgrammeStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YouthRegion" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "YouthRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YouthSpace" (
    "id" UUID NOT NULL,
    "regionId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT NOT NULL,
    "managingPartner" TEXT,
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mapUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YouthSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YouthSpaceImage" (
    "id" UUID NOT NULL,
    "spaceId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "YouthSpaceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "photoId" UUID,
    "biography" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "coverImageId" UUID,
    "author" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageId" UUID,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logoId" UUID,
    "websiteUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedConcept" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "imageId" UUID,
    "destinationUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideshowImage" (
    "id" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "caption" TEXT,
    "altText" TEXT,
    "destinationUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlideshowImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OpportunityType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "typeId" UUID,
    "description" TEXT NOT NULL,
    "openingDate" DATE,
    "closingDate" DATE,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "applicationInstructions" TEXT,
    "manualStatus" "OpportunityManualStatus" NOT NULL DEFAULT 'NONE',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityAttachment" (
    "id" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "title" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OpportunityAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Kampala',
    "location" TEXT,
    "imageId" UUID,
    "registrationUrl" TEXT,
    "contact" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoAlbum" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverMediaId" UUID,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotoAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoImage" (
    "id" UUID NOT NULL,
    "albumId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "caption" TEXT,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PhotoImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoLink" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "provider" "VideoProvider" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailMediaId" UUID,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DocumentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" UUID,
    "mediaId" UUID NOT NULL,
    "fileType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "incidentDate" DATE,
    "programmeOrPlace" TEXT,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'NEW',
    "adminNotes" TEXT,
    "submittedOn" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" UUID NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT NOT NULL,
    "referrerHost" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "deviceClass" "DeviceClass" NOT NULL DEFAULT 'UNKNOWN',
    "browser" TEXT,
    "os" TEXT,
    "visitorHash" TEXT NOT NULL,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsDaily" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "path" TEXT NOT NULL,
    "referrerHost" TEXT,
    "country" TEXT,
    "city" TEXT,
    "deviceClass" "DeviceClass",
    "browser" TEXT,
    "os" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AnalyticsDaily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_key_key" ON "PageContent"("key");

-- CreateIndex
CREATE INDEX "KeyFigure_sortOrder_idx" ON "KeyFigure"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Programme_slug_key" ON "Programme"("slug");

-- CreateIndex
CREATE INDEX "Programme_status_sortOrder_idx" ON "Programme"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "ProgrammeStrategy_programmeId_sortOrder_idx" ON "ProgrammeStrategy"("programmeId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "YouthRegion_name_key" ON "YouthRegion"("name");

-- CreateIndex
CREATE INDEX "YouthRegion_sortOrder_idx" ON "YouthRegion"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "YouthSpace_slug_key" ON "YouthSpace"("slug");

-- CreateIndex
CREATE INDEX "YouthSpace_regionId_status_sortOrder_idx" ON "YouthSpace"("regionId", "status", "sortOrder");

-- CreateIndex
CREATE INDEX "YouthSpaceImage_spaceId_sortOrder_idx" ON "YouthSpaceImage"("spaceId", "sortOrder");

-- CreateIndex
CREATE INDEX "TeamMember_status_sortOrder_idx" ON "TeamMember"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Partner_status_sortOrder_idx" ON "Partner"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "FeaturedConcept_status_sortOrder_idx" ON "FeaturedConcept"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "SlideshowImage_status_sortOrder_idx" ON "SlideshowImage"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityType_name_key" ON "OpportunityType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityType_slug_key" ON "OpportunityType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_slug_key" ON "Opportunity"("slug");

-- CreateIndex
CREATE INDEX "Opportunity_status_manualStatus_closingDate_idx" ON "Opportunity"("status", "manualStatus", "closingDate");

-- CreateIndex
CREATE INDEX "Opportunity_openingDate_idx" ON "Opportunity"("openingDate");

-- CreateIndex
CREATE INDEX "OpportunityAttachment_opportunityId_sortOrder_idx" ON "OpportunityAttachment"("opportunityId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_startAt_idx" ON "Event"("status", "startAt");

-- CreateIndex
CREATE INDEX "Event_endAt_idx" ON "Event"("endAt");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoAlbum_slug_key" ON "PhotoAlbum"("slug");

-- CreateIndex
CREATE INDEX "PhotoAlbum_status_sortOrder_idx" ON "PhotoAlbum"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "PhotoImage_albumId_sortOrder_idx" ON "PhotoImage"("albumId", "sortOrder");

-- CreateIndex
CREATE INDEX "VideoLink_status_sortOrder_idx" ON "VideoLink"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCategory_name_key" ON "DocumentCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCategory_slug_key" ON "DocumentCategory"("slug");

-- CreateIndex
CREATE INDEX "Document_status_publishedAt_idx" ON "Document"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Document_categoryId_idx" ON "Document"("categoryId");

-- CreateIndex
CREATE INDEX "Inquiry_isRead_createdAt_idx" ON "Inquiry"("isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_isArchived_idx" ON "Inquiry"("isArchived");

-- CreateIndex
CREATE INDEX "Complaint_status_submittedOn_idx" ON "Complaint"("status", "submittedOn");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_occurredAt_idx" ON "AnalyticsEvent"("occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_path_occurredAt_idx" ON "AnalyticsEvent"("path", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsDaily_date_idx" ON "AnalyticsDaily"("date");

-- CreateIndex
CREATE INDEX "AnalyticsDaily_path_idx" ON "AnalyticsDaily"("path");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsDaily_date_path_referrerHost_country_city_deviceCl_key" ON "AnalyticsDaily"("date", "path", "referrerHost", "country", "city", "deviceClass", "browser", "os");

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeStrategy" ADD CONSTRAINT "ProgrammeStrategy_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YouthSpace" ADD CONSTRAINT "YouthSpace_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "YouthRegion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YouthSpaceImage" ADD CONSTRAINT "YouthSpaceImage_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "YouthSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YouthSpaceImage" ADD CONSTRAINT "YouthSpaceImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedConcept" ADD CONSTRAINT "FeaturedConcept_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlideshowImage" ADD CONSTRAINT "SlideshowImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "OpportunityType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityAttachment" ADD CONSTRAINT "OpportunityAttachment_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityAttachment" ADD CONSTRAINT "OpportunityAttachment_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoAlbum" ADD CONSTRAINT "PhotoAlbum_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoImage" ADD CONSTRAINT "PhotoImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "PhotoAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoImage" ADD CONSTRAINT "PhotoImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoLink" ADD CONSTRAINT "VideoLink_thumbnailMediaId_fkey" FOREIGN KEY ("thumbnailMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DocumentCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

