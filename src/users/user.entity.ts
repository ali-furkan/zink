import {
  Entity,
  Column,
  ObjectIdColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude, Expose } from "class-transformer";

@Entity({ schema: "User" })
export class User {
  @PrimaryColumn()
  id!: number;

  @Exclude()
  @ObjectIdColumn()
  _id!: number;

  @Expose()
  get tag(): string {
    return `${this.username}#${this.discriminator}`;
  }

  @Column({})
  discriminator: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @CreateDateColumn({})
  created_At: string;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
