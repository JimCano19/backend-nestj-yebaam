import { 
  pgTable, 
  text, 
  timestamp, 
  varchar,
  boolean,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../user/user.schema';
import { posts } from '../social/social.schema';
import { comments } from '../social/social.schema';
import { 
  adminRoleEnum, 
  bannerPositionEnum, 
  contentTypeEnum, 
  moderationActionTypeEnum, 
  reportReviewStatusEnum 
} from '../enums';

// Admin users table
export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  roleId: text('role_id').references(() => adminRoles.id),
  roleType: adminRoleEnum('role_type').notNull(),
  createdBy: text('created_by'),
  isActive: boolean('is_active').default(true).notNull(),
  isSuperAdmin: boolean('is_super_admin').default(false).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  lockedUntil: timestamp('locked_until'),
  loginAttempts: integer('login_attempts').default(0).notNull(),
  mustChangePassword: boolean('must_change_password').default(false).notNull(),
  updatedBy: text('updated_by'),
});

// Admin roles table
export const adminRoles = pgTable('admin_roles', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// Admin permissions table
export const adminPermissions = pgTable('admin_permissions', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Role permissions junction table
export const rolePermissions = pgTable('_RolePermissions', {
  A: text('A').notNull().references(() => adminPermissions.id, { onDelete: 'cascade' }),
  B: text('B').notNull().references(() => adminRoles.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.A, table.B] }),
}));

// User roles junction table
export const userRoles = pgTable('_UserRoles', {
  A: text('A').notNull().references(() => adminRoles.id, { onDelete: 'cascade' }),
  B: text('B').notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.A, table.B] }),
}));

// Ads table
export const ads = pgTable('ads', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  linkUrl: text('link_url'),
  isActive: boolean('is_active').default(true).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Announcements table
export const announcements = pgTable('announcements', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isPinned: boolean('is_pinned').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Banners table
export const banners = pgTable('banners', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }),
  imageUrl: text('image_url').notNull(),
  linkUrl: text('link_url'),
  isActive: boolean('is_active').default(true).notNull(),
  position: bannerPositionEnum('position').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Content blocks table
export const contentBlocks = pgTable('content_blocks', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  type: contentTypeEnum('type').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  linkUrl: text('link_url'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// FAQs table
export const faqs = pgTable('faqs', {
  id: text('id').primaryKey(),
  question: varchar('question', { length: 500 }).notNull(),
  answer: text('answer').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Pages table
export const pages = pgTable('pages', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  content: text('content').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Moderation actions table
export const moderationActions = pgTable('moderation_actions', {
  id: text('id').primaryKey(),
  adminId: text('admin_id').notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
  targetUserId: text('target_user_id').references(() => users.id),
  targetPostId: text('target_post_id').references(() => posts.id),
  targetCommentId: text('target_comment_id').references(() => comments.id),
  action: moderationActionTypeEnum('action').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Reports table
export const reports = pgTable('reports', {
  id: text('id').primaryKey(),
  reporterId: text('reporter_id').notNull().references(() => users.id),
  reportedUserId: text('reported_user_id').references(() => users.id),
  reportedPostId: text('reported_post_id').references(() => posts.id),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Report reviews table
export const reportReviews = pgTable('report_reviews', {
  id: text('id').primaryKey(),
  reportId: text('report_id').notNull().references(() => reports.id, { onDelete: 'cascade' }),
  adminId: text('admin_id').notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
  status: reportReviewStatusEnum('status').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const adminUsersRelations = relations(adminUsers, ({ one, many }) => ({
  role: one(adminRoles, {
    fields: [adminUsers.roleId],
    references: [adminRoles.id],
  }),
  userRoles: many(userRoles),
  moderationActions: many(moderationActions),
  reportReviews: many(reportReviews),
}));

export const adminRolesRelations = relations(adminRoles, ({ many }) => ({
  adminUsers: many(adminUsers),
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
}));

export const adminPermissionsRelations = relations(adminPermissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  permission: one(adminPermissions, {
    fields: [rolePermissions.A],
    references: [adminPermissions.id],
  }),
  role: one(adminRoles, {
    fields: [rolePermissions.B],
    references: [adminRoles.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  role: one(adminRoles, {
    fields: [userRoles.A],
    references: [adminRoles.id],
  }),
  user: one(adminUsers, {
    fields: [userRoles.B],
    references: [adminUsers.id],
  }),
}));

export const moderationActionsRelations = relations(moderationActions, ({ one }) => ({
  admin: one(adminUsers, {
    fields: [moderationActions.adminId],
    references: [adminUsers.id],
  }),
  targetUser: one(users, {
    fields: [moderationActions.targetUserId],
    references: [users.id],
  }),
  targetPost: one(posts, {
    fields: [moderationActions.targetPostId],
    references: [posts.id],
  }),
  targetComment: one(comments, {
    fields: [moderationActions.targetCommentId],
    references: [comments.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
  }),
  reportedUser: one(users, {
    fields: [reports.reportedUserId],
    references: [users.id],
  }),
  reportedPost: one(posts, {
    fields: [reports.reportedPostId],
    references: [posts.id],
  }),
  reviews: many(reportReviews),
}));

export const reportReviewsRelations = relations(reportReviews, ({ one }) => ({
  report: one(reports, {
    fields: [reportReviews.reportId],
    references: [reports.id],
  }),
  admin: one(adminUsers, {
    fields: [reportReviews.adminId],
    references: [adminUsers.id],
  }),
}));
