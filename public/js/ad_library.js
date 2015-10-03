(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

require("babel/polyfill");

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ["ms", "moz", "webkit", "o"];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            },
            timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

window.ads = require("bb.ads");

window.ads.init({
    kruxId: "JbcQbGqp",
    networkCode: "5262",
    breakpoints: {
        "mobile": 0,
        "ipad": 600,
        "tablet": 760,
        "small_desktop": 1020,
        "large_desktop": 1280
    }
});

window.ads
    .disableCompanionAdBackfilling();


},{"babel/polyfill":189,"bb.ads":190}],2:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator/runtime");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"core-js/shim":186,"regenerator/runtime":187}],3:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],4:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":38}],5:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments[2]
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./$.to-index":74,"./$.to-length":77,"./$.to-object":78}],6:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');
module.exports = [].fill || function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this, true)
    , length = toLength(O.length)
    , index  = toIndex(arguments[1], length)
    , end    = arguments[2]
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./$.to-index":74,"./$.to-length":77,"./$.to-object":78}],7:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length')
  , toIndex   = require('./$.to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$.to-index":74,"./$.to-iobject":76,"./$.to-length":77}],8:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./$.ctx')
  , isObject = require('./$.is-object')
  , IObject  = require('./$.iobject')
  , toObject = require('./$.to-object')
  , toLength = require('./$.to-length')
  , isArray  = require('./$.is-array')
  , SPECIES  = require('./$.wks')('species');
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var ASC = function(original, length){
  var C;
  if(isArray(original) && isObject(C = original.constructor)){
    C = C[SPECIES];
    if(C === null)C = undefined;
  } return new(C === undefined ? Array : C)(length);
};
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? ASC($this, length) : IS_FILTER ? ASC($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$.ctx":17,"./$.iobject":34,"./$.is-array":36,"./$.is-object":38,"./$.to-length":77,"./$.to-object":78,"./$.wks":81}],9:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var toObject = require('./$.to-object')
  , IObject  = require('./$.iobject')
  , enumKeys = require('./$.enum-keys')
  , has      = require('./$.has');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){   // eslint-disable-line no-unused-vars
  var T = toObject(target)
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = IObject(arguments[i++])
      , keys   = enumKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(has(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$.enum-keys":21,"./$.fails":24,"./$.has":30,"./$.iobject":34,"./$.to-object":78}],10:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":11,"./$.wks":81}],11:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],12:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , ctx          = require('./$.ctx')
  , species      = require('./$.species')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , isExtensible = Object.isExtensible || isObject
  , SUPPORT_DESC = require('./$.support-desc')
  , SIZE         = SUPPORT_DESC ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments[1], 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(SUPPORT_DESC)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    require('./$.iter-define')(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    species(C);
    species(require('./$.core')[NAME]); // for wrapper
  }
};
},{"./$":46,"./$.core":16,"./$.ctx":17,"./$.defined":19,"./$.for-of":27,"./$.has":30,"./$.hide":31,"./$.is-object":38,"./$.iter-define":42,"./$.iter-step":44,"./$.mix":51,"./$.species":64,"./$.strict-new":65,"./$.support-desc":71,"./$.uid":79}],13:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":10,"./$.for-of":27}],14:[function(require,module,exports){
'use strict';
var hide         = require('./$.hide')
  , anObject     = require('./$.an-object')
  , strictNew    = require('./$.strict-new')
  , forOf        = require('./$.for-of')
  , method       = require('./$.array-methods')
  , WEAK         = require('./$.uid')('weak')
  , isObject     = require('./$.is-object')
  , $has         = require('./$.has')
  , isExtensible = Object.isExtensible || isObject
  , find         = method(5)
  , findIndex    = method(6)
  , id           = 0;

// fallback for frozen keys
var frozenStore = function(that){
  return that._l || (that._l = new FrozenStore);
};
var FrozenStore = function(){
  this.a = [];
};
var findFrozen = function(store, key){
  return find(store.a, function(it){
    return it[0] === key;
  });
};
FrozenStore.prototype = {
  get: function(key){
    var entry = findFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findFrozen(this, key);
  },
  set: function(key, value){
    var entry = findFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = findIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = id++;      // collection id
      that._l = undefined; // leak store for frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this._i) && delete key[WEAK][this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(anObject(key))){
      frozenStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that._i] = value;
    } return that;
  },
  frozenStore: frozenStore,
  WEAK: WEAK
};
},{"./$.an-object":4,"./$.array-methods":8,"./$.for-of":27,"./$.has":30,"./$.hide":31,"./$.is-object":38,"./$.mix":51,"./$.strict-new":65,"./$.uid":79}],15:[function(require,module,exports){
'use strict';
var global     = require('./$.global')
  , $def       = require('./$.def')
  , forOf      = require('./$.for-of')
  , strictNew  = require('./$.strict-new');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    require('./$.redef')(proto, KEY,
      KEY == 'delete' ? function(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'has' ? function has(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'get' ? function get(a){ return fn.call(this, a === 0 ? 0 : a); }
      : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
      : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !require('./$.fails')(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    require('./$.mix')(C.prototype, methods);
  } else {
    var inst  = new C
      , chain = inst[ADDER](IS_WEAK ? {} : -0, 1)
      , buggyZero;
    // wrap for init collections from iterable
    if(!require('./$.iter-detect')(function(iter){ new C(iter); })){ // eslint-disable-line no-new
      C = wrapper(function(target, iterable){
        strictNew(target, C, NAME);
        var that = new Base;
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    IS_WEAK || inst.forEach(function(val, key){
      buggyZero = 1 / key === -Infinity;
    });
    // fix converting -0 key to +0
    if(buggyZero){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    // + fix .add & .set for chaining
    if(buggyZero || chain !== inst)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  require('./$.tag')(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$.def":18,"./$.fails":24,"./$.for-of":27,"./$.global":29,"./$.iter-detect":43,"./$.mix":51,"./$.redef":58,"./$.strict-new":65,"./$.tag":72}],16:[function(require,module,exports){
var core = module.exports = {version: '1.2.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],17:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":3}],18:[function(require,module,exports){
var global     = require('./$.global')
  , core       = require('./$.core')
  , hide       = require('./$.hide')
  , $redef     = require('./$.redef')
  , PROTOTYPE  = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    if(type & $def.B && own)exp = ctx(out, global);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)$redef(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
global.core = core;
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":16,"./$.global":29,"./$.hide":31,"./$.redef":58}],19:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],20:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":29,"./$.is-object":38}],21:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":46}],22:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
module.exports = Math.expm1 || function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
};
},{}],23:[function(require,module,exports){
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[require('./$.wks')('match')] = false;
      return !'/./'[KEY](re);
    } catch(e){ /* empty */ }
  } return true;
};
},{"./$.wks":81}],24:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],25:[function(require,module,exports){
'use strict';
module.exports = function(KEY, length, exec){
  var defined  = require('./$.defined')
    , SYMBOL   = require('./$.wks')(KEY)
    , original = ''[KEY];
  if(require('./$.fails')(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    require('./$.redef')(String.prototype, KEY, exec(defined, SYMBOL, original));
    require('./$.hide')(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return original.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return original.call(string, this); }
    );
  }
};
},{"./$.defined":19,"./$.fails":24,"./$.hide":31,"./$.redef":58,"./$.wks":81}],26:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./$.an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)result += 'g';
  if(that.ignoreCase)result += 'i';
  if(that.multiline)result += 'm';
  if(that.unicode)result += 'u';
  if(that.sticky)result += 'y';
  return result;
};
},{"./$.an-object":4}],27:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":4,"./$.ctx":17,"./$.is-array-iter":35,"./$.iter-call":40,"./$.to-length":77,"./core.get-iterator-method":82}],28:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toString  = {}.toString
  , toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":46,"./$.to-iobject":76}],29:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var UNDEFINED = 'undefined';
var global = module.exports = typeof window != UNDEFINED && window.Math == Math
  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],30:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],31:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.support-desc') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":46,"./$.property-desc":57,"./$.support-desc":71}],32:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":29}],33:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],34:[function(require,module,exports){
// indexed object, fallback for non-array-like ES3 strings
var cof = require('./$.cof');
module.exports = 0 in Object('z') ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":11}],35:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./$.iterators')
  , ITERATOR  = require('./$.wks')('iterator');
module.exports = function(it){
  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
};
},{"./$.iterators":45,"./$.wks":81}],36:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":11}],37:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./$.is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./$.is-object":38}],38:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],39:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./$.is-object')
  , cof      = require('./$.cof')
  , MATCH    = require('./$.wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./$.cof":11,"./$.is-object":38,"./$.wks":81}],40:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":4}],41:[function(require,module,exports){
'use strict';
var $ = require('./$')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: require('./$.property-desc')(1,next)});
  require('./$.tag')(Constructor, NAME + ' Iterator');
};
},{"./$":46,"./$.hide":31,"./$.property-desc":57,"./$.tag":72,"./$.wks":81}],42:[function(require,module,exports){
'use strict';
var LIBRARY         = require('./$.library')
  , $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , hide            = require('./$.hide')
  , has             = require('./$.has')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , Iterators       = require('./$.iterators')
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  require('./$.iter-create')(Constructor, NAME, next);
  var createMethod = function(kind){
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = require('./$').getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    require('./$.tag')(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      keys:    IS_SET            ? _default : createMethod(KEYS),
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
};
},{"./$":46,"./$.def":18,"./$.has":30,"./$.hide":31,"./$.iter-create":41,"./$.iterators":45,"./$.library":48,"./$.redef":58,"./$.tag":72,"./$.wks":81}],43:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec){
  if(!SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":81}],44:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],45:[function(require,module,exports){
module.exports = {};
},{}],46:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],47:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":46,"./$.to-iobject":76}],48:[function(require,module,exports){
module.exports = false;
},{}],49:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],50:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    if(domain)domain.enter();
    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
}

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":11,"./$.global":29,"./$.task":73}],51:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":58}],52:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (require('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * require('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":16,"./$.def":18,"./$.fails":24}],53:[function(require,module,exports){
var $         = require('./$')
  , has       = require('./$.has')
  , toIObject = require('./$.to-iobject');
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)has(O, key = keys[i++]) && result.push(isEntries ? [key, O[key]] : O[key]);
    return result;
  };
};
},{"./$":46,"./$.has":30,"./$.to-iobject":76}],54:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var $        = require('./$')
  , anObject = require('./$.an-object')
  , Reflect  = require('./$.global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = $.getNames(anObject(it))
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./$":46,"./$.an-object":4,"./$.global":29}],55:[function(require,module,exports){
'use strict';
var path      = require('./$.path')
  , invoke    = require('./$.invoke')
  , aFunction = require('./$.a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !_length)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(_length > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./$.a-function":3,"./$.invoke":33,"./$.path":56}],56:[function(require,module,exports){
module.exports = require('./$.global');
},{"./$.global":29}],57:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],58:[function(require,module,exports){
// add fake Function#toString
// for correct work wrapped methods / constructors with methods like LoDash isNative
var global    = require('./$.global')
  , hide      = require('./$.hide')
  , SRC       = require('./$.uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./$.core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  if(typeof val == 'function'){
    hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if(!('name' in val))val.name = key;
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./$.core":16,"./$.global":29,"./$.hide":31,"./$.uid":79}],59:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],60:[function(require,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],61:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line no-proto
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":46,"./$.an-object":4,"./$.ctx":17,"./$.is-object":38}],62:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":29}],63:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],64:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if(require('./$.support-desc') && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":46,"./$.support-desc":71,"./$.wks":81}],65:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],66:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":19,"./$.to-integer":75}],67:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./$.is-regexp')
  , defined  = require('./$.defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./$.defined":19,"./$.is-regexp":39}],68:[function(require,module,exports){
// https://github.com/ljharb/proposal-string-pad-left-right
var toLength = require('./$.to-length')
  , repeat   = require('./$.string-repeat')
  , defined  = require('./$.defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength)return S;
  if(fillStr == '')fillStr = ' ';
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};
},{"./$.defined":19,"./$.string-repeat":69,"./$.to-length":77}],69:[function(require,module,exports){
'use strict';
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./$.defined":19,"./$.to-integer":75}],70:[function(require,module,exports){
// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

var $def    = require('./$.def')
  , defined = require('./$.defined')
  , spaces  = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

module.exports = function(KEY, exec){
  var exp  = {};
  exp[KEY] = exec(trim);
  $def($def.P + $def.F * require('./$.fails')(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  }), 'String', exp);
};
},{"./$.def":18,"./$.defined":19,"./$.fails":24}],71:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":24}],72:[function(require,module,exports){
var has  = require('./$.has')
  , hide = require('./$.hide')
  , TAG  = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))hide(it, TAG, tag);
};
},{"./$.has":30,"./$.hide":31,"./$.wks":81}],73:[function(require,module,exports){
'use strict';
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScript){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":11,"./$.ctx":17,"./$.dom-create":20,"./$.global":29,"./$.html":32,"./$.invoke":33}],74:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./$.to-integer":75}],75:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],76:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":19,"./$.iobject":34}],77:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":75}],78:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":19}],79:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],80:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./$.wks')('unscopables');
if([][UNSCOPABLES] == undefined)require('./$.hide')(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  [][UNSCOPABLES][key] = true;
};
},{"./$.hide":31,"./$.wks":81}],81:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || require('./$.uid'))('Symbol.' + name));
};
},{"./$.global":29,"./$.shared":62,"./$.uid":79}],82:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};
},{"./$.classof":10,"./$.core":16,"./$.iterators":45,"./$.wks":81}],83:[function(require,module,exports){
'use strict';
var $                = require('./$')
  , SUPPORT_DESC     = require('./$.support-desc')
  , createDesc       = require('./$.property-desc')
  , html             = require('./$.html')
  , cel              = require('./$.dom-create')
  , has              = require('./$.has')
  , cof              = require('./$.cof')
  , $def             = require('./$.def')
  , invoke           = require('./$.invoke')
  , arrayMethod      = require('./$.array-methods')
  , IE_PROTO         = require('./$.uid')('__proto__')
  , isObject         = require('./$.is-object')
  , anObject         = require('./$.an-object')
  , aFunction        = require('./$.a-function')
  , toObject         = require('./$.to-object')
  , toIObject        = require('./$.to-iobject')
  , toInteger        = require('./$.to-integer')
  , toIndex          = require('./$.to-index')
  , toLength         = require('./$.to-length')
  , IObject          = require('./$.iobject')
  , fails            = require('./$.fails')
  , ObjectProto      = Object.prototype
  , A                = []
  , _slice           = A.slice
  , _join            = A.join
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , defineProperties = $.setDescs
  , $indexOf         = require('./$.array-includes')(false)
  , factories        = {}
  , IE8_DOM_DEFINE;

if(!SUPPORT_DESC){
  IE8_DOM_DEFINE = !fails(function(){
    return defineProperty(cel('div'), 'a', {get: function(){ return 7; }}).a != 7;
  });
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)anObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    anObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$def($def.S + $def.F * !SUPPORT_DESC, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
var createGetKeys = function(names, length){
  return function(object){
    var O      = toIObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~$indexOf(result, key) || result.push(key);
    }
    return result;
  };
};
var Empty = function(){};
$def($def.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = toObject(O);
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(typeof O.constructor == 'function' && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = anObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false)
});

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }
  return factories[len](F, args);
};

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$def($def.P, 'Function', {
  bind: function bind(that /*, args... */){
    var fn       = aFunction(this)
      , partArgs = _slice.call(arguments, 1);
    var bound = function(/* args... */){
      var args = partArgs.concat(_slice.call(arguments));
      return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
    };
    if(isObject(fn.prototype))bound.prototype = fn.prototype;
    return bound;
  }
});

// fallback for not array-like ES3 strings and DOM objects
var buggySlice = fails(function(){
  if(html)_slice.call(html);
});

$def($def.P + $def.F * buggySlice, 'Array', {
  slice: function(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return _slice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
$def($def.P + $def.F * (IObject != Object), 'Array', {
  join: function(){
    return _join.apply(IObject(this), arguments);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$def($def.S, 'Array', {isArray: require('./$.is-array')});

var createArrayReduce = function(isRight){
  return function(callbackfn, memo){
    aFunction(callbackfn);
    var O      = IObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      if(isRight ? index < 0 : length <= index){
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
};
var methodize = function($fn){
  return function(arg1/*, arg2 = undefined */){
    return $fn(this, arg1, arguments[1]);
  };
};
$def($def.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || methodize(arrayMethod(0)),
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: methodize(arrayMethod(1)),
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: methodize(arrayMethod(2)),
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: methodize(arrayMethod(3)),
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: methodize(arrayMethod(4)),
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: methodize($indexOf),
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 20.3.3.1 / 15.9.4.4 Date.now()
$def($def.S, 'Date', {now: function(){ return +new Date; }});

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS and old webkit had a broken Date implementation.
var date       = new Date(-5e13 - 1)
  , brokenDate = !(date.toISOString && date.toISOString() == '0385-07-25T07:06:39.999Z'
      && fails(function(){ new Date(NaN).toISOString(); }));
$def($def.P + $def.F * brokenDate, 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(this))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./$":46,"./$.a-function":3,"./$.an-object":4,"./$.array-includes":7,"./$.array-methods":8,"./$.cof":11,"./$.def":18,"./$.dom-create":20,"./$.fails":24,"./$.has":30,"./$.html":32,"./$.invoke":33,"./$.iobject":34,"./$.is-array":36,"./$.is-object":38,"./$.property-desc":57,"./$.support-desc":71,"./$.to-index":74,"./$.to-integer":75,"./$.to-iobject":76,"./$.to-length":77,"./$.to-object":78,"./$.uid":79}],84:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var $def = require('./$.def');

$def($def.P, 'Array', {copyWithin: require('./$.array-copy-within')});

require('./$.unscope')('copyWithin');
},{"./$.array-copy-within":5,"./$.def":18,"./$.unscope":80}],85:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $def = require('./$.def');

$def($def.P, 'Array', {fill: require('./$.array-fill')});

require('./$.unscope')('fill');
},{"./$.array-fill":6,"./$.def":18,"./$.unscope":80}],86:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var KEY    = 'findIndex'
  , $def   = require('./$.def')
  , forced = true
  , $find  = require('./$.array-methods')(6);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments[1]);
  }
});
require('./$.unscope')(KEY);
},{"./$.array-methods":8,"./$.def":18,"./$.unscope":80}],87:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var KEY    = 'find'
  , $def   = require('./$.def')
  , forced = true
  , $find  = require('./$.array-methods')(5);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments[1]);
  }
});
require('./$.unscope')(KEY);
},{"./$.array-methods":8,"./$.def":18,"./$.unscope":80}],88:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $def        = require('./$.def')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, arguments[2], 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":17,"./$.def":18,"./$.is-array-iter":35,"./$.iter-call":40,"./$.iter-detect":43,"./$.to-length":77,"./$.to-object":78,"./core.get-iterator-method":82}],89:[function(require,module,exports){
'use strict';
var setUnscope = require('./$.unscope')
  , step       = require('./$.iter-step')
  , Iterators  = require('./$.iterators')
  , toIObject  = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$.iter-define":42,"./$.iter-step":44,"./$.iterators":45,"./$.to-iobject":76,"./$.unscope":80}],90:[function(require,module,exports){
'use strict';
var $def = require('./$.def');

// WebKit Array.of isn't generic
$def($def.S + $def.F * require('./$.fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , length = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(length);
    while(length > index)result[index] = arguments[index++];
    result.length = length;
    return result;
  }
});
},{"./$.def":18,"./$.fails":24}],91:[function(require,module,exports){
require('./$.species')(Array);
},{"./$.species":64}],92:[function(require,module,exports){
'use strict';
var $             = require('./$')
  , isObject      = require('./$.is-object')
  , HAS_INSTANCE  = require('./$.wks')('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"./$":46,"./$.is-object":38,"./$.wks":81}],93:[function(require,module,exports){
var setDesc    = require('./$').setDesc
  , createDesc = require('./$.property-desc')
  , has        = require('./$.has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';
// 19.2.4.2 name
NAME in FProto || require('./$.support-desc') && setDesc(FProto, NAME, {
  configurable: true,
  get: function(){
    var match = ('' + this).match(nameRE)
      , name  = match ? match[1] : '';
    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));
    return name;
  }
});
},{"./$":46,"./$.has":30,"./$.property-desc":57,"./$.support-desc":71}],94:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments[0]); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":15,"./$.collection-strong":12}],95:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $def   = require('./$.def')
  , log1p  = require('./$.log1p')
  , sqrt   = Math.sqrt
  , $acosh = Math.acosh;

// V8 bug https://code.google.com/p/v8/issues/detail?id=3509 
$def($def.S + $def.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./$.def":18,"./$.log1p":49}],96:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $def = require('./$.def');

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

$def($def.S, 'Math', {asinh: asinh});
},{"./$.def":18}],97:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $def = require('./$.def');

$def($def.S, 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./$.def":18}],98:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $def = require('./$.def')
  , sign = require('./$.sign');

$def($def.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./$.def":18,"./$.sign":63}],99:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $def = require('./$.def');

$def($def.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./$.def":18}],100:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $def = require('./$.def')
  , exp  = Math.exp;

$def($def.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./$.def":18}],101:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $def = require('./$.def');

$def($def.S, 'Math', {expm1: require('./$.expm1')});
},{"./$.def":18,"./$.expm1":22}],102:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $def  = require('./$.def')
  , sign  = require('./$.sign')
  , pow   = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$def($def.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./$.def":18,"./$.sign":63}],103:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $def = require('./$.def')
  , abs  = Math.abs;

$def($def.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , len  = arguments.length
      , larg = 0
      , arg, div;
    while(i < len){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./$.def":18}],104:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $def = require('./$.def');

// WebKit fails with big numbers
$def($def.S + $def.F * require('./$.fails')(function(){
  return Math.imul(0xffffffff, 5) != -5;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./$.def":18,"./$.fails":24}],105:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $def = require('./$.def');

$def($def.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./$.def":18}],106:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $def = require('./$.def');

$def($def.S, 'Math', {log1p: require('./$.log1p')});
},{"./$.def":18,"./$.log1p":49}],107:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $def = require('./$.def');

$def($def.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./$.def":18}],108:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $def = require('./$.def');

$def($def.S, 'Math', {sign: require('./$.sign')});
},{"./$.def":18,"./$.sign":63}],109:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $def  = require('./$.def')
  , expm1 = require('./$.expm1')
  , exp   = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$def($def.S + $def.F * require('./$.fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./$.def":18,"./$.expm1":22,"./$.fails":24}],110:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $def  = require('./$.def')
  , expm1 = require('./$.expm1')
  , exp   = Math.exp;

$def($def.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./$.def":18,"./$.expm1":22}],111:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $def = require('./$.def');

$def($def.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./$.def":18}],112:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , global     = require('./$.global')
  , has        = require('./$.has')
  , cof        = require('./$.cof')
  , isObject   = require('./$.is-object')
  , fails      = require('./$.fails')
  , NUMBER     = 'Number'
  , $Number    = global[NUMBER]
  , Base       = $Number
  , proto      = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF = cof($.create(proto)) == NUMBER;
var toPrimitive = function(it){
  var fn, val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to number");
};
var toNumber = function(it){
  if(isObject(it))it = toPrimitive(it);
  if(typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48){
    var binary = false;
    switch(it.charCodeAt(1)){
      case 66 : case 98  : binary = true;
      case 79 : case 111 : return parseInt(it.slice(2), binary ? 2 : 8);
    }
  } return +it;
};
if(!($Number('0o1') && $Number('0b1'))){
  $Number = function Number(it){
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call(require('./$.support-desc') ? $.getNames(Base) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES6 (in case, if modules with ES6 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
    ).split(','), function(key){
      if(has(Base, key) && !has($Number, key)){
        $.setDesc($Number, key, $.getDesc(Base, key));
      }
    }
  );
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./$.redef')(global, NUMBER, $Number);
}
},{"./$":46,"./$.cof":11,"./$.fails":24,"./$.global":29,"./$.has":30,"./$.is-object":38,"./$.redef":58,"./$.support-desc":71}],113:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $def = require('./$.def');

$def($def.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./$.def":18}],114:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $def      = require('./$.def')
  , _isFinite = require('./$.global').isFinite;

$def($def.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./$.def":18,"./$.global":29}],115:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $def = require('./$.def');

$def($def.S, 'Number', {isInteger: require('./$.is-integer')});
},{"./$.def":18,"./$.is-integer":37}],116:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $def = require('./$.def');

$def($def.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./$.def":18}],117:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $def      = require('./$.def')
  , isInteger = require('./$.is-integer')
  , abs       = Math.abs;

$def($def.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./$.def":18,"./$.is-integer":37}],118:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $def = require('./$.def');

$def($def.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./$.def":18}],119:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $def = require('./$.def');

$def($def.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./$.def":18}],120:[function(require,module,exports){
// 20.1.2.12 Number.parseFloat(string)
var $def = require('./$.def');

$def($def.S, 'Number', {parseFloat: parseFloat});
},{"./$.def":18}],121:[function(require,module,exports){
// 20.1.2.13 Number.parseInt(string, radix)
var $def = require('./$.def');

$def($def.S, 'Number', {parseInt: parseInt});
},{"./$.def":18}],122:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');

$def($def.S + $def.F, 'Object', {assign: require('./$.assign')});
},{"./$.assign":9,"./$.def":18}],123:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(it) : it;
  };
});
},{"./$.is-object":38,"./$.object-sap":52}],124:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":52,"./$.to-iobject":76}],125:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./$.object-sap')('getOwnPropertyNames', function(){
  return require('./$.get-names').get;
});
},{"./$.get-names":28,"./$.object-sap":52}],126:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('getPrototypeOf', function($getPrototypeOf){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./$.object-sap":52,"./$.to-object":78}],127:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./$.is-object":38,"./$.object-sap":52}],128:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./$.is-object":38,"./$.object-sap":52}],129:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./$.is-object":38,"./$.object-sap":52}],130:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = require('./$.def');
$def($def.S, 'Object', {
  is: require('./$.same')
});
},{"./$.def":18,"./$.same":60}],131:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":52,"./$.to-object":78}],132:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;
  };
});
},{"./$.is-object":38,"./$.object-sap":52}],133:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(it) : it;
  };
});
},{"./$.is-object":38,"./$.object-sap":52}],134:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":18,"./$.set-proto":61}],135:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./$.classof')
  , test    = {};
test[require('./$.wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./$.redef')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./$.classof":10,"./$.redef":58,"./$.wks":81}],136:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $def       = require('./$.def')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same')
  , species    = require('./$.species')
  , SPECIES    = require('./$.wks')('species')
  , RECORD     = require('./$.uid')('record')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.support-desc')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var isPromise = function(it){
  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
};
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    this[RECORD] = record;
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var S = anObject(anObject(this).constructor)[SPECIES];
      var react = {
        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
        fail: typeof onRejected == 'function'  ? onRejected  : false
      };
      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
        react.res = res;
        react.rej = rej;
      });
      aFunction(react.res);
      aFunction(react.rej);
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
require('./$.tag')(P, PROMISE);
species(P);
species(Wrapper = require('./$.core')[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new this(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"./$":46,"./$.a-function":3,"./$.an-object":4,"./$.classof":10,"./$.core":16,"./$.ctx":17,"./$.def":18,"./$.for-of":27,"./$.global":29,"./$.is-object":38,"./$.iter-detect":43,"./$.library":48,"./$.microtask":50,"./$.mix":51,"./$.same":60,"./$.set-proto":61,"./$.species":64,"./$.strict-new":65,"./$.support-desc":71,"./$.tag":72,"./$.uid":79,"./$.wks":81}],137:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $def   = require('./$.def')
  , _apply = Function.apply;

$def($def.S, 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  }
});
},{"./$.def":18}],138:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $         = require('./$')
  , $def      = require('./$.def')
  , aFunction = require('./$.a-function')
  , anObject  = require('./$.an-object')
  , isObject  = require('./$.is-object')
  , bind      = Function.bind || require('./$.core').Function.prototype.bind;

// MS Edge supports only 2 arguments
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
$def($def.S + $def.F * require('./$.fails')(function(){
  function F(){}
  return !(Reflect.construct(function(){}, [], F) instanceof F);
}), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      if(args != undefined)switch(anObject(args).length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./$":46,"./$.a-function":3,"./$.an-object":4,"./$.core":16,"./$.def":18,"./$.fails":24,"./$.is-object":38}],139:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var $        = require('./$')
  , $def     = require('./$.def')
  , anObject = require('./$.an-object');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$def($def.S + $def.F * require('./$.fails')(function(){
  Reflect.defineProperty($.setDesc({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$":46,"./$.an-object":4,"./$.def":18,"./$.fails":24}],140:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $def     = require('./$.def')
  , getDesc  = require('./$').getDesc
  , anObject = require('./$.an-object');

$def($def.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = getDesc(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./$":46,"./$.an-object":4,"./$.def":18}],141:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $def     = require('./$.def')
  , anObject = require('./$.an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./$.iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$def($def.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./$.an-object":4,"./$.def":18,"./$.iter-create":41}],142:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var $        = require('./$')
  , $def     = require('./$.def')
  , anObject = require('./$.an-object');

$def($def.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(anObject(target), propertyKey);
  }
});
},{"./$":46,"./$.an-object":4,"./$.def":18}],143:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $def     = require('./$.def')
  , getProto = require('./$').getProto
  , anObject = require('./$.an-object');

$def($def.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./$":46,"./$.an-object":4,"./$.def":18}],144:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var $        = require('./$')
  , has      = require('./$.has')
  , $def     = require('./$.def')
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = $.getDesc(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = $.getProto(target)))return get(proto, propertyKey, receiver);
}

$def($def.S, 'Reflect', {get: get});
},{"./$":46,"./$.an-object":4,"./$.def":18,"./$.has":30,"./$.is-object":38}],145:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $def = require('./$.def');

$def($def.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./$.def":18}],146:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $def          = require('./$.def')
  , anObject      = require('./$.an-object')
  , $isExtensible = Object.isExtensible;

$def($def.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./$.an-object":4,"./$.def":18}],147:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $def = require('./$.def');

$def($def.S, 'Reflect', {ownKeys: require('./$.own-keys')});
},{"./$.def":18,"./$.own-keys":54}],148:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $def               = require('./$.def')
  , anObject           = require('./$.an-object')
  , $preventExtensions = Object.preventExtensions;

$def($def.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.an-object":4,"./$.def":18}],149:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $def     = require('./$.def')
  , setProto = require('./$.set-proto');

if(setProto)$def($def.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.def":18,"./$.set-proto":61}],150:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var $          = require('./$')
  , has        = require('./$.has')
  , $def       = require('./$.def')
  , createDesc = require('./$.property-desc')
  , anObject   = require('./$.an-object')
  , isObject   = require('./$.is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = $.getDesc(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = $.getProto(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = $.getDesc(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    $.setDesc(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$def($def.S, 'Reflect', {set: set});
},{"./$":46,"./$.an-object":4,"./$.def":18,"./$.has":30,"./$.is-object":38,"./$.property-desc":57}],151:[function(require,module,exports){
var $        = require('./$')
  , global   = require('./$.global')
  , isRegExp = require('./$.is-regexp')
  , $flags   = require('./$.flags')
  , $RegExp  = global.RegExp
  , Base     = $RegExp
  , proto    = $RegExp.prototype
  , re1      = /a/g
  , re2      = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW = new $RegExp(re1) !== re1;

if(require('./$.support-desc') && (!CORRECT_NEW || require('./$.fails')(function(){
  re2[require('./$.wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !(this instanceof $RegExp) && piRE && p.constructor === $RegExp && fiU ? p
      : CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f);
  };
  $.each.call($.getNames(Base), function(key){
    key in $RegExp || $.setDesc($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  });
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./$.redef')(global, 'RegExp', $RegExp);
}

require('./$.species')($RegExp);
},{"./$":46,"./$.fails":24,"./$.flags":26,"./$.global":29,"./$.is-regexp":39,"./$.redef":58,"./$.species":64,"./$.support-desc":71,"./$.wks":81}],152:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
var $ = require('./$');
if(require('./$.support-desc') && /./g.flags != 'g')$.setDesc(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./$.flags')
});
},{"./$":46,"./$.flags":26,"./$.support-desc":71}],153:[function(require,module,exports){
// @@match logic
require('./$.fix-re-wks')('match', 1, function(defined, MATCH){
  // 21.1.3.11 String.prototype.match(regexp)
  return function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  };
});
},{"./$.fix-re-wks":25}],154:[function(require,module,exports){
// @@replace logic
require('./$.fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  };
});
},{"./$.fix-re-wks":25}],155:[function(require,module,exports){
// @@search logic
require('./$.fix-re-wks')('search', 1, function(defined, SEARCH){
  // 21.1.3.15 String.prototype.search(regexp)
  return function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  };
});
},{"./$.fix-re-wks":25}],156:[function(require,module,exports){
// @@split logic
require('./$.fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  // 21.1.3.17 String.prototype.split(separator, limit)
  return function split(separator, limit){
    'use strict';
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined
      ? fn.call(separator, O, limit)
      : $split.call(String(O), separator, limit);
  };
});
},{"./$.fix-re-wks":25}],157:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments[0]); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":15,"./$.collection-strong":12}],158:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(false);
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.def":18,"./$.string-at":66}],159:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $def      = require('./$.def')
  , toLength  = require('./$.to-length')
  , context   = require('./$.string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$def($def.P + $def.F * require('./$.fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments[1]
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./$.def":18,"./$.fails-is-regexp":23,"./$.string-context":67,"./$.to-length":77}],160:[function(require,module,exports){
var $def    = require('./$.def')
  , toIndex = require('./$.to-index')
  , fromCharCode = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res = []
      , len = arguments.length
      , i   = 0
      , code;
    while(len > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$.def":18,"./$.to-index":74}],161:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $def     = require('./$.def')
  , context  = require('./$.string-context')
  , INCLUDES = 'includes';

$def($def.P + $def.F * require('./$.fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments[1]);
  }
});
},{"./$.def":18,"./$.fails-is-regexp":23,"./$.string-context":67}],162:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":42,"./$.string-at":66}],163:[function(require,module,exports){
var $def      = require('./$.def')
  , toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length');

$def($def.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl = toIObject(callSite.raw)
      , len = toLength(tpl.length)
      , sln = arguments.length
      , res = []
      , i   = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < sln)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./$.def":18,"./$.to-iobject":76,"./$.to-length":77}],164:[function(require,module,exports){
var $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.def":18,"./$.string-repeat":69}],165:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $def        = require('./$.def')
  , toLength    = require('./$.to-length')
  , context     = require('./$.string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$def($def.P + $def.F * require('./$.fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments[1], that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./$.def":18,"./$.fails-is-regexp":23,"./$.string-context":67,"./$.to-length":77}],166:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./$.string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./$.string-trim":70}],167:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , SUPPORT_DESC   = require('./$.support-desc')
  , $def           = require('./$.def')
  , $redef         = require('./$.redef')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setTag         = require('./$.tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isObject       = require('./$.is-object')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = SUPPORT_DESC && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  SUPPORT_DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments[0]));
  };
  $redef($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(SUPPORT_DESC && !require('./$.library')){
    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

// MS Edge converts symbol values to JSON as {}
if(!useNative || $fails(function(){
  return JSON.stringify([$Symbol()]) != '[null]';
}))$redef($Symbol.prototype, 'toJSON', function toJSON(){
  if(useNative && isObject(this))return this;
});

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
    'species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), function(it){
    var sym = wks(it);
    symbolStatics[it] = useNative ? sym : wrap(sym);
  }
);

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag(global.JSON, 'JSON', true);
},{"./$":46,"./$.an-object":4,"./$.def":18,"./$.enum-keys":21,"./$.fails":24,"./$.get-names":28,"./$.global":29,"./$.has":30,"./$.is-object":38,"./$.keyof":47,"./$.library":48,"./$.property-desc":57,"./$.redef":58,"./$.shared":62,"./$.support-desc":71,"./$.tag":72,"./$.to-iobject":76,"./$.uid":79,"./$.wks":81}],168:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , weak         = require('./$.collection-weak')
  , isObject     = require('./$.is-object')
  , has          = require('./$.has')
  , frozenStore  = weak.frozenStore
  , WEAK         = weak.WEAK
  , isExtensible = Object.isExtensible || isObject
  , tmp          = {};

// 23.3 WeakMap Objects
var $WeakMap = require('./$.collection')('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments[0]); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return frozenStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this._i];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    require('./$.redef')(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = frozenStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./$":46,"./$.collection":15,"./$.collection-weak":14,"./$.has":30,"./$.is-object":38,"./$.redef":58}],169:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments[0]); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":15,"./$.collection-weak":14}],170:[function(require,module,exports){
'use strict';
var $def      = require('./$.def')
  , $includes = require('./$.array-includes')(true);
$def($def.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments[1]);
  }
});
require('./$.unscope')('includes');
},{"./$.array-includes":7,"./$.def":18,"./$.unscope":80}],171:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def');

$def($def.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":13,"./$.def":18}],172:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $def     = require('./$.def')
  , $entries = require('./$.object-to-array')(true);

$def($def.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./$.def":18,"./$.object-to-array":53}],173:[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $          = require('./$')
  , $def       = require('./$.def')
  , ownKeys    = require('./$.own-keys')
  , toIObject  = require('./$.to-iobject')
  , createDesc = require('./$.property-desc');

$def($def.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , setDesc = $.setDesc
      , getDesc = $.getDesc
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key, D;
    while(keys.length > i){
      D = getDesc(O, key = keys[i++]);
      if(key in result)setDesc(result, key, createDesc(0, D));
      else result[key] = D;
    } return result;
  }
});
},{"./$":46,"./$.def":18,"./$.own-keys":54,"./$.property-desc":57,"./$.to-iobject":76}],174:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $def    = require('./$.def')
  , $values = require('./$.object-to-array')(false);

$def($def.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./$.def":18,"./$.object-to-array":53}],175:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $def = require('./$.def')
  , $re  = require('./$.replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');
$def($def.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./$.def":18,"./$.replacer":59}],176:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def');

$def($def.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":13,"./$.def":18}],177:[function(require,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(true);
$def($def.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.def":18,"./$.string-at":66}],178:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  padLeft: function padLeft(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments[1], true);
  }
});
},{"./$.def":18,"./$.string-pad":68}],179:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  padRight: function padRight(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments[1], false);
  }
});
},{"./$.def":18,"./$.string-pad":68}],180:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
});
},{"./$.string-trim":70}],181:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
});
},{"./$.string-trim":70}],182:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $def    = require('./$.def')
  , $Array  = require('./$.core').Array || Array
  , statics = {};
var setStatics = function(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = require('./$.ctx')(Function.call, [][key], length);
  });
};
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill');
$def($def.S, 'Array', statics);
},{"./$":46,"./$.core":16,"./$.ctx":17,"./$.def":18}],183:[function(require,module,exports){
require('./es6.array.iterator');
var global      = require('./$.global')
  , hide        = require('./$.hide')
  , Iterators   = require('./$.iterators')
  , ITERATOR    = require('./$.wks')('iterator')
  , NL          = global.NodeList
  , HTC         = global.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype
  , ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
if(NL && !(ITERATOR in NLProto))hide(NLProto, ITERATOR, ArrayValues);
if(HTC && !(ITERATOR in HTCProto))hide(HTCProto, ITERATOR, ArrayValues);
},{"./$.global":29,"./$.hide":31,"./$.iterators":45,"./$.wks":81,"./es6.array.iterator":89}],184:[function(require,module,exports){
var $def  = require('./$.def')
  , $task = require('./$.task');
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.def":18,"./$.task":73}],185:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./$.global')
  , $def       = require('./$.def')
  , invoke     = require('./$.invoke')
  , partial    = require('./$.partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$def($def.G + $def.B + $def.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./$.def":18,"./$.global":29,"./$.invoke":33,"./$.partial":55}],186:[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.number.constructor');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.iterator');
require('./modules/es6.array.species');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-left');
require('./modules/es7.string.pad-right');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$.core');
},{"./modules/$.core":16,"./modules/es5":83,"./modules/es6.array.copy-within":84,"./modules/es6.array.fill":85,"./modules/es6.array.find":87,"./modules/es6.array.find-index":86,"./modules/es6.array.from":88,"./modules/es6.array.iterator":89,"./modules/es6.array.of":90,"./modules/es6.array.species":91,"./modules/es6.function.has-instance":92,"./modules/es6.function.name":93,"./modules/es6.map":94,"./modules/es6.math.acosh":95,"./modules/es6.math.asinh":96,"./modules/es6.math.atanh":97,"./modules/es6.math.cbrt":98,"./modules/es6.math.clz32":99,"./modules/es6.math.cosh":100,"./modules/es6.math.expm1":101,"./modules/es6.math.fround":102,"./modules/es6.math.hypot":103,"./modules/es6.math.imul":104,"./modules/es6.math.log10":105,"./modules/es6.math.log1p":106,"./modules/es6.math.log2":107,"./modules/es6.math.sign":108,"./modules/es6.math.sinh":109,"./modules/es6.math.tanh":110,"./modules/es6.math.trunc":111,"./modules/es6.number.constructor":112,"./modules/es6.number.epsilon":113,"./modules/es6.number.is-finite":114,"./modules/es6.number.is-integer":115,"./modules/es6.number.is-nan":116,"./modules/es6.number.is-safe-integer":117,"./modules/es6.number.max-safe-integer":118,"./modules/es6.number.min-safe-integer":119,"./modules/es6.number.parse-float":120,"./modules/es6.number.parse-int":121,"./modules/es6.object.assign":122,"./modules/es6.object.freeze":123,"./modules/es6.object.get-own-property-descriptor":124,"./modules/es6.object.get-own-property-names":125,"./modules/es6.object.get-prototype-of":126,"./modules/es6.object.is":130,"./modules/es6.object.is-extensible":127,"./modules/es6.object.is-frozen":128,"./modules/es6.object.is-sealed":129,"./modules/es6.object.keys":131,"./modules/es6.object.prevent-extensions":132,"./modules/es6.object.seal":133,"./modules/es6.object.set-prototype-of":134,"./modules/es6.object.to-string":135,"./modules/es6.promise":136,"./modules/es6.reflect.apply":137,"./modules/es6.reflect.construct":138,"./modules/es6.reflect.define-property":139,"./modules/es6.reflect.delete-property":140,"./modules/es6.reflect.enumerate":141,"./modules/es6.reflect.get":144,"./modules/es6.reflect.get-own-property-descriptor":142,"./modules/es6.reflect.get-prototype-of":143,"./modules/es6.reflect.has":145,"./modules/es6.reflect.is-extensible":146,"./modules/es6.reflect.own-keys":147,"./modules/es6.reflect.prevent-extensions":148,"./modules/es6.reflect.set":150,"./modules/es6.reflect.set-prototype-of":149,"./modules/es6.regexp.constructor":151,"./modules/es6.regexp.flags":152,"./modules/es6.regexp.match":153,"./modules/es6.regexp.replace":154,"./modules/es6.regexp.search":155,"./modules/es6.regexp.split":156,"./modules/es6.set":157,"./modules/es6.string.code-point-at":158,"./modules/es6.string.ends-with":159,"./modules/es6.string.from-code-point":160,"./modules/es6.string.includes":161,"./modules/es6.string.iterator":162,"./modules/es6.string.raw":163,"./modules/es6.string.repeat":164,"./modules/es6.string.starts-with":165,"./modules/es6.string.trim":166,"./modules/es6.symbol":167,"./modules/es6.weak-map":168,"./modules/es6.weak-set":169,"./modules/es7.array.includes":170,"./modules/es7.map.to-json":171,"./modules/es7.object.entries":172,"./modules/es7.object.get-own-property-descriptors":173,"./modules/es7.object.values":174,"./modules/es7.regexp.escape":175,"./modules/es7.set.to-json":176,"./modules/es7.string.at":177,"./modules/es7.string.pad-left":178,"./modules/es7.string.pad-right":179,"./modules/es7.string.trim-left":180,"./modules/es7.string.trim-right":181,"./modules/js.array.statics":182,"./modules/web.dom.iterable":183,"./modules/web.immediate":184,"./modules/web.timers":185}],187:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);

    generator._invoke = makeInvokeMethod(
      innerFn, self || null,
      new Context(tryLocsList || [])
    );

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      var enqueueResult =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(function() {
          return invoke(method, arg);
        }) : new Promise(function(resolve) {
          resolve(invoke(method, arg));
        });

      // Avoid propagating enqueueResult failures to Promises returned by
      // later invocations of the iterator.
      previousPromise = enqueueResult["catch"](function(ignored){});

      return enqueueResult;
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":212}],188:[function(require,module,exports){
module.exports = require("./lib/polyfill");

},{"./lib/polyfill":2}],189:[function(require,module,exports){
module.exports = require("babel-core/polyfill");

},{"babel-core/polyfill":188}],190:[function(require,module,exports){
/*! bb.ads.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _gptGPT = require("./gpt/GPT");

var _gptGPT2 = _interopRequireDefault(_gptGPT);

var _kruxKrux = require("./krux/Krux");

var _kruxKrux2 = _interopRequireDefault(_kruxKrux);

var _communicationPostMessages = require("./communication/PostMessages");

var _communicationPostMessages2 = _interopRequireDefault(_communicationPostMessages);

var _renderingRenderer = require("./rendering/Renderer");

var _renderingRenderer2 = _interopRequireDefault(_renderingRenderer);

var _viewabilityViewability = require("./viewability/Viewability");

var _viewabilityViewability2 = _interopRequireDefault(_viewabilityViewability);

var _viewabilityVisibility = require("./viewability/Visibility");

var _viewabilityVisibility2 = _interopRequireDefault(_viewabilityVisibility);

var _utilIdentity = require("./util/identity");

var _utilIdentity2 = _interopRequireDefault(_utilIdentity);

var _debugAdDebugRegistry = require("./debug/AdDebugRegistry");

var _debugAdDebugRegistry2 = _interopRequireDefault(_debugAdDebugRegistry);

var adCodeDecoratorFunction;
var destroyables;
var gpt;
var krux;
var postMessages;
var renderer;
var viewability;
var visibility;
var adDebugRegistry;

var SET_IFRAME_HEIGHT_METHOD = "setIframeHeight";
var SET_IFRAME_DIMENSIONS_METHOD = "setIframeDimensions";

var composeFunctions = function composeFunctions(listOfFunctions, initialValue) {
    return listOfFunctions.reduce(function (oldValue, newFunction) {
        return newFunction(oldValue);
    }, initialValue);
};

var makeSetIframeHeightListenerFor = function makeSetIframeHeightListenerFor(ad) {
    return function (_ref) {
        var height = _ref.height;
        return ad.setHeight(height);
    };
};
var makeSetIframeDimensionsListenerFor = function makeSetIframeDimensionsListenerFor(ad) {
    return function (_ref2) {
        var width = _ref2.width;
        var height = _ref2.height;
        return ad.setDimensions(width, height);
    };
};

/**
 * Root interface and orchestrator for bb.ads
 *
 * @namespace Ads
 */
var Ads = {

    /**
     * Initialize bb.ads
     *
     * @method
     * @returns {Ads}
     */
    init: function init(_ref3) {
        var networkCode = _ref3.networkCode;
        var kruxId = _ref3.kruxId;
        var breakpoints = _ref3.breakpoints;
        var _ref3$adCodeDecorator = _ref3.adCodeDecorator;
        var adCodeDecorator = _ref3$adCodeDecorator === undefined ? _utilIdentity2["default"] : _ref3$adCodeDecorator;

        adCodeDecoratorFunction = adCodeDecorator;
        gpt = new _gptGPT2["default"](networkCode);
        krux = new _kruxKrux2["default"](kruxId);
        postMessages = new _communicationPostMessages2["default"]();
        viewability = new _viewabilityViewability2["default"](breakpoints);
        visibility = new _viewabilityVisibility2["default"]();
        renderer = new _renderingRenderer2["default"](gpt, viewability, visibility);
        adDebugRegistry = new _debugAdDebugRegistry2["default"]();

        destroyables = [gpt, postMessages, visibility, renderer, adDebugRegistry];

        this.setTargeting("kuid", krux.getUserId()).setTargeting("ksg", krux.getSegments()).setTargeting("khost", krux.getHost());
    },

    /**
     * Destructor
     *
     * @method
     */
    destroy: function destroy() {
        destroyables.forEach(function (destroyable) {
            return destroyable.destroy();
        });
    },

    /**
     * Get and create GPT Publisher Ad
     *
     * @method
     * @param {object} config
     * @param {string} config.containerId
     * @param {string} config.adCode
     * @param {number[]} config.sizes
     * @param {object} config.targeting
     * @param {number} config.viewportOffset
     * @returns {Ad}
     */
    createAd: function createAd(_ref4) {
        var containerId = _ref4.containerId;
        var adCode = _ref4.adCode;
        var dimensions = _ref4.dimensions;
        var targeting = _ref4.targeting;
        var strategy = _ref4.strategy;
        var _ref4$viewportOffset = _ref4.viewportOffset;
        var viewportOffset = _ref4$viewportOffset === undefined ? 0 : _ref4$viewportOffset;
        var _ref4$targetingModifiers = _ref4.targetingModifiers;
        var targetingModifiers = _ref4$targetingModifiers === undefined ? [] : _ref4$targetingModifiers;

        if (!(containerId && adCode && dimensions)) {
            throw new Error("bb.ads#createAd requires containerId, adCode and dimensions " + containerId + ", " + adCode + ", " + dimensions);
        }

        var newTargeting = composeFunctions(targetingModifiers, targeting);
        var ad = gpt.createAd(containerId, adCodeDecoratorFunction(adCode), viewability.getSizes(dimensions), newTargeting).setViewportOffset(viewportOffset);

        adDebugRegistry.push(ad);

        postMessages.addEventListener(ad.getId(), SET_IFRAME_HEIGHT_METHOD, makeSetIframeHeightListenerFor(ad));
        postMessages.addEventListener(ad.getId(), SET_IFRAME_DIMENSIONS_METHOD, makeSetIframeDimensionsListenerFor(ad));

        renderer.render(ad, { strategy: strategy });

        return ad;
    },

    /**
     * Disable companion ad backfilling of unfilled slots
     *
     * @method
     * @param {boolean} value
     * @returns {Ads}
     */
    disableCompanionAdBackfilling: function disableCompanionAdBackfilling() {
        gpt.setRefreshUnfilledSlots(false);
        return this;
    },

    /**
     * Enable companion ad backfilling of unfilled slots
     *
     * @method
     * @param {boolean} value
     * @returns {Ads}
     */
    enableCompanionAdBackfilling: function enableCompanionAdBackfilling() {
        gpt.setRefreshUnfilledSlots(true);
        return this;
    },

    /**
     * Inform GPT that video ads will be present on the page
     *
     * @method
     * @returns {Ads}
     */
    enableVideoAds: function enableVideoAds() {
        gpt.enableVideoAds();
        return this;
    },

    /**
     * Refresh a collection of ads
     * https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_refresh
     *
     * @method
     * @param [Ad[]] ads - List of Ads to refresh
     */
    refresh: function refresh(ads) {
        gpt.refresh(ads);
    },

    /**
     * App-level targeting
     *
     * @method
     * @param {string} name
     * @param {string} value
     * @returns {object}
     * @returns {Ads}
     */
    setTargeting: function setTargeting(name, value) {
        gpt.setTargeting(name, value);
        return this;
    },

    /**
     * Update GPT correlator value
     * https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_updateCorrelator
     *
     * @method
     * @returns {Ads}
     */
    updateCorrelator: function updateCorrelator() {
        gpt.updateCorrelator();
        return this;
    },

    /**
     * Get the krux user segment
     *
     * @method
     * @returns {string}
     */
    getKruxUser: function getKruxUser() {
        return krux.getUserId();
    },

    showDebugInformation: function showDebugInformation() {
        adDebugRegistry.showDebugInformation();
        return this;
    }

};

exports["default"] = Ads;
module.exports = exports["default"];
},{"./communication/PostMessages":191,"./debug/AdDebugRegistry":193,"./gpt/GPT":195,"./krux/Krux":197,"./rendering/Renderer":200,"./util/identity":207,"./viewability/Viewability":209,"./viewability/Visibility":210}],191:[function(require,module,exports){
/*! PostMessages.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilEnvironment = require("../util/Environment");

var _utilEnvironment2 = _interopRequireDefault(_utilEnvironment);

var CONTEXTIFY_CALLBACKS = Symbol("contextifyCallbacks");
var DELEGATE_EVENTS = Symbol("delegateEvents");
var DISPATCH_EVENT_LISTENERS = Symbol("dispatchEventListners");
var LISTENERS = Symbol("listeners");
var UNDELEGATE_EVENTS = Symbol("undelegateEvents");
var WINDOW = Symbol("window");

var MESSAGE_EVENT = "message";

var isAnObject = function isAnObject(something) {
    return typeof something === "object";
};

var destringify = function destringify(something) {
    try {
        return JSON.parse(something);
    } catch (error) {
        return {};
    }
};

var destructureEvent = function destructureEvent(event) {
    var data = isAnObject(event.data) ? event.data : destringify(event.data);

    return {
        data: data,
        id: data.id || data.windowId,
        method: data.method
    };
};

/**
 * Façade for registering listeners to messages posted to window
 *
 * @class
 */

var PostMessages = (function () {

    /**
     * @constructs PostMessages
     */

    function PostMessages() {
        _classCallCheck(this, PostMessages);

        this[LISTENERS] = {};
        this[WINDOW] = _utilEnvironment2["default"].getWindow();

        this[CONTEXTIFY_CALLBACKS]();
        this[DELEGATE_EVENTS]();
    }

    /**
     * Bind methods to self for use as callbacks
     *
     * @private
     * @method
     */

    _createClass(PostMessages, [{
        key: CONTEXTIFY_CALLBACKS,
        value: function value() {
            this[DISPATCH_EVENT_LISTENERS] = this[DISPATCH_EVENT_LISTENERS].bind(this);
        }

        /**
         * Registers global event listener for message event
         *
         * @private
         * @method
         */
    }, {
        key: DELEGATE_EVENTS,
        value: function value() {
            if (this[WINDOW]) {
                this[WINDOW].addEventListener(MESSAGE_EVENT, this[DISPATCH_EVENT_LISTENERS]);
            }
        }

        /**
         * Dispatches callbacks with method and id from event data
         *
         * @private
         * @method
         * @param {MessageEvent} event
         */
    }, {
        key: DISPATCH_EVENT_LISTENERS,
        value: function value(event) {
            var _destructureEvent = destructureEvent(event);

            var data = _destructureEvent.data;
            var id = _destructureEvent.id;
            var method = _destructureEvent.method;

            var callbacks = (this[LISTENERS][id] ? this[LISTENERS][id][method] : []) || [];
            callbacks.forEach(function (callback) {
                return callback(data);
            });
        }

        /**
         * Tears down global event listener for visibility change
         *
         * @private
         * @method
         */
    }, {
        key: UNDELEGATE_EVENTS,
        value: function value() {
            if (this[WINDOW]) {
                this[WINDOW].removeEventListener(MESSAGE_EVENT, this[DISPATCH_EVENT_LISTENERS]);
            }
        }

        /**
         * Destructor
         *
         * @method
         */
    }, {
        key: "destroy",
        value: function destroy() {
            this[UNDELEGATE_EVENTS]();
            this[LISTENERS] = {};
        }

        /**
         * Add post message listener to id and method
         *
         * @method
         * @param {string} id
         * @param {string} method
         * @param {function} callback
         * @example
         * postMessages.addEventListener("1", "setIframeHeight", function(data) {
         *     iframe.setAttribute("height", data.height);
         * });
         */
    }, {
        key: "addEventListener",
        value: function addEventListener(id, method, callback) {
            var listenersForId = this[LISTENERS][id] = this[LISTENERS][id] || {};
            listenersForId[method] = listenersForId[method] || [];
            listenersForId[method].push(callback);
        }

        /**
         * Remove post message listener from id and method
         *
         * @method
         * @param {string} id
         * @param {string} method
         * @param {function} callback
         * @example
         * postMessages.removeEventListener("1", "setIframeHeight", setIframeHeight);
         */
    }, {
        key: "removeEventListener",
        value: function removeEventListener(id, method, callback) {
            var listenersForId = this[LISTENERS][id];

            if (listenersForId && listenersForId[method]) {
                listenersForId[method] = listenersForId[method].filter(function (item) {
                    return item !== callback;
                });
            }
        }
    }]);

    return PostMessages;
})();

exports["default"] = PostMessages;
module.exports = exports["default"];
},{"../util/Environment":202}],192:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilOverlayer = require("../util/Overlayer");

var _utilOverlayer2 = _interopRequireDefault(_utilOverlayer);

var formatTimestamp = function formatTimestamp(ts) {
    return Math.floor(ts) + "ms";
};

var LIST_STYLE = "list-style-type: disc; padding-left: 20px";

function unrenderedMessage() {
    return ["GPT render event not received for this ad.", "Either the request has not been sent out or", "the response has not yet been received."].join("<br/>");
}

function renderMessage(ad, event, startTime) {
    if (!event) {
        return unrenderedMessage();
    }

    var renderTime = ad.getRenderTime();
    var timeSinceStart = formatTimestamp(renderTime - startTime);
    var requestResponseTime = formatTimestamp(renderTime - ad.getRequestTime());

    return ["AdCode " + ad.getUnitName(), "Creative ID " + event.getCreativeId(), "Line Item ID " + event.getLineItemId(), "Empty? " + (event.isEmpty() ? "Yes" : "No"), "Time since start " + timeSinceStart, "Request-response time " + requestResponseTime].join("<br>");
}

function targetingList(targeting) {
    return Object.keys(targeting).reduce(function (output, key) {
        return output + ("<li>" + key + " " + targeting[key] + "</li>");
    }, "<ul style=\"" + LIST_STYLE + "\">") + "</ul>";
}

/**
 * @class AdDebug
 *
 */

var AdDebug = (function () {
    function AdDebug() {
        _classCallCheck(this, AdDebug);
    }

    _createClass(AdDebug, null, [{
        key: "show",

        /**
         * Shows debug information for a particular ad
         *
         * @method
         * @static
         * @param {number} startTime
         * @param {Ad} ad
         */
        value: function show(startTime, ad) {
            var adElement = ad.getElement();
            var adWasRemovedFromDom = !adElement;

            if (!ad.isDisplayable() || adWasRemovedFromDom) {
                return;
            }

            var slotRenderedEvent = ad.getSlotRenderedEvent();
            var content = renderMessage(ad, slotRenderedEvent, startTime) + targetingList(ad.getTargeting());
            var empty = !slotRenderedEvent || slotRenderedEvent.isEmpty();

            _utilOverlayer2["default"].overlay({ content: content, adElement: adElement, empty: empty });
        }
    }]);

    return AdDebug;
})();

exports["default"] = AdDebug;
module.exports = exports["default"];
},{"../util/Overlayer":204}],193:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilEnvironment = require("../util/Environment");

var _utilEnvironment2 = _interopRequireDefault(_utilEnvironment);

var _AdDebug = require("./AdDebug");

var _AdDebug2 = _interopRequireDefault(_AdDebug);

var _utilCurry = require("../util/curry");

var _utilCurry2 = _interopRequireDefault(_utilCurry);

var _utilOverlayer = require("../util/Overlayer");

var _utilOverlayer2 = _interopRequireDefault(_utilOverlayer);

var REGISTERED_ADS = Symbol("registeredAds");
var START_TIME = Symbol("startTime");

/**
 * @class AdDebugRegistry
 */

var AdDebugRegistry = (function () {

  /**
   * @constructs AdDebugRegistry
   *
   */

  function AdDebugRegistry() {
    _classCallCheck(this, AdDebugRegistry);

    this[REGISTERED_ADS] = [];
    this[START_TIME] = _utilEnvironment2["default"].currentTime();
  }

  /**
   * Add an Ad to the registry for debugging
   *
   * @param {Ad} ad
   * @method
   */

  _createClass(AdDebugRegistry, [{
    key: "push",
    value: function push(ad) {
      this[REGISTERED_ADS].push(ad);
    }

    /**
     * Displays debug information for all registered ads
     *
     * @method
     */
  }, {
    key: "showDebugInformation",
    value: function showDebugInformation() {
      _utilOverlayer2["default"].clearOverlays();

      this[REGISTERED_ADS].forEach((0, _utilCurry2["default"])(_AdDebug2["default"].show, this[START_TIME]));
    }

    /**
     * Clears the list of registered ads
     *
     * @method
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this[REGISTERED_ADS].length = 0;
    }
  }]);

  return AdDebugRegistry;
})();

exports["default"] = AdDebugRegistry;
module.exports = exports["default"];
},{"../util/Environment":202,"../util/Overlayer":204,"../util/curry":206,"./AdDebug":192}],194:[function(require,module,exports){
/*! Ad.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _md5Jkmyers = require("md5-jkmyers");

var _md5Jkmyers2 = _interopRequireDefault(_md5Jkmyers);

var _utilEnvironment = require("../util/Environment");

var _utilEnvironment2 = _interopRequireDefault(_utilEnvironment);

var _utilCurry = require("../util/curry");

var _utilCurry2 = _interopRequireDefault(_utilCurry);

var _SlotRenderEndedEvent = require("./SlotRenderEndedEvent");

var _SlotRenderEndedEvent2 = _interopRequireDefault(_SlotRenderEndedEvent);

var CONTEXTIFY_CALLBACKS = Symbol("contextifyCallbacks");
var EMPTY_CALLBACKS = Symbol("emptyCallbacks");
var ID = Symbol("id");
var RENDER_CONTAINER = Symbol("renderContainer");
var RENDER_CALLBACKS = Symbol("renderCallbacks");
var SET_ID = Symbol("setId");
var SIZES = Symbol("sizes");
var SLOT = Symbol("slot");
var TARGETING = Symbol("targeting");
var UNIT_NAME = Symbol("unitName");
var VIEWPORT_OFFSET = Symbol("viewportOffset");
var REQUEST_TIME = Symbol("requestTime");
var RENDER_TIME = Symbol("renderTime");
var SLOT_RENDERED_EVENT = Symbol("slotRenderedEvent");

var AD_ELEMENT_CLASS = "bb-ads__ad";
var RENDERED_CLASS = "bb-ads__rendered";
var EMPTY_CLASS = "bb-ads__empty";

var isEmpty = function isEmpty(_ref) {
    var _isEmpty = _ref.isEmpty;
    return _isEmpty;
};

var isOneByOne = function isOneByOne(_ref2) {
    var _ref2$size = _ref2.size;
    var size = _ref2$size === undefined ? [] : _ref2$size;

    var _size = _slicedToArray(size, 2);

    var first = _size[0];
    var second = _size[1];

    return first === 1 && second === 1;
};

/**
 * @class Ad
 */

var Ad = (function () {

    /**
     * @constructs Ad
     * @param {string} containerId
     * @param {string} unit
     * @param {number[]} sizes
     * @param {object} [targeting={}]
     * @example
     * var ad = new Ad(
     *     "myid",
     *     "/1234/travel/asia/food",
     *     [[468, 60], [728, 90], [300, 250]],
     *     { custom: "targeting" }
     * );
     */

    function Ad(containerId, unitName, sizes) {
        var targeting = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

        _classCallCheck(this, Ad);

        this[UNIT_NAME] = unitName;
        this[SIZES] = sizes;
        this[TARGETING] = targeting;
        this[SLOT] = null;
        this[RENDER_CALLBACKS] = [];
        this[EMPTY_CALLBACKS] = [];
        this[VIEWPORT_OFFSET] = 0;
        this[RENDER_TIME] = null;
        this[SLOT_RENDERED_EVENT] = null;

        this[CONTEXTIFY_CALLBACKS]();
        this[SET_ID]();
        this[RENDER_CONTAINER](containerId);

        this.onRender((0, _utilCurry2["default"])(this.setClassName, RENDERED_CLASS));
        this.onEmpty((0, _utilCurry2["default"])(this.setClassName, EMPTY_CLASS));
    }

    /**
     * Bind methods to self for use as callbacks
     *
     * @private
     * @method
     */

    _createClass(Ad, [{
        key: CONTEXTIFY_CALLBACKS,
        value: function value() {
            this.setClassName = this.setClassName.bind(this);
        }

        /**
         * Computes unique id from sizes, targeting, and unit name
         *
         * @private
         * @method
         */
    }, {
        key: SET_ID,
        value: function value() {
            var idComponents = [this[SIZES], this[TARGETING], this[UNIT_NAME]];

            this[ID] = (0, _md5Jkmyers2["default"])(JSON.stringify(idComponents));
        }

        /**
         * Creates and appends ad element to self
         *
         * @param {string} containerId
         *
         * @private
         * @method
         */
    }, {
        key: RENDER_CONTAINER,
        value: function value(containerId) {
            var _document = _utilEnvironment2["default"].getDocument();

            if (!_document) {
                return;
            }

            var container = _document.getElementById(containerId);

            if (!container) {
                throw new Error("Ad container did not exist for id " + containerId);
            }

            var adElement = _document.createElement("div");

            adElement.setAttribute("class", AD_ELEMENT_CLASS);
            adElement.setAttribute("id", this[ID]);
            container.appendChild(adElement);
            container = null;
            adElement = null;
        }

        /**
         * @method
         * @returns {string}
         */
    }, {
        key: "getDomId",
        value: function getDomId() {
            return this[SLOT] ? this[SLOT].getSlotId().getDomId() : null;
        }

        /**
         * @method
         * @returns {string}
         */
    }, {
        key: "getId",
        value: function getId() {
            return this[ID];
        }

        /**
         * @method
         * @returns {number[]}
         */
    }, {
        key: "getSizes",
        value: function getSizes() {
            return this[SIZES];
        }

        /**
         * @method
         * @returns {boolean}
         */
    }, {
        key: "isDisplayable",
        value: function isDisplayable() {
            return !!this[SIZES].length;
        }

        /**
         * @method
         * @returns {googletag.Slot}
         */
    }, {
        key: "getSlot",
        value: function getSlot() {
            return this[SLOT];
        }

        /**
         * @method
         * @returns {object}
         */
    }, {
        key: "getTargeting",
        value: function getTargeting() {
            return Object.assign({}, this[TARGETING], {
                pmid: this.getId()
            });
        }

        /**
         * @method
         * @returns {?DOMElement}
         */
    }, {
        key: "getElement",
        value: function getElement() {
            var _document = _utilEnvironment2["default"].getDocument();
            return _document.getElementById(this[ID]);
        }

        /**
         * Get iframe element containing the ad
         * The iframe containing the ad is the one that is visible, i.e. has a non-null offset parent
         *
         * @method
         * @returns {?DOMElement}
         */
    }, {
        key: "getIframe",
        value: function getIframe() {
            var element = this.getElement();
            var iframes = element ? element.getElementsByTagName("iframe") : [];

            return Array.prototype.filter.call(iframes, function (iframe) {
                return !!iframe.offsetParent;
            })[0] || null;
        }

        /**
         * @method
         * @returns {string}
         */
    }, {
        key: "getUnitName",
        value: function getUnitName() {
            return this[UNIT_NAME];
        }

        /**
         * @method
         * @returns {boolean}
         */
    }, {
        key: "hasSlot",
        value: function hasSlot() {
            return !!this[SLOT];
        }

        /**
         * Sets height of ad's elements
         *
         * @method
         * @param {number} height
         * @returns {Ad}
         */
    }, {
        key: "setHeight",
        value: function setHeight(height) {
            var iframe = this.getIframe();

            if (iframe) {
                iframe.setAttribute("height", height);
                iframe = null;
            }

            return this;
        }

        /**
         * Sets dimensions of ad's elements
         *
         * @method
         * @param {number} width
         * @param {number} height
         * @returns {Ad}
         */
    }, {
        key: "setDimensions",
        value: function setDimensions(width, height) {
            var iframe = this.getIframe();

            if (iframe) {
                iframe.setAttribute("width", width);
                iframe.setAttribute("height", height);
                iframe = null;
            }

            return this;
        }

        /**
         * Set's class of underlying element
         *
         * @method
         * @param {string} className
         * @returns {Ad}
         */
    }, {
        key: "setClassName",
        value: function setClassName(className) {
            var element = this.getElement();

            if (element) {
                var elementClasses = element.getAttribute("class");
                element.setAttribute("class", elementClasses + " " + className);
                element = null;
            }

            return this;
        }

        /**
         * Sets slot
         *
         * @method
         * @param {googletag.Slot} slot
         * @returns {Ad}
         */
    }, {
        key: "setSlot",
        value: function setSlot(slot) {
            this[SLOT] = slot;

            return this;
        }

        /**
         * Sets the viewport offset
         *
         * @method
         * @param {number} viewportOffset
         * @returns {Ad}
         */
    }, {
        key: "setViewportOffset",
        value: function setViewportOffset(viewportOffset) {
            this[VIEWPORT_OFFSET] = viewportOffset;

            return this;
        }

        /**
         * Get viewport offset
         *
         * @method
         * @returns {number}
         */
    }, {
        key: "getViewportOffset",
        value: function getViewportOffset() {
            return this[VIEWPORT_OFFSET];
        }

        /**
        * Sets the GPT request start time
        *
        * @method
        * @param {DOMHighResTimeStamp} requestTime
        */
    }, {
        key: "setRequestTime",
        value: function setRequestTime(requestTime) {
            this[REQUEST_TIME] = requestTime;
        }

        /**
          * Get GPT request start time
          *
          * @method
          * @returns {DOMHighResTimeStamp,}
          */
    }, {
        key: "getRequestTime",
        value: function getRequestTime() {
            return this[REQUEST_TIME];
        }

        /**
          * Get GPT render time
          *
          * @method
          * @returns {DOMHighResTimeStamp,}
          */
    }, {
        key: "getRenderTime",
        value: function getRenderTime() {
            return this[RENDER_TIME];
        }

        /**
          * Get SlotRenderEndedEvent
          *
          * @method
          * @returns {SlotRenderEndedEvent}
          */
    }, {
        key: "getSlotRenderedEvent",
        value: function getSlotRenderedEvent() {
            return this[SLOT_RENDERED_EVENT];
        }

        /**
         * Executes callback when the ad has been rendered and is not empty
         *
         * @method
         * @param {function} callback function
         * @returns {Ad}
         */
    }, {
        key: "onRender",
        value: function onRender(callback) {
            this[RENDER_CALLBACKS].push(callback);
            return this;
        }

        /**
         * Executes callback when the ad was served with an empty response. Empty
         * refers to a lack of inventory for ads targeting
         *
         * @method
         * @param {function} callback function
         * @returns {Ad}
         */
    }, {
        key: "onEmpty",
        value: function onEmpty(callback) {
            this[EMPTY_CALLBACKS].push(callback);
            return this;
        }

        /**
         * Delegates a rendering event to the appropriate event listeners based on
         * the event being empty or not
         *
         * @method
         * @param {googletag.events.SlotRenderEndedEvent} event
         */
    }, {
        key: "handleSlotRenderEvent",
        value: function handleSlotRenderEvent(event) {
            var useEmptyCallbacks = isEmpty(event) || isOneByOne(event);
            var callbacks = useEmptyCallbacks ? this[EMPTY_CALLBACKS] : this[RENDER_CALLBACKS];
            this[RENDER_TIME] = _utilEnvironment2["default"].currentTime();

            var slotRenderEndedEvent = this[SLOT_RENDERED_EVENT] = new _SlotRenderEndedEvent2["default"]({
                id: this.getId(),
                adCode: this.getUnitName(),
                requestTime: this.getRequestTime(),
                event: event
            });

            callbacks.forEach(function (callback) {
                return callback(slotRenderEndedEvent);
            });

            this[EMPTY_CALLBACKS].length = 0;
            this[RENDER_CALLBACKS].length = 0;
        }
    }]);

    return Ad;
})();

exports["default"] = Ad;
module.exports = exports["default"];
},{"../util/Environment":202,"../util/curry":206,"./SlotRenderEndedEvent":196,"md5-jkmyers":211}],195:[function(require,module,exports){
/*! GPT.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Ad = require("./Ad");

var _Ad2 = _interopRequireDefault(_Ad);

var _utilEnvironment = require("../util/Environment");

var _utilEnvironment2 = _interopRequireDefault(_utilEnvironment);

var _utilScript = require("../util/Script");

var _utilScript2 = _interopRequireDefault(_utilScript);

var CACHED_SLOTS = Symbol("cachedSlots");
var CONTEXTIFY_CALLBACKS = Symbol("contextualizeCallbacks");
var DEFINE_SLOT = Symbol("defineSlot");
var DISPLAY = Symbol("display");
var GET_RENDERED_AD = Symbol("getRenderedAd");
var GOOGLETAG = Symbol("googletag");
var HANDLE_SLOT_RENDER_EVENT = Symbol("handleSlotRenderEvent");
var LISTEN_TO_SLOT_RENDER_EVENTS = Symbol("listenToSlotRenderEvents");
var LOAD_GPT = Symbol("loadGpt");
var NETWORK_CODE = Symbol("networkCode");
var REFRESH_SLOTS = Symbol("refreshSlots");
var RENDERED_ADS = Symbol("renderedAds");
var RENDER_CACHED_SLOT = Symbol("renderCachedSlot");
var STORE_RENDERED_AD = Symbol("storeRenderedAd");
var UNSTORE_RENDERED_AD = Symbol("unstoreRenderedAd");
var WINDOW = Symbol("window");

var GPT_SRC = "//www.googletagservices.com/tag/js/gpt.js";
var SLOT_RENDER_EVENT = "slotRenderEnded";

var SERVICES = {
    pubads: "pubads",
    companionAds: "companionAds"
};

/**
 * @class GPT
 */

var GPT = (function () {

    /**
     * Initializes GPT
     *
     * @method
     * @param {string} networkCode
     * @param {?googletag} googletag
     */

    function GPT(networkCode) {
        var googletag = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, GPT);

        this[CACHED_SLOTS] = {};
        this[NETWORK_CODE] = networkCode;
        this[GOOGLETAG] = googletag;
        this[WINDOW] = _utilEnvironment2["default"].getWindow();
        this[RENDERED_ADS] = {};
        this.services = SERVICES;

        this[CONTEXTIFY_CALLBACKS]();
        this[LOAD_GPT]();
        this[LISTEN_TO_SLOT_RENDER_EVENTS]();
    }

    /**
     * Binds various callback methods to `this`
     *
     * @private
     * @method
     */

    _createClass(GPT, [{
        key: CONTEXTIFY_CALLBACKS,
        value: function value() {
            this[HANDLE_SLOT_RENDER_EVENT] = this[HANDLE_SLOT_RENDER_EVENT].bind(this);
        }

        /**
         * Defines slot for an ad
         *
         * @private
         * @method
         * @param {Ad} ad
         */
    }, {
        key: DEFINE_SLOT,
        value: function value(ad) {
            var _this = this;

            var services = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            var slot = this[GOOGLETAG].defineSlot(ad.getUnitName(), ad.getSizes(), ad.getId());

            if (!slot) {
                return;
            }

            var targeting = ad.getTargeting();

            ad.setSlot(slot);

            Object.keys(targeting).forEach(function (name) {
                return slot.setTargeting(name, targeting[name]);
            });
            services.forEach(function (service) {
                return slot.addService(_this[GOOGLETAG][service]());
            });

            this[CACHED_SLOTS][ad.getId()] = slot;
        }

        /**
         * Displays an ad
         *
         * @private
         * @method
         * @param {Ad} ad
         */
    }, {
        key: DISPLAY,
        value: function value(ad) {
            this[GOOGLETAG].display(ad.getDomId());
        }

        /**
         * Get ad from rendered ads store for use in rendered/empty callbacks
         *
         * @private
         * @method
         * @param {string} domId
         * @returns {Ad}
         */
    }, {
        key: GET_RENDERED_AD,
        value: function value(domId) {
            return this[RENDERED_ADS][domId] || null;
        }

        /**
         * Dispatches rendering events to the correct Ad and removes from unrendered ad registry
         *
         * @method
         * @private
         * @param {googletag.events.SlotRenderEndedEvent} event
         */
    }, {
        key: HANDLE_SLOT_RENDER_EVENT,
        value: function value(event) {
            var ad = this[GET_RENDERED_AD](event.slot.getSlotId().getDomId());

            if (ad) {
                ad.handleSlotRenderEvent(event);
                this[UNSTORE_RENDERED_AD](ad);
            }
        }

        /**
         * Binds listener to GPT's slot render event
         *
         * @private
         * @method
         */
    }, {
        key: LISTEN_TO_SLOT_RENDER_EVENTS,
        value: function value() {
            var _this2 = this;

            this.enqueue(function () {
                Object.keys(SERVICES).forEach(function (service) {
                    _this2[GOOGLETAG][service]().addEventListener(SLOT_RENDER_EVENT, _this2[HANDLE_SLOT_RENDER_EVENT]);
                });
            });
        }

        /**
         * Loads GPT
         *
         * @private
         * @method
         */
    }, {
        key: LOAD_GPT,
        value: function value() {
            if (this[GOOGLETAG] || !this[WINDOW]) {
                return;
            }

            this[GOOGLETAG] = this[WINDOW].googletag = {
                cmd: []
            };

            _utilScript2["default"].load({
                src: GPT_SRC
            });
        }

        /**
         * Refresh slots
         *
         * @private
         * @method
         */
    }, {
        key: REFRESH_SLOTS,
        value: function value(slots) {
            this[GOOGLETAG].pubads().refresh(slots);
            this[GOOGLETAG].companionAds().refresh(slots);
        }

        /**
         * Refreshes the cached slot for an ad if it exists
         * Returns true if successful, false if not
         *
         * @private
         * @method
         * @param {Ad} ad
         * @returns {boolean}
         */
    }, {
        key: RENDER_CACHED_SLOT,
        value: function value(ad) {
            var slot = this[CACHED_SLOTS][ad.getId()];

            if (!slot) {
                return false;
            }

            ad.setSlot(slot);
            this[STORE_RENDERED_AD](ad);
            this[REFRESH_SLOTS]([slot]);

            return true;
        }

        /**
         * Stores a reference to rendered ad for render/empty callbacks
         *
         * @private
         * @method
         * @param {Ad} ad
         */
    }, {
        key: STORE_RENDERED_AD,
        value: function value(ad) {
            this[RENDERED_ADS][ad.getDomId()] = ad;
        }

        /**
         * Removes reference to rendered ad
         *
         * @private
         * @method
         * @param {Ad} ad
         */
    }, {
        key: UNSTORE_RENDERED_AD,
        value: function value(ad) {
            this[RENDERED_ADS][ad.getDomId()] = null;
        }

        /**
         * Factory method for GPT Ad
         *
         * @param {string} containerId
         * @param {string} adCode
         * @param {number[]} sizes
         * @param {object} targeting
         * @returns {Ad}
         */
    }, {
        key: "createAd",
        value: function createAd(containerId, adCode, sizes, targeting) {
            return new _Ad2["default"](containerId, "/" + this[NETWORK_CODE] + "/" + adCode, sizes, targeting);
        }

        /**
         * Renders the ad
         * https://developers.google.com/doubleclick-gpt/reference#googletag.defineSlot
         * https://developers.google.com/doubleclick-gpt/reference#googletag.display
         * https://developers.google.com/doubleclick-gpt/reference#googletag.enableServices
         *
         * @method
         * @param {Ad} ad
         * @param {object} config
         * @param {string[]} [config.services=[]]
         * @param {boolean} [config.display=true]
         */
    }, {
        key: "render",
        value: function render(ad, _ref) {
            var _this3 = this;

            var _ref$services = _ref.services;
            var services = _ref$services === undefined ? [] : _ref$services;
            var _ref$display = _ref.display;
            var display = _ref$display === undefined ? true : _ref$display;

            this.enqueue(function () {
                ad.setRequestTime(_utilEnvironment2["default"].currentTime());

                var cached = _this3[RENDER_CACHED_SLOT](ad);

                if (cached) {
                    return;
                }

                _this3[DEFINE_SLOT](ad, services);
                _this3[GOOGLETAG].enableServices();

                if (display) {
                    _this3[DISPLAY](ad);
                }

                _this3[STORE_RENDERED_AD](ad);
            });
        }

        /**
         * Enables single request mode for fetching multiple ads at the same time.
         * https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_enableSingleRequest
         *
         * @method
         */
    }, {
        key: "enableSingleRequest",
        value: function enableSingleRequest() {
            var _this4 = this;

            this.enqueue(function () {
                return _this4[GOOGLETAG].pubads().enableSingleRequest();
            });
        }

        /**
         * Inform GPT that video ads will be present on the page
         * https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_enableVideoAds
         *
         * @method
         */
    }, {
        key: "enableVideoAds",
        value: function enableVideoAds() {
            var _this5 = this;

            this.enqueue(function () {
                return _this5[GOOGLETAG].pubads().enableVideoAds();
            });
        }

        /**
         * Push callback to GPT
         *
         * @method
         * @param {function} cb
         */
    }, {
        key: "enqueue",
        value: function enqueue(cb) {
            this[GOOGLETAG].cmd.push(cb);
        }

        /**
         * Refresh a list of ads
         * https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_refresh
         *
         * @method
         * @param [Ad[]] ads - List of Ads to refresh
         */
    }, {
        key: "refresh",
        value: function refresh(ads) {
            var _this6 = this;

            var slots = ads.filter(function (ad) {
                return ad.hasSlot();
            }).map(function (ad) {
                return ad.getSlot();
            });

            if (slots.length) {
                this.enqueue(function () {
                    return _this6[REFRESH_SLOTS](slots);
                });
            }
        }

        /**
         * Enable/disable companion ad backfilling of unfilled slots
         *
         * @method
         * @param {boolean} value
         */
    }, {
        key: "setRefreshUnfilledSlots",
        value: function setRefreshUnfilledSlots(value) {
            var _this7 = this;

            this.enqueue(function () {
                return _this7[GOOGLETAG].companionAds().setRefreshUnfilledSlots(value);
            });
        }

        /**
         * Page-level targeting
         * https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_setTargeting
         *
         * @method
         * @param {string} name
         * @param {string} value
         */
    }, {
        key: "setTargeting",
        value: function setTargeting(name, value) {
            var _this8 = this;

            this.enqueue(function () {
                return _this8[GOOGLETAG].pubads().setTargeting(name, value);
            });
        }

        /**
         * Update correlator value
         * https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_updateCorrelator
         *
         * @method
         */
    }, {
        key: "updateCorrelator",
        value: function updateCorrelator() {
            var _this9 = this;

            this.enqueue(function () {
                return _this9[GOOGLETAG].pubads().updateCorrelator();
            });
        }

        /**
         * Cleans up references to ads
         *
         * @method
         */
    }, {
        key: "destroy",
        value: function destroy() {
            this[CACHED_SLOTS] = {};
            this[RENDERED_ADS] = {};
            this[GOOGLETAG] = {};
            this[WINDOW] = null;
        }
    }]);

    return GPT;
})();

exports["default"] = GPT;
module.exports = exports["default"];
},{"../util/Environment":202,"../util/Script":205,"./Ad":194}],196:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AD_ID = Symbol("adId");
var AD_CODE = Symbol("adCode");
var LINE_ITEM_ID = Symbol("lineItemId");
var CREATIVE_ID = Symbol("creativeId");
var IS_EMPTY = Symbol("isEmpty");
var AD_REQUEST_START_TIME = Symbol("adRequestStartTime");

/**
 * Façade for GPT Ad render event.
 *
 * @class SlotRenderEndedEvent
 */

var SlotRenderEndedEvent = (function () {

  /**
   * @constructs SlotRenderEndedEvent
   * @param {google.tags.SlotRenderEndedEvent} event
   * @param {Ad} ad
   */

  function SlotRenderEndedEvent(_ref) {
    var id = _ref.id;
    var adCode = _ref.adCode;
    var requestTime = _ref.requestTime;
    var _ref$event = _ref.event;
    var event = _ref$event === undefined ? {} : _ref$event;

    _classCallCheck(this, SlotRenderEndedEvent);

    var lineItemId = event.lineItemId;
    var creativeId = event.creativeId;
    var isEmpty = event.isEmpty;

    this[LINE_ITEM_ID] = lineItemId;
    this[CREATIVE_ID] = creativeId;
    this[IS_EMPTY] = isEmpty;
    this[AD_ID] = id;
    this[AD_CODE] = adCode;
    this[AD_REQUEST_START_TIME] = requestTime;
  }

  /**
   * @method
   * @returns {string}
   */

  _createClass(SlotRenderEndedEvent, [{
    key: "getAdId",
    value: function getAdId() {
      return this[AD_ID];
    }

    /**
     * @method
     * @returns {string}
     */
  }, {
    key: "getAdCode",
    value: function getAdCode() {
      return this[AD_CODE];
    }

    /**
     * @method
     * @returns {string}
     */
  }, {
    key: "getLineItemId",
    value: function getLineItemId() {
      return this[LINE_ITEM_ID];
    }

    /**
     * @method
     * @returns {string}
     */
  }, {
    key: "getCreativeId",
    value: function getCreativeId() {
      return this[CREATIVE_ID];
    }

    /**
     * @method
     * @returns {boolean}
     */
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this[IS_EMPTY];
    }

    /**
     * Get GPT request start time
     *
     * @method
     * @returns {Date}
     */
  }, {
    key: "getRequestTime",
    value: function getRequestTime() {
      return this[AD_REQUEST_START_TIME];
    }
  }]);

  return SlotRenderEndedEvent;
})();

exports["default"] = SlotRenderEndedEvent;
module.exports = exports["default"];
},{}],197:[function(require,module,exports){
/*! Krux.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilScript = require("../util/Script");

var _utilScript2 = _interopRequireDefault(_utilScript);

var _utilEnvironment = require("../util/Environment");

var _utilEnvironment2 = _interopRequireDefault(_utilEnvironment);

var _utilLocalStorage = require("../util/LocalStorage");

var _utilLocalStorage2 = _interopRequireDefault(_utilLocalStorage);

var KRUX_ID = Symbol("kruxId");
var LOCAL_STORAGE = Symbol("localStorage");
var LOAD_KRUX = Symbol("loadKrux");
var INIT_QUEUE = Symbol("initQueue");

var KRUX_ID_KEY = "data-id";
var KRUX_TIMING_KEY = "data-timing";
var KRUX_VERSION_KEY = "data-version";
var KRUX_NAMESPACE = "kx";

/**
 * @class Krux
 */

var Krux = (function () {

    /**
     * @constructs Krux
     * @param {string} kruxId
     * @example
     * new Krux("1234");
     */

    function Krux(kruxId) {
        _classCallCheck(this, Krux);

        this[KRUX_ID] = kruxId;
        this[LOCAL_STORAGE] = _utilLocalStorage2["default"].create(KRUX_NAMESPACE);
        this[LOAD_KRUX]();
        this[INIT_QUEUE]();
    }

    /**
     * Exposed for unit testing
     */

    _createClass(Krux, [{
        key: "getLocalStorage",
        value: function getLocalStorage() {
            return this[LOCAL_STORAGE];
        }

        /**
         * @method
         * @returns {string}
         */
    }, {
        key: "getUserId",
        value: function getUserId() {
            return this[LOCAL_STORAGE].get("user");
        }

        /**
         * @method
         * @returns {string[]}
         */
    }, {
        key: "getSegments",
        value: function getSegments() {
            var segments = this[LOCAL_STORAGE].get("segs");

            return segments ? segments.split(",") : [];
        }

        /**
         * @method
         * @returns {string}
         */
    }, {
        key: "getHost",
        value: function getHost() {
            return _utilEnvironment2["default"].getHostUri();
        }

        /**
        * Set up the Krux global variable
        *
        * @private
        * @method
        */
    }, {
        key: INIT_QUEUE,
        value: function value() {
            var _window = _utilEnvironment2["default"].getWindow();

            if (!(_window && _window.Krux)) {
                return;
            }

            _window.Krux = function () {
                _window.Krux.q.push(arguments);
            };

            _window.Krux.q = [];
        }

        /**
         * Load the Krux script
         *
         * @private
         * @method
         */
    }, {
        key: LOAD_KRUX,
        value: function value() {
            var _Script$load;

            _utilScript2["default"].load((_Script$load = {
                src: "//cdn.krxd.net/controltag?confid=" + this[KRUX_ID]
            }, _defineProperty(_Script$load, KRUX_ID_KEY, this[KRUX_ID]), _defineProperty(_Script$load, KRUX_TIMING_KEY, "async"), _defineProperty(_Script$load, KRUX_VERSION_KEY, "1.9"), _Script$load));
        }
    }]);

    return Krux;
})();

exports["default"] = Krux;
module.exports = exports["default"];
},{"../util/Environment":202,"../util/LocalStorage":203,"../util/Script":205}],198:[function(require,module,exports){
/*! AlwaysRenderRenderingStrategy.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GPT = Symbol("gpt");
var SERVICES = Symbol("services");

/**
 * Always render ad
 *
 * @class
 */

var AlwaysRenderRenderingStrategy = (function () {

    /**
    * @constructs WhenInViewportRenderingStrategy
    */

    function AlwaysRenderRenderingStrategy(gpt) {
        _classCallCheck(this, AlwaysRenderRenderingStrategy);

        this[GPT] = gpt;
        this[SERVICES] = [gpt.services.pubads];
    }

    /**
     * Add the ad to the set of unrendered ads and start the state machine
     *
     * @method
     * @param {Ad} ad
     */

    _createClass(AlwaysRenderRenderingStrategy, [{
        key: "render",
        value: function render(ad) {
            if (ad.isDisplayable()) {
                this[GPT].render(ad, { services: this[SERVICES] });
            }
        }
    }]);

    return AlwaysRenderRenderingStrategy;
})();

exports["default"] = AlwaysRenderRenderingStrategy;
module.exports = exports["default"];
},{}],199:[function(require,module,exports){
/*! CompanionAdRenderingStrategy.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GPT = Symbol("gpt");
var SERVICES = Symbol("services");

/**
 * Always render ad
 *
 * @class
 */

var CompanionAdRenderingStrategy = (function () {

    /**
     * @constructs WhenInViewportRenderingStrategy
     */

    function CompanionAdRenderingStrategy(gpt) {
        _classCallCheck(this, CompanionAdRenderingStrategy);

        this[GPT] = gpt;
        this[SERVICES] = [gpt.services.pubads, gpt.services.companionAds];
    }

    /**
     * Add the ad to the set of unrendered ads and start the state machine
     *
     * @method
     * @param {Ad} ad
     */

    _createClass(CompanionAdRenderingStrategy, [{
        key: "render",
        value: function render(ad) {
            if (ad.isDisplayable()) {
                this[GPT].render(ad, { display: false, services: this[SERVICES] });
            }
        }
    }]);

    return CompanionAdRenderingStrategy;
})();

exports["default"] = CompanionAdRenderingStrategy;
module.exports = exports["default"];
},{}],200:[function(require,module,exports){
/*! Renderer.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _AlwaysRenderRenderingStrategy = require("./AlwaysRenderRenderingStrategy");

var _AlwaysRenderRenderingStrategy2 = _interopRequireDefault(_AlwaysRenderRenderingStrategy);

var _CompanionAdRenderingStrategy = require("./CompanionAdRenderingStrategy");

var _CompanionAdRenderingStrategy2 = _interopRequireDefault(_CompanionAdRenderingStrategy);

var _WhenInViewportRenderingStrategy = require("./WhenInViewportRenderingStrategy");

var _WhenInViewportRenderingStrategy2 = _interopRequireDefault(_WhenInViewportRenderingStrategy);

var CONTEXTIFY_CALLBACKS = Symbol("contextifyCallbacks");
var DELEGATE_EVENTS = Symbol("delegateEvents");
var GPT = Symbol("gpt");
var INIT_STRATEGIES = Symbol("initStrategies");
var START = Symbol("start");
var STOP = Symbol("stop");
var STRATEGIES = Symbol("strategies");
var UNDELEGATE_EVENTS = Symbol("undelegateEvents");
var VIEWABILITY = Symbol("viewability");
var VISIBILITY = Symbol("visibility");

/**
 * Responsible for rendering all ads
 *
 * @class
 */

var Renderer = (function () {

    /**
     * @constructs Renderer
     */

    function Renderer(gpt, viewability, visibility) {
        var strategies = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

        _classCallCheck(this, Renderer);

        this[GPT] = gpt;
        this[VIEWABILITY] = viewability;
        this[VISIBILITY] = visibility;
        this[STRATEGIES] = strategies;

        this[CONTEXTIFY_CALLBACKS]();
        this[INIT_STRATEGIES]();
        this[DELEGATE_EVENTS]();

        if (this[VISIBILITY].isVisible()) {
            this[START]();
        }
    }

    /**
     * Binds various callback methods to `this`
     *
     * @private
     * @method
     */

    _createClass(Renderer, [{
        key: CONTEXTIFY_CALLBACKS,
        value: function value() {
            this[START] = this[START].bind(this);
            this[STOP] = this[STOP].bind(this);
        }

        /**
         * Delegates events
         *
         * @private
         * @method
         */
    }, {
        key: DELEGATE_EVENTS,
        value: function value() {
            this[VISIBILITY].addDocumentVisibleEventListener(this[START]);
            this[VISIBILITY].addDocumentInvisibleEventListener(this[STOP]);
        }

        /**
         * Initializes rendering strategies
         *
         * @private
         * @method
         */
    }, {
        key: INIT_STRATEGIES,
        value: function value() {
            this[STRATEGIES] = this[STRATEGIES] || {
                always: new _AlwaysRenderRenderingStrategy2["default"](this[GPT]),
                companion: new _CompanionAdRenderingStrategy2["default"](this[GPT]),
                viewable: new _WhenInViewportRenderingStrategy2["default"](this[GPT], this[VIEWABILITY])
            };
        }

        /**
         * Starts startable rendering strategies
         *
         * @private
         * @method
         */
    }, {
        key: START,
        value: function value() {
            this[STRATEGIES].viewable.start();
        }

        /**
         * Stops stoppable rendering strategies
         *
         * @private
         * @method
         */
    }, {
        key: STOP,
        value: function value() {
            this[STRATEGIES].viewable.stop();
        }

        /**
         * Undelegates events
         *
         * @private
         * @method
         */
    }, {
        key: UNDELEGATE_EVENTS,
        value: function value() {
            this[VISIBILITY].removeDocumentVisibleEventListener(this[START]);
            this[VISIBILITY].removeDocumentInvisibleEventListener(this[STOP]);
        }

        /**
         * Destructor
         *
         * @method
         */
    }, {
        key: "destroy",
        value: function destroy() {
            this[UNDELEGATE_EVENTS]();
        }

        /**
         * Renders an ad with the given rendering strategy
         *
         * @method
         * @param {Ad} ad
         * @param {object} config
         * @param {string} [config.strategy="viewable"]
         */
    }, {
        key: "render",
        value: function render(ad, _ref) {
            var _ref$strategy = _ref.strategy;
            var strategy = _ref$strategy === undefined ? "viewable" : _ref$strategy;

            var renderingStrategy = this[STRATEGIES][strategy];

            if (!renderingStrategy) {
                throw new Error("bb.ads: Invalid rendering strategy, supports: ['always', 'companion', 'viewable']");
            }

            renderingStrategy.render(ad);
        }
    }]);

    return Renderer;
})();

exports["default"] = Renderer;
module.exports = exports["default"];
},{"./AlwaysRenderRenderingStrategy":198,"./CompanionAdRenderingStrategy":199,"./WhenInViewportRenderingStrategy":201}],201:[function(require,module,exports){
/*! WhenInViewportRenderingStrategy.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilEnvironment = require("../util/Environment");

var _utilEnvironment2 = _interopRequireDefault(_utilEnvironment);

var GPT = Symbol("gpt");
var IS_RUNNING = Symbol("isRunning");
var SERVICES = Symbol("services");
var TICK = Symbol("tick");
var UNRENDERED_ADS = Symbol("undrenderedAds");
var VIEWABILITY = Symbol("viewability");
var WINDOW = Symbol("window");

/**
 * Render ad upon entering viewport
 *
 * @class
 */

var WhenInViewportRenderingStrategy = (function () {

    /**
     * @constructs WhenInViewportRenderingStrategy
     */

    function WhenInViewportRenderingStrategy(gpt, viewability) {
        _classCallCheck(this, WhenInViewportRenderingStrategy);

        this[GPT] = gpt;
        this[VIEWABILITY] = viewability;
        this[UNRENDERED_ADS] = new Set();
        this[WINDOW] = _utilEnvironment2["default"].getWindow();
        this[IS_RUNNING] = false;
        this[SERVICES] = [gpt.services.pubads];
    }

    /**
     * Execute a single step of the state machine
     * Invoke the next step and halt if no longer running
     *
     * @private
     * @method
     */

    _createClass(WhenInViewportRenderingStrategy, [{
        key: TICK,
        value: function value() {
            var _this = this;

            if (!this[WINDOW]) {
                return;
            }

            this[WINDOW].requestAnimationFrame(function () {
                if (!_this[IS_RUNNING]) {
                    return;
                }

                _this[VIEWABILITY].filter(Array.from(_this[UNRENDERED_ADS])).forEach(function (ad) {
                    _this[GPT].render(ad, { services: _this[SERVICES] });
                    _this[UNRENDERED_ADS]["delete"](ad);
                });

                _this[TICK]();
            });
        }

        /**
         * Add the ad to the set of unrendered ads and start the state machine
         *
         * @method
         * @param {Ad} ad
         */
    }, {
        key: "render",
        value: function render(ad) {
            if (ad.isDisplayable()) {
                this[UNRENDERED_ADS].add(ad);
            }
        }

        /**
         * Starts the state machine if not already running
         *
         * @method
         */
    }, {
        key: "start",
        value: function start() {
            if (!this[IS_RUNNING]) {
                this[IS_RUNNING] = true;
                this[TICK]();
            }
        }

        /**
         * Stops the state machine
         *
         * @method
         */
    }, {
        key: "stop",
        value: function stop() {
            this[IS_RUNNING] = false;
        }

        /**
         * Destructor
         *
         * @method
         */
    }, {
        key: "destroy",
        value: function destroy() {
            this.stop();
            this[UNRENDERED_ADS].clear();
        }
    }]);

    return WhenInViewportRenderingStrategy;
})();

exports["default"] = WhenInViewportRenderingStrategy;
module.exports = exports["default"];
},{"../util/Environment":202}],202:[function(require,module,exports){
/*! Environment.js */

/**
 * Class that holds reference to relevant environment variables/configs
 * See bb.browser
 *
 * @class Environment
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Environment = (function () {
    function Environment() {
        _classCallCheck(this, Environment);
    }

    _createClass(Environment, null, [{
        key: "getDocument",

        /**
         * Get reference to document object
         *
         * @method
         * @static
         * @returns {object}
         */
        value: function getDocument() {
            return typeof document !== "undefined" ? document : null;
        }

        /**
         * Get the height of the viewport
         *
         * @method
         * @static
         * @returns {number}
         */
    }, {
        key: "getViewportDimensions",
        value: function getViewportDimensions() {
            var _window = this.getWindow();
            var _document = this.getDocument();

            if (!(_window && _document)) {
                return 0;
            }

            var height = _window.innerHeight || _document.documentElement.clientHeight;
            var width = _window.innerWidth || _document.documentElement.clientWidth;

            return { height: height, width: width };
        }

        /**
         * Get reference to window object
         *
         * @method
         * @static
         * @returns {object}
         */
    }, {
        key: "getWindow",
        value: function getWindow() {
            return typeof window !== "undefined" ? window : null;
        }

        /**
         * Query the existance of window.localStorage
         *
         * @method
         * @static
         * @returns {Boolean}
         */
    }, {
        key: "localStorageExists",
        value: function localStorageExists() {
            var _window = this.getWindow();

            if (!_window) {
                return false;
            }

            try {
                return window.hasOwnProperty("localStorage") && window.localStorage;
            } catch (error) {
                return false;
            }
        }

        /**
         * Query support for cookies
         *
         * @method
         * @static
         * @returns {Boolean}
         */
    }, {
        key: "cookiesAreEnabled",
        value: function cookiesAreEnabled() {
            var _window = this.getWindow();

            return _window && _window.navigator ? _window.navigator.cookieEnabled : false;
        }

        /**
         * Query for the existance of the window global
         *
         * @method
         * @static
         * @returns {Boolean}
         */
    }, {
        key: "isBrowser",
        value: function isBrowser() {
            return !!this.getWindow();
        }

        /**
        * Get the host uri of the page
        *
        * @method
        * @static
        * @returns {String}
        */
    }, {
        key: "getHostUri",
        value: function getHostUri() {
            var _window = this.getWindow();

            return _window ? encodeURIComponent(_window.location.hostname) : "";
        }

        /**
         * Get the current time
         *
         * @method
         * @static
         * @returns {DOMHighResTimeStamp}
         */
    }, {
        key: "currentTime",
        value: function currentTime() {
            var _window = this.getWindow();

            if (_window.performance && _window.performance.now) {
                return _window.performance.now();
            }

            return Date.now();
        }
    }, {
        key: "getElementStyleAttribute",
        value: function getElementStyleAttribute(element, attribute) {
            var _window = this.getWindow();

            return _window.getComputedStyle(element).getPropertyValue(attribute);
        }
    }]);

    return Environment;
})();

exports["default"] = Environment;
module.exports = exports["default"];
},{}],203:[function(require,module,exports){
/*! LocalStorage */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Environment = require("./Environment");

var _Environment2 = _interopRequireDefault(_Environment);

/**
 * @class ServerLocalStorage
 */

var ServerLocalStorage = (function () {
    function ServerLocalStorage() {
        _classCallCheck(this, ServerLocalStorage);
    }

    /**
     *
     * @class BrowserLocalStorage
     */

    _createClass(ServerLocalStorage, [{
        key: "get",
        value: function get() {
            return "";
        }
    }]);

    return ServerLocalStorage;
})();

var BrowserLocalStorage = (function () {
    function BrowserLocalStorage() {
        var namespace = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

        _classCallCheck(this, BrowserLocalStorage);

        this.__namespace = namespace;
    }

    /**
     * @class BrowserCookieStorage
     */

    _createClass(BrowserLocalStorage, [{
        key: "get",
        value: function get(key) {
            return window.localStorage.getItem(this.__namespace + key) || "";
        }
    }]);

    return BrowserLocalStorage;
})();

var BrowserCookieStorage = (function () {
    function BrowserCookieStorage() {
        _classCallCheck(this, BrowserCookieStorage);
    }

    /**
     * @class LocalStorage
     */

    _createClass(BrowserCookieStorage, [{
        key: "get",
        value: function get(key) {
            var cookieToMatch = key + "=([^;]*)";
            var document = _Environment2["default"].getDocument();
            var cookieValue = document ? document.cookie.match(cookieToMatch) : null;
            return cookieValue ? decodeURI(cookieValue[1]) : "";
        }
    }]);

    return BrowserCookieStorage;
})();

var LocalStorage = (function () {
    function LocalStorage() {
        _classCallCheck(this, LocalStorage);
    }

    _createClass(LocalStorage, null, [{
        key: "create",

        /**
         * Factory method for Storage
         *
         * @param {string} namespace prefix
         * @returns {ServerLocalStorage|BrowserLocalStorage|BrowserCookieStorage}
         */
        value: function create(namespace) {
            if (!_Environment2["default"].isBrowser()) {
                return new ServerLocalStorage();
            }

            if (_Environment2["default"].localStorageExists()) {
                return new BrowserLocalStorage(namespace);
            }

            if (_Environment2["default"].cookiesAreEnabled()) {
                return new BrowserCookieStorage();
            }

            return new ServerLocalStorage();
        }
    }]);

    return LocalStorage;
})();

exports["default"] = LocalStorage;
exports.ServerLocalStorage = ServerLocalStorage;
exports.BrowserLocalStorage = BrowserLocalStorage;
exports.BrowserCookieStorage = BrowserCookieStorage;
},{"./Environment":202}],204:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Environment = require("./Environment");

var _Environment2 = _interopRequireDefault(_Environment);

var OVERLAY_STYLE = {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "100%",
    background: "rgba(0, 0, 0, 0.75)",
    border: "1px solid black",
    color: "white",
    fontSize: "14px",
    overflow: "scroll",
    textAlign: "left"
};

var RED_STYLING = {
    "height": "150px",
    "background-color": "red"
};

var RESET_STYLING = {
    "height": "auto",
    "background-color": "transparent"
};

var OVERLAY_CLASS = "ad-overlay";

/**
 * @class Overlayer
 */

var Overlayer = (function () {
    function Overlayer() {
        _classCallCheck(this, Overlayer);
    }

    _createClass(Overlayer, null, [{
        key: "overlay",

        /**
         * Overlays adElement with content string
         *
         * @method
         * @static
         * @param {string} content
         * @param {HTMLElement} adElement
         */
        value: function overlay(_ref) {
            var content = _ref.content;
            var adElement = _ref.adElement;
            var empty = _ref.empty;

            var overlayElement = _Environment2["default"].getDocument().createElement("div");
            var elementStyling = empty ? RED_STYLING : RESET_STYLING;

            overlayElement.setAttribute("class", OVERLAY_CLASS);

            if (_Environment2["default"].getElementStyleAttribute(adElement, "position") === "static") {
                adElement.style.position = "relative";
            }

            overlayElement.innerHTML = content;
            adElement.appendChild(overlayElement);

            Object.assign(overlayElement.style, OVERLAY_STYLE);
            Object.assign(adElement.style, elementStyling);
        }

        /**
         * Clears out any existing overlays
         *
         * @method
         * @static
         */
    }, {
        key: "clearOverlays",
        value: function clearOverlays() {
            var _document = _Environment2["default"].getDocument();

            var overlays = _document.getElementsByClassName(OVERLAY_CLASS);

            for (var i = overlays.length - 1; i >= 0; --i) {
                var overlay = overlays.item(i);
                overlay.parentNode.removeChild(overlay);
            }
        }
    }]);

    return Overlayer;
})();

exports["default"] = Overlayer;
module.exports = exports["default"];
},{"./Environment":202}],205:[function(require,module,exports){
/* Script.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Environment = require("./Environment");

var _Environment2 = _interopRequireDefault(_Environment);

var DEFAULT_ATTRIBUTES = {
    async: true,
    type: "text/javascript"
};

var asynchronously = function asynchronously(callback) {
    return setTimeout(callback, 0);
};

var createScriptWithAttributes = function createScriptWithAttributes(attributes) {
    var keys = Object.keys(attributes);
    var _document = _Environment2["default"].getDocument();
    var script = _document.createElement("script");

    for (var i = 0, len = keys.length; i < len; ++i) {
        var key = keys[i];
        script.setAttribute(key, attributes[key]);
    }

    _document.head.appendChild(script);
    script = null;
    _document = null;
};

/**
 * @class Script
 */

var Script = (function () {
    function Script() {
        _classCallCheck(this, Script);
    }

    _createClass(Script, null, [{
        key: "load",

        /**
         * Creates a script tag and asynchronously appends it to the body of the page
         *
         * @param {object} Attributes to put on the script tag
         * @param {Boolean} [async=true] load the script async or not
         * @static
         */
        value: function load(attributes) {
            asynchronously(function appendScript() {
                var combinedAttributes = Object.assign({}, DEFAULT_ATTRIBUTES, attributes);

                createScriptWithAttributes(combinedAttributes);
            });
        }
    }]);

    return Script;
})();

exports["default"] = Script;
module.exports = exports["default"];
},{"./Environment":202}],206:[function(require,module,exports){
/*! curry.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var curry = function curry(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return fn.bind.apply(fn, [this].concat(args));
};

exports["default"] = curry;
module.exports = exports["default"];
},{}],207:[function(require,module,exports){
/* identity.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var identity = function identity(value) {
  return value;
};

exports["default"] = identity;
module.exports = exports["default"];
},{}],208:[function(require,module,exports){
/* invertObject.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function invertObject(object) {
    var newObject = {};

    Object.keys(object).forEach(function (key) {
        var value = object[key];
        newObject[value] = key;
    });

    return newObject;
}

exports["default"] = invertObject;
module.exports = exports["default"];
},{}],209:[function(require,module,exports){
/*! Viewability.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilEnvironment = require("../util/Environment");

var _utilEnvironment2 = _interopRequireDefault(_utilEnvironment);

var _utilInvertObject = require("../util/invertObject");

var _utilInvertObject2 = _interopRequireDefault(_utilInvertObject);

var INVERTED_BREAKPOINTS = Symbol("invertedBreakpoints");
var IS_VIEWABLE = Symbol("isViewable");
var CURRENT_BREAKPOINT = Symbol("currentBreakpoint");

var SPANS_ALL_BREAKPOINTS = "all";

function cloneArray(array) {
    return array.slice(0);
}

function round(number) {
    return number > 0 ? Math.floor(number) : Math.ceil(number);
}

/**
 * Delegate viewability concerns with respect to the viewport and breakpoints
 *
 * @class
 */

var Viewability = (function () {

    /**
     * @constructs Viewability
     */

    function Viewability() {
        var breakpoints = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Viewability);

        this[INVERTED_BREAKPOINTS] = (0, _utilInvertObject2["default"])(breakpoints);
    }

    /**
     * Gets the current breakpoint of the viewport
     *
     * @private
     * @method
     * @returns {string}
     */

    _createClass(Viewability, [{
        key: CURRENT_BREAKPOINT,
        value: function value() {
            var theWindow = _utilEnvironment2["default"].getWindow();

            if (!theWindow) {
                return null;
            }

            var windowWidth = theWindow.innerWidth;

            var breakpointWidth = Object.keys(this[INVERTED_BREAKPOINTS]).reduce(function (smallerBreakpoint, largerBreakpoint) {
                return windowWidth >= largerBreakpoint ? largerBreakpoint : smallerBreakpoint;
            });

            return this[INVERTED_BREAKPOINTS][breakpointWidth];
        }
    }, {
        key: IS_VIEWABLE,
        value: function value(element, _ref) {
            var height = _ref.height;
            var width = _ref.width;
            var acceptableOffset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

            if (!element.offsetParent) {
                return false;
            }

            var _element$getBoundingClientRect = element.getBoundingClientRect();

            var top = _element$getBoundingClientRect.top;
            var bottom = _element$getBoundingClientRect.bottom;
            var left = _element$getBoundingClientRect.left;
            var right = _element$getBoundingClientRect.right;

            var viewportTop = 0 - acceptableOffset;
            var viewportBottom = height + acceptableOffset;
            element = null;

            var verticallyViewable = round(top) >= viewportTop && round(bottom) <= viewportBottom;
            var horizontallyViewable = round(left) >= 0 && round(right) <= width;

            return verticallyViewable && horizontallyViewable;
        }

        /**
         * Returns list of ads that are viewable
         * It is important to note that all DOM queries are made in batch and as infrequently as possible
         * Querying the DOM for position info, performing a DOM operation, and performing another query
         * causes the browser to perform a forced layout. This is extremely expensive and should be avoided.
         *
         * @param {Ad[]}
         * @returns {array}
         */
    }, {
        key: "filter",
        value: function filter() {
            var _this = this;

            var ads = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

            var viewportDimensions = _utilEnvironment2["default"].getViewportDimensions();

            return ads.filter(function (ad) {
                var adElement = ad.getElement();

                var isViewable = adElement ? _this[IS_VIEWABLE](adElement, viewportDimensions, ad.getViewportOffset()) : false;

                adElement = null;
                return isViewable;
            });
        }

        /**
         * Gets the sizes for the current viewport
         *
         * @param {object}
         * @returns {googletag.GeneralSizeArray}
         */
    }, {
        key: "getSizes",
        value: function getSizes(sizes) {
            if (Array.isArray(sizes)) {
                return sizes;
            }

            var currentBreakpoint = this[CURRENT_BREAKPOINT]();
            var sizesForCurrentBreakpoint = cloneArray(sizes[currentBreakpoint] || []);
            var sizesSpanningAllBreakpoints = sizes[SPANS_ALL_BREAKPOINTS] || [];

            sizesSpanningAllBreakpoints.forEach(function (size) {
                return sizesForCurrentBreakpoint.push(size);
            });

            return sizesForCurrentBreakpoint;
        }
    }]);

    return Viewability;
})();

exports["default"] = Viewability;
module.exports = exports["default"];
},{"../util/Environment":202,"../util/invertObject":208}],210:[function(require,module,exports){
/*! Visibility.js */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilEnvironment = require("../util/Environment");

var _utilEnvironment2 = _interopRequireDefault(_utilEnvironment);

var CONTEXTIFY_CALLBACKS = Symbol("contextifyCallbacks");
var DELEGATE_EVENTS = Symbol("delegateEvents");
var DISPATCH_EVENT_LISTENERS = Symbol("dispatchEventListners");
var DOCUMENT = Symbol("document");
var HIDDEN_ATTRIBUTE = Symbol("hidden");
var IE9_VISIBLE_EVENT_LISTENER = Symbol("ie9FocusinListener");
var IE9_INVISIBLE_EVENT_LISTENER = Symbol("ie9FocusoutListener");
var IE9_IS_VISIBILITY_CHANGE = Symbol("ie9IsVisibilityChange");
var INVISIBLE_LISTENERS = Symbol("invisibleListeners");
var UNDELEGATE_EVENTS = Symbol("undelegateEvents");
var USE_BROWSER_PREFIXED_ATTRIBUTES = Symbol("useBrowserPrefixedAttributes");
var VISIBLE_LISTENERS = Symbol("visibleListeners");
var VISIBILITY_CHANGE_EVENT = Symbol("visibilityChangeEvent");
var WINDOW = Symbol("window");

var BROWSER_PREFIXES = {
    "hidden": "visibilitychange",
    "webkitHidden": "webkitvisibilitychange",
    "mozHidden": "mozvisibilitychange",
    "msHidden": "msvisibilitychange"
};

var IE9_VISIBLE_EVENT = "focus";
var IE9_INVISIBLE_EVENT = "blur";

var isDefined = function isDefined(something) {
    return typeof something !== "undefined";
};

/**
 * Façade for registering callbacks to in and out-of-visibility events
 *
 * @class
 */

var Visibility = (function () {

    /**
     * @constructs Visibility
     */

    function Visibility() {
        _classCallCheck(this, Visibility);

        this[DOCUMENT] = _utilEnvironment2["default"].getDocument();
        this[WINDOW] = _utilEnvironment2["default"].getWindow();
        this[HIDDEN_ATTRIBUTE] = null;
        this[VISIBILITY_CHANGE_EVENT] = null;
        this[VISIBLE_LISTENERS] = [];
        this[INVISIBLE_LISTENERS] = [];

        this[USE_BROWSER_PREFIXED_ATTRIBUTES]();
        this[CONTEXTIFY_CALLBACKS]();
        this[DELEGATE_EVENTS]();
    }

    /**
     * Bind methods to self for use as callbacks
     *
     * @private
     * @method
     */

    _createClass(Visibility, [{
        key: CONTEXTIFY_CALLBACKS,
        value: function value() {
            this[DISPATCH_EVENT_LISTENERS] = this[DISPATCH_EVENT_LISTENERS].bind(this);
            this[IE9_VISIBLE_EVENT_LISTENER] = this[IE9_VISIBLE_EVENT_LISTENER].bind(this);
            this[IE9_INVISIBLE_EVENT_LISTENER] = this[IE9_INVISIBLE_EVENT_LISTENER].bind(this);
        }

        /**
         * Registers global event listener for visibility change
         *
         * @private
         * @method
         */
    }, {
        key: DELEGATE_EVENTS,
        value: function value() {
            if (!this[DOCUMENT]) {
                return;
            }

            if (this[VISIBILITY_CHANGE_EVENT]) {
                this[DOCUMENT].addEventListener(this[VISIBILITY_CHANGE_EVENT], this[DISPATCH_EVENT_LISTENERS]);
                return;
            }

            if (!this[WINDOW]) {
                return;
            }

            this[WINDOW].addEventListener(IE9_VISIBLE_EVENT, this[IE9_VISIBLE_EVENT_LISTENER]);
            this[WINDOW].addEventListener(IE9_INVISIBLE_EVENT, this[IE9_INVISIBLE_EVENT_LISTENER]);
        }

        /**
         * Dispatches appropriate set of callbacks, bound to document visibility change event
         *
         * @private
         * @method
         */
    }, {
        key: DISPATCH_EVENT_LISTENERS,
        value: function value() {
            var callbacks = this.isVisible() ? this[VISIBLE_LISTENERS] : this[INVISIBLE_LISTENERS];
            callbacks.forEach(function (callback) {
                return callback();
            });
        }

        /**
         * Determines whether or not focus/blur event is a visibility change
         *
         * @private
         * @method
         * @param {FocusEvent} event
         * @param {Window} event.view
         * @returns {boolean}
         */
    }, {
        key: IE9_IS_VISIBILITY_CHANGE,
        value: function value(_ref) {
            var view = _ref.view;

            return view === this[WINDOW];
        }

        /**
         * Dispatches visible listeners if focus event is a visibility change
         *
         * @private
         * @method
         * @param {FocusEvent} event
         */
    }, {
        key: IE9_VISIBLE_EVENT_LISTENER,
        value: function value(event) {
            if (this[IE9_IS_VISIBILITY_CHANGE](event)) {
                this[VISIBLE_LISTENERS].forEach(function (callback) {
                    return callback();
                });
            }
        }

        /**
         * Dispatches invisible listeners if blur event is a visibility change
         *
         * @private
         * @method
         * @param {FocusEvent} event
         */
    }, {
        key: IE9_INVISIBLE_EVENT_LISTENER,
        value: function value(event) {
            if (this[IE9_IS_VISIBILITY_CHANGE](event)) {
                this[INVISIBLE_LISTENERS].forEach(function (callback) {
                    return callback();
                });
            }
        }

        /**
         * Tears down global event listener for visibility change
         *
         * @private
         * @method
         */
    }, {
        key: UNDELEGATE_EVENTS,
        value: function value() {
            if (!this[DOCUMENT]) {
                return;
            }

            if (this[VISIBILITY_CHANGE_EVENT]) {
                this[DOCUMENT].removeEventListener(this[VISIBILITY_CHANGE_EVENT], this[DISPATCH_EVENT_LISTENERS]);
                return;
            }

            if (!this[WINDOW]) {
                return;
            }

            this[WINDOW].removeEventListener(IE9_VISIBLE_EVENT, this[IE9_VISIBLE_EVENT_LISTENER]);
            this[WINDOW].removeEventListener(IE9_INVISIBLE_EVENT, this[IE9_INVISIBLE_EVENT_LISTENER]);
        }

        /**
         * Selects correct version of `hidden` and `visibilitychange` for current browser
         *
         * @private
         * @method
         */
    }, {
        key: USE_BROWSER_PREFIXED_ATTRIBUTES,
        value: function value() {
            var _this = this;

            Object.keys(BROWSER_PREFIXES).some(function (attr) {
                if (isDefined(_this[DOCUMENT][attr])) {
                    _this[HIDDEN_ATTRIBUTE] = attr;
                    _this[VISIBILITY_CHANGE_EVENT] = BROWSER_PREFIXES[attr];
                    return true;
                }

                return false;
            });
        }

        /**
         * Destructor
         *
         * @method
         */
    }, {
        key: "destroy",
        value: function destroy() {
            this[UNDELEGATE_EVENTS]();
            this[VISIBLE_LISTENERS].length = 0;
            this[INVISIBLE_LISTENERS].length = 0;
        }

        /**
         * Determines whether or not the document is currently visible
         *
         * @method
         * @returns {boolean}
         */
    }, {
        key: "isVisible",
        value: function isVisible() {
            return this[DOCUMENT] && this[DOCUMENT][this[HIDDEN_ATTRIBUTE]] === false;
        }

        /**
         * Add event listener to document becoming visible
         *
         * @method
         * @param {function} callback
         */
    }, {
        key: "addDocumentVisibleEventListener",
        value: function addDocumentVisibleEventListener(callback) {
            this[VISIBLE_LISTENERS].push(callback);
        }

        /**
         * Add event listener to document becoming visible
         *
         * @method
         * @param {function} callback
         */
    }, {
        key: "removeDocumentVisibleEventListener",
        value: function removeDocumentVisibleEventListener(callback) {
            this[VISIBLE_LISTENERS] = this[VISIBLE_LISTENERS].filter(function (listener) {
                return listener !== callback;
            });
        }

        /**
         * Add event listener to document becoming invisible
         *
         * @method
         * @param {function} callback
         */
    }, {
        key: "addDocumentInvisibleEventListener",
        value: function addDocumentInvisibleEventListener(callback) {
            this[INVISIBLE_LISTENERS].push(callback);
        }

        /**
         * Add event listener to document becoming visible
         *
         * @method
         * @param {function} callback
         */
    }, {
        key: "removeDocumentInvisibleEventListener",
        value: function removeDocumentInvisibleEventListener(callback) {
            this[INVISIBLE_LISTENERS] = this[INVISIBLE_LISTENERS].filter(function (listener) {
                return listener !== callback;
            });
        }
    }]);

    return Visibility;
})();

exports["default"] = Visibility;
module.exports = exports["default"];
},{"../util/Environment":202}],211:[function(require,module,exports){
!function(a,b){"function"==typeof define&&define.amd?define(b):"object"==typeof exports?module.exports=b():a.md5=b()}(this,function(){function a(a,b){var g=a[0],h=a[1],i=a[2],j=a[3];g=c(g,h,i,j,b[0],7,-680876936),j=c(j,g,h,i,b[1],12,-389564586),i=c(i,j,g,h,b[2],17,606105819),h=c(h,i,j,g,b[3],22,-1044525330),g=c(g,h,i,j,b[4],7,-176418897),j=c(j,g,h,i,b[5],12,1200080426),i=c(i,j,g,h,b[6],17,-1473231341),h=c(h,i,j,g,b[7],22,-45705983),g=c(g,h,i,j,b[8],7,1770035416),j=c(j,g,h,i,b[9],12,-1958414417),i=c(i,j,g,h,b[10],17,-42063),h=c(h,i,j,g,b[11],22,-1990404162),g=c(g,h,i,j,b[12],7,1804603682),j=c(j,g,h,i,b[13],12,-40341101),i=c(i,j,g,h,b[14],17,-1502002290),h=c(h,i,j,g,b[15],22,1236535329),g=d(g,h,i,j,b[1],5,-165796510),j=d(j,g,h,i,b[6],9,-1069501632),i=d(i,j,g,h,b[11],14,643717713),h=d(h,i,j,g,b[0],20,-373897302),g=d(g,h,i,j,b[5],5,-701558691),j=d(j,g,h,i,b[10],9,38016083),i=d(i,j,g,h,b[15],14,-660478335),h=d(h,i,j,g,b[4],20,-405537848),g=d(g,h,i,j,b[9],5,568446438),j=d(j,g,h,i,b[14],9,-1019803690),i=d(i,j,g,h,b[3],14,-187363961),h=d(h,i,j,g,b[8],20,1163531501),g=d(g,h,i,j,b[13],5,-1444681467),j=d(j,g,h,i,b[2],9,-51403784),i=d(i,j,g,h,b[7],14,1735328473),h=d(h,i,j,g,b[12],20,-1926607734),g=e(g,h,i,j,b[5],4,-378558),j=e(j,g,h,i,b[8],11,-2022574463),i=e(i,j,g,h,b[11],16,1839030562),h=e(h,i,j,g,b[14],23,-35309556),g=e(g,h,i,j,b[1],4,-1530992060),j=e(j,g,h,i,b[4],11,1272893353),i=e(i,j,g,h,b[7],16,-155497632),h=e(h,i,j,g,b[10],23,-1094730640),g=e(g,h,i,j,b[13],4,681279174),j=e(j,g,h,i,b[0],11,-358537222),i=e(i,j,g,h,b[3],16,-722521979),h=e(h,i,j,g,b[6],23,76029189),g=e(g,h,i,j,b[9],4,-640364487),j=e(j,g,h,i,b[12],11,-421815835),i=e(i,j,g,h,b[15],16,530742520),h=e(h,i,j,g,b[2],23,-995338651),g=f(g,h,i,j,b[0],6,-198630844),j=f(j,g,h,i,b[7],10,1126891415),i=f(i,j,g,h,b[14],15,-1416354905),h=f(h,i,j,g,b[5],21,-57434055),g=f(g,h,i,j,b[12],6,1700485571),j=f(j,g,h,i,b[3],10,-1894986606),i=f(i,j,g,h,b[10],15,-1051523),h=f(h,i,j,g,b[1],21,-2054922799),g=f(g,h,i,j,b[8],6,1873313359),j=f(j,g,h,i,b[15],10,-30611744),i=f(i,j,g,h,b[6],15,-1560198380),h=f(h,i,j,g,b[13],21,1309151649),g=f(g,h,i,j,b[4],6,-145523070),j=f(j,g,h,i,b[11],10,-1120210379),i=f(i,j,g,h,b[2],15,718787259),h=f(h,i,j,g,b[9],21,-343485551),a[0]=l(g,a[0]),a[1]=l(h,a[1]),a[2]=l(i,a[2]),a[3]=l(j,a[3])}function b(a,b,c,d,e,f){return b=l(l(b,a),l(d,f)),l(b<<e|b>>>32-e,c)}function c(a,c,d,e,f,g,h){return b(c&d|~c&e,a,c,f,g,h)}function d(a,c,d,e,f,g,h){return b(c&e|d&~e,a,c,f,g,h)}function e(a,c,d,e,f,g,h){return b(c^d^e,a,c,f,g,h)}function f(a,c,d,e,f,g,h){return b(d^(c|~e),a,c,f,g,h)}function g(b){txt="";var c,d=b.length,e=[1732584193,-271733879,-1732584194,271733878];for(c=64;c<=b.length;c+=64)a(e,h(b.substring(c-64,c)));b=b.substring(c-64);var f=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(c=0;c<b.length;c++)f[c>>2]|=b.charCodeAt(c)<<(c%4<<3);if(f[c>>2]|=128<<(c%4<<3),c>55)for(a(e,f),c=0;16>c;c++)f[c]=0;return f[14]=8*d,a(e,f),e}function h(a){var b,c=[];for(b=0;64>b;b+=4)c[b>>2]=a.charCodeAt(b)+(a.charCodeAt(b+1)<<8)+(a.charCodeAt(b+2)<<16)+(a.charCodeAt(b+3)<<24);return c}function i(a){for(var b="",c=0;4>c;c++)b+=m[a>>8*c+4&15]+m[a>>8*c&15];return b}function j(a){for(var b=0;b<a.length;b++)a[b]=i(a[b]);return a.join("")}function k(a){return j(g(a))}function l(a,b){return a+b&4294967295}function l(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}var m="0123456789abcdef".split("");return"5d41402abc4b2a76b9719d911017c592"!=k("hello"),k});
},{}],212:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
