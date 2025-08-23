import { 
  pgTable, 
  text, 
  timestamp, 
  varchar,
  primaryKey,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../user/user.schema';
import { mediaTypeEnum, clubVisibilityEnum, clubMemberRoleEnum } from '../enums';

// Club categories table
export const clubCategories = pgTable('club_categories', {
  id: text('id').primaryKey().notNull(),
  name: varchar('name', { length: 100 }).unique().notNull(),
});

// Clubs table
export const clubs = pgTable('clubs', {
  id: text('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
  coverUrl: text('cover_url'),
  visibility: clubVisibilityEnum('visibility').notNull(),
  categoryId: text('category_id').notNull().references(() => clubCategories.id),
  creatorId: text('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  institution: varchar('institution', { length: 255 }),
  rules: text('rules'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Club posts table
export const clubPosts = pgTable('club_posts', {
  id: text('id').primaryKey().notNull(),
  content: text('content').notNull(),
  clubId: text('club_id').notNull().references(() => clubs.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Club media table
export const clubMedia = pgTable('club_media', {
  id: text('id').primaryKey().notNull(),
  postId: text('post_id').notNull().references(() => clubPosts.id, { onDelete: 'cascade' }),
  type: mediaTypeEnum('type').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Club members table
export const clubMembers = pgTable('club_members', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clubId: text('club_id').notNull().references(() => clubs.id, { onDelete: 'cascade' }),
  role: clubMemberRoleEnum('role').default('MEMBER').notNull(),
  isApproved: boolean('is_approved').default(false).notNull(),
  hasAccepted: boolean('has_accepted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.clubId] }),
}));

// Club post likes table
export const clubPostLikes = pgTable('club_post_likes', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').notNull().references(() => clubPosts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.postId] }),
}));

// Relations
export const clubCategoriesRelations = relations(clubCategories, ({ many }) => ({
  clubs: many(clubs),
}));

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  creator: one(users, {
    fields: [clubs.creatorId],
    references: [users.id],
  }),
  category: one(clubCategories, {
    fields: [clubs.categoryId],
    references: [clubCategories.id],
  }),
  posts: many(clubPosts),
  members: many(clubMembers),
}));

export const clubPostsRelations = relations(clubPosts, ({ one, many }) => ({
  club: one(clubs, {
    fields: [clubPosts.clubId],
    references: [clubs.id],
  }),
  user: one(users, {
    fields: [clubPosts.userId],
    references: [users.id],
  }),
  media: many(clubMedia),
  likes: many(clubPostLikes),
}));

export const clubMediaRelations = relations(clubMedia, ({ one }) => ({
  post: one(clubPosts, {
    fields: [clubMedia.postId],
    references: [clubPosts.id],
  }),
}));

export const clubMembersRelations = relations(clubMembers, ({ one }) => ({
  user: one(users, {
    fields: [clubMembers.userId],
    references: [users.id],
  }),
  club: one(clubs, {
    fields: [clubMembers.clubId],
    references: [clubs.id],
  }),
}));

export const clubPostLikesRelations = relations(clubPostLikes, ({ one }) => ({
  user: one(users, {
    fields: [clubPostLikes.userId],
    references: [users.id],
  }),
  post: one(clubPosts, {
    fields: [clubPostLikes.postId],
    references: [clubPosts.id],
  }),
}));
