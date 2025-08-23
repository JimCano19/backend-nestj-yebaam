import { pgEnum } from 'drizzle-orm/pg-core';

// Media types
export const mediaTypeEnum = pgEnum('media_type', ['IMAGE', 'VIDEO']);

// Notification types
export const notificationTypeEnum = pgEnum('notification_type', [
  'LIKE',
  'FOLLOW', 
  'COMMENT',
  'VERIFY_AVAILABLE',
  'BLOG_FOLLOW',
  'BLOG_ACCESS_REQUEST',
  'BLOG_POST_LIKE',
  'FRIEND_REQUEST',
  'FRIEND_ACCEPTED',
  'FRIEND_DECLINED',
  'CLUB_INVITATION',
  'CLUB_JOIN_REQUEST',
  'CLUB_ACCEPTANCE',
  'CLUB_POST_LIKE',
  'CLUB_ROLE_CHANGE',
  'CLUB_MEMBER_JOINED'
]);

// Admin roles
export const adminRoleEnum = pgEnum('admin_role', ['ADMIN', 'SUPPORT', 'CEO']);

// Banner positions
export const bannerPositionEnum = pgEnum('banner_position', ['TOP', 'MIDDLE', 'BOTTOM']);

// Content types
export const contentTypeEnum = pgEnum('content_type', ['PROMOTION', 'NEWS', 'ALERT']);

// Friendship status
export const friendshipStatusEnum = pgEnum('friendship_status', ['PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED']);

// Moderation action types
export const moderationActionTypeEnum = pgEnum('moderation_action_type', [
  'BLOCK_USER',
  'DELETE_POST', 
  'DELETE_COMMENT',
  'WARNING'
]);

// Report review status
export const reportReviewStatusEnum = pgEnum('report_review_status', ['PENDING', 'APPROVED', 'REJECTED']);

// Access request status
export const accessRequestStatusEnum = pgEnum('access_request_status', ['PENDING', 'ACCEPTED', 'DECLINED']);

// Blog visibility
export const blogVisibilityEnum = pgEnum('blog_visibility', ['PUBLIC', 'PRIVATE', 'SECRET']);

// Club visibility
export const clubVisibilityEnum = pgEnum('club_visibility', ['PUBLIC', 'PRIVATE', 'SECRET', 'AFFILIATION']);

// Club member role
export const clubMemberRoleEnum = pgEnum('club_member_role', ['ADMIN', 'MODERATOR', 'MEMBER']);

// Professional profile visibility
export const professionalProfileVisibilityEnum = pgEnum('professional_profile_visibility', [
  'PUBLIC',
  'PRIVATE', 
  'LIMITED'
]);
