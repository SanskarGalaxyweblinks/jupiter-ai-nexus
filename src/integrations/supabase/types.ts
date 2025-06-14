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
      alert_notifications: {
        Row: {
          alert_id: string | null
          channels_sent: Json | null
          id: string
          message: string | null
          organization_id: string | null
          sent_at: string | null
          triggered_value: number | null
        }
        Insert: {
          alert_id?: string | null
          channels_sent?: Json | null
          id?: string
          message?: string | null
          organization_id?: string | null
          sent_at?: string | null
          triggered_value?: number | null
        }
        Update: {
          alert_id?: string | null
          channels_sent?: Json | null
          id?: string
          message?: string | null
          organization_id?: string | null
          sent_at?: string | null
          triggered_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_notifications_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "usage_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          allowed_models: Json | null
          created_at: string | null
          created_by: string | null
          environment: string | null
          expires_at: string | null
          id: string
          ip_whitelist: Json | null
          is_active: boolean | null
          key_hash: string | null
          key_prefix: string | null
          last_used: string | null
          name: string | null
          organization_id: string | null
          permissions: Json | null
          rate_limit_override: Json | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          allowed_models?: Json | null
          created_at?: string | null
          created_by?: string | null
          environment?: string | null
          expires_at?: string | null
          id?: string
          ip_whitelist?: Json | null
          is_active?: boolean | null
          key_hash?: string | null
          key_prefix?: string | null
          last_used?: string | null
          name?: string | null
          organization_id?: string | null
          permissions?: Json | null
          rate_limit_override?: Json | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          allowed_models?: Json | null
          created_at?: string | null
          created_by?: string | null
          environment?: string | null
          expires_at?: string | null
          id?: string
          ip_whitelist?: Json | null
          is_active?: boolean | null
          key_hash?: string | null
          key_prefix?: string | null
          last_used?: string | null
          name?: string | null
          organization_id?: string | null
          permissions?: Json | null
          rate_limit_override?: Json | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      audit_logs: {
        Row: {
          action: string | null
          created_at: string | null
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          organization_id: string | null
          resource_id: string | null
          resource_type: string | null
          session_id: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_cycles: {
        Row: {
          created_at: string | null
          cycle_end: string | null
          cycle_start: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string | null
          invoice_url: string | null
          notes: string | null
          organization_id: string | null
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_terms: string | null
          sent_at: string | null
          status: string | null
          subscription_cost: number | null
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number | null
          updated_at: string | null
          usage_cost: number | null
        }
        Insert: {
          created_at?: string | null
          cycle_end?: string | null
          cycle_start?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          notes?: string | null
          organization_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms?: string | null
          sent_at?: string | null
          status?: string | null
          subscription_cost?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number | null
          updated_at?: string | null
          usage_cost?: number | null
        }
        Update: {
          created_at?: string | null
          cycle_end?: string | null
          cycle_start?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          notes?: string | null
          organization_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms?: string | null
          sent_at?: string | null
          status?: string | null
          subscription_cost?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number | null
          updated_at?: string | null
          usage_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_cycles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_line_items: {
        Row: {
          billing_cycle_id: string | null
          created_at: string | null
          description: string | null
          id: string
          item_type: string | null
          metadata: Json | null
          model_id: string | null
          period_end: string | null
          period_start: string | null
          quantity: number | null
          total_amount: number | null
          unit_price: number | null
          unit_type: string | null
        }
        Insert: {
          billing_cycle_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          item_type?: string | null
          metadata?: Json | null
          model_id?: string | null
          period_end?: string | null
          period_start?: string | null
          quantity?: number | null
          total_amount?: number | null
          unit_price?: number | null
          unit_type?: string | null
        }
        Update: {
          billing_cycle_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          item_type?: string | null
          metadata?: Json | null
          model_id?: string | null
          period_end?: string | null
          period_start?: string | null
          quantity?: number | null
          total_amount?: number | null
          unit_price?: number | null
          unit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_line_items_billing_cycle_id_fkey"
            columns: ["billing_cycle_id"]
            isOneToOne: false
            referencedRelation: "billing_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_line_items_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
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
      hourly_usage_summary: {
        Row: {
          avg_response_time_ms: number | null
          created_at: string | null
          failed_requests: number | null
          hour_timestamp: string | null
          id: string
          max_response_time_ms: number | null
          min_response_time_ms: number | null
          model_id: string | null
          organization_id: string | null
          peak_requests_per_minute: number | null
          successful_requests: number | null
          total_cost: number | null
          total_requests: number | null
          total_tokens: number | null
          unique_users: number | null
          updated_at: string | null
        }
        Insert: {
          avg_response_time_ms?: number | null
          created_at?: string | null
          failed_requests?: number | null
          hour_timestamp?: string | null
          id?: string
          max_response_time_ms?: number | null
          min_response_time_ms?: number | null
          model_id?: string | null
          organization_id?: string | null
          peak_requests_per_minute?: number | null
          successful_requests?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          unique_users?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_response_time_ms?: number | null
          created_at?: string | null
          failed_requests?: number | null
          hour_timestamp?: string | null
          id?: string
          max_response_time_ms?: number | null
          min_response_time_ms?: number | null
          model_id?: string | null
          organization_id?: string | null
          peak_requests_per_minute?: number | null
          successful_requests?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          unique_users?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hourly_usage_summary_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hourly_usage_summary_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_usage_summary: {
        Row: {
          average_daily_requests: number | null
          cost_breakdown: Json | null
          created_at: string | null
          id: string
          models_used: Json | null
          month: number | null
          organization_id: string | null
          peak_daily_requests: number | null
          total_cost: number | null
          total_requests: number | null
          total_tokens: number | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          average_daily_requests?: number | null
          cost_breakdown?: Json | null
          created_at?: string | null
          id?: string
          models_used?: Json | null
          month?: number | null
          organization_id?: string | null
          peak_daily_requests?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          average_daily_requests?: number | null
          cost_breakdown?: Json | null
          created_at?: string | null
          id?: string
          models_used?: Json | null
          month?: number | null
          organization_id?: string | null
          peak_daily_requests?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_usage_summary_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_text: string | null
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          organization_id: string | null
          priority: string | null
          read_at: string | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          read_at?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          organization_id?: string | null
          priority?: string | null
          read_at?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_models: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          custom_pricing: Json | null
          id: string
          is_enabled: boolean | null
          model_id: string | null
          monthly_quota: number | null
          notes: string | null
          organization_id: string | null
          priority_access: boolean | null
          rate_limit_per_day: number | null
          rate_limit_per_hour: number | null
          rate_limit_per_minute: number | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          custom_pricing?: Json | null
          id?: string
          is_enabled?: boolean | null
          model_id?: string | null
          monthly_quota?: number | null
          notes?: string | null
          organization_id?: string | null
          priority_access?: boolean | null
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          rate_limit_per_minute?: number | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          custom_pricing?: Json | null
          id?: string
          is_enabled?: boolean | null
          model_id?: string | null
          monthly_quota?: number | null
          notes?: string | null
          organization_id?: string | null
          priority_access?: boolean | null
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          rate_limit_per_minute?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_models_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_models_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_models_organization_id_fkey"
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
      payment_methods: {
        Row: {
          billing_address: Json | null
          brand: string | null
          cardholder_name: string | null
          created_at: string | null
          expiry_month: number | null
          expiry_year: number | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last_four: string | null
          organization_id: string | null
          provider: string | null
          provider_payment_method_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          billing_address?: Json | null
          brand?: string | null
          cardholder_name?: string | null
          created_at?: string | null
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_four?: string | null
          organization_id?: string | null
          provider?: string | null
          provider_payment_method_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json | null
          brand?: string | null
          cardholder_name?: string | null
          created_at?: string | null
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_four?: string | null
          organization_id?: string | null
          provider?: string | null
          provider_payment_method_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          billing_cycle_id: string | null
          created_at: string | null
          currency: string | null
          failure_reason: string | null
          id: string
          organization_id: string | null
          payment_method_id: string | null
          processed_at: string | null
          provider_transaction_id: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          billing_cycle_id?: string | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          organization_id?: string | null
          payment_method_id?: string | null
          processed_at?: string | null
          provider_transaction_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          billing_cycle_id?: string | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          organization_id?: string | null
          payment_method_id?: string | null
          processed_at?: string | null
          provider_transaction_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_billing_cycle_id_fkey"
            columns: ["billing_cycle_id"]
            isOneToOne: false
            referencedRelation: "billing_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_tracking: {
        Row: {
          created_at: string | null
          id: string
          last_request_at: string | null
          model_id: string | null
          organization_id: string | null
          request_count: number | null
          time_window: string | null
          token_count: number | null
          updated_at: string | null
          window_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_request_at?: string | null
          model_id?: string | null
          organization_id?: string | null
          request_count?: number | null
          time_window?: string | null
          token_count?: number | null
          updated_at?: string | null
          window_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_request_at?: string | null
          model_id?: string | null
          organization_id?: string | null
          request_count?: number | null
          time_window?: string | null
          token_count?: number | null
          updated_at?: string | null
          window_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rate_limit_tracking_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rate_limit_tracking_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string | null
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string | null
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string | null
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      usage_alerts: {
        Row: {
          alert_type: string | null
          created_at: string | null
          current_value: number | null
          id: string
          is_active: boolean | null
          last_triggered: string | null
          notification_channels: Json | null
          organization_id: string | null
          threshold_type: string | null
          threshold_value: number | null
          trigger_count: number | null
          updated_at: string | null
        }
        Insert: {
          alert_type?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          notification_channels?: Json | null
          organization_id?: string | null
          threshold_type?: string | null
          threshold_value?: number | null
          trigger_count?: number | null
          updated_at?: string | null
        }
        Update: {
          alert_type?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          notification_channels?: Json | null
          organization_id?: string | null
          threshold_type?: string | null
          threshold_value?: number | null
          trigger_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
