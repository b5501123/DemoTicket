declare global {
  interface Window {
    webkitAudioContext: any;
  }
}
interface I_Audio {
  name: string;
  context: AudioContext;
  sourceList: any[];
  bufferMap: {};
  mySound: {};
  playBuffer(buffer: any, soundName: string, isLoop: boolean): AudioBufferSourceNode;
  playSound: (soundName: string, isLoop: boolean) => void;
}
interface I_AudioBufferSourceNode extends AudioBufferSourceNode {
  identifier?: string;
  soundName?: string;
  cleaner?: () => void;
}
declare class Audio implements I_Audio {
  name: string;
  context: AudioContext;
  sourceList: any[];
  bufferMap: {};
  mySound: {};
  constructor(name: string, mySound?: {});
  playBuffer(buffer: any, soundName: string, isLoop?: boolean): I_AudioBufferSourceNode;
  playSound(soundName: string, isLoop?: boolean): void;
  stopSound(soundName: string): void;
  pauseSound(): void;
  stopAllSound(): void;
  loadBuffer(url: any, cb: any): void;
  unlock(): void;
}

declare const _default: {
  inArray: <T>(o: T, ary: T[]) => boolean;
  inRange: <T_1>(o: T_1, ary: T_1[]) => boolean;
  isJson: (o: any) => boolean;
  isObject: (o: any) => boolean;
  isString: (obj: any) => boolean;
  isArray: (obj: any) => boolean;
  isInt: (obj: any) => boolean;
  isGt0: (obj: any) => boolean;
  isEmail: (obj: any) => boolean;
  isEmpty: (mixed_var: any) => boolean;
  isEmpty2: (data: any) => boolean;
  isUndefined: (o: any) => boolean;
  isDefined: (o: any) => boolean;
  isUrl: (obj: any) => boolean;
  validatePassword: (para: string, len?: number) => boolean;
};

declare global {
  interface Window {
    $app: any;
  }
}
declare type ArionPostMessageData = {} | string | number | boolean | Array<any>;
interface IArionPostMessage<T = unknown> {
  company: string;
  action: string;
  data: T;
  fromRole: string;
  toRole: string;
  fromGuid: string;
  time: number;
  src: string;
}
interface ICallbackArionPostMessage<T = unknown> {
  (e: IArionPostMessage<T>): void;
}
interface ITargetWindow {
  target: any;
  fromGuid: string;
  fromRole: string;
  role: string;
  key: string;
  emit: <T = ArionPostMessageData>(eventName: string, data: T) => void;
  send: <T = ArionPostMessageData>(data: T) => void;
  alive: () => Promise<any>;
  aliveRes: (data: any) => void;
}
interface IComm {
  targetWindows: Array<ITargetWindow>;
  role: string;
  env: any;
  guid: string;
  parent: any;
  onEvent: {
    any: [];
    receive: [];
  };
  add: (target: any, role: string, key?: string) => ITargetWindow;
  findTarget: (key: string) => any;
  getAllTarget: () => Array<ITargetWindow>;
  on: (event: string, cbFn: ICallbackArionPostMessage) => boolean;
  un: (event: string, cbFn: void) => boolean;
  removeTarget: (key: string) => boolean;
}
declare class Comm implements IComm {
  static ROLE_NAME_MASTER: string;
  static ROLE_NAME_SLAVE: string;
  targetWindows: Array<any>;
  role: string;
  env: any;
  guid: string;
  parent: any;
  onEvent: {
    any: [];
    receive: [];
  };
  constructor(role: any, ucfg?: any);
  add(target: any, role: string, key?: string): ITargetWindow;
  findTarget(key: string): any;
  getAllTarget(): Array<ITargetWindow>;
  fnCall(ojbCall: any): void;
  initEvent(): void;
  on(event: string, cbFn: ICallbackArionPostMessage): boolean;
  onReceive(cbFn: ICallbackArionPostMessage): boolean;
  un(event: any, cbFn: any): boolean;
  removeTarget(
    key:
      | string
      | {
          key: string;
        },
  ): boolean;
  syscommProcess(objM: any): void;
}

declare global {
  interface Window {
    _LANG: any;
  }
}
declare var cfg: any;

declare function genVariableCSS(json: any): string;
declare function clearDomDCSS(): void;
declare function getDomDCSS(): HTMLElement;
declare function getUsedConfig(): any;
declare function setConfigToCSS(json: any): string;
declare var dcss: {
  clearDomDCSS: typeof clearDomDCSS;
  setConfigToCSS: typeof setConfigToCSS;
  genVariableCSS: typeof genVariableCSS;
  getDomDCSS: typeof getDomDCSS;
  getUsedConfig: typeof getUsedConfig;
  id: string;
};

declare type TFullDateFormat = string | number | Date;
declare function fancyTimeFormat(time: number): string;
declare function formatDate(date: any): Array<string>;
declare function format_date(dt: any, fmt: any): any;
interface IGetDateText {
  day: number;
  month: string;
  year: number;
  hour: number | string;
  min: number | string;
}
declare function getDateText(date: TFullDateFormat): IGetDateText;
declare function getDateDay(date: TFullDateFormat): string;
declare function getMonth(num: any): string;
declare function msToTime(ms: number): Array<string>;
declare function secToTime(sec: number, format: any): string;
declare function setDateByLang(num: any, currLang?: string): string;
declare function setYearByLang(num: number, currLang?: string): string;
declare function toHHMMSS(value: any): string;
declare function toMMSS(value: any): string;
declare const _default$1: {
  fancyTimeFormat: typeof fancyTimeFormat;
  formatDate: typeof formatDate;
  format_date: typeof format_date;
  getDateText: typeof getDateText;
  getDateDay: typeof getDateDay;
  getMonth: typeof getMonth;
  msToTime: typeof msToTime;
  secToTime: typeof secToTime;
  setDateByLang: typeof setDateByLang;
  setYearByLang: typeof setYearByLang;
  toMMSS: typeof toMMSS;
  toHHMMSS: typeof toHHMMSS;
};

declare const domino: {
  '0': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '1': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '2': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '3': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '4': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '5': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '6': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '7': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '8': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '9': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '10': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '11': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '12': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '13': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '14': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '15': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '16': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '17': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '18': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '19': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '20': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '21': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '22': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '23': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '24': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '25': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '26': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
  '27': {
    alias: string;
    top: number;
    bottom: number;
    id: number;
  };
};

declare const gameInfo: {
  1: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
    1: {
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  2: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
        2: string;
        3: string;
      };
    };
  };
  3: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  4: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
      };
      modeDetails: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
      };
    };
  };
  5: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
      };
      joker: {
        1: string;
        2: string;
      };
      claim: {
        0: string;
        1: string;
      };
    };
  };
  6: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
    1: {
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  7: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
        2: string;
        3: string;
      };
      joker: {
        1: string;
        2: string;
      };
    };
  };
  8: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
        2: string;
      };
      is82: {
        0: string;
        1: string;
      };
    };
  };
  9: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
      };
    };
  };
  10: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  11: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
      };
      joker: {
        1: string;
        2: string;
      };
      claim: {
        0: string;
        1: string;
      };
    };
  };
  12: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  13: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  14: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  15: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  16: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  18: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
      };
    };
  };
  19: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
      };
      is82: {
        0: string;
        1: string;
      };
    };
  };
  20: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  22: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  23: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  31: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {
        1: string;
      };
    };
  };
  32: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
  33: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      limit: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      cat: string;
      mode: {};
    };
  };
  34: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      limit: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      cat: string;
      mode: {};
    };
  };
  35: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      limit: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      cat: string;
      mode: {};
    };
  };
  36: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      limit: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      cat: string;
      mode: {};
    };
  };
  37: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      limit: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      cat: string;
      mode: {};
    };
  };
  91: {
    0: {
      ename: string;
      name: string;
      nameCap: string;
      nameUpp: string;
      gameLabel: string;
      lmsKey: string;
      lmsNameStyle: string;
      lmsGameLabelStyle: string;
      limit: string;
      cardType: string;
      cat: string;
      mode: {};
    };
  };
};

declare namespace handRank {
  namespace superRoyalFlush {
    const text: string;
    const key: string;
    const lmsKey: string;
  }
  namespace royalFlush {
    const text_1: string;
    export { text_1 as text };
    const key_1: string;
    export { key_1 as key };
    const lmsKey_1: string;
    export { lmsKey_1 as lmsKey };
  }
  namespace straightFlush {
    const text_2: string;
    export { text_2 as text };
    const key_2: string;
    export { key_2 as key };
    const lmsKey_2: string;
    export { lmsKey_2 as lmsKey };
  }
  namespace fourOfAKind {
    const text_3: string;
    export { text_3 as text };
    const key_3: string;
    export { key_3 as key };
    const lmsKey_3: string;
    export { lmsKey_3 as lmsKey };
  }
  namespace flush {
    const text_4: string;
    export { text_4 as text };
    const key_4: string;
    export { key_4 as key };
    const lmsKey_4: string;
    export { lmsKey_4 as lmsKey };
  }
  namespace fullHouse {
    const text_5: string;
    export { text_5 as text };
    const key_5: string;
    export { key_5 as key };
    const lmsKey_5: string;
    export { lmsKey_5 as lmsKey };
  }
  namespace straight {
    const text_6: string;
    export { text_6 as text };
    const key_6: string;
    export { key_6 as key };
    const lmsKey_6: string;
    export { lmsKey_6 as lmsKey };
  }
  namespace threeOfAKind {
    const text_7: string;
    export { text_7 as text };
    const key_7: string;
    export { key_7 as key };
    const lmsKey_7: string;
    export { lmsKey_7 as lmsKey };
  }
  namespace twoPair {
    const text_8: string;
    export { text_8 as text };
    const key_8: string;
    export { key_8 as key };
    const lmsKey_8: string;
    export { lmsKey_8 as lmsKey };
  }
  namespace pair {
    const text_9: string;
    export { text_9 as text };
    const key_9: string;
    export { key_9 as key };
    const lmsKey_9: string;
    export { lmsKey_9 as lmsKey };
  }
  namespace onePair {
    const text_10: string;
    export { text_10 as text };
    const key_10: string;
    export { key_10 as key };
    const lmsKey_10: string;
    export { lmsKey_10 as lmsKey };
  }
  namespace highCard {
    const text_11: string;
    export { text_11 as text };
    const key_11: string;
    export { key_11 as key };
    const lmsKey_11: string;
    export { lmsKey_11 as lmsKey };
  }
  namespace Fold {
    const text_12: string;
    export { text_12 as text };
    const key_12: string;
    export { key_12 as key };
    const lmsKey_12: string;
    export { lmsKey_12 as lmsKey };
  }
  namespace doubleStraightFlush {
    const text_13: string;
    export { text_13 as text };
    const key_13: string;
    export { key_13 as key };
    const lmsKey_13: string;
    export { lmsKey_13 as lmsKey };
  }
  namespace tripAce {
    const text_14: string;
    export { text_14 as text };
    const key_14: string;
    export { key_14 as key };
    const lmsKey_14: string;
    export { lmsKey_14 as lmsKey };
  }
  namespace tripKing {
    const text_15: string;
    export { text_15 as text };
    const key_15: string;
    export { key_15 as key };
    const lmsKey_15: string;
    export { lmsKey_15 as lmsKey };
  }
  namespace tripQueen {
    const text_16: string;
    export { text_16 as text };
    const key_16: string;
    export { key_16 as key };
    const lmsKey_16: string;
    export { lmsKey_16 as lmsKey };
  }
  namespace tripJack {
    const text_17: string;
    export { text_17 as text };
    const key_17: string;
    export { key_17 as key };
    const lmsKey_17: string;
    export { lmsKey_17 as lmsKey };
  }
  namespace tripTen {
    const text_18: string;
    export { text_18 as text };
    const key_18: string;
    export { key_18 as key };
    const lmsKey_18: string;
    export { lmsKey_18 as lmsKey };
  }
  namespace tripPicture {
    const text_19: string;
    export { text_19 as text };
    const key_19: string;
    export { key_19 as key };
    const lmsKey_19: string;
    export { lmsKey_19 as lmsKey };
  }
  namespace oneDragon {
    const text_20: string;
    export { text_20 as text };
    const key_20: string;
    export { key_20 as key };
    const lmsKey_20: string;
    export { lmsKey_20 as lmsKey };
  }
  namespace sixDewa {
    const text_21: string;
    export { text_21 as text };
    const key_21: string;
    export { key_21 as key };
    const lmsKey_21: string;
    export { lmsKey_21 as lmsKey };
  }
  namespace double {
    const text_22: string;
    export { text_22 as text };
    const key_22: string;
    export { key_22 as key };
    const lmsKey_22: string;
    export { lmsKey_22 as lmsKey };
  }
  namespace pureLarge {
    const text_23: string;
    export { text_23 as text };
    const key_23: string;
    export { key_23 as key };
    const lmsKey_23: string;
    export { lmsKey_23 as lmsKey };
  }
  namespace pureSmall {
    const text_24: string;
    export { text_24 as text };
    const key_24: string;
    export { key_24 as key };
    const lmsKey_24: string;
    export { lmsKey_24 as lmsKey };
  }
}

declare namespace jackpotName {
  namespace superRoyalFlush {
    const text: string;
    const key: string;
    const cap: string;
    const lmsKey: string;
  }
  namespace royalFlush {
    const text_1: string;
    export { text_1 as text };
    const key_1: string;
    export { key_1 as key };
    const cap_1: string;
    export { cap_1 as cap };
    const lmsKey_1: string;
    export { lmsKey_1 as lmsKey };
  }
  namespace straightFlush {
    const text_2: string;
    export { text_2 as text };
    const key_2: string;
    export { key_2 as key };
    const cap_2: string;
    export { cap_2 as cap };
    const lmsKey_2: string;
    export { lmsKey_2 as lmsKey };
  }
  namespace fourOfAKind {
    const text_3: string;
    export { text_3 as text };
    const key_3: string;
    export { key_3 as key };
    const cap_3: string;
    export { cap_3 as cap };
    const lmsKey_3: string;
    export { lmsKey_3 as lmsKey };
  }
  namespace flush {
    const text_4: string;
    export { text_4 as text };
    const key_4: string;
    export { key_4 as key };
    const cap_4: string;
    export { cap_4 as cap };
    const lmsKey_4: string;
    export { lmsKey_4 as lmsKey };
  }
  namespace fullHouse {
    const text_5: string;
    export { text_5 as text };
    const key_5: string;
    export { key_5 as key };
    const cap_5: string;
    export { cap_5 as cap };
    const lmsKey_5: string;
    export { lmsKey_5 as lmsKey };
  }
  namespace pureLarge {
    const text_6: string;
    export { text_6 as text };
    const key_6: string;
    export { key_6 as key };
    const cap_6: string;
    export { cap_6 as cap };
    const lmsKey_6: string;
    export { lmsKey_6 as lmsKey };
  }
  namespace double {
    const text_7: string;
    export { text_7 as text };
    const key_7: string;
    export { key_7 as key };
    const cap_7: string;
    export { cap_7 as cap };
    const lmsKey_7: string;
    export { lmsKey_7 as lmsKey };
  }
  namespace pureSmall {
    const text_8: string;
    export { text_8 as text };
    const key_8: string;
    export { key_8 as key };
    const cap_8: string;
    export { cap_8 as cap };
    const lmsKey_8: string;
    export { lmsKey_8 as lmsKey };
  }
  namespace sixDewa {
    const text_9: string;
    export { text_9 as text };
    const key_9: string;
    export { key_9 as key };
    const cap_9: string;
    export { cap_9 as cap };
    const lmsKey_9: string;
    export { lmsKey_9 as lmsKey };
  }
}

declare namespace _default$2 {
  export { domino };
  export { gameId };
  export { gameInfo };
  export { handRank };
  export { jackpotName };
}

declare var gameId: {};

interface EventBus {
  on: (event: string, fn: void) => boolean;
  off: (event: string, fn: void) => boolean;
  emit: (event: string, ...args: any) => boolean;
  install: (Vue: any) => void;
}
declare var eventBus: EventBus;

interface EnumDataGameInfo {
  cat: string;
  gameLabel: string;
  lmsKey: string;
  name: string;
  showName: string;
}
interface EnumDataDomino {
  alias: string;
  top: number;
  bottom: number;
}
declare function getGameInfo(gameId: number | string, aof?: number): EnumDataGameInfo | boolean;
declare const _default$3: {
  getDominoesList: (id: string | number) => EnumDataDomino;
  getGameInfo: typeof getGameInfo;
  getGameLabel: (gameId: number | string, aof?: number) => string;
  getGameName: (gameId: number | string, aof?: number) => string;
  getHandRankKey: (handRank: any) => any;
  getHandRankText: (handRank: any) => string;
  getInsMinValueByStake: (stake: number) => number;
  getJackpotName: (name: any) => string;
  getMappingValue: (idx: number, units: number, min: number, max: number) => number;
  getPokerCardRanks: (cardType: any) => string;
  getPokerModeStakes(modeId: any, blinds: any): string;
  getSliderSteps(min: number, max: number, units: number): number;
  getTournamentMode: (data: any, type: any, blindMode: any) => string;
  insCalculateSteps(
    min: number,
    max: number,
    sliderDecimal: number,
  ): {
    max: number;
    totalSteps: number;
    valueToPremium: (index: any) => any;
    premiumToValue: (premium: any) => any;
  };
  calculateSliderSteps: (budget: number, smallAmount: number) => number;
  calcRaiseMap: (min: number, max: number, smallAmount: number, decimal?: number) => Array<any>;
  raiseMap: (stepIndex: number) => number;
};

declare function abbrNum(number: any, decPlaces?: number, currentLang?: string): string;
declare function checkNumCommas(x: any, thousandSeparator?: boolean, replacement?: string): string;
declare function displayNumber(amount: any, decimal: number, displayDecimal: number): string;
declare function displayCommasNumber(
  amount: any,
  decimal: number,
  displayDecimal: number,
  replacement?: string,
): string;
declare function getFullColorHex(r: number, g: number, b: number): string;
declare function lerp(a: number, b: number, t: number): number;
declare function numberWithCommas(x: number | string, replacement?: string): string;
declare function op(num1: number, act: string, num2: number): number;
declare function ordinalSuffix(i: number, withNumber?: boolean): string;
declare function rand(): number;
declare function rgbToHex(rgb: number): string;
declare function roundDown(num: any, decimal: number): number;
declare function roundDownBalance(amount: any, decimal: any, showSecondDecimal: any): any;
declare function roundDownFixed(num: any, decimal: number): string;
declare function roundUp(num: any, decimal: number): number;
declare function roundUpBalance(amount: any, decimal: any, showSecondDecimal: any): any;
declare function roundUpFixed(num: any, decimal: number): string;
declare function sum(): number;
declare const _default$4: {
  abbrNum: typeof abbrNum;
  checkNumCommas: typeof checkNumCommas;
  displayNumber: typeof displayNumber;
  displayCommasNumber: typeof displayCommasNumber;
  getFullColorHex: typeof getFullColorHex;
  lerp: typeof lerp;
  numberWithCommas: typeof numberWithCommas;
  op: typeof op;
  ordinalSuffix: typeof ordinalSuffix;
  rand: typeof rand;
  rgbToHex: typeof rgbToHex;
  roundDown: typeof roundDown;
  roundDownBalance: typeof roundDownBalance;
  roundDownFixed: typeof roundDownFixed;
  roundUp: typeof roundUp;
  roundUpBalance: typeof roundUpBalance;
  roundUpFixed: typeof roundUpFixed;
  sum: typeof sum;
};

declare function getHeadUrl(imgUrl: string): string;
declare function getRoute(): string;
declare const _default$5: {
  getHeadUrl: typeof getHeadUrl;
  getRoute: typeof getRoute;
};

declare function toTitleCase(str: string): string;
declare function translate(res: string, opt?: string | undefined): string;
declare function ucFirst(str: string): string;
declare function getStrLen(str: any): number;
declare function str_ireplace(search: any, replace: any, subject: any): string;
declare function trim(str: string): string;
declare function ltrim(str: string): string;
declare function rtrim(str: string): string;
declare function trimText(text: string, maxChars: number): string;
declare function truncate(str: string, len: number): string;
declare function onlyLetters(str: string): string;
declare function onlyLettersNums(str: string): string;
declare function lpad(str: string, len: number | undefined, padstr: string | undefined): string;
declare function rpad(str: string, len: number | undefined, padstr: string | undefined): string;
declare const _default$6: {
  getStrLen: typeof getStrLen;
  lpad: typeof lpad;
  onlyLetters: typeof onlyLetters;
  onlyLettersNums: typeof onlyLettersNums;
  rpad: typeof rpad;
  str_ireplace: typeof str_ireplace;
  toTitleCase: typeof toTitleCase;
  translate: typeof translate;
  trim: typeof trim;
  trimText: typeof trimText;
  ltrim: typeof ltrim;
  rtrim: typeof rtrim;
  truncate: typeof truncate;
  ucFirst: typeof ucFirst;
};

declare var syncLoader: {
  _loadScript: (url: string, callback?: any, mycallback?: any) => void;
  load: (items: any, mycallback: any, iteration?: any) => void;
  loadP: (items: any) => Promise<any>;
};

declare function updateProfile(key: string, val: any, callback?: any): void;
declare function setQuickBetSetting(raiseBtn: any): void;
declare function getMyGems(): any;
declare function setMyGems(gems: any): any;
declare function getSid(): string;
declare function setRebuyPreferences(settings: any): void;
declare function setUserPreferences(): void;
declare const _default$7: {
  getMyGems: typeof getMyGems;
  setMyGems: typeof setMyGems;
  getSid: typeof getSid;
  setQuickBetSetting: typeof setQuickBetSetting;
  setRebuyPreferences: typeof setRebuyPreferences;
  setUserPreferences: typeof setUserPreferences;
  updateProfile: typeof updateProfile;
};

declare function getGuid(): string;
declare const _default$8: {
  ArrayBufferToBase64: (arrayBuffer: any) => string;
  base64ToBlob: (res: any, mime: any) => Blob;
  checkBrowser: () => boolean;
  checkArrRepeatVal<T>(arr: T[]): boolean;
  clone: <T_1>(obj: T_1) => T_1;
  fullScreen: () => void;
  smolScreen: () => void;
  lockScreen: (orientation: any) => void;
  getDefaultLanguage: () => string;
  setDefaultLanguage: (lang: string) => void;
  getDeviceType: (device: any) => number;
  getGuid: typeof getGuid;
  getLocation: (callback: PositionCallback, errorCallback: PositionErrorCallback) => void;
  getOS: () => string;
  getWindowLayer: () => number;
  loadScript: (script_name: string) => void;
  loginPassword: (password: string) => string;
  toJson: (o: any) => any;
  md5: (password: string) => string;
};

declare const libs: {
  audio: typeof Audio;
  check: typeof _default;
  comm: typeof Comm;
  config: typeof cfg;
  css: typeof dcss;
  date: typeof _default$1;
  enum: typeof _default$2;
  evbus: typeof eventBus;
  game: typeof _default$3;
  num: typeof _default$4;
  path: typeof _default$5;
  str: typeof _default$6;
  syncLoader: typeof syncLoader;
  user: typeof _default$7;
  util: typeof _default$8;
};

export default libs;
