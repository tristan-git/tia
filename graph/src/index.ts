import { ponder } from "@/generated";
import {
  users,
  estateManagers,
  estateManagersRelations,
  modules,
  modulesRelations,
  interventions,
  interventionsRelations,
  documents,
  documentsRelations,
  interventionAccessChanges,
  interventionAccessChangesRelations,
} from "../ponder.schema";
import { eq, sql } from "@ponder/core";

let registeredModules = new Set<string>();

// Event: FactoryDeployed
ponder.on("EstateManagerFactory:FactoryDeployed", async ({ event }) => {
  console.log("Factory deployed at:", event.log.address);
});

// Event: EstateManagerCreated
ponder.on("EstateManagerFactory:EstateManagerCreated", async ({ event, context }) => {
  const { admin, manager, estateManager, rnbCode } = event.args;
  console.log(`New EstateManager created!`);
  console.log({ admin, manager, estateManager, rnbCode });

  // Enregistrer les utilisateurs (admin et manager)
  await context.db
    .insert(users)
    .values([{ id: admin }, { id: manager }])
    .onConflictDoNothing();

  // Enregistrer le EstateManager
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
  console.log(`Module registered: ${moduleName} at ${moduleAddress}`);

  // Ajouter le module dans la base
  await context.db.insert(modules).values({
    id: moduleAddress,
    name: moduleName,
    estateManagerId: event.log.address,
  });
});

// Event: ModuleUpdated
ponder.on("EstateManager:ModuleUpdated", async ({ event }) => {
  const { moduleName, oldAddress, newAddress } = event.args;
  console.log(`Module updated: ${moduleName}, from ${oldAddress} to ${newAddress}`);
});

// Event: InterventionManagerInitialized
ponder.on("InterventionManager:InterventionManagerInitialized", async ({ event }) => {
  const { estateManagerContract, timestamp } = event.args;
  console.log(`InterventionManager initialized for: ${estateManagerContract} at ${timestamp}`);
});

// Event: InterventionAdded
ponder.on("InterventionManager:InterventionAdded", async ({ event, context }) => {
  const { tokenId, interventionHash, timestamp, from, interventionIndex } = event.args;
  console.log(
    `Intervention added for tokenId: ${tokenId}, hash: ${interventionHash}, timestamp: ${timestamp}, from: ${from} `
  );

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

// Event: DocumentAdded
ponder.on("InterventionManager:DocumentAdded", async ({ event, context }) => {
  const { tokenId, interventionIndex, documentHash, from } = event.args;
  console.log(
    `Document added to intervention: ${interventionIndex}, hash: ${documentHash}, from: ${from}, tokenId: ${tokenId}`
  );

  // // Enregistrer le document lié à l'intervention
  // await context.db.insert(documents).values({
  //   id: documentHash,
  //   interventionId: interventionIndex,
  //   moduleId: event.log.address,
  //   documentHash,
  //   createdBy: from,
  // });

  //  .set({ voteCount: sql`${proposals.voteCount} + 1` })
});

// Event: InterventionValidated
ponder.on("InterventionManager:InterventionValidated", async ({ event, context }) => {
  const { tokenId, interventionIndex, from } = event.args;
  console.log(`Intervention validated for index: ${interventionIndex}, owner: ${from},  tokenId: ${tokenId}`);

  // Mettre à jour l'état de validation de l'intervention
  await context.db.sql.update(interventions).set({ isValidated: true }).where(eq(interventions.id, interventionIndex));
});

// Event: InterventionAccessChanged
ponder.on("InterventionManager:InterventionAccessChanged", async ({ event }) => {
  const { tokenId, interventionIndex, account, from, granted } = event.args;
  console.log(
    `Access ${
      granted ? "granted" : "revoked"
    } for intervention: ${interventionIndex}, account: ${account}, tokenId: ${tokenId},  from: ${from}`
  );
});

// ponder.on("EstateManagerFactory:FactoryDeployed", async ({ event }) => {
//   console.log("000🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
//   const { factoryAddress } = event.args;

//   console.log(factoryAddress);
// });

// ponder.on("EstateManagerFactory:EstateManagerCreated", async ({ event }) => {
//   console.log("000🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
//   const { admin, estateManager, manager, rnbCode } = event.args;

//   console.log({ admin, estateManager, manager, rnbCode });

//   // {
//   //   admin: '0x734cEf8774dEB4FD18DFe57f010b842941012BBB',
//   //   estateManager: '0xAE588422Fac9589f8cb67BB6D9850F33d6E23966',
//   //   manager: '0x0BeC14837e54F84C4815574967F802a8c3a64d7b',
//   //   rnbCode: '0x726e62636f6465636f6465000000000000000000000000000000000000000000'
//   // }
// });

// ponder.on("EstateManager:ModuleRegistered", async ({ event }) => {
//   console.log("1🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
//   const { name, moduleAddress } = event.args;

//   // const nameBytes32 = event.args.name; // Ceci est un `bytes32`
//   // const name = ethers.utils.parseBytes32String(nameBytes32); // Convertir en `string`

//   console.log(`Module registered: ${name} at ${moduleAddress}`);
//   // Module registered: 0x42835906525e4bffdf05466e6cbede9f0520445696482acfb6c196b1b064e3a1 at 0xf80Ee59AabB11638917555E23d7c88Df80026712

//   if (name === "InterventionManager") {
//     console.log(`Registering new InterventionManager: ${moduleAddress}`);
//     registeredModules.add(moduleAddress);
//   } else {
//     console.log(`Other module (${name}) registered.`);
//   }
// });

// // Traiter uniquement les événements provenant des modules enregistrés
// ponder.on("InterventionManager:InterventionAdded", async ({ event }) => {
//   console.log("2🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
//   console.log(event);

//   // args: {
//   //   tokenId: 1n,
//   //   interventionHash: '0x7364667364667364667364660000000000000000000000000000000000000000',
//   //   timestamp: 1732803895n,
//   //   from: '0x734cEf8774dEB4FD18DFe57f010b842941012BBB'
//   // },

//   if (registeredModules.has(event.log.address)) {
//     console.log("Intervention added from a tracked module:", event.args);
//   }
// });

// ponder.on("InterventionManager:DocumentAdded", async ({ event }) => {
//   console.log("3🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
//   console.log("Document added:", event.args);
// });

// // //////////////////////////////////////////////////////////////////////////////
// // DEBUG -> console.log("🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
// // //////////////////////////////////////////////////////////////////////////////

// // TODO -----------
// // p.hex()
// // In most TypeScript programming environments, it's common to use a hexadecimal string representation
// // for byte arrays like Ethereum addresses.This release adds a new column type,
// //   p.hex(), which is a more efficient way to store hexadecimal strings in the database.

// // VotingContractDeployed -----------------------------
// ponder.on("VotingFactory:VotingContractDeployed", async ({ event, context }) => {
//   await context.db.insert(votings).values({
//     id: event.args.contractAddress,
//     owner: event.transaction.from,
//     title: event.args.votingTitle,
//     createdAtBlock: BigInt(event.block.number),
//     createdAtTransactionHash: event.transaction.hash,
//     workflowStatus: 0,
//     createdAtTimestamp: event.block.timestamp,
//   });
// });

// // VoterRegistered ------------------------------------
// ponder.on("Voting:VoterRegistered", async ({ event, context }) => {
//   // console.log("🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
//   // console.log(event.args.voterAddress);
//   await context.db
//     .insert(users)
//     .values({
//       id: event.args.voterAddress,
//     })
//     .onConflictDoNothing();

//   await context.db
//     .insert(userVoters)
//     .values({
//       id: BigInt(event.block.number),
//       userId: event.args.voterAddress,
//       votingId: event.log.address,
//     })
//     .onConflictDoNothing();
// });

// // ProposalRegistered -------------------------------
// ponder.on("Voting:ProposalRegistered", async ({ event, context }) => {
//   await context.db.insert(proposals).values({
//     id: event.args.proposalId,
//     votingId: event.log.address,
//     creatorId: event.transaction.from,
//     voteCount: 0,
//   });
// });

// // Voted --------------------------------------------
// ponder.on("Voting:Voted", async ({ event, context }) => {
//   await context.db.sql
//     .update(proposals)
//     .set({ voteCount: sql`${proposals.voteCount} + 1` })
//     .where(eq(proposals.votingId, event.log.address));

//   await context.db.insert(votes).values({
//     id: event.transaction.hash,
//     voterId: event.args.voter,
//     proposalId: event.args.proposalId,
//     votingId: event.log.address,
//   });
// });

// // WorkflowStatusChange ------------------------------
// ponder.on("Voting:WorkflowStatusChange", async ({ event, context }) => {
//   await context.db.insert(workflowStatusHistory).values({
//     id: BigInt(event.block.number), // Utiliser le numéro de bloc comme ID unique ou un autre identifiant unique si nécessaire
//     votingId: event.log.address,
//     oldStatus: event.args.previousStatus,
//     newStatus: event.args.newStatus,
//     changedAtTimestamp: event.block.timestamp,
//     changedAtBlock: BigInt(event.block.number),
//   });

//   await context.db.sql
//     .update(votings)
//     .set({ workflowStatus: event.args.newStatus })
//     .where(eq(votings.id, event.log.address));
// });

// // WorkflowStatusChange ------------------------------
// ponder.on("Voting:Winner", async ({ event, context }) => {
//   await context.db.sql
//     .update(votings)
//     .set({ winningProposalID: event.args.winningProposalID })
//     .where(eq(votings.id, event.log.address));
// });
