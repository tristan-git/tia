import { ponder } from "@/generated";
import { proposals, users, userVoters, votes, votings, workflowStatusHistory } from "../ponder.schema";
import { eq, sql } from "@ponder/core";

let registeredModules = new Set<string>();

ponder.on("EstateManagerFactory:FactoryDeployed", async ({ event }) => {
  console.log("000🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
  const { factoryAddress } = event.args;

  console.log(factoryAddress);
});

ponder.on("EstateManagerFactory:EstateManagerCreated", async ({ event }) => {
  console.log("000🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
  const { admin, estateManager, manager, rnbCode } = event.args;

  console.log({ admin, estateManager, manager, rnbCode });

  // {
  //   admin: '0x734cEf8774dEB4FD18DFe57f010b842941012BBB',
  //   estateManager: '0xAE588422Fac9589f8cb67BB6D9850F33d6E23966',
  //   manager: '0x0BeC14837e54F84C4815574967F802a8c3a64d7b',
  //   rnbCode: '0x726e62636f6465636f6465000000000000000000000000000000000000000000'
  // }
});

ponder.on("EstateManager:ModuleRegistered", async ({ event }) => {
  console.log("1🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
  const { name, moduleAddress } = event.args;

  // const nameBytes32 = event.args.name; // Ceci est un `bytes32`
  // const name = ethers.utils.parseBytes32String(nameBytes32); // Convertir en `string`

  console.log(`Module registered: ${name} at ${moduleAddress}`);

  if (name === "InterventionManager") {
    console.log(`Registering new InterventionManager: ${moduleAddress}`);
    registeredModules.add(moduleAddress);
  } else {
    console.log(`Other module (${name}) registered.`);
  }
});

// Traiter uniquement les événements provenant des modules enregistrés
ponder.on("InterventionManager:InterventionAdded", async ({ event }) => {
  console.log("2🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
  if (registeredModules.has(event.log.address)) {
    console.log("Intervention added from a tracked module:", event.args);
  }
});

ponder.on("InterventionManager:DocumentAdded", async ({ event }) => {
  console.log("3🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡");
  console.log("Document added:", event.args);
});

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
