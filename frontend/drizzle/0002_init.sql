CREATE TABLE IF NOT EXISTS "deployments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_hash" text NOT NULL
);
