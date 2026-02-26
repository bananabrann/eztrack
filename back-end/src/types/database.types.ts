export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "14.1";
	};
	public: {
		Tables: {
			accounts: {
				Row: {
					created_at: string;
					email: string;
					id: string;
					name: string;
					role: Database["public"]["Enums"]["user_role"];
				};
				Insert: {
					created_at?: string;
					email: string;
					id?: string;
					name: string;
					role?: Database["public"]["Enums"]["user_role"];
				};
				Update: {
					created_at?: string;
					email?: string;
					id?: string;
					name?: string;
					role?: Database["public"]["Enums"]["user_role"];
				};
				Relationships: [];
			};
			material_usage: {
				Row: {
					id: string;
					material_id: string;
					project_id: string;
					quantity_used: number;
					total_cost: number;
				};
				Insert: {
					id?: string;
					material_id: string;
					project_id: string;
					quantity_used: number;
					total_cost: number;
				};
				Update: {
					id?: string;
					material_id?: string;
					project_id?: string;
					quantity_used?: number;
					total_cost?: number;
				};
				Relationships: [
					{
						foreignKeyName: "material_usage_materialId_fkey";
						columns: ["material_id"];
						isOneToOne: false;
						referencedRelation: "materials";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "material_usage_projectId_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					},
				];
			};
			materials: {
				Row: {
					id: string;
					low_stock_threshold: number;
					name: string;
					unit_cost: number;
					unit_qty: number;
				};
				Insert: {
					id?: string;
					low_stock_threshold: number;
					name: string;
					unit_cost: number;
					unit_qty: number;
				};
				Update: {
					id?: string;
					low_stock_threshold?: number;
					name?: string;
					unit_cost?: number;
					unit_qty?: number;
				};
				Relationships: [];
			};
			projects: {
				Row: {
					created_at: string;
					end_date: string;
					id: string;
					project_name: string;
					start_date: string;
					status: Database["public"]["Enums"]["project_status"];
				};
				Insert: {
					created_at?: string;
					end_date: string;
					id?: string;
					project_name: string;
					start_date: string;
					status: Database["public"]["Enums"]["project_status"];
				};
				Update: {
					created_at?: string;
					end_date?: string;
					id?: string;
					project_name?: string;
					start_date?: string;
					status?: Database["public"]["Enums"]["project_status"];
				};
				Relationships: [];
			};
			tool_management: {
				Row: {
					checked_in: string | null;
					checked_out: string;
					created_at: string;
					id: string;
					tool_id: string;
					user_id: string;
				};
				Insert: {
					checked_in?: string | null;
					checked_out?: string;
					created_at?: string;
					id?: string;
					tool_id: string;
					user_id: string;
				};
				Update: {
					checked_in?: string | null;
					checked_out?: string;
					created_at?: string;
					id?: string;
					tool_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "tool_management_tool_id_fkey";
						columns: ["tool_id"];
						isOneToOne: false;
						referencedRelation: "tools";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "tool_management_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "accounts";
						referencedColumns: ["id"];
					},
				];
			};
			tools: {
				Row: {
					created_at: string;
					id: string;
					name: string;
					status: Database["public"]["Enums"]["tool_status"];
				};
				Insert: {
					created_at?: string;
					id?: string;
					name: string;
					status?: Database["public"]["Enums"]["tool_status"];
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string;
					status?: Database["public"]["Enums"]["tool_status"];
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			is_foreman: { Args: never; Returns: boolean };
		};
		Enums: {
			project_status: "COMPLETED" | "ACTIVE";
			tool_status: "AVAILABLE" | "CHECKEDOUT" | "ARCHIVE";
			user_role: "FOREMAN" | "CREW";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			project_status: ["COMPLETED", "ACTIVE"],
			tool_status: ["AVAILABLE", "CHECKEDOUT", "ARCHIVE"],
			user_role: ["FOREMAN", "CREW"],
		},
	},
} as const;
