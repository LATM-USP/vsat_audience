import type { User } from "../types.js";

export type GetUser = (email: string) => Promise<User | undefined>;

export type CreateUser = (user: User) => Promise<User>;
