export type UserProfile = {
  id: string;
  name: string;
  avatar_url: string;
  substance: string;
  usage_duration: string;
  goal: string;
  usage_times: string;
  frequency: string;
  previous_attempts: string;
};

export type User = {
  id: string;
  email: string;
  last_login: string | null;
  profile: UserProfile | null;
};
