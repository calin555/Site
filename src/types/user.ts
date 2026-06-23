export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  roleSlug: string;
  image?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PublicUser = Omit<UserRecord, "passwordHash">;

export function toPublicUser(user: UserRecord): PublicUser {
  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}
