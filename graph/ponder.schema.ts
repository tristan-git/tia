import { onchainTable, primaryKey, relations } from "@ponder/core";

// Table des utilisateurs (admin/manager)
export const users = onchainTable("users", (t) => ({
  id: t.hex().primaryKey(), // Adresse de l'utilisateur comme clé primaire
}));

export const usersRelations = relations(users, ({ many }) => ({
  interventions: many(interventions),
  userInterventionAccess: many(userInterventionAccess),
  userModuleAccess: many(userModuleAccess),
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
  modules: many(modules),
  moduleInterventionManagers: one(moduleInterventionManagers, {
    fields: [estateManagers.id],
    references: [moduleInterventionManagers.estateManagerId],
  }),
}));

// Table des modules enregistrés dans EstateManagers
export const modules = onchainTable(
  "modules",
  (t) => ({
    id: t.hex(), // Adresse du module
    moduleName: t.text().notNull(), // Nom du module
    estateManagerId: t.hex().notNull(), // Adresse du EstateManager
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.estateManagerId] }) })
);

// Relations pour les modules
export const modulesRelations = relations(modules, ({ one, many }) => ({
  estateManager: one(estateManagers, { fields: [modules.estateManagerId], references: [estateManagers.id] }),
  interventions: many(interventions),
}));

export const moduleInterventionManagers = onchainTable("moduleInterventionManagers", (t) => ({
  id: t.hex().primaryKey(), // Adresse du contrat InterventionManager
  estateManagerId: t.hex().notNull(), // Adresse du contrat EstateManager parent
  admin: t.hex().notNull(), // Adresse du manager
  initializedAtTimestamp: t.bigint().notNull(), // Timestamp de l'initialisation
  initializedAtBlock: t.bigint().notNull(), // Bloc de l'initialisation
  initializedAtTransactionHash: t.text().notNull(), // Transaction de l'initialisation
}));

export const moduleInterventionManagersRelations = relations(moduleInterventionManagers, ({ one }) => ({
  estateManager: one(estateManagers, {
    fields: [moduleInterventionManagers.estateManagerId],
    references: [estateManagers.id],
  }),
}));

// // Table des interventions dans les modules
// export const interventions = onchainTable(
//   "interventions",
//   (t) => ({
//     id: t.bigint(), // Identifiant unique de l'intervention
//     moduleId: t.hex().notNull(), // Adresse du module
//     tokenId: t.bigint().notNull(), // Identifiant du token concerné
//     interventionHash: t.text().notNull(), // Hash de l'intervention
//     isValidated: t.boolean().default(false), // Validation de l'intervention
//     validateFrom: t.hex(), // address de qui valide intervention
//     createdAtTimestamp: t.bigint().notNull(), // Timestamp de création
//     createdBy: t.hex().notNull(), // Adresse de l'utilisateur qui a créé l'intervention
//   }),
//   (table) => ({ pk: primaryKey({ columns: [table.id, table.moduleId, table.tokenId] }) })
// );

export const interventions = onchainTable(
  "interventions",
  (t) => ({
    id: t.bigint(),
    moduleId: t.hex().notNull(),
    tokenId: t.bigint().notNull(),
    interventionHash: t.text(), // Peut être omis si non utilisé dans le contrat
    title: t.text().notNull(), // Ajout du titre de l'intervention
    isValidated: t.boolean().default(false),
    validateFrom: t.hex(),
    createdAtTimestamp: t.bigint().notNull(),
    createdBy: t.hex().notNull(),
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.moduleId, table.tokenId] }) })
);

// // Relations pour les interventions
// export const interventionsRelations = relations(interventions, ({ one, many }) => ({
//   module: one(modules, { fields: [interventions.moduleId], references: [modules.id] }),
//   documents: many(documents),
//   creator: one(users, { fields: [interventions.createdBy], references: [users.id] }),
// }));

export const interventionsRelations = relations(interventions, ({ one, many }) => ({
  module: one(modules, { fields: [interventions.moduleId], references: [modules.id] }),
  documents: many(documents),
  creator: one(users, { fields: [interventions.createdBy], references: [users.id] }),
  validator: one(users, { fields: [interventions.validateFrom], references: [users.id] }), // Nouveau champ
}));

// // Table des documents liés aux interventions
// export const documents = onchainTable(
//   "documents",
//   (t) => ({
//     id: t.bigint(), // Identifiant unique du document
//     interventionId: t.bigint().notNull(), // Identifiant de l'intervention
//     moduleId: t.hex().notNull(), // Adresse du module
//     documentHash: t.text().notNull(), // Hash du document
//     createdBy: t.hex().notNull(), // Adresse de l'utilisateur qui a ajouté le document
//   }),
//   (table) => ({ pk: primaryKey({ columns: [table.id, table.interventionId, table.moduleId] }) })
// );

export const documents = onchainTable(
  "documents",
  (t) => ({
    id: t.bigint(),
    interventionId: t.bigint().notNull(),
    moduleId: t.hex().notNull(),
    documentHash: t.text().notNull(),
    title: t.text().notNull(), // Ajout du titre du document
    createdBy: t.hex().notNull(),
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.interventionId, table.moduleId] }) })
);

// Relations pour les documents
// export const documentsRelations = relations(documents, ({ one }) => ({
//   intervention: one(interventions, { fields: [documents.interventionId], references: [interventions.id] }),
// }));

export const documentsRelations = relations(documents, ({ one }) => ({
  intervention: one(interventions, { fields: [documents.interventionId], references: [interventions.id] }),
  creator: one(users, { fields: [documents.createdBy], references: [users.id] }),
}));

export const userInterventionAccess = onchainTable(
  "userInterventionAccess",
  (t) => ({
    id: t.bigint(),
    interventionId: t.bigint().notNull(), // Identifiant de l'intervention
    moduleId: t.hex().notNull(), // Adresse du module
    tokenId: t.bigint().notNull(),
    userId: t.hex().notNull(), // Adresse de l'utilisateur ayant accès
    hasAccess: t.boolean().notNull(),
    changedAtTimestamp: t.bigint().notNull(), // Timestamp du changement
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.interventionId, table.userId, table.tokenId] }) })
);

export const userInterventionAccessRelations = relations(userInterventionAccess, ({ one }) => ({
  user: one(users, { fields: [userInterventionAccess.userId], references: [users.id] }),
}));

// Table pour les changements d'accès aux interventions
export const interventionAccessChanges = onchainTable(
  "interventionAccessChanges",
  (t) => ({
    id: t.bigint(), // Identifiant unique du changement d'accès
    interventionId: t.bigint().notNull(), // Identifiant de l'intervention
    moduleId: t.hex().notNull(), // Adresse du module
    tokenId: t.bigint().notNull(),
    account: t.hex().notNull(), // Adresse de l'utilisateur concerné
    hasAccess: t.boolean().notNull(), // Indique si l'accès est accordé ou révoqué
    changedAtTimestamp: t.bigint().notNull(), // Timestamp du changement
    changedBy: t.hex().notNull(), // Adresse de l'utilisateur qui a effectué le changement
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.interventionId, table.changedAtTimestamp] }) })
);

// // Relations pour les changements d'accès aux interventions
// export const interventionAccessChangesRelations = relations(interventionAccessChanges, ({ one }) => ({
//   intervention: one(interventions, {
//     fields: [interventionAccessChanges.interventionId],
//     references: [interventions.id],
//   }),
// }));

export const interventionAccessChangesRelations = relations(interventionAccessChanges, ({ one }) => ({
  intervention: one(interventions, {
    fields: [interventionAccessChanges.interventionId],
    references: [interventions.id],
  }),
  changer: one(users, { fields: [interventionAccessChanges.changedBy], references: [users.id] }), // Ajout relation changedBy
}));

export const userModuleAccess = onchainTable(
  "userModuleAccess",
  (t) => ({
    id: t.hex(),
    moduleName: t.text().notNull(), // Nom du module
    authorizedAddress: t.hex().notNull(), // Adresse autorisée
    tokenId: t.bigint().notNull(), // Identifiant du token concerné
    assignedAtTimestamp: t.bigint().notNull(), // Timestamp de l'attribution
    revokedAtTimestamp: t.bigint(), // Timestamp de la révocation (optionnel)
  }),
  (table) => ({ pk: primaryKey({ columns: [table.id, table.authorizedAddress, table.moduleName, table.tokenId] }) })
);

// // Relations pour les `UserModuleAccess`
// export const userModuleAccessRelations = relations(userModuleAccess, ({ one }) => ({
//   module: one(modules, { fields: [userModuleAccess.moduleName], references: [modules.moduleName] }),
//   user: one(users, { fields: [userModuleAccess.authorizedAddress], references: [users.id] }),
// }));

export const userModuleAccessRelations = relations(userModuleAccess, ({ one }) => ({
  module: one(modules, { fields: [userModuleAccess.moduleName], references: [modules.moduleName] }),
  user: one(users, { fields: [userModuleAccess.authorizedAddress], references: [users.id] }),
}));
