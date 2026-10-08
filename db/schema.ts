import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
};

export const users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  username: text().notNull().unique(),
  email: text(),
  phoneNumber: text("phone_number").notNull(),
  address: text().notNull(),
  password: text().notNull(),
  ...timestamps,
});

export const admins = pgTable("admins", {
  adminId: serial("admin_id").primaryKey(),
  name: text().notNull().unique(),
  email: text(),
  password: text().notNull(),
  ...timestamps,
});

export const products = pgTable("products", {
  productId: serial("product_id").primaryKey(),
  title: text(),
  price: integer().notNull(),
  imageUrl: text("image_url").notNull(),
  description: text().notNull(),
  gender: text(), // 'Male' | 'Female'
  type: text(), // 'Hoodie' | 'T-shirt' | 'Sweatshirt' | 'Oversized T-shirt' | 'Crop T-shirt'
  ...timestamps,
});

export const cartItems = pgTable("cart_items", {
  productId: integer("product_id").primaryKey(),
  productTitle: text("product_title").notNull(),
  quantity: integer().notNull().default(1),
  size: text().notNull().default("S"),
  productPrice: integer("product_price").notNull(),
  productImg: text("product_img").notNull(),
  productDescription: text("product_description").notNull(),
  ...timestamps,
});

export const wishlistItems = pgTable("wishlist_items", {
  productId: integer("product_id").primaryKey(),
  productTitle: text("product_title"),
  productPrice: integer("product_price").notNull(),
  productImg: text("product_img").notNull(),
  productDescription: text("product_description").notNull(),
  ...timestamps,
});

export const orders = pgTable("orders", {
  orderId: serial("order_id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.productId),
  userId: integer("user_id").notNull().references(() => users.userId),
  price: integer(),
  paymentMode: text("payment_mode"),
  status: text(),
  totalAmount: integer("total_amount"),
  ...timestamps,
});

export const payments = pgTable("payments", {
  paymentId: serial("payment_id").primaryKey(),
  via: text(), // payment method
  amount: numeric({ precision: 10, scale: 2 }), // amount paid by customer
  ...timestamps,
});
