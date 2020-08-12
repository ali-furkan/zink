import { Flag } from "./snowflake";
import { SetMetadata } from "@nestjs/common";

export const Flags = (...flags: Flag[]): any =>
    SetMetadata(
        "flags",
        flags.reduce((acc, cur) => acc | cur),
    );
