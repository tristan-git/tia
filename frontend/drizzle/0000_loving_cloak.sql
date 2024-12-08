CREATE TABLE IF NOT EXISTS "account_roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "account_roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "estate_managers" (
	"id" varchar(42) PRIMARY KEY NOT NULL,
	"adminId" integer NOT NULL,
	"managerId" integer NOT NULL,
	"rnbCode" varchar(255) NOT NULL,
	"factoryId" varchar(42) NOT NULL,
	"created_at_block" bigint NOT NULL,
	"createdAtTransactionHash" varchar(255) NOT NULL,
	"createdAtTimestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interventions" (
	"id" bigint PRIMARY KEY NOT NULL,
	"moduleId" varchar(42) NOT NULL,
	"token_id" bigint NOT NULL,
	"interventionHash" varchar(255) NOT NULL,
	"isValidated" boolean DEFAULT false,
	"validateFrom" varchar(42),
	"createdAtTimestamp" timestamp NOT NULL,
	"createdBy" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "minted_nfts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "minted_nfts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"token_id" bigint NOT NULL,
	"estateManagerId" varchar(42) NOT NULL,
	"ownerAddress" integer NOT NULL,
	"metadata_url" text NOT NULL,
	"createdAtTimestamp" timestamp NOT NULL,
	"mintedBy" integer NOT NULL,
	"transactionHash" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "module_intervention_managers" (
	"id" varchar(42) PRIMARY KEY NOT NULL,
	"estateManagerId" varchar(42) NOT NULL,
	"admin" varchar(42) NOT NULL,
	"initializedAtTimestamp" timestamp NOT NULL,
	"initialized_at_block" bigint NOT NULL,
	"initializedAtTransactionHash" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modules" (
	"id" varchar(42) PRIMARY KEY NOT NULL,
	"moduleName" varchar(255) NOT NULL,
	"estateManagerId" varchar(42) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_intervention_access" (
	"id" bigint PRIMARY KEY NOT NULL,
	"intervention_id" bigint NOT NULL,
	"moduleId" varchar(42) NOT NULL,
	"token_id" bigint NOT NULL,
	"userId" integer NOT NULL,
	"hasAccess" boolean NOT NULL,
	"changedAtTimestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_module_access" (
	"id" varchar(42) PRIMARY KEY NOT NULL,
	"moduleName" varchar(255) NOT NULL,
	"authorizedAddress" varchar(42) NOT NULL,
	"token_id" bigint NOT NULL,
	"assignedAtTimestamp" timestamp NOT NULL,
	"revokedAtTimestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"walletAddress" varchar(42) NOT NULL,
	"accountRoleId" integer NOT NULL,
	CONSTRAINT "users_walletAddress_unique" UNIQUE("walletAddress")
);
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
 ALTER TABLE "minted_nfts" ADD CONSTRAINT "minted_nfts_estateManagerId_estate_managers_id_fk" FOREIGN KEY ("estateManagerId") REFERENCES "public"."estate_managers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "minted_nfts" ADD CONSTRAINT "minted_nfts_ownerAddress_users_id_fk" FOREIGN KEY ("ownerAddress") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "minted_nfts" ADD CONSTRAINT "minted_nfts_mintedBy_users_id_fk" FOREIGN KEY ("mintedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
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
