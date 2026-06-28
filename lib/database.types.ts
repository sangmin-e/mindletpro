export type Database = {
  public: {
    Tables: {
      memos: {
        Row: {
          id: string;
          title: string;
          content: string;
          password_hash: string;
          created_at: string;
          position_index: number;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          password_hash: string;
          created_at?: string;
          position_index?: number;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          password_hash?: string;
          created_at?: string;
          position_index?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
