export const ZINK_EPOCH = 1594923000;

export enum Flag {
  PASSIVE_USER = 1 << 0,
  ACTIVE_USER = 1 << 1,
  CREATE_MATCH = 1 << 2,
  CREATE_USER = 1 << 3,
  DEV = 1 << 4,
}

export enum Type {
  USER = 1 << 0,
  MATCH = 1 << 1,
  SYSTEM = 1 << 2,
}

const Types = {
  USER: 1 << 0,
  MATCH: 1 << 1,
  SYSTEM: 1 << 2,
};

const Flags = {
  PASSIVE_USER: 1 << 0,
  ACTIVE_USER: 1 << 1,
  CREATE_MATCH: 1 << 2,
  CREATE_USER: 1 << 3,
  DEV: 1 << 4,
};

export interface ISnowflake {
  id: number;
  timestamp: number;
  type: string;
  flags: string[];
  count: number;
}

export class SnowflakeFactory {
  private ZINK_EPOCH = 1593550800000;
  private flag: number;
  private type: number;
  private count = 0;

  constructor(iflags: Flag[], itype?: Type) {
    this.flag = iflags.reduce((acc, cur) => acc + cur);
    this.type = itype || Type.USER;
  }

  next(iflags?: Flag[]): number {
    this.count += 1;
    const BwUnixMs = (Date.now() - this.ZINK_EPOCH).toString(2);
    let BwType = this.type.toString(2),
      BwWorker = (iflags
        ? iflags.reduce((acc, cur) => acc | cur)
        : this.flag
      ).toString(2),
      BwCount = (this.count & 0xfff).toString(2);

    while (BwCount.length < 12) {
      if (BwType.length < 5) BwType = "0" + BwType;
      if (BwWorker.length < 5) BwWorker = "0" + BwWorker;
      BwCount = "0" + BwCount;
    }

    const res = BwUnixMs + BwType + BwWorker + BwCount;
    console.log("timestamp", parseInt(BwUnixMs, 2));
    console.log("id", parseInt(res, 2));
    console.log("BwType", parseInt(BwType, 2));
    console.log("BwWorker", parseInt(BwWorker, 2));
    console.log("BwCount", parseInt(BwCount, 2));
    console.log(res.length);
    return parseInt(res, 2);
  }

  serialization(id: number): ISnowflake {
    if (!id) return;
    const flags = Object.entries(Flags)
      .filter(f => f[1] == (id & 0x1f000) >> 12)
      .map(f => f[0]);
    return {
      id,
      timestamp: (id >> 22) + this.ZINK_EPOCH,
      type: Object.entries(Types).find(t => t[1] == (id & 0x3e0000) >> 17)[0],
      flags,
      count: id & 0xfff,
    };
  }
}
