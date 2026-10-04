export type Profile = {
  id: string;

  username:
    | string
    | null;

  display_name:
    | string
    | null;

  favourite_platform:
    | string
    | null;

  bio:
    | string
    | null;

  is_public: boolean;

  created_at: string;
};