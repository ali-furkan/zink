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
    @PrimaryColumn({ nullable: false, unique: true })
    id: string;

    @Exclude()
    @ObjectIdColumn()
    _id: ObjectID;

    @Expose()
    get tag(): string {
        return `${this.username}#${this.discriminator}`;
    }

    @Column({ nullable: false })
    flags: number;

    @Column({ nullable: false })
    discriminator: number;

    @Column({ default: 100 })
    coins: number;

    @Column({ default: 5 })
    gems: number;

    @Column({ default: 0 })
    xp: number;

    @Column({ length: 32 })
    username: string;

    @Exclude()
    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
