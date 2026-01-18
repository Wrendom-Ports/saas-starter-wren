import { 
  pgTable, 
  unique, 
  serial, 
  varchar, 
  timestamp, 
  text, 
  foreignKey, 
  integer, 
  bigint, 
  boolean, 
  doublePrecision 
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// --- CORE STARTER TABLES ---

export const teams = pgTable("teams", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 100 }).notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeProductId: text("stripe_product_id"),
  planName: varchar("plan_name", { length: 50 }),
  subscriptionStatus: varchar("subscription_status", { length: 20 }),
}, (table) => [
  unique("teams_stripe_customer_id_unique").on(table.stripeCustomerId),
  unique("teams_stripe_subscription_id_unique").on(table.stripeSubscriptionId),
]);

export const users = pgTable("users", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 100 }),
  email: varchar({ length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar({ length: 20 }).default('member').notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
  unique("users_email_unique").on(table.email),
]);

export const teamMembers = pgTable("team_members", {
  id: serial().primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  teamId: integer("team_id").notNull(),
  role: varchar({ length: 50 }).notNull(),
  joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "team_members_user_id_users_id_fk"
  }),
  foreignKey({
    columns: [table.teamId],
    foreignColumns: [teams.id],
    name: "team_members_team_id_teams_id_fk"
  }),
]);

// --- NODES (YOUR SHIELD VPS LIST) ---

export const nodes = pgTable("nodes", {
  id: serial().primaryKey().notNull(),
  ip: varchar({ length: 45 }).notNull(),
  name: varchar({ length: 255 }),
  status: varchar({ length: 50 }).default('offline'),
  lastSeen: timestamp("last_seen", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
  bandwidthUsage: doublePrecision("bandwidth_usage").default(0),
}, (table) => [
  unique("nodes_ip_key").on(table.ip),
]);

// --- SHIELDED LINKS (PROJECT X) ---

export const shieldedLinks = pgTable("shielded_links", {
  id: serial().primaryKey().notNull(),
  userId: integer("user_id").references(() => users.id), // Added to link to user
  userEmail: text("user_email").notNull(),
  originalUrl: text("original_url").notNull(),
  shieldedUrl: text("shielded_url").notNull(),
  token: text().notNull(),
  expiryTime: bigint("expiry_time", { mode: "number" }).notNull(),
  ipLock: boolean("ip_lock").default(true),
  clickCount: integer("click_count").default(0),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  unique("shielded_links_token_key").on(table.token),
]);

// --- LOGS & INVITES ---

export const activityLogs = pgTable("activity_logs", {
  id: serial().primaryKey().notNull(),
  teamId: integer("team_id").notNull(),
  userId: integer("user_id"),
  action: text().notNull(),
  timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
}, (table) => [
  foreignKey({
    columns: [table.teamId],
    foreignColumns: [teams.id],
    name: "activity_logs_team_id_teams_id_fk"
  }),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "activity_logs_user_id_users_id_fk"
  }),
]);

export const invitations = pgTable("invitations", {
  id: serial().primaryKey().notNull(),
  teamId: integer("team_id").notNull(),
  email: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).notNull(),
  invitedBy: integer("invited_by").notNull(),
  invitedAt: timestamp("invited_at", { mode: 'string' }).defaultNow().notNull(),
  status: varchar({ length: 20 }).default('pending').notNull(),
}, (table) => [
  foreignKey({
    columns: [table.teamId],
    foreignColumns: [teams.id],
    name: "invitations_team_id_teams_id_fk"
  }),
  foreignKey({
    columns: [table.invitedBy],
    foreignColumns: [users.id],
    name: "invitations_invited_by_users_id_fk"
  }),
]);

// --- RELATIONS ---

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  shieldedLinks: many(shieldedLinks),
}));

export const shieldedLinksRelations = relations(shieldedLinks, ({ one }) => ({
  user: one(users, {
    fields: [shieldedLinks.userId],
    references: [users.id],
  }),
}));

// --- TYPES ---

export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Node = typeof nodes.$inferSelect;
export type ShieldedLink = typeof shieldedLinks.$inferSelect;
export type NewShieldedLink = typeof shieldedLinks.$inferInsert;
