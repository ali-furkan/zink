import { MatchTypes } from "./type";

export interface MatchEntity {
    id: string;
    type: MatchTypes;
    status: boolean;
    winner: { id: number };
    users: Array<{
        id: number;
    }>;
}
