import { 
  pgTable, 
  text, 
  timestamp, 
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../user/user.schema';
import { mediaTypeEnum, blogVisibilityEnum } from '../enums';

// Blog categories table
export const blogCategories = pgTable('blog_categories', {
  id: text('id').primaryKey().notNull(),
  name: varchar('name', { length: 100 }).unique().notNull(),
});

// Blogs table
export const blogs = pgTable('blogs', {
  id: text('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
  coverUrl: text('cover_url'),
  visibility: blogVisibilityEnum('visibility').notNull(),
  categoryId: text('category_id').notNull().references(() => blogCategories.id),
  creatorId: text('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Blog posts table
export const blogPosts = pgTable('blog_posts', {
  id: text('id').primaryKey().notNull(),
  content: text('content').notNull(),
  blogId: text('blog_id').notNull().references(() => blogs.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Blog media table
export const blogMedia = pgTable('blog_media', {
  id: text('id').primaryKey().notNull(),
  postId: text('post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  type: mediaTypeEnum('type').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Blog follows table
export const blogFollows = pgTable('blog_follows', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  blogId: text('blog_id').notNull().references(() => blogs.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.blogId] }),
}));

// Blog likes table
export const blogLikes = pgTable('blog_likes', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  blogId: text('blog_id').notNull().references(() => blogs.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.blogId] }),
}));

// Blog post likes table
export const blogPostLikes = pgTable('blog_post_likes', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.postId] }),
}));

// Blog recommendations table
export const blogRecommendations = pgTable('blog_recommendations', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  blogId: text('blog_id').notNull().references(() => blogs.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  unique: [table.userId, table.blogId],
}));

// Relations
export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  blogs: many(blogs),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  creator: one(users, {
    fields: [blogs.creatorId],
    references: [users.id],
  }),
  category: one(blogCategories, {
    fields: [blogs.categoryId],
    references: [blogCategories.id],
  }),
  posts: many(blogPosts),
  followers: many(blogFollows),
  likes: many(blogLikes),
  recommendations: many(blogRecommendations),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  blog: one(blogs, {
    fields: [blogPosts.blogId],
    references: [blogs.id],
  }),
  user: one(users, {
    fields: [blogPosts.userId],
    references: [users.id],
  }),
  media: many(blogMedia),
  likes: many(blogPostLikes),
}));

export const blogMediaRelations = relations(blogMedia, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogMedia.postId],
    references: [blogPosts.id],
  }),
}));

export const blogFollowsRelations = relations(blogFollows, ({ one }) => ({
  user: one(users, {
    fields: [blogFollows.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [blogFollows.blogId],
    references: [blogs.id],
  }),
}));

export const blogLikesRelations = relations(blogLikes, ({ one }) => ({
  user: one(users, {
    fields: [blogLikes.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [blogLikes.blogId],
    references: [blogs.id],
  }),
}));

export const blogPostLikesRelations = relations(blogPostLikes, ({ one }) => ({
  user: one(users, {
    fields: [blogPostLikes.userId],
    references: [users.id],
  }),
  post: one(blogPosts, {
    fields: [blogPostLikes.postId],
    references: [blogPosts.id],
  }),
}));

export const blogRecommendationsRelations = relations(blogRecommendations, ({ one }) => ({
  user: one(users, {
    fields: [blogRecommendations.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [blogRecommendations.blogId],
    references: [blogs.id],
  }),
}));
