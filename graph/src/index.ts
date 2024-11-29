import { ponder } from "@/generated";
import {
  users,
  estateManagers,
  modules,
  interventions,
  documents,
  interventionAccessChanges,
  userInterventionAccess,
  UserModuleAccess,
} from "../ponder.schema";
import { eq } from "@ponder/core";
import { ethers } from "ethers";

// Liste des noms de modules
const moduleNames = ["ModuleA", "ModuleB", "InterventionManager"];

// Pré-calculer les hashes
const moduleHashes = moduleNames.map((name) => ({
  name,
  hash: ethers.keccak256(ethers.toUtf8Bytes(name)),
}));

console.log("Pré-calcul des hashes des modules:");
console.log(moduleHashes);

// Fonction pour retrouver le texte d'origine
function findOriginalName(hash: string): string {
  return moduleHashes.find((module) => module.hash === hash)?.name || "Unknown";
}

// // //////////////////////////////////////////////////////////////////////////////
// // DEBUG -> console.log("🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
// // //////////////////////////////////////////////////////////////////////////////

// Event: EstateManagerCreated
ponder.on("EstateManagerFactory:EstateManagerCreated", async ({ event, context }) => {
  const { admin, manager, estateManager, rnbCode } = event.args;

  await context.db
    .insert(users)
    .values([{ id: admin }, { id: manager }])
    .onConflictDoNothing();

  await context.db.insert(estateManagers).values({
    id: estateManager,
    adminId: admin,
    managerId: manager,
    rnbCode,
    factoryId: event.log.address,
    createdAtBlock: BigInt(event.block.number),
    createdAtTransactionHash: event.transaction.hash,
    createdAtTimestamp: event.block.timestamp,
  });
});

// Event: ModuleRegistered
ponder.on("EstateManager:ModuleRegistered", async ({ event, context }) => {
  const { moduleName, moduleAddress } = event.args;

  await context.db.insert(modules).values({
    id: moduleAddress,
    moduleName: findOriginalName(moduleName),
    estateManagerId: event.log.address,
  });
});

ponder.on("EstateManager:ModuleRoleAssigned", async ({ event, context }) => {
  const { moduleName, authorizedAddress, tokenId } = event.args;

  await context.db.insert(UserModuleAccess).values({
    id: event.log.address,
    moduleName: findOriginalName(moduleName),
    authorizedAddress,
    tokenId: tokenId,
    assignedAtTimestamp: event.block.timestamp,
    revokedAtTimestamp: null,
  });
});

ponder.on("EstateManager:ModuleRoleRevoked", async ({ event, context }) => {
  const { moduleName, authorizedAddress, tokenId } = event.args;

  await context.db
    .update(UserModuleAccess, {
      id: event.log.address,
      authorizedAddress: authorizedAddress,
      moduleName: findOriginalName(moduleName),
      tokenId,
    })
    .set((row) => ({ revokedAtTimestamp: event.block.timestamp }));
});

// Event: InterventionManagerInitialized
ponder.on("InterventionManager:InterventionManagerInitialized", async ({ event }) => {
  const { estateManagerContract, timestamp } = event.args;
  console.log(`InterventionManager initialized for: ${estateManagerContract} at ${timestamp}`);
});

// Event: InterventionAdded
ponder.on("InterventionManager:InterventionAdded", async ({ event, context }) => {
  const { tokenId, interventionHash, timestamp, from, interventionIndex } = event.args;

  // Enregistrer l'intervention dans la base
  await context.db.insert(interventions).values({
    id: BigInt(interventionIndex),
    moduleId: event.log.address,
    tokenId,
    interventionHash,
    isValidated: false,
    createdAtTimestamp: timestamp,
    createdBy: from,
  });
});

// // Event: DocumentAdded
// ponder.on("InterventionManager:DocumentAdded", async ({ event, context }) => {
//   const { tokenId, interventionIndex, documentHash, from } = event.args;

//   // // Enregistrer le document lié à l'intervention
//   // await context.db.insert(documents).values({
//   //   id: documentHash,
//   //   interventionId: interventionIndex,
//   //   moduleId: event.log.address,
//   //   documentHash,
//   //   createdBy: from,
//   // });

//   //  .set({ voteCount: sql`${proposals.voteCount} + 1` })
// });

// Event: InterventionValidated
ponder.on("InterventionManager:InterventionValidated", async ({ event, context }) => {
  const { tokenId, interventionIndex, from } = event.args;

  await context.db
    .update(interventions, {
      id: interventionIndex,
      moduleId: event.log.address,
      tokenId,
    })
    .set((row) => ({ isValidated: true, validateFrom: from }));
});

// Event: InterventionAccessChanged
ponder.on("InterventionManager:InterventionAccessChanged", async ({ event, context }) => {
  const { tokenId, interventionIndex, account, from, granted } = event.args;

  await context.db.insert(interventionAccessChanges).values({
    id: BigInt(interventionIndex), // Utilisez interventionIndex comme ID
    interventionId: BigInt(interventionIndex), // Associez à l'intervention
    moduleId: event.log.address, // Adresse du module émettant l'événement
    account, // Adresse de l'utilisateur concerné
    hasAccess: granted, // Booléen indiquant si l'accès est accordé ou révoqué
    changedAtTimestamp: BigInt(event.block.timestamp), // Timestamp du changement
    changedBy: from, // Adresse de l'utilisateur ayant effectué le changement
    tokenId,
  });

  await context.db
    .insert(userInterventionAccess)
    .values({
      id: BigInt(interventionIndex),
      interventionId: BigInt(interventionIndex),
      moduleId: event.log.address,
      userId: account,
      hasAccess: granted,
      changedAtTimestamp: BigInt(event.block.timestamp),
      tokenId,
    })
    .onConflictDoUpdate({ hasAccess: granted });
});

// // Event: ModuleUpdated
// ponder.on("EstateManager:ModuleUpdated", async ({ event }) => {
//   const { moduleName, oldAddress, newAddress } = event.args;
//   console.log(`Module updated: ${moduleName}, from ${oldAddress} to ${newAddress}`);
// });

// // Event: FactoryDeployed
// ponder.on("EstateManagerFactory:FactoryDeployed", async ({ event }) => {
//   console.log("Factory deployed at:", event.log.address);
// });
