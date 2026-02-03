-- CreateTable
CREATE TABLE "Concept" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "prereqIds" TEXT NOT NULL,
    "resources" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "requiredConceptIds" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LessonConcept" (
    "lessonId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,

    PRIMARY KEY ("lessonId", "conceptId"),
    CONSTRAINT "LessonConcept_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LessonConcept_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Instance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentMdx" TEXT NOT NULL,
    "imageBase64" TEXT,
    "quiz" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Instance_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Instance_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Podcast" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "scriptMdx" TEXT NOT NULL,
    "audioBase64" TEXT,
    "chapters" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Podcast_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Export" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "htmlBlob" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Export_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "localKey" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scores" TEXT NOT NULL,
    "weakConcepts" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Concept_domain_idx" ON "Concept"("domain");

-- CreateIndex
CREATE INDEX "Concept_level_idx" ON "Concept"("level");

-- CreateIndex
CREATE INDEX "Instance_lessonId_idx" ON "Instance"("lessonId");

-- CreateIndex
CREATE INDEX "Instance_conceptId_idx" ON "Instance"("conceptId");

-- CreateIndex
CREATE INDEX "Podcast_lessonId_idx" ON "Podcast"("lessonId");

-- CreateIndex
CREATE INDEX "Export_lessonId_idx" ON "Export"("lessonId");

-- CreateIndex
CREATE INDEX "Progress_localKey_idx" ON "Progress"("localKey");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_localKey_lessonId_key" ON "Progress"("localKey", "lessonId");
