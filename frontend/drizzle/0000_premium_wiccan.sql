
-- DROP TABLE "account_roles" CASCADE;
DROP TABLE "users" CASCADE;


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
	"users" (
		"id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
			SEQUENCE NAME "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START
			WITH
				1 CACHE 1
		),
		"firstName" VARCHAR(255) NOT NULL,
		"lastName" VARCHAR(255) NOT NULL,
		"walletAddress" VARCHAR(42) NOT NULL,
		"accountRoleId" INTEGER NOT NULL
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
 ALTER TABLE "users" ADD CONSTRAINT "users_accountRoleId_account_roles_id_fk" FOREIGN KEY ("accountRoleId") REFERENCES "public"."account_roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;