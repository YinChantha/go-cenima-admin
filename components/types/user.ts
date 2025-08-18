export type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email: string;
  role: string;
  restaurantId: string;
};

export type LoginResponse = {
  email: string;
  role: string;
}