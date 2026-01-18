import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  bigint,    
  boolean,   
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- EXISTING TABLES ---

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

// --- NEW: NODES TABLE (KEEPING YOUR VPS DATA SAFE) ---

export const nodes = pgTable('nodes', {
  id: serial('id').primaryKey(),
  ip: varchar('ip', { length: 45 }).notNull(),
  name: varchar('name', { length: 100 }), // e.g., "Shield-01"
  status: varchar('status', { length: 20 }).default('active'),
  currentLoad: integer('current_load').default(0), // Users currently on this node
  createdAt: timestamp('created_at').defaultNow(),
});

// --- NEW: PROJECT X SHIELDED LINKS TABLE ---

export const shieldedLinks = pgTable('shielded_links', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  userEmail: text('user_email').notNull(),
  originalUrl: text('original_url').notNull(),
  shieldedUrl: text('shielded_url').notNull(),
  token: text('token').unique().notNull(),
  expiryTime: bigint('expiry_time', { mode: 'number' }).notNull(),
  ipLock: boolean('ip_lock').default(true),
  clickCount: integer('click_count').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// --- ACTIVITY LOGS & INVITATIONS ---

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

// --- UPDATED RELATIONS ---

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

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// --- TYPES & ENUMS ---

export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Node = typeof nodes.$inferSelect; // Added
export type ShieldedLink = typeof shieldedLinks.$inferSelect;
