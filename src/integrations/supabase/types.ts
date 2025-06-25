export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_models: {
        Row: {
          capabilities: Json | null
          context_window: number | null
          created_at: string | null
          description: string | null
          id: string
          input_cost_per_1k_tokens: number | null
          is_active: boolean | null
          max_tokens: number | null
          model_identifier: string
          name: string
          output_cost_per_1k_tokens: number | null
          performance_tier: string | null
          provider: string
          release_date: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          capabilities?: Json | null
          context_window?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          input_cost_per_1k_tokens?: number | null
          is_active?: boolean | null
          max_tokens?: number | null
          model_identifier: string
          name: string
          output_cost_per_1k_tokens?: number | null
          performance_tier?: string | null
          provider: string
          release_date?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          capabilities?: Json | null
          context_window?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          input_cost_per_1k_tokens?: number | null
          is_active?: boolean | null
          max_tokens?: number | null
          model_identifier?: string
          name?: string
          output_cost_per_1k_tokens?: number | null
          performance_tier?: string | null
          provider?: string
          release_date?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      api_usage_logs: {
        Row: {
          completion_tokens: number | null
          created_at: string | null
          endpoint: string | null
          error_message: string | null
          error_type: string | null
          id: string
          input_cost: number | null
          ip_address: unknown | null
          max_tokens_requested: number | null
          metadata: Json | null
          method: string | null
          model_id: string | null
          model_version: string | null
          organization_id: string | null
          output_cost: number | null
          prompt_tokens: number | null
          request_id: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number | null
          status: string | null
          status_code: number | null
          stream_used: boolean | null
          temperature: number | null
          total_cost: number | null
          total_tokens: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string | null
          endpoint?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_cost?: number | null
          ip_address?: unknown | null
          max_tokens_requested?: number | null
          metadata?: Json | null
          method?: string | null
          model_id?: string | null
          model_version?: string | null
          organization_id?: string | null
          output_cost?: number | null
          prompt_tokens?: number | null
          request_id: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status?: string | null
          status_code?: number | null
          stream_used?: boolean | null
          temperature?: number | null
          total_cost?: number | null
          total_tokens?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string | null
          endpoint?: string | null
          error_message?: string | null
          error_type?: string | null
          id?: string
          input_cost?: number | null
          ip_address?: unknown | null
          max_tokens_requested?: number | null
          metadata?: Json | null
          method?: string | null
          model_id?: string | null
          model_version?: string | null
          organization_id?: string | null
          output_cost?: number | null
          prompt_tokens?: number | null
          request_id?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status?: string | null
          status_code?: number | null
          stream_used?: boolean | null
          temperature?: number | null
          total_cost?: number | null
          total_tokens?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_usage_summary: {
        Row: {
          avg_response_time_ms: number | null
          created_at: string | null
          error_breakdown: Json | null
          id: string
          model_id: string | null
          organization_id: string | null
          peak_hour: number | null
          peak_requests: number | null
          success_rate: number | null
          successful_requests: number | null
          total_cost: number | null
          total_requests: number | null
          total_tokens: number | null
          unique_users: number | null
          updated_at: string | null
          usage_date: string | null
        }
        Insert: {
          avg_response_time_ms?: number | null
          created_at?: string | null
          error_breakdown?: Json | null
          id?: string
          model_id?: string | null
          organization_id?: string | null
          peak_hour?: number | null
          peak_requests?: number | null
          success_rate?: number | null
          successful_requests?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          unique_users?: number | null
          updated_at?: string | null
          usage_date?: string | null
        }
        Update: {
          avg_response_time_ms?: number | null
          created_at?: string | null
          error_breakdown?: Json | null
          id?: string
          model_id?: string | null
          organization_id?: string | null
          peak_hour?: number | null
          peak_requests?: number | null
          success_rate?: number | null
          successful_requests?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          unique_users?: number | null
          updated_at?: string | null
          usage_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_usage_summary_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_usage_summary_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          api_key_prefix: string | null
          billing_email: string | null
          company_size: string | null
          created_at: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          logo_url: string | null
          monthly_budget: number | null
          name: string
          slug: string
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          api_key_prefix?: string | null
          billing_email?: string | null
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          monthly_budget?: number | null
          name: string
          slug: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          api_key_prefix?: string | null
          billing_email?: string | null
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          monthly_budget?: number | null
          name?: string
          slug?: string
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_active: boolean | null
          job_title: string | null
          last_login: string | null
          organization_id: string | null
          phone: string | null
          preferences: Json | null
          role: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          last_login?: string | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          last_login?: string | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
