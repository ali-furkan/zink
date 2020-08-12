import {
    Entity,
    Column,
    ObjectIdColumn,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Exclude, Expose } from "class-transformer";
import { ObjectID } from "mongodb";

@Entity({ schema: "User" })
export class UserEntity {
    @PrimaryColumn()
    id!: number;

    @Exclude()
    @ObjectIdColumn()
    _id: ObjectID;

    @Expose()
    get tag(): string {
        return `${this.username}#${this.discriminator}`;
    }

    @Column()
    discriminator: number;

    @Column({ length: 32 })
    username: string;

    @Exclude()
    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @CreateDateColumn({})
    createdAt: string;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: number;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
