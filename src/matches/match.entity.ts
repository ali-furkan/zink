import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ObjectIdColumn,
} from "typeorm";
import { MatchTypes } from "src/@types/Match/type";
import { Exclude } from "class-transformer";
import { ObjectID } from "mongodb";

@Entity({ schema: "Match" })
export class MatchEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Exclude()
    @ObjectIdColumn()
    _id!: ObjectID;

    @Column()
    type: MatchTypes;

    @Column()
    status: boolean;

    @Column()
    users: { id: number }[];

    @Column()
    winner: { id: number };
}
