CREATE TABLE "admins" (
	"admin_id" serial PRIMARY KEY,
	"name" text NOT NULL UNIQUE,
	"email" text,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"product_id" integer PRIMARY KEY,
	"product_title" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"size" text DEFAULT 'S' NOT NULL,
	"product_price" integer NOT NULL,
	"product_img" text NOT NULL,
	"product_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" serial PRIMARY KEY,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"price" integer,
	"payment_mode" text,
	"status" text,
	"total_amount" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" serial PRIMARY KEY,
	"via" text,
	"amount" numeric(10,2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" serial PRIMARY KEY,
	"title" text,
	"price" integer NOT NULL,
	"image_url" text NOT NULL,
	"description" text NOT NULL,
	"gender" text,
	"type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY,
	"username" text NOT NULL UNIQUE,
	"email" text,
	"phone_number" text NOT NULL,
	"address" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"product_id" integer PRIMARY KEY,
	"product_title" text,
	"product_price" integer NOT NULL,
	"product_img" text NOT NULL,
	"product_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");