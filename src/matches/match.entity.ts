import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { MatchEntity } from "src/@types/Match/entity";

@Entity({ schema: "Match" })
export class Match implements MatchEntity {
  @PrimaryGeneratedColumn()
  id;
  @Column()
  type;
  @Column()
  users;
}
