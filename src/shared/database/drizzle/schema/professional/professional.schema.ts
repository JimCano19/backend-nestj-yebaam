import { 
  pgTable, 
  text, 
  timestamp, 
  varchar,
  primaryKey,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../user/user.schema';
import { mediaTypeEnum, professionalProfileVisibilityEnum } from '../enums';

// Professional profiles table
export const professionalProfiles = pgTable('professional_profiles', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id').unique().notNull().references(() => users.id, { onDelete: 'cascade' }),
  visibility: professionalProfileVisibilityEnum('visibility').notNull(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Titles table
export const titles = pgTable('titles', {
  id: text('id').primaryKey().notNull(),
  professionalProfileId: text('professional_profile_id').notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  institution: varchar('institution', { length: 255 }),
  year: integer('year'),
});

// Studies table
export const studies = pgTable('studies', {
  id: text('id').primaryKey().notNull(),
  professionalProfileId: text('professional_profile_id').notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  institution: varchar('institution', { length: 255 }),
  year: integer('year'),
});

// Associations table
export const associations = pgTable('associations', {
  id: text('id').primaryKey().notNull(),
  professionalProfileId: text('professional_profile_id').notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }),
});

// Licenses table
export const licenses = pgTable('licenses', {
  id: text('id').primaryKey().notNull(),
  professionalProfileId: text('professional_profile_id').notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  number: varchar('number', { length: 100 }),
  issuedBy: varchar('issued_by', { length: 255 }),
  issuedAt: timestamp('issued_at'),
});

// Skills table
export const skills = pgTable('skills', {
  id: text('id').primaryKey().notNull(),
  professionalProfileId: text('professional_profile_id').notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  level: varchar('level', { length: 50 }),
});

// Languages table
export const languages = pgTable('languages', {
  id: text('id').primaryKey().notNull(),
  professionalProfileId: text('professional_profile_id').notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  proficiency: varchar('proficiency', { length: 50 }),
});

// Experience table
export const experience = pgTable('experience', {
  id: text('id').primaryKey().notNull(),
  professionalProfileId: text('professional_profile_id').notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  position: varchar('position', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  description: text('description'),
});

// Professional posts table
export const professionalPosts = pgTable('professional_posts', {
  id: text('id').primaryKey().notNull(),
  professionalProfileId: text('professional_profile_id').notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Professional media table
export const professionalMedia = pgTable('professional_media', {
  id: text('id').primaryKey().notNull(),
  postId: text('post_id').references(() => professionalPosts.id, { onDelete: 'cascade' }),
  type: mediaTypeEnum('type').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Professional post likes table
export const professionalPostLikes = pgTable('professional_post_likes', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').notNull().references(() => professionalPosts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.postId] }),
}));

// Professional profile follows table
export const professionalProfileFollows = pgTable('professional_profile_follows', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  professionalProfileId: text('professional_profile_id').notNull().references(() => professionalProfiles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.professionalProfileId] }),
}));

// Relations
export const professionalProfilesRelations = relations(professionalProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [professionalProfiles.userId],
    references: [users.id],
  }),
  titles: many(titles),
  studies: many(studies),
  associations: many(associations),
  licenses: many(licenses),
  skills: many(skills),
  languages: many(languages),
  experience: many(experience),
  posts: many(professionalPosts),
  followers: many(professionalProfileFollows),
}));

export const titlesRelations = relations(titles, ({ one }) => ({
  professionalProfile: one(professionalProfiles, {
    fields: [titles.professionalProfileId],
    references: [professionalProfiles.id],
  }),
}));

export const studiesRelations = relations(studies, ({ one }) => ({
  professionalProfile: one(professionalProfiles, {
    fields: [studies.professionalProfileId],
    references: [professionalProfiles.id],
  }),
}));

export const associationsRelations = relations(associations, ({ one }) => ({
  professionalProfile: one(professionalProfiles, {
    fields: [associations.professionalProfileId],
    references: [professionalProfiles.id],
  }),
}));

export const licensesRelations = relations(licenses, ({ one }) => ({
  professionalProfile: one(professionalProfiles, {
    fields: [licenses.professionalProfileId],
    references: [professionalProfiles.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  professionalProfile: one(professionalProfiles, {
    fields: [skills.professionalProfileId],
    references: [professionalProfiles.id],
  }),
}));

export const languagesRelations = relations(languages, ({ one }) => ({
  professionalProfile: one(professionalProfiles, {
    fields: [languages.professionalProfileId],
    references: [professionalProfiles.id],
  }),
}));

export const experienceRelations = relations(experience, ({ one }) => ({
  professionalProfile: one(professionalProfiles, {
    fields: [experience.professionalProfileId],
    references: [professionalProfiles.id],
  }),
}));

export const professionalPostsRelations = relations(professionalPosts, ({ one, many }) => ({
  professionalProfile: one(professionalProfiles, {
    fields: [professionalPosts.professionalProfileId],
    references: [professionalProfiles.id],
  }),
  user: one(users, {
    fields: [professionalPosts.userId],
    references: [users.id],
  }),
  media: many(professionalMedia),
  likes: many(professionalPostLikes),
}));

export const professionalMediaRelations = relations(professionalMedia, ({ one }) => ({
  post: one(professionalPosts, {
    fields: [professionalMedia.postId],
    references: [professionalPosts.id],
  }),
}));

export const professionalPostLikesRelations = relations(professionalPostLikes, ({ one }) => ({
  user: one(users, {
    fields: [professionalPostLikes.userId],
    references: [users.id],
  }),
  post: one(professionalPosts, {
    fields: [professionalPostLikes.postId],
    references: [professionalPosts.id],
  }),
}));

export const professionalProfileFollowsRelations = relations(professionalProfileFollows, ({ one }) => ({
  user: one(users, {
    fields: [professionalProfileFollows.userId],
    references: [users.id],
  }),
  professionalProfile: one(professionalProfiles, {
    fields: [professionalProfileFollows.professionalProfileId],
    references: [professionalProfiles.id],
  }),
}));
