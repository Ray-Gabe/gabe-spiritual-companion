-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "current_level" TEXT NOT NULL DEFAULT 'Seedling',
    "streak_days" INTEGER NOT NULL DEFAULT 0,
    "last_activity" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_games" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "played_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xp_earned" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_questions" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "question_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question_data" JSONB NOT NULL,
    "ai_source" TEXT NOT NULL DEFAULT 'gemini',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "duration" INTEGER,
    "final_score" INTEGER NOT NULL DEFAULT 0,
    "answers" JSONB,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "daily_games_user_id_game_id_played_date_key" ON "public"."daily_games"("user_id", "game_id", "played_date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_questions_game_id_question_date_key" ON "public"."daily_questions"("game_id", "question_date");

-- AddForeignKey
ALTER TABLE "public"."daily_games" ADD CONSTRAINT "daily_games_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
