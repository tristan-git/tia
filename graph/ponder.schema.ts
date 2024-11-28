import { onchainTable, primaryKey, relations } from "@ponder/core";

// Table des utilisateurs (admin/manager)
export const users = onchainTable("users", (t) => ({
  id: t.hex().primaryKey(), // Adresse de l'utilisateur comme clé primaire
}));

export const usersRelations = relations(users, ({ many }) => ({
  interventions: many(interventions),
  userInterventionAccess: many(userInterventionAccess),
  // documents: many(documents),
  // accessChanges: many(interventionAccessChanges),
}));

// Table des EstateManagers
export const estateManagers = onchainTable("estateManagers", (t) => ({
  id: t.hex().primaryKey(), // Adresse du contrat EstateManager
  adminId: t.hex().notNull(), // Adresse de l'admin
  managerId: t.hex().notNull(), // Adresse du manager
  rnbCode: t.text().notNull(), // Code RNB
  factoryId: t.hex().notNull(), // Adresse de la factory
  createdAtBlock: t.bigint().notNull(), // Bloc de création
  createdAtTransactionHash: t.text().notNull(), // Hash de la transaction
  createdAtTimestamp: t.bigint().notNull(), // Timestamp de création
}));

// Relations pour EstateManagers
export const estateManagersRelations = relations(estateManagers, ({ many, one }) => ({
  admin: one(users, { fields: [estateManagers.adminId], references: [users.id] }),
  manager: one(users, { fields: [estateManagers.managerId], references: [users.id] }),
  modules: many(modules), // Relation vers les modules
}));

// Table des modules enregistrés dans EstateManagers
export const modules = onchainTable(
  "modules",
  (t) => ({
    id: t.hex(), // Adresse du module
    name: t.text().notNull(), // Nom du module
    estateManagerId: t.hex().notNull(), // Adresse du EstateManager
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.estateManagerId] }) })
);

// Relations pour les modules
export const modulesRelations = relations(modules, ({ one, many }) => ({
  estateManager: one(estateManagers, { fields: [modules.estateManagerId], references: [estateManagers.id] }),
  interventions: many(interventions),
}));

// Table des interventions dans les modules
export const interventions = onchainTable(
  "interventions",
  (t) => ({
    id: t.bigint(), // Identifiant unique de l'intervention
    moduleId: t.hex().notNull(), // Adresse du module
    tokenId: t.bigint().notNull(), // Identifiant du token concerné
    interventionHash: t.text().notNull(), // Hash de l'intervention
    isValidated: t.boolean().default(false), // Validation de l'intervention
    createdAtTimestamp: t.bigint().notNull(), // Timestamp de création
    createdBy: t.hex().notNull(), // Adresse de l'utilisateur qui a créé l'intervention
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.moduleId] }) })
);

// Relations pour les interventions
export const interventionsRelations = relations(interventions, ({ one, many }) => ({
  module: one(modules, { fields: [interventions.moduleId], references: [modules.id] }),
  documents: many(documents),
  creator: one(users, { fields: [interventions.createdBy], references: [users.id] }),
}));

// Table des documents liés aux interventions
export const documents = onchainTable(
  "documents",
  (t) => ({
    id: t.bigint(), // Identifiant unique du document
    interventionId: t.bigint().notNull(), // Identifiant de l'intervention
    moduleId: t.hex().notNull(), // Adresse du module
    documentHash: t.text().notNull(), // Hash du document
    createdBy: t.hex().notNull(), // Adresse de l'utilisateur qui a ajouté le document
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.interventionId, table.moduleId] }) })
);

// Relations pour les documents
export const documentsRelations = relations(documents, ({ one }) => ({
  intervention: one(interventions, { fields: [documents.interventionId], references: [interventions.id] }),
}));

export const userInterventionAccess = onchainTable(
  "userInterventionAccess",
  (t) => ({
    id: t.bigint(),
    interventionId: t.bigint().notNull(), // Identifiant de l'intervention
    moduleId: t.hex().notNull(), // Adresse du module
    userId: t.hex().notNull(), // Adresse de l'utilisateur ayant accès
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.interventionId, table.userId] }) })
);

export const userInterventionAccessRelations = relations(userInterventionAccess, ({ one }) => ({
  user: one(users, { fields: [userInterventionAccess.userId], references: [users.id] }), // Relation avec les utilisateurs
}));

// Table pour les changements d'accès aux interventions
export const interventionAccessChanges = onchainTable("interventionAccessChanges", (t) => ({
  id: t.bigint().primaryKey(), // Identifiant unique du changement d'accès
  interventionId: t.bigint().notNull(), // Identifiant de l'intervention
  moduleId: t.hex().notNull(), // Adresse du module
  account: t.hex().notNull(), // Adresse de l'utilisateur concerné
  granted: t.boolean().notNull(), // Indique si l'accès est accordé ou révoqué
  changedAtTimestamp: t.bigint().notNull(), // Timestamp du changement
  changedBy: t.hex().notNull(), // Adresse de l'utilisateur qui a effectué le changement
}));

// Relations pour les changements d'accès aux interventions
export const interventionAccessChangesRelations = relations(interventionAccessChanges, ({ one }) => ({
  intervention: one(interventions, {
    fields: [interventionAccessChanges.interventionId],
    references: [interventions.id],
  }),
}));

// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////

// // Table des utilisateurs
// export const users = onchainTable("users", (t) => ({
//   id: t.hex().primaryKey(), // Adresse de l'utilisateur comme clé primaire
// }));

// // Table des votings
// export const votings = onchainTable("votings", (t) => ({
//   id: t.hex().primaryKey(), // Adresse du contrat de vote comme clé primaire
//   title: t.text().notNull(), // Titre du voting
//   owner: t.hex().notNull(), // address owner du contrat
//   workflowStatus: t.integer().notNull(), // État du workflow
//   winningProposalID: t.bigint(), // ID de la proposition gagnante
//   createdAtBlock: t.bigint().notNull(), // Bloc de création
//   createdAtTransactionHash: t.text().notNull(), // Hash de la transaction
//   createdAtTimestamp: t.bigint().notNull(),
// }));

// // Relations pour la table votings
// export const votingRelations = relations(votings, ({ many }) => ({
//   proposals: many(proposals),
//   userVoters: many(userVoters),
//   votes: many(votes),
// }));

// // Table des propositions
// export const proposals = onchainTable(
//   "proposals",
//   (t) => ({
//     id: t.bigint().notNull(),
//     votingId: t.hex().notNull(),
//     creatorId: t.hex().notNull(),
//     voteCount: t.integer().default(0),
//   }),
//   (table) => ({ pk: primaryKey({ columns: [table.id, table.votingId] }) })
// );

// // Relations pour la table proposals
// export const proposalsRelations = relations(proposals, ({ one, many }) => ({
//   voting: one(votings, { fields: [proposals.votingId], references: [votings.id] }),
//   creator: one(users, { fields: [proposals.creatorId], references: [users.id] }),
//   votes: many(votes),
// }));

// // Table des votes
// export const votes = onchainTable("votes", (t) => ({
//   id: t.hex().primaryKey(),
//   voterId: t.hex().notNull(),
//   proposalId: t.bigint().notNull(),
//   votingId: t.hex().notNull(),
// }));

// // Relations pour la table votes
// export const votesRelations = relations(votes, ({ one }) => ({
//   voter: one(users, { fields: [votes.voterId], references: [users.id] }),
//   proposal: one(proposals, { fields: [votes.proposalId], references: [proposals.id] }),
//   voting: one(votings, { fields: [votes.votingId], references: [votings.id] }),
// }));

// // Table de jointure pour relier les utilisateurs aux votings
// export const userVoters = onchainTable(
//   "user_votings",
//   (t) => ({
//     id: t.bigint().notNull(),
//     userId: t.hex().notNull(),
//     votingId: t.hex().notNull(),
//   }),
//   (table) => ({ pk: primaryKey({ columns: [table.id, table.userId, table.votingId] }) })
// );

// // Relations pour la table userVoters
// export const userVotersRelations = relations(userVoters, ({ one }) => ({
//   user: one(users, { fields: [userVoters.userId], references: [users.id] }),
//   voting: one(votings, { fields: [userVoters.votingId], references: [votings.id] }),
// }));

// // Table pour l'historique des changements de WorkflowStatus
// export const workflowStatusHistory = onchainTable("workflow_status_history", (t) => ({
//   id: t.bigint().primaryKey(), // ID unique pour l'entrée de l'historique
//   votingId: t.hex().notNull(), // Adresse du contrat de vote
//   oldStatus: t.integer().notNull(), // Ancien état du workflow
//   newStatus: t.integer().notNull(), // Nouvel état du workflow
//   changedAtTimestamp: t.bigint().notNull(), // Timestamp du changement
//   changedAtBlock: t.bigint().notNull(), // Bloc du changement
// }));

// // Relations pour la table workflowStatusHistory
// export const workflowStatusHistoryRelations = relations(workflowStatusHistory, ({ one }) => ({
//   voting: one(votings, { fields: [workflowStatusHistory.votingId], references: [votings.id] }),
// }));
