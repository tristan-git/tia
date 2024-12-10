ALTER TABLE "user_intervention_access_document" ADD COLUMN "indexIntervention" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user_intervention_access_document" ADD COLUMN "estateManagerId" varchar(42) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_intervention_access_document" ADD CONSTRAINT "user_intervention_access_document_estateManagerId_estate_managers_id_fk" FOREIGN KEY ("estateManagerId") REFERENCES "public"."estate_managers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
