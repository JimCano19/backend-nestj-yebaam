import { 
  pgTable, 
  text, 
  boolean, 
  timestamp, 
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: text('password_hash'),
  googleId: varchar('google_id', { length: 100 }).unique(),
  cognitoId: varchar('cognito_id', { length: 100 }).unique(),
  avatarUrl: text('avatar_url'),
  coverUrl: text('cover_url'),
  firstName: varchar('first_name', { length: 50 }),
  secondName: varchar('second_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  secondLastName: varchar('second_last_name', { length: 50 }),
  birthCountry: varchar('birth_country', { length: 100 }),
  birthState: varchar('birth_state', { length: 100 }),
  birthCity: varchar('birth_city', { length: 100 }),
  birthDay: varchar('birth_day', { length: 2 }),
  birthMonth: varchar('birth_month', { length: 2 }),
  birthYear: varchar('birth_year', { length: 4 }),
  residenceCountry: varchar('residence_country', { length: 100 }),
  residenceState: varchar('residence_state', { length: 100 }),
  residenceCity: varchar('residence_city', { length: 100 }),
  gender: varchar('gender', { length: 20 }),
  pronoun: varchar('pronoun', { length: 20 }),
  customGender: varchar('custom_gender', { length: 50 }),
  maritalStatus: varchar('marital_status', { length: 20 }),
  bio: text('bio'),
  customLinkUrl: text('custom_link_url'),
  customLinkText: varchar('custom_link_text', { length: 100 }),
  studyPlace: varchar('study_place', { length: 255 }),
  workPlace: varchar('work_place', { length: 255 }),
  documentStatus: varchar('document_status', { length: 50 }),
  tvShows: text('tv_shows'),
  musicBands: text('music_bands'),
  favoriteMovies: text('favorite_movies'),
  favoriteBooks: text('favorite_books'),
  favoriteGames: text('favorite_games'),
  acceptedTerms: boolean('accepted_terms'),
  verified: boolean('verified').default(false).notNull(),
  verificationToken: text('verification_token'),
  verificationTokenExpires: timestamp('verification_token_expires'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userDocuments: text('user_documents').array(),
});

// Sessions table
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
});

// Follows table
export const follows = pgTable('follows', {
  followerId: text('follower_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  followingId: text('following_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: [table.followerId, table.followingId],
}));

// Activity logs table
export const activityLogs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Devices table
export const devices = pgTable('devices', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  deviceId: varchar('device_id', { length: 255 }).notNull(),
  userAgent: text('user_agent').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Search histories table
export const searchHistories = pgTable('search_histories', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  term: varchar('term', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Stories table
export const stories = pgTable('stories', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  mediaUrl: text('media_url').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notification settings table
export const notificationSettings = pgTable('notification_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  like: boolean('like').default(true).notNull(),
  comment: boolean('comment').default(true).notNull(),
  follow: boolean('follow').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Documents3 table
export const documents3 = pgTable('documents3', {
  id: text('id').primaryKey(),
  idAws: text('id_aws').unique(),
  send: boolean('send'),
  state: varchar('state', { length: 50 }),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  following: many(follows, { relationName: 'following' }),
  followers: many(follows, { relationName: 'followers' }),
  activityLogs: many(activityLogs),
  devices: many(devices),
  searchHistories: many(searchHistories),
  stories: many(stories),
  notificationSettings: many(notificationSettings),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: 'following',
  }),
  following: one(users, {
    fields: [follows.followingId], 
    references: [users.id],
    relationName: 'followers',
  }),
}));
