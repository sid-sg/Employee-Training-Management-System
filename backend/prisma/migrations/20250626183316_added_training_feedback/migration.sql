-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "totalParticipants" INTEGER DEFAULT 0,
ADD COLUMN     "totalRating" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "TrainingFeedback" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "department" TEXT,
    "modeOfAttendance" TEXT NOT NULL,
    "durationRating" INTEGER NOT NULL,
    "paceRating" INTEGER NOT NULL,
    "contentRating" INTEGER NOT NULL,
    "relevanceRating" INTEGER NOT NULL,
    "usefulnessRating" INTEGER NOT NULL,
    "confidenceRating" INTEGER NOT NULL,
    "trainerKnowledgeRating" INTEGER NOT NULL,
    "trainerExplanationRating" INTEGER NOT NULL,
    "trainerAnswersRating" INTEGER NOT NULL,
    "trainerUtilityRating" INTEGER NOT NULL,
    "trainerInformationRating" INTEGER NOT NULL,
    "trainingLikes" TEXT,
    "trainingImprovements" TEXT,
    "trainerStrengths" TEXT,
    "trainerRecommendations" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingFeedback_employeeId_trainingId_key" ON "TrainingFeedback"("employeeId", "trainingId");

-- AddForeignKey
ALTER TABLE "TrainingFeedback" ADD CONSTRAINT "TrainingFeedback_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingFeedback" ADD CONSTRAINT "TrainingFeedback_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
