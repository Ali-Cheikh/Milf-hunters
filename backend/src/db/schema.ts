import { relations } from "drizzle-orm";
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("userType", ["hunter", "milf"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull(),
  password: varchar("password").notNull(),
  userType: userTypeEnum("userType").notNull().default("hunter"),
});

export const profilesTable = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId"),
});

export const profileRelation = relations(profilesTable, ({ one }) => ({
  usersTable: one(usersTable, {
    fields: [profilesTable.userId],
    references: [usersTable.id],
  }),
}));
