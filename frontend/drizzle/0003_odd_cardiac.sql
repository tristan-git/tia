CREATE TABLE IF NOT EXISTS "user_intervention_access_document" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_intervention_access_document_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"interventionId" integer NOT NULL,
	"token_id" bigint NOT NULL,
	"userId" integer,
	"changedBy" integer,
	"hasAccess" boolean NOT NULL,
	"changedAtTimestamp" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "user_intervention_access" CASCADE;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_intervention_access_document" ADD CONSTRAINT "user_intervention_access_document_interventionId_interventions_id_fk" FOREIGN KEY ("interventionId") REFERENCES "public"."interventions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_intervention_access_document" ADD CONSTRAINT "user_intervention_access_document_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_intervention_access_document" ADD CONSTRAINT "user_intervention_access_document_changedBy_users_id_fk" FOREIGN KEY ("changedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
