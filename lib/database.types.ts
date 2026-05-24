// Auto-generated from supabase/schema.sql
// To regenerate: npx supabase gen types typescript --project-id <your-project-id> > lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          price: number;           // NGN, whole naira
          images: string[];
          sizes: string[];
          colors: Json;            // {name: string, hex: string}[]
          description: string | null;
          category: string;
          gender: string;
          tag: string | null;
          customizable: boolean;
          customization_cost: number; // NGN, whole naira
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          price: number;
          images?: string[];
          sizes?: string[];
          colors?: Json;
          description?: string | null;
          category: string;
          gender: string;
          tag?: string | null;
          customizable?: boolean;
          customization_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          price?: number;
          images?: string[];
          sizes?: string[];
          colors?: Json;
          description?: string | null;
          category?: string;
          gender?: string;
          tag?: string | null;
          customizable?: boolean;
          customization_cost?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      drops: {
        Row: {
          id: string;
          number: string;
          title: string;
          date: string;
          status: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          title: string;
          date: string;
          status: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          title?: string;
          date?: string;
          status?: string;
          description?: string | null;
          image_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      drop_products: {
        Row: {
          drop_id: string;
          product_id: string;
        };
        Insert: {
          drop_id: string;
          product_id: string;
        };
        Update: {
          drop_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "drop_products_drop_id_fkey";
            columns: ["drop_id"];
            isOneToOne: false;
            referencedRelation: "drops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "drop_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          slug: string | null;
          title: string;
          date: string;
          end_date: string | null;
          location: string;
          venue: string;
          status: string;
          description: string | null;
          details: string | null;
          image_url: string | null;
          gallery: string[];
          ticket_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          title: string;
          date: string;
          end_date?: string | null;
          location: string;
          venue: string;
          status: string;
          description?: string | null;
          details?: string | null;
          image_url?: string | null;
          gallery?: string[];
          ticket_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string | null;
          title?: string;
          date?: string;
          end_date?: string | null;
          location?: string;
          venue?: string;
          status?: string;
          description?: string | null;
          details?: string | null;
          image_url?: string | null;
          gallery?: string[];
          ticket_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          number: string;
          customer_name: string | null;
          customer_email: string;
          customer_phone: string | null;
          shipping_address: Json | null;  // {address, city, state, country}
          shipping_fee: number;           // NGN, whole naira
          status: string;
          total: number;                  // NGN, whole naira (items + shipping)
          paystack_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          customer_name?: string | null;
          customer_email: string;
          customer_phone?: string | null;
          shipping_address?: Json | null;
          shipping_fee?: number;
          status?: string;
          total: number;
          paystack_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          customer_name?: string | null;
          customer_email?: string;
          customer_phone?: string | null;
          shipping_address?: Json | null;
          shipping_fee?: number;
          status?: string;
          total?: number;
          paystack_reference?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_image: string | null;
          size: string;
          color: string | null;
          quantity: number;
          unit_price: number;             // NGN at time of order
          customization: Json | null;     // { name, number, imageUrl, cost } | null
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_image?: string | null;
          size: string;
          color?: string | null;
          quantity?: number;
          unit_price: number;
          customization?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          product_image?: string | null;
          size?: string;
          color?: string | null;
          quantity?: number;
          unit_price?: number;
          customization?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          drop_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          drop_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          drop_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

// ─── Convenience aliases ──────────────────────────────────────────────────────

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// ─── Typed row aliases (use these in components) ──────────────────────────────

export type DBProduct    = Tables<"products">;
export type DBDrop       = Tables<"drops">;
export type DBEvent      = Tables<"events">;
export type DBOrder      = Tables<"orders">;
export type DBOrderItem  = Tables<"order_items">;
export type DBAdminUser  = Tables<"admin_users">;
export type DBWaitlist   = Tables<"waitlist">;

// Color item shape stored inside products.colors (JSONB)
export type ProductColor = { name: string; hex: string };

// Customization shape stored inside order_items.customization (JSONB)
export type Customization = {
  name: string;
  number: string;
  imageUrl: string;
  cost: number; // NGN, whole naira
};

export function formatNGN(ngn: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(ngn);
}
