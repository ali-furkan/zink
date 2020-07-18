import { MatchTypes } from "./type";

export interface MatchEntity {
  id: number;
  type: MatchTypes;
  users: Array<{
    id: string;
    name: string;
  }>;
}
