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
          updated_at?: string;
        };
      };
      drops: {
        Row: {
          id: string;
          number: string;
          title: string;
          date: string;
          status: string;
          description: string | null;
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
          updated_at?: string;
        };
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
      };
      events: {
        Row: {
          id: string;
          title: string;
          date: string;
          end_date: string | null;
          location: string;
          venue: string;
          status: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          end_date?: string | null;
          location: string;
          venue: string;
          status: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          date?: string;
          end_date?: string | null;
          location?: string;
          venue?: string;
          status?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          number: string;
          customer_name: string | null;
          customer_email: string;
          status: string;
          total: number;                  // NGN, whole naira
          paystack_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          customer_name?: string | null;
          customer_email: string;
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
          status?: string;
          total?: number;
          paystack_reference?: string | null;
          updated_at?: string;
        };
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
        };
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
      };
    };
    Enums: Record<string, never>;
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
export type DBWaitlist   = Tables<"waitlist">;

// Color item shape stored inside products.colors (JSONB)
export type ProductColor = { name: string; hex: string };
