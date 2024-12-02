CREATE TABLE IF NOT EXISTS
	"account_roles" (
		"id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
			SEQUENCE NAME "account_roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START
			WITH
				1 CACHE 1
		),
		"name" VARCHAR(50) NOT NULL
	);


--> statement-breakpoint
CREATE TABLE IF NOT EXISTS
	"estate_managers" (
		"id" VARCHAR(42) PRIMARY KEY NOT NULL,
		"adminId" INTEGER NOT NULL,
		"managerId" INTEGER NOT NULL,
		"rnbCode" VARCHAR(255) NOT NULL,
		"factoryId" VARCHAR(42) NOT NULL,
		"created_at_block" BIGINT NOT NULL,
		"createdAtTransactionHash" VARCHAR(255) NOT NULL,
		"createdAtTimestamp" TIMESTAMP NOT NULL
	);


--> statement-breakpoint
CREATE TABLE IF NOT EXISTS
	"interventions" (
		"id" BIGINT PRIMARY KEY NOT NULL,
		"moduleId" VARCHAR(42) NOT NULL,
		"token_id" BIGINT NOT NULL,
		"interventionHash" VARCHAR(255) NOT NULL,
		"isValidated" BOOLEAN DEFAULT FALSE,
		"validateFrom" VARCHAR(42),
		"createdAtTimestamp" TIMESTAMP NOT NULL,
		"createdBy" INTEGER NOT NULL
	);


--> statement-breakpoint
CREATE TABLE IF NOT EXISTS
	"module_intervention_managers" (
		"id" VARCHAR(42) PRIMARY KEY NOT NULL,
		"estateManagerId" VARCHAR(42) NOT NULL,
		"admin" VARCHAR(42) NOT NULL,
		"initializedAtTimestamp" TIMESTAMP NOT NULL,
		"initialized_at_block" BIGINT NOT NULL,
		"initializedAtTransactionHash" VARCHAR(255) NOT NULL
	);


--> statement-breakpoint
CREATE TABLE IF NOT EXISTS
	"modules" (
		"id" VARCHAR(42) PRIMARY KEY NOT NULL,
		"moduleName" VARCHAR(255) NOT NULL,
		"estateManagerId" VARCHAR(42) NOT NULL
	);


--> statement-breakpoint
CREATE TABLE IF NOT EXISTS
	"user_intervention_access" (
		"id" BIGINT PRIMARY KEY NOT NULL,
		"intervention_id" BIGINT NOT NULL,
		"moduleId" VARCHAR(42) NOT NULL,
		"token_id" BIGINT NOT NULL,
		"userId" INTEGER NOT NULL,
		"hasAccess" BOOLEAN NOT NULL,
		"changedAtTimestamp" TIMESTAMP NOT NULL
	);


--> statement-breakpoint
CREATE TABLE IF NOT EXISTS
	"user_module_access" (
		"id" VARCHAR(42) PRIMARY KEY NOT NULL,
		"moduleName" VARCHAR(255) NOT NULL,
		"authorizedAddress" VARCHAR(42) NOT NULL,
		"token_id" BIGINT NOT NULL,
		"assignedAtTimestamp" TIMESTAMP NOT NULL,
		"revokedAtTimestamp" TIMESTAMP
	);


--> statement-breakpoint
CREATE TABLE IF NOT EXISTS
	"users" (
		"id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
			SEQUENCE NAME "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START
			WITH
				1 CACHE 1
		),
		"firstName" VARCHAR(255) NOT NULL,
		"lastName" VARCHAR(255) NOT NULL,
		"walletAddress" VARCHAR(42) NOT NULL,
		"accountRoleId" INTEGER NOT NULL,
		CONSTRAINT "users_walletAddress_unique" UNIQUE ("walletAddress")
	);


INSERT INTO
	account_roles (NAME)
VALUES
	('admin'),
	('manager'),
	('prestataire'),
	('viewer');


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "estate_managers" ADD CONSTRAINT "estate_managers_adminId_users_id_fk" FOREIGN KEY ("adminId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "estate_managers" ADD CONSTRAINT "estate_managers_managerId_users_id_fk" FOREIGN KEY ("managerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interventions" ADD CONSTRAINT "interventions_moduleId_modules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interventions" ADD CONSTRAINT "interventions_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module_intervention_managers" ADD CONSTRAINT "module_intervention_managers_estateManagerId_estate_managers_id_fk" FOREIGN KEY ("estateManagerId") REFERENCES "public"."estate_managers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "modules" ADD CONSTRAINT "modules_estateManagerId_estate_managers_id_fk" FOREIGN KEY ("estateManagerId") REFERENCES "public"."estate_managers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_intervention_access" ADD CONSTRAINT "user_intervention_access_intervention_id_interventions_id_fk" FOREIGN KEY ("intervention_id") REFERENCES "public"."interventions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_intervention_access" ADD CONSTRAINT "user_intervention_access_moduleId_modules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_intervention_access" ADD CONSTRAINT "user_intervention_access_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_accountRoleId_account_roles_id_fk" FOREIGN KEY ("accountRoleId") REFERENCES "public"."account_roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;