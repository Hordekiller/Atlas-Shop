ALTER TABLE "ShopSettings"
ADD COLUMN "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "maintenanceMessage" TEXT,
ADD COLUMN "cacheEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "robotsTxt" TEXT;

ALTER TABLE "Page"
ADD COLUMN "customCss" TEXT;
