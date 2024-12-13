DROP TABLE IF EXISTS "public"."users" CASCADE
DROP TABLE IF EXISTS "public"."user_module_access" CASCADE
DROP TABLE IF EXISTS "public"."user_intervention_access" CASCADE
DROP TABLE IF EXISTS "public"."modules" CASCADE
DROP TABLE IF EXISTS "public"."module_intervention_managers" CASCADE
DROP TABLE IF EXISTS "public"."interventions" CASCADE
DROP TABLE IF EXISTS "public"."estate_managers" CASCADE
DROP TABLE IF EXISTS "public"."account_roles" CASCADE
INSERT INTO
	"account_roles" ("name")
VALUES
	('admin'),
	('manager'),
	('prestataire'),
	('viewer');


INSERT INTO
	"users" ("firstName", "lastName", "walletAddress", "accountRoleId")
VALUES
	('Tristan', 'Admin', '0x734cEf8774dEB4FD18DFe57f010b842941012BBB', 1), -- admin
	('Bob', 'Gestionnaire', '0x0BeC14837e54F84C4815574967F802a8c3a64d7b', 2), -- manager
	(
		'Charlie',
		'Prestataire',
		'0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
		3
	), -- prestataire
	('Dave', 'Lecteur', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 4) -- viewer
	ON CONFLICT ("walletAddress")
DO NOTHING;


CREATE TABLE IF NOT EXISTS
	"account_roles" (
		"id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
			SEQUENCE NAME "account_roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START
			WITH
				1 CACHE 1
		),
		"name" VARCHAR(50) NOT NULL
	);


INSERT INTO
	account_roles (NAME)
VALUES
	('admin'),
	('manager'),
	('prestataire'),
	('viewer');


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


--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_accountRoleId_account_roles_id_fk" FOREIGN KEY ("accountRoleId") REFERENCES "public"."account_roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;