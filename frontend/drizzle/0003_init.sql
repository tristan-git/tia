ALTER TABLE "deployments" ADD COLUMN "block_number" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "deployments" ADD COLUMN "contract_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "deployments" ADD COLUMN "cumulative_gas_used" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "deployments" ADD COLUMN "effective_gas_price" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "deployments" ADD COLUMN "from_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "deployments" ADD COLUMN "gas_used" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "deployments" ADD COLUMN "deployment_date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_contract_address_unique" UNIQUE("contract_address");