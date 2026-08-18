-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "target" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "flow" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "verbs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "verb" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "v1" TEXT NOT NULL,
    "v2" TEXT NOT NULL,
    "v3" TEXT NOT NULL,
    "v4" TEXT NOT NULL,
    "v5" TEXT NOT NULL,
    "hindiMeaning" TEXT NOT NULL,
    "hindiTransliteration" TEXT NOT NULL,
    "phoneticEnglish" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "verb_examples" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "verbId" TEXT NOT NULL,
    "sentence" TEXT NOT NULL,
    "tense" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "highlightWord" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "verb_examples_verbId_fkey" FOREIGN KEY ("verbId") REFERENCES "verbs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verb_usage_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "verbId" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "usageContext" TEXT NOT NULL,
    "highlighted" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "verb_usage_rules_verbId_fkey" FOREIGN KEY ("verbId") REFERENCES "verbs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "otp_verifications_target_flow_idx" ON "otp_verifications"("target", "flow");

-- CreateIndex
CREATE INDEX "verb_examples_verbId_idx" ON "verb_examples"("verbId");

-- CreateIndex
CREATE INDEX "verb_usage_rules_verbId_idx" ON "verb_usage_rules"("verbId");
