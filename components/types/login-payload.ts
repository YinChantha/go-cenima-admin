import { User } from "./user";

export type LoginPayload = {
  email?: string;
  phoneNumber?: string;
  hash?: string;
  password: string;
  pushToken?: string;
  deviceId?: string;
  deviceName?: string;
  osType?: string;
  osVersion?: string;
  isRecover?: boolean;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};