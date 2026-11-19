-- Member organisations in the NAC network (distinct from homepage Partner logos)

CREATE TABLE "MemberOrganisation" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberOrganisation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MemberOrganisationImage" (
    "id" UUID NOT NULL,
    "organisationId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MemberOrganisationImage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MemberOrganisation_slug_key" ON "MemberOrganisation"("slug");
CREATE INDEX "MemberOrganisation_status_sortOrder_idx" ON "MemberOrganisation"("status", "sortOrder");
CREATE INDEX "MemberOrganisationImage_organisationId_sortOrder_idx" ON "MemberOrganisationImage"("organisationId", "sortOrder");

ALTER TABLE "MemberOrganisationImage" ADD CONSTRAINT "MemberOrganisationImage_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "MemberOrganisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MemberOrganisationImage" ADD CONSTRAINT "MemberOrganisationImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
