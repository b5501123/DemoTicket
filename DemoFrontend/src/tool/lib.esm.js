import crypto from 'crypto';

var name = 'lib';
var version = '0.2.5';
var subVer = '';
var minigameName = 'minigame';
var minigameVersion = '1.0.3';
var description = 'Arionlabs UI Library';
var main = 'dist/lib.js';
var module$1 = 'src/main.ts';
var scripts = {
  all: 'npm run umd && npm run es && npm run build',
  build: 'rollup -f umd --config rollup.ts.config.js --flag-use-minify',
  umd: 'rollup -f umd --config rollup.ts.config.js',
  es: 'rollup -f es --config rollup.ts.config.js',
  minigame:
    'rollup -f umd --config rollup.minigame.config.js -n minigame_lib -i src_arionsdk/minigame.ts -o dist/minigame_lib.js',
  cocos: 'rollup -f umd --config rollup.cocos.config.js',
  cocoses: 'rollup -f es --config rollup.cocos.config.js',
  test: 'mocha',
  testBuild: 'mocha target=lib.min.js ./test',
};
var repository = {
  type: 'git',
  url: 'git+https://gitlab.com/melixlerong/arionlabs-ui-library.git',
};
var keywords = ['lib'];
var author = 'Melix Yen';
var license = 'ISC';
var devDependencies = {
  '@babel/core': '^7.0.0',
  '@babel/preset-env': '^7.0.0',
  '@rollup/plugin-commonjs': '11.0.2',
  '@rollup/plugin-json': '^4.0.3',
  '@rollup/plugin-node-resolve': '^7.1.3',
  rollup: '^1.3.1',
  'rollup-plugin-babel': '^4.3.2',
  'rollup-plugin-babel-minify': '^10.0.0',
  'rollup-plugin-dts': '^3.0.1',
  'rollup-plugin-typescript2': '^0.30.0',
  tslib: '^2.1.0',
  typescript: '^4.2.3',
};
var dependencies = {
  '@babel/polyfill': '^7.2.5',
  'crypto-js': '^4.0.0',
  'lodash-es': '^4.17.15',
  moment: '^2.26.0',
  'rollup-plugin-terser': '^7.0.2',
  store: '^2.0.12',
};
var bugs = {
  url: 'https://gitlab.com/melixlerong/arionlabs-ui-library/issues',
};
var homepage = 'https://gitlab.com/melixlerong/arionlabs-ui-library#readme';
var pkg = {
  name: name,
  version: version,
  subVer: subVer,
  minigameName: minigameName,
  minigameVersion: minigameVersion,
  description: description,
  main: main,
  module: module$1,
  scripts: scripts,
  repository: repository,
  keywords: keywords,
  author: author,
  license: license,
  devDependencies: devDependencies,
  dependencies: dependencies,
  bugs: bugs,
  homepage: homepage,
};

var defaultMySound = {
  cardCrack: 'assets/sfx/39-Game-Card-Crack.mp3',
};
class Audio {
  constructor(name, mySound = defaultMySound) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.name = name;
    var context = new AudioContext();
    var sourceList = [];
    var bufferMap = {};
    if (context.state === 'suspended' && 'ontouchstart' in window) {
      document.body.addEventListener('touchstart', this.unlock, false);
      document.body.addEventListener('touchend', this.unlock, false);
    }
    this.context = context;
    this.sourceList = sourceList;
    this.bufferMap = bufferMap;
    this.mySound = mySound;
  }
  playBuffer(buffer, soundName, isLoop = false) {
    let context = this.context;
    context.resume();
    let source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
    source.identifier = Date.now() + '' + Math.random();
    source.soundName = soundName;
    if (isLoop) {
      source.loop = true;
    }
    this.sourceList.push(source);
    source.cleaner = () => {
      this.sourceList = this.sourceList.filter((element) => {
        if (element.identifier == source.identifier) {
          return false;
        } else {
          return true;
        }
      });
    };
    source.onended = source.cleaner;
    return source;
  }
  playSound(soundName, isLoop = false) {
    let url = this.mySound[soundName];
    if (url) {
      let soundBuffer = this.bufferMap[soundName];
      if (soundBuffer) {
        this.playBuffer(soundBuffer, soundName, isLoop);
      } else {
        this.loadBuffer(url, (buffer) => {
          this.bufferMap[soundName] = buffer;
          this.playBuffer(buffer, soundName, isLoop);
        });
      }
    }
  }
  stopSound(soundName) {
    this.sourceList.forEach((s) => {
      if (s.soundName == soundName) {
        try {
          s.stop(0);
        } catch (ex) {}
      }
    });
  }
  pauseSound() {
    this.sourceList.forEach((s) => {
      try {
        s.stop(0);
      } catch (ex) {}
    });
  }
  stopAllSound() {
    this.sourceList.forEach((s) => {
      s.onended = null;
      try {
        s.stop(0);
      } catch (ex) {}
    });
    this.sourceList = [];
  }
  loadBuffer(url, cb) {
    let context = this.context;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
      if (request.status == 200 || request.status == 0) {
        context.decodeAudioData(
          request.response,
          function (buffer) {
            return cb(buffer);
          },
          function (e) {
            console.log('Error decoding audio data:' + e);
          },
        );
      } else {
        console.log("Audio didn't load successfully; error code:" + request.statusText);
      }
    };
    request.send();
  }
  unlock() {
    if (this.context && this.context.resume) {
      this.context.resume().then(function () {
        document.body.removeEventListener('touchstart', this.unlock);
        document.body.removeEventListener('touchend', this.unlock);
      });
    }
  }
}

function toTitleCase(str) {
  // # app.pubFunc.js
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
function translate(res, opt = undefined) {
  // # app.extFunc.js
  //1. Check if language in _LANG, replace it
  if (typeof _LANG == 'object') {
    if (_LANG[res]) res = _LANG[res];
  }
  if (opt == 'upper') res = res.toUpperCase();
  else if (opt == 'lower') res = res.toLowerCase();
  else if (opt == 'capitalize') res = toTitleCase(res);
  else if (opt == 'ucfirst') res = ucFirst(res);
  return res;
}
function ucFirst(str) {
  // # app.pubFunc.js
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function getStrLen(str) {
  //from: http://blog.csdn.net/testcs_dn/article/details/21412303
  if (str == null) return 0;
  if (typeof str != 'string') {
    str += '';
  }
  return str.replace(/[^\x00-\xff]/g, '01').length;
}
function str_ireplace(search, replace, subject) {
  // discuss at: http://phpjs.org/functions/str_ireplace/
  // example 1: str_ireplace('l', 'l', 'HeLLo');
  // returns 1: 'Hello'
  // example 2: str_ireplace('$', 'foo', '$bar');
  // returns 2: 'foobar'
  var i,
    k = '';
  var searchl = 0;
  var reg;
  var escapeRegex = function (s) {
    return s.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1');
  };
  search += '';
  searchl = search.length;
  if (Object.prototype.toString.call(replace) !== '[object Array]') {
    replace = [replace];
    if (Object.prototype.toString.call(search) === '[object Array]') {
      // If search is an array and replace is a string,
      // then this replacement string is used for every value of search
      while (searchl > replace.length) {
        replace[replace.length] = replace[0];
      }
    }
  }
  if (Object.prototype.toString.call(search) !== '[object Array]') {
    search = [search];
  }
  while (search.length > replace.length) {
    // If replace has fewer values than search,
    // then an empty string is used for the rest of replacement values
    replace[replace.length] = '';
  }
  if (Object.prototype.toString.call(subject) === '[object Array]') {
    // If subject is an array, then the search and replace is performed
    // with every entry of subject , and the return value is an array as well.
    for (k in subject) {
      if (subject.hasOwnProperty(k)) {
        subject[k] = str_ireplace(search, replace, subject[k]);
      }
    }
    return subject;
  }
  searchl = search.length;
  for (i = 0; i < searchl; i++) {
    reg = new RegExp(escapeRegex(search[i]), 'gi');
    subject = subject.replace(reg, replace[i]);
  }
  return subject;
}
// Removes any white space to the right and left of the string
function trim(str) {
  if (str == null) return str;
  return String(str).replace(/^\s+|\s+$/g, '');
}
// Removes any white space to the left of the string
function ltrim(str) {
  return str.replace(/^\s+/, '');
}
// Removes any white space to the right of the string
function rtrim(str) {
  return str.replace(/\s+$/, '');
}
function trimText(text, maxChars) {
  return text.length > maxChars ? text.substring(0, maxChars) + '..' : text;
}
// Truncate a string to a given length
function truncate(str, len) {
  if (str.length > len) {
    str = str.substring(0, len);
  }
  return str;
}
// Return a string only containing the letters a to z
function onlyLetters(str) {
  return str.toLowerCase().replace(/[^a-z]/g, '');
}
// Return a string only containing the letters a to z and numbers
function onlyLettersNums(str) {
  return str.toLowerCase().replace(/[^a-z,0-9,-]/g, '');
}
function pad(str, len, padstr, dir) {
  if (typeof len == 'undefined') {
    len = 0;
  }
  if (typeof padstr == 'undefined') {
    padstr = ' ';
  }
  if (typeof dir == 'undefined') {
    dir = 3;
  } //STR_PAD_BOTH; }
  str = String(str);
  if (len + 1 >= str.length) {
    switch (dir) {
      case 1: //STR_PAD_LEFT:
        str = Array(len + 1 - str.length).join(padstr) + str;
        break;
      case 3: //STR_PAD_BOTH:
        var padlen = len - str.length;
        var right = Math.ceil(padlen / 2);
        var left = padlen - right;
        str = Array(left + 1).join(padstr) + str + Array(right + 1).join(padstr);
        break;
      default:
        str = str + Array(len + 1 - str.length).join(padstr);
        break;
    } // switch
  }
  return str;
}
function lpad(str, len, padstr) {
  return pad(str, len, padstr, 1);
}
function rpad(str, len, padstr) {
  return pad(str, len, padstr, 2);
}
var str = {
  getStrLen: getStrLen,
  lpad: lpad,
  onlyLetters: onlyLetters,
  onlyLettersNums: onlyLettersNums,
  rpad: rpad,
  str_ireplace: str_ireplace,
  toTitleCase: toTitleCase,
  translate: translate,
  trim: trim,
  trimText: trimText,
  ltrim: ltrim,
  rtrim: rtrim,
  truncate: truncate,
  ucFirst: ucFirst,
};

var check = {
  inArray: function (o, ary) {
    // return (ary.indexOf(o) != -1);
    var bFound = false;
    for (var i = 0, len = ary.length; i < len; i++) {
      if (o == ary[i]) {
        bFound = true;
        break;
      }
    }
    return bFound;
  },
  inRange: function (o, ary) {
    var bRet = false;
    if (ary.length == 2) {
      bRet = o >= ary[0] && o <= ary[1];
    }
    return bRet;
  },
  isJson: function (o) {
    var str = '';
    if (this.isObject(o)) {
      str = JSON.stringify(o);
    } else if (this.isString(o)) {
      str = o;
    } else {
      return false;
    }
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },
  isObject: function (o) {
    return typeof o === 'object' && o !== null;
  },
  isString: function (obj) {
    return typeof obj == 'string';
  },
  // Is an object a array
  isArray: function (obj) {
    return (
      obj &&
      !obj.propertyIsEnumerable('length') &&
      typeof obj === 'object' &&
      typeof obj.length === 'number'
    );
  },
  // Is an object a int
  isInt: function (obj) {
    var re = /^\d+$/;
    return re.test(obj);
  },
  // greater than 0
  isGt0: function (obj) {
    var ret = false;
    if (this.isInt(str.trim(obj))) {
      //maybe contain "\n", so must trim
      var n = parseInt(obj);
      ret = n > 0;
    }
    return ret;
  },
  // Is an object a email address
  isEmail: function (obj) {
    if (this.isString(obj)) {
      return obj.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi) !== null;
    } else {
      return false;
    }
  },
  isEmpty: function (mixed_var) {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
      if (mixed_var === emptyValues[i]) {
        return true;
      }
    }
    if (typeof mixed_var === 'object') {
      for (key in mixed_var) {
        return false;
      }
      return true;
    }
    return false;
  },
  isEmpty2: function (data) {
    if (typeof data == 'number') {
      return false;
    }
    if (typeof data == 'undefined' || data === null) {
      return true;
    }
    if (typeof data.length != 'undefined') {
      return data.length == 0;
    }
    var count = 0;
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        count++;
      }
    }
    return count == 0;
  },
  isUndefined: function (o) {
    return typeof o === 'undefined';
  },
  isDefined: function (o) {
    return !(typeof o === 'undefined');
  },
  // Is an object a URL
  isUrl: function (obj) {
    if (this.isString(obj)) {
      var re = new RegExp(
        '^(http|https)://([a-zA-Z0-9.-]+(:' +
          '[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|' +
          '[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]).(25[0-5]|2' +
          '[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0).' +
          '(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|' +
          '[1-9]|0).(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]' +
          '{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9-]+.)*[a-zA-Z' +
          '0-9-]+.(com|edu|gov|int|mil|net|org|biz|arpa|info|name' +
          '|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(/($|[a-z' +
          "A-Z0-9.,?'\\+&%$#=~_-]+))*$",
      );
      return obj.match(re);
    } else {
      return false;
    }
  },
  validatePassword: function (para, len = 6) {
    // # app.pubFunc.js
    var Exp = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+(?!.*\s).*$/i;
    return para == '' ? false : Exp.test(para) && para.length >= len;
  },
};

const POST_MESSAGE_COMPANY = 'arionlabs';
const ROLE_NAME_MASTER = 'master';
const ROLE_NAME_SLAVE = 'slave';
const BODY_LOBBY_1 = 'ccclient';
const BODY_LOBBY_2 = 'vueLobby';
const CMD_ACT_CONSOLE = 'console'; //Print something by console.log , parameter data {text:"text"}
const CMD_ACT_SEND = 'send'; // Send information , parameter data {tell:"xxx", what:"vvv"}
const CMD_ACT_CALL = 'call'; // Call some method , parameter data {fn:"function name", param:[param1, param2, param3 ...]}
const CMD_ACT_SYSCOMM = 'syscomm'; // System communication , parameter data {do:"alive", fromGuid:"xxx-xxxx-xxxxxx-xx"}
const SYSCOMM_DO_ALIVE = 'alive';
const SYSCOMM_DO_ALIVERES = 'aliveres';
var regex_IS_ROLE_NAME = new RegExp(ROLE_NAME_MASTER + '|' + ROLE_NAME_SLAVE);
function getGuid() {
  // # app.pubFunc.js
  return 'xxxxxxxx-xxxx-0xxx-yxyx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      var string = (Math.random() * 16) | 0;
      return string.toString(16);
    })
    .toUpperCase();
}
function printLog(...args) {
  console.log.apply(this, arguments);
}
var myEnv = {};
function detectEnv(role) {
  var env = {
    body: '',
  };
  switch (role) {
    case ROLE_NAME_MASTER:
      if (window.$app) {
        env.body = BODY_LOBBY_1;
      } else if (document.querySelector('#app .lobby')) {
        env.body = BODY_LOBBY_2;
      }
      break;
  }
  return env;
}
function init(role, ucfg) {
  var instance = new Comm(role, ucfg);
  Comm['instance'] = instance;
  return instance;
}
var commBased = {
  init: init,
  ROLE_NAME_MASTER: ROLE_NAME_MASTER,
  ROLE_NAME_SLAVE: ROLE_NAME_SLAVE,
};
function pack(act, objMsg, fromRole, toRole, fromGuid) {
  var obj = {
    company: POST_MESSAGE_COMPANY,
    action: act,
    data: objMsg,
    fromRole: fromRole,
    toRole: toRole,
    fromGuid: fromGuid,
    time: Date.now(),
    src: location.href.toString(),
  };
  return obj;
}
function checkIsOurMessage(e) {
  if (e.data && typeof e.data == 'object') {
    if (e.data.company == POST_MESSAGE_COMPANY) return e.data;
  }
  return false;
}
// ======= Master public function start ==========
var fnObj = {
  updateUserInfo: function () {
    var flg = true;
    switch (myEnv.body) {
      case BODY_LOBBY_1:
        window.$app.clubInfo.getMyClubInfoApi(function (res) {
          window.$app.navMenu.setHeader(res);
        });
        break;
      default:
        printLog('lib.comm instance not support updateUserInfo.');
        flg = false;
        break;
    }
    return flg;
  },
};
// ======= Master public function end ==========
var aliveEventObject = {};
class targetWindow {
  constructor(objA) {
    var me = this;
    for (var k in objA) {
      this[k] = objA[k];
    }
    for (let lbFn in fnObj) {
      this[lbFn] = function () {
        var ary = [...arguments];
        var item = pack(CMD_ACT_CALL, { fn: lbFn, param: ary }, me.fromRole, me.role, me.fromGuid);
        if (me.target && typeof me.target.postMessage == 'function')
          me.target.postMessage(item, '*');
      };
    }
  }
  con(text) {
    var item = pack(CMD_ACT_CONSOLE, text, this.fromRole, this.role, this.fromGuid);
    if (this.target && typeof this.target.postMessage == 'function')
      this.target.postMessage(item, '*');
  }
  emit(eventName, data) {
    if (typeof eventName != 'string') throw 'lib.comm emit event name not a string.';
    var item = pack(eventName, data, this.fromRole, this.role, this.fromGuid);
    if (this.target && typeof this.target.postMessage == 'function')
      this.target.postMessage(item, '*');
  }
  send(data) {
    var item = pack(CMD_ACT_SEND, data, this.fromRole, this.role, this.fromGuid);
    if (this.target && typeof this.target.postMessage == 'function')
      this.target.postMessage(item, '*');
  }
  alive() {
    let rndGuidKey = getGuid();
    var data = {
      do: SYSCOMM_DO_ALIVE,
      rndGuidKey: rndGuidKey,
    };
    var item = pack(CMD_ACT_SYSCOMM, data, this.fromRole, this.role, this.fromGuid);
    return new Promise((resolve) => {
      aliveEventObject[rndGuidKey] = {
        key: this.key,
        target: this.target,
        role: this.role,
        time: item.time,
        company: item.company,
        cbFn: function (flagAlive) {
          var res = Object.assign({ alive: flagAlive }, this);
          delete res.cbFn;
          resolve(res);
        },
      };
      setTimeout(() => {
        if (aliveEventObject[rndGuidKey]) {
          aliveEventObject[rndGuidKey].cbFn(false);
        }
      }, 2000);
      if (this.target && typeof this.target.postMessage == 'function')
        this.target.postMessage(item, '*');
    });
  }
  aliveRes(data) {
    data.do = SYSCOMM_DO_ALIVERES;
    var item = pack(CMD_ACT_SYSCOMM, data, this.fromRole, this.role, this.fromGuid);
    if (this.target && typeof this.target.postMessage == 'function')
      this.target.postMessage(item, '*');
  }
}
class Comm {
  constructor(role, ucfg = {}) {
    if (typeof window == 'undefined') throw 'Not in browser, lib.comm can not work';
    // Please send a role from ROLE_NAME_XXX to tell library who you are.
    this.role = '';
    this.targetWindows = [];
    this.initEvent();
    this.role = role;
    this.env = detectEnv(role);
    this.guid = getGuid();
    Object.assign(myEnv, this.env);
    Object.assign(this, ucfg);
    if (ucfg.autoParent) {
      if (window.parent != window) {
        this.parent = this.add(window.parent, ROLE_NAME_MASTER);
      } else if (window.opener && window.opener != window) {
        this.parent = this.add(window.opener, ROLE_NAME_MASTER);
      } else {
        this.parent = new targetWindow({
          dom: window,
          key: 'fakeParent',
          target: window,
          fromRole: ROLE_NAME_MASTER,
          fromGuid: this.guid,
          role: ROLE_NAME_MASTER,
        });
      }
    }
  }
  add(target, role, key = role) {
    // target: send a iframe contentWindow or popup instance
    // role: lobby , game , store , event
    // key: a name to be targetWindows key
    const myPath = 'lib.comm.add';
    if (typeof target == 'string') {
      target = document.querySelector(target);
      if (!target) throw myPath + ' can not find parameter target.';
    }
    if (typeof target != 'object') throw myPath + ' parameter target is not a object.';
    if (!regex_IS_ROLE_NAME.test(role))
      throw myPath + ' parameter role is not correctly (' + role + ')';
    // if(!key) key = role;
    if (typeof key != 'string') throw myPath + ' parameter key is not a string.';
    if (this.findTarget(key)) key = key + '_' + Date.now();
    var crossObject = target;
    try {
      if (target.nodeName && target.src && target.nodeName.toUpperCase() == 'IFRAME') {
        crossObject = target.contentWindow;
      }
    } catch (e) {
      console.log(e, myPath);
    }
    var targetEl = new targetWindow({
      dom: target,
      key: key,
      target: crossObject,
      fromRole: this.role,
      fromGuid: this.guid,
      role: role,
    });
    this.targetWindows.push(targetEl);
    return targetEl;
  }
  findTarget(key) {
    var rt = false;
    for (var i = 0; i < this.targetWindows.length; i++) {
      if (this.targetWindows[i].key == key) {
        rt = this.targetWindows;
        break;
      }
    }
    return rt;
  }
  getAllTarget() {
    return this.targetWindows;
  }
  fnCall(ojbCall) {
    var data = ojbCall.data;
    if (data.fn && typeof fnObj[data.fn] == 'function') {
      fnObj[data.fn].apply(this, data.param);
    }
  }
  initEvent() {
    this.onEvent = {
      any: [],
      receive: [],
    };
    window.addEventListener('message', (e) => {
      var result = checkIsOurMessage(e);
      if (result) {
        this.onEvent.any.forEach((cbFn) => {
          if (typeof cbFn == 'function') cbFn(result);
        });
        switch (result.action) {
          case CMD_ACT_SEND:
            this.onEvent.receive.forEach((cbFn) => {
              if (typeof cbFn == 'function') cbFn(result);
            });
            break;
          case CMD_ACT_CONSOLE:
            console.log(result.data);
            break;
          case CMD_ACT_CALL:
            this.fnCall(e.data);
            break;
          case CMD_ACT_SYSCOMM:
            this.syscommProcess(e.data);
            break;
        }
        if (
          result.action &&
          this.onEvent[result.action] &&
          this.onEvent[result.action].length > 0
        ) {
          this.onEvent[result.action].forEach((cbFn) => {
            if (typeof cbFn == 'function') cbFn(result);
          });
        }
      }
    });
  }
  on(event, cbFn) {
    if (!this.onEvent[event]) this.onEvent[event] = [];
    var ev = this.onEvent[event];
    for (var i = 0; i < ev.length; i++) {
      if (ev[i] == cbFn) return false;
    }
    this.onEvent[event].push(cbFn);
    return true;
  }
  onReceive(cbFn) {
    return this.on('receive', cbFn);
  }
  un(event, cbFn) {
    if (!this.onEvent[event]) return false;
    var ev = this.onEvent[event];
    for (var i = 0; i < ev.length; i++) {
      if (ev[i] == cbFn) {
        this.onEvent[event].splice(i, 1);
        return true;
      }
    }
    return false;
  }
  removeTarget(key) {
    if (typeof key == 'object') key = key.key;
    if (!key) return false;
    for (var i = 0; i < this.targetWindows.length; i++) {
      if (this.targetWindows[i].key == key) {
        this.targetWindows.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  syscommProcess(objM) {
    switch (objM.data.do) {
      case SYSCOMM_DO_ALIVE:
        this.parent.aliveRes(objM.data);
        break;
      case SYSCOMM_DO_ALIVERES:
        if (aliveEventObject[objM.data.rndGuidKey]) {
          aliveEventObject[objM.data.rndGuidKey].cbFn(true);
          delete aliveEventObject[objM.data.rndGuidKey];
        }
        break;
    }
  }
}
Object.assign(Comm, commBased);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
          resolve(value);
        });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator['throw'](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

const def = {
  LANG_EN: 'en',
  LANG_CHS: 'cn',
  LANG_CHT: 'tw',
  PRODUCT_NAME_EDEN: 'eden',
  PRODUCT_NAME_CTB: 'ctb',
  PRODUCT_NAME_1P_APP: 'onepokerapp',
  PRODUCT_NAME_1P_WEB: 'onepokerweb',
};
let defaultValue = {
  cacheVersion: 'r' + Math.random() * 10,
  abbreviation_en_thousand: 'k',
  abbreviation_en_million: 'm',
  abbreviation_en_billion: 'b',
  abbreviation_en_trillion: 't',
  abbreviation_tw_bai: '百',
  abbreviation_tw_qian: '千',
  abbreviation_tw_wan: '萬',
  abbreviation_tw_yi: '億',
  abbreviation_cn_bai: '百',
  abbreviation_cn_qian: '千',
  abbreviation_cn_wan: '万',
  abbreviation_cn_yi: '亿',
  string_date_zh_day: '日',
  string_date_zh_year: '年',
  apiServerUrl: '',
  decPlaces: 0,
  decimal: 0,
  thousandSeparator: true,
  gameApiUrl: '',
  gameServerUrl: '',
  lang: def.LANG_EN,
  languageFileUrl: '',
  modeName: def.PRODUCT_NAME_EDEN,
};
function appendToCfg(key, value) {
  let protectTags = ['def', 'setEnv', 'setStore', 'store'];
  if (protectTags.indexOf(key) != -1) return false;
  cfg[key] = value;
  return true;
}
let flagIsInstalledVue = false;
function fetchLang(val, path) {
  return __awaiter(this, void 0, void 0, function* () {
    var lang = cfg.lang || 'en';
    if (val) lang = val;
    path = path || cfg.languageFileUrl;
    var url = path + 'lang_' + lang + '.json';
    return fetch(url).then((e) => {
      return e.json();
    });
  });
}
function changeLang(val, path) {
  return __awaiter(this, void 0, void 0, function* () {
    return fetchLang(val, path).then((json) => {
      if (typeof window != 'undefined') {
        window._LANG = json;
        if (flagIsInstalledVue) vueUpdateLang();
      }
      return json;
    });
  });
}
let cmpArray = [];
function vueInit(Vue) {
  function findCmpIndex(cmp) {
    return cmpArray.findIndex(function (c) {
      return !!(c._uid == cmp._uid);
    });
  }
  function registerCmp(cmp) {
    if (typeof cmp._uid == 'undefined') return false;
    if (findCmpIndex(cmp) == -1) {
      cmpArray.push(cmp);
    }
  }
  function unregisterCmp(cmp) {
    if (typeof cmp._uid == 'undefined') return false;
    var tmpA = findCmpIndex(cmp);
    if (tmpA > -1) {
      cmpArray.splice(tmpA, 1);
    }
  }
  Vue.mixin({
    mounted: function mounted() {
      if (this.$forceUpdate) registerCmp(this);
    },
    beforeDestroy: function beforeDestroy() {
      if (this.$forceUpdate) unregisterCmp(this);
    },
  });
  flagIsInstalledVue = true;
}
function vueUpdateLang() {
  cmpArray.forEach(function (cmp) {
    cmp.$forceUpdate();
  });
}
function setEnv(...argus) {
  var args = [...arguments];
  if (args.length == 1 && typeof args[0] == 'object') {
    for (var k in args[0]) {
      appendToCfg(k, args[0][k]);
    }
    return cfg;
  } else if (args.length == 2 && typeof args[0] == 'string') {
    cfg[args[0]] = args[1];
    appendToCfg(args[0], args[1]);
    return cfg;
  }
  return false;
}
function setStore(store) {
  cfg.store = store;
  cfg.__defineGetter__('decPlaces', function () {
    return store.state.setting.decPlaces;
  });
  cfg.__defineGetter__('decimal', function () {
    return store.state.setting.decimal;
  });
  cfg.__defineGetter__('thousandSeparator', function () {
    return store.state.setting.thousandSeparator;
  });
  cfg.__defineGetter__('lang', function () {
    return store.state.setting.language;
  });
  cfg.__defineGetter__('languageFileUrl', function () {
    return store.state.setting.languageFileUrl;
  });
  cfg.__defineGetter__('apiServerUrl', function () {
    return store.state.network.apiUrls.apiServerUrl;
  });
  cfg.__defineGetter__('gameApiUrl', function () {
    return store.state.network.apiUrls.apiServerUrl + 'mem/';
  }); //mem
  cfg.__defineGetter__('gameServerUrl', function () {
    return store.state.network.apiUrls.gameServerUrl;
  });
}
var cfg = {
  setEnv: setEnv,
  setStore: setStore,
  changeLang: changeLang,
  vueInit: vueInit,
  vueUpdateLang: vueUpdateLang,
  store: undefined,
};
Object.assign(cfg, defaultValue);

const READER_STYLE_TAG_ID = 'dcss_library_publish_css_style_used';
const REGEXP_IS_MEDIAQUERY = /^@media/;
var saveConfig;
function replaceVarCSS(variable, cssText, replacement) {
  var regA = new RegExp('{{' + variable + '}}', 'g');
  if (!regA.test(cssText)) return cssText;
  return cssText.replace(regA, replacement);
}
function replaceConfigTpl(json) {
  if (typeof json == 'string') json = JSON.parse(json);
  var objTag = json.tag,
    objTpl = json.tpl;
  for (var tag in objTag) {
    for (var css in objTpl) {
      if (typeof objTpl[css] == 'string') {
        objTpl[css] = replaceVarCSS(tag, objTpl[css], objTag[tag]);
      } else if (typeof objTpl[css] == 'object') {
        for (var mq in objTpl[css]) {
          objTpl[css][mq] = replaceVarCSS(tag, objTpl[css][mq], objTag[tag]);
        }
      }
    }
  }
  return objTpl;
}
function genCSS(json) {
  var objA = replaceConfigTpl(json);
  var rt = '';
  var mediaQueryRT = '';
  for (var k in objA) {
    if (REGEXP_IS_MEDIAQUERY.test(k)) {
      if (typeof objA[k] == 'string') {
        var aryK = k.split('{');
        aryK[1] = aryK[1].split('}')[0].trim();
        aryK[0] = aryK[0].trim();
        mediaQueryRT = mediaQueryRT + aryK[0] + ' {\n\t' + aryK[1] + ' { ' + objA[k] + ' }\n}\n';
      } else if (typeof objA[k] == 'object' && Object.keys(objA[k]).length > 0) {
        mediaQueryRT = mediaQueryRT + k + ' {\n';
        for (var mq in objA[k]) {
          mediaQueryRT = mediaQueryRT + '\t' + mq + ' { ' + objA[k][mq] + ' }\n';
        }
        mediaQueryRT = mediaQueryRT + '}\n';
      }
    } else {
      rt = rt + k + ' { ' + objA[k] + ' }\n';
    }
  }
  return rt + '\n' + mediaQueryRT;
}
function genVariableCSS(json) {
  if (typeof json == 'string') json = JSON.parse(json);
  var objTag = json.tag,
    objTpl = json.tpl;
  var cssString = '',
    rootString = ':root {\n';
  var mqCssString = '';
  for (var k in objTag) {
    rootString += '\t--' + k + ': ' + objTag[k] + ';\n';
  }
  rootString += '}';
  for (var tag in objTag) {
    for (var css in objTpl) {
      // objTpl[css] = replaceVarCSS(tag, objTpl[css], 'var(--' + tag + ')');
      if (typeof objTpl[css] == 'string') {
        objTpl[css] = replaceVarCSS(tag, objTpl[css], 'var(--' + tag + ')');
      } else if (typeof objTpl[css] == 'object') {
        for (var mq in objTpl[css]) {
          objTpl[css][mq] = replaceVarCSS(tag, objTpl[css][mq], 'var(--' + tag + ')');
        }
      }
    }
  }
  for (var css in objTpl) {
    if (REGEXP_IS_MEDIAQUERY.test(css)) {
      mqCssString = mqCssString + css + ' {\n';
      for (var mqCSS in objTpl[css]) {
        mqCssString = mqCssString + '\t' + mqCSS + ' { ' + objTpl[css][mqCSS] + ' }\n';
      }
      mqCssString += '}\n';
    } else {
      cssString = cssString + css + ' { ' + objTpl[css] + ' }\n';
    }
  }
  return rootString + '\n\n' + cssString + '\n\n' + mqCssString;
}
function clearDomDCSS() {
  var dom = document.getElementById(READER_STYLE_TAG_ID);
  if (dom) {
    dom.innerHTML = '';
    if (typeof dom.remove == 'function') dom.remove();
  }
}
function getDomDCSS() {
  var dom = document.getElementById(READER_STYLE_TAG_ID);
  if (!dom) {
    dom = document.createElement('style');
    dom['type'] = 'text/css';
    dom.id = READER_STYLE_TAG_ID;
    var head =
      document.head || document.querySelector('head') || document.getElementsByTagName('head')[0];
    head.appendChild(dom);
  }
  return dom;
}
function getUsedConfig() {
  return saveConfig;
}
function setConfigToCSS(json) {
  saveConfig = json;
  var css = genCSS(json);
  var dom = getDomDCSS();
  dom.innerHTML = css;
  return css;
}
var dcss = {
  // replaceConfigTpl: replaceConfigTpl,
  clearDomDCSS: clearDomDCSS,
  setConfigToCSS: setConfigToCSS,
  // genCSS: genCSS,
  genVariableCSS: genVariableCSS,
  getDomDCSS: getDomDCSS,
  getUsedConfig: getUsedConfig,
  id: READER_STYLE_TAG_ID,
};

//! moment.js
//! version : 2.26.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

var hookCallback;

function hooks() {
  return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback(callback) {
  hookCallback = callback;
}

function isArray(input) {
  return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
  // IE8 will treat undefined and null as object if it wasn't for
  // input != null
  return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function hasOwnProp(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
}

function isObjectEmpty(obj) {
  if (Object.getOwnPropertyNames) {
    return Object.getOwnPropertyNames(obj).length === 0;
  } else {
    var k;
    for (k in obj) {
      if (hasOwnProp(obj, k)) {
        return false;
      }
    }
    return true;
  }
}

function isUndefined(input) {
  return input === void 0;
}

function isNumber(input) {
  return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
  return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
  var res = [],
    i;
  for (i = 0; i < arr.length; ++i) {
    res.push(fn(arr[i], i));
  }
  return res;
}

function extend(a, b) {
  for (var i in b) {
    if (hasOwnProp(b, i)) {
      a[i] = b[i];
    }
  }

  if (hasOwnProp(b, 'toString')) {
    a.toString = b.toString;
  }

  if (hasOwnProp(b, 'valueOf')) {
    a.valueOf = b.valueOf;
  }

  return a;
}

function createUTC(input, format, locale, strict) {
  return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
  // We need to deep clone this object.
  return {
    empty: false,
    unusedTokens: [],
    unusedInput: [],
    overflow: -2,
    charsLeftOver: 0,
    nullInput: false,
    invalidEra: null,
    invalidMonth: null,
    invalidFormat: false,
    userInvalidated: false,
    iso: false,
    parsedDateParts: [],
    era: null,
    meridiem: null,
    rfc2822: false,
    weekdayMismatch: false,
  };
}

function getParsingFlags(m) {
  if (m._pf == null) {
    m._pf = defaultParsingFlags();
  }
  return m._pf;
}

var some;
if (Array.prototype.some) {
  some = Array.prototype.some;
} else {
  some = function (fun) {
    var t = Object(this),
      len = t.length >>> 0,
      i;

    for (i = 0; i < len; i++) {
      if (i in t && fun.call(this, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

function isValid(m) {
  if (m._isValid == null) {
    var flags = getParsingFlags(m),
      parsedParts = some.call(flags.parsedDateParts, function (i) {
        return i != null;
      }),
      isNowValid =
        !isNaN(m._d.getTime()) &&
        flags.overflow < 0 &&
        !flags.empty &&
        !flags.invalidEra &&
        !flags.invalidMonth &&
        !flags.invalidWeekday &&
        !flags.weekdayMismatch &&
        !flags.nullInput &&
        !flags.invalidFormat &&
        !flags.userInvalidated &&
        (!flags.meridiem || (flags.meridiem && parsedParts));

    if (m._strict) {
      isNowValid =
        isNowValid &&
        flags.charsLeftOver === 0 &&
        flags.unusedTokens.length === 0 &&
        flags.bigHour === undefined;
    }

    if (Object.isFrozen == null || !Object.isFrozen(m)) {
      m._isValid = isNowValid;
    } else {
      return isNowValid;
    }
  }
  return m._isValid;
}

function createInvalid(flags) {
  var m = createUTC(NaN);
  if (flags != null) {
    extend(getParsingFlags(m), flags);
  } else {
    getParsingFlags(m).userInvalidated = true;
  }

  return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = (hooks.momentProperties = []),
  updateInProgress = false;

function copyConfig(to, from) {
  var i, prop, val;

  if (!isUndefined(from._isAMomentObject)) {
    to._isAMomentObject = from._isAMomentObject;
  }
  if (!isUndefined(from._i)) {
    to._i = from._i;
  }
  if (!isUndefined(from._f)) {
    to._f = from._f;
  }
  if (!isUndefined(from._l)) {
    to._l = from._l;
  }
  if (!isUndefined(from._strict)) {
    to._strict = from._strict;
  }
  if (!isUndefined(from._tzm)) {
    to._tzm = from._tzm;
  }
  if (!isUndefined(from._isUTC)) {
    to._isUTC = from._isUTC;
  }
  if (!isUndefined(from._offset)) {
    to._offset = from._offset;
  }
  if (!isUndefined(from._pf)) {
    to._pf = getParsingFlags(from);
  }
  if (!isUndefined(from._locale)) {
    to._locale = from._locale;
  }

  if (momentProperties.length > 0) {
    for (i = 0; i < momentProperties.length; i++) {
      prop = momentProperties[i];
      val = from[prop];
      if (!isUndefined(val)) {
        to[prop] = val;
      }
    }
  }

  return to;
}

// Moment prototype object
function Moment(config) {
  copyConfig(this, config);
  this._d = new Date(config._d != null ? config._d.getTime() : NaN);
  if (!this.isValid()) {
    this._d = new Date(NaN);
  }
  // Prevent infinite loop in case updateOffset creates new moment
  // objects.
  if (updateInProgress === false) {
    updateInProgress = true;
    hooks.updateOffset(this);
    updateInProgress = false;
  }
}

function isMoment(obj) {
  return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function warn(msg) {
  if (
    hooks.suppressDeprecationWarnings === false &&
    typeof console !== 'undefined' &&
    console.warn
  ) {
    console.warn('Deprecation warning: ' + msg);
  }
}

function deprecate(msg, fn) {
  var firstTime = true;

  return extend(function () {
    if (hooks.deprecationHandler != null) {
      hooks.deprecationHandler(null, msg);
    }
    if (firstTime) {
      var args = [],
        arg,
        i,
        key;
      for (i = 0; i < arguments.length; i++) {
        arg = '';
        if (typeof arguments[i] === 'object') {
          arg += '\n[' + i + '] ';
          for (key in arguments[0]) {
            if (hasOwnProp(arguments[0], key)) {
              arg += key + ': ' + arguments[0][key] + ', ';
            }
          }
          arg = arg.slice(0, -2); // Remove trailing comma and space
        } else {
          arg = arguments[i];
        }
        args.push(arg);
      }
      warn(
        msg +
          '\nArguments: ' +
          Array.prototype.slice.call(args).join('') +
          '\n' +
          new Error().stack,
      );
      firstTime = false;
    }
    return fn.apply(this, arguments);
  }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
  if (hooks.deprecationHandler != null) {
    hooks.deprecationHandler(name, msg);
  }
  if (!deprecations[name]) {
    warn(msg);
    deprecations[name] = true;
  }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
  return (
    (typeof Function !== 'undefined' && input instanceof Function) ||
    Object.prototype.toString.call(input) === '[object Function]'
  );
}

function set(config) {
  var prop, i;
  for (i in config) {
    if (hasOwnProp(config, i)) {
      prop = config[i];
      if (isFunction(prop)) {
        this[i] = prop;
      } else {
        this['_' + i] = prop;
      }
    }
  }
  this._config = config;
  // Lenient ordinal parsing accepts just a number in addition to
  // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
  // TODO: Remove "ordinalParse" fallback in next major release.
  this._dayOfMonthOrdinalParseLenient = new RegExp(
    (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source,
  );
}

function mergeConfigs(parentConfig, childConfig) {
  var res = extend({}, parentConfig),
    prop;
  for (prop in childConfig) {
    if (hasOwnProp(childConfig, prop)) {
      if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
        res[prop] = {};
        extend(res[prop], parentConfig[prop]);
        extend(res[prop], childConfig[prop]);
      } else if (childConfig[prop] != null) {
        res[prop] = childConfig[prop];
      } else {
        delete res[prop];
      }
    }
  }
  for (prop in parentConfig) {
    if (
      hasOwnProp(parentConfig, prop) &&
      !hasOwnProp(childConfig, prop) &&
      isObject(parentConfig[prop])
    ) {
      // make sure changes to properties don't modify parent config
      res[prop] = extend({}, res[prop]);
    }
  }
  return res;
}

function Locale(config) {
  if (config != null) {
    this.set(config);
  }
}

var keys;

if (Object.keys) {
  keys = Object.keys;
} else {
  keys = function (obj) {
    var i,
      res = [];
    for (i in obj) {
      if (hasOwnProp(obj, i)) {
        res.push(i);
      }
    }
    return res;
  };
}

var defaultCalendar = {
  sameDay: '[Today at] LT',
  nextDay: '[Tomorrow at] LT',
  nextWeek: 'dddd [at] LT',
  lastDay: '[Yesterday at] LT',
  lastWeek: '[Last] dddd [at] LT',
  sameElse: 'L',
};

function calendar(key, mom, now) {
  var output = this._calendar[key] || this._calendar['sameElse'];
  return isFunction(output) ? output.call(mom, now) : output;
}

function zeroFill(number, targetLength, forceSign) {
  var absNumber = '' + Math.abs(number),
    zerosToFill = targetLength - absNumber.length,
    sign = number >= 0;
  return (
    (sign ? (forceSign ? '+' : '') : '-') +
    Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
    absNumber
  );
}

var formattingTokens =
    /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
  localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
  formatFunctions = {},
  formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken(token, padded, ordinal, callback) {
  var func = callback;
  if (typeof callback === 'string') {
    func = function () {
      return this[callback]();
    };
  }
  if (token) {
    formatTokenFunctions[token] = func;
  }
  if (padded) {
    formatTokenFunctions[padded[0]] = function () {
      return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
    };
  }
  if (ordinal) {
    formatTokenFunctions[ordinal] = function () {
      return this.localeData().ordinal(func.apply(this, arguments), token);
    };
  }
}

function removeFormattingTokens(input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|\]$/g, '');
  }
  return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
  var array = format.match(formattingTokens),
    i,
    length;

  for (i = 0, length = array.length; i < length; i++) {
    if (formatTokenFunctions[array[i]]) {
      array[i] = formatTokenFunctions[array[i]];
    } else {
      array[i] = removeFormattingTokens(array[i]);
    }
  }

  return function (mom) {
    var output = '',
      i;
    for (i = 0; i < length; i++) {
      output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
    }
    return output;
  };
}

// format date using native date object
function formatMoment(m, format) {
  if (!m.isValid()) {
    return m.localeData().invalidDate();
  }

  format = expandFormat(format, m.localeData());
  formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

  return formatFunctions[format](m);
}

function expandFormat(format, locale) {
  var i = 5;

  function replaceLongDateFormatTokens(input) {
    return locale.longDateFormat(input) || input;
  }

  localFormattingTokens.lastIndex = 0;
  while (i >= 0 && localFormattingTokens.test(format)) {
    format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
    localFormattingTokens.lastIndex = 0;
    i -= 1;
  }

  return format;
}

var defaultLongDateFormat = {
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A',
};

function longDateFormat(key) {
  var format = this._longDateFormat[key],
    formatUpper = this._longDateFormat[key.toUpperCase()];

  if (format || !formatUpper) {
    return format;
  }

  this._longDateFormat[key] = formatUpper
    .match(formattingTokens)
    .map(function (tok) {
      if (tok === 'MMMM' || tok === 'MM' || tok === 'DD' || tok === 'dddd') {
        return tok.slice(1);
      }
      return tok;
    })
    .join('');

  return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate() {
  return this._invalidDate;
}

var defaultOrdinal = '%d',
  defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal(number) {
  return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
  future: 'in %s',
  past: '%s ago',
  s: 'a few seconds',
  ss: '%d seconds',
  m: 'a minute',
  mm: '%d minutes',
  h: 'an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  w: 'a week',
  ww: '%d weeks',
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years',
};

function relativeTime(number, withoutSuffix, string, isFuture) {
  var output = this._relativeTime[string];
  return isFunction(output)
    ? output(number, withoutSuffix, string, isFuture)
    : output.replace(/%d/i, number);
}

function pastFuture(diff, output) {
  var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
  return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias(unit, shorthand) {
  var lowerCase = unit.toLowerCase();
  aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
  return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
  var normalizedInput = {},
    normalizedProp,
    prop;

  for (prop in inputObject) {
    if (hasOwnProp(inputObject, prop)) {
      normalizedProp = normalizeUnits(prop);
      if (normalizedProp) {
        normalizedInput[normalizedProp] = inputObject[prop];
      }
    }
  }

  return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
  priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
  var units = [],
    u;
  for (u in unitsObj) {
    if (hasOwnProp(unitsObj, u)) {
      units.push({ unit: u, priority: priorities[u] });
    }
  }
  units.sort(function (a, b) {
    return a.priority - b.priority;
  });
  return units;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function absFloor(number) {
  if (number < 0) {
    // -0 -> 0
    return Math.ceil(number) || 0;
  } else {
    return Math.floor(number);
  }
}

function toInt(argumentForCoercion) {
  var coercedNumber = +argumentForCoercion,
    value = 0;

  if (coercedNumber !== 0 && isFinite(coercedNumber)) {
    value = absFloor(coercedNumber);
  }

  return value;
}

function makeGetSet(unit, keepTime) {
  return function (value) {
    if (value != null) {
      set$1(this, unit, value);
      hooks.updateOffset(this, keepTime);
      return this;
    } else {
      return get(this, unit);
    }
  };
}

function get(mom, unit) {
  return mom.isValid() ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1(mom, unit, value) {
  if (mom.isValid() && !isNaN(value)) {
    if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
      value = toInt(value);
      mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
        value,
        mom.month(),
        daysInMonth(value, mom.month()),
      );
    } else {
      mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
  }
}

// MOMENTS

function stringGet(units) {
  units = normalizeUnits(units);
  if (isFunction(this[units])) {
    return this[units]();
  }
  return this;
}

function stringSet(units, value) {
  if (typeof units === 'object') {
    units = normalizeObjectUnits(units);
    var prioritized = getPrioritizedUnits(units),
      i;
    for (i = 0; i < prioritized.length; i++) {
      this[prioritized[i].unit](units[prioritized[i].unit]);
    }
  } else {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
      return this[units](value);
    }
  }
  return this;
}

var match1 = /\d/, //       0 - 9
  match2 = /\d\d/, //      00 - 99
  match3 = /\d{3}/, //     000 - 999
  match4 = /\d{4}/, //    0000 - 9999
  match6 = /[+-]?\d{6}/, // -999999 - 999999
  match1to2 = /\d\d?/, //       0 - 99
  match3to4 = /\d\d\d\d?/, //     999 - 9999
  match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
  match1to3 = /\d{1,3}/, //       0 - 999
  match1to4 = /\d{1,4}/, //       0 - 9999
  match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
  matchUnsigned = /\d+/, //       0 - inf
  matchSigned = /[+-]?\d+/, //    -inf - inf
  matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
  matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
  matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
  // any word (or two) characters or numbers including two/three word month in arabic.
  // includes scottish gaelic two word and hyphenated months
  matchWord =
    /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
  regexes;

regexes = {};

function addRegexToken(token, regex, strictRegex) {
  regexes[token] = isFunction(regex)
    ? regex
    : function (isStrict, localeData) {
        return isStrict && strictRegex ? strictRegex : regex;
      };
}

function getParseRegexForToken(token, config) {
  if (!hasOwnProp(regexes, token)) {
    return new RegExp(unescapeFormat(token));
  }

  return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
  return regexEscape(
    s
      .replace('\\', '')
      .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
      }),
  );
}

function regexEscape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken(token, callback) {
  var i,
    func = callback;
  if (typeof token === 'string') {
    token = [token];
  }
  if (isNumber(callback)) {
    func = function (input, array) {
      array[callback] = toInt(input);
    };
  }
  for (i = 0; i < token.length; i++) {
    tokens[token[i]] = func;
  }
}

function addWeekParseToken(token, callback) {
  addParseToken(token, function (input, array, config, token) {
    config._w = config._w || {};
    callback(input, config._w, config, token);
  });
}

function addTimeToArrayFromToken(token, input, config) {
  if (input != null && hasOwnProp(tokens, token)) {
    tokens[token](input, config._a, config, token);
  }
}

var YEAR = 0,
  MONTH = 1,
  DATE = 2,
  HOUR = 3,
  MINUTE = 4,
  SECOND = 5,
  MILLISECOND = 6,
  WEEK = 7,
  WEEKDAY = 8;

function mod(n, x) {
  return ((n % x) + x) % x;
}

var indexOf;

if (Array.prototype.indexOf) {
  indexOf = Array.prototype.indexOf;
} else {
  indexOf = function (o) {
    // I know
    var i;
    for (i = 0; i < this.length; ++i) {
      if (this[i] === o) {
        return i;
      }
    }
    return -1;
  };
}

function daysInMonth(year, month) {
  if (isNaN(year) || isNaN(month)) {
    return NaN;
  }
  var modMonth = mod(month, 12);
  year += (month - modMonth) / 12;
  return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : 31 - ((modMonth % 7) % 2);
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
  return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
  return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
  return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M', match1to2);
addRegexToken('MM', match1to2, match2);
addRegexToken('MMM', function (isStrict, locale) {
  return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
  return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
  array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
  var month = config._locale.monthsParse(input, token, config._strict);
  // if we didn't find a month name, mark the date as invalid.
  if (month != null) {
    array[MONTH] = month;
  } else {
    getParsingFlags(config).invalidMonth = input;
  }
});

// LOCALES

var defaultLocaleMonths =
    'January_February_March_April_May_June_July_August_September_October_November_December'.split(
      '_',
    ),
  defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
  defaultMonthsShortRegex = matchWord,
  defaultMonthsRegex = matchWord;

function localeMonths(m, format) {
  if (!m) {
    return isArray(this._months) ? this._months : this._months['standalone'];
  }
  return isArray(this._months)
    ? this._months[m.month()]
    : this._months[
        (this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'
      ][m.month()];
}

function localeMonthsShort(m, format) {
  if (!m) {
    return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort['standalone'];
  }
  return isArray(this._monthsShort)
    ? this._monthsShort[m.month()]
    : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
  var i,
    ii,
    mom,
    llc = monthName.toLocaleLowerCase();
  if (!this._monthsParse) {
    // this is not used
    this._monthsParse = [];
    this._longMonthsParse = [];
    this._shortMonthsParse = [];
    for (i = 0; i < 12; ++i) {
      mom = createUTC([2000, i]);
      this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
      this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
    }
  }

  if (strict) {
    if (format === 'MMM') {
      ii = indexOf.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format === 'MMM') {
      ii = indexOf.call(this._shortMonthsParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._longMonthsParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}

function localeMonthsParse(monthName, format, strict) {
  var i, mom, regex;

  if (this._monthsParseExact) {
    return handleStrictParse.call(this, monthName, format, strict);
  }

  if (!this._monthsParse) {
    this._monthsParse = [];
    this._longMonthsParse = [];
    this._shortMonthsParse = [];
  }

  // TODO: add sorting
  // Sorting makes sure if one month (or abbr) is a prefix of another
  // see sorting in computeMonthsParse
  for (i = 0; i < 12; i++) {
    // make the regex if we don't have it already
    mom = createUTC([2000, i]);
    if (strict && !this._longMonthsParse[i]) {
      this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
      this._shortMonthsParse[i] = new RegExp(
        '^' + this.monthsShort(mom, '').replace('.', '') + '$',
        'i',
      );
    }
    if (!strict && !this._monthsParse[i]) {
      regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
      this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
    }
    // test the regex
    if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
      return i;
    } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
      return i;
    } else if (!strict && this._monthsParse[i].test(monthName)) {
      return i;
    }
  }
}

// MOMENTS

function setMonth(mom, value) {
  var dayOfMonth;

  if (!mom.isValid()) {
    // No op
    return mom;
  }

  if (typeof value === 'string') {
    if (/^\d+$/.test(value)) {
      value = toInt(value);
    } else {
      value = mom.localeData().monthsParse(value);
      // TODO: Another silent failure?
      if (!isNumber(value)) {
        return mom;
      }
    }
  }

  dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
  mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
  return mom;
}

function getSetMonth(value) {
  if (value != null) {
    setMonth(this, value);
    hooks.updateOffset(this, true);
    return this;
  } else {
    return get(this, 'Month');
  }
}

function getDaysInMonth() {
  return daysInMonth(this.year(), this.month());
}

function monthsShortRegex(isStrict) {
  if (this._monthsParseExact) {
    if (!hasOwnProp(this, '_monthsRegex')) {
      computeMonthsParse.call(this);
    }
    if (isStrict) {
      return this._monthsShortStrictRegex;
    } else {
      return this._monthsShortRegex;
    }
  } else {
    if (!hasOwnProp(this, '_monthsShortRegex')) {
      this._monthsShortRegex = defaultMonthsShortRegex;
    }
    return this._monthsShortStrictRegex && isStrict
      ? this._monthsShortStrictRegex
      : this._monthsShortRegex;
  }
}

function monthsRegex(isStrict) {
  if (this._monthsParseExact) {
    if (!hasOwnProp(this, '_monthsRegex')) {
      computeMonthsParse.call(this);
    }
    if (isStrict) {
      return this._monthsStrictRegex;
    } else {
      return this._monthsRegex;
    }
  } else {
    if (!hasOwnProp(this, '_monthsRegex')) {
      this._monthsRegex = defaultMonthsRegex;
    }
    return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
  }
}

function computeMonthsParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }

  var shortPieces = [],
    longPieces = [],
    mixedPieces = [],
    i,
    mom;
  for (i = 0; i < 12; i++) {
    // make the regex if we don't have it already
    mom = createUTC([2000, i]);
    shortPieces.push(this.monthsShort(mom, ''));
    longPieces.push(this.months(mom, ''));
    mixedPieces.push(this.months(mom, ''));
    mixedPieces.push(this.monthsShort(mom, ''));
  }
  // Sorting makes sure if one month (or abbr) is a prefix of another it
  // will match the longer piece.
  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);
  for (i = 0; i < 12; i++) {
    shortPieces[i] = regexEscape(shortPieces[i]);
    longPieces[i] = regexEscape(longPieces[i]);
  }
  for (i = 0; i < 24; i++) {
    mixedPieces[i] = regexEscape(mixedPieces[i]);
  }

  this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._monthsShortRegex = this._monthsRegex;
  this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
  this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken('Y', 0, 0, function () {
  var y = this.year();
  return y <= 9999 ? zeroFill(y, 4) : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
  return this.year() % 100;
});

addFormatToken(0, ['YYYY', 4], 0, 'year');
addFormatToken(0, ['YYYYY', 5], 0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y', matchSigned);
addRegexToken('YY', match1to2, match2);
addRegexToken('YYYY', match1to4, match4);
addRegexToken('YYYYY', match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
  array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
  array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
  array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
  return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear() {
  return isLeapYear(this.year());
}

function createDate(y, m, d, h, M, s, ms) {
  // can't just apply() to create a date:
  // https://stackoverflow.com/q/181348
  var date;
  // the date constructor remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    // preserve leap years using a full 400 year cycle, then reset
    date = new Date(y + 400, m, d, h, M, s, ms);
    if (isFinite(date.getFullYear())) {
      date.setFullYear(y);
    }
  } else {
    date = new Date(y, m, d, h, M, s, ms);
  }

  return date;
}

function createUTCDate(y) {
  var date, args;
  // the Date.UTC function remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    args = Array.prototype.slice.call(arguments);
    // preserve leap years using a full 400 year cycle, then reset
    args[0] = y + 400;
    date = new Date(Date.UTC.apply(null, args));
    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
  } else {
    date = new Date(Date.UTC.apply(null, arguments));
  }

  return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
  var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
    fwd = 7 + dow - doy,
    // first-week day local weekday -- which local weekday is fwd
    fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

  return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
  var localWeekday = (7 + weekday - dow) % 7,
    weekOffset = firstWeekOffset(year, dow, doy),
    dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
    resYear,
    resDayOfYear;

  if (dayOfYear <= 0) {
    resYear = year - 1;
    resDayOfYear = daysInYear(resYear) + dayOfYear;
  } else if (dayOfYear > daysInYear(year)) {
    resYear = year + 1;
    resDayOfYear = dayOfYear - daysInYear(year);
  } else {
    resYear = year;
    resDayOfYear = dayOfYear;
  }

  return {
    year: resYear,
    dayOfYear: resDayOfYear,
  };
}

function weekOfYear(mom, dow, doy) {
  var weekOffset = firstWeekOffset(mom.year(), dow, doy),
    week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
    resWeek,
    resYear;

  if (week < 1) {
    resYear = mom.year() - 1;
    resWeek = week + weeksInYear(resYear, dow, doy);
  } else if (week > weeksInYear(mom.year(), dow, doy)) {
    resWeek = week - weeksInYear(mom.year(), dow, doy);
    resYear = mom.year() + 1;
  } else {
    resYear = mom.year();
    resWeek = week;
  }

  return {
    week: resWeek,
    year: resYear,
  };
}

function weeksInYear(year, dow, doy) {
  var weekOffset = firstWeekOffset(year, dow, doy),
    weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
  return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w', match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W', match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
  week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek(mom) {
  return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
  dow: 0, // Sunday is the first day of the week.
  doy: 6, // The week that contains Jan 6th is the first week of the year.
};

function localeFirstDayOfWeek() {
  return this._week.dow;
}

function localeFirstDayOfYear() {
  return this._week.doy;
}

// MOMENTS

function getSetWeek(input) {
  var week = this.localeData().week(this);
  return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek(input) {
  var week = weekOfYear(this, 1, 4).week;
  return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
  return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
  return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
  return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d', match1to2);
addRegexToken('e', match1to2);
addRegexToken('E', match1to2);
addRegexToken('dd', function (isStrict, locale) {
  return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd', function (isStrict, locale) {
  return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd', function (isStrict, locale) {
  return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
  var weekday = config._locale.weekdaysParse(input, token, config._strict);
  // if we didn't get a weekday name, mark the date as invalid
  if (weekday != null) {
    week.d = weekday;
  } else {
    getParsingFlags(config).invalidWeekday = input;
  }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
  week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
  if (typeof input !== 'string') {
    return input;
  }

  if (!isNaN(input)) {
    return parseInt(input, 10);
  }

  input = locale.weekdaysParse(input);
  if (typeof input === 'number') {
    return input;
  }

  return null;
}

function parseIsoWeekday(input, locale) {
  if (typeof input === 'string') {
    return locale.weekdaysParse(input) % 7 || 7;
  }
  return isNaN(input) ? null : input;
}

// LOCALES
function shiftWeekdays(ws, n) {
  return ws.slice(n, 7).concat(ws.slice(0, n));
}

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  defaultWeekdaysRegex = matchWord,
  defaultWeekdaysShortRegex = matchWord,
  defaultWeekdaysMinRegex = matchWord;

function localeWeekdays(m, format) {
  var weekdays = isArray(this._weekdays)
    ? this._weekdays
    : this._weekdays[
        m && m !== true && this._weekdays.isFormat.test(format) ? 'format' : 'standalone'
      ];
  return m === true ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
}

function localeWeekdaysShort(m) {
  return m === true
    ? shiftWeekdays(this._weekdaysShort, this._week.dow)
    : m
    ? this._weekdaysShort[m.day()]
    : this._weekdaysShort;
}

function localeWeekdaysMin(m) {
  return m === true
    ? shiftWeekdays(this._weekdaysMin, this._week.dow)
    : m
    ? this._weekdaysMin[m.day()]
    : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
  var i,
    ii,
    mom,
    llc = weekdayName.toLocaleLowerCase();
  if (!this._weekdaysParse) {
    this._weekdaysParse = [];
    this._shortWeekdaysParse = [];
    this._minWeekdaysParse = [];

    for (i = 0; i < 7; ++i) {
      mom = createUTC([2000, 1]).day(i);
      this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
      this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
      this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
    }
  }

  if (strict) {
    if (format === 'dddd') {
      ii = indexOf.call(this._weekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format === 'ddd') {
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format === 'dddd') {
      ii = indexOf.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format === 'ddd') {
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._minWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}

function localeWeekdaysParse(weekdayName, format, strict) {
  var i, mom, regex;

  if (this._weekdaysParseExact) {
    return handleStrictParse$1.call(this, weekdayName, format, strict);
  }

  if (!this._weekdaysParse) {
    this._weekdaysParse = [];
    this._minWeekdaysParse = [];
    this._shortWeekdaysParse = [];
    this._fullWeekdaysParse = [];
  }

  for (i = 0; i < 7; i++) {
    // make the regex if we don't have it already

    mom = createUTC([2000, 1]).day(i);
    if (strict && !this._fullWeekdaysParse[i]) {
      this._fullWeekdaysParse[i] = new RegExp(
        '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
        'i',
      );
      this._shortWeekdaysParse[i] = new RegExp(
        '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
        'i',
      );
      this._minWeekdaysParse[i] = new RegExp(
        '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
        'i',
      );
    }
    if (!this._weekdaysParse[i]) {
      regex =
        '^' +
        this.weekdays(mom, '') +
        '|^' +
        this.weekdaysShort(mom, '') +
        '|^' +
        this.weekdaysMin(mom, '');
      this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
    }
    // test the regex
    if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
      return i;
    }
  }
}

// MOMENTS

function getSetDayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
  if (input != null) {
    input = parseWeekday(input, this.localeData());
    return this.add(input - day, 'd');
  } else {
    return day;
  }
}

function getSetLocaleDayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
  return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }

  // behaves the same as moment#day except
  // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
  // as a setter, sunday should belong to the previous week.

  if (input != null) {
    var weekday = parseIsoWeekday(input, this.localeData());
    return this.day(this.day() % 7 ? weekday : weekday - 7);
  } else {
    return this.day() || 7;
  }
}

function weekdaysRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!hasOwnProp(this, '_weekdaysRegex')) {
      computeWeekdaysParse.call(this);
    }
    if (isStrict) {
      return this._weekdaysStrictRegex;
    } else {
      return this._weekdaysRegex;
    }
  } else {
    if (!hasOwnProp(this, '_weekdaysRegex')) {
      this._weekdaysRegex = defaultWeekdaysRegex;
    }
    return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
  }
}

function weekdaysShortRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!hasOwnProp(this, '_weekdaysRegex')) {
      computeWeekdaysParse.call(this);
    }
    if (isStrict) {
      return this._weekdaysShortStrictRegex;
    } else {
      return this._weekdaysShortRegex;
    }
  } else {
    if (!hasOwnProp(this, '_weekdaysShortRegex')) {
      this._weekdaysShortRegex = defaultWeekdaysShortRegex;
    }
    return this._weekdaysShortStrictRegex && isStrict
      ? this._weekdaysShortStrictRegex
      : this._weekdaysShortRegex;
  }
}

function weekdaysMinRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!hasOwnProp(this, '_weekdaysRegex')) {
      computeWeekdaysParse.call(this);
    }
    if (isStrict) {
      return this._weekdaysMinStrictRegex;
    } else {
      return this._weekdaysMinRegex;
    }
  } else {
    if (!hasOwnProp(this, '_weekdaysMinRegex')) {
      this._weekdaysMinRegex = defaultWeekdaysMinRegex;
    }
    return this._weekdaysMinStrictRegex && isStrict
      ? this._weekdaysMinStrictRegex
      : this._weekdaysMinRegex;
  }
}

function computeWeekdaysParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }

  var minPieces = [],
    shortPieces = [],
    longPieces = [],
    mixedPieces = [],
    i,
    mom,
    minp,
    shortp,
    longp;
  for (i = 0; i < 7; i++) {
    // make the regex if we don't have it already
    mom = createUTC([2000, 1]).day(i);
    minp = regexEscape(this.weekdaysMin(mom, ''));
    shortp = regexEscape(this.weekdaysShort(mom, ''));
    longp = regexEscape(this.weekdays(mom, ''));
    minPieces.push(minp);
    shortPieces.push(shortp);
    longPieces.push(longp);
    mixedPieces.push(minp);
    mixedPieces.push(shortp);
    mixedPieces.push(longp);
  }
  // Sorting makes sure if one weekday (or abbr) is a prefix of another it
  // will match the longer piece.
  minPieces.sort(cmpLenRev);
  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);

  this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._weekdaysShortRegex = this._weekdaysRegex;
  this._weekdaysMinRegex = this._weekdaysRegex;

  this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
  this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
  this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
  return this.hours() % 12 || 12;
}

function kFormat() {
  return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
  return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
  return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
  return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
  return '' + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
});

function meridiem(token, lowercase) {
  addFormatToken(token, 0, 0, function () {
    return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
  });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem(isStrict, locale) {
  return locale._meridiemParse;
}

addRegexToken('a', matchMeridiem);
addRegexToken('A', matchMeridiem);
addRegexToken('H', match1to2);
addRegexToken('h', match1to2);
addRegexToken('k', match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
  var kInput = toInt(input);
  array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
  config._isPm = config._locale.isPM(input);
  config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
  array[HOUR] = toInt(input);
  getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
  var pos = input.length - 2;
  array[HOUR] = toInt(input.substr(0, pos));
  array[MINUTE] = toInt(input.substr(pos));
  getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
  var pos1 = input.length - 4,
    pos2 = input.length - 2;
  array[HOUR] = toInt(input.substr(0, pos1));
  array[MINUTE] = toInt(input.substr(pos1, 2));
  array[SECOND] = toInt(input.substr(pos2));
  getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
  var pos = input.length - 2;
  array[HOUR] = toInt(input.substr(0, pos));
  array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
  var pos1 = input.length - 4,
    pos2 = input.length - 2;
  array[HOUR] = toInt(input.substr(0, pos1));
  array[MINUTE] = toInt(input.substr(pos1, 2));
  array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM(input) {
  // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
  // Using charAt should be more compatible.
  return (input + '').toLowerCase().charAt(0) === 'p';
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
  // Setting the hour should keep the time, because the user explicitly
  // specified which hour they want. So trying to maintain the same hour (in
  // a new timezone) makes sense. Adding/subtracting hours does not follow
  // this rule.
  getSetHour = makeGetSet('Hours', true);

function localeMeridiem(hours, minutes, isLower) {
  if (hours > 11) {
    return isLower ? 'pm' : 'PM';
  } else {
    return isLower ? 'am' : 'AM';
  }
}

var baseConfig = {
  calendar: defaultCalendar,
  longDateFormat: defaultLongDateFormat,
  invalidDate: defaultInvalidDate,
  ordinal: defaultOrdinal,
  dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
  relativeTime: defaultRelativeTime,

  months: defaultLocaleMonths,
  monthsShort: defaultLocaleMonthsShort,

  week: defaultLocaleWeek,

  weekdays: defaultLocaleWeekdays,
  weekdaysMin: defaultLocaleWeekdaysMin,
  weekdaysShort: defaultLocaleWeekdaysShort,

  meridiemParse: defaultLocaleMeridiemParse,
};

// internal storage for locale config files
var locales = {},
  localeFamilies = {},
  globalLocale;

function commonPrefix(arr1, arr2) {
  var i,
    minl = Math.min(arr1.length, arr2.length);
  for (i = 0; i < minl; i += 1) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return minl;
}

function normalizeLocale(key) {
  return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
  var i = 0,
    j,
    next,
    locale,
    split;

  while (i < names.length) {
    split = normalizeLocale(names[i]).split('-');
    j = split.length;
    next = normalizeLocale(names[i + 1]);
    next = next ? next.split('-') : null;
    while (j > 0) {
      locale = loadLocale(split.slice(0, j).join('-'));
      if (locale) {
        return locale;
      }
      if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
        //the next array item is better than a shallower substring of this one
        break;
      }
      j--;
    }
    i++;
  }
  return globalLocale;
}

function loadLocale(name) {
  var oldLocale = null,
    aliasedRequire;
  // TODO: Find a better way to register and load all the locales in Node
  if (locales[name] === undefined && typeof module !== 'undefined' && module && module.exports) {
    try {
      oldLocale = globalLocale._abbr;
      aliasedRequire = require;
      aliasedRequire('./locale/' + name);
      getSetGlobalLocale(oldLocale);
    } catch (e) {
      // mark as not found to avoid repeating expensive file require call causing high CPU
      // when trying to find en-US, en_US, en-us for every format call
      locales[name] = null; // null means not found
    }
  }
  return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale(key, values) {
  var data;
  if (key) {
    if (isUndefined(values)) {
      data = getLocale(key);
    } else {
      data = defineLocale(key, values);
    }

    if (data) {
      // moment.duration._locale = moment._locale = data;
      globalLocale = data;
    } else {
      if (typeof console !== 'undefined' && console.warn) {
        //warn user if arguments are passed but the locale could not be set
        console.warn('Locale ' + key + ' not found. Did you forget to load it?');
      }
    }
  }

  return globalLocale._abbr;
}

function defineLocale(name, config) {
  if (config !== null) {
    var locale,
      parentConfig = baseConfig;
    config.abbr = name;
    if (locales[name] != null) {
      deprecateSimple(
        'defineLocaleOverride',
        'use moment.updateLocale(localeName, config) to change ' +
          'an existing locale. moment.defineLocale(localeName, ' +
          'config) should only be used for creating a new locale ' +
          'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.',
      );
      parentConfig = locales[name]._config;
    } else if (config.parentLocale != null) {
      if (locales[config.parentLocale] != null) {
        parentConfig = locales[config.parentLocale]._config;
      } else {
        locale = loadLocale(config.parentLocale);
        if (locale != null) {
          parentConfig = locale._config;
        } else {
          if (!localeFamilies[config.parentLocale]) {
            localeFamilies[config.parentLocale] = [];
          }
          localeFamilies[config.parentLocale].push({
            name: name,
            config: config,
          });
          return null;
        }
      }
    }
    locales[name] = new Locale(mergeConfigs(parentConfig, config));

    if (localeFamilies[name]) {
      localeFamilies[name].forEach(function (x) {
        defineLocale(x.name, x.config);
      });
    }

    // backwards compat for now: also set the locale
    // make sure we set the locale AFTER all child locales have been
    // created, so we won't end up with the child locale set.
    getSetGlobalLocale(name);

    return locales[name];
  } else {
    // useful for testing
    delete locales[name];
    return null;
  }
}

function updateLocale(name, config) {
  if (config != null) {
    var locale,
      tmpLocale,
      parentConfig = baseConfig;

    if (locales[name] != null && locales[name].parentLocale != null) {
      // Update existing child locale in-place to avoid memory-leaks
      locales[name].set(mergeConfigs(locales[name]._config, config));
    } else {
      // MERGE
      tmpLocale = loadLocale(name);
      if (tmpLocale != null) {
        parentConfig = tmpLocale._config;
      }
      config = mergeConfigs(parentConfig, config);
      if (tmpLocale == null) {
        // updateLocale is called for creating a new locale
        // Set abbr so it will have a name (getters return
        // undefined otherwise).
        config.abbr = name;
      }
      locale = new Locale(config);
      locale.parentLocale = locales[name];
      locales[name] = locale;
    }

    // backwards compat for now: also set the locale
    getSetGlobalLocale(name);
  } else {
    // pass null for config to unupdate, useful for tests
    if (locales[name] != null) {
      if (locales[name].parentLocale != null) {
        locales[name] = locales[name].parentLocale;
        if (name === getSetGlobalLocale()) {
          getSetGlobalLocale(name);
        }
      } else if (locales[name] != null) {
        delete locales[name];
      }
    }
  }
  return locales[name];
}

// returns locale data
function getLocale(key) {
  var locale;

  if (key && key._locale && key._locale._abbr) {
    key = key._locale._abbr;
  }

  if (!key) {
    return globalLocale;
  }

  if (!isArray(key)) {
    //short-circuit everything else
    locale = loadLocale(key);
    if (locale) {
      return locale;
    }
    key = [key];
  }

  return chooseLocale(key);
}

function listLocales() {
  return keys(locales);
}

function checkOverflow(m) {
  var overflow,
    a = m._a;

  if (a && getParsingFlags(m).overflow === -2) {
    overflow =
      a[MONTH] < 0 || a[MONTH] > 11
        ? MONTH
        : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
        ? DATE
        : a[HOUR] < 0 ||
          a[HOUR] > 24 ||
          (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0))
        ? HOUR
        : a[MINUTE] < 0 || a[MINUTE] > 59
        ? MINUTE
        : a[SECOND] < 0 || a[SECOND] > 59
        ? SECOND
        : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
        ? MILLISECOND
        : -1;

    if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
      overflow = DATE;
    }
    if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
      overflow = WEEK;
    }
    if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
      overflow = WEEKDAY;
    }

    getParsingFlags(m).overflow = overflow;
  }

  return m;
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex =
    /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
  basicIsoRegex =
    /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
  tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
  isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/],
    ['YYYYMM', /\d{6}/, false],
    ['YYYY', /\d{4}/, false],
  ],
  // iso time formats and regexes
  isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/],
  ],
  aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
  // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
  rfc2822 =
    /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
  obsOffsets = {
    UT: 0,
    GMT: 0,
    EDT: -4 * 60,
    EST: -5 * 60,
    CDT: -5 * 60,
    CST: -6 * 60,
    MDT: -6 * 60,
    MST: -7 * 60,
    PDT: -7 * 60,
    PST: -8 * 60,
  };

// date from iso format
function configFromISO(config) {
  var i,
    l,
    string = config._i,
    match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
    allowTime,
    dateFormat,
    timeFormat,
    tzFormat;

  if (match) {
    getParsingFlags(config).iso = true;

    for (i = 0, l = isoDates.length; i < l; i++) {
      if (isoDates[i][1].exec(match[1])) {
        dateFormat = isoDates[i][0];
        allowTime = isoDates[i][2] !== false;
        break;
      }
    }
    if (dateFormat == null) {
      config._isValid = false;
      return;
    }
    if (match[3]) {
      for (i = 0, l = isoTimes.length; i < l; i++) {
        if (isoTimes[i][1].exec(match[3])) {
          // match[2] should be 'T' or space
          timeFormat = (match[2] || ' ') + isoTimes[i][0];
          break;
        }
      }
      if (timeFormat == null) {
        config._isValid = false;
        return;
      }
    }
    if (!allowTime && timeFormat != null) {
      config._isValid = false;
      return;
    }
    if (match[4]) {
      if (tzRegex.exec(match[4])) {
        tzFormat = 'Z';
      } else {
        config._isValid = false;
        return;
      }
    }
    config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
    configFromStringAndFormat(config);
  } else {
    config._isValid = false;
  }
}

function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  var result = [
    untruncateYear(yearStr),
    defaultLocaleMonthsShort.indexOf(monthStr),
    parseInt(dayStr, 10),
    parseInt(hourStr, 10),
    parseInt(minuteStr, 10),
  ];

  if (secondStr) {
    result.push(parseInt(secondStr, 10));
  }

  return result;
}

function untruncateYear(yearStr) {
  var year = parseInt(yearStr, 10);
  if (year <= 49) {
    return 2000 + year;
  } else if (year <= 999) {
    return 1900 + year;
  }
  return year;
}

function preprocessRFC2822(s) {
  // Remove comments and folding whitespace and replace multiple-spaces with a single space
  return s
    .replace(/\([^)]*\)|[\n\t]/g, ' ')
    .replace(/(\s\s+)/g, ' ')
    .replace(/^\s\s*/, '')
    .replace(/\s\s*$/, '');
}

function checkWeekday(weekdayStr, parsedInput, config) {
  if (weekdayStr) {
    // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
    var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
      weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
    if (weekdayProvided !== weekdayActual) {
      getParsingFlags(config).weekdayMismatch = true;
      config._isValid = false;
      return false;
    }
  }
  return true;
}

function calculateOffset(obsOffset, militaryOffset, numOffset) {
  if (obsOffset) {
    return obsOffsets[obsOffset];
  } else if (militaryOffset) {
    // the only allowed military tz is Z
    return 0;
  } else {
    var hm = parseInt(numOffset, 10),
      m = hm % 100,
      h = (hm - m) / 100;
    return h * 60 + m;
  }
}

// date and time from ref 2822 format
function configFromRFC2822(config) {
  var match = rfc2822.exec(preprocessRFC2822(config._i)),
    parsedArray;
  if (match) {
    parsedArray = extractFromRFC2822Strings(
      match[4],
      match[3],
      match[2],
      match[5],
      match[6],
      match[7],
    );
    if (!checkWeekday(match[1], parsedArray, config)) {
      return;
    }

    config._a = parsedArray;
    config._tzm = calculateOffset(match[8], match[9], match[10]);

    config._d = createUTCDate.apply(null, config._a);
    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

    getParsingFlags(config).rfc2822 = true;
  } else {
    config._isValid = false;
  }
}

// date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
function configFromString(config) {
  var matched = aspNetJsonRegex.exec(config._i);
  if (matched !== null) {
    config._d = new Date(+matched[1]);
    return;
  }

  configFromISO(config);
  if (config._isValid === false) {
    delete config._isValid;
  } else {
    return;
  }

  configFromRFC2822(config);
  if (config._isValid === false) {
    delete config._isValid;
  } else {
    return;
  }

  if (config._strict) {
    config._isValid = false;
  } else {
    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
  }
}

hooks.createFromInputFallback = deprecate(
  'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
  function (config) {
    config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
  },
);

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
  if (a != null) {
    return a;
  }
  if (b != null) {
    return b;
  }
  return c;
}

function currentDateArray(config) {
  // hooks is actually the exported moment object
  var nowValue = new Date(hooks.now());
  if (config._useUTC) {
    return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
  }
  return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray(config) {
  var i,
    date,
    input = [],
    currentDate,
    expectedWeekday,
    yearToUse;

  if (config._d) {
    return;
  }

  currentDate = currentDateArray(config);

  //compute day of the year from weeks and weekdays
  if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
    dayOfYearFromWeekInfo(config);
  }

  //if the day of the year is set, figure out what it is
  if (config._dayOfYear != null) {
    yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

    if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
      getParsingFlags(config)._overflowDayOfYear = true;
    }

    date = createUTCDate(yearToUse, 0, config._dayOfYear);
    config._a[MONTH] = date.getUTCMonth();
    config._a[DATE] = date.getUTCDate();
  }

  // Default to current date.
  // * if no year, month, day of month are given, default to today
  // * if day of month is given, default month and year
  // * if month is given, default only year
  // * if year is given, don't default anything
  for (i = 0; i < 3 && config._a[i] == null; ++i) {
    config._a[i] = input[i] = currentDate[i];
  }

  // Zero out whatever was not defaulted, including time
  for (; i < 7; i++) {
    config._a[i] = input[i] = config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
  }

  // Check for 24:00:00.000
  if (
    config._a[HOUR] === 24 &&
    config._a[MINUTE] === 0 &&
    config._a[SECOND] === 0 &&
    config._a[MILLISECOND] === 0
  ) {
    config._nextDay = true;
    config._a[HOUR] = 0;
  }

  config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
  expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

  // Apply timezone offset from input. The actual utcOffset can be changed
  // with parseZone.
  if (config._tzm != null) {
    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
  }

  if (config._nextDay) {
    config._a[HOUR] = 24;
  }

  // check for mismatching day of week
  if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
    getParsingFlags(config).weekdayMismatch = true;
  }
}

function dayOfYearFromWeekInfo(config) {
  var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

  w = config._w;
  if (w.GG != null || w.W != null || w.E != null) {
    dow = 1;
    doy = 4;

    // TODO: We need to take the current isoWeekYear, but that depends on
    // how we interpret now (local, utc, fixed offset). So create
    // a now version of current config (take local/utc/offset flags, and
    // create now).
    weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
    week = defaults(w.W, 1);
    weekday = defaults(w.E, 1);
    if (weekday < 1 || weekday > 7) {
      weekdayOverflow = true;
    }
  } else {
    dow = config._locale._week.dow;
    doy = config._locale._week.doy;

    curWeek = weekOfYear(createLocal(), dow, doy);

    weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

    // Default to current week.
    week = defaults(w.w, curWeek.week);

    if (w.d != null) {
      // weekday -- low day numbers are considered next week
      weekday = w.d;
      if (weekday < 0 || weekday > 6) {
        weekdayOverflow = true;
      }
    } else if (w.e != null) {
      // local weekday -- counting starts from beginning of week
      weekday = w.e + dow;
      if (w.e < 0 || w.e > 6) {
        weekdayOverflow = true;
      }
    } else {
      // default to beginning of week
      weekday = dow;
    }
  }
  if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
    getParsingFlags(config)._overflowWeeks = true;
  } else if (weekdayOverflow != null) {
    getParsingFlags(config)._overflowWeekday = true;
  } else {
    temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
    config._a[YEAR] = temp.year;
    config._dayOfYear = temp.dayOfYear;
  }
}

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
  // TODO: Move this to another part of the creation flow to prevent circular deps
  if (config._f === hooks.ISO_8601) {
    configFromISO(config);
    return;
  }
  if (config._f === hooks.RFC_2822) {
    configFromRFC2822(config);
    return;
  }
  config._a = [];
  getParsingFlags(config).empty = true;

  // This array is used to make a Date, either with `new Date` or `Date.UTC`
  var string = '' + config._i,
    i,
    parsedInput,
    tokens,
    token,
    skipped,
    stringLength = string.length,
    totalParsedInputLength = 0,
    era;

  tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
    if (parsedInput) {
      skipped = string.substr(0, string.indexOf(parsedInput));
      if (skipped.length > 0) {
        getParsingFlags(config).unusedInput.push(skipped);
      }
      string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
      totalParsedInputLength += parsedInput.length;
    }
    // don't parse if it's not a known token
    if (formatTokenFunctions[token]) {
      if (parsedInput) {
        getParsingFlags(config).empty = false;
      } else {
        getParsingFlags(config).unusedTokens.push(token);
      }
      addTimeToArrayFromToken(token, parsedInput, config);
    } else if (config._strict && !parsedInput) {
      getParsingFlags(config).unusedTokens.push(token);
    }
  }

  // add remaining unparsed input length to the string
  getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
  if (string.length > 0) {
    getParsingFlags(config).unusedInput.push(string);
  }

  // clear _12h flag if hour is <= 12
  if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
    getParsingFlags(config).bigHour = undefined;
  }

  getParsingFlags(config).parsedDateParts = config._a.slice(0);
  getParsingFlags(config).meridiem = config._meridiem;
  // handle meridiem
  config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

  // handle era
  era = getParsingFlags(config).era;
  if (era !== null) {
    config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
  }

  configFromArray(config);
  checkOverflow(config);
}

function meridiemFixWrap(locale, hour, meridiem) {
  var isPm;

  if (meridiem == null) {
    // nothing to do
    return hour;
  }
  if (locale.meridiemHour != null) {
    return locale.meridiemHour(hour, meridiem);
  } else if (locale.isPM != null) {
    // Fallback
    isPm = locale.isPM(meridiem);
    if (isPm && hour < 12) {
      hour += 12;
    }
    if (!isPm && hour === 12) {
      hour = 0;
    }
    return hour;
  } else {
    // this is not supposed to happen
    return hour;
  }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
  var tempConfig,
    bestMoment,
    scoreToBeat,
    i,
    currentScore,
    validFormatFound,
    bestFormatIsValid = false;

  if (config._f.length === 0) {
    getParsingFlags(config).invalidFormat = true;
    config._d = new Date(NaN);
    return;
  }

  for (i = 0; i < config._f.length; i++) {
    currentScore = 0;
    validFormatFound = false;
    tempConfig = copyConfig({}, config);
    if (config._useUTC != null) {
      tempConfig._useUTC = config._useUTC;
    }
    tempConfig._f = config._f[i];
    configFromStringAndFormat(tempConfig);

    if (isValid(tempConfig)) {
      validFormatFound = true;
    }

    // if there is any input that was not parsed add a penalty for that format
    currentScore += getParsingFlags(tempConfig).charsLeftOver;

    //or tokens
    currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

    getParsingFlags(tempConfig).score = currentScore;

    if (!bestFormatIsValid) {
      if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
        if (validFormatFound) {
          bestFormatIsValid = true;
        }
      }
    } else {
      if (currentScore < scoreToBeat) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
      }
    }
  }

  extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
  if (config._d) {
    return;
  }

  var i = normalizeObjectUnits(config._i),
    dayOrDate = i.day === undefined ? i.date : i.day;
  config._a = map(
    [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
    function (obj) {
      return obj && parseInt(obj, 10);
    },
  );

  configFromArray(config);
}

function createFromConfig(config) {
  var res = new Moment(checkOverflow(prepareConfig(config)));
  if (res._nextDay) {
    // Adding is smart enough around DST
    res.add(1, 'd');
    res._nextDay = undefined;
  }

  return res;
}

function prepareConfig(config) {
  var input = config._i,
    format = config._f;

  config._locale = config._locale || getLocale(config._l);

  if (input === null || (format === undefined && input === '')) {
    return createInvalid({ nullInput: true });
  }

  if (typeof input === 'string') {
    config._i = input = config._locale.preparse(input);
  }

  if (isMoment(input)) {
    return new Moment(checkOverflow(input));
  } else if (isDate(input)) {
    config._d = input;
  } else if (isArray(format)) {
    configFromStringAndArray(config);
  } else if (format) {
    configFromStringAndFormat(config);
  } else {
    configFromInput(config);
  }

  if (!isValid(config)) {
    config._d = null;
  }

  return config;
}

function configFromInput(config) {
  var input = config._i;
  if (isUndefined(input)) {
    config._d = new Date(hooks.now());
  } else if (isDate(input)) {
    config._d = new Date(input.valueOf());
  } else if (typeof input === 'string') {
    configFromString(config);
  } else if (isArray(input)) {
    config._a = map(input.slice(0), function (obj) {
      return parseInt(obj, 10);
    });
    configFromArray(config);
  } else if (isObject(input)) {
    configFromObject(config);
  } else if (isNumber(input)) {
    // from milliseconds
    config._d = new Date(input);
  } else {
    hooks.createFromInputFallback(config);
  }
}

function createLocalOrUTC(input, format, locale, strict, isUTC) {
  var c = {};

  if (format === true || format === false) {
    strict = format;
    format = undefined;
  }

  if (locale === true || locale === false) {
    strict = locale;
    locale = undefined;
  }

  if ((isObject(input) && isObjectEmpty(input)) || (isArray(input) && input.length === 0)) {
    input = undefined;
  }
  // object construction must be done this way.
  // https://github.com/moment/moment/issues/1423
  c._isAMomentObject = true;
  c._useUTC = c._isUTC = isUTC;
  c._l = locale;
  c._i = input;
  c._f = format;
  c._strict = strict;

  return createFromConfig(c);
}

function createLocal(input, format, locale, strict) {
  return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
      var other = createLocal.apply(null, arguments);
      if (this.isValid() && other.isValid()) {
        return other < this ? this : other;
      } else {
        return createInvalid();
      }
    },
  ),
  prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
      var other = createLocal.apply(null, arguments);
      if (this.isValid() && other.isValid()) {
        return other > this ? this : other;
      } else {
        return createInvalid();
      }
    },
  );

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
  var res, i;
  if (moments.length === 1 && isArray(moments[0])) {
    moments = moments[0];
  }
  if (!moments.length) {
    return createLocal();
  }
  res = moments[0];
  for (i = 1; i < moments.length; ++i) {
    if (!moments[i].isValid() || moments[i][fn](res)) {
      res = moments[i];
    }
  }
  return res;
}

// TODO: Use [].sort instead?
function min() {
  var args = [].slice.call(arguments, 0);

  return pickBy('isBefore', args);
}

function max() {
  var args = [].slice.call(arguments, 0);

  return pickBy('isAfter', args);
}

var now = function () {
  return Date.now ? Date.now() : +new Date();
};

var ordering = [
  'year',
  'quarter',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond',
];

function isDurationValid(m) {
  var key,
    unitHasDecimal = false,
    i;
  for (key in m) {
    if (
      hasOwnProp(m, key) &&
      !(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))
    ) {
      return false;
    }
  }

  for (i = 0; i < ordering.length; ++i) {
    if (m[ordering[i]]) {
      if (unitHasDecimal) {
        return false; // only allow non-integers for smallest unit
      }
      if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
        unitHasDecimal = true;
      }
    }
  }

  return true;
}

function isValid$1() {
  return this._isValid;
}

function createInvalid$1() {
  return createDuration(NaN);
}

function Duration(duration) {
  var normalizedInput = normalizeObjectUnits(duration),
    years = normalizedInput.year || 0,
    quarters = normalizedInput.quarter || 0,
    months = normalizedInput.month || 0,
    weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
    days = normalizedInput.day || 0,
    hours = normalizedInput.hour || 0,
    minutes = normalizedInput.minute || 0,
    seconds = normalizedInput.second || 0,
    milliseconds = normalizedInput.millisecond || 0;

  this._isValid = isDurationValid(normalizedInput);

  // representation for dateAddRemove
  this._milliseconds =
    +milliseconds +
    seconds * 1e3 + // 1000
    minutes * 6e4 + // 1000 * 60
    hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
  // Because of dateAddRemove treats 24 hours as different from a
  // day when working around DST, we need to store them separately
  this._days = +days + weeks * 7;
  // It is impossible to translate months into days without knowing
  // which months you are are talking about, so we have to store
  // it separately.
  this._months = +months + quarters * 3 + years * 12;

  this._data = {};

  this._locale = getLocale();

  this._bubble();
}

function isDuration(obj) {
  return obj instanceof Duration;
}

function absRound(number) {
  if (number < 0) {
    return Math.round(-1 * number) * -1;
  } else {
    return Math.round(number);
  }
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
  var len = Math.min(array1.length, array2.length),
    lengthDiff = Math.abs(array1.length - array2.length),
    diffs = 0,
    i;
  for (i = 0; i < len; i++) {
    if (
      (dontConvert && array1[i] !== array2[i]) ||
      (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
    ) {
      diffs++;
    }
  }
  return diffs + lengthDiff;
}

// FORMATTING

function offset(token, separator) {
  addFormatToken(token, 0, 0, function () {
    var offset = this.utcOffset(),
      sign = '+';
    if (offset < 0) {
      offset = -offset;
      sign = '-';
    }
    return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
  });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z', matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
  config._useUTC = true;
  config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
  var matches = (string || '').match(matcher),
    chunk,
    parts,
    minutes;

  if (matches === null) {
    return null;
  }

  chunk = matches[matches.length - 1] || [];
  parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
  minutes = +(parts[1] * 60) + toInt(parts[2]);

  return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
  var res, diff;
  if (model._isUTC) {
    res = model.clone();
    diff =
      (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) -
      res.valueOf();
    // Use low-level api, because this fn is low-level api.
    res._d.setTime(res._d.valueOf() + diff);
    hooks.updateOffset(res, false);
    return res;
  } else {
    return createLocal(input).local();
  }
}

function getDateOffset(m) {
  // On Firefox.24 Date#getTimezoneOffset returns a floating point.
  // https://github.com/moment/moment/pull/1871
  return -Math.round(m._d.getTimezoneOffset());
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset(input, keepLocalTime, keepMinutes) {
  var offset = this._offset || 0,
    localAdjust;
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  if (input != null) {
    if (typeof input === 'string') {
      input = offsetFromString(matchShortOffset, input);
      if (input === null) {
        return this;
      }
    } else if (Math.abs(input) < 16 && !keepMinutes) {
      input = input * 60;
    }
    if (!this._isUTC && keepLocalTime) {
      localAdjust = getDateOffset(this);
    }
    this._offset = input;
    this._isUTC = true;
    if (localAdjust != null) {
      this.add(localAdjust, 'm');
    }
    if (offset !== input) {
      if (!keepLocalTime || this._changeInProgress) {
        addSubtract(this, createDuration(input - offset, 'm'), 1, false);
      } else if (!this._changeInProgress) {
        this._changeInProgress = true;
        hooks.updateOffset(this, true);
        this._changeInProgress = null;
      }
    }
    return this;
  } else {
    return this._isUTC ? offset : getDateOffset(this);
  }
}

function getSetZone(input, keepLocalTime) {
  if (input != null) {
    if (typeof input !== 'string') {
      input = -input;
    }

    this.utcOffset(input, keepLocalTime);

    return this;
  } else {
    return -this.utcOffset();
  }
}

function setOffsetToUTC(keepLocalTime) {
  return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal(keepLocalTime) {
  if (this._isUTC) {
    this.utcOffset(0, keepLocalTime);
    this._isUTC = false;

    if (keepLocalTime) {
      this.subtract(getDateOffset(this), 'm');
    }
  }
  return this;
}

function setOffsetToParsedOffset() {
  if (this._tzm != null) {
    this.utcOffset(this._tzm, false, true);
  } else if (typeof this._i === 'string') {
    var tZone = offsetFromString(matchOffset, this._i);
    if (tZone != null) {
      this.utcOffset(tZone);
    } else {
      this.utcOffset(0, true);
    }
  }
  return this;
}

function hasAlignedHourOffset(input) {
  if (!this.isValid()) {
    return false;
  }
  input = input ? createLocal(input).utcOffset() : 0;

  return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime() {
  return (
    this.utcOffset() > this.clone().month(0).utcOffset() ||
    this.utcOffset() > this.clone().month(5).utcOffset()
  );
}

function isDaylightSavingTimeShifted() {
  if (!isUndefined(this._isDSTShifted)) {
    return this._isDSTShifted;
  }

  var c = {},
    other;

  copyConfig(c, this);
  c = prepareConfig(c);

  if (c._a) {
    other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
    this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
  } else {
    this._isDSTShifted = false;
  }

  return this._isDSTShifted;
}

function isLocal() {
  return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset() {
  return this.isValid() ? this._isUTC : false;
}

function isUtc() {
  return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
  // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
  // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
  // and further modified to allow for strings containing both week and day
  isoRegex =
    /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

function createDuration(input, key) {
  var duration = input,
    // matching against regexp is expensive, do it on demand
    match = null,
    sign,
    ret,
    diffRes;

  if (isDuration(input)) {
    duration = {
      ms: input._milliseconds,
      d: input._days,
      M: input._months,
    };
  } else if (isNumber(input) || !isNaN(+input)) {
    duration = {};
    if (key) {
      duration[key] = +input;
    } else {
      duration.milliseconds = +input;
    }
  } else if ((match = aspNetRegex.exec(input))) {
    sign = match[1] === '-' ? -1 : 1;
    duration = {
      y: 0,
      d: toInt(match[DATE]) * sign,
      h: toInt(match[HOUR]) * sign,
      m: toInt(match[MINUTE]) * sign,
      s: toInt(match[SECOND]) * sign,
      ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
    };
  } else if ((match = isoRegex.exec(input))) {
    sign = match[1] === '-' ? -1 : 1;
    duration = {
      y: parseIso(match[2], sign),
      M: parseIso(match[3], sign),
      w: parseIso(match[4], sign),
      d: parseIso(match[5], sign),
      h: parseIso(match[6], sign),
      m: parseIso(match[7], sign),
      s: parseIso(match[8], sign),
    };
  } else if (duration == null) {
    // checks for null or undefined
    duration = {};
  } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
    diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

    duration = {};
    duration.ms = diffRes.milliseconds;
    duration.M = diffRes.months;
  }

  ret = new Duration(duration);

  if (isDuration(input) && hasOwnProp(input, '_locale')) {
    ret._locale = input._locale;
  }

  if (isDuration(input) && hasOwnProp(input, '_isValid')) {
    ret._isValid = input._isValid;
  }

  return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso(inp, sign) {
  // We'd normally use ~~inp for this, but unfortunately it also
  // converts floats to ints.
  // inp may be undefined, so careful calling replace on it.
  var res = inp && parseFloat(inp.replace(',', '.'));
  // apply sign while we're at it
  return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
  var res = {};

  res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
  if (base.clone().add(res.months, 'M').isAfter(other)) {
    --res.months;
  }

  res.milliseconds = +other - +base.clone().add(res.months, 'M');

  return res;
}

function momentsDifference(base, other) {
  var res;
  if (!(base.isValid() && other.isValid())) {
    return { milliseconds: 0, months: 0 };
  }

  other = cloneWithOffset(other, base);
  if (base.isBefore(other)) {
    res = positiveMomentsDifference(base, other);
  } else {
    res = positiveMomentsDifference(other, base);
    res.milliseconds = -res.milliseconds;
    res.months = -res.months;
  }

  return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
  return function (val, period) {
    var dur, tmp;
    //invert the arguments, but complain about it
    if (period !== null && !isNaN(+period)) {
      deprecateSimple(
        name,
        'moment().' +
          name +
          '(period, number) is deprecated. Please use moment().' +
          name +
          '(number, period). ' +
          'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.',
      );
      tmp = val;
      val = period;
      period = tmp;
    }

    dur = createDuration(val, period);
    addSubtract(this, dur, direction);
    return this;
  };
}

function addSubtract(mom, duration, isAdding, updateOffset) {
  var milliseconds = duration._milliseconds,
    days = absRound(duration._days),
    months = absRound(duration._months);

  if (!mom.isValid()) {
    // No op
    return;
  }

  updateOffset = updateOffset == null ? true : updateOffset;

  if (months) {
    setMonth(mom, get(mom, 'Month') + months * isAdding);
  }
  if (days) {
    set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
  }
  if (milliseconds) {
    mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
  }
  if (updateOffset) {
    hooks.updateOffset(mom, days || months);
  }
}

var add = createAdder(1, 'add'),
  subtract = createAdder(-1, 'subtract');

function isString(input) {
  return typeof input === 'string' || input instanceof String;
}

// type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
function isMomentInput(input) {
  return (
    isMoment(input) ||
    isDate(input) ||
    isString(input) ||
    isNumber(input) ||
    isNumberOrStringArray(input) ||
    isMomentInputObject(input) ||
    input === null ||
    input === undefined
  );
}

function isMomentInputObject(input) {
  var objectTest = isObject(input) && !isObjectEmpty(input),
    propertyTest = false,
    properties = [
      'years',
      'year',
      'y',
      'months',
      'month',
      'M',
      'days',
      'day',
      'd',
      'dates',
      'date',
      'D',
      'hours',
      'hour',
      'h',
      'minutes',
      'minute',
      'm',
      'seconds',
      'second',
      's',
      'milliseconds',
      'millisecond',
      'ms',
    ],
    i,
    property;

  for (i = 0; i < properties.length; i += 1) {
    property = properties[i];
    propertyTest = propertyTest || hasOwnProp(input, property);
  }

  return objectTest && propertyTest;
}

function isNumberOrStringArray(input) {
  var arrayTest = isArray(input),
    dataTypeTest = false;
  if (arrayTest) {
    dataTypeTest =
      input.filter(function (item) {
        return !isNumber(item) && isString(input);
      }).length === 0;
  }
  return arrayTest && dataTypeTest;
}

function isCalendarSpec(input) {
  var objectTest = isObject(input) && !isObjectEmpty(input),
    propertyTest = false,
    properties = ['sameDay', 'nextDay', 'lastDay', 'nextWeek', 'lastWeek', 'sameElse'],
    i,
    property;

  for (i = 0; i < properties.length; i += 1) {
    property = properties[i];
    propertyTest = propertyTest || hasOwnProp(input, property);
  }

  return objectTest && propertyTest;
}

function getCalendarFormat(myMoment, now) {
  var diff = myMoment.diff(now, 'days', true);
  return diff < -6
    ? 'sameElse'
    : diff < -1
    ? 'lastWeek'
    : diff < 0
    ? 'lastDay'
    : diff < 1
    ? 'sameDay'
    : diff < 2
    ? 'nextDay'
    : diff < 7
    ? 'nextWeek'
    : 'sameElse';
}

function calendar$1(time, formats) {
  // Support for single parameter, formats only overload to the calendar function
  if (arguments.length === 1) {
    if (isMomentInput(arguments[0])) {
      time = arguments[0];
      formats = undefined;
    } else if (isCalendarSpec(arguments[0])) {
      formats = arguments[0];
      time = undefined;
    }
  }
  // We want to compare the start of today, vs this.
  // Getting start-of-today depends on whether we're local/utc/offset or not.
  var now = time || createLocal(),
    sod = cloneWithOffset(now, this).startOf('day'),
    format = hooks.calendarFormat(this, sod) || 'sameElse',
    output =
      formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

  return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone() {
  return new Moment(this);
}

function isAfter(input, units) {
  var localInput = isMoment(input) ? input : createLocal(input);
  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }
  units = normalizeUnits(units) || 'millisecond';
  if (units === 'millisecond') {
    return this.valueOf() > localInput.valueOf();
  } else {
    return localInput.valueOf() < this.clone().startOf(units).valueOf();
  }
}

function isBefore(input, units) {
  var localInput = isMoment(input) ? input : createLocal(input);
  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }
  units = normalizeUnits(units) || 'millisecond';
  if (units === 'millisecond') {
    return this.valueOf() < localInput.valueOf();
  } else {
    return this.clone().endOf(units).valueOf() < localInput.valueOf();
  }
}

function isBetween(from, to, units, inclusivity) {
  var localFrom = isMoment(from) ? from : createLocal(from),
    localTo = isMoment(to) ? to : createLocal(to);
  if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
    return false;
  }
  inclusivity = inclusivity || '()';
  return (
    (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) &&
    (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units))
  );
}

function isSame(input, units) {
  var localInput = isMoment(input) ? input : createLocal(input),
    inputMs;
  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }
  units = normalizeUnits(units) || 'millisecond';
  if (units === 'millisecond') {
    return this.valueOf() === localInput.valueOf();
  } else {
    inputMs = localInput.valueOf();
    return (
      this.clone().startOf(units).valueOf() <= inputMs &&
      inputMs <= this.clone().endOf(units).valueOf()
    );
  }
}

function isSameOrAfter(input, units) {
  return this.isSame(input, units) || this.isAfter(input, units);
}

function isSameOrBefore(input, units) {
  return this.isSame(input, units) || this.isBefore(input, units);
}

function diff(input, units, asFloat) {
  var that, zoneDelta, output;

  if (!this.isValid()) {
    return NaN;
  }

  that = cloneWithOffset(input, this);

  if (!that.isValid()) {
    return NaN;
  }

  zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

  units = normalizeUnits(units);

  switch (units) {
    case 'year':
      output = monthDiff(this, that) / 12;
      break;
    case 'month':
      output = monthDiff(this, that);
      break;
    case 'quarter':
      output = monthDiff(this, that) / 3;
      break;
    case 'second':
      output = (this - that) / 1e3;
      break; // 1000
    case 'minute':
      output = (this - that) / 6e4;
      break; // 1000 * 60
    case 'hour':
      output = (this - that) / 36e5;
      break; // 1000 * 60 * 60
    case 'day':
      output = (this - that - zoneDelta) / 864e5;
      break; // 1000 * 60 * 60 * 24, negate dst
    case 'week':
      output = (this - that - zoneDelta) / 6048e5;
      break; // 1000 * 60 * 60 * 24 * 7, negate dst
    default:
      output = this - that;
  }

  return asFloat ? output : absFloor(output);
}

function monthDiff(a, b) {
  if (a.date() < b.date()) {
    // end-of-month calculations work correct when the start month has more
    // days than the end month.
    return -monthDiff(b, a);
  }
  // difference in months
  var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
    // b is in (anchor - 1 month, anchor + 1 month)
    anchor = a.clone().add(wholeMonthDiff, 'months'),
    anchor2,
    adjust;

  if (b - anchor < 0) {
    anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
    // linear across the month
    adjust = (b - anchor) / (anchor - anchor2);
  } else {
    anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
    // linear across the month
    adjust = (b - anchor) / (anchor2 - anchor);
  }

  //check for negative zero, return zero if negative zero
  return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString() {
  return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString(keepOffset) {
  if (!this.isValid()) {
    return null;
  }
  var utc = keepOffset !== true,
    m = utc ? this.clone().utc() : this;
  if (m.year() < 0 || m.year() > 9999) {
    return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
  }
  if (isFunction(Date.prototype.toISOString)) {
    // native implementation is ~50x faster, use it when we can
    if (utc) {
      return this.toDate().toISOString();
    } else {
      return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
        .toISOString()
        .replace('Z', formatMoment(m, 'Z'));
    }
  }
  return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect() {
  if (!this.isValid()) {
    return 'moment.invalid(/* ' + this._i + ' */)';
  }
  var func = 'moment',
    zone = '',
    prefix,
    year,
    datetime,
    suffix;
  if (!this.isLocal()) {
    func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
    zone = 'Z';
  }
  prefix = '[' + func + '("]';
  year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
  datetime = '-MM-DD[T]HH:mm:ss.SSS';
  suffix = zone + '[")]';

  return this.format(prefix + year + datetime + suffix);
}

function format(inputString) {
  if (!inputString) {
    inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
  }
  var output = formatMoment(this, inputString);
  return this.localeData().postformat(output);
}

function from(time, withoutSuffix) {
  if (this.isValid() && ((isMoment(time) && time.isValid()) || createLocal(time).isValid())) {
    return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
  } else {
    return this.localeData().invalidDate();
  }
}

function fromNow(withoutSuffix) {
  return this.from(createLocal(), withoutSuffix);
}

function to(time, withoutSuffix) {
  if (this.isValid() && ((isMoment(time) && time.isValid()) || createLocal(time).isValid())) {
    return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
  } else {
    return this.localeData().invalidDate();
  }
}

function toNow(withoutSuffix) {
  return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale(key) {
  var newLocaleData;

  if (key === undefined) {
    return this._locale._abbr;
  } else {
    newLocaleData = getLocale(key);
    if (newLocaleData != null) {
      this._locale = newLocaleData;
    }
    return this;
  }
}

var lang = deprecate(
  'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
  function (key) {
    if (key === undefined) {
      return this.localeData();
    } else {
      return this.locale(key);
    }
  },
);

function localeData() {
  return this._locale;
}

var MS_PER_SECOND = 1000,
  MS_PER_MINUTE = 60 * MS_PER_SECOND,
  MS_PER_HOUR = 60 * MS_PER_MINUTE,
  MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

// actual modulo - handles negative numbers (for dates before 1970):
function mod$1(dividend, divisor) {
  return ((dividend % divisor) + divisor) % divisor;
}

function localStartOfDate(y, m, d) {
  // the date constructor remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    // preserve leap years using a full 400 year cycle, then reset
    return new Date(y + 400, m, d) - MS_PER_400_YEARS;
  } else {
    return new Date(y, m, d).valueOf();
  }
}

function utcStartOfDate(y, m, d) {
  // Date.UTC remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    // preserve leap years using a full 400 year cycle, then reset
    return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
  } else {
    return Date.UTC(y, m, d);
  }
}

function startOf(units) {
  var time, startOfDate;
  units = normalizeUnits(units);
  if (units === undefined || units === 'millisecond' || !this.isValid()) {
    return this;
  }

  startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

  switch (units) {
    case 'year':
      time = startOfDate(this.year(), 0, 1);
      break;
    case 'quarter':
      time = startOfDate(this.year(), this.month() - (this.month() % 3), 1);
      break;
    case 'month':
      time = startOfDate(this.year(), this.month(), 1);
      break;
    case 'week':
      time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
      break;
    case 'isoWeek':
      time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
      break;
    case 'day':
    case 'date':
      time = startOfDate(this.year(), this.month(), this.date());
      break;
    case 'hour':
      time = this._d.valueOf();
      time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
      break;
    case 'minute':
      time = this._d.valueOf();
      time -= mod$1(time, MS_PER_MINUTE);
      break;
    case 'second':
      time = this._d.valueOf();
      time -= mod$1(time, MS_PER_SECOND);
      break;
  }

  this._d.setTime(time);
  hooks.updateOffset(this, true);
  return this;
}

function endOf(units) {
  var time, startOfDate;
  units = normalizeUnits(units);
  if (units === undefined || units === 'millisecond' || !this.isValid()) {
    return this;
  }

  startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

  switch (units) {
    case 'year':
      time = startOfDate(this.year() + 1, 0, 1) - 1;
      break;
    case 'quarter':
      time = startOfDate(this.year(), this.month() - (this.month() % 3) + 3, 1) - 1;
      break;
    case 'month':
      time = startOfDate(this.year(), this.month() + 1, 1) - 1;
      break;
    case 'week':
      time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
      break;
    case 'isoWeek':
      time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
      break;
    case 'day':
    case 'date':
      time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
      break;
    case 'hour':
      time = this._d.valueOf();
      time +=
        MS_PER_HOUR -
        mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) -
        1;
      break;
    case 'minute':
      time = this._d.valueOf();
      time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
      break;
    case 'second':
      time = this._d.valueOf();
      time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
      break;
  }

  this._d.setTime(time);
  hooks.updateOffset(this, true);
  return this;
}

function valueOf() {
  return this._d.valueOf() - (this._offset || 0) * 60000;
}

function unix() {
  return Math.floor(this.valueOf() / 1000);
}

function toDate() {
  return new Date(this.valueOf());
}

function toArray() {
  var m = this;
  return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject() {
  var m = this;
  return {
    years: m.year(),
    months: m.month(),
    date: m.date(),
    hours: m.hours(),
    minutes: m.minutes(),
    seconds: m.seconds(),
    milliseconds: m.milliseconds(),
  };
}

function toJSON() {
  // new Date(NaN).toJSON() === null
  return this.isValid() ? this.toISOString() : null;
}

function isValid$2() {
  return isValid(this);
}

function parsingFlags() {
  return extend({}, getParsingFlags(this));
}

function invalidAt() {
  return getParsingFlags(this).overflow;
}

function creationData() {
  return {
    input: this._i,
    format: this._f,
    locale: this._locale,
    isUTC: this._isUTC,
    strict: this._strict,
  };
}

addFormatToken('N', 0, 0, 'eraAbbr');
addFormatToken('NN', 0, 0, 'eraAbbr');
addFormatToken('NNN', 0, 0, 'eraAbbr');
addFormatToken('NNNN', 0, 0, 'eraName');
addFormatToken('NNNNN', 0, 0, 'eraNarrow');

addFormatToken('y', ['y', 1], 'yo', 'eraYear');
addFormatToken('y', ['yy', 2], 0, 'eraYear');
addFormatToken('y', ['yyy', 3], 0, 'eraYear');
addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

addRegexToken('N', matchEraAbbr);
addRegexToken('NN', matchEraAbbr);
addRegexToken('NNN', matchEraAbbr);
addRegexToken('NNNN', matchEraName);
addRegexToken('NNNNN', matchEraNarrow);

addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (input, array, config, token) {
  var era = config._locale.erasParse(input, token, config._strict);
  if (era) {
    getParsingFlags(config).era = era;
  } else {
    getParsingFlags(config).invalidEra = input;
  }
});

addRegexToken('y', matchUnsigned);
addRegexToken('yy', matchUnsigned);
addRegexToken('yyy', matchUnsigned);
addRegexToken('yyyy', matchUnsigned);
addRegexToken('yo', matchEraYearOrdinal);

addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
addParseToken(['yo'], function (input, array, config, token) {
  var match;
  if (config._locale._eraYearOrdinalRegex) {
    match = input.match(config._locale._eraYearOrdinalRegex);
  }

  if (config._locale.eraYearOrdinalParse) {
    array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
  } else {
    array[YEAR] = parseInt(input, 10);
  }
});

function localeEras(m, format) {
  var i,
    l,
    date,
    eras = this._eras || getLocale('en')._eras;
  for (i = 0, l = eras.length; i < l; ++i) {
    switch (typeof eras[i].since) {
      case 'string':
        // truncate time
        date = hooks(eras[i].since).startOf('day');
        eras[i].since = date.valueOf();
        break;
    }

    switch (typeof eras[i].until) {
      case 'undefined':
        eras[i].until = +Infinity;
        break;
      case 'string':
        // truncate time
        date = hooks(eras[i].until).startOf('day').valueOf();
        eras[i].until = date.valueOf();
        break;
    }
  }
  return eras;
}

function localeErasParse(eraName, format, strict) {
  var i,
    l,
    eras = this.eras(),
    name,
    abbr,
    narrow;
  eraName = eraName.toUpperCase();

  for (i = 0, l = eras.length; i < l; ++i) {
    name = eras[i].name.toUpperCase();
    abbr = eras[i].abbr.toUpperCase();
    narrow = eras[i].narrow.toUpperCase();

    if (strict) {
      switch (format) {
        case 'N':
        case 'NN':
        case 'NNN':
          if (abbr === eraName) {
            return eras[i];
          }
          break;

        case 'NNNN':
          if (name === eraName) {
            return eras[i];
          }
          break;

        case 'NNNNN':
          if (narrow === eraName) {
            return eras[i];
          }
          break;
      }
    } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
      return eras[i];
    }
  }
}

function localeErasConvertYear(era, year) {
  var dir = era.since <= era.until ? +1 : -1;
  if (year === undefined) {
    return hooks(era.since).year();
  } else {
    return hooks(era.since).year() + (year - era.offset) * dir;
  }
}

function getEraName() {
  var i,
    l,
    val,
    eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    // truncate time
    val = this.startOf('day').valueOf();

    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].name;
    }
    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].name;
    }
  }

  return '';
}

function getEraNarrow() {
  var i,
    l,
    val,
    eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    // truncate time
    val = this.startOf('day').valueOf();

    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].narrow;
    }
    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].narrow;
    }
  }

  return '';
}

function getEraAbbr() {
  var i,
    l,
    val,
    eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    // truncate time
    val = this.startOf('day').valueOf();

    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].abbr;
    }
    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].abbr;
    }
  }

  return '';
}

function getEraYear() {
  var i,
    l,
    dir,
    val,
    eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    dir = eras[i].since <= eras[i].until ? +1 : -1;

    // truncate time
    val = this.startOf('day').valueOf();

    if (
      (eras[i].since <= val && val <= eras[i].until) ||
      (eras[i].until <= val && val <= eras[i].since)
    ) {
      return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
    }
  }

  return this.year();
}

function erasNameRegex(isStrict) {
  if (!hasOwnProp(this, '_erasNameRegex')) {
    computeErasParse.call(this);
  }
  return isStrict ? this._erasNameRegex : this._erasRegex;
}

function erasAbbrRegex(isStrict) {
  if (!hasOwnProp(this, '_erasAbbrRegex')) {
    computeErasParse.call(this);
  }
  return isStrict ? this._erasAbbrRegex : this._erasRegex;
}

function erasNarrowRegex(isStrict) {
  if (!hasOwnProp(this, '_erasNarrowRegex')) {
    computeErasParse.call(this);
  }
  return isStrict ? this._erasNarrowRegex : this._erasRegex;
}

function matchEraAbbr(isStrict, locale) {
  return locale.erasAbbrRegex(isStrict);
}

function matchEraName(isStrict, locale) {
  return locale.erasNameRegex(isStrict);
}

function matchEraNarrow(isStrict, locale) {
  return locale.erasNarrowRegex(isStrict);
}

function matchEraYearOrdinal(isStrict, locale) {
  return locale._eraYearOrdinalRegex || matchUnsigned;
}

function computeErasParse() {
  var abbrPieces = [],
    namePieces = [],
    narrowPieces = [],
    mixedPieces = [],
    i,
    l,
    eras = this.eras();

  for (i = 0, l = eras.length; i < l; ++i) {
    namePieces.push(regexEscape(eras[i].name));
    abbrPieces.push(regexEscape(eras[i].abbr));
    narrowPieces.push(regexEscape(eras[i].narrow));

    mixedPieces.push(regexEscape(eras[i].name));
    mixedPieces.push(regexEscape(eras[i].abbr));
    mixedPieces.push(regexEscape(eras[i].narrow));
  }

  this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
  this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
  this._erasNarrowRegex = new RegExp('^(' + narrowPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
  return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
  return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken(token, getter) {
  addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg', 'weekYear');
addWeekYearFormatToken('ggggg', 'weekYear');
addWeekYearFormatToken('GGGG', 'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);

// PARSING

addRegexToken('G', matchSigned);
addRegexToken('g', matchSigned);
addRegexToken('GG', match1to2, match2);
addRegexToken('gg', match1to2, match2);
addRegexToken('GGGG', match1to4, match4);
addRegexToken('gggg', match1to4, match4);
addRegexToken('GGGGG', match1to6, match6);
addRegexToken('ggggg', match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
  week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
  week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear(input) {
  return getSetWeekYearHelper.call(
    this,
    input,
    this.week(),
    this.weekday(),
    this.localeData()._week.dow,
    this.localeData()._week.doy,
  );
}

function getSetISOWeekYear(input) {
  return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear() {
  return weeksInYear(this.year(), 1, 4);
}

function getISOWeeksInISOWeekYear() {
  return weeksInYear(this.isoWeekYear(), 1, 4);
}

function getWeeksInYear() {
  var weekInfo = this.localeData()._week;
  return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getWeeksInWeekYear() {
  var weekInfo = this.localeData()._week;
  return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
  var weeksTarget;
  if (input == null) {
    return weekOfYear(this, dow, doy).year;
  } else {
    weeksTarget = weeksInYear(input, dow, doy);
    if (week > weeksTarget) {
      week = weeksTarget;
    }
    return setWeekAll.call(this, input, week, weekday, dow, doy);
  }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
  var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
    date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

  this.year(date.getUTCFullYear());
  this.month(date.getUTCMonth());
  this.date(date.getUTCDate());
  return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
  array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter(input) {
  return input == null
    ? Math.ceil((this.month() + 1) / 3)
    : this.month((input - 1) * 3 + (this.month() % 3));
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIORITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D', match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
  // TODO: Remove "ordinalParse" fallback in next major release.
  return isStrict
    ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
    : locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
  array[DATE] = toInt(input.match(match1to2)[0]);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD', match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
  config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear(input) {
  var dayOfYear =
    Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
  return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m', match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s', match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
  return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
  return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
  return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
  return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
  return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
  return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
  return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
  return this.millisecond() * 1000000;
});

// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S', match1to3, match1);
addRegexToken('SS', match1to3, match2);
addRegexToken('SSS', match1to3, match3);

var token, getSetMillisecond;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
  addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
  array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
  addParseToken(token, parseMs);
}

getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z', 0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr() {
  return this._isUTC ? 'UTC' : '';
}

function getZoneName() {
  return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add = add;
proto.calendar = calendar$1;
proto.clone = clone;
proto.diff = diff;
proto.endOf = endOf;
proto.format = format;
proto.from = from;
proto.fromNow = fromNow;
proto.to = to;
proto.toNow = toNow;
proto.get = stringGet;
proto.invalidAt = invalidAt;
proto.isAfter = isAfter;
proto.isBefore = isBefore;
proto.isBetween = isBetween;
proto.isSame = isSame;
proto.isSameOrAfter = isSameOrAfter;
proto.isSameOrBefore = isSameOrBefore;
proto.isValid = isValid$2;
proto.lang = lang;
proto.locale = locale;
proto.localeData = localeData;
proto.max = prototypeMax;
proto.min = prototypeMin;
proto.parsingFlags = parsingFlags;
proto.set = stringSet;
proto.startOf = startOf;
proto.subtract = subtract;
proto.toArray = toArray;
proto.toObject = toObject;
proto.toDate = toDate;
proto.toISOString = toISOString;
proto.inspect = inspect;
if (typeof Symbol !== 'undefined' && Symbol.for != null) {
  proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
    return 'Moment<' + this.format() + '>';
  };
}
proto.toJSON = toJSON;
proto.toString = toString;
proto.unix = unix;
proto.valueOf = valueOf;
proto.creationData = creationData;
proto.eraName = getEraName;
proto.eraNarrow = getEraNarrow;
proto.eraAbbr = getEraAbbr;
proto.eraYear = getEraYear;
proto.year = getSetYear;
proto.isLeapYear = getIsLeapYear;
proto.weekYear = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;
proto.quarter = proto.quarters = getSetQuarter;
proto.month = getSetMonth;
proto.daysInMonth = getDaysInMonth;
proto.week = proto.weeks = getSetWeek;
proto.isoWeek = proto.isoWeeks = getSetISOWeek;
proto.weeksInYear = getWeeksInYear;
proto.weeksInWeekYear = getWeeksInWeekYear;
proto.isoWeeksInYear = getISOWeeksInYear;
proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
proto.date = getSetDayOfMonth;
proto.day = proto.days = getSetDayOfWeek;
proto.weekday = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear = getSetDayOfYear;
proto.hour = proto.hours = getSetHour;
proto.minute = proto.minutes = getSetMinute;
proto.second = proto.seconds = getSetSecond;
proto.millisecond = proto.milliseconds = getSetMillisecond;
proto.utcOffset = getSetOffset;
proto.utc = setOffsetToUTC;
proto.local = setOffsetToLocal;
proto.parseZone = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST = isDaylightSavingTime;
proto.isLocal = isLocal;
proto.isUtcOffset = isUtcOffset;
proto.isUtc = isUtc;
proto.isUTC = isUtc;
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;
proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone = deprecate(
  'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
  getSetZone,
);
proto.isDSTShifted = deprecate(
  'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
  isDaylightSavingTimeShifted,
);

function createUnix(input) {
  return createLocal(input * 1000);
}

function createInZone() {
  return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat(string) {
  return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar = calendar;
proto$1.longDateFormat = longDateFormat;
proto$1.invalidDate = invalidDate;
proto$1.ordinal = ordinal;
proto$1.preparse = preParsePostFormat;
proto$1.postformat = preParsePostFormat;
proto$1.relativeTime = relativeTime;
proto$1.pastFuture = pastFuture;
proto$1.set = set;
proto$1.eras = localeEras;
proto$1.erasParse = localeErasParse;
proto$1.erasConvertYear = localeErasConvertYear;
proto$1.erasAbbrRegex = erasAbbrRegex;
proto$1.erasNameRegex = erasNameRegex;
proto$1.erasNarrowRegex = erasNarrowRegex;

proto$1.months = localeMonths;
proto$1.monthsShort = localeMonthsShort;
proto$1.monthsParse = localeMonthsParse;
proto$1.monthsRegex = monthsRegex;
proto$1.monthsShortRegex = monthsShortRegex;
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

proto$1.weekdays = localeWeekdays;
proto$1.weekdaysMin = localeWeekdaysMin;
proto$1.weekdaysShort = localeWeekdaysShort;
proto$1.weekdaysParse = localeWeekdaysParse;

proto$1.weekdaysRegex = weekdaysRegex;
proto$1.weekdaysShortRegex = weekdaysShortRegex;
proto$1.weekdaysMinRegex = weekdaysMinRegex;

proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1(format, index, field, setter) {
  var locale = getLocale(),
    utc = createUTC().set(setter, index);
  return locale[field](utc, format);
}

function listMonthsImpl(format, index, field) {
  if (isNumber(format)) {
    index = format;
    format = undefined;
  }

  format = format || '';

  if (index != null) {
    return get$1(format, index, field, 'month');
  }

  var i,
    out = [];
  for (i = 0; i < 12; i++) {
    out[i] = get$1(format, i, field, 'month');
  }
  return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl(localeSorted, format, index, field) {
  if (typeof localeSorted === 'boolean') {
    if (isNumber(format)) {
      index = format;
      format = undefined;
    }

    format = format || '';
  } else {
    format = localeSorted;
    index = format;
    localeSorted = false;

    if (isNumber(format)) {
      index = format;
      format = undefined;
    }

    format = format || '';
  }

  var locale = getLocale(),
    shift = localeSorted ? locale._week.dow : 0,
    i,
    out = [];

  if (index != null) {
    return get$1(format, (index + shift) % 7, field, 'day');
  }

  for (i = 0; i < 7; i++) {
    out[i] = get$1(format, (i + shift) % 7, field, 'day');
  }
  return out;
}

function listMonths(format, index) {
  return listMonthsImpl(format, index, 'months');
}

function listMonthsShort(format, index) {
  return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays(localeSorted, format, index) {
  return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort(localeSorted, format, index) {
  return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin(localeSorted, format, index) {
  return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
  eras: [
    {
      since: '0001-01-01',
      until: +Infinity,
      offset: 1,
      name: 'Anno Domini',
      narrow: 'AD',
      abbr: 'AD',
    },
    {
      since: '0000-12-31',
      until: -Infinity,
      offset: 1,
      name: 'Before Christ',
      narrow: 'BC',
      abbr: 'BC',
    },
  ],
  dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
  ordinal: function (number) {
    var b = number % 10,
      output =
        toInt((number % 100) / 10) === 1
          ? 'th'
          : b === 1
          ? 'st'
          : b === 2
          ? 'nd'
          : b === 3
          ? 'rd'
          : 'th';
    return number + output;
  },
});

// Side effect imports

hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate(
  'moment.langData is deprecated. Use moment.localeData instead.',
  getLocale,
);

var mathAbs = Math.abs;

function abs() {
  var data = this._data;

  this._milliseconds = mathAbs(this._milliseconds);
  this._days = mathAbs(this._days);
  this._months = mathAbs(this._months);

  data.milliseconds = mathAbs(data.milliseconds);
  data.seconds = mathAbs(data.seconds);
  data.minutes = mathAbs(data.minutes);
  data.hours = mathAbs(data.hours);
  data.months = mathAbs(data.months);
  data.years = mathAbs(data.years);

  return this;
}

function addSubtract$1(duration, input, value, direction) {
  var other = createDuration(input, value);

  duration._milliseconds += direction * other._milliseconds;
  duration._days += direction * other._days;
  duration._months += direction * other._months;

  return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1(input, value) {
  return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1(input, value) {
  return addSubtract$1(this, input, value, -1);
}

function absCeil(number) {
  if (number < 0) {
    return Math.floor(number);
  } else {
    return Math.ceil(number);
  }
}

function bubble() {
  var milliseconds = this._milliseconds,
    days = this._days,
    months = this._months,
    data = this._data,
    seconds,
    minutes,
    hours,
    years,
    monthsFromDays;

  // if we have a mix of positive and negative values, bubble down first
  // check: https://github.com/moment/moment/issues/2166
  if (
    !(
      (milliseconds >= 0 && days >= 0 && months >= 0) ||
      (milliseconds <= 0 && days <= 0 && months <= 0)
    )
  ) {
    milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
    days = 0;
    months = 0;
  }

  // The following code bubbles up values, see the tests for
  // examples of what that means.
  data.milliseconds = milliseconds % 1000;

  seconds = absFloor(milliseconds / 1000);
  data.seconds = seconds % 60;

  minutes = absFloor(seconds / 60);
  data.minutes = minutes % 60;

  hours = absFloor(minutes / 60);
  data.hours = hours % 24;

  days += absFloor(hours / 24);

  // convert days to months
  monthsFromDays = absFloor(daysToMonths(days));
  months += monthsFromDays;
  days -= absCeil(monthsToDays(monthsFromDays));

  // 12 months -> 1 year
  years = absFloor(months / 12);
  months %= 12;

  data.days = days;
  data.months = months;
  data.years = years;

  return this;
}

function daysToMonths(days) {
  // 400 years have 146097 days (taking into account leap year rules)
  // 400 years have 12 months === 4800
  return (days * 4800) / 146097;
}

function monthsToDays(months) {
  // the reverse of daysToMonths
  return (months * 146097) / 4800;
}

function as(units) {
  if (!this.isValid()) {
    return NaN;
  }
  var days,
    months,
    milliseconds = this._milliseconds;

  units = normalizeUnits(units);

  if (units === 'month' || units === 'quarter' || units === 'year') {
    days = this._days + milliseconds / 864e5;
    months = this._months + daysToMonths(days);
    switch (units) {
      case 'month':
        return months;
      case 'quarter':
        return months / 3;
      case 'year':
        return months / 12;
    }
  } else {
    // handle milliseconds separately because of floating point math errors (issue #1867)
    days = this._days + Math.round(monthsToDays(this._months));
    switch (units) {
      case 'week':
        return days / 7 + milliseconds / 6048e5;
      case 'day':
        return days + milliseconds / 864e5;
      case 'hour':
        return days * 24 + milliseconds / 36e5;
      case 'minute':
        return days * 1440 + milliseconds / 6e4;
      case 'second':
        return days * 86400 + milliseconds / 1000;
      // Math.floor prevents floating point math errors here
      case 'millisecond':
        return Math.floor(days * 864e5) + milliseconds;
      default:
        throw new Error('Unknown unit ' + units);
    }
  }
}

// TODO: Use this.as('ms')?
function valueOf$1() {
  if (!this.isValid()) {
    return NaN;
  }
  return (
    this._milliseconds +
    this._days * 864e5 +
    (this._months % 12) * 2592e6 +
    toInt(this._months / 12) * 31536e6
  );
}

function makeAs(alias) {
  return function () {
    return this.as(alias);
  };
}

var asMilliseconds = makeAs('ms'),
  asSeconds = makeAs('s'),
  asMinutes = makeAs('m'),
  asHours = makeAs('h'),
  asDays = makeAs('d'),
  asWeeks = makeAs('w'),
  asMonths = makeAs('M'),
  asQuarters = makeAs('Q'),
  asYears = makeAs('y');

function clone$1() {
  return createDuration(this);
}

function get$2(units) {
  units = normalizeUnits(units);
  return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
  return function () {
    return this.isValid() ? this._data[name] : NaN;
  };
}

var milliseconds = makeGetter('milliseconds'),
  seconds = makeGetter('seconds'),
  minutes = makeGetter('minutes'),
  hours = makeGetter('hours'),
  days = makeGetter('days'),
  months = makeGetter('months'),
  years = makeGetter('years');

function weeks() {
  return absFloor(this.days() / 7);
}

var round = Math.round,
  thresholds = {
    ss: 44, // a few seconds to seconds
    s: 45, // seconds to minute
    m: 45, // minutes to hour
    h: 22, // hours to day
    d: 26, // days to month/week
    w: null, // weeks to month
    M: 11, // months to year
  };

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
  return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
  var duration = createDuration(posNegDuration).abs(),
    seconds = round(duration.as('s')),
    minutes = round(duration.as('m')),
    hours = round(duration.as('h')),
    days = round(duration.as('d')),
    months = round(duration.as('M')),
    weeks = round(duration.as('w')),
    years = round(duration.as('y')),
    a =
      (seconds <= thresholds.ss && ['s', seconds]) ||
      (seconds < thresholds.s && ['ss', seconds]) ||
      (minutes <= 1 && ['m']) ||
      (minutes < thresholds.m && ['mm', minutes]) ||
      (hours <= 1 && ['h']) ||
      (hours < thresholds.h && ['hh', hours]) ||
      (days <= 1 && ['d']) ||
      (days < thresholds.d && ['dd', days]);

  if (thresholds.w != null) {
    a = a || (weeks <= 1 && ['w']) || (weeks < thresholds.w && ['ww', weeks]);
  }
  a = a ||
    (months <= 1 && ['M']) ||
    (months < thresholds.M && ['MM', months]) ||
    (years <= 1 && ['y']) || ['yy', years];

  a[2] = withoutSuffix;
  a[3] = +posNegDuration > 0;
  a[4] = locale;
  return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding(roundingFunction) {
  if (roundingFunction === undefined) {
    return round;
  }
  if (typeof roundingFunction === 'function') {
    round = roundingFunction;
    return true;
  }
  return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold(threshold, limit) {
  if (thresholds[threshold] === undefined) {
    return false;
  }
  if (limit === undefined) {
    return thresholds[threshold];
  }
  thresholds[threshold] = limit;
  if (threshold === 's') {
    thresholds.ss = limit - 1;
  }
  return true;
}

function humanize(argWithSuffix, argThresholds) {
  if (!this.isValid()) {
    return this.localeData().invalidDate();
  }

  var withSuffix = false,
    th = thresholds,
    locale,
    output;

  if (typeof argWithSuffix === 'object') {
    argThresholds = argWithSuffix;
    argWithSuffix = false;
  }
  if (typeof argWithSuffix === 'boolean') {
    withSuffix = argWithSuffix;
  }
  if (typeof argThresholds === 'object') {
    th = Object.assign({}, thresholds, argThresholds);
    if (argThresholds.s != null && argThresholds.ss == null) {
      th.ss = argThresholds.s - 1;
    }
  }

  locale = this.localeData();
  output = relativeTime$1(this, !withSuffix, th, locale);

  if (withSuffix) {
    output = locale.pastFuture(+this, output);
  }

  return locale.postformat(output);
}

var abs$1 = Math.abs;

function sign(x) {
  return (x > 0) - (x < 0) || +x;
}

function toISOString$1() {
  // for ISO strings we do not use the normal bubbling rules:
  //  * milliseconds bubble up until they become hours
  //  * days do not bubble at all
  //  * months bubble up until they become years
  // This is because there is no context-free conversion between hours and days
  // (think of clock changes)
  // and also not between days and months (28-31 days per month)
  if (!this.isValid()) {
    return this.localeData().invalidDate();
  }

  var seconds = abs$1(this._milliseconds) / 1000,
    days = abs$1(this._days),
    months = abs$1(this._months),
    minutes,
    hours,
    years,
    s,
    total = this.asSeconds(),
    totalSign,
    ymSign,
    daysSign,
    hmsSign;

  if (!total) {
    // this is the same as C#'s (Noda) and python (isodate)...
    // but not other JS (goog.date)
    return 'P0D';
  }

  // 3600 seconds -> 60 minutes -> 1 hour
  minutes = absFloor(seconds / 60);
  hours = absFloor(minutes / 60);
  seconds %= 60;
  minutes %= 60;

  // 12 months -> 1 year
  years = absFloor(months / 12);
  months %= 12;

  // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
  s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

  totalSign = total < 0 ? '-' : '';
  ymSign = sign(this._months) !== sign(total) ? '-' : '';
  daysSign = sign(this._days) !== sign(total) ? '-' : '';
  hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

  return (
    totalSign +
    'P' +
    (years ? ymSign + years + 'Y' : '') +
    (months ? ymSign + months + 'M' : '') +
    (days ? daysSign + days + 'D' : '') +
    (hours || minutes || seconds ? 'T' : '') +
    (hours ? hmsSign + hours + 'H' : '') +
    (minutes ? hmsSign + minutes + 'M' : '') +
    (seconds ? hmsSign + s + 'S' : '')
  );
}

var proto$2 = Duration.prototype;

proto$2.isValid = isValid$1;
proto$2.abs = abs;
proto$2.add = add$1;
proto$2.subtract = subtract$1;
proto$2.as = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds = asSeconds;
proto$2.asMinutes = asMinutes;
proto$2.asHours = asHours;
proto$2.asDays = asDays;
proto$2.asWeeks = asWeeks;
proto$2.asMonths = asMonths;
proto$2.asQuarters = asQuarters;
proto$2.asYears = asYears;
proto$2.valueOf = valueOf$1;
proto$2._bubble = bubble;
proto$2.clone = clone$1;
proto$2.get = get$2;
proto$2.milliseconds = milliseconds;
proto$2.seconds = seconds;
proto$2.minutes = minutes;
proto$2.hours = hours;
proto$2.days = days;
proto$2.weeks = weeks;
proto$2.months = months;
proto$2.years = years;
proto$2.humanize = humanize;
proto$2.toISOString = toISOString$1;
proto$2.toString = toISOString$1;
proto$2.toJSON = toISOString$1;
proto$2.locale = locale;
proto$2.localeData = localeData;

proto$2.toIsoString = deprecate(
  'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
  toISOString$1,
);
proto$2.lang = lang;

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
  config._d = new Date(parseFloat(input) * 1000);
});
addParseToken('x', function (input, array, config) {
  config._d = new Date(toInt(input));
});

//! moment.js

hooks.version = '2.26.0';

setHookCallback(createLocal);

hooks.fn = proto;
hooks.min = min;
hooks.max = max;
hooks.now = now;
hooks.utc = createUTC;
hooks.unix = createUnix;
hooks.months = listMonths;
hooks.isDate = isDate;
hooks.locale = getSetGlobalLocale;
hooks.invalid = createInvalid;
hooks.duration = createDuration;
hooks.isMoment = isMoment;
hooks.weekdays = listWeekdays;
hooks.parseZone = createInZone;
hooks.localeData = getLocale;
hooks.isDuration = isDuration;
hooks.monthsShort = listMonthsShort;
hooks.weekdaysMin = listWeekdaysMin;
hooks.defineLocale = defineLocale;
hooks.updateLocale = updateLocale;
hooks.locales = listLocales;
hooks.weekdaysShort = listWeekdaysShort;
hooks.normalizeUnits = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat = getCalendarFormat;
hooks.prototype = proto;

// currently HTML5 input type only supports 24-hour formats
hooks.HTML5_FMT = {
  DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
  DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
  DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
  DATE: 'YYYY-MM-DD', // <input type="date" />
  TIME: 'HH:mm', // <input type="time" />
  TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
  TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
  WEEK: 'GGGG-[W]WW', // <input type="week" />
  MONTH: 'YYYY-MM', // <input type="month" />
};

function fancyTimeFormat(time) {
  // # app.extFunc.js
  // Hours, minutes and seconds
  let hrs = ~~(time / 3600);
  let mins = ~~((time % 3600) / 60);
  let secs = ~~time % 60;
  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';
  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }
  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
}
function formatDate(date) {
  // # app.extFunc.js
  var d = new Date(date),
    month = '' + (d.getMonth() + 1).toString(),
    day = '' + d.getDate().toString(),
    year = d.getFullYear().toString();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day];
}
function format_date(dt, fmt) {
  // # app.extFunc.js
  return hooks(dt).format(fmt);
}
function getDateText(date) {
  // # app.pubFunc.js
  var d = new Date(date);
  var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let hour = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
  let min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
  var result = {
    day: d.getDate(),
    month: translate(mS[d.getMonth()], 'upper'),
    year: d.getFullYear(),
    hour: hour,
    min: min,
  };
  return result;
}
function getDateDay(date) {
  var d = new Date(date);
  var dayArr = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return dayArr[d.getDay()];
}
function getMonth(num) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[parseInt(num) - 1];
}
function msToTime(ms) {
  // # app.pubFunc.js
  let days = Math.floor(ms / (24 * 60 * 60 * 1000));
  let daysms = ms % (24 * 60 * 60 * 1000);
  let hours = Math.floor(daysms / (60 * 60 * 1000));
  let hoursms = ms % (60 * 60 * 1000);
  let minutes = Math.floor(hoursms / (60 * 1000));
  let minutesms = ms % (60 * 1000);
  let sec = Math.floor(minutesms / 1000);
  days = days < 10 ? '0' + days : days;
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  sec = sec < 10 ? '0' + sec : sec;
  return [days.toString(), hours.toString(), minutes.toString(), sec.toString()];
}
function secToTime(sec, format) {
  var seconds = sec % 60,
    minutes = (sec / 60) % 60,
    hours = (sec / (60 * 60)) % 24;
  hours = hours < 10 ? '0' + hours : hours;
  if (format == '0:00');
  else {
    minutes = minutes < 10 ? '0' + minutes : minutes;
  }
  seconds = seconds < 10 ? '0' + seconds : seconds;
  if (format == '0:00') {
    return minutes + ':' + seconds;
  } else if (format == '00:00') {
    return minutes + ':' + seconds;
  } else if (format == 'hh:mm') {
    return hours + ':' + minutes;
  }
  return hours + ':' + minutes + ':' + seconds;
}
function setDateByLang(num, currLang = cfg.lang) {
  // # app.extFunc.js
  // # setDateByLang ==> let currLang = getDefaultLanguage();
  if (currLang == 'cn' || currLang == 'tw') {
    return parseInt(num, 10) + cfg.string_date_zh_day;
  } else {
    return num.toString();
  }
}
function setYearByLang(num, currLang = cfg.lang) {
  // # app.extFunc.js
  // # setYearByLang ==> let currLang = getDefaultLanguage();
  if (currLang == 'cn' || currLang == 'tw') {
    return num + cfg.string_date_zh_year;
  } else {
    return num.toString();
  }
}
function toHHMMSS(value) {
  // # app.extFunc.js
  var sec_num = parseInt(value, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
}
function toMMSS(value) {
  // # app.extFunc.js
  var sec_num = parseInt(value, 10); // don't forget the second param
  var minutes = Math.floor((sec_num - 0) / 60);
  var seconds = sec_num - 0 - minutes * 60;
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return minutes + ':' + seconds;
}
var date = {
  fancyTimeFormat: fancyTimeFormat,
  formatDate: formatDate,
  format_date: format_date,
  getDateText: getDateText,
  getDateDay: getDateDay,
  getMonth: getMonth,
  msToTime: msToTime,
  secToTime: secToTime,
  setDateByLang: setDateByLang,
  setYearByLang: setYearByLang,
  toMMSS: toMMSS,
  toHHMMSS: toHHMMSS,
};

const domino = {
  0: { alias: 't0b0', top: 0, bottom: 0, id: 0 },
  1: { alias: 't0b1', top: 0, bottom: 1, id: 1 },
  2: { alias: 't1b1', top: 1, bottom: 1, id: 2 },
  3: { alias: 't0b2', top: 0, bottom: 2, id: 3 },
  4: { alias: 't1b2', top: 1, bottom: 2, id: 4 },
  5: { alias: 't2b2', top: 2, bottom: 2, id: 5 },
  6: { alias: 't0b3', top: 0, bottom: 3, id: 6 },
  7: { alias: 't1b3', top: 1, bottom: 3, id: 7 },
  8: { alias: 't2b3', top: 2, bottom: 3, id: 8 },
  9: { alias: 't3b3', top: 3, bottom: 3, id: 9 },
  10: { alias: 't0b4', top: 0, bottom: 4, id: 10 },
  11: { alias: 't1b4', top: 1, bottom: 4, id: 11 },
  12: { alias: 't2b4', top: 2, bottom: 4, id: 12 },
  13: { alias: 't3b4', top: 3, bottom: 4, id: 13 },
  14: { alias: 't4b4', top: 4, bottom: 4, id: 14 },
  15: { alias: 't0b5', top: 0, bottom: 5, id: 15 },
  16: { alias: 't1b5', top: 1, bottom: 5, id: 16 },
  17: { alias: 't2b5', top: 2, bottom: 5, id: 17 },
  18: { alias: 't3b5', top: 3, bottom: 5, id: 18 },
  19: { alias: 't4b5', top: 4, bottom: 5, id: 19 },
  20: { alias: 't5b5', top: 5, bottom: 5, id: 20 },
  21: { alias: 't0b6', top: 0, bottom: 6, id: 21 },
  22: { alias: 't1b6', top: 1, bottom: 6, id: 22 },
  23: { alias: 't2b6', top: 2, bottom: 6, id: 23 },
  24: { alias: 't3b6', top: 3, bottom: 6, id: 24 },
  25: { alias: 't4b6', top: 4, bottom: 6, id: 25 },
  26: { alias: 't5b6', top: 5, bottom: 6, id: 26 },
  27: { alias: 't6b6', top: 6, bottom: 6, id: 27 },
};

const gameInfo = {
  1: {
    0: {
      ename: 'holdem',
      name: "hold'em",
      nameCap: translate("hold'em", 'capitalize'),
      nameUpp: translate("hold'em", 'upper'),
      gameLabel: translate('nlh', 'upper'),
      lmsKey: 'LB_02298',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'no limit',
      cardType: 'card',
      cat: 'poker',
      mode: {},
    },
    1: {
      name: "aof hold'em",
      nameCap: translate("AOF Hold'em"),
      nameUpp: translate("AOF Hold'em", 'upper'),
      gameLabel: translate('aof nlh', 'upper'),
      lmsKey: 'LB_01599',
      lmsNameStyle: '',
      lmsGameLabelStyle: 'upper',
      limit: 'no limit',
      cardType: 'card',
      cat: 'poker',
      mode: {},
    },
  },
  2: {
    0: {
      ename: 'masuk',
      name: 'masuk',
      nameCap: translate('masuk', 'capitalize'),
      nameUpp: translate('masuk', 'upper'),
      gameLabel: translate('masuk', 'upper'),
      lmsKey: 'LB_02416',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'table limit',
      cardType: 'card',
      cat: 'table',
      mode: {
        1: translate('classic mode', 'capitalize'),
        2: translate('multiplier mode', 'capitalize'),
        3: translate('extreme mode', 'capitalize'),
      },
    },
  },
  3: {
    0: {
      ename: 'omaha',
      name: 'omaha',
      nameCap: translate('omaha', 'capitalize'),
      nameUpp: translate('omaha', 'upper'),
      gameLabel: translate('plo', 'upper'),
      lmsKey: 'LB_02505',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'pot limit',
      cardType: 'card',
      cat: 'poker',
      mode: {},
    },
  },
  4: {
    0: {
      ename: 'ggniu',
      name: 'ggniu',
      nameCap: translate('ggniu', 'capitalize'),
      nameUpp: translate('ggniu', 'upper'),
      gameLabel: translate('ggniu', 'upper'),
      lmsKey: 'LB_02268',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'banker limit',
      cardType: 'scratchcard',
      cat: 'table',
      mode: {
        1: translate('2-Suicide Mode'),
        2: translate('3-Suicide Mode'),
        3: translate('6-Tie Mode'),
        4: translate('7-Tie Mode'),
        5: translate('8-Tie Mode'),
        6: translate('No Combo Mode 1'),
        7: translate('No Combo Mode 2'),
      },
      modeDetails: {
        1: translate(
          '2-Suicide Mode: Players suicide with 1-2pts, tie lose with 3pts, normal fight with 4pts up. Combo On.',
        ),
        2: translate(
          '3-Suicide Mode: Players suicide with 1-3pts, normal fight with 4pts up. Combo On.',
        ),
        3: translate(
          '6-Tie Mode: Players tie lose with 1-6pts, normal fight with 7pts up. Combo On.',
        ),
        4: translate(
          '7-Tie Mode: Players tie lose with 1-7pts, normal fight with 8pts up. Combo On.',
        ),
        5: translate(
          '8-Tie Mode: Players tie lose with 1-8pts, normal fight with 9pts up. Combo On.',
        ),
        6: translate(
          'No Combo Mode 1: Players suicide with 1-2pts, normal fight with 3-10pts. Combo Off.',
        ),
        7: translate(
          'No Combo Mode 2: Players tie lose with 1-4pts, normal fight with 5-10pts. Combo Off.',
        ),
      },
    },
  },
  5: {
    0: {
      ename: 's8Cards',
      name: '8 cards',
      nameCap: translate('8 cards', 'capitalize'),
      nameUpp: translate('8 cards', 'upper'),
      gameLabel: translate('8 cards', 'upper'),
      lmsKey: 'LB_01581',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'table limit',
      cardType: 'card',
      cat: 'table',
      mode: {
        1: translate('classic mode', 'capitalize') + ' (' + translate('Mid-tier') + ' 2x)',
        2: translate('classic mode', 'capitalize') + ' (' + translate('Mid-tier') + ' 3x)',
        3: translate('multiplier mode', 'capitalize') + ' (' + translate('Mid-tier') + ' 2x)',
        4: translate('multiplier mode', 'capitalize') + ' (' + translate('Mid-tier') + ' 3x)',
        5: translate('extreme mode', 'capitalize') + ' (' + translate('Mid-tier') + ' 2x)',
        6: translate('extreme mode', 'capitalize') + ' (' + translate('Mid-tier') + ' 3x)',
      },
      joker: {
        1: translate('Natural On'),
        2: translate('Natural Off'),
      },
      claim: {
        0: translate('Claim Off'),
        1: translate('Claim On'),
      },
    },
  },
  6: {
    0: {
      ename: 'holdem6Plus',
      name: "6+ hold'em",
      nameCap: translate("6+ hold'em", 'capitalize'),
      nameUpp: translate("6+ hold'em", 'upper'),
      gameLabel: translate("6+ hold'em", 'upper'),
      lmsKey: 'LB_01567',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'no limit',
      cardType: 'card',
      cat: 'poker',
      mode: {},
    },
    1: {
      name: "aof 6+ hold'em",
      nameCap: translate("AOF 6+ Hold'em"),
      nameUpp: translate("AOF 6+ Hold'em", 'upper'),
      gameLabel: translate('aof 6+', 'upper'),
      lmsKey: 'LB_01598',
      lmsNameStyle: '',
      lmsGameLabelStyle: 'upper',
      limit: 'no limit',
      cardType: 'card',
      cat: 'poker',
      mode: {},
    },
  },
  7: {
    0: {
      ename: 'hk8Cards',
      name: '8 cards hk',
      nameCap: translate('8 Cards HK'),
      nameUpp: translate('8 Cards HK', 'upper'),
      gameLabel: translate('8 Cards HK', 'upper'),
      lmsKey: 'LB_01582',
      lmsNameStyle: '',
      lmsGameLabelStyle: 'upper',
      limit: 'table limit',
      cardType: 'card',
      cat: 'table',
      mode: {
        1: translate('classic mode', 'capitalize'),
        2: translate('multiplier mode', 'capitalize'),
        3: translate('extreme mode', 'capitalize'),
      },
      joker: {
        1: translate('Natural On'),
        2: translate('Natural Off'),
      },
    },
  },
  8: {
    0: {
      ename: 'sikipi',
      name: '4 treasures',
      nameCap: translate('4 treasures', 'capitalize'),
      nameUpp: translate('4 treasures', 'upper'),
      gameLabel: translate('4 treasures', 'upper'),
      lmsKey: 'LB_01552',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'table limit',
      cardType: 'card',
      cat: 'table',
      mode: {
        1: translate('classic mode', 'capitalize'),
        2: translate('multiplier mode', 'capitalize'),
      },
      is82: {
        0: '',
        1: '82 mode',
      },
    },
  },
  9: {
    0: {
      ename: 'sakong',
      name: '3 pic switch',
      nameCap: translate('3 pic switch', 'capitalize'),
      nameUpp: translate('3 pic switch', 'upper'),
      gameLabel: translate('3 pic switch', 'upper'),
      lmsKey: 'LB_01541',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'table limit',
      cardType: 'card',
      cat: 'table',
      mode: {
        1: translate('classic mode', 'capitalize'),
      },
    },
  },
  10: {
    0: {
      ename: 'holdem5Plus',
      name: "5+ hold'em",
      nameCap: translate("5+ hold'em", 'capitalize'),
      nameUpp: translate("5+ hold'em", 'upper'),
      gameLabel: translate("5+ hold'em", 'upper'),
      lmsKey: 'LB_01556',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'no limit',
      cardType: 'card',
      cat: 'poker',
      mode: {},
    },
  },
  11: {
    0: {
      ename: 'capsa13',
      name: '13 cards',
      nameCap: translate('13 cards', 'capitalize'),
      nameUpp: translate('13 cards', 'upper'),
      gameLabel: translate('13 cards', 'upper'),
      lmsKey: 'LB_01531',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'table limit',
      cardType: 'card',
      cat: 'table',
      mode: {
        1: translate('multiplier mode', 'capitalize'),
        2: translate('multiplier mode', 'capitalize'),
        3: translate('multiplier mode', 'capitalize'),
        4: translate('multiplier mode', 'capitalize'),
        5: translate('multiplier mode', 'capitalize'),
        6: translate('multiplier mode', 'capitalize'),
      },
      joker: {
        1: translate('Natural On'),
        2: translate('Natural Off'),
      },
      claim: {
        0: translate('Claim Off'),
        1: translate('Claim On'),
      },
    },
  },
  12: {
    0: {
      ename: 'cemePot',
      name: 'ceme pot',
      nameCap: translate('ceme pot', 'capitalize'),
      nameUpp: translate('ceme pot', 'upper'),
      gameLabel: translate('ceme pot', 'upper'),
      lmsKey: 'LB_02116',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'pot limit',
      cardType: 'domino',
      cat: 'table',
      mode: {},
    },
  },
  13: {
    0: {
      ename: 'cemeTurn',
      name: 'ceme turn',
      nameCap: translate('ceme turn', 'capitalize'),
      nameUpp: translate('ceme turn', 'upper'),
      gameLabel: translate('ceme turn', 'upper'),
      lmsKey: 'LB_02117',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'banker limit',
      cardType: 'domino',
      cat: 'table',
      mode: {},
    },
  },
  14: {
    0: {
      ename: 'cemeFixed',
      name: 'ceme fixed',
      nameCap: translate('ceme fixed', 'capitalize'),
      nameUpp: translate('ceme fixed', 'upper'),
      gameLabel: translate('ceme fixed', 'upper'),
      lmsKey: 'LB_02115',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'banker limit',
      cardType: 'domino',
      cat: 'table',
      mode: {},
    },
  },
  15: {
    0: {
      ename: 'dominoQQ',
      name: 'domino qq',
      nameCap: translate('Domino QQ'),
      nameUpp: translate('Domino QQ', 'upper'),
      gameLabel: translate('Domino QQ', 'upper'),
      lmsKey: 'LB_01697', //domino QQ
      lmsNameStyle: 'ucfirst',
      lmsGameLabelStyle: 'upper',
      limit: 'banker limit',
      cardType: 'domino',
      cat: 'table',
      mode: {},
    },
  },
  16: {
    0: {
      ename: 'bankerPoker',
      name: 'banker poker',
      nameCap: translate('banker poker', 'capitalize'),
      nameUpp: translate('banker poker', 'upper'),
      gameLabel: translate('banker poker', 'upper'),
      lmsKey: 'LB_02078',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'banker limit',
      cardType: 'card',
      cat: 'table',
      mode: {},
    },
  },
  18: {
    0: {
      ename: 'banker6Plus',
      name: 'banker 6+',
      nameCap: translate('banker 6+', 'capitalize'),
      nameUpp: translate('banker 6+', 'upper'),
      gameLabel: translate('banker 6+', 'upper'),
      lmsKey: 'LB_02069',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'banker limit',
      cardType: 'card',
      cat: 'table',
      mode: {
        1: translate('multiplier mode', 'capitalize'),
      },
    },
  },
  19: {
    0: {
      ename: 'bankerSKP',
      name: 'banker skp',
      nameCap: translate('banker skp', 'capitalize'),
      nameUpp: translate('banker skp', 'upper'),
      gameLabel: translate('banker skp', 'upper'),
      lmsKey: 'LB_02079',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'banker limit',
      cardType: 'card',
      cat: 'table',
      mode: {
        1: translate('multiplier mode', 'capitalize'),
      },
      is82: {
        0: '',
        1: '82 mode',
      },
    },
  },
  20: {
    0: {
      ename: 'pokerPot',
      name: 'poker pot',
      nameCap: translate('LB_02919', 'capitalize'),
      nameUpp: translate('LB_02919', 'upper'),
      gameLabel: translate('LB_02919', 'upper'),
      lmsKey: 'LB_02919',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'pot limit',
      cardType: 'card',
      cat: 'table',
      mode: {},
    },
  },
  22: {
    0: {
      ename: 'GKP',
      name: '5kp',
      nameCap: translate('LB_03267', 'capitalize'),
      nameUpp: translate('LB_03267', 'upper'),
      gameLabel: translate('LB_03267', 'upper'),
      lmsKey: 'LB_03267',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'banker limit',
      cardType: 'card',
      cat: 'table',
      mode: {},
    },
  },
  23: {
    0: {
      ename: 'bankerGKP',
      name: 'banker 5kp',
      nameCap: translate('LB_03266', 'capitalize'),
      nameUpp: translate('LB_03266', 'upper'),
      gameLabel: translate('LB_03266', 'upper'),
      lmsKey: 'LB_03266',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'banker limit',
      cardType: 'card',
      cat: 'table',
      mode: {},
    },
  },
  31: {
    0: {
      ename: 'videoPoker',
      name: 'video poker',
      nameCap: translate('video poker', 'capitalize'),
      nameUpp: translate('video poker', 'upper'),
      gameLabel: translate('video poker', 'upper'),
      lmsKey: 'LB_02867',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'no limit',
      cardType: 'card',
      cat: 'rng',
      mode: {
        1: '6/5 mode',
      },
    },
  },
  32: {
    0: {
      ename: 'housie',
      name: 'housie',
      nameCap: translate('housie', 'capitalize'),
      nameUpp: translate('housie', 'upper'),
      gameLabel: translate('housie', 'upper'),
      lmsKey: 'housie',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: 'table limit',
      cardType: 'ticket',
      cat: 'rng',
      mode: {},
    },
  },
  33: {
    0: {
      ename: 'bigSmall',
      name: 'LB_03233', // big small
      nameCap: translate('LB_03233', 'capitalize'),
      nameUpp: translate('LB_03233', 'upper'),
      gameLabel: translate('LB_03233', 'upper'),
      limit: 'no limit',
      lmsKey: 'LB_03233',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      cat: 'minigame',
      mode: {},
    },
  },
  34: {
    0: {
      ename: 'oddEven',
      name: 'LB_03234', // odd even
      nameCap: translate('LB_03234', 'capitalize'),
      nameUpp: translate('LB_03234', 'upper'),
      gameLabel: translate('LB_03234', 'upper'),
      limit: 'no limit',
      lmsKey: 'LB_03234',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      cat: 'minigame',
      mode: {},
    },
  },
  35: {
    0: {
      ename: 'hiLo',
      name: 'LB_03235', // hi lo
      nameCap: translate('LB_03235', 'upper'),
      nameUpp: translate('LB_03235', 'upper'),
      gameLabel: translate('LB_03235', 'upper'),
      limit: 'no limit',
      lmsKey: 'LB_03235',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      cat: 'minigame',
      mode: {},
    },
  },
  36: {
    0: {
      ename: 'marble',
      name: 'marble',
      nameCap: translate('marble', 'capitalize'),
      nameUpp: translate('marble', 'upper'),
      gameLabel: translate('marble', 'upper'),
      limit: 'no limit',
      lmsKey: 'marble',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      cat: 'minigame',
      mode: {},
    },
  },
  37: {
    0: {
      ename: 'baccarat',
      name: 'baccarat',
      nameCap: translate('baccarat', 'capitalize'),
      nameUpp: translate('baccarat', 'upper'),
      gameLabel: translate('baccarat', 'upper'),
      limit: 'no limit',
      lmsKey: 'baccarat',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      cat: 'minigame',
      mode: {},
    },
  },
  91: {
    0: {
      ename: 'jackpot',
      name: 'jackpot',
      nameCap: translate('jackpot', 'capitalize'),
      nameUpp: translate('jackpot', 'upper'),
      gameLabel: translate('jackpot', 'upper'),
      lmsKey: 'LB_02357',
      lmsNameStyle: 'capitalize',
      lmsGameLabelStyle: 'upper',
      limit: '',
      cardType: '',
      cat: '',
      mode: {},
    },
  },
};

Object.values(gameInfo).forEach((cmpLms) => {
  Object.values(cmpLms).forEach((c) => {
    Object.defineProperty(c, 'showName', {
      get: function () {
        return translate(c.lmsKey, c.lmsNameStyle);
      },
    });
    Object.defineProperty(c, 'showLabel', {
      get: function () {
        return translate(c.lmsKey, c.lmsGameLabelStyle);
      },
    });
  });
});

const handRank = {
  superRoyalFlush: {
    text: 'super royal flush',
    key: 'superRoyalFlush',
    lmsKey: 'LB_02748',
  },
  royalFlush: {
    text: 'royal flush',
    key: 'royalFlush',
    lmsKey: 'LB_02663',
  },
  straightFlush: {
    text: 'straight flush',
    key: 'straightFlush',
    lmsKey: 'LB_02743',
  },
  fourOfAKind: {
    text: 'four of a kind',
    key: 'fourOfAKind',
    lmsKey: 'LB_02233',
  },
  flush: {
    text: 'flush',
    key: 'flush',
    lmsKey: 'LB_02230',
  },
  fullHouse: {
    text: 'full house',
    key: 'fullHouse',
    lmsKey: 'LB_02239',
  },
  straight: {
    text: 'straight',
    key: 'straight',
    lmsKey: 'LB_02742',
  },
  threeOfAKind: {
    text: 'three of a kind',
    key: 'threeOfAKind',
    lmsKey: 'LB_02779',
  },
  twoPair: {
    text: 'two pair',
    key: 'twoPair',
    lmsKey: 'LB_02845',
  },
  pair: {
    text: 'one pair',
    key: 'pair',
    lmsKey: 'LB_02523',
  },
  onePair: {
    text: 'one pair',
    key: 'onePair',
    lmsKey: 'LB_02516',
  },
  highCard: {
    text: 'high card',
    key: 'highCard',
    lmsKey: 'LB_02294',
  },
  Fold: {
    text: 'Fold',
    key: 'Fold',
    lmsKey: 'LB_01717',
  },
  doubleStraightFlush: {
    text: 'double straight flush',
    key: 'doubleStraightFlush',
    lmsKey: 'LB_02199',
  },
  tripAce: {
    text: 'trip ace',
    key: 'tripAce',
    lmsKey: '',
  },
  tripKing: {
    text: 'trip king',
    key: 'tripKing',
    lmsKey: 'LB_02830',
  },
  tripQueen: {
    text: 'trip queen',
    key: 'tripQueen',
    lmsKey: '	LB_02834',
  },
  tripJack: {
    text: 'trip jack',
    key: 'tripJack',
    lmsKey: 'LB_02831',
  },
  tripTen: {
    text: 'trip ten',
    key: 'tripTen',
    lmsKey: 'LB_02835',
  },
  tripPicture: {
    text: 'trip picture',
    key: 'tripPicture',
    lmsKey: 'LB_02833',
  },
  oneDragon: {
    text: 'one dragon',
    key: 'oneDragon',
    lmsKey: '	LB_02515',
  },
  sixDewa: {
    text: 'six dewa',
    key: 'sixDewa',
    lmsKey: 'LB_02710',
  },
  double: {
    text: 'double',
    key: 'double',
    lmsKey: 'LB_02197',
  },
  pureLarge: {
    text: 'pure large',
    key: 'pureLarge',
    lmsKey: 'LB_02595',
  },
  pureSmall: {
    text: 'pure small',
    key: 'pureSmall',
    lmsKey: 'LB_02596',
  },
};

const jackpotName = {
  superRoyalFlush: {
    text: 'super royal flush',
    key: 'superRoyalFlush',
    cap: 'capitalize',
    lmsKey: 'LB_02748',
  },
  royalFlush: {
    text: 'royal flush',
    key: 'royalFlush',
    cap: 'capitalize',
    lmsKey: 'LB_02663',
  },
  straightFlush: {
    text: 'straight flush',
    key: 'straightFlush',
    cap: 'capitalize',
    lmsKey: 'LB_02743',
  },
  fourOfAKind: {
    text: 'four of a kind',
    key: 'fourOfAKind',
    cap: 'capitalize',
    lmsKey: 'LB_02233',
  },
  flush: {
    text: 'flush',
    key: 'flush',
    cap: 'capitalize',
    lmsKey: 'LB_02230',
  },
  fullHouse: {
    text: 'full house',
    key: 'fullHouse',
    cap: 'capitalize',
    lmsKey: 'LB_02239',
  },
  pureLarge: {
    text: 'pure large',
    key: 'pureLarge',
    cap: 'capitalize',
    lmsKey: 'LB_02595',
  },
  double: {
    text: 'double',
    key: 'double',
    cap: 'capitalize',
    lmsKey: 'LB_02197',
  },
  pureSmall: {
    text: 'pure small',
    key: 'pureSmall',
    cap: 'capitalize',
    lmsKey: 'LB_02596',
  },
  sixDewa: {
    text: 'six dewa',
    key: 'sixDewa',
    cap: 'capitalize',
    lmsKey: 'LB_02710',
  },
};

var gameId = {};
for (var k in gameInfo) {
  gameId[gameInfo[k][0]['ename']] = parseInt(k);
}

var enumData = {
  domino,
  gameId,
  gameInfo,
  handRank,
  jackpotName,
};

var events = {};
var eventBus = {
  on(event, fn) {
    if (!events[event]) events[event] = [];
    var es = events[event];
    if (es.find((f) => f == fn)) return false;
    es.push(fn);
    return true;
  },
  off(event, fn) {
    if (!events[event]) return false;
    var es = events[event];
    for (var i = 0; i < es.length; i++) {
      if (es[i] == fn) {
        es.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  emit(event, ...args) {
    if (!events[event]) return false;
    var es = events[event];
    es.forEach((fn) => {
      fn(...args);
    });
    return true;
  },
  install(Vue) {
    Vue.prototype.$evbus = eventBus;
  },
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
    tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
  undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag$1 && symToStringTag$1 in Object(value)
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' || (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$1(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value)
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : reIsBadHex.test(value)
    ? NAN
    : +value;
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
  MAX_INTEGER = 1.7976931348623157e308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
    remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
    length = array == null ? 0 : array.length,
    result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
  symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$1(value) {
  return value == null ? '' : baseToString(value);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = root.isFinite,
  nativeMin = Math.min;

/**
 * Creates a function like `_.round`.
 *
 * @private
 * @param {string} methodName The name of the `Math` method to use when rounding.
 * @returns {Function} Returns the new round function.
 */
function createRound(methodName) {
  var func = Math[methodName];
  return function (number, precision) {
    number = toNumber(number);
    precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
    if (precision && nativeIsFinite(number)) {
      // Shift with exponential notation to avoid floating-point issues.
      // See [MDN](https://mdn.io/round#Examples) for more details.
      var pair = (toString$1(number) + 'e').split('e'),
        value = func(pair[0] + 'e' + (+pair[1] + precision));

      pair = (toString$1(value) + 'e').split('e');
      return +(pair[0] + 'e' + (+pair[1] - precision));
    }
    return func(number);
  };
}

/**
 * Computes `number` rounded up to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round up.
 * @param {number} [precision=0] The precision to round up to.
 * @returns {number} Returns the rounded up number.
 * @example
 *
 * _.ceil(4.006);
 * // => 5
 *
 * _.ceil(6.004, 2);
 * // => 6.01
 *
 * _.ceil(6040, -2);
 * // => 6100
 */
var ceil = createRound('ceil');

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
    length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function (object, iteratee, keysFunc) {
    var index = -1,
      iterable = Object(object),
      props = keysFunc(object),
      length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
    result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(
  (function () {
    return arguments;
  })(),
)
  ? baseIsArguments
  : function (value) {
      return (
        isObjectLike(value) &&
        hasOwnProperty$1.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee')
      );
    };

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return (
    !!length &&
    (type == 'number' || (type != 'symbol' && reIsUint.test(value))) &&
    value > -1 &&
    value % 1 == 0 &&
    value < length
  );
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
  arrayTag = '[object Array]',
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  funcTag = '[object Function]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  objectTag = '[object Object]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] =
  typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] =
  typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] =
  typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] =
  typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] =
    true;
typedArrayTags[argsTag$1] =
  typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] =
  typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] =
  typedArrayTags[dateTag] =
  typedArrayTags[errorTag] =
  typedArrayTags[funcTag] =
  typedArrayTags[mapTag] =
  typedArrayTags[numberTag] =
  typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] =
  typedArrayTags[setTag] =
  typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] =
    false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 =
  freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function () {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
})();

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value),
    isArg = !isArr && isArguments(value),
    isBuff = !isArr && !isArg && isBuffer(value),
    isType = !isArr && !isArg && !isBuff && isTypedArray(value),
    skipIndexes = isArr || isArg || isBuff || isType,
    result = skipIndexes ? baseTimes(value.length, String) : [],
    length = result.length;

  for (var key in value) {
    if (
      (inherited || hasOwnProperty$2.call(value, key)) &&
      !(
        skipIndexes &&
        // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == 'length' ||
          // Node.js 0.10 has enumerable non-index properties on buffers.
          (isBuff && (key == 'offset' || key == 'parent')) ||
          // PhantomJS 2 has enumerable non-index properties on typed arrays.
          (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
          // Skip index properties.
          isIndex(key, length))
      )
    ) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
    proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

  return value === proto;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
  funcTag$1 = '[object Function]',
  genTag = '[object GeneratorFunction]',
  proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  if (!isObject$1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction$1(value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys$1(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys$1);
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
      index = fromRight ? length : -1,
      iterable = Object(collection);

    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray$1(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

/**
 * Computes `number` rounded down to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round down.
 * @param {number} [precision=0] The precision to round down to.
 * @returns {number} Returns the rounded down number.
 * @example
 *
 * _.floor(4.006);
 * // => 4
 *
 * _.floor(0.046, 2);
 * // => 0.04
 *
 * _.floor(4060, -2);
 * // => 4000
 */
var floor = createRound('floor');

/**
 * Computes `number` rounded to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round.
 * @param {number} [precision=0] The precision to round to.
 * @returns {number} Returns the rounded number.
 * @example
 *
 * _.round(4.006);
 * // => 4
 *
 * _.round(4.006, 2);
 * // => 4.01
 *
 * _.round(4060, -2);
 * // => 4100
 */
var round$1 = createRound('round');

var _ = {
  ceil: ceil,
  each: forEach,
  floor: floor,
  round: round$1,
};

function abbrNum(number, decPlaces = cfg.decPlaces, currentLang = cfg.lang) {
  // # app.pubFunc.js
  // https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k
  // # currentLang ==> var oPreference = store.get('preference'); currentLang = oPreference.lang;
  let flagSpecialLang = /tw|cn/.test(currentLang);
  if (currentLang == 'en' || !flagSpecialLang) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);
    // Enumerate number abbreviations
    // var abbrev = [ "k", "m", "b", "t" ];
    var abbrev = [
      cfg.abbreviation_en_thousand,
      cfg.abbreviation_en_million,
      cfg.abbreviation_en_billion,
      cfg.abbreviation_en_trillion,
    ];
    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {
      // Convert array index to "1000", "1000000", etc
      var size = Math.pow(10, (i + 1) * 3);
      // If the number is bigger or equal do the abbreviation
      if (size <= number) {
        // Here, we multiply by decPlaces, round, and then divide by decPlaces.
        // This gives us nice rounding to a particular decimal place.
        number = Math.round((number * decPlaces) / size) / decPlaces;
        // Handle special case where we round up to the next abbreviation
        if (number == 1000 && i < abbrev.length - 1) {
          number = 1;
          i++;
        }
        // Add the letter for the abbreviation
        number += abbrev[i];
        // We are done... stop
        break;
      }
    }
  } else {
    if (currentLang == 'tw') {
      // var abbrev = [ "","百","千","萬","億" ];
      var abbrev = [
        '',
        cfg.abbreviation_tw_bai,
        cfg.abbreviation_tw_qian,
        cfg.abbreviation_tw_wan,
        cfg.abbreviation_tw_yi,
      ];
    } else {
      // var abbrev = [ "","百","千","万","亿" ];
      var abbrev = [
        '',
        cfg.abbreviation_cn_bai,
        cfg.abbreviation_cn_qian,
        cfg.abbreviation_cn_wan,
        cfg.abbreviation_cn_yi,
      ];
    }
    number = number.toString();
    var newNum;
    var useAbbr = 0;
    if (number.includes('.')) {
      number = number;
    } else {
      if (number.length == 4) {
        //1000
        newNum = number / 1000;
        useAbbr = 2;
      } else if (number.length > 4 && number.length < 9) {
        //10000 - 10000000
        newNum = number / 10000;
        useAbbr = 3;
      } else if (number.length > 8) {
        // > 100000000
        newNum = number / 100000000;
        useAbbr = 4;
      } else {
        newNum = number;
      }
      number = Math.round(parseFloat(newNum) * 100) / 100 + abbrev[useAbbr];
    }
  }
  return number.toString();
}
function checkNumCommas(x, thousandSeparator = cfg.thousandSeparator, replacement = ',') {
  // # app.extFunc.js
  // # thousandSeparator ==> app.thousandSeparator
  // # replacement ==> app.PubFunc.js numberWithCommas() ==> var replacement = "`"; if($app.appType != 1) replacement = ",";
  if (!thousandSeparator) return x;
  else return numberWithCommas(x, replacement);
}
function displayNumber(amount, decimal, displayDecimal) {
  let originalAmount = amount;
  decimal = decimal || cfg.decimal; // Default is 0
  if (typeof displayDecimal == 'undefined') displayDecimal = decimal;
  if (displayDecimal < decimal) decimal = displayDecimal;
  if (typeof amount == 'undefined') {
    return undefined;
  }
  if (typeof amount == 'string') amount = parseFloat(amount);
  if (isNaN(amount))
    throw Error('lib.num.displayNumber get a not number amount (' + originalAmount + ').');
  // let tenPower = Math.pow(10, decimal);
  // amount = Math.round(amount * 10000) / 10000;
  // amount = Math.floor(amount * tenPower) / tenPower;
  // amount = amount.toFixed(displayDecimal);
  // amount = (_.floor(_.round(amount, decimal + displayDecimal), decimal)).toFixed(displayDecimal)
  amount = roundDown(amount, decimal).toFixed(displayDecimal);
  return amount;
}
function displayCommasNumber(amount, decimal, displayDecimal, replacement = ',') {
  return numberWithCommas(displayNumber(amount, decimal, displayDecimal), replacement);
}
function getFullColorHex(r, g, b) {
  let red = rgbToHex(r);
  let green = rgbToHex(g);
  let blue = rgbToHex(b);
  //console.log("r "+r+" g "+green+" blue "+blue);
  return '0x' + red + green + blue;
}
function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}
// function myRound(value:any, precision:any, mode) {
//   // discuss at: http://phpjs.org/functions/round/
//   // original by: Philip Peterson
//   // revised by: Onno Marsman
//   // revised by: T.Wild
//   // revised by: Rafał Kukawski (http://blog.kukawski.pl/)
//   // input by: Greenseed
//   // input by: meo
//   // input by: William
//   // input by: Josep Sanz (http://www.ws3.es/)
//   // bugfixed by: Brett Zamir (http://brett-zamir.me)
//   // note: Great work. Ideas for improvement:
//   // note: - code more compliant with developer guidelines
//   // note: - for implementing PHP constant arguments look at
//   // note: the pathinfo() function, it offers the greatest
//   // note: flexibility & compatibility possible
//   // example 1: round(1241757, -3);
//   // returns 1: 1242000
//   // example 2: round(3.6);
//   // returns 2: 4
//   // example 3: round(2.835, 2);
//   // returns 3: 2.84
//   // example 4: round(1.1749999999999, 2);
//   // returns 4: 1.17
//   // example 5: round(58551.799999999996, 2);
//   // returns 5: 58551.8
//   var m, f, isHalf, sgn:any; // helper variables
//   precision |= 0; // making sure precision is integer
//   m = Math.pow(10, precision);
//   value = m * value;
//   sgn = (value > 0) | -(value < 0); // sign of the number
//   isHalf = value % 1 === 0.5 * sgn;
//   f = Math.floor(value);
//   if (isHalf) {
//     switch (mode) {
//       case 'PHP_ROUND_HALF_DOWN':
//         value = f + (sgn < 0); // rounds .5 toward zero
//         break;
//       case 'PHP_ROUND_HALF_EVEN':
//         value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
//         break;
//       case 'PHP_ROUND_HALF_ODD':
//         value = f + !(f % 2); // rounds .5 towards the next odd integer
//         break;
//       default:
//         value = f + (sgn > 0); // rounds .5 away from zero
//     }
//   }
//   return (isHalf ? value : Math.round(value)) / m;
// }
function numberWithCommas(x, replacement = ',') {
  // # app.pubFunc.js
  // # replacement ==> app.PubFunc.js numberWithCommas() ==> var replacement = "`"; if($app.appType != 1) replacement = ",";
  if (!x) return '0';
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, replacement);
  return parts.join('.');
}
function op(num1, act, num2) {
  var strNum1 = String(num1); //轉文字
  var strNum2 = String(num2);
  var aryNum1 = strNum1.split('.');
  var aryNum2 = strNum2.split('.');
  var floatLenNum1 = aryNum1[1] ? aryNum1[1].length : 0;
  var floatLenNum2 = aryNum2[1] ? aryNum2[1].length : 0;
  var floatLenBase = Math.max(floatLenNum1, floatLenNum2);
  var intNum1 = parseInt(strNum1.replace('.', ''));
  var intNum2 = parseInt(strNum2.replace('.', ''));
  if (isNaN(intNum1) || isNaN(intNum2))
    throw Error('lib.num.op float number error, num1=' + num1 + ' , num2=' + num2);
  var rt;
  if (floatLenNum1 > floatLenNum2) {
    intNum2 = intNum2 * Math.pow(10, floatLenNum1 - floatLenNum2);
  } else if (floatLenNum1 < floatLenNum2) {
    intNum1 = intNum1 * Math.pow(10, floatLenNum2 - floatLenNum1);
  }
  switch (act) {
    case '+':
      rt = (intNum1 + intNum2) / Math.pow(10, floatLenBase);
      break;
    case '-':
      rt = (intNum1 - intNum2) / Math.pow(10, floatLenBase);
      break;
    case '*':
      rt = (intNum1 * intNum2) / Math.pow(10, floatLenBase * 2);
      break;
    case '/':
      rt = intNum1 / intNum2;
      break;
    case '^':
    case 'pow':
      // num2 = parseInt(num2);
      rt = Math.pow(intNum1, num2) / Math.pow(10, floatLenNum1 * num2);
      break;
    default:
      throw Error('lib.num.op operator is wrong, only can use +-*/pow^ , act is ' + act);
  }
  return rt;
}
function ordinalSuffix(i, withNumber = false) {
  // # app.extFunc.js
  let numStr = withNumber ? i : '';
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return numStr + 'st';
  }
  if (j == 2 && k != 12) {
    return numStr + 'nd';
  }
  if (j == 3 && k != 13) {
    return numStr + 'rd';
  }
  return numStr + 'th';
}
function rand() {
  return Math.random();
}
function rgbToHex(rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = '0' + hex;
  }
  return hex;
}
function roundDown(num, decimal) {
  // # app.extFunc.js
  decimal = decimal || cfg.decimal;
  let roundDigit = 2 + decimal;
  if (roundDigit < 5) {
    roundDigit = 5;
  }
  return _.floor(_.round(num, roundDigit), decimal);
}
function roundDownBalance(amount, decimal, showSecondDecimal) {
  // # app.extFunc.js
  decimal = decimal || cfg.decimal;
  if (typeof amount == 'undefined') {
    return undefined;
  }
  if (typeof decimal == 'undefined' || decimal == 0) {
    return amount.toFixed(0);
  }
  if (showSecondDecimal) {
    return amount.toFixed(2);
  } else {
    return _.floor(_.round(amount, decimal + 2), decimal).toFixed(2);
  }
}
function roundDownFixed(num, decimal) {
  // # app.extFunc.js
  decimal = decimal || cfg.decimal;
  return roundDown(num, decimal).toFixed(decimal);
}
function roundUp(num, decimal) {
  // # app.extFunc.js
  decimal = decimal || cfg.decimal;
  let roundDigit = 2 + decimal;
  if (roundDigit < 5) {
    roundDigit = 5;
  }
  return _.ceil(_.round(num, roundDigit), decimal);
}
function roundUpBalance(amount, decimal, showSecondDecimal) {
  // # app.extFunc.js
  decimal = decimal || cfg.decimal;
  if (typeof amount == 'undefined') {
    return undefined;
  }
  if (typeof decimal == 'undefined' || decimal == 0) {
    return amount.toFixed(0);
  }
  if (showSecondDecimal) {
    return amount.toFixed(2);
  } else {
    return _.ceil(_.round(amount, decimal + 2), decimal).toFixed(2);
  }
}
function roundUpFixed(num, decimal) {
  // # app.extFunc.js
  decimal = decimal || cfg.decimal;
  return roundUp(num, decimal).toFixed(decimal);
}
function sum() {
  // # app.extFunc.js
  var tot = 0;
  _.each(arguments, function (a) {
    tot += parseInt(a);
  });
  return tot;
}
var num = {
  abbrNum: abbrNum,
  checkNumCommas: checkNumCommas,
  displayNumber: displayNumber,
  displayCommasNumber: displayCommasNumber,
  getFullColorHex: getFullColorHex,
  lerp: lerp,
  // myRound: myRound,
  numberWithCommas: numberWithCommas,
  op: op,
  ordinalSuffix: ordinalSuffix,
  rand: rand,
  rgbToHex: rgbToHex,
  roundDown: roundDown,
  roundDownBalance: roundDownBalance,
  roundDownFixed: roundDownFixed,
  roundUp: roundUp,
  roundUpBalance: roundUpBalance,
  roundUpFixed: roundUpFixed,
  sum: sum,
};

function getGameInfo(gameId, aof = 0) {
  let rt = false;
  let gameObj = enumData.gameInfo[gameId] || false;
  if (gameObj) rt = gameObj[aof];
  return rt;
}
var game = {
  getDominoesList: function (id) {
    let value = id.toString();
    return enumData.domino[value];
  },
  getGameInfo: getGameInfo,
  getGameLabel: function (gameId, aof = 0) {
    let gameInfo = getGameInfo(gameId, aof);
    return gameInfo ? gameInfo.gameLabel : '';
  },
  getGameName: function (gameId, aof = 0) {
    let gameInfo = getGameInfo(gameId, aof);
    let rt = gameInfo ? gameInfo.name : '';
    if (gameInfo['lmsKey']) rt = translate(gameInfo['lmsKey'], gameInfo['lmsNameStyle']);
    return rt;
  },
  getHandRankKey: function (handRank) {
    let handRankKey = handRank;
    if (enumData.handRank[handRank]) handRankKey = enumData.handRank[handRank].key;
    return handRankKey;
  },
  getHandRankText: function (handRank) {
    let handRankText = handRank;
    if (enumData.handRank[handRank]) {
      handRankText = enumData.handRank[handRank].text;
      if (enumData.handRank[handRank].lmsKey) {
        handRankText = translate(enumData.handRank[handRank].lmsKey);
      }
    }
    return handRankText;
  },
  getInsMinValueByStake: function (stake) {
    var stepMin = 1;
    if (stake < 0.1) {
      stepMin = 0.01;
    } else if (stake < 1) {
      stepMin = 0.1;
    } else if (stake < 100) {
      stepMin = 1;
    } else if (stake < 1000) {
      stepMin = 10;
    } else if (stake < 10000) {
      stepMin = 100;
    } else if (stake < 100000) {
      stepMin = 1000;
    } else {
      stepMin = 10000;
    }
    return stepMin;
  },
  getJackpotName: function (name) {
    let result = name;
    let objA = enumData.jackpotName[name];
    if (objA) {
      result = translate(objA.text, objA.cap);
    }
    return result;
  },
  getMappingValue: function (idx, units, min, max) {
    // # app.extFunc.js
    var sliderAmount = idx * units;
    let r1 = idx * units;
    let r2 = 20 * units + (idx - 20) * units * 5;
    let r3 = 20 * units + 20 * units * 5 + (idx - 40) * units * 10;
    let r4 = 20 * units + 20 * units * 5 + 20 * units * 10 + (idx - 60) * units * 20;
    let r5 =
      20 * units + 20 * units * 5 + 20 * units * 10 + 20 * units * 20 + (idx - 80) * units * 50;
    if (idx <= 20) {
      sliderAmount = r1;
    } else if (idx <= 40) {
      sliderAmount = r2;
    } else if (idx <= 60) {
      sliderAmount = r3;
    } else if (idx <= 80) {
      sliderAmount = r4;
    } else if (idx <= 99) {
      sliderAmount = r5;
    } else {
      sliderAmount = max;
    }
    sliderAmount += min;
    sliderAmount = sliderAmount > max ? max : sliderAmount;
    return sliderAmount;
  },
  getPokerCardRanks: function (cardType) {
    let handRankData = enumData.handRank[cardType];
    return handRankData ? handRankData.text : '';
  },
  getPokerModeStakes(modeId, blinds) {
    var mode = '';
    switch (parseInt(modeId)) {
      case 1:
        if (blinds.ante > 0) {
          mode += translate('ante', 'capitalize') + ' ' + abbrNum(blinds.ante, 3);
        }
        break;
      case 2:
        if (blinds.smallAmount > 0 && blinds.bigAmount > 0) {
          mode += abbrNum(blinds.smallAmount, 3) + '/' + abbrNum(blinds.bigAmount, 3);
        }
        break;
      case 3:
        if (blinds.smallAmount > 0 && blinds.bigAmount > 0 && blinds.ante > 0) {
          mode +=
            abbrNum(blinds.smallAmount, 3) +
            '/' +
            abbrNum(blinds.bigAmount, 3) +
            ' ' +
            translate('ante', 'capitalize') +
            ' ' +
            abbrNum(blinds.ante, 3);
        }
        break;
      case 4:
        if (blinds.smallAmount > 0 && blinds.postAnte > 0) {
          let btnAnte = parseFloat(blinds.smallAmount) + parseFloat(blinds.postAnte);
          mode +=
            translate('ante', 'capitalize') +
            ' ' +
            abbrNum(blinds.smallAmount, 3) +
            ' ' +
            translate('btn', 'capitalize') +
            ' ' +
            abbrNum(btnAnte, 3);
        }
        break;
      case 5:
        if (blinds.smallAmount > 0 && blinds.bigAmount > 0 && blinds.postAnte > 0) {
          mode +=
            abbrNum(blinds.smallAmount, 3) +
            '/' +
            abbrNum(blinds.bigAmount, 3) +
            ' ' +
            translate('BB', 'upper') +
            ' ' +
            translate('ante', 'capitalize') +
            ' ' +
            abbrNum(blinds.postAnte, 3);
        }
        break;
    }
    return mode;
  },
  getSliderSteps(min, max, units) {
    // # app.extFunc.js
    let steps = 100;
    let diff = max - min;
    let r1Max = 20 * units;
    let r2Max = r1Max + 20 * units * 5;
    let r3Max = r2Max + 20 * units * 10;
    let r4Max = r3Max + 20 * units * 20;
    let r5Max = r4Max + 19 * units * 50;
    if (diff <= r1Max) {
      steps = diff / units;
    } else if (diff <= r2Max) {
      steps = 20 + (diff - r1Max) / (units * 5);
    } else if (diff <= r3Max) {
      steps = 40 + (diff - r2Max) / (units * 10);
    } else if (diff <= r4Max) {
      steps = 60 + (diff - r3Max) / (units * 20);
    } else if (diff <= r5Max) {
      steps = 80 + (diff - r4Max) / (units * 50);
    }
    if (steps > 100) {
      steps = 100;
    }
    return Math.ceil(steps);
  },
  getTournamentMode: function (data, type, blindMode) {
    // # app.extFunc.js
    let mode = '';
    let blinds = type == 0 ? data.current : data.next;
    if (typeof blinds != 'undefined') {
      mode = this.getPokerModeStakes(blindMode, blinds);
    }
    return mode;
  },
  insCalculateSteps(min, max, sliderDecimal) {
    // # app.extFunc.js
    let sliderRatio = 1;
    if (sliderDecimal == 1) {
      sliderRatio = 10;
    } else if (sliderDecimal >= 2) {
      sliderRatio = 100;
    }
    min = _.round(min * sliderRatio);
    max = _.round(max * sliderRatio);
    let initialMax = max;
    let lowerBound = [];
    let upperBound = [];
    let steps = [];
    let lowerBoundVals = [
      1, 55, 110, 550, 2100, 10500, 51000, 110000, 1050000, 2100000, 10500000, 21000000,
    ];
    let upperBoundVals = [
      50, 100, 500, 2000, 10000, 50000, 100000, 1000000, 2000000, 10000000, 20000000, -1,
    ];
    let stepsVals = [1, 5, 10, 50, 100, 500, 1000, 10000, 50000, 100000, 500000, 1000000];
    var hasSetFirst = false;
    for (let i = 0; i < stepsVals.length; i++) {
      if (min <= stepsVals[i]) {
        if (!hasSetFirst) {
          lowerBound.push(stepsVals[i]);
          hasSetFirst = true;
        } else {
          lowerBound.push(lowerBoundVals[i]);
        }
        upperBound.push(upperBoundVals[i]);
        steps.push(stepsVals[i]);
      }
    }
    let startingStep = 0;
    for (let i = 1; i < lowerBound.length; i++) {
      if (min < lowerBound[i]) {
        if (i > 0 && min > upperBound[i - 1]) {
          startingStep = i;
        } else {
          startingStep = i - 1;
        }
        break;
      }
    }
    let endingStep = upperBound.length - 1;
    for (let i = 0; i < upperBound.length; i++) {
      if (max <= upperBound[i]) {
        endingStep = i;
        break;
      }
    }
    let totalSteps = 0;
    let firstIsMin = false;
    let lastIsMax = false;
    let stepList = [];
    if (startingStep == endingStep) {
      let lowerIndex = min - lowerBound[startingStep];
      if (lowerIndex % steps[startingStep] != 0) {
        firstIsMin = true;
      }
      lowerIndex = Math.floor(lowerIndex / steps[startingStep]);
      let upperIndex = max - lowerBound[startingStep];
      if (upperIndex % steps[startingStep] != 0) {
        totalSteps++;
        lastIsMax = true;
      }
      upperIndex = Math.floor(upperIndex / steps[startingStep]);
      totalSteps += upperIndex - lowerIndex + 1;
      stepList.push(totalSteps);
    } else {
      for (let i = startingStep; i <= endingStep; i++) {
        if (i == startingStep) {
          let intervalSteps =
            Math.floor((upperBound[startingStep] - min) / steps[startingStep]) + 1;
          stepList.push(intervalSteps);
          totalSteps += intervalSteps;
          if (
            (min - lowerBound[startingStep]) % steps[startingStep] != 0 ||
            min < lowerBound[startingStep]
          ) {
            firstIsMin = true;
            totalSteps++;
          }
        } else if (i < endingStep) {
          let intervalSteps = Math.floor((upperBound[i] - lowerBound[i]) / steps[i]) + 1;
          totalSteps += intervalSteps;
          stepList.push(intervalSteps);
        } else {
          let intervalSteps = Math.floor((max - lowerBound[endingStep]) / steps[endingStep]) + 1;
          totalSteps += intervalSteps;
          stepList.push(intervalSteps);
          if ((max - lowerBound[endingStep]) % steps[endingStep] != 0) {
            totalSteps++;
            lastIsMax = true;
          }
        }
      }
    }
    let valueToPremium = (index) => {
      if (index == 0) {
        return 0;
      }
      if (firstIsMin && index == 1) {
        return _.round(min / sliderRatio, sliderDecimal);
      }
      if (lastIsMax && index == totalSteps) {
        return _.round(max / sliderRatio, sliderDecimal);
      }
      if (firstIsMin) {
        index--;
      }
      let stepCount = 0;
      let lastStepIndex = 0;
      for (let i = 0; i < stepList.length; i++) {
        stepCount += stepList[i];
        if (stepCount >= index) {
          stepCount -= stepList[i];
          lastStepIndex = startingStep + i;
          break;
        }
      }
      if (lastStepIndex == startingStep) {
        if (firstIsMin) {
          return _.round(
            (lowerBound[lastStepIndex] +
              (Math.floor((min - lowerBound[lastStepIndex]) / steps[lastStepIndex]) + index) *
                steps[lastStepIndex]) /
              sliderRatio,
            sliderDecimal,
          );
        } else {
          return _.round(
            (lowerBound[lastStepIndex] +
              (Math.floor((min - lowerBound[lastStepIndex]) / steps[lastStepIndex]) + index - 1) *
                steps[lastStepIndex]) /
              sliderRatio,
            sliderDecimal,
          );
        }
      } else {
        return _.round(
          (lowerBound[lastStepIndex] + (index - stepCount - 1) * steps[lastStepIndex]) /
            sliderRatio,
          sliderDecimal,
        );
      }
    };
    let premiumToValue = (premium) => {
      premium = _.round(premium * sliderRatio);
      if (premium == 0) {
        return 0;
      }
      if (premium >= max) {
        return totalSteps;
      }
      if (premium <= min) {
        return 1;
      }
      if (premium < lowerBound[0]) {
        return 1;
      }
      let value = 0;
      for (let i = startingStep + 1; i < lowerBound.length; i++) {
        if (premium < lowerBound[i]) {
          if (premium <= upperBound[i - 1]) {
            if (min < lowerBound[i - 1]) {
              return Math.ceil((premium - lowerBound[i - 1]) / steps[i - 1]) + value + 1;
            } else {
              return Math.ceil((premium - min) / steps[i - 1]) + value + 1;
            }
          } else if (max <= lowerBound[i]) {
            return totalSteps;
          } else {
            return value + stepList[i - 1] + 1;
          }
        } else {
          value += stepList[i - startingStep - 1];
        }
      }
      return (
        Math.ceil((premium - lowerBound[lowerBound.length - 1]) / steps[lowerBound.length - 1]) +
        value +
        1
      );
    };
    return {
      max: initialMax,
      totalSteps: totalSteps,
      valueToPremium: valueToPremium,
      premiumToValue: premiumToValue,
    };
  },
  // ===== Custom holdem or masuk function ====
  calculateSliderSteps: function (budget, smallAmount) {
    let raiseCount = budget / smallAmount;
    if (raiseCount > 700) {
      return 49;
    } else if (raiseCount > 500) {
      return 48;
    } else if (raiseCount > 200) {
      return Math.ceil(Math.round((raiseCount - 200) / 50)) + 42;
    } else if (raiseCount > 100) {
      return Math.ceil(Math.round((raiseCount - 100) / 10)) + 32;
    } else if (raiseCount > 15) {
      return Math.ceil(Math.round((raiseCount - 15) / 5)) + 15;
    } else {
      return Math.ceil(Math.round(raiseCount)) || 1;
    }
  },
  calcRaiseMap: function (min, max, smallAmount, decimal = 0) {
    // let min/max = obj.status.pollPlayer.betLimit.minRaise / max;
    // let smallAmount = obj.gameInfo.forcedBet.smallAmount;
    let budget = max - min;
    let totalSteps = this.calculateSliderSteps(budget, smallAmount);
    let betArray = [];
    let betRate = 1;
    let lastValue = min;
    let inputVaule = 0;
    for (var i = 0; i < totalSteps; i++) {
      if (i >= 48) {
        betRate = 200;
      } else if (i == 47) {
        betRate = 100;
      } else if (i > 42) {
        betRate = 50;
      } else if (i > 32) {
        betRate = 10;
      } else if (i > 15) {
        betRate = 5;
      } else {
        betRate = 1;
      }
      lastValue = smallAmount * betRate + lastValue;
      inputVaule =
        decimal > 0
          ? parseFloat(roundDownFixed(lastValue - smallAmount, decimal))
          : lastValue - smallAmount;
      betArray.push(inputVaule);
    }
    if (max > betArray[betArray.length - 1]) betArray.push(max); //All In Value.
    return betArray;
  },
  raiseMap: function (stepIndex) {
    if (stepIndex == 48) {
      return 700; // 500 + 200 * 1 = 700;
    } else if (stepIndex == 47) {
      return 500; // 400 + 100 * 1 = 500;
    } else if (stepIndex > 42) {
      return 200 + (stepIndex - 42) * 50; // 100 + 10 * 10 = 200
    } else if (stepIndex > 32) {
      return 100 + (stepIndex - 32) * 10; // 15 + 5 * 17 = 100
    } else if (stepIndex > 15) {
      return 15 + (stepIndex - 15) * 5; // 1 * 15 = 10
    } else {
      return stepIndex;
    }
  },
};

function getHeadUrl(imgUrl) {
  var url;
  if (imgUrl.substr(0, 6) == 'https:' || imgUrl.substr(0, 5) == 'http:') {
    url = imgUrl;
  } else {
    if (imgUrl.charAt(0) == '/') {
      imgUrl = imgUrl.substr(1);
    }
    url = cfg.apiServerUrl + imgUrl;
  }
  return url;
}
function getRoute() {
  // # app.extFunc.js
  var route = '/';
  var hash = window.location.hash;
  if (hash.length > 0) {
    route = hash.split('#').pop();
  }
  return route;
}
var path = {
  getHeadUrl: getHeadUrl,
  getRoute: getRoute,
};

var syncLoader = {
  _loadScript: function (url, callback, mycallback) {
    // # app.pubFunc.js
    if (url.substr(-4) == '.css') {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('link');
      script.type = 'text/css';
      script.rel = 'stylesheet';
      script.href = url + '?' + cfg.cacheVersion;
    } else {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.type = 'text/javascript';
      // script.async = true;
      script.src = url + '?' + cfg.cacheVersion;
    }
    if (callback) {
      script.onreadystatechange = function () {
        if (this.readyState == 'loaded') {
          callback();
          if (mycallback) {
            mycallback();
          }
        }
      };
      script.onload = callback;
    }
    head.appendChild(script);
  },
  load: function (items, mycallback, iteration) {
    // # app.pubFunc.js
    if (typeof items == 'string') items = [items];
    if (!iteration) iteration = 0;
    if (items[iteration]) {
      if (iteration >= items.length - 1 && typeof mycallback !== 'undefined') {
        syncLoader._loadScript(
          items[iteration],
          function () {
            syncLoader.load(items, mycallback, iteration + 1);
          },
          mycallback(),
        );
      } else {
        syncLoader._loadScript(items[iteration], function () {
          syncLoader.load(items, mycallback, iteration + 1);
        });
      }
    }
  },
  loadP: function (items) {
    return new Promise((resolve, reject) => {
      syncLoader.load(items, resolve);
    });
  },
};

var commonjsGlobal =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
    ? self
    : {};

function commonjsRequire() {
  throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

var assign = make_assign();
var create = make_create();
var trim$1 = make_trim();
var Global = typeof window !== 'undefined' ? window : commonjsGlobal;

var util = {
  assign: assign,
  create: create,
  trim: trim$1,
  bind: bind,
  slice: slice,
  each: each,
  map: map$1,
  pluck: pluck,
  isList: isList,
  isFunction: isFunction$2,
  isObject: isObject$2,
  Global: Global,
};

function make_assign() {
  if (Object.assign) {
    return Object.assign;
  } else {
    return function shimAssign(obj, props1, props2, etc) {
      for (var i = 1; i < arguments.length; i++) {
        each(Object(arguments[i]), function (val, key) {
          obj[key] = val;
        });
      }
      return obj;
    };
  }
}

function make_create() {
  if (Object.create) {
    return function create(obj, assignProps1, assignProps2, etc) {
      var assignArgsList = slice(arguments, 1);
      return assign.apply(this, [Object.create(obj)].concat(assignArgsList));
    };
  } else {
    function F() {} // eslint-disable-line no-inner-declarations
    return function create(obj, assignProps1, assignProps2, etc) {
      var assignArgsList = slice(arguments, 1);
      F.prototype = obj;
      return assign.apply(this, [new F()].concat(assignArgsList));
    };
  }
}

function make_trim() {
  if (String.prototype.trim) {
    return function trim(str) {
      return String.prototype.trim.call(str);
    };
  } else {
    return function trim(str) {
      return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
  }
}

function bind(obj, fn) {
  return function () {
    return fn.apply(obj, Array.prototype.slice.call(arguments, 0));
  };
}

function slice(arr, index) {
  return Array.prototype.slice.call(arr, index || 0);
}

function each(obj, fn) {
  pluck(obj, function (val, key) {
    fn(val, key);
    return false;
  });
}

function map$1(obj, fn) {
  var res = isList(obj) ? [] : {};
  pluck(obj, function (v, k) {
    res[k] = fn(v, k);
    return false;
  });
  return res;
}

function pluck(obj, fn) {
  if (isList(obj)) {
    for (var i = 0; i < obj.length; i++) {
      if (fn(obj[i], i)) {
        return obj[i];
      }
    }
  } else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (fn(obj[key], key)) {
          return obj[key];
        }
      }
    }
  }
}

function isList(val) {
  return val != null && typeof val != 'function' && typeof val.length == 'number';
}

function isFunction$2(val) {
  return val && {}.toString.call(val) === '[object Function]';
}

function isObject$2(val) {
  return val && {}.toString.call(val) === '[object Object]';
}

var slice$1 = util.slice;
var pluck$1 = util.pluck;
var each$1 = util.each;
var bind$1 = util.bind;
var create$1 = util.create;
var isList$1 = util.isList;
var isFunction$3 = util.isFunction;
var isObject$3 = util.isObject;

var storeEngine = {
  createStore: createStore,
};

var storeAPI = {
  version: '2.0.12',
  enabled: false,

  // get returns the value of the given key. If that value
  // is undefined, it returns optionalDefaultValue instead.
  get: function (key, optionalDefaultValue) {
    var data = this.storage.read(this._namespacePrefix + key);
    return this._deserialize(data, optionalDefaultValue);
  },

  // set will store the given value at key and returns value.
  // Calling set with value === undefined is equivalent to calling remove.
  set: function (key, value) {
    if (value === undefined) {
      return this.remove(key);
    }
    this.storage.write(this._namespacePrefix + key, this._serialize(value));
    return value;
  },

  // remove deletes the key and value stored at the given key.
  remove: function (key) {
    this.storage.remove(this._namespacePrefix + key);
  },

  // each will call the given callback once for each key-value pair
  // in this store.
  each: function (callback) {
    var self = this;
    this.storage.each(function (val, namespacedKey) {
      callback.call(
        self,
        self._deserialize(val),
        (namespacedKey || '').replace(self._namespaceRegexp, ''),
      );
    });
  },

  // clearAll will remove all the stored key-value pairs in this store.
  clearAll: function () {
    this.storage.clearAll();
  },

  // additional functionality that can't live in plugins
  // ---------------------------------------------------

  // hasNamespace returns true if this store instance has the given namespace.
  hasNamespace: function (namespace) {
    return this._namespacePrefix == '__storejs_' + namespace + '_';
  },

  // createStore creates a store.js instance with the first
  // functioning storage in the list of storage candidates,
  // and applies the the given mixins to the instance.
  createStore: function () {
    return createStore.apply(this, arguments);
  },

  addPlugin: function (plugin) {
    this._addPlugin(plugin);
  },

  namespace: function (namespace) {
    return createStore(this.storage, this.plugins, namespace);
  },
};

function _warn() {
  var _console = typeof console == 'undefined' ? null : console;
  if (!_console) {
    return;
  }
  var fn = _console.warn ? _console.warn : _console.log;
  fn.apply(_console, arguments);
}

function createStore(storages, plugins, namespace) {
  if (!namespace) {
    namespace = '';
  }
  if (storages && !isList$1(storages)) {
    storages = [storages];
  }
  if (plugins && !isList$1(plugins)) {
    plugins = [plugins];
  }

  var namespacePrefix = namespace ? '__storejs_' + namespace + '_' : '';
  var namespaceRegexp = namespace ? new RegExp('^' + namespacePrefix) : null;
  var legalNamespaces = /^[a-zA-Z0-9_\-]*$/; // alpha-numeric + underscore and dash
  if (!legalNamespaces.test(namespace)) {
    throw new Error('store.js namespaces can only have alphanumerics + underscores and dashes');
  }

  var _privateStoreProps = {
    _namespacePrefix: namespacePrefix,
    _namespaceRegexp: namespaceRegexp,

    _testStorage: function (storage) {
      try {
        var testStr = '__storejs__test__';
        storage.write(testStr, testStr);
        var ok = storage.read(testStr) === testStr;
        storage.remove(testStr);
        return ok;
      } catch (e) {
        return false;
      }
    },

    _assignPluginFnProp: function (pluginFnProp, propName) {
      var oldFn = this[propName];
      this[propName] = function pluginFn() {
        var args = slice$1(arguments, 0);
        var self = this;

        // super_fn calls the old function which was overwritten by
        // this mixin.
        function super_fn() {
          if (!oldFn) {
            return;
          }
          each$1(arguments, function (arg, i) {
            args[i] = arg;
          });
          return oldFn.apply(self, args);
        }

        // Give mixing function access to super_fn by prefixing all mixin function
        // arguments with super_fn.
        var newFnArgs = [super_fn].concat(args);

        return pluginFnProp.apply(self, newFnArgs);
      };
    },

    _serialize: function (obj) {
      return JSON.stringify(obj);
    },

    _deserialize: function (strVal, defaultVal) {
      if (!strVal) {
        return defaultVal;
      }
      // It is possible that a raw string value has been previously stored
      // in a storage without using store.js, meaning it will be a raw
      // string value instead of a JSON serialized string. By defaulting
      // to the raw string value in case of a JSON parse error, we allow
      // for past stored values to be forwards-compatible with store.js
      var val = '';
      try {
        val = JSON.parse(strVal);
      } catch (e) {
        val = strVal;
      }

      return val !== undefined ? val : defaultVal;
    },

    _addStorage: function (storage) {
      if (this.enabled) {
        return;
      }
      if (this._testStorage(storage)) {
        this.storage = storage;
        this.enabled = true;
      }
    },

    _addPlugin: function (plugin) {
      var self = this;

      // If the plugin is an array, then add all plugins in the array.
      // This allows for a plugin to depend on other plugins.
      if (isList$1(plugin)) {
        each$1(plugin, function (plugin) {
          self._addPlugin(plugin);
        });
        return;
      }

      // Keep track of all plugins we've seen so far, so that we
      // don't add any of them twice.
      var seenPlugin = pluck$1(this.plugins, function (seenPlugin) {
        return plugin === seenPlugin;
      });
      if (seenPlugin) {
        return;
      }
      this.plugins.push(plugin);

      // Check that the plugin is properly formed
      if (!isFunction$3(plugin)) {
        throw new Error('Plugins must be function values that return objects');
      }

      var pluginProperties = plugin.call(this);
      if (!isObject$3(pluginProperties)) {
        throw new Error('Plugins must return an object of function properties');
      }

      // Add the plugin function properties to this store instance.
      each$1(pluginProperties, function (pluginFnProp, propName) {
        if (!isFunction$3(pluginFnProp)) {
          throw new Error(
            'Bad plugin property: ' +
              propName +
              ' from plugin ' +
              plugin.name +
              '. Plugins should only return functions.',
          );
        }
        self._assignPluginFnProp(pluginFnProp, propName);
      });
    },

    // Put deprecated properties in the private API, so as to not expose it to accidential
    // discovery through inspection of the store object.

    // Deprecated: addStorage
    addStorage: function (storage) {
      _warn('store.addStorage(storage) is deprecated. Use createStore([storages])');
      this._addStorage(storage);
    },
  };

  var store = create$1(_privateStoreProps, storeAPI, {
    plugins: [],
  });
  store.raw = {};
  each$1(store, function (prop, propName) {
    if (isFunction$3(prop)) {
      store.raw[propName] = bind$1(store, prop);
    }
  });
  each$1(storages, function (storage) {
    store._addStorage(storage);
  });
  each$1(plugins, function (plugin) {
    store._addPlugin(plugin);
  });
  return store;
}

var Global$1 = util.Global;

var localStorage_1 = {
  name: 'localStorage',
  read: read,
  write: write,
  each: each$2,
  remove: remove,
  clearAll: clearAll,
};

function localStorage() {
  return Global$1.localStorage;
}

function read(key) {
  return localStorage().getItem(key);
}

function write(key, data) {
  return localStorage().setItem(key, data);
}

function each$2(fn) {
  for (var i = localStorage().length - 1; i >= 0; i--) {
    var key = localStorage().key(i);
    fn(read(key), key);
  }
}

function remove(key) {
  return localStorage().removeItem(key);
}

function clearAll() {
  return localStorage().clear();
}

// oldFF-globalStorage provides storage for Firefox
// versions 6 and 7, where no localStorage, etc
// is available.

var Global$2 = util.Global;

var oldFFGlobalStorage = {
  name: 'oldFF-globalStorage',
  read: read$1,
  write: write$1,
  each: each$3,
  remove: remove$1,
  clearAll: clearAll$1,
};

var globalStorage = Global$2.globalStorage;

function read$1(key) {
  return globalStorage[key];
}

function write$1(key, data) {
  globalStorage[key] = data;
}

function each$3(fn) {
  for (var i = globalStorage.length - 1; i >= 0; i--) {
    var key = globalStorage.key(i);
    fn(globalStorage[key], key);
  }
}

function remove$1(key) {
  return globalStorage.removeItem(key);
}

function clearAll$1() {
  each$3(function (key, _) {
    delete globalStorage[key];
  });
}

// oldIE-userDataStorage provides storage for Internet Explorer
// versions 6 and 7, where no localStorage, sessionStorage, etc
// is available.

var Global$3 = util.Global;

var oldIEUserDataStorage = {
  name: 'oldIE-userDataStorage',
  write: write$2,
  read: read$2,
  each: each$4,
  remove: remove$2,
  clearAll: clearAll$2,
};

var storageName = 'storejs';
var doc = Global$3.document;
var _withStorageEl = _makeIEStorageElFunction();
var disable = (Global$3.navigator ? Global$3.navigator.userAgent : '').match(
  / (MSIE 8|MSIE 9|MSIE 10)\./,
); // MSIE 9.x, MSIE 10.x

function write$2(unfixedKey, data) {
  if (disable) {
    return;
  }
  var fixedKey = fixKey(unfixedKey);
  _withStorageEl(function (storageEl) {
    storageEl.setAttribute(fixedKey, data);
    storageEl.save(storageName);
  });
}

function read$2(unfixedKey) {
  if (disable) {
    return;
  }
  var fixedKey = fixKey(unfixedKey);
  var res = null;
  _withStorageEl(function (storageEl) {
    res = storageEl.getAttribute(fixedKey);
  });
  return res;
}

function each$4(callback) {
  _withStorageEl(function (storageEl) {
    var attributes = storageEl.XMLDocument.documentElement.attributes;
    for (var i = attributes.length - 1; i >= 0; i--) {
      var attr = attributes[i];
      callback(storageEl.getAttribute(attr.name), attr.name);
    }
  });
}

function remove$2(unfixedKey) {
  var fixedKey = fixKey(unfixedKey);
  _withStorageEl(function (storageEl) {
    storageEl.removeAttribute(fixedKey);
    storageEl.save(storageName);
  });
}

function clearAll$2() {
  _withStorageEl(function (storageEl) {
    var attributes = storageEl.XMLDocument.documentElement.attributes;
    storageEl.load(storageName);
    for (var i = attributes.length - 1; i >= 0; i--) {
      storageEl.removeAttribute(attributes[i].name);
    }
    storageEl.save(storageName);
  });
}

// Helpers
//////////

// In IE7, keys cannot start with a digit or contain certain chars.
// See https://github.com/marcuswestin/store.js/issues/40
// See https://github.com/marcuswestin/store.js/issues/83
var forbiddenCharsRegex = new RegExp('[!"#$%&\'()*+,/\\\\:;<=>?@[\\]^`{|}~]', 'g');
function fixKey(key) {
  return key.replace(/^\d/, '___$&').replace(forbiddenCharsRegex, '___');
}

function _makeIEStorageElFunction() {
  if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
    return null;
  }
  var scriptTag = 'script',
    storageOwner,
    storageContainer,
    storageEl;

  // Since #userData storage applies only to specific paths, we need to
  // somehow link our data to a specific path.  We choose /favicon.ico
  // as a pretty safe option, since all browsers already make a request to
  // this URL anyway and being a 404 will not hurt us here.  We wrap an
  // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
  // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
  // since the iframe access rules appear to allow direct access and
  // manipulation of the document element, even for a 404 page.  This
  // document can be used instead of the current document (which would
  // have been limited to the current path) to perform #userData storage.
  try {
    /* global ActiveXObject */
    storageContainer = new ActiveXObject('htmlfile');
    storageContainer.open();
    storageContainer.write(
      '<' +
        scriptTag +
        '>document.w=window</' +
        scriptTag +
        '><iframe src="/favicon.ico"></iframe>',
    );
    storageContainer.close();
    storageOwner = storageContainer.w.frames[0].document;
    storageEl = storageOwner.createElement('div');
  } catch (e) {
    // somehow ActiveXObject instantiation failed (perhaps some special
    // security settings or otherwse), fall back to per-path storage
    storageEl = doc.createElement('div');
    storageOwner = doc.body;
  }

  return function (storeFunction) {
    var args = [].slice.call(arguments, 0);
    args.unshift(storageEl);
    // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
    // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
    storageOwner.appendChild(storageEl);
    storageEl.addBehavior('#default#userData');
    storageEl.load(storageName);
    storeFunction.apply(this, args);
    storageOwner.removeChild(storageEl);
    return;
  };
}

// cookieStorage is useful Safari private browser mode, where localStorage
// doesn't work but cookies do. This implementation is adopted from
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage

var Global$4 = util.Global;
var trim$2 = util.trim;

var cookieStorage = {
  name: 'cookieStorage',
  read: read$3,
  write: write$3,
  each: each$5,
  remove: remove$3,
  clearAll: clearAll$3,
};

var doc$1 = Global$4.document;

function read$3(key) {
  if (!key || !_has(key)) {
    return null;
  }
  var regexpStr =
    '(?:^|.*;\\s*)' +
    escape(key).replace(/[\-\.\+\*]/g, '\\$&') +
    '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*';
  return unescape(doc$1.cookie.replace(new RegExp(regexpStr), '$1'));
}

function each$5(callback) {
  var cookies = doc$1.cookie.split(/; ?/g);
  for (var i = cookies.length - 1; i >= 0; i--) {
    if (!trim$2(cookies[i])) {
      continue;
    }
    var kvp = cookies[i].split('=');
    var key = unescape(kvp[0]);
    var val = unescape(kvp[1]);
    callback(val, key);
  }
}

function write$3(key, data) {
  if (!key) {
    return;
  }
  doc$1.cookie =
    escape(key) + '=' + escape(data) + '; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/';
}

function remove$3(key) {
  if (!key || !_has(key)) {
    return;
  }
  doc$1.cookie = escape(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

function clearAll$3() {
  each$5(function (_, key) {
    remove$3(key);
  });
}

function _has(key) {
  return new RegExp('(?:^|;\\s*)' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=').test(
    doc$1.cookie,
  );
}

var Global$5 = util.Global;

var sessionStorage_1 = {
  name: 'sessionStorage',
  read: read$4,
  write: write$4,
  each: each$6,
  remove: remove$4,
  clearAll: clearAll$4,
};

function sessionStorage() {
  return Global$5.sessionStorage;
}

function read$4(key) {
  return sessionStorage().getItem(key);
}

function write$4(key, data) {
  return sessionStorage().setItem(key, data);
}

function each$6(fn) {
  for (var i = sessionStorage().length - 1; i >= 0; i--) {
    var key = sessionStorage().key(i);
    fn(read$4(key), key);
  }
}

function remove$4(key) {
  return sessionStorage().removeItem(key);
}

function clearAll$4() {
  return sessionStorage().clear();
}

// memoryStorage is a useful last fallback to ensure that the store
// is functions (meaning store.get(), store.set(), etc will all function).
// However, stored values will not persist when the browser navigates to
// a new page or reloads the current page.

var memoryStorage_1 = {
  name: 'memoryStorage',
  read: read$5,
  write: write$5,
  each: each$7,
  remove: remove$5,
  clearAll: clearAll$5,
};

var memoryStorage = {};

function read$5(key) {
  return memoryStorage[key];
}

function write$5(key, data) {
  memoryStorage[key] = data;
}

function each$7(callback) {
  for (var key in memoryStorage) {
    if (memoryStorage.hasOwnProperty(key)) {
      callback(memoryStorage[key], key);
    }
  }
}

function remove$5(key) {
  delete memoryStorage[key];
}

function clearAll$5(key) {
  memoryStorage = {};
}

var all = [
  // Listed in order of usage preference
  localStorage_1,
  oldFFGlobalStorage,
  oldIEUserDataStorage,
  cookieStorage,
  sessionStorage_1,
  memoryStorage_1,
];

/* eslint-disable */

//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
  JSON = {};
}

(function () {
  var rx_one = /^[\],:{}\s]*$/;
  var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
  var rx_escapable =
    /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var rx_dangerous =
    /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  function f(n) {
    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
  }

  function this_value() {
    return this.valueOf();
  }

  if (typeof Date.prototype.toJSON !== 'function') {
    Date.prototype.toJSON = function () {
      return isFinite(this.valueOf())
        ? this.getUTCFullYear() +
            '-' +
            f(this.getUTCMonth() + 1) +
            '-' +
            f(this.getUTCDate()) +
            'T' +
            f(this.getUTCHours()) +
            ':' +
            f(this.getUTCMinutes()) +
            ':' +
            f(this.getUTCSeconds()) +
            'Z'
        : null;
    };

    Boolean.prototype.toJSON = this_value;
    Number.prototype.toJSON = this_value;
    String.prototype.toJSON = this_value;
  }

  var gap;
  var indent;
  var meta;
  var rep;

  function quote(string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

    rx_escapable.lastIndex = 0;
    return rx_escapable.test(string)
      ? '"' +
          string.replace(rx_escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
              ? c
              : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) +
          '"'
      : '"' + string + '"';
  }

  function str(key, holder) {
    // Produce a string from holder[key].

    var i; // The loop counter.
    var k; // The member key.
    var v; // The member value.
    var length;
    var mind = gap;
    var partial;
    var value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.

    if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.

    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }

    // What happens next depends on the value's type.

    switch (typeof value) {
      case 'string':
        return quote(value);

      case 'number':
        // JSON numbers must be finite. Encode non-finite numbers as null.

        return isFinite(value) ? String(value) : 'null';

      case 'boolean':
      case 'null':
        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce "null". The case is included here in
        // the remote chance that this gets fixed someday.

        return String(value);

      // If the type is "object", we might be dealing with an object or an array or
      // null.

      case 'object':
        // Due to a specification blunder in ECMAScript, typeof null is "object",
        // so watch out for that case.

        if (!value) {
          return 'null';
        }

        // Make an array to hold the partial results of stringifying this object value.

        gap += indent;
        partial = [];

        // Is the value an array?

        if (Object.prototype.toString.apply(value) === '[object Array]') {
          // The value is an array. Stringify every element. Use null as a placeholder
          // for non-JSON values.

          length = value.length;
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || 'null';
          }

          // Join all of the elements together, separated with commas, and wrap them in
          // brackets.

          v =
            partial.length === 0
              ? '[]'
              : gap
              ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
              : '[' + partial.join(',') + ']';
          gap = mind;
          return v;
        }

        // If the replacer is an array, use it to select the members to be stringified.

        if (rep && typeof rep === 'object') {
          length = rep.length;
          for (i = 0; i < length; i += 1) {
            if (typeof rep[i] === 'string') {
              k = rep[i];
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        } else {
          // Otherwise, iterate through all of the keys in the object.

          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v =
          partial.length === 0
            ? '{}'
            : gap
            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
            : '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
  }

  // If the JSON object does not yet have a stringify method, give it one.

  if (typeof JSON.stringify !== 'function') {
    meta = {
      // table of character substitutions
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\',
    };
    JSON.stringify = function (value, replacer, space) {
      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }

        // If the space parameter is a string, it will be used as the indent string.
      } else if (typeof space === 'string') {
        indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (
        replacer &&
        typeof replacer !== 'function' &&
        (typeof replacer !== 'object' || typeof replacer.length !== 'number')
      ) {
        throw new Error('JSON.stringify');
      }

      // Make a fake root object containing our value under the key of "".
      // Return the result of stringifying the value.

      return str('', { '': value });
    };
  }

  // If the JSON object does not yet have a parse method, give it one.

  if (typeof JSON.parse !== 'function') {
    JSON.parse = function (text, reviver) {
      // The parse method takes a text and an optional reviver function, and returns
      // a JavaScript value if the text is a valid JSON text.

      var j;

      function walk(holder, key) {
        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.

        var k;
        var v;
        var value = holder[key];
        if (value && typeof value === 'object') {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }

      // Parsing happens in four stages. In the first stage, we replace certain
      // Unicode characters with escape sequences. JavaScript handles many characters
      // incorrectly, either silently deleting them, or treating them as line endings.

      text = String(text);
      rx_dangerous.lastIndex = 0;
      if (rx_dangerous.test(text)) {
        text = text.replace(rx_dangerous, function (a) {
          return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }

      // In the second stage, we run the text against regular expressions that look
      // for non-JSON patterns. We are especially concerned with "()" and "new"
      // because they can cause invocation, and "=" because it can cause mutation.
      // But just to be safe, we want to reject all unexpected forms.

      // We split the second stage into 4 regexp operations in order to work around
      // crippling inefficiencies in IE's and Safari's regexp engines. First we
      // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
      // replace all simple value tokens with "]" characters. Third, we delete all
      // open brackets that follow a colon or comma or that begin the text. Finally,
      // we look to see that the remaining characters are only whitespace or "]" or
      // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

      if (rx_one.test(text.replace(rx_two, '@').replace(rx_three, ']').replace(rx_four, ''))) {
        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.

        j = eval('(' + text + ')');

        // In the optional fourth stage, we recursively walk the new structure, passing
        // each name/value pair to a reviver function for possible transformation.

        return typeof reviver === 'function' ? walk({ '': j }, '') : j;
      }

      // If the text is not JSON parseable, then a SyntaxError is thrown.

      throw new SyntaxError('JSON.parse');
    };
  }
})();

var json2 = json2Plugin;

function json2Plugin() {
  return {};
}

var plugins = [json2];

var store_legacy = storeEngine.createStore(all, plugins);

function updateProfile(key, val, callback) {
  var gameUser = store_legacy.get('gameUser');
  gameUser.userInfo[key] = val;
  store_legacy.set('gameUser', gameUser);
  if (typeof callback === 'function') {
    callback();
  }
}
function setQuickBetSetting(raiseBtn) {
  if (typeof raiseBtn == 'undefined') {
    raiseBtn = {};
  }
  store_legacy.set('raiseBtn', raiseBtn);
}
function getMyGems() {
  // # app.func.js
  return store_legacy.get('myGems') || 0;
}
function setMyGems(gems) {
  // # app.func.js
  return store_legacy.set('myGems', gems);
}
function getSid() {
  return store_legacy.get('sid') || '';
}
function setRebuyPreferences(settings) {
  if (typeof settings != 'undefined') {
    if (typeof settings.isAutoRebuy != 'undefined') {
      let param = {
        isAutoRebuy: settings.isAutoRebuy,
        addChips: settings.addChips,
        chipsLeft: settings.chipsLeft,
      };
      store_legacy.set('autoReBuyParam', param);
    }
  }
}
function setUserPreferences() {
  var oPreference = store_legacy.get('preference') || {};
  if (oPreference.vibration != undefined) return;
  oPreference.gameSFX = typeof oPreference.gameSFX == 'undefined' ? true : oPreference.gameSFX;
  oPreference.emojiSFX = typeof oPreference.emojiSFX == 'undefined' ? true : oPreference.emojiSFX;
  oPreference.microphoneSFX =
    typeof oPreference.microphoneSFX == 'undefined' ? true : oPreference.microphoneSFX;
  oPreference.vibration =
    typeof oPreference.vibration == 'undefined' ? true : oPreference.vibration;
  oPreference.notification =
    typeof oPreference.notification == 'undefined' ? true : oPreference.notification;
  store_legacy.set('preference', oPreference);
}
var user = {
  getMyGems: getMyGems,
  setMyGems: setMyGems,
  getSid: getSid,
  setQuickBetSetting: setQuickBetSetting,
  setRebuyPreferences: setRebuyPreferences,
  setUserPreferences: setUserPreferences,
  updateProfile: updateProfile,
};

var core = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory();
    }
  })(commonjsGlobal, function () {
    /*globals window, global, require*/

    /**
     * CryptoJS core components.
     */
    var CryptoJS =
      CryptoJS ||
      (function (Math, undefined$1) {
        var crypto$1;

        // Native crypto from window (Browser)
        if (typeof window !== 'undefined' && window.crypto) {
          crypto$1 = window.crypto;
        }

        // Native (experimental IE 11) crypto from window (Browser)
        if (!crypto$1 && typeof window !== 'undefined' && window.msCrypto) {
          crypto$1 = window.msCrypto;
        }

        // Native crypto from global (NodeJS)
        if (!crypto$1 && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
          crypto$1 = commonjsGlobal.crypto;
        }

        // Native crypto import via require (NodeJS)
        if (!crypto$1 && typeof commonjsRequire === 'function') {
          try {
            crypto$1 = crypto;
          } catch (err) {}
        }

        /*
         * Cryptographically secure pseudorandom number generator
         *
         * As Math.random() is cryptographically not safe to use
         */
        var cryptoSecureRandomInt = function () {
          if (crypto$1) {
            // Use getRandomValues method (Browser)
            if (typeof crypto$1.getRandomValues === 'function') {
              try {
                return crypto$1.getRandomValues(new Uint32Array(1))[0];
              } catch (err) {}
            }

            // Use randomBytes method (NodeJS)
            if (typeof crypto$1.randomBytes === 'function') {
              try {
                return crypto$1.randomBytes(4).readInt32LE();
              } catch (err) {}
            }
          }

          throw new Error('Native crypto module could not be used to get secure random number.');
        };

        /*
	     * Local polyfill of Object.create

	     */
        var create =
          Object.create ||
          (function () {
            function F() {}

            return function (obj) {
              var subtype;

              F.prototype = obj;

              subtype = new F();

              F.prototype = null;

              return subtype;
            };
          })();

        /**
         * CryptoJS namespace.
         */
        var C = {};

        /**
         * Library namespace.
         */
        var C_lib = (C.lib = {});

        /**
         * Base object for prototypal inheritance.
         */
        var Base = (C_lib.Base = (function () {
          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (overrides) {
              // Spawn
              var subtype = create(this);

              // Augment
              if (overrides) {
                subtype.mixIn(overrides);
              }

              // Create default initializer
              if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                subtype.init = function () {
                  subtype.$super.init.apply(this, arguments);
                };
              }

              // Initializer's prototype is the subtype object
              subtype.init.prototype = subtype;

              // Reference supertype
              subtype.$super = this;

              return subtype;
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function () {
              var instance = this.extend();
              instance.init.apply(instance, arguments);

              return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function () {},

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function (properties) {
              for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                  this[propertyName] = properties[propertyName];
                }
              }

              // IE won't copy toString using the loop above
              if (properties.hasOwnProperty('toString')) {
                this.toString = properties.toString;
              }
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
              return this.init.prototype.extend(this);
            },
          };
        })());

        /**
         * An array of 32-bit words.
         *
         * @property {Array} words The array of 32-bit words.
         * @property {number} sigBytes The number of significant bytes in this word array.
         */
        var WordArray = (C_lib.WordArray = Base.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined$1) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 4;
            }
          },

          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function (encoder) {
            return (encoder || Hex).stringify(this);
          },

          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            // Clamp excess bits
            this.clamp();

            // Concat
            if (thisSigBytes % 4) {
              // Copy one byte at a time
              for (var i = 0; i < thatSigBytes; i++) {
                var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[(thisSigBytes + i) >>> 2] |=
                  thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
              }
            } else {
              // Copy one word at a time
              for (var i = 0; i < thatSigBytes; i += 4) {
                thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
              }
            }
            this.sigBytes += thatSigBytes;

            // Chainable
            return this;
          },

          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            // Clamp
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
          },

          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
          },

          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function (nBytes) {
            var words = [];

            for (var i = 0; i < nBytes; i += 4) {
              words.push(cryptoSecureRandomInt());
            }

            return new WordArray.init(words, nBytes);
          },
        }));

        /**
         * Encoder namespace.
         */
        var C_enc = (C.enc = {});

        /**
         * Hex encoding strategy.
         */
        var Hex = (C_enc.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
              var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
              hexChars.push((bite >>> 4).toString(16));
              hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
          },

          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
              words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return new WordArray.init(words, hexStrLength / 2);
          },
        });

        /**
         * Latin1 encoding strategy.
         */
        var Latin1 = (C_enc.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
              var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
              latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
          },

          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
              words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return new WordArray.init(words, latin1StrLength);
          },
        });

        /**
         * UTF-8 encoding strategy.
         */
        var Utf8 = (C_enc.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function (wordArray) {
            try {
              return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
              throw new Error('Malformed UTF-8 data');
            }
          },

          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
          },
        });

        /**
         * Abstract buffered block algorithm template.
         *
         * The property blockSize must be implemented in a concrete subtype.
         *
         * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
         */
        var BufferedBlockAlgorithm = (C_lib.BufferedBlockAlgorithm = Base.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function () {
            // Initial values
            this._data = new WordArray.init();
            this._nDataBytes = 0;
          },

          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function (data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
              data = Utf8.parse(data);
            }

            // Append
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
          },

          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function (doFlush) {
            var processedWords;

            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
              // Round up to include partial blocks
              nBlocksReady = Math.ceil(nBlocksReady);
            } else {
              // Round down to include only full blocks,
              // less the number of blocks that must remain in the buffer
              nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
              for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                // Perform concrete-algorithm logic
                this._doProcessBlock(dataWords, offset);
              }

              // Remove processed words
              processedWords = dataWords.splice(0, nWordsReady);
              data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return new WordArray.init(processedWords, nBytesReady);
          },

          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();

            return clone;
          },

          _minBufferSize: 0,
        }));

        /**
         * Abstract hasher template.
         *
         * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
         */
        var Hasher = (C_lib.Hasher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           */
          cfg: Base.extend(),

          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function (cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Set initial values
            this.reset();
          },

          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-hasher logic
            this._doReset();
          },

          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function (messageUpdate) {
            // Append
            this._append(messageUpdate);

            // Update the hash
            this._process();

            // Chainable
            return this;
          },

          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
              this._append(messageUpdate);
            }

            // Perform concrete-hasher logic
            var hash = this._doFinalize();

            return hash;
          },

          blockSize: 512 / 32,

          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function (hasher) {
            return function (message, cfg) {
              return new hasher.init(cfg).finalize(message);
            };
          },

          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function (hasher) {
            return function (message, key) {
              return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
          },
        }));

        /**
         * Algorithm namespace.
         */
        var C_algo = (C.algo = {});

        return C;
      })(Math);

    return CryptoJS;
  });
});

var md5 = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function (Math) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C.algo;

      // Constants table
      var T = [];

      // Compute constants
      (function () {
        for (var i = 0; i < 64; i++) {
          T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
        }
      })();

      /**
       * MD5 hash algorithm.
       */
      var MD5 = (C_algo.MD5 = Hasher.extend({
        _doReset: function () {
          this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
        },

        _doProcessBlock: function (M, offset) {
          // Swap endian
          for (var i = 0; i < 16; i++) {
            // Shortcuts
            var offset_i = offset + i;
            var M_offset_i = M[offset_i];

            M[offset_i] =
              (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
              (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00);
          }

          // Shortcuts
          var H = this._hash.words;

          var M_offset_0 = M[offset + 0];
          var M_offset_1 = M[offset + 1];
          var M_offset_2 = M[offset + 2];
          var M_offset_3 = M[offset + 3];
          var M_offset_4 = M[offset + 4];
          var M_offset_5 = M[offset + 5];
          var M_offset_6 = M[offset + 6];
          var M_offset_7 = M[offset + 7];
          var M_offset_8 = M[offset + 8];
          var M_offset_9 = M[offset + 9];
          var M_offset_10 = M[offset + 10];
          var M_offset_11 = M[offset + 11];
          var M_offset_12 = M[offset + 12];
          var M_offset_13 = M[offset + 13];
          var M_offset_14 = M[offset + 14];
          var M_offset_15 = M[offset + 15];

          // Working varialbes
          var a = H[0];
          var b = H[1];
          var c = H[2];
          var d = H[3];

          // Computation
          a = FF(a, b, c, d, M_offset_0, 7, T[0]);
          d = FF(d, a, b, c, M_offset_1, 12, T[1]);
          c = FF(c, d, a, b, M_offset_2, 17, T[2]);
          b = FF(b, c, d, a, M_offset_3, 22, T[3]);
          a = FF(a, b, c, d, M_offset_4, 7, T[4]);
          d = FF(d, a, b, c, M_offset_5, 12, T[5]);
          c = FF(c, d, a, b, M_offset_6, 17, T[6]);
          b = FF(b, c, d, a, M_offset_7, 22, T[7]);
          a = FF(a, b, c, d, M_offset_8, 7, T[8]);
          d = FF(d, a, b, c, M_offset_9, 12, T[9]);
          c = FF(c, d, a, b, M_offset_10, 17, T[10]);
          b = FF(b, c, d, a, M_offset_11, 22, T[11]);
          a = FF(a, b, c, d, M_offset_12, 7, T[12]);
          d = FF(d, a, b, c, M_offset_13, 12, T[13]);
          c = FF(c, d, a, b, M_offset_14, 17, T[14]);
          b = FF(b, c, d, a, M_offset_15, 22, T[15]);

          a = GG(a, b, c, d, M_offset_1, 5, T[16]);
          d = GG(d, a, b, c, M_offset_6, 9, T[17]);
          c = GG(c, d, a, b, M_offset_11, 14, T[18]);
          b = GG(b, c, d, a, M_offset_0, 20, T[19]);
          a = GG(a, b, c, d, M_offset_5, 5, T[20]);
          d = GG(d, a, b, c, M_offset_10, 9, T[21]);
          c = GG(c, d, a, b, M_offset_15, 14, T[22]);
          b = GG(b, c, d, a, M_offset_4, 20, T[23]);
          a = GG(a, b, c, d, M_offset_9, 5, T[24]);
          d = GG(d, a, b, c, M_offset_14, 9, T[25]);
          c = GG(c, d, a, b, M_offset_3, 14, T[26]);
          b = GG(b, c, d, a, M_offset_8, 20, T[27]);
          a = GG(a, b, c, d, M_offset_13, 5, T[28]);
          d = GG(d, a, b, c, M_offset_2, 9, T[29]);
          c = GG(c, d, a, b, M_offset_7, 14, T[30]);
          b = GG(b, c, d, a, M_offset_12, 20, T[31]);

          a = HH(a, b, c, d, M_offset_5, 4, T[32]);
          d = HH(d, a, b, c, M_offset_8, 11, T[33]);
          c = HH(c, d, a, b, M_offset_11, 16, T[34]);
          b = HH(b, c, d, a, M_offset_14, 23, T[35]);
          a = HH(a, b, c, d, M_offset_1, 4, T[36]);
          d = HH(d, a, b, c, M_offset_4, 11, T[37]);
          c = HH(c, d, a, b, M_offset_7, 16, T[38]);
          b = HH(b, c, d, a, M_offset_10, 23, T[39]);
          a = HH(a, b, c, d, M_offset_13, 4, T[40]);
          d = HH(d, a, b, c, M_offset_0, 11, T[41]);
          c = HH(c, d, a, b, M_offset_3, 16, T[42]);
          b = HH(b, c, d, a, M_offset_6, 23, T[43]);
          a = HH(a, b, c, d, M_offset_9, 4, T[44]);
          d = HH(d, a, b, c, M_offset_12, 11, T[45]);
          c = HH(c, d, a, b, M_offset_15, 16, T[46]);
          b = HH(b, c, d, a, M_offset_2, 23, T[47]);

          a = II(a, b, c, d, M_offset_0, 6, T[48]);
          d = II(d, a, b, c, M_offset_7, 10, T[49]);
          c = II(c, d, a, b, M_offset_14, 15, T[50]);
          b = II(b, c, d, a, M_offset_5, 21, T[51]);
          a = II(a, b, c, d, M_offset_12, 6, T[52]);
          d = II(d, a, b, c, M_offset_3, 10, T[53]);
          c = II(c, d, a, b, M_offset_10, 15, T[54]);
          b = II(b, c, d, a, M_offset_1, 21, T[55]);
          a = II(a, b, c, d, M_offset_8, 6, T[56]);
          d = II(d, a, b, c, M_offset_15, 10, T[57]);
          c = II(c, d, a, b, M_offset_6, 15, T[58]);
          b = II(b, c, d, a, M_offset_13, 21, T[59]);
          a = II(a, b, c, d, M_offset_4, 6, T[60]);
          d = II(d, a, b, c, M_offset_11, 10, T[61]);
          c = II(c, d, a, b, M_offset_2, 15, T[62]);
          b = II(b, c, d, a, M_offset_9, 21, T[63]);

          // Intermediate hash value
          H[0] = (H[0] + a) | 0;
          H[1] = (H[1] + b) | 0;
          H[2] = (H[2] + c) | 0;
          H[3] = (H[3] + d) | 0;
        },

        _doFinalize: function () {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;

          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;

          // Add padding
          dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));

          var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
          var nBitsTotalL = nBitsTotal;
          dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] =
            (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00);
          dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] =
            (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00);

          data.sigBytes = (dataWords.length + 1) * 4;

          // Hash final blocks
          this._process();

          // Shortcuts
          var hash = this._hash;
          var H = hash.words;

          // Swap endian
          for (var i = 0; i < 4; i++) {
            // Shortcut
            var H_i = H[i];

            H[i] =
              (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
              (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
          }

          // Return final computed hash
          return hash;
        },

        clone: function () {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();

          return clone;
        },
      }));

      function FF(a, b, c, d, x, s, t) {
        var n = a + ((b & c) | (~b & d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
      }

      function GG(a, b, c, d, x, s, t) {
        var n = a + ((b & d) | (c & ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
      }

      function HH(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
      }

      function II(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
      }

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.MD5('message');
       *     var hash = CryptoJS.MD5(wordArray);
       */
      C.MD5 = Hasher._createHelper(MD5);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacMD5(message, key);
       */
      C.HmacMD5 = Hasher._createHmacHelper(MD5);
    })(Math);

    return CryptoJS.MD5;
  });
});

var x64Core = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function (undefined$1) {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Base = C_lib.Base;
      var X32WordArray = C_lib.WordArray;

      /**
       * x64 namespace.
       */
      var C_x64 = (C.x64 = {});

      /**
       * A 64-bit word.
       */
      var X64Word = (C_x64.Word = Base.extend({
        /**
         * Initializes a newly created 64-bit word.
         *
         * @param {number} high The high 32 bits.
         * @param {number} low The low 32 bits.
         *
         * @example
         *
         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
         */
        init: function (high, low) {
          this.high = high;
          this.low = low;
        },

        /**
         * Bitwise NOTs this word.
         *
         * @return {X64Word} A new x64-Word object after negating.
         *
         * @example
         *
         *     var negated = x64Word.not();
         */
        // not: function () {
        // var high = ~this.high;
        // var low = ~this.low;

        // return X64Word.create(high, low);
        // },

        /**
         * Bitwise ANDs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to AND with this word.
         *
         * @return {X64Word} A new x64-Word object after ANDing.
         *
         * @example
         *
         *     var anded = x64Word.and(anotherX64Word);
         */
        // and: function (word) {
        // var high = this.high & word.high;
        // var low = this.low & word.low;

        // return X64Word.create(high, low);
        // },

        /**
         * Bitwise ORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to OR with this word.
         *
         * @return {X64Word} A new x64-Word object after ORing.
         *
         * @example
         *
         *     var ored = x64Word.or(anotherX64Word);
         */
        // or: function (word) {
        // var high = this.high | word.high;
        // var low = this.low | word.low;

        // return X64Word.create(high, low);
        // },

        /**
         * Bitwise XORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to XOR with this word.
         *
         * @return {X64Word} A new x64-Word object after XORing.
         *
         * @example
         *
         *     var xored = x64Word.xor(anotherX64Word);
         */
        // xor: function (word) {
        // var high = this.high ^ word.high;
        // var low = this.low ^ word.low;

        // return X64Word.create(high, low);
        // },

        /**
         * Shifts this word n bits to the left.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftL(25);
         */
        // shiftL: function (n) {
        // if (n < 32) {
        // var high = (this.high << n) | (this.low >>> (32 - n));
        // var low = this.low << n;
        // } else {
        // var high = this.low << (n - 32);
        // var low = 0;
        // }

        // return X64Word.create(high, low);
        // },

        /**
         * Shifts this word n bits to the right.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftR(7);
         */
        // shiftR: function (n) {
        // if (n < 32) {
        // var low = (this.low >>> n) | (this.high << (32 - n));
        // var high = this.high >>> n;
        // } else {
        // var low = this.high >>> (n - 32);
        // var high = 0;
        // }

        // return X64Word.create(high, low);
        // },

        /**
         * Rotates this word n bits to the left.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotL(25);
         */
        // rotL: function (n) {
        // return this.shiftL(n).or(this.shiftR(64 - n));
        // },

        /**
         * Rotates this word n bits to the right.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotR(7);
         */
        // rotR: function (n) {
        // return this.shiftR(n).or(this.shiftL(64 - n));
        // },

        /**
         * Adds this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to add with this word.
         *
         * @return {X64Word} A new x64-Word object after adding.
         *
         * @example
         *
         *     var added = x64Word.add(anotherX64Word);
         */
        // add: function (word) {
        // var low = (this.low + word.low) | 0;
        // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
        // var high = (this.high + word.high + carry) | 0;

        // return X64Word.create(high, low);
        // }
      }));

      /**
       * An array of 64-bit words.
       *
       * @property {Array} words The array of CryptoJS.x64.Word objects.
       * @property {number} sigBytes The number of significant bytes in this word array.
       */
      var X64WordArray = (C_x64.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.x64.WordArray.create();
         *
         *     var wordArray = CryptoJS.x64.WordArray.create([
         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
         *     ]);
         *
         *     var wordArray = CryptoJS.x64.WordArray.create([
         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
         *     ], 10);
         */
        init: function (words, sigBytes) {
          words = this.words = words || [];

          if (sigBytes != undefined$1) {
            this.sigBytes = sigBytes;
          } else {
            this.sigBytes = words.length * 8;
          }
        },

        /**
         * Converts this 64-bit word array to a 32-bit word array.
         *
         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
         *
         * @example
         *
         *     var x32WordArray = x64WordArray.toX32();
         */
        toX32: function () {
          // Shortcuts
          var x64Words = this.words;
          var x64WordsLength = x64Words.length;

          // Convert
          var x32Words = [];
          for (var i = 0; i < x64WordsLength; i++) {
            var x64Word = x64Words[i];
            x32Words.push(x64Word.high);
            x32Words.push(x64Word.low);
          }

          return X32WordArray.create(x32Words, this.sigBytes);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {X64WordArray} The clone.
         *
         * @example
         *
         *     var clone = x64WordArray.clone();
         */
        clone: function () {
          var clone = Base.clone.call(this);

          // Clone "words" array
          var words = (clone.words = this.words.slice(0));

          // Clone each X64Word object
          var wordsLength = words.length;
          for (var i = 0; i < wordsLength; i++) {
            words[i] = words[i].clone();
          }

          return clone;
        },
      }));
    })();

    return CryptoJS;
  });
});

var sha512 = createCommonjsModule(function (module, exports) {
  (function (root, factory, undef) {
    {
      // CommonJS
      module.exports = exports = factory(core, x64Core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    (function () {
      // Shortcuts
      var C = CryptoJS;
      var C_lib = C.lib;
      var Hasher = C_lib.Hasher;
      var C_x64 = C.x64;
      var X64Word = C_x64.Word;
      var X64WordArray = C_x64.WordArray;
      var C_algo = C.algo;

      function X64Word_create() {
        return X64Word.create.apply(X64Word, arguments);
      }

      // Constants
      var K = [
        X64Word_create(0x428a2f98, 0xd728ae22),
        X64Word_create(0x71374491, 0x23ef65cd),
        X64Word_create(0xb5c0fbcf, 0xec4d3b2f),
        X64Word_create(0xe9b5dba5, 0x8189dbbc),
        X64Word_create(0x3956c25b, 0xf348b538),
        X64Word_create(0x59f111f1, 0xb605d019),
        X64Word_create(0x923f82a4, 0xaf194f9b),
        X64Word_create(0xab1c5ed5, 0xda6d8118),
        X64Word_create(0xd807aa98, 0xa3030242),
        X64Word_create(0x12835b01, 0x45706fbe),
        X64Word_create(0x243185be, 0x4ee4b28c),
        X64Word_create(0x550c7dc3, 0xd5ffb4e2),
        X64Word_create(0x72be5d74, 0xf27b896f),
        X64Word_create(0x80deb1fe, 0x3b1696b1),
        X64Word_create(0x9bdc06a7, 0x25c71235),
        X64Word_create(0xc19bf174, 0xcf692694),
        X64Word_create(0xe49b69c1, 0x9ef14ad2),
        X64Word_create(0xefbe4786, 0x384f25e3),
        X64Word_create(0x0fc19dc6, 0x8b8cd5b5),
        X64Word_create(0x240ca1cc, 0x77ac9c65),
        X64Word_create(0x2de92c6f, 0x592b0275),
        X64Word_create(0x4a7484aa, 0x6ea6e483),
        X64Word_create(0x5cb0a9dc, 0xbd41fbd4),
        X64Word_create(0x76f988da, 0x831153b5),
        X64Word_create(0x983e5152, 0xee66dfab),
        X64Word_create(0xa831c66d, 0x2db43210),
        X64Word_create(0xb00327c8, 0x98fb213f),
        X64Word_create(0xbf597fc7, 0xbeef0ee4),
        X64Word_create(0xc6e00bf3, 0x3da88fc2),
        X64Word_create(0xd5a79147, 0x930aa725),
        X64Word_create(0x06ca6351, 0xe003826f),
        X64Word_create(0x14292967, 0x0a0e6e70),
        X64Word_create(0x27b70a85, 0x46d22ffc),
        X64Word_create(0x2e1b2138, 0x5c26c926),
        X64Word_create(0x4d2c6dfc, 0x5ac42aed),
        X64Word_create(0x53380d13, 0x9d95b3df),
        X64Word_create(0x650a7354, 0x8baf63de),
        X64Word_create(0x766a0abb, 0x3c77b2a8),
        X64Word_create(0x81c2c92e, 0x47edaee6),
        X64Word_create(0x92722c85, 0x1482353b),
        X64Word_create(0xa2bfe8a1, 0x4cf10364),
        X64Word_create(0xa81a664b, 0xbc423001),
        X64Word_create(0xc24b8b70, 0xd0f89791),
        X64Word_create(0xc76c51a3, 0x0654be30),
        X64Word_create(0xd192e819, 0xd6ef5218),
        X64Word_create(0xd6990624, 0x5565a910),
        X64Word_create(0xf40e3585, 0x5771202a),
        X64Word_create(0x106aa070, 0x32bbd1b8),
        X64Word_create(0x19a4c116, 0xb8d2d0c8),
        X64Word_create(0x1e376c08, 0x5141ab53),
        X64Word_create(0x2748774c, 0xdf8eeb99),
        X64Word_create(0x34b0bcb5, 0xe19b48a8),
        X64Word_create(0x391c0cb3, 0xc5c95a63),
        X64Word_create(0x4ed8aa4a, 0xe3418acb),
        X64Word_create(0x5b9cca4f, 0x7763e373),
        X64Word_create(0x682e6ff3, 0xd6b2b8a3),
        X64Word_create(0x748f82ee, 0x5defb2fc),
        X64Word_create(0x78a5636f, 0x43172f60),
        X64Word_create(0x84c87814, 0xa1f0ab72),
        X64Word_create(0x8cc70208, 0x1a6439ec),
        X64Word_create(0x90befffa, 0x23631e28),
        X64Word_create(0xa4506ceb, 0xde82bde9),
        X64Word_create(0xbef9a3f7, 0xb2c67915),
        X64Word_create(0xc67178f2, 0xe372532b),
        X64Word_create(0xca273ece, 0xea26619c),
        X64Word_create(0xd186b8c7, 0x21c0c207),
        X64Word_create(0xeada7dd6, 0xcde0eb1e),
        X64Word_create(0xf57d4f7f, 0xee6ed178),
        X64Word_create(0x06f067aa, 0x72176fba),
        X64Word_create(0x0a637dc5, 0xa2c898a6),
        X64Word_create(0x113f9804, 0xbef90dae),
        X64Word_create(0x1b710b35, 0x131c471b),
        X64Word_create(0x28db77f5, 0x23047d84),
        X64Word_create(0x32caab7b, 0x40c72493),
        X64Word_create(0x3c9ebe0a, 0x15c9bebc),
        X64Word_create(0x431d67c4, 0x9c100d4c),
        X64Word_create(0x4cc5d4be, 0xcb3e42b6),
        X64Word_create(0x597f299c, 0xfc657e2a),
        X64Word_create(0x5fcb6fab, 0x3ad6faec),
        X64Word_create(0x6c44198c, 0x4a475817),
      ];

      // Reusable objects
      var W = [];
      (function () {
        for (var i = 0; i < 80; i++) {
          W[i] = X64Word_create();
        }
      })();

      /**
       * SHA-512 hash algorithm.
       */
      var SHA512 = (C_algo.SHA512 = Hasher.extend({
        _doReset: function () {
          this._hash = new X64WordArray.init([
            new X64Word.init(0x6a09e667, 0xf3bcc908),
            new X64Word.init(0xbb67ae85, 0x84caa73b),
            new X64Word.init(0x3c6ef372, 0xfe94f82b),
            new X64Word.init(0xa54ff53a, 0x5f1d36f1),
            new X64Word.init(0x510e527f, 0xade682d1),
            new X64Word.init(0x9b05688c, 0x2b3e6c1f),
            new X64Word.init(0x1f83d9ab, 0xfb41bd6b),
            new X64Word.init(0x5be0cd19, 0x137e2179),
          ]);
        },

        _doProcessBlock: function (M, offset) {
          // Shortcuts
          var H = this._hash.words;

          var H0 = H[0];
          var H1 = H[1];
          var H2 = H[2];
          var H3 = H[3];
          var H4 = H[4];
          var H5 = H[5];
          var H6 = H[6];
          var H7 = H[7];

          var H0h = H0.high;
          var H0l = H0.low;
          var H1h = H1.high;
          var H1l = H1.low;
          var H2h = H2.high;
          var H2l = H2.low;
          var H3h = H3.high;
          var H3l = H3.low;
          var H4h = H4.high;
          var H4l = H4.low;
          var H5h = H5.high;
          var H5l = H5.low;
          var H6h = H6.high;
          var H6l = H6.low;
          var H7h = H7.high;
          var H7l = H7.low;

          // Working variables
          var ah = H0h;
          var al = H0l;
          var bh = H1h;
          var bl = H1l;
          var ch = H2h;
          var cl = H2l;
          var dh = H3h;
          var dl = H3l;
          var eh = H4h;
          var el = H4l;
          var fh = H5h;
          var fl = H5l;
          var gh = H6h;
          var gl = H6l;
          var hh = H7h;
          var hl = H7l;

          // Rounds
          for (var i = 0; i < 80; i++) {
            var Wil;
            var Wih;

            // Shortcut
            var Wi = W[i];

            // Extend message
            if (i < 16) {
              Wih = Wi.high = M[offset + i * 2] | 0;
              Wil = Wi.low = M[offset + i * 2 + 1] | 0;
            } else {
              // Gamma0
              var gamma0x = W[i - 15];
              var gamma0xh = gamma0x.high;
              var gamma0xl = gamma0x.low;
              var gamma0h =
                ((gamma0xh >>> 1) | (gamma0xl << 31)) ^
                ((gamma0xh >>> 8) | (gamma0xl << 24)) ^
                (gamma0xh >>> 7);
              var gamma0l =
                ((gamma0xl >>> 1) | (gamma0xh << 31)) ^
                ((gamma0xl >>> 8) | (gamma0xh << 24)) ^
                ((gamma0xl >>> 7) | (gamma0xh << 25));

              // Gamma1
              var gamma1x = W[i - 2];
              var gamma1xh = gamma1x.high;
              var gamma1xl = gamma1x.low;
              var gamma1h =
                ((gamma1xh >>> 19) | (gamma1xl << 13)) ^
                ((gamma1xh << 3) | (gamma1xl >>> 29)) ^
                (gamma1xh >>> 6);
              var gamma1l =
                ((gamma1xl >>> 19) | (gamma1xh << 13)) ^
                ((gamma1xl << 3) | (gamma1xh >>> 29)) ^
                ((gamma1xl >>> 6) | (gamma1xh << 26));

              // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
              var Wi7 = W[i - 7];
              var Wi7h = Wi7.high;
              var Wi7l = Wi7.low;

              var Wi16 = W[i - 16];
              var Wi16h = Wi16.high;
              var Wi16l = Wi16.low;

              Wil = gamma0l + Wi7l;
              Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
              Wil = Wil + gamma1l;
              Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
              Wil = Wil + Wi16l;
              Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);

              Wi.high = Wih;
              Wi.low = Wil;
            }

            var chh = (eh & fh) ^ (~eh & gh);
            var chl = (el & fl) ^ (~el & gl);
            var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
            var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

            var sigma0h =
              ((ah >>> 28) | (al << 4)) ^ ((ah << 30) | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
            var sigma0l =
              ((al >>> 28) | (ah << 4)) ^ ((al << 30) | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
            var sigma1h =
              ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
            var sigma1l =
              ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

            // t1 = h + sigma1 + ch + K[i] + W[i]
            var Ki = K[i];
            var Kih = Ki.high;
            var Kil = Ki.low;

            var t1l = hl + sigma1l;
            var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
            var t1l = t1l + chl;
            var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
            var t1l = t1l + Kil;
            var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
            var t1l = t1l + Wil;
            var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);

            // t2 = sigma0 + maj
            var t2l = sigma0l + majl;
            var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);

            // Update working variables
            hh = gh;
            hl = gl;
            gh = fh;
            gl = fl;
            fh = eh;
            fl = el;
            el = (dl + t1l) | 0;
            eh = (dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0)) | 0;
            dh = ch;
            dl = cl;
            ch = bh;
            cl = bl;
            bh = ah;
            bl = al;
            al = (t1l + t2l) | 0;
            ah = (t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0)) | 0;
          }

          // Intermediate hash value
          H0l = H0.low = H0l + al;
          H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
          H1l = H1.low = H1l + bl;
          H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
          H2l = H2.low = H2l + cl;
          H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
          H3l = H3.low = H3l + dl;
          H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
          H4l = H4.low = H4l + el;
          H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
          H5l = H5.low = H5l + fl;
          H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
          H6l = H6.low = H6l + gl;
          H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
          H7l = H7.low = H7l + hl;
          H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
        },

        _doFinalize: function () {
          // Shortcuts
          var data = this._data;
          var dataWords = data.words;

          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;

          // Add padding
          dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
          dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
          dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
          data.sigBytes = dataWords.length * 4;

          // Hash final blocks
          this._process();

          // Convert hash to 32-bit word array before returning
          var hash = this._hash.toX32();

          // Return final computed hash
          return hash;
        },

        clone: function () {
          var clone = Hasher.clone.call(this);
          clone._hash = this._hash.clone();

          return clone;
        },

        blockSize: 1024 / 32,
      }));

      /**
       * Shortcut function to the hasher's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       *
       * @return {WordArray} The hash.
       *
       * @static
       *
       * @example
       *
       *     var hash = CryptoJS.SHA512('message');
       *     var hash = CryptoJS.SHA512(wordArray);
       */
      C.SHA512 = Hasher._createHelper(SHA512);

      /**
       * Shortcut function to the HMAC's object interface.
       *
       * @param {WordArray|string} message The message to hash.
       * @param {WordArray|string} key The secret key.
       *
       * @return {WordArray} The HMAC.
       *
       * @static
       *
       * @example
       *
       *     var hmac = CryptoJS.HmacSHA512(message, key);
       */
      C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
    })();

    return CryptoJS.SHA512;
  });
});

var encHex = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
    {
      // CommonJS
      module.exports = exports = factory(core);
    }
  })(commonjsGlobal, function (CryptoJS) {
    return CryptoJS.enc.Hex;
  });
});

// var md5 = require('crypto-js/md5');
// var sha512 = require('crypto-js/sha512');
// var encHex = require('crypto-js/enc-hex');

var enc = {
  Hex: encHex,
};

var CryptoJS = {
  enc: enc,
  MD5: md5,
  SHA512: sha512,
};

function getGuid$1() {
  // # app.pubFunc.js
  return 'xxxxxxxx-xxxx-0xxx-yxyx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      var string = (Math.random() * 16) | 0;
      return string.toString(16);
    })
    .toUpperCase();
}
var util$1 = {
  ArrayBufferToBase64: function (arrayBuffer) {
    //https://gist.github.com/jonleighton/958841
    var base64 = '';
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;
    var a, b, c, d;
    var chunk;
    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
      d = chunk & 63; // 63       = 2^6 - 1
      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength];
      a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4; // 3   = 2^2 - 1
      base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
      a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2; // 15    = 2^4 - 1
      base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }
    return base64;
  },
  base64ToBlob: function (res, mime) {
    var base64 = res.replace(/^data:image\/(png|jpg);base64,/, '');
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];
    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mime });
  },
  checkBrowser: function () {
    var check = false;
    var sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf('Firefox') > -1) {
      check = true;
    } else if (sUsrAg.indexOf('Opera') > -1) {
      check = true;
    } else if (sUsrAg.indexOf('Trident') > -1) {
      check = true;
    } else if (sUsrAg.indexOf('Edge') > -1) {
      check = true;
    } else if (sUsrAg.indexOf('Chrome') > -1) {
      check = true;
    } else if (sUsrAg.indexOf('Safari') > -1) {
      check = true;
    } else {
      check = false;
    }
    return check;
  },
  checkArrRepeatVal(arr) {
    // # app.extFunc.js
    var x = arr[0];
    return arr.every(function (item) {
      return item === x;
    });
  },
  clone: function (obj) {
    if (null == obj || 'object' != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  },
  fullScreen: function () {
    // # app.extFunc.js
    // Kind of painful, but this is how it works for now
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  },
  smolScreen: function () {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },
  lockScreen: function (orientation) {
    this.fullScreen();
    window.screen.orientation.lock('portrait-primary');
  },
  getDefaultLanguage: function () {
    // # app.extFunc.js
    var defLang = navigator.language.toLowerCase().substring(0, 2);
    if (defLang == 'zh') {
      if (navigator.language.toLowerCase().substring(3) == 'cn') {
        defLang = 'cn';
      } else {
        defLang = 'tw';
      }
    } else if (defLang != 'zh' && defLang != 'en') {
      defLang = 'en';
    }
    var oPreference = store_legacy.get('preference') || {};
    oPreference.lang = oPreference.lang || defLang;
    store_legacy.set('preference', oPreference);
    return oPreference.lang;
  },
  setDefaultLanguage: function (lang) {
    // # app.extFunc.js
    var oPreference = store_legacy.get('preference') || {};
    oPreference.lang = lang;
    store_legacy.set('preference', oPreference);
  },
  getDeviceType: function (device) {
    let result = 0;
    if (typeof device != 'undefined') {
      if (device.platform == 'iOS') {
        result = 1;
      } else if (device.platform == 'Android') {
        result = 2;
      }
    }
    return result;
  },
  getGuid: getGuid$1,
  getLocation: function (callback, errorCallback) {
    // # app.extFunc.js
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(callback, errorCallback);
    }
  },
  getOS: function () {
    // http://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript
    var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;
    if (macosPlatforms.indexOf(platform) !== -1) {
      if (window['cordova']) {
        os = 'iOS';
      } else {
        os = 'Mac OS';
      }
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
    return os;
  },
  getWindowLayer: function () {
    let layer = 0;
    if (window.opener != null) {
      layer = 1;
      try {
        window.opener.$app;
      } catch (e) {
        layer = 0;
      }
      if (window.opener.window.opener != null && window.opener.$app) {
        layer = 2;
      }
    }
    return layer;
  },
  loadScript: function (script_name) {
    var url = script_name + '?' + cfg.cacheVersion;
    var body = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    body.appendChild(script);
  },
  loginPassword: function (password) {
    return CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
  },
  toJson: function (o) {
    if (check.isString(o)) {
      var o = JSON.parse(o);
    }
    return o;
  },
  md5: function (password) {
    // # app.extFunc.js
    return CryptoJS.MD5(password).toString();
  },
};

let verStr = '' + pkg.version + pkg.subVer;
let flagInstalled = false;
function install(Vue, opt = {}) {
  if (flagInstalled) {
    return;
  }
  Vue.prototype.$lib = arlib;
  cfg.vueInit(Vue);
  if (typeof arlib != 'undefined') arlib.Vue = Vue;
  flagInstalled = true;
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
function con(o) {
  console.log(o);
}
var arlib = {
  audio: Audio,
  check: check,
  comm: Comm,
  con: con,
  config: cfg,
  css: dcss,
  date: date,
  enum: enumData,
  evbus: eventBus,
  game: game,
  install: install,
  moment: hooks,
  num: num,
  path: path,
  str: str,
  syncLoader: syncLoader,
  user: user,
  util: util$1,
  CryptoJS: CryptoJS,
  Storage: store_legacy,
  version: verStr,
};

export default arlib;
