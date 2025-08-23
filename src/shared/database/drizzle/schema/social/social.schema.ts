import { 
  pgTable, 
  text, 
  boolean, 
  timestamp, 
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../user/user.schema';
import { mediaTypeEnum, notificationTypeEnum, accessRequestStatusEnum, friendshipStatusEnum } from '../enums';

// Posts table
export const posts = pgTable('posts', {
  id: text('id').primaryKey().notNull(),
  content: text('content').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Media table
export const postMedia = pgTable('post_media', {
  id: text('id').primaryKey().notNull(),
  postId: text('post_id').references(() => posts.id),
  type: mediaTypeEnum('type').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Comments table
export const comments = pgTable('comments', {
  id: text('id').primaryKey().notNull(),
  content: text('content').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Likes table
export const likes = pgTable('likes', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.postId] }),
}));

// Comment likes table
export const commentLikes = pgTable('comment_likes', {
  id: text('id').primaryKey(),
  commentId: text('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  unique: [table.commentId, table.userId],
}));

// Bookmarks table
export const bookmarks = pgTable('bookmarks', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  unique: [table.userId, table.postId],
}));

// Pins table
export const pins = pgTable('pins', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.postId] }),
}));

// Post views table
export const postViews = pgTable('post_views', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Hashtags table
export const hashtags = pgTable('hashtags', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Post hashtags junction table
export const postHashtags = pgTable('post_hashtags', {
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  hashtagId: text('hashtag_id').notNull().references(() => hashtags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.hashtagId] }),
}));

// Tags table
export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Post tags junction table
export const postTags = pgTable('post_tags', {
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}));

// Collections table
export const collections = pgTable('collections', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Collection posts junction table
export const collectionPosts = pgTable('collection_posts', {
  collectionId: text('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.collectionId, table.postId] }),
}));

// Blocks table
export const blocks = pgTable('blocks', {
  id: text('id').primaryKey(),
  blockerId: text('blocker_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  blockedId: text('blocked_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  unique: [table.blockerId, table.blockedId],
}));

// Friendships table
export const friendships = pgTable('friendships', {
  id: text('id').primaryKey(),
  requesterId: text('requester_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  addresseeId: text('addressee_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: friendshipStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  unique: [table.requesterId, table.addresseeId],
}));

// Messages table
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().notNull(),
  recipientId: text('recipient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  issuerId: text('issuer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  blogId: text('blog_id'),
  blogPostId: text('blog_post_id'),
  clubId: text('club_id'),
  clubPostId: text('club_post_id'),
  type: notificationTypeEnum('type').notNull(),
  read: boolean('read').default(false).notNull(),
  status: accessRequestStatusEnum('status'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  media: many(postMedia),
  comments: many(comments),
  likes: many(likes),
  bookmarks: many(bookmarks),
  pins: many(pins),
  views: many(postViews),
  hashtags: many(postHashtags),
  tags: many(postTags),
  collections: many(collectionPosts),
  notifications: many(notifications),
}));

export const postMediaRelations = relations(postMedia, ({ one }) => ({
  post: one(posts, {
    fields: [postMedia.postId],
    references: [posts.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  likes: many(commentLikes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));
