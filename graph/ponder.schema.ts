import { onchainTable, primaryKey, relations } from "@ponder/core";

// Table des utilisateurs
export const users = onchainTable("users", (t) => ({
  id: t.hex().primaryKey(), // Adresse de l'utilisateur comme clé primaire
}));

// Table des votings
export const votings = onchainTable("votings", (t) => ({
  id: t.hex().primaryKey(), // Adresse du contrat de vote comme clé primaire
  title: t.text().notNull(), // Titre du voting
  owner: t.hex().notNull(), // address owner du contrat
  workflowStatus: t.integer().notNull(), // État du workflow
  winningProposalID: t.bigint(), // ID de la proposition gagnante
  createdAtBlock: t.bigint().notNull(), // Bloc de création
  createdAtTransactionHash: t.text().notNull(), // Hash de la transaction
  createdAtTimestamp: t.bigint().notNull(),
}));

// Relations pour la table votings
export const votingRelations = relations(votings, ({ many }) => ({
  proposals: many(proposals),
  userVoters: many(userVoters),
  votes: many(votes),
}));

// Table des propositions
export const proposals = onchainTable(
  "proposals",
  (t) => ({
    id: t.bigint().notNull(),
    votingId: t.hex().notNull(),
    creatorId: t.hex().notNull(),
    voteCount: t.integer().default(0),
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.votingId] }) })
);

// Relations pour la table proposals
export const proposalsRelations = relations(proposals, ({ one, many }) => ({
  voting: one(votings, { fields: [proposals.votingId], references: [votings.id] }),
  creator: one(users, { fields: [proposals.creatorId], references: [users.id] }),
  votes: many(votes),
}));

// Table des votes
export const votes = onchainTable("votes", (t) => ({
  id: t.hex().primaryKey(),
  voterId: t.hex().notNull(),
  proposalId: t.bigint().notNull(),
  votingId: t.hex().notNull(),
}));

// Relations pour la table votes
export const votesRelations = relations(votes, ({ one }) => ({
  voter: one(users, { fields: [votes.voterId], references: [users.id] }),
  proposal: one(proposals, { fields: [votes.proposalId], references: [proposals.id] }),
  voting: one(votings, { fields: [votes.votingId], references: [votings.id] }),
}));

// Table de jointure pour relier les utilisateurs aux votings
export const userVoters = onchainTable(
  "user_votings",
  (t) => ({
    id: t.bigint().notNull(),
    userId: t.hex().notNull(),
    votingId: t.hex().notNull(),
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.userId, table.votingId] }) })
);

// Relations pour la table userVoters
export const userVotersRelations = relations(userVoters, ({ one }) => ({
  user: one(users, { fields: [userVoters.userId], references: [users.id] }),
  voting: one(votings, { fields: [userVoters.votingId], references: [votings.id] }),
}));

// Table pour l'historique des changements de WorkflowStatus
export const workflowStatusHistory = onchainTable("workflow_status_history", (t) => ({
  id: t.bigint().primaryKey(), // ID unique pour l'entrée de l'historique
  votingId: t.hex().notNull(), // Adresse du contrat de vote
  oldStatus: t.integer().notNull(), // Ancien état du workflow
  newStatus: t.integer().notNull(), // Nouvel état du workflow
  changedAtTimestamp: t.bigint().notNull(), // Timestamp du changement
  changedAtBlock: t.bigint().notNull(), // Bloc du changement
}));

// Relations pour la table workflowStatusHistory
export const workflowStatusHistoryRelations = relations(workflowStatusHistory, ({ one }) => ({
  voting: one(votings, { fields: [workflowStatusHistory.votingId], references: [votings.id] }),
}));
