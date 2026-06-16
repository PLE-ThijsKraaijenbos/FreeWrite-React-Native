export type AvatarItem = {
  id: string;
  name: string;
  param_key: string;
  param_value: string;
  price: number;
  is_unlocked: boolean;
  is_equipped: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  // Derived server-side from equipped items: a {param_key: param_value} map the
  // client turns into a DiceBear URL. The avatar is no longer stored as a URL.
  avatar: Record<string, string>;
  substance: string;
  usage_duration: string;
  goal: string;
  usage_times: string;
  frequency: string;
  previous_attempts: string;
  coins: number;
};

export type User = {
  id: string;
  email: string;
  last_login: string | null;
  profile: UserProfile | null;
};
