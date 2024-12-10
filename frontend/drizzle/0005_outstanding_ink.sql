ALTER TABLE "user_intervention_access_document" DROP CONSTRAINT "user_intervention_access_document_interventionId_interventions_id_fk";
--> statement-breakpoint
ALTER TABLE "user_intervention_access_document" DROP CONSTRAINT "user_intervention_access_document_estateManagerId_estate_managers_id_fk";
--> statement-breakpoint
ALTER TABLE "user_intervention_access_document" DROP CONSTRAINT "user_intervention_access_document_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_intervention_access_document" DROP CONSTRAINT "user_intervention_access_document_changedBy_users_id_fk";
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_intervention_access_document_unique" ON "user_intervention_access_document" USING btree ("interventionId","userId","estateManagerId");