import type { User } from "../authentication/types";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
