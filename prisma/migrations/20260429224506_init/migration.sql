-- CreateEnum
CREATE TYPE "DressCondition" AS ENUM ('USED', 'NEW', 'SAMPLE');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'PENDING_PHOTOS', 'MODEL_ASSIGNED', 'IN_SESSION', 'PHOTOGRAPHED', 'EDITED', 'READY_TO_POST', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('SUGGESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('COVER', 'FRONT', 'BACK', 'DETAIL', 'WORN_BY_MODEL', 'VIDEO');

-- CreateEnum
CREATE TYPE "FolderProvider" AS ENUM ('OUTLOOK_ONEDRIVE', 'SHAREPOINT', 'GOOGLE_DRIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "InstagramStatus" AS ENUM ('NOT_PUBLISHED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InstagramPostType" AS ENUM ('POST', 'REEL', 'STORY', 'CAROUSEL');

-- CreateTable
CREATE TABLE "Dress" (
    "id" TEXT NOT NULL,
    "internalCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "size" TEXT NOT NULL,
    "color" TEXT,
    "condition" "DressCondition" NOT NULL DEFAULT 'USED',
    "price" DECIMAL(10,2),
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "workflowStatus" "WorkflowStatus" NOT NULL DEFAULT 'PENDING_PHOTOS',
    "instagramStatus" "InstagramStatus" NOT NULL DEFAULT 'NOT_PUBLISHED',
    "notes" TEXT,
    "receivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "instagramHandle" TEXT,
    "hourlyRate" DECIMAL(10,2),
    "perDressRate" DECIMAL(10,2),
    "availability" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelSize" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DressAssignment" (
    "id" TEXT NOT NULL,
    "dressId" TEXT NOT NULL,
    "modelId" TEXT,
    "assignmentStatus" "AssignmentStatus" NOT NULL DEFAULT 'SUGGESTED',
    "scheduledDate" TIMESTAMP(3),
    "costAgreed" DECIMAL(10,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DressAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DressPhoto" (
    "id" TEXT NOT NULL,
    "dressId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "photoType" "PhotoType" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DressPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DressPhotoFolder" (
    "id" TEXT NOT NULL,
    "dressId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "provider" "FolderProvider" NOT NULL,
    "folderUrl" TEXT NOT NULL,
    "versionLabel" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DressPhotoFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DressInstagramPost" (
    "id" TEXT NOT NULL,
    "dressId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "postType" "InstagramPostType" NOT NULL,
    "instagramUrl" TEXT NOT NULL,
    "instagramShortcode" TEXT,
    "accountName" TEXT,
    "publishedAt" TIMESTAMP(3),
    "captionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DressInstagramPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dress_internalCode_key" ON "Dress"("internalCode");

-- CreateIndex
CREATE INDEX "Dress_name_idx" ON "Dress"("name");

-- CreateIndex
CREATE INDEX "Dress_brand_idx" ON "Dress"("brand");

-- CreateIndex
CREATE INDEX "Dress_size_idx" ON "Dress"("size");

-- CreateIndex
CREATE INDEX "Dress_workflowStatus_idx" ON "Dress"("workflowStatus");

-- CreateIndex
CREATE INDEX "Dress_instagramStatus_idx" ON "Dress"("instagramStatus");

-- CreateIndex
CREATE INDEX "ModelProfile_name_idx" ON "ModelProfile"("name");

-- CreateIndex
CREATE INDEX "ModelSize_size_idx" ON "ModelSize"("size");

-- CreateIndex
CREATE UNIQUE INDEX "ModelSize_modelId_size_key" ON "ModelSize"("modelId", "size");

-- CreateIndex
CREATE INDEX "DressAssignment_dressId_idx" ON "DressAssignment"("dressId");

-- CreateIndex
CREATE INDEX "DressAssignment_modelId_idx" ON "DressAssignment"("modelId");

-- CreateIndex
CREATE INDEX "DressAssignment_assignmentStatus_idx" ON "DressAssignment"("assignmentStatus");

-- CreateIndex
CREATE INDEX "DressPhoto_dressId_photoType_idx" ON "DressPhoto"("dressId", "photoType");

-- CreateIndex
CREATE INDEX "DressPhoto_assignmentId_idx" ON "DressPhoto"("assignmentId");

-- CreateIndex
CREATE INDEX "DressPhotoFolder_dressId_idx" ON "DressPhotoFolder"("dressId");

-- CreateIndex
CREATE INDEX "DressPhotoFolder_assignmentId_idx" ON "DressPhotoFolder"("assignmentId");

-- CreateIndex
CREATE INDEX "DressInstagramPost_dressId_idx" ON "DressInstagramPost"("dressId");

-- CreateIndex
CREATE INDEX "DressInstagramPost_assignmentId_idx" ON "DressInstagramPost"("assignmentId");

-- CreateIndex
CREATE INDEX "DressInstagramPost_publishedAt_idx" ON "DressInstagramPost"("publishedAt");

-- AddForeignKey
ALTER TABLE "ModelSize" ADD CONSTRAINT "ModelSize_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ModelProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DressAssignment" ADD CONSTRAINT "DressAssignment_dressId_fkey" FOREIGN KEY ("dressId") REFERENCES "Dress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DressAssignment" ADD CONSTRAINT "DressAssignment_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ModelProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DressPhoto" ADD CONSTRAINT "DressPhoto_dressId_fkey" FOREIGN KEY ("dressId") REFERENCES "Dress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DressPhoto" ADD CONSTRAINT "DressPhoto_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "DressAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DressPhotoFolder" ADD CONSTRAINT "DressPhotoFolder_dressId_fkey" FOREIGN KEY ("dressId") REFERENCES "Dress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DressPhotoFolder" ADD CONSTRAINT "DressPhotoFolder_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "DressAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DressInstagramPost" ADD CONSTRAINT "DressInstagramPost_dressId_fkey" FOREIGN KEY ("dressId") REFERENCES "Dress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DressInstagramPost" ADD CONSTRAINT "DressInstagramPost_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "DressAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
