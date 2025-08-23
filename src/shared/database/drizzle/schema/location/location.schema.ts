import { 
  pgTable, 
  text, 
  timestamp, 
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../user/user.schema';
import { mediaTypeEnum } from '../enums';

// Countries table
export const countries = pgTable('countries', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

// States table
export const states = pgTable('states', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  countryId: text('country_id').notNull().references(() => countries.id, { onDelete: 'cascade' }),
});

// Cities table
export const cities = pgTable('city', {
  id: text('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  stateId: text('state_id').references(() => states.id, { onDelete: 'cascade' }),
  countryId: text('country_id').notNull().references(() => countries.id, { onDelete: 'cascade' }),
}, (table) => ({
  unique: [table.name, table.stateId, table.countryId],
}));

// City media table
export const cityMedia = pgTable('city_media', {
  id: text('id').primaryKey().notNull(),
  cityId: text('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  type: mediaTypeEnum('type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// City media likes table
export const cityMediaLikes = pgTable('city_media_likes', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cityMediaId: text('city_media_id').notNull().references(() => cityMedia.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.cityMediaId] }),
}));

// Relations
export const countriesRelations = relations(countries, ({ many }) => ({
  states: many(states),
  cities: many(cities),
}));

export const statesRelations = relations(states, ({ one, many }) => ({
  country: one(countries, {
    fields: [states.countryId],
    references: [countries.id],
  }),
  cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  state: one(states, {
    fields: [cities.stateId],
    references: [states.id],
  }),
  country: one(countries, {
    fields: [cities.countryId],
    references: [countries.id],
  }),
  cityMedia: many(cityMedia),
}));

export const cityMediaRelations = relations(cityMedia, ({ one, many }) => ({
  city: one(cities, {
    fields: [cityMedia.cityId],
    references: [cities.id],
  }),
  user: one(users, {
    fields: [cityMedia.userId],
    references: [users.id],
  }),
  likes: many(cityMediaLikes),
}));

export const cityMediaLikesRelations = relations(cityMediaLikes, ({ one }) => ({
  cityMedia: one(cityMedia, {
    fields: [cityMediaLikes.cityMediaId],
    references: [cityMedia.id],
  }),
  user: one(users, {
    fields: [cityMediaLikes.userId],
    references: [users.id],
  }),
}));
