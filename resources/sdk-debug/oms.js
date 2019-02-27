(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Oms = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file is borrowed from lynckia/licode with some modifications.

/*global unescape*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Base64 = void 0;

var Base64 = function () {
  var END_OF_INPUT, base64Chars, reverseBase64Chars, base64Str, base64Count, i, setBase64Str, readBase64, encodeBase64, readReverseBase64, ntos, decodeBase64;
  END_OF_INPUT = -1;
  base64Chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
  reverseBase64Chars = [];

  for (i = 0; i < base64Chars.length; i = i + 1) {
    reverseBase64Chars[base64Chars[i]] = i;
  }

  setBase64Str = function setBase64Str(str) {
    base64Str = str;
    base64Count = 0;
  };

  readBase64 = function readBase64() {
    var c;

    if (!base64Str) {
      return END_OF_INPUT;
    }

    if (base64Count >= base64Str.length) {
      return END_OF_INPUT;
    }

    c = base64Str.charCodeAt(base64Count) & 0xff;
    base64Count = base64Count + 1;
    return c;
  };

  encodeBase64 = function encodeBase64(str) {
    var result, inBuffer, done;
    setBase64Str(str);
    result = '';
    inBuffer = new Array(3);
    done = false;

    while (!done && (inBuffer[0] = readBase64()) !== END_OF_INPUT) {
      inBuffer[1] = readBase64();
      inBuffer[2] = readBase64();
      result = result + base64Chars[inBuffer[0] >> 2];

      if (inBuffer[1] !== END_OF_INPUT) {
        result = result + base64Chars[inBuffer[0] << 4 & 0x30 | inBuffer[1] >> 4];

        if (inBuffer[2] !== END_OF_INPUT) {
          result = result + base64Chars[inBuffer[1] << 2 & 0x3c | inBuffer[2] >> 6];
          result = result + base64Chars[inBuffer[2] & 0x3F];
        } else {
          result = result + base64Chars[inBuffer[1] << 2 & 0x3c];
          result = result + '=';
          done = true;
        }
      } else {
        result = result + base64Chars[inBuffer[0] << 4 & 0x30];
        result = result + '=';
        result = result + '=';
        done = true;
      }
    }

    return result;
  };

  readReverseBase64 = function readReverseBase64() {
    if (!base64Str) {
      return END_OF_INPUT;
    }

    while (true) {
      if (base64Count >= base64Str.length) {
        return END_OF_INPUT;
      }

      var nextCharacter = base64Str.charAt(base64Count);
      base64Count = base64Count + 1;

      if (reverseBase64Chars[nextCharacter]) {
        return reverseBase64Chars[nextCharacter];
      }

      if (nextCharacter === 'A') {
        return 0;
      }
    }
  };

  ntos = function ntos(n) {
    n = n.toString(16);

    if (n.length === 1) {
      n = "0" + n;
    }

    n = "%" + n;
    return unescape(n);
  };

  decodeBase64 = function decodeBase64(str) {
    var result, inBuffer, done;
    setBase64Str(str);
    result = "";
    inBuffer = new Array(4);
    done = false;

    while (!done && (inBuffer[0] = readReverseBase64()) !== END_OF_INPUT && (inBuffer[1] = readReverseBase64()) !== END_OF_INPUT) {
      inBuffer[2] = readReverseBase64();
      inBuffer[3] = readReverseBase64();
      result = result + ntos(inBuffer[0] << 2 & 0xff | inBuffer[1] >> 4);

      if (inBuffer[2] !== END_OF_INPUT) {
        result += ntos(inBuffer[1] << 4 & 0xff | inBuffer[2] >> 2);

        if (inBuffer[3] !== END_OF_INPUT) {
          result = result + ntos(inBuffer[2] << 6 & 0xff | inBuffer[3]);
        } else {
          done = true;
        }
      } else {
        done = true;
      }
    }

    return result;
  };

  return {
    encodeBase64: encodeBase64,
    decodeBase64: decodeBase64
  };
}();

exports.Base64 = Base64;

},{}],2:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoEncodingParameters = exports.VideoCodecParameters = exports.VideoCodec = exports.AudioEncodingParameters = exports.AudioCodecParameters = exports.AudioCodec = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioCodec = {
  PCMU: 'pcmu',
  PCMA: 'pcma',
  OPUS: 'opus',
  G722: 'g722',
  ISAC: 'iSAC',
  ILBC: 'iLBC',
  AAC: 'aac',
  AC3: 'ac3',
  NELLYMOSER: 'nellymoser'
};
/**
 * @class AudioCodecParameters
 * @memberOf Oms.Base
 * @classDesc Codec parameters for an audio track.
 * @hideconstructor
 */

exports.AudioCodec = AudioCodec;

var AudioCodecParameters = function AudioCodecParameters(name, channelCount, clockRate) {
  _classCallCheck(this, AudioCodecParameters);

  /**
   * @member {string} name
   * @memberof Oms.Base.AudioCodecParameters
   * @instance
   * @desc Name of a codec. Please a value in Oms.Base.AudioCodec. However, some functions do not support all the values in Oms.Base.AudioCodec.
   */
  this.name = name;
  /**
   * @member {?number} channelCount
   * @memberof Oms.Base.AudioCodecParameters
   * @instance
   * @desc Numbers of channels for an audio track.
   */

  this.channelCount = channelCount;
  /**
   * @member {?number} clockRate
   * @memberof Oms.Base.AudioCodecParameters
   * @instance
   * @desc The codec clock rate expressed in Hertz.
   */

  this.clockRate = clockRate;
};
/**
 * @class AudioEncodingParameters
 * @memberOf Oms.Base
 * @classDesc Encoding parameters for sending an audio track.
 * @hideconstructor
 */


exports.AudioCodecParameters = AudioCodecParameters;

var AudioEncodingParameters = function AudioEncodingParameters(codec, maxBitrate) {
  _classCallCheck(this, AudioEncodingParameters);

  /**
   * @member {?Oms.Base.AudioCodecParameters} codec
   * @instance
   * @memberof Oms.Base.AudioEncodingParameters
   */
  this.codec = codec;
  /**
   * @member {?number} maxBitrate
   * @instance
   * @memberof Oms.Base.AudioEncodingParameters
   * @desc Max bitrate expressed in kbps.
   */

  this.maxBitrate = maxBitrate;
};

exports.AudioEncodingParameters = AudioEncodingParameters;
var VideoCodec = {
  VP8: 'vp8',
  VP9: 'vp9',
  H264: 'h264',
  H265: 'h265'
};
/**
 * @class VideoCodecParameters
 * @memberOf Oms.Base
 * @classDesc Codec parameters for a video track.
 * @hideconstructor
 */

exports.VideoCodec = VideoCodec;

var VideoCodecParameters = function VideoCodecParameters(name, profile) {
  _classCallCheck(this, VideoCodecParameters);

  /**
   * @member {string} name
   * @memberof Oms.Base.VideoCodecParameters
   * @instance
   * @desc Name of a codec. Please a value in Oms.Base.AudioCodec. However, some functions do not support all the values in Oms.Base.AudioCodec.
   */
  this.name = name;
  /**
   * @member {?string} profile
   * @memberof Oms.Base.VideoCodecParameters
   * @instance
   * @desc The profile of a codec. Profile may not apply to all codecs.
   */

  this.profile = profile;
};
/**
 * @class VideoEncodingParameters
 * @memberOf Oms.Base
 * @classDesc Encoding parameters for sending a video track.
 * @hideconstructor
 */


exports.VideoCodecParameters = VideoCodecParameters;

var VideoEncodingParameters = function VideoEncodingParameters(codec, maxBitrate) {
  _classCallCheck(this, VideoEncodingParameters);

  /**
   * @member {?Oms.Base.VideoCodecParameters} codec
   * @instance
   * @memberof Oms.Base.VideoEncodingParameters
   */
  this.codec = codec;
  /**
   * @member {?number} maxBitrate
   * @instance
   * @memberof Oms.Base.VideoEncodingParameters
   * @desc Max bitrate expressed in kbps.
   */

  this.maxBitrate = maxBitrate;
};

exports.VideoEncodingParameters = VideoEncodingParameters;

},{}],3:[function(require,module,exports){
// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file is borrowed from lynckia/licode with some modifications.
'use strict';
/**
 * @class EventDispatcher
 * @classDesc A shim for EventTarget. Might be changed to EventTarget later.
 * @memberof Oms.Base
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MuteEvent = exports.ErrorEvent = exports.MessageEvent = exports.OmsEvent = exports.EventDispatcher = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventDispatcher = function EventDispatcher() {
  // Private vars
  var spec = {};
  spec.dispatcher = {};
  spec.dispatcher.eventListeners = {};
  /**
   * @function addEventListener
   * @desc This function registers a callback function as a handler for the corresponding event. It's shortened form is on(eventType, listener). See the event description in the following table.<br>
   * @instance
   * @memberof Oms.Base.EventDispatcher
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */

  this.addEventListener = function (eventType, listener) {
    if (spec.dispatcher.eventListeners[eventType] === undefined) {
      spec.dispatcher.eventListeners[eventType] = [];
    }

    spec.dispatcher.eventListeners[eventType].push(listener);
  };
  /**
   * @function removeEventListener
   * @desc This function removes a registered event listener.
   * @instance
   * @memberof Oms.Base.EventDispatcher
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */


  this.removeEventListener = function (eventType, listener) {
    if (!spec.dispatcher.eventListeners[eventType]) {
      return;
    }

    var index = spec.dispatcher.eventListeners[eventType].indexOf(listener);

    if (index !== -1) {
      spec.dispatcher.eventListeners[eventType].splice(index, 1);
    }
  };
  /**
   * @function clearEventListener
   * @desc This function removes all event listeners for one type.
   * @instance
   * @memberof Oms.Base.EventDispatcher
   * @param {string} eventType Event string.
   */


  this.clearEventListener = function (eventType) {
    spec.dispatcher.eventListeners[eventType] = [];
  }; // It dispatch a new event to the event listeners, based on the type
  // of event. All events are intended to be LicodeEvents.


  this.dispatchEvent = function (event) {
    if (!spec.dispatcher.eventListeners[event.type]) {
      return;
    }

    spec.dispatcher.eventListeners[event.type].map(function (listener) {
      listener(event);
    });
  };
};
/**
 * @class OmsEvent
 * @classDesc Class OmsEvent represents a generic Event in the library.
 * @memberof Oms.Base
 * @hideconstructor
 */


exports.EventDispatcher = EventDispatcher;

var OmsEvent = function OmsEvent(type) {
  _classCallCheck(this, OmsEvent);

  this.type = type;
};
/**
 * @class MessageEvent
 * @classDesc Class MessageEvent represents a message Event in the library.
 * @memberof Oms.Base
 * @hideconstructor
 */


exports.OmsEvent = OmsEvent;

var MessageEvent =
/*#__PURE__*/
function (_OmsEvent) {
  _inherits(MessageEvent, _OmsEvent);

  function MessageEvent(type, init) {
    var _this;

    _classCallCheck(this, MessageEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MessageEvent).call(this, type));
    /**
     * @member {string} origin
     * @instance
     * @memberof Oms.Base.MessageEvent
     * @desc ID of the remote endpoint who published this stream.
     */

    _this.origin = init.origin;
    /**
     * @member {string} message
     * @instance
     * @memberof Oms.Base.MessageEvent
     */

    _this.message = init.message;
    /**
     * @member {string} to
     * @instance
     * @memberof Oms.Base.MessageEvent
     * @desc Values could be "all", "me" in conference mode, or undefined in P2P mode..
     */

    _this.to = init.to;
    return _this;
  }

  return MessageEvent;
}(OmsEvent);
/**
 * @class ErrorEvent
 * @classDesc Class ErrorEvent represents an error Event in the library.
 * @memberof Oms.Base
 * @hideconstructor
 */


exports.MessageEvent = MessageEvent;

var ErrorEvent =
/*#__PURE__*/
function (_OmsEvent2) {
  _inherits(ErrorEvent, _OmsEvent2);

  function ErrorEvent(type, init) {
    var _this2;

    _classCallCheck(this, ErrorEvent);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ErrorEvent).call(this, type));
    /**
     * @member {Error} error
     * @instance
     * @memberof Oms.Base.ErrorEvent
     */

    _this2.error = init.error;
    return _this2;
  }

  return ErrorEvent;
}(OmsEvent);
/**
 * @class MuteEvent
 * @classDesc Class MuteEvent represents a mute or unmute event.
 * @memberof Oms.Base
 * @hideconstructor
 */


exports.ErrorEvent = ErrorEvent;

var MuteEvent =
/*#__PURE__*/
function (_OmsEvent3) {
  _inherits(MuteEvent, _OmsEvent3);

  function MuteEvent(type, init) {
    var _this3;

    _classCallCheck(this, MuteEvent);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(MuteEvent).call(this, type));
    /**
     * @member {Oms.Base.TrackKind} kind
     * @instance
     * @memberof Oms.Base.MuteEvent
     */

    _this3.kind = init.kind;
    return _this3;
  }

  return MuteEvent;
}(OmsEvent);

exports.MuteEvent = MuteEvent;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mediastreamFactory = require("./mediastream-factory.js");

Object.keys(_mediastreamFactory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mediastreamFactory[key];
    }
  });
});

var _stream = require("./stream.js");

Object.keys(_stream).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _stream[key];
    }
  });
});

var _mediaformat = require("./mediaformat.js");

Object.keys(_mediaformat).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mediaformat[key];
    }
  });
});

},{"./mediaformat.js":6,"./mediastream-factory.js":7,"./stream.js":10}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file is borrowed from lynckia/licode with some modifications.

/*global console*/

/*
 * API to write logs based on traditional logging mechanisms: debug, trace, info, warning, error
 */
var Logger = function () {
  "use strict";

  var DEBUG = 0,
      TRACE = 1,
      INFO = 2,
      WARNING = 3,
      ERROR = 4,
      NONE = 5;

  var noOp = function noOp() {}; // |that| is the object to be returned.


  var that = {
    DEBUG: DEBUG,
    TRACE: TRACE,
    INFO: INFO,
    WARNING: WARNING,
    ERROR: ERROR,
    NONE: NONE
  };
  that.log = window.console.log.bind(window.console);

  var bindType = function bindType(type) {
    if (typeof window.console[type] === 'function') {
      return window.console[type].bind(window.console);
    } else {
      return window.console.log.bind(window.console);
    }
  };

  var setLogLevel = function setLogLevel(level) {
    if (level <= DEBUG) {
      that.debug = bindType('log');
    } else {
      that.debug = noOp;
    }

    if (level <= TRACE) {
      that.trace = bindType('trace');
    } else {
      that.trace = noOp;
    }

    if (level <= INFO) {
      that.info = bindType('info');
    } else {
      that.info = noOp;
    }

    if (level <= WARNING) {
      that.warning = bindType('warn');
    } else {
      that.warning = noOp;
    }

    if (level <= ERROR) {
      that.error = bindType('error');
    } else {
      that.error = noOp;
    }
  };

  setLogLevel(DEBUG); // Default level is debug.

  that.setLogLevel = setLogLevel;
  return that;
}();

var _default = Logger;
exports.default = _default;

},{}],6:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * Source info about an audio track. Values: 'mic', 'screen-cast', 'file', 'mixed'.
 * @memberOf Oms.Base
 * @readonly
 * @enum {string}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resolution = exports.TrackKind = exports.VideoSourceInfo = exports.AudioSourceInfo = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioSourceInfo = {
  MIC: 'mic',
  SCREENCAST: 'screen-cast',
  FILE: 'file',
  MIXED: 'mixed'
};
/**
 * Source info about a video track. Values: 'camera', 'screen-cast', 'file', 'mixed'.
 * @memberOf Oms.Base
 * @readonly
 * @enum {string}
 */

exports.AudioSourceInfo = AudioSourceInfo;
var VideoSourceInfo = {
  CAMERA: 'camera',
  SCREENCAST: 'screen-cast',
  FILE: 'file',
  MIXED: 'mixed'
};
/**
 * Kind of a track. Values: 'audio' for audio track, 'video' for video track, 'av' for both audio and video tracks.
 * @memberOf Oms.Base
 * @readonly
 * @enum {string}
 */

exports.VideoSourceInfo = VideoSourceInfo;
var TrackKind = {
  /**
   * Audio tracks.
   * @type string
   */
  AUDIO: 'audio',

  /**
   * Video tracks.
   * @type string
   */
  VIDEO: 'video',

  /**
   * Both audio and video tracks.
   * @type string
   */
  AUDIO_AND_VIDEO: 'av'
};
/**
 * @class Resolution
 * @memberOf Oms.Base
 * @classDesc The Resolution defines the size of a rectangle.
 * @constructor
 * @param {number} width
 * @param {number} height
 */

exports.TrackKind = TrackKind;

var Resolution = function Resolution(width, height) {
  _classCallCheck(this, Resolution);

  /**
   * @member {number} width
   * @instance
   * @memberof Oms.Base.Resolution
   */
  this.width = width;
  /**
   * @member {number} height
   * @instance
   * @memberof Oms.Base.Resolution
   */

  this.height = height;
};

exports.Resolution = Resolution;

},{}],7:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaStreamFactory = exports.StreamConstraints = exports.VideoTrackConstraints = exports.AudioTrackConstraints = void 0;

var utils = _interopRequireWildcard(require("./utils.js"));

var _logger = _interopRequireDefault(require("./logger.js"));

var MediaFormatModule = _interopRequireWildcard(require("./mediaformat.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioTrackConstraints
 * @classDesc Constraints for creating an audio MediaStreamTrack.
 * @memberof Oms.Base
 * @constructor
 * @param {Oms.Base.AudioSourceInfo} source Source info of this audio track.
 */
var AudioTrackConstraints = function AudioTrackConstraints(source) {
  _classCallCheck(this, AudioTrackConstraints);

  if (!Object.values(MediaFormatModule.AudioSourceInfo).some(function (v) {
    return v === source;
  })) {
    throw new TypeError('Invalid source.');
  }
  /**
   * @member {string} source
   * @memberof Oms.Base.AudioTrackConstraints
   * @desc Values could be "mic", "screen-cast", "file" or "mixed".
   * @instance
   */


  this.source = source;
  /**
   * @member {string} deviceId
   * @memberof Oms.Base.AudioTrackConstraints
   * @desc Do not provide deviceId if source is not "mic".
   * @instance
   * @see https://w3c.github.io/mediacapture-main/#def-constraint-deviceId
   */

  this.deviceId = undefined;
};
/**
 * @class VideoTrackConstraints
 * @classDesc Constraints for creating a video MediaStreamTrack.
 * @memberof Oms.Base
 * @constructor
 * @param {Oms.Base.VideoSourceInfo} source Source info of this video track.
 */


exports.AudioTrackConstraints = AudioTrackConstraints;

var VideoTrackConstraints = function VideoTrackConstraints(source) {
  _classCallCheck(this, VideoTrackConstraints);

  if (!Object.values(MediaFormatModule.VideoSourceInfo).some(function (v) {
    return v === source;
  })) {
    throw new TypeError('Invalid source.');
  }
  /**
   * @member {string} source
   * @memberof Oms.Base.VideoTrackConstraints
   * @desc Values could be "camera", "screen-cast", "file" or "mixed".
   * @instance
   */


  this.source = source;
  /**
   * @member {string} deviceId
   * @memberof Oms.Base.VideoTrackConstraints
   * @desc Do not provide deviceId if source is not "camera".
   * @instance
   * @see https://w3c.github.io/mediacapture-main/#def-constraint-deviceId
   */

  this.deviceId = undefined;
  /**
   * @member {Oms.Base.Resolution} resolution
   * @memberof Oms.Base.VideoTrackConstraints
   * @instance
   */

  this.resolution = undefined;
  /**
   * @member {number} frameRate
   * @memberof Oms.Base.VideoTrackConstraints
   * @instance
   */

  this.frameRate = undefined;
};
/**
 * @class StreamConstraints
 * @classDesc Constraints for creating a MediaStream from screen mic and camera.
 * @memberof Oms.Base
 * @constructor
 * @param {?Oms.Base.AudioTrackConstraints} audioConstraints
 * @param {?Oms.Base.VideoTrackConstraints} videoConstraints
 * @param {?string} extensionId The ID of Chrome screen sharing extension.
 */


exports.VideoTrackConstraints = VideoTrackConstraints;

var StreamConstraints = function StreamConstraints() {
  var audioConstraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var videoConstraints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  _classCallCheck(this, StreamConstraints);

  /**
   * @member {Oms.Base.MediaStreamTrackDeviceConstraintsForAudio} audio
   * @memberof Oms.Base.MediaStreamDeviceConstraints
   * @instance
   */
  this.audio = audioConstraints;
  /**
   * @member {Oms.Base.MediaStreamTrackDeviceConstraintsForVideo} Video
   * @memberof Oms.Base.MediaStreamDeviceConstraints
   * @instance
   */

  this.video = videoConstraints;
  /**
   * @member {string} extensionId
   * @memberof Oms.Base.MediaStreamDeviceConstraints
   * @desc The ID of Chrome Extension for screen sharing.
   * @instance
   */
};

exports.StreamConstraints = StreamConstraints;

function isVideoConstrainsForScreenCast(constraints) {
  return _typeof(constraints.video) === 'object' && constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST;
}
/**
 * @class MediaStreamFactory
 * @classDesc A factory to create MediaStream. You can also create MediaStream by yourself.
 * @memberof Oms.Base
 */


var MediaStreamFactory =
/*#__PURE__*/
function () {
  function MediaStreamFactory() {
    _classCallCheck(this, MediaStreamFactory);
  }

  _createClass(MediaStreamFactory, null, [{
    key: "createMediaStream",

    /**
     * @function createMediaStream
     * @static
     * @desc Create a MediaStream with given constraints. If you want to create a MediaStream for screen cast, please make sure both audio and video's source are "screen-cast".
     * @memberof Oms.Base.MediaStreamFactory
     * @returns {Promise<MediaStream, Error>} Return a promise that is resolved when stream is successfully created, or rejected if one of the following error happened:
     * - One or more parameters cannot be satisfied.
     * - Specified device is busy.
     * - Cannot obtain necessary permission or operation is canceled by user.
     * - Video source is screen cast, while audio source is not.
     * - Audio source is screen cast, while video source is disabled.
     * @param {Oms.Base.StreamConstraints} constraints
     */
    value: function createMediaStream(constraints) {
      if (_typeof(constraints) !== 'object' || !constraints.audio && !constraints.video) {
        return Promise.reject(new TypeError('Invalid constrains'));
      }

      if (!isVideoConstrainsForScreenCast(constraints) && _typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.SCREENCAST) {
        return Promise.reject(new TypeError('Cannot share screen without video.'));
      }

      if (isVideoConstrainsForScreenCast(constraints) && !utils.isChrome() && !utils.isFirefox()) {
        return Promise.reject(new TypeError('Screen sharing only supports Chrome and Firefox.'));
      }

      if (isVideoConstrainsForScreenCast(constraints) && _typeof(constraints.audio) === 'object' && constraints.audio.source !== MediaFormatModule.AudioSourceInfo.SCREENCAST) {
        return Promise.reject(new TypeError('Cannot capture video from screen cast while capture audio from other source.'));
      }


       // Screen sharing on Chrome does not work with the latest constraints format.
      if (isVideoConstrainsForScreenCast(constraints) && utils.isChrome()) {
        if (!constraints.extensionId) {
          return Promise.reject(new TypeError('Extension ID must be specified for screen sharing on Chrome.'));
        }

        var desktopCaptureSources = ['screen', 'window', 'tab'];

        if (constraints.audio) {
          desktopCaptureSources.push('audio');
        }

        return new Promise(function (resolve, reject) {
          chrome.runtime.sendMessage(constraints.extensionId, {
            getStream: desktopCaptureSources
          }, function (response) {
            if (response === undefined) {
              return reject(new Error(chrome.runtime.lastError.message));
            }

            if (constraints.audio && _typeof(response.options) !== 'object') {
              _logger.default.warning('Desktop sharing with audio requires the latest Chrome extension. Your audio constraints will be ignored.');
            }

            var mediaConstraints = Object.create({});

            if (constraints.audio && _typeof(response.options) === 'object') {
              if (response.options.canRequestAudioTrack) {
                mediaConstraints.audio = {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: response.streamId
                  }
                };
              } else {
                _logger.default.warning('Sharing screen with audio was not selected by user.');
              }
            }

            mediaConstraints.video = Object.create({});
            mediaConstraints.video.mandatory = Object.create({});
            mediaConstraints.video.mandatory.chromeMediaSource = 'desktop';
            mediaConstraints.video.mandatory.chromeMediaSourceId = response.streamId; // Transform new constraint format to the old style. Because chromeMediaSource only supported in the old style, and mix new and old style will result type error: "Cannot use both optional/mandatory and specific or advanced constraints.".

            if (constraints.video.resolution) {
              mediaConstraints.video.mandatory.maxHeight = mediaConstraints.video.mandatory.minHeight = constraints.video.resolution.height;
              mediaConstraints.video.mandatory.maxWidth = mediaConstraints.video.mandatory.minWidth = constraints.video.resolution.width;
            }

            if (constraints.video.frameRate) {
              mediaConstraints.video.mandatory.minFrameRate = constraints.video.frameRate;
              mediaConstraints.video.mandatory.maxFrameRate = constraints.video.frameRate;
            }

            resolve(navigator.mediaDevices.getUserMedia(mediaConstraints));
          });
        });
      } else {
        if (!constraints.audio && !constraints.video) {
          return Promise.reject(new TypeError('At least one of audio and video must be requested.'));
        }

        var mediaConstraints = Object.create({});

        if (_typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.MIC) {
          mediaConstraints.audio = Object.create({});

          if (utils.isEdge()) {
            mediaConstraints.audio.deviceId = constraints.audio.deviceId;
          } else {
            mediaConstraints.audio.deviceId = {
              exact: constraints.audio.deviceId
            };
          }
        } else {
          mediaConstraints.audio = constraints.audio;
        }

        if (_typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.SCREENCAST) {
          _logger.default.warning('Screen sharing with audio is not supported in Firefox.');

          mediaConstraints.audio = false;
        }

        if (_typeof(constraints.video) === 'object') {
          mediaConstraints.video = Object.create({});

          if (typeof constraints.video.frameRate === 'number') {
            mediaConstraints.video.frameRate = constraints.video.frameRate;
          }

          if (constraints.video.resolution && constraints.video.resolution.width && constraints.video.resolution.height) {
            mediaConstraints.video.width = Object.create({});
            mediaConstraints.video.width.exact = constraints.video.resolution.width;
            mediaConstraints.video.height = Object.create({});
            mediaConstraints.video.height.exact = constraints.video.resolution.height;
          }

          if (typeof constraints.video.deviceId === 'string') {
            mediaConstraints.video.deviceId = {
              exact: constraints.video.deviceId
            };
          }

          if (utils.isFirefox() && constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST) {
            mediaConstraints.video.mediaSource = 'screen';
          }
        } else {
          mediaConstraints.video = constraints.video;
        }

        return navigator.mediaDevices.getUserMedia(mediaConstraints);
      }
    }
  }]);

  return MediaStreamFactory;
}();

exports.MediaStreamFactory = MediaStreamFactory;

},{"./logger.js":5,"./mediaformat.js":6,"./utils.js":11}],8:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublishOptions = exports.Publication = exports.PublicationSettings = exports.VideoPublicationSettings = exports.AudioPublicationSettings = void 0;

var Utils = _interopRequireWildcard(require("./utils.js"));

var MediaFormat = _interopRequireWildcard(require("./mediaformat.js"));

var _event = require("../base/event.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioPublicationSettings
 * @memberOf Oms.Base
 * @classDesc The audio settings of a publication.
 * @hideconstructor
 */
var AudioPublicationSettings = function AudioPublicationSettings(codec) {
  _classCallCheck(this, AudioPublicationSettings);

  /**
   * @member {?Oms.Base.AudioCodecParameters} codec
   * @instance
   * @memberof Oms.Base.AudioPublicationSettings
   */
  this.codec = codec;
};
/**
 * @class VideoPublicationSettings
 * @memberOf Oms.Base
 * @classDesc The video settings of a publication.
 * @hideconstructor
 */


exports.AudioPublicationSettings = AudioPublicationSettings;

var VideoPublicationSettings = function VideoPublicationSettings(codec, resolution, frameRate, bitrate, keyFrameInterval) {
  _classCallCheck(this, VideoPublicationSettings);

  /**
   * @member {?Oms.Base.VideoCodecParameters} codec
   * @instance
   * @memberof Oms.Base.VideoPublicationSettings
   */
  this.codec = codec,
  /**
   * @member {?Oms.Base.Resolution} resolution
   * @instance
   * @memberof Oms.Base.VideoPublicationSettings
   */
  this.resolution = resolution;
  /**
   * @member {?number} frameRates
   * @instance
   * @memberof Oms.Base.VideoPublicationSettings
   */

  this.frameRate = frameRate;
  /**
   * @member {?number} bitrate
   * @instance
   * @memberof Oms.Base.VideoPublicationSettings
   */

  this.bitrate = bitrate;
  /**
   * @member {?number} keyFrameIntervals
   * @instance
   * @memberof Oms.Base.VideoPublicationSettings
   */

  this.keyFrameInterval = keyFrameInterval;
};
/**
 * @class PublicationSettings
 * @memberOf Oms.Base
 * @classDesc The settings of a publication.
 * @hideconstructor
 */


exports.VideoPublicationSettings = VideoPublicationSettings;

var PublicationSettings = function PublicationSettings(audio, video) {
  _classCallCheck(this, PublicationSettings);

  /**
   * @member {Oms.Base.AudioPublicationSettings} audio
   * @instance
   * @memberof Oms.Base.PublicationSettings
   */
  this.audio = audio;
  /**
   * @member {Oms.Base.VideoPublicationSettings} video
   * @instance
   * @memberof Oms.Base.PublicationSettings
   */

  this.video = video;
};
/**
 * @class Publication
 * @memberOf Oms.Base
 * @classDesc Publication represents a sender for publishing a stream. It handles the actions on a LocalStream published to a conference.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | ended           | Event            | Publication is ended. |
 * | mute            | MuteEvent        | Publication is muted. Client stopped sending audio and/or video data to remote endpoint. |
 * | unmute          | MuteEvent        | Publication is unmuted. Client continued sending audio and/or video data to remote endpoint. |
 *
 * @hideconstructor
 */


exports.PublicationSettings = PublicationSettings;

var Publication =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Publication, _EventDispatcher);

  function Publication(id, stop, getStats, mute, unmute) {
    var _this;

    _classCallCheck(this, Publication);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Publication).call(this));
    /**
     * @member {string} id
     * @instance
     * @memberof Oms.Base.Publication
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'id', {
      configurable: false,
      writable: false,
      value: id ? id : Utils.createUuid()
    });
    /**
     * @function stop
     * @instance
     * @desc Stop certain publication. Once a subscription is stopped, it cannot be recovered.
     * @memberof Oms.Base.Publication
     * @returns {undefined}
     */

    _this.stop = stop;
    /**
     * @function getStats
     * @instance
     * @desc Get stats of underlying PeerConnection.
     * @memberof Oms.Base.Publication
     * @returns {Promise<RTCStatsReport, Error>}
     */

    _this.getStats = getStats;
    /**
     * @function mute
     * @instance
     * @desc Stop sending data to remote endpoint.
     * @memberof Oms.Base.Publication
     * @param {Oms.Base.TrackKind } kind Kind of tracks to be muted.
     * @returns {Promise<undefined, Error>}
     */

    _this.mute = mute;
    /**
     * @function unmute
     * @instance
     * @desc Continue sending data to remote endpoint.
     * @memberof Oms.Base.Publication
     * @param {Oms.Base.TrackKind } kind Kind of tracks to be unmuted.
     * @returns {Promise<undefined, Error>}
     */

    _this.unmute = unmute;
    return _this;
  }

  return Publication;
}(_event.EventDispatcher);
/**
 * @class PublishOptions
 * @memberOf Oms.Base
 * @classDesc PublishOptions defines options for publishing a Oms.Base.LocalStream.
 */


exports.Publication = Publication;

var PublishOptions = function PublishOptions(audio, video) {
  _classCallCheck(this, PublishOptions);

  /**
   * @member {?Array<Oms.Base.AudioEncodingParameters>} audio
   * @instance
   * @memberof Oms.Base.PublishOptions
   */
  this.audio = audio;
  /**
   * @member {?Array<Oms.Base.VideoEncodingParameters>} video
   * @instance
   * @memberof Oms.Base.PublishOptions
   */

  this.video = video;
};

exports.PublishOptions = PublishOptions;

},{"../base/event.js":3,"./mediaformat.js":6,"./utils.js":11}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reorderCodecs = reorderCodecs;
exports.setMaxBitrate = setMaxBitrate;

var _logger = _interopRequireDefault(require("./logger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* More information about these options at jshint.com/docs/options */

/* globals  adapter, trace */

/* exported setCodecParam, iceCandidateType, formatTypePreference,
   maybeSetOpusOptions, maybePreferAudioReceiveCodec,
   maybePreferAudioSendCodec, maybeSetAudioReceiveBitRate,
   maybeSetAudioSendBitRate, maybePreferVideoReceiveCodec,
   maybePreferVideoSendCodec, maybeSetVideoReceiveBitRate,
   maybeSetVideoSendBitRate, maybeSetVideoSendInitialBitRate,
   maybeRemoveVideoFec, mergeConstraints, removeCodecParam*/

/* This file is borrowed from apprtc with some modifications. */

/* Commit hash: c6af0c25e9af527f71b3acdd6bfa1389d778f7bd + PR 530 */
'use strict';

function mergeConstraints(cons1, cons2) {
  if (!cons1 || !cons2) {
    return cons1 || cons2;
  }

  var merged = cons1;

  for (var key in cons2) {
    merged[key] = cons2[key];
  }

  return merged;
}

function iceCandidateType(candidateStr) {
  return candidateStr.split(' ')[7];
} // Turns the local type preference into a human-readable string.
// Note that this mapping is browser-specific.


function formatTypePreference(pref) {
  if (adapter.browserDetails.browser === 'chrome') {
    switch (pref) {
      case 0:
        return 'TURN/TLS';

      case 1:
        return 'TURN/TCP';

      case 2:
        return 'TURN/UDP';

      default:
        break;
    }
  } else if (adapter.browserDetails.browser === 'firefox') {
    switch (pref) {
      case 0:
        return 'TURN/TCP';

      case 5:
        return 'TURN/UDP';

      default:
        break;
    }
  }

  return '';
}

function maybeSetOpusOptions(sdp, params) {
  // Set Opus in Stereo, if stereo is true, unset it, if stereo is false, and
  // do nothing if otherwise.
  if (params.opusStereo === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'stereo', '1');
  } else if (params.opusStereo === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'stereo');
  } // Set Opus FEC, if opusfec is true, unset it, if opusfec is false, and
  // do nothing if otherwise.


  if (params.opusFec === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'useinbandfec', '1');
  } else if (params.opusFec === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'useinbandfec');
  } // Set Opus DTX, if opusdtx is true, unset it, if opusdtx is false, and
  // do nothing if otherwise.


  if (params.opusDtx === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'usedtx', '1');
  } else if (params.opusDtx === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'usedtx');
  } // Set Opus maxplaybackrate, if requested.


  if (params.opusMaxPbr) {
    sdp = setCodecParam(sdp, 'opus/48000', 'maxplaybackrate', params.opusMaxPbr);
  }

  return sdp;
}

function maybeSetAudioSendBitRate(sdp, params) {
  if (!params.audioSendBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer audio send bitrate: ' + params.audioSendBitrate);

  return preferBitRate(sdp, params.audioSendBitrate, 'audio');
}

function maybeSetAudioReceiveBitRate(sdp, params) {
  if (!params.audioRecvBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer audio receive bitrate: ' + params.audioRecvBitrate);

  return preferBitRate(sdp, params.audioRecvBitrate, 'audio');
}

function maybeSetVideoSendBitRate(sdp, params) {
  if (!params.videoSendBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer video send bitrate: ' + params.videoSendBitrate);

  return preferBitRate(sdp, params.videoSendBitrate, 'video');
}

function maybeSetVideoReceiveBitRate(sdp, params) {
  if (!params.videoRecvBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer video receive bitrate: ' + params.videoRecvBitrate);

  return preferBitRate(sdp, params.videoRecvBitrate, 'video');
} // Add a b=AS:bitrate line to the m=mediaType section.


function preferBitRate(sdp, bitrate, mediaType) {
  var sdpLines = sdp.split('\r\n'); // Find m line for the given mediaType.

  var mLineIndex = findLine(sdpLines, 'm=', mediaType);

  if (mLineIndex === null) {
    _logger.default.debug('Failed to add bandwidth line to sdp, as no m-line found');

    return sdp;
  } // Find next m-line if any.


  var nextMLineIndex = findLineInRange(sdpLines, mLineIndex + 1, -1, 'm=');

  if (nextMLineIndex === null) {
    nextMLineIndex = sdpLines.length;
  } // Find c-line corresponding to the m-line.


  var cLineIndex = findLineInRange(sdpLines, mLineIndex + 1, nextMLineIndex, 'c=');

  if (cLineIndex === null) {
    _logger.default.debug('Failed to add bandwidth line to sdp, as no c-line found');

    return sdp;
  } // Check if bandwidth line already exists between c-line and next m-line.


  var bLineIndex = findLineInRange(sdpLines, cLineIndex + 1, nextMLineIndex, 'b=AS');

  if (bLineIndex) {
    sdpLines.splice(bLineIndex, 1);
  } // Create the b (bandwidth) sdp line.


  var bwLine = 'b=AS:' + bitrate; // As per RFC 4566, the b line should follow after c-line.

  sdpLines.splice(cLineIndex + 1, 0, bwLine);
  sdp = sdpLines.join('\r\n');
  return sdp;
} // Add an a=fmtp: x-google-min-bitrate=kbps line, if videoSendInitialBitrate
// is specified. We'll also add a x-google-min-bitrate value, since the max
// must be >= the min.


function maybeSetVideoSendInitialBitRate(sdp, params) {
  var initialBitrate = parseInt(params.videoSendInitialBitrate);

  if (!initialBitrate) {
    return sdp;
  } // Validate the initial bitrate value.


  var maxBitrate = parseInt(initialBitrate);
  var bitrate = parseInt(params.videoSendBitrate);

  if (bitrate) {
    if (initialBitrate > bitrate) {
      _logger.default.debug('Clamping initial bitrate to max bitrate of ' + bitrate + ' kbps.');

      initialBitrate = bitrate;
      params.videoSendInitialBitrate = initialBitrate;
    }

    maxBitrate = bitrate;
  }

  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineIndex = findLine(sdpLines, 'm=', 'video');

  if (mLineIndex === null) {
    _logger.default.debug('Failed to find video m-line');

    return sdp;
  } // Figure out the first codec payload type on the m=video SDP line.


  var videoMLine = sdpLines[mLineIndex];
  var pattern = new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');
  var sendPayloadType = videoMLine.split(pattern)[1].split(' ')[0];
  var fmtpLine = sdpLines[findLine(sdpLines, 'a=rtpmap', sendPayloadType)];
  var codecName = fmtpLine.split('a=rtpmap:' + sendPayloadType)[1].split('/')[0]; // Use codec from params if specified via URL param, otherwise use from SDP.

  var codec = params.videoSendCodec || codecName;
  sdp = setCodecParam(sdp, codec, 'x-google-min-bitrate', params.videoSendInitialBitrate.toString());
  sdp = setCodecParam(sdp, codec, 'x-google-max-bitrate', maxBitrate.toString());
  return sdp;
}

function removePayloadTypeFromMline(mLine, payloadType) {
  mLine = mLine.split(' ');

  for (var i = 0; i < mLine.length; ++i) {
    if (mLine[i] === payloadType.toString()) {
      mLine.splice(i, 1);
    }
  }

  return mLine.join(' ');
}

function removeCodecByName(sdpLines, codec) {
  var index = findLine(sdpLines, 'a=rtpmap', codec);

  if (index === null) {
    return sdpLines;
  }

  var payloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines.splice(index, 1); // Search for the video m= line and remove the codec.

  var mLineIndex = findLine(sdpLines, 'm=', 'video');

  if (mLineIndex === null) {
    return sdpLines;
  }

  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}

function removeCodecByPayloadType(sdpLines, payloadType) {
  var index = findLine(sdpLines, 'a=rtpmap', payloadType.toString());

  if (index === null) {
    return sdpLines;
  }

  sdpLines.splice(index, 1); // Search for the video m= line and remove the codec.

  var mLineIndex = findLine(sdpLines, 'm=', 'video');

  if (mLineIndex === null) {
    return sdpLines;
  }

  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}

function maybeRemoveVideoFec(sdp, params) {
  if (params.videoFec !== 'false') {
    return sdp;
  }

  var sdpLines = sdp.split('\r\n');
  var index = findLine(sdpLines, 'a=rtpmap', 'red');

  if (index === null) {
    return sdp;
  }

  var redPayloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines = removeCodecByPayloadType(sdpLines, redPayloadType);
  sdpLines = removeCodecByName(sdpLines, 'ulpfec'); // Remove fmtp lines associated with red codec.

  index = findLine(sdpLines, 'a=fmtp', redPayloadType.toString());

  if (index === null) {
    return sdp;
  }

  var fmtpLine = parseFmtpLine(sdpLines[index]);
  var rtxPayloadType = fmtpLine.pt;

  if (rtxPayloadType === null) {
    return sdp;
  }

  sdpLines.splice(index, 1);
  sdpLines = removeCodecByPayloadType(sdpLines, rtxPayloadType);
  return sdpLines.join('\r\n');
} // Promotes |audioSendCodec| to be the first in the m=audio line, if set.


function maybePreferAudioSendCodec(sdp, params) {
  return maybePreferCodec(sdp, 'audio', 'send', params.audioSendCodec);
} // Promotes |audioRecvCodec| to be the first in the m=audio line, if set.


function maybePreferAudioReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, 'audio', 'receive', params.audioRecvCodec);
} // Promotes |videoSendCodec| to be the first in the m=audio line, if set.


function maybePreferVideoSendCodec(sdp, params) {
  return maybePreferCodec(sdp, 'video', 'send', params.videoSendCodec);
} // Promotes |videoRecvCodec| to be the first in the m=audio line, if set.


function maybePreferVideoReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, 'video', 'receive', params.videoRecvCodec);
} // Sets |codec| as the default |type| codec if it's present.
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.


function maybePreferCodec(sdp, type, dir, codec) {
  var str = type + ' ' + dir + ' codec';

  if (!codec) {
    _logger.default.debug('No preference on ' + str + '.');

    return sdp;
  }

  _logger.default.debug('Prefer ' + str + ': ' + codec);

  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineIndex = findLine(sdpLines, 'm=', type);

  if (mLineIndex === null) {
    return sdp;
  } // If the codec is available, set it as the default in m line.


  var payload = null;

  for (var i = 0; i < sdpLines.length; i++) {
    var index = findLineInRange(sdpLines, i, -1, 'a=rtpmap', codec);

    if (index !== null) {
      payload = getCodecPayloadTypeFromLine(sdpLines[index]);

      if (payload) {
        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], payload);
      }
    }
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Set fmtp param to specific codec in SDP. If param does not exists, add it.


function setCodecParam(sdp, codec, param, value) {
  var sdpLines = sdp.split('\r\n'); // SDPs sent from MCU use \n as line break.

  if (sdpLines.length <= 1) {
    sdpLines = sdp.split('\n');
  }

  var fmtpLineIndex = findFmtpLine(sdpLines, codec);
  var fmtpObj = {};

  if (fmtpLineIndex === null) {
    var index = findLine(sdpLines, 'a=rtpmap', codec);

    if (index === null) {
      return sdp;
    }

    var payload = getCodecPayloadTypeFromLine(sdpLines[index]);
    fmtpObj.pt = payload.toString();
    fmtpObj.params = {};
    fmtpObj.params[param] = value;
    sdpLines.splice(index + 1, 0, writeFmtpLine(fmtpObj));
  } else {
    fmtpObj = parseFmtpLine(sdpLines[fmtpLineIndex]);
    fmtpObj.params[param] = value;
    sdpLines[fmtpLineIndex] = writeFmtpLine(fmtpObj);
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Remove fmtp param if it exists.


function removeCodecParam(sdp, codec, param) {
  var sdpLines = sdp.split('\r\n');
  var fmtpLineIndex = findFmtpLine(sdpLines, codec);

  if (fmtpLineIndex === null) {
    return sdp;
  }

  var map = parseFmtpLine(sdpLines[fmtpLineIndex]);
  delete map.params[param];
  var newLine = writeFmtpLine(map);

  if (newLine === null) {
    sdpLines.splice(fmtpLineIndex, 1);
  } else {
    sdpLines[fmtpLineIndex] = newLine;
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Split an fmtp line into an object including 'pt' and 'params'.


function parseFmtpLine(fmtpLine) {
  var fmtpObj = {};
  var spacePos = fmtpLine.indexOf(' ');
  var keyValues = fmtpLine.substring(spacePos + 1).split(';');
  var pattern = new RegExp('a=fmtp:(\\d+)');
  var result = fmtpLine.match(pattern);

  if (result && result.length === 2) {
    fmtpObj.pt = result[1];
  } else {
    return null;
  }

  var params = {};

  for (var i = 0; i < keyValues.length; ++i) {
    var pair = keyValues[i].split('=');

    if (pair.length === 2) {
      params[pair[0]] = pair[1];
    }
  }

  fmtpObj.params = params;
  return fmtpObj;
} // Generate an fmtp line from an object including 'pt' and 'params'.


function writeFmtpLine(fmtpObj) {
  if (!fmtpObj.hasOwnProperty('pt') || !fmtpObj.hasOwnProperty('params')) {
    return null;
  }

  var pt = fmtpObj.pt;
  var params = fmtpObj.params;
  var keyValues = [];
  var i = 0;

  for (var key in params) {
    keyValues[i] = key + '=' + params[key];
    ++i;
  }

  if (i === 0) {
    return null;
  }

  return 'a=fmtp:' + pt.toString() + ' ' + keyValues.join(';');
} // Find fmtp attribute for |codec| in |sdpLines|.


function findFmtpLine(sdpLines, codec) {
  // Find payload of codec.
  var payload = getCodecPayloadType(sdpLines, codec); // Find the payload in fmtp line.

  return payload ? findLine(sdpLines, 'a=fmtp:' + payload.toString()) : null;
} // Find the line in sdpLines that starts with |prefix|, and, if specified,
// contains |substr| (case-insensitive search).


function findLine(sdpLines, prefix, substr) {
  return findLineInRange(sdpLines, 0, -1, prefix, substr);
} // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
// and, if specified, contains |substr| (case-insensitive search).


function findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
  var realEndLine = endLine !== -1 ? endLine : sdpLines.length;

  for (var i = startLine; i < realEndLine; ++i) {
    if (sdpLines[i].indexOf(prefix) === 0) {
      if (!substr || sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
        return i;
      }
    }
  }

  return null;
} // Gets the codec payload type from sdp lines.


function getCodecPayloadType(sdpLines, codec) {
  var index = findLine(sdpLines, 'a=rtpmap', codec);
  return index ? getCodecPayloadTypeFromLine(sdpLines[index]) : null;
} // Gets the codec payload type from an a=rtpmap:X line.


function getCodecPayloadTypeFromLine(sdpLine) {
  var pattern = new RegExp('a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+');
  var result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
} // Returns a new m= line with the specified codec as the first one.


function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(' '); // Just copy the first three parameters; codec order starts on fourth.

  var newLine = elements.slice(0, 3); // Put target payload first and copy in the rest.

  newLine.push(payload);

  for (var i = 3; i < elements.length; i++) {
    if (elements[i] !== payload) {
      newLine.push(elements[i]);
    }
  }

  return newLine.join(' ');
}
/* Below are newly added functions */
// Following codecs will not be removed from SDP event they are not in the
// user-specified codec list.


var audioCodecWhiteList = ['CN', 'telephone-event'];
var videoCodecWhiteList = ['red', 'ulpfec']; // Returns a new m= line with the specified codec order.

function setCodecOrder(mLine, payloads) {
  var elements = mLine.split(' '); // Just copy the first three parameters; codec order starts on fourth.

  var newLine = elements.slice(0, 3); // Concat payload types.

  newLine = newLine.concat(payloads);
  return newLine.join(' ');
} // Append RTX payloads for existing payloads.


function appendRtxPayloads(sdpLines, payloads) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = payloads[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var payload = _step.value;
      var index = findLine(sdpLines, 'a=fmtp', 'apt=' + payload);

      if (index !== null) {
        var fmtpLine = parseFmtpLine(sdpLines[index]);
        payloads.push(fmtpLine.pt);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return payloads;
} // Remove a codec with all its associated a lines.


function removeCodecFramALine(sdpLines, payload) {
  var pattern = new RegExp('a=(rtpmap|rtcp-fb|fmtp):' + payload + '\\s');

  for (var i = sdpLines.length - 1; i > 0; i--) {
    if (sdpLines[i].match(pattern)) {
      sdpLines.splice(i, 1);
    }
  }

  return sdpLines;
} // Reorder codecs in m-line according the order of |codecs|. Remove codecs from
// m-line if it is not present in |codecs|
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.


function reorderCodecs(sdp, type, codecs) {
  if (!codecs || codecs.length === 0) {
    return sdp;
  }

  codecs = type === 'audio' ? codecs.concat(audioCodecWhiteList) : codecs.concat(videoCodecWhiteList);
  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineIndex = findLine(sdpLines, 'm=', type);

  if (mLineIndex === null) {
    return sdp;
  }

  var originPayloads = sdpLines[mLineIndex].split(' ');
  originPayloads.splice(0, 3); // If the codec is available, set it as the default in m line.

  var payloads = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = codecs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var codec = _step2.value;

      for (var i = 0; i < sdpLines.length; i++) {
        var index = findLineInRange(sdpLines, i, -1, 'a=rtpmap', codec);

        if (index !== null) {
          var payload = getCodecPayloadTypeFromLine(sdpLines[index]);

          if (payload) {
            payloads.push(payload);
            i = index;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  payloads = appendRtxPayloads(sdpLines, payloads);
  sdpLines[mLineIndex] = setCodecOrder(sdpLines[mLineIndex], payloads); // Remove a lines.

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = originPayloads[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _payload = _step3.value;

      if (payloads.indexOf(_payload) === -1) {
        sdpLines = removeCodecFramALine(sdpLines, _payload);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
}

function setMaxBitrate(sdp, encodingParametersList) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = encodingParametersList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var encodingParameters = _step4.value;

      if (encodingParameters.maxBitrate) {
        sdp = setCodecParam(sdp, encodingParameters.codec.name, 'x-google-max-bitrate', encodingParameters.maxBitrate.toString());
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return sdp;
}

},{"./logger.js":5}],10:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamEvent = exports.RemoteStream = exports.LocalStream = exports.Stream = exports.StreamSourceInfo = void 0;

var _logger = _interopRequireDefault(require("./logger.js"));

var _event = require("./event.js");

var Utils = _interopRequireWildcard(require("./utils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isAllowedValue(obj, allowedValues) {
  return allowedValues.some(function (ele) {
    return ele === obj;
  });
}
/**
 * @class StreamSourceInfo
 * @memberOf Oms.Base
 * @classDesc Information of a stream's source.
 * @constructor
 * @description Audio source info or video source info could be undefined if a stream does not have audio/video track.
 * @param {?string} audioSourceInfo Audio source info. Accepted values are: "mic", "screen-cast", "file", "mixed" or undefined.
 * @param {?string} videoSourceInfo Video source info. Accepted values are: "camera", "screen-cast", "file", "mixed" or undefined.
 */


var StreamSourceInfo = function StreamSourceInfo(audioSourceInfo, videoSourceInfo) {
  _classCallCheck(this, StreamSourceInfo);

  if (!isAllowedValue(audioSourceInfo, [undefined, 'mic', 'screen-cast', 'file', 'mixed'])) {
    throw new TypeError('Incorrect value for audioSourceInfo');
  }

  if (!isAllowedValue(videoSourceInfo, [undefined, 'camera', 'screen-cast', 'file', 'encoded-file', 'raw-file', 'mixed'])) {
    throw new TypeError('Incorrect value for videoSourceInfo');
  }

  this.audio = audioSourceInfo;
  this.video = videoSourceInfo;
};
/**
 * @class Stream
 * @memberOf Oms.Base
 * @classDesc Base class of streams.
 * @extends Oms.Base.EventDispatcher
 * @hideconstructor
 */


exports.StreamSourceInfo = StreamSourceInfo;

var Stream =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Stream, _EventDispatcher);

  function Stream(stream, sourceInfo, attributes) {
    var _this;

    _classCallCheck(this, Stream);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Stream).call(this));

    if (stream && !(stream instanceof MediaStream) || _typeof(sourceInfo) !== 'object') {
      throw new TypeError('Invalid stream or sourceInfo.');
    }

    if (stream && (stream.getAudioTracks().length > 0 && !sourceInfo.audio || stream.getVideoTracks().length > 0 && !sourceInfo.video)) {
      throw new TypeError('Missing audio source info or video source info.');
    }
    /**
     * @member {?MediaStream} mediaStream
     * @instance
     * @memberof Oms.Base.Stream
     * @see {@link https://www.w3.org/TR/mediacapture-streams/#mediastream|MediaStream API of Media Capture and Streams}.
     */


    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'mediaStream', {
      configurable: false,
      writable: true,
      value: stream
    });
    /**
     * @member {Oms.Base.StreamSourceInfo} source
     * @instance
     * @memberof Oms.Base.Stream
     * @desc Source info of a stream.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'source', {
      configurable: false,
      writable: false,
      value: sourceInfo
    });
    /**
     * @member {object} attributes
     * @instance
     * @memberof Oms.Base.Stream
     * @desc Custom attributes of a stream.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'attributes', {
      configurable: true,
      writable: false,
      value: attributes
    });
    return _this;
  }

  return Stream;
}(_event.EventDispatcher);
/**
 * @class LocalStream
 * @classDesc Stream captured from current endpoint.
 * @memberOf Oms.Base
 * @extends Oms.Base.Stream
 * @constructor
 * @param {MediaStream} stream Underlying MediaStream.
 * @param {Oms.Base.StreamSourceInfo} sourceInfo Information about stream's source.
 * @param {object} attributes Custom attributes of the stream.
 */


exports.Stream = Stream;

var LocalStream =
/*#__PURE__*/
function (_Stream) {
  _inherits(LocalStream, _Stream);

  function LocalStream(stream, sourceInfo, attributes) {
    var _this2;

    _classCallCheck(this, LocalStream);

    if (!(stream instanceof MediaStream)) {
      throw new TypeError('Invalid stream.');
    }

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(LocalStream).call(this, stream, sourceInfo, attributes));
    /**
     * @member {string} id
     * @instance
     * @memberof Oms.Base.LocalStream
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), 'id', {
      configurable: false,
      writable: false,
      value: Utils.createUuid()
    });
    return _this2;
  }

  return LocalStream;
}(Stream);
/**
 * @class RemoteStream
 * @classDesc Stream sent from a remote endpoint.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when         |
 * | ----------------| ---------------- | ------------------ |
 * | ended           | Event            | Stream is ended.   |
 * | updated         | Event            | Stream is updated. |
 *
 * @memberOf Oms.Base
 * @extends Oms.Base.Stream
 * @hideconstructor
 */


exports.LocalStream = LocalStream;

var RemoteStream =
/*#__PURE__*/
function (_Stream2) {
  _inherits(RemoteStream, _Stream2);

  function RemoteStream(id, origin, stream, sourceInfo, attributes) {
    var _this3;

    _classCallCheck(this, RemoteStream);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(RemoteStream).call(this, stream, sourceInfo, attributes));
    /**
     * @member {string} id
     * @instance
     * @memberof Oms.Base.RemoteStream
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), 'id', {
      configurable: false,
      writable: false,
      value: id ? id : Utils.createUuid()
    });
    /**
     * @member {string} origin
     * @instance
     * @memberof Oms.Base.RemoteStream
     * @desc ID of the remote endpoint who published this stream.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), 'origin', {
      configurable: false,
      writable: false,
      value: origin
    });
    /**
     * @member {Oms.Base.PublicationSettings} settings
     * @instance
     * @memberof Oms.Base.RemoteStream
     * @desc Original settings for publishing this stream. This property is only valid in conference mode.
     */

    _this3.settings = undefined;
    /**
     * @member {Oms.Conference.SubscriptionCapabilities} capabilities
     * @instance
     * @memberof Oms.Base.RemoteStream
     * @desc Capabilities remote endpoint provides for subscription. This property is only valid in conference mode.
     */

    _this3.capabilities = undefined;
    return _this3;
  }

  return RemoteStream;
}(Stream);
/**
 * @class StreamEvent
 * @classDesc Event for Stream.
 * @extends Oms.Base.OmsEvent
 * @memberof Oms.Base
 * @hideconstructor
 */


exports.RemoteStream = RemoteStream;

var StreamEvent =
/*#__PURE__*/
function (_OmsEvent) {
  _inherits(StreamEvent, _OmsEvent);

  function StreamEvent(type, init) {
    var _this4;

    _classCallCheck(this, StreamEvent);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(StreamEvent).call(this, type));
    /**
     * @member {Oms.Base.Stream} stream
     * @instance
     * @memberof Oms.Base.StreamEvent
     */

    _this4.stream = init.stream;
    return _this4;
  }

  return StreamEvent;
}(_event.OmsEvent);

exports.StreamEvent = StreamEvent;

},{"./event.js":3,"./logger.js":5,"./utils.js":11}],11:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFirefox = isFirefox;
exports.isChrome = isChrome;
exports.isSafari = isSafari;
exports.isEdge = isEdge;
exports.createUuid = createUuid;
exports.sysInfo = sysInfo;
var sdkVersion = '4.1';

function isFirefox() {
  return window.navigator.userAgent.match("Firefox") !== null;
}

function isChrome() {
  return window.navigator.userAgent.match('Chrome') !== null;
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
}

function isEdge() {
  return window.navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) !== null;
}

function createUuid() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
} // Returns system information.
// Format: {sdk:{version:**, type:**}, runtime:{version:**, name:**}, os:{version:**, name:**}};


function sysInfo() {
  var info = Object.create({});
  info.sdk = {
    version: sdkVersion,
    type: 'JavaScript'
  }; // Runtime info.

  var userAgent = navigator.userAgent;
  var firefoxRegex = /Firefox\/([0-9\.]+)/;
  var chromeRegex = /Chrome\/([0-9\.]+)/;
  var edgeRegex = /Edge\/([0-9\.]+)/;
  var safariVersionRegex = /Version\/([0-9\.]+) Safari/;
  var result = chromeRegex.exec(userAgent);

  if (result) {
    info.runtime = {
      name: 'Chrome',
      version: result[1]
    };
  } else if (result = firefoxRegex.exec(userAgent)) {
    info.runtime = {
      name: 'Firefox',
      version: result[1]
    };
  } else if (result = edgeRegex.exec(userAgent)) {
    info.runtime = {
      name: 'Edge',
      version: result[1]
    };
  } else if (isSafari()) {
    result = safariVersionRegex.exec(userAgent);
    info.runtime = {
      name: 'Safari'
    };
    info.runtime.version = result ? result[1] : 'Unknown';
  } else {
    info.runtime = {
      name: 'Unknown',
      version: 'Unknown'
    };
  } // OS info.


  var windowsRegex = /Windows NT ([0-9\.]+)/;
  var macRegex = /Intel Mac OS X ([0-9_\.]+)/;
  var iPhoneRegex = /iPhone OS ([0-9_\.]+)/;
  var linuxRegex = /X11; Linux/;
  var androidRegex = /Android( ([0-9\.]+))?/;
  var chromiumOsRegex = /CrOS/;

  if (result = windowsRegex.exec(userAgent)) {
    info.os = {
      name: 'Windows NT',
      version: result[1]
    };
  } else if (result = macRegex.exec(userAgent)) {
    info.os = {
      name: 'Mac OS X',
      version: result[1].replace(/_/g, '.')
    };
  } else if (result = iPhoneRegex.exec(userAgent)) {
    info.os = {
      name: 'iPhone OS',
      version: result[1].replace(/_/g, '.')
    };
  } else if (result = linuxRegex.exec(userAgent)) {
    info.os = {
      name: 'Linux',
      version: 'Unknown'
    };
  } else if (result = androidRegex.exec(userAgent)) {
    info.os = {
      name: 'Android',
      version: result[1] || 'Unknown'
    };
  } else if (result = chromiumOsRegex.exec(userAgent)) {
    info.os = {
      name: 'Chrome OS',
      version: 'Unknown'
    };
  } else {
    info.os = {
      name: 'Unknown',
      version: 'Unknown'
    };
  }

  info.capabilities = {
    continualIceGathering: false,
    unifiedPlan: false,
    streamRemovable: info.runtime.name !== 'Firefox'
  };
  return info;
}

  },{}],12:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferencePeerConnectionChannel = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _event = require("../base/event.js");

var _mediaformat = require("../base/mediaformat.js");

var _publication = require("../base/publication.js");

var _subscription = require("./subscription.js");

var ErrorModule = _interopRequireWildcard(require("./error.js"));

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var SdpUtils = _interopRequireWildcard(require("../base/sdputils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ConferencePeerConnectionChannel =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(ConferencePeerConnectionChannel, _EventDispatcher);

  function ConferencePeerConnectionChannel(config, signaling) {
    var _this;

    _classCallCheck(this, ConferencePeerConnectionChannel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConferencePeerConnectionChannel).call(this));
    _this._config = config;
    _this._options = null;
    _this._signaling = signaling;
    _this._pc = null;
    _this._internalId = null; // It's publication ID or subscription ID.

    _this._pendingCandidates = [];
    _this._subscribePromise = null;
    _this._publishPromise = null;
    _this._subscribedStream = null;
    _this._publishedStream = null;
    _this._publication = null;
    _this._subscription = null;
    _this._disconnectTimer = null; // Timer for PeerConnection disconnected. Will stop connection after timer.

    _this._ended = false;
    return _this;
  }

  _createClass(ConferencePeerConnectionChannel, [{
    key: "onMessage",
    value: function onMessage(notification, message) {
      switch (notification) {
        case 'progress':
          if (message.status === 'soac') this._sdpHandler(message.data);else if (message.status === 'ready') this._readyHandler();else if (message.status === 'error') this._errorHandler(message.data);
          break;

        case 'stream':
          this._onStreamEvent(message);

          break;

        default:
          _logger.default.warning('Unknown notification from MCU.');

      }
    }
  }, {
    key: "publish",
    value: function publish(stream, options) {
      var _this2 = this;

      if (options === undefined) {
        options = {
          audio: !!stream.mediaStream.getAudioTracks(),
          video: !!stream.mediaStream.getVideoTracks()
        };
      }

      if (_typeof(options) !== 'object') {
        return Promise.reject(new TypeError('Options should be an object.'));
      }

      if (options.audio === undefined) {
        options.audio = !!stream.mediaStream.getAudioTracks();
      }

      if (options.video === undefined) {
        options.video = !!stream.mediaStream.getVideoTracks();
      }

      if (!!options.audio === !stream.mediaStream.getAudioTracks().length || !!options.video === !stream.mediaStream.getVideoTracks().length) {
        return Promise.reject(new ErrorModule.ConferenceError('options.audio/video is inconsistent with tracks presented in the MediaStream.'));
      }

      if ((options.audio === false || options.audio === null) && (options.video === false || options.video === null)) {
        return Promise.reject(new ErrorModule.ConferenceError('Cannot publish a stream without audio and video.'));
      }

      if (_typeof(options.audio) === 'object') {
        if (!Array.isArray(options.audio)) {
          return Promise.reject(new TypeError('options.audio should be a boolean or an array.'));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options.audio[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var parameters = _step.value;

            if (!parameters.codec || typeof parameters.codec.name !== 'string' || parameters.maxBitrate !== undefined && typeof parameters.maxBitrate !== 'number') {
              return Promise.reject(new TypeError('options.audio has incorrect parameters.'));
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (_typeof(options.video) === 'object') {
        if (!Array.isArray(options.video)) {
          return Promise.reject(new TypeError('options.video should be a boolean or an array.'));
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = options.video[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _parameters = _step2.value;

            if (!_parameters.codec || typeof _parameters.codec.name !== 'string' || _parameters.maxBitrate !== undefined && typeof _parameters.maxBitrate !== 'number' || _parameters.codec.profile !== undefined && typeof _parameters.codec.profile !== 'string') {
              return Promise.reject(new TypeError('options.video has incorrect parameters.'));
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      this._options = options;
      var mediaOptions = {};

      this._createPeerConnection();

      if (stream.mediaStream.getAudioTracks().length > 0 && options.audio !== false && options.audio !== null) {
        if (stream.mediaStream.getAudioTracks().length > 1) {
          _logger.default.warning('Publishing a stream with multiple audio tracks is not fully supported.');
        }

        if (typeof options.audio !== 'boolean' && _typeof(options.audio) !== 'object') {
          return Promise.reject(new ErrorModule.ConferenceError('Type of audio options should be boolean or an object.'));
        }

        mediaOptions.audio = {};
        mediaOptions.audio.source = stream.source.audio;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = stream.mediaStream.getAudioTracks()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var track = _step3.value;

            this._pc.addTrack(track, stream.mediaStream);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } else {
        mediaOptions.audio = false;
      }

      if (stream.mediaStream.getVideoTracks().length > 0 && options.video !== false && options.video !== null) {
        if (stream.mediaStream.getVideoTracks().length > 1) {
          _logger.default.warning('Publishing a stream with multiple video tracks is not fully supported.');
        }

        mediaOptions.video = {};
        mediaOptions.video.source = stream.source.video;
        var trackSettings = stream.mediaStream.getVideoTracks()[0].getSettings();
        mediaOptions.video.parameters = {
          resolution: {
            width: trackSettings.width,
            height: trackSettings.height
          },
          framerate: trackSettings.frameRate
        };
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = stream.mediaStream.getVideoTracks()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _track = _step4.value;

            this._pc.addTrack(_track, stream.mediaStream);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      } else {
        mediaOptions.video = false;
      }

      this._publishedStream = stream;

      this._signaling.sendSignalingMessage('publish', {
        media: mediaOptions,
        attributes: stream.attributes
      }).then(function (data) {
        var messageEvent = new _event.MessageEvent('id', {
          message: data.id,
          origin: _this2._remoteId
        });

        _this2.dispatchEvent(messageEvent);

        _this2._internalId = data.id;
        var offerOptions = {
          offerToReceiveAudio: false,
          offerToReceiveVideo: false
        };

        if (typeof _this2._pc.addTransceiver === 'function') {
          // |direction| seems not working on Safari.
          if (mediaOptions.audio && stream.mediaStream.getAudioTracks() > 0) {
            var audioTransceiver = _this2._pc.addTransceiver('audio', {
              direction: 'sendonly'
            });
          }

          if (mediaOptions.video && stream.mediaStream.getVideoTracks() > 0) {
            var videoTransceiver = _this2._pc.addTransceiver('video', {
              direction: 'sendonly'
            });
          }
        }

        var localDesc;

        _this2._pc.createOffer(offerOptions).then(function (desc) {
          if (options) {
            desc.sdp = _this2._setRtpReceiverOptions(desc.sdp, options);
          }

          return desc;
        }).then(function (desc) {
          localDesc = desc;
          return _this2._pc.setLocalDescription(desc);
        }).then(function () {
          _this2._signaling.sendSignalingMessage('soac', {
            id: _this2._internalId,
            signaling: localDesc
          });
        }).catch(function (e) {
          _logger.default.error('Failed to create offer or set SDP. Message: ' + e.message);

          _this2._unpublish();

          _this2._rejectPromise(e);

          _this2._fireEndedEventOnPublicationOrSubscription();
        });
      }).catch(function (e) {
        _this2._unpublish();

        _this2._rejectPromise(e);

        _this2._fireEndedEventOnPublicationOrSubscription();
      });

      return new Promise(function (resolve, reject) {
        _this2._publishPromise = {
          resolve: resolve,
          reject: reject
        };
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(stream, options) {
      var _this3 = this;

      if (options === undefined) {
        options = {
          audio: !!stream.capabilities.audio,
          video: !!stream.capabilities.video
        };
      }

      if (_typeof(options) !== 'object') {
        return Promise.reject(new TypeError('Options should be an object.'));
      }

      if (options.audio === undefined) {
        options.audio = !!stream.capabilities.audio;
      }

      if (options.video === undefined) {
        options.video = !!stream.capabilities.video;
      }

      if (options.audio !== undefined && _typeof(options.audio) !== 'object' && typeof options.audio !== 'boolean' && options.audio !== null || options.video !== undefined && _typeof(options.video) !== 'object' && typeof options.video !== 'boolean' && options.video !== null) {
        return Promise.reject(new TypeError('Invalid options type.'));
      }

      if (options.audio && !stream.capabilities.audio || options.video && !stream.capabilities.video) {
        return Promise.reject(new ErrorModule.ConferenceError('options.audio/video cannot be true or an object if there is no audio/video track in remote stream.'));
      }

      if (options.audio === false && options.video === false) {
        return Promise.reject(new ErrorModule.ConferenceError('Cannot subscribe a stream without audio and video.'));
      }

      this._options = options;
      var mediaOptions = {};

      if (options.audio) {
        if (_typeof(options.audio) === 'object' && Array.isArray(options.audio.codecs)) {
          if (options.audio.codecs.length === 0) {
            return Promise.reject(new TypeError('Audio codec cannot be an empty array.'));
          }
        }

        mediaOptions.audio = {};
        mediaOptions.audio.from = stream.id;
      } else {
        mediaOptions.audio = false;
      }

      if (options.video) {
        if (_typeof(options.video) === 'object' && Array.isArray(options.video.codecs)) {
          if (options.video.codecs.length === 0) {
            return Promise.reject(new TypeError('Video codec cannot be an empty array.'));
          }
        }

        mediaOptions.video = {};
        mediaOptions.video.from = stream.id;

        if (options.video.resolution || options.video.frameRate || options.video.bitrateMultiplier && options.video.bitrateMultiplier !== 1 || options.video.keyFrameInterval) {
          mediaOptions.video.parameters = {
            resolution: options.video.resolution,
            framerate: options.video.frameRate,
            bitrate: options.video.bitrateMultiplier ? 'x' + options.video.bitrateMultiplier.toString() : undefined,
            keyFrameInterval: options.video.keyFrameInterval
          };
        }
      } else {
        mediaOptions.video = false;
      }

      this._subscribedStream = stream;

      this._signaling.sendSignalingMessage('subscribe', {
        media: mediaOptions
      }).then(function (data) {
        var messageEvent = new _event.MessageEvent('id', {
          message: data.id,
          origin: _this3._remoteId
        });

        _this3.dispatchEvent(messageEvent);

        _this3._internalId = data.id;

        _this3._createPeerConnection();

        var offerOptions = {
          offerToReceiveAudio: !!options.audio,
          offerToReceiveVideo: !!options.video
        };

        if (typeof _this3._pc.addTransceiver === 'function') {
          // |direction| seems not working on Safari.
          if (mediaOptions.audio) {
            var audioTransceiver = _this3._pc.addTransceiver('audio', {
              direction: 'recvonly'
            });
          }

          if (mediaOptions.video) {
            var videoTransceiver = _this3._pc.addTransceiver('video', {
              direction: 'recvonly'
            });
          }
        }

        _this3._pc.createOffer(offerOptions).then(function (desc) {
          if (options) {
            desc.sdp = _this3._setRtpReceiverOptions(desc.sdp, options);
          }

          _this3._pc.setLocalDescription(desc).then(function () {
            _this3._signaling.sendSignalingMessage('soac', {
              id: _this3._internalId,
              signaling: desc
            });
          }, function (errorMessage) {
            _logger.default.error('Set local description failed. Message: ' + JSON.stringify(errorMessage));
          });
        }, function (error) {
          _logger.default.error('Create offer failed. Error info: ' + JSON.stringify(error));
        }).catch(function (e) {
          _logger.default.error('Failed to create offer or set SDP. Message: ' + e.message);

          _this3._unsubscribe();

          _this3._rejectPromise(e);

          _this3._fireEndedEventOnPublicationOrSubscription();
        });
      }).catch(function (e) {
        _this3._unsubscribe();

        _this3._rejectPromise(e);

        _this3._fireEndedEventOnPublicationOrSubscription();
      });

      return new Promise(function (resolve, reject) {
        _this3._subscribePromise = {
          resolve: resolve,
          reject: reject
        };
      });
    }
  }, {
    key: "_unpublish",
    value: function _unpublish() {
      this._signaling.sendSignalingMessage('unpublish', {
        id: this._internalId
      }).catch(function (e) {
        _logger.default.warning('MCU returns negative ack for unpublishing, ' + e);
      });

      if (this._pc && this._pc.signalingState !== 'closed') {
        this._pc.close();
      }
    }
  }, {
    key: "_unsubscribe",
    value: function _unsubscribe() {
      this._signaling.sendSignalingMessage('unsubscribe', {
        id: this._internalId
      }).catch(function (e) {
        _logger.default.warning('MCU returns negative ack for unsubscribing, ' + e);
      });

      if (this._pc && this._pc.signalingState !== 'closed') {
        this._pc.close();
      }
    }
  }, {
    key: "_muteOrUnmute",
    value: function _muteOrUnmute(isMute, isPub, trackKind) {
      var _this4 = this;

      var eventName = isPub ? 'stream-control' : 'subscription-control';
      var operation = isMute ? 'pause' : 'play';
      return this._signaling.sendSignalingMessage(eventName, {
        id: this._internalId,
        operation: operation,
        data: trackKind
      }).then(function () {
        if (!isPub) {
          var muteEventName = isMute ? 'mute' : 'unmute';

          _this4._subscription.dispatchEvent(new _event.MuteEvent(muteEventName, {
            kind: trackKind
          }));
        }
      });
    }
  }, {
    key: "_applyOptions",
    value: function _applyOptions(options) {
      if (_typeof(options) !== 'object' || _typeof(options.video) !== 'object') {
        return Promise.reject(new ErrorModule.ConferenceError('Options should be an object.'));
      }

      var videoOptions = {};
      videoOptions.resolution = options.video.resolution;
      videoOptions.framerate = options.video.frameRate;
      videoOptions.bitrate = options.video.bitrateMultiplier ? 'x' + options.video.bitrateMultiplier.toString() : undefined;
      videoOptions.keyFrameInterval = options.video.keyFrameInterval;
      return this._signaling.sendSignalingMessage('subscription-control', {
        id: this._internalId,
        operation: 'update',
        data: {
          video: {
            parameters: videoOptions
          }
        }
      }).then();
    }
  }, {
    key: "_onRemoteStreamAdded",
    value: function _onRemoteStreamAdded(event) {
      _logger.default.debug('Remote stream added.');

      if (this._subscribedStream) {
        this._subscribedStream.mediaStream = event.streams[0];
      } else {
        // This is not expected path. However, this is going to happen on Safari
        // because it does not support setting direction of transceiver.
        _logger.default.warning('Received remote stream without subscription.');
      }
    }
  }, {
    key: "_onLocalIceCandidate",
    value: function _onLocalIceCandidate(event) {
      if (event.candidate) {
        if (this._pc.signalingState !== 'stable') {
          this._pendingCandidates.push(event.candidate);
        } else {
          this._sendCandidate(event.candidate);
        }
      } else {
        _logger.default.debug('Empty candidate.');
      }
    }
  }, {
    key: "_fireEndedEventOnPublicationOrSubscription",
    value: function _fireEndedEventOnPublicationOrSubscription() {
      if (this._ended) {
        return;
      }

      this._ended = true;
      var event = new _event.OmsEvent('ended');

      if (this._publication) {
        this._publication.dispatchEvent(event);

        this._publication.stop();
      } else if (this._subscription) {
        this._subscription.dispatchEvent(event);

        this._subscription.stop();
      }
    }
  }, {
    key: "_rejectPromise",
    value: function _rejectPromise(error) {
      if (!error) {
        var _error = new ErrorModule.ConferenceError('Connection failed or closed.');
      } // Rejecting corresponding promise if publishing and subscribing is ongoing.


      if (this._publishPromise) {
        this._publishPromise.reject(error);

        this._publishPromise = undefined;
      } else if (this._subscribePromise) {
        this._subscribePromise.reject(error);

        this._subscribePromise = undefined;
      }
    }
  }, {
    key: "_onIceConnectionStateChange",
    value: function _onIceConnectionStateChange(event) {
      if (!event || !event.currentTarget) return;

      _logger.default.debug('ICE connection state changed to ' + event.currentTarget.iceConnectionState);

      if (event.currentTarget.iceConnectionState === 'closed' || event.currentTarget.iceConnectionState === 'failed') {
        this._rejectPromise(new ErrorModule.ConferenceError('ICE connection failed or closed.')); // Fire ended event if publication or subscription exists.


        this._fireEndedEventOnPublicationOrSubscription();
      }
    }
  }, {
    key: "_sendCandidate",
    value: function _sendCandidate(candidate) {
      this._signaling.sendSignalingMessage('soac', {
        id: this._internalId,
        signaling: {
          type: 'candidate',
          candidate: {
            candidate: 'a=' + candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex
          }
        }
      });
    }
  }, {
    key: "_createPeerConnection",
    value: function _createPeerConnection() {
      var _this5 = this;

      var pcConfiguration = this._config.rtcConfiguration || {};

      if (Utils.isChrome()) {
        pcConfiguration.sdpSemantics = 'unified-plan';
      }

      this._pc = new RTCPeerConnection(pcConfiguration);

      this._pc.onicecandidate = function (event) {
        _this5._onLocalIceCandidate.apply(_this5, [event]);
      };

      this._pc.ontrack = function (event) {
        _this5._onRemoteStreamAdded.apply(_this5, [event]);
      };

      this._pc.oniceconnectionstatechange = function (event) {
        _this5._onIceConnectionStateChange.apply(_this5, [event]);
      };
    }
  }, {
    key: "_getStats",
    value: function _getStats() {
      if (this._pc) {
        return this._pc.getStats();
      } else {
        return Promise.reject(new ErrorModule.ConferenceError('PeerConnection is not available.'));
      }
    }
  }, {
    key: "_readyHandler",
    value: function _readyHandler() {
      var _this6 = this;

      if (this._subscribePromise) {
        this._subscription = new _subscription.Subscription(this._internalId, function () {
          _this6._unsubscribe();
        }, function () {
          return _this6._getStats();
        }, function (trackKind) {
          return _this6._muteOrUnmute(true, false, trackKind);
        }, function (trackKind) {
          return _this6._muteOrUnmute(false, false, trackKind);
        }, function (options) {
          return _this6._applyOptions(options);
        }); // Fire subscription's ended event when associated stream is ended.

        this._subscribedStream.addEventListener('ended', function () {
          _this6._subscription.dispatchEvent('ended', new _event.OmsEvent('ended'));
        });

        this._subscribePromise.resolve(this._subscription);
      } else if (this._publishPromise) {
        this._publication = new _publication.Publication(this._internalId, function () {
          _this6._unpublish();

          return Promise.resolve();
        }, function () {
          return _this6._getStats();
        }, function (trackKind) {
          return _this6._muteOrUnmute(true, true, trackKind);
        }, function (trackKind) {
          return _this6._muteOrUnmute(false, true, trackKind);
        });

        this._publishPromise.resolve(this._publication); // Do not fire publication's ended event when associated stream is ended.
        // It may still sending silence or black frames.
        // Refer to https://w3c.github.io/webrtc-pc/#rtcrtpsender-interface.

      }

      this._publishPromise = null;
      this._subscribePromise = null;
    }
  }, {
    key: "_sdpHandler",
    value: function _sdpHandler(sdp) {
      var _this7 = this;

      if (sdp.type === 'answer') {
        if ((this._publication || this._publishPromise) && this._options) {
          sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._options);
        }

        this._pc.setRemoteDescription(sdp).then(function () {
          if (_this7._pendingCandidates.length > 0) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = _this7._pendingCandidates[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var candidate = _step5.value;

                _this7._sendCandidate(candidate);
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          }
        }, function (error) {
          _logger.default.error('Set remote description failed: ' + error);

          _this7._rejectPromise(error);

          _this7._fireEndedEventOnPublicationOrSubscription();
        });
      }
    }
  }, {
    key: "_errorHandler",
    value: function _errorHandler(errorMessage) {
      var p = this._publishPromise || this._subscribePromise;

      if (p) {
        p.reject(new ErrorModule.ConferenceError(errorMessage));
        return;
      }

      var dispatcher = this._publication || this._subscription;

      if (!dispatcher) {
        _logger.default.warning('Neither publication nor subscription is available.');

        return;
      }

      var error = new ErrorModule.ConferenceError(errorMessage);
      var errorEvent = new _event.ErrorEvent('error', {
        error: error
      });
      dispatcher.dispatchEvent(errorEvent);
    }
  }, {
    key: "_setCodecOrder",
    value: function _setCodecOrder(sdp, options) {
      if (this._publication || this._publishPromise) {
        if (options.audio) {
          var audioCodecNames = Array.from(options.audio, function (encodingParameters) {
            return encodingParameters.codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'audio', audioCodecNames);
        }

        if (options.video) {
          var videoCodecNames = Array.from(options.video, function (encodingParameters) {
            return encodingParameters.codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'video', videoCodecNames);
        }
      } else {
        if (options.audio && options.audio.codecs) {
          var _audioCodecNames = Array.from(options.audio.codecs, function (codec) {
            return codec.name;
          });

          sdp = SdpUtils.reorderCodecs(sdp, 'audio', _audioCodecNames);
        }

        if (options.video && options.video.codecs) {
          var _videoCodecNames = Array.from(options.video.codecs, function (codec) {
            return codec.name;
          });

          sdp = SdpUtils.reorderCodecs(sdp, 'video', _videoCodecNames);
        }
      }

      return sdp;
    }
  }, {
    key: "_setMaxBitrate",
    value: function _setMaxBitrate(sdp, options) {
      if (_typeof(options.audio) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.audio);
      }

      if (_typeof(options.video) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.video);
      }

      return sdp;
    }
  }, {
    key: "_setRtpSenderOptions",
    value: function _setRtpSenderOptions(sdp, options) {
      sdp = this._setMaxBitrate(sdp, options);
      return sdp;
    }
  }, {
    key: "_setRtpReceiverOptions",
    value: function _setRtpReceiverOptions(sdp, options) {
      sdp = this._setCodecOrder(sdp, options);
      return sdp;
    } // Handle stream event sent from MCU. Some stream events should be publication event or subscription event. It will be handled here.

  }, {
    key: "_onStreamEvent",
    value: function _onStreamEvent(message) {
      var eventTarget;

      if (this._publication && message.id === this._publication.id) {
        eventTarget = this._publication;
      } else if (this._subscribedStream && message.id === this._subscribedStream.id) {
        eventTarget = this._subscription;
      }

      if (!eventTarget) {
        return;
      }

      var trackKind;

      if (message.data.field === 'audio.status') {
        trackKind = _mediaformat.TrackKind.AUDIO;
      } else if (message.data.field === 'video.status') {
        trackKind = _mediaformat.TrackKind.VIDEO;
      } else {
        _logger.default.warning('Invalid data field for stream update info.');
      }

      if (message.data.value === 'active') {
        eventTarget.dispatchEvent(new _event.MuteEvent('unmute', {
          kind: trackKind
        }));
      } else if (message.data.value === 'inactive') {
        eventTarget.dispatchEvent(new _event.MuteEvent('mute', {
          kind: trackKind
        }));
      } else {
        _logger.default.warning('Invalid data value for stream update info.');
      }
    }
  }]);

  return ConferencePeerConnectionChannel;
}(_event.EventDispatcher);

exports.ConferencePeerConnectionChannel = ConferencePeerConnectionChannel;

},{"../base/event.js":3,"../base/logger.js":5,"../base/mediaformat.js":6,"../base/publication.js":8,"../base/sdputils.js":9,"../base/stream.js":10,"../base/utils.js":11,"./error.js":14,"./subscription.js":21}],13:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceClient = void 0;

var EventModule = _interopRequireWildcard(require("../base/event.js"));

var _signaling = require("./signaling.js");

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _base = require("../base/base64.js");

var _error = require("./error.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var _participant2 = require("./participant.js");

var _info = require("./info.js");

var _channel = require("./channel.js");

var _mixedstream = require("./mixedstream.js");

var StreamUtilsModule = _interopRequireWildcard(require("./streamutils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignalingState = {
  READY: 1,
  CONNECTING: 2,
  CONNECTED: 3
};
var protocolVersion = '1.0';
/**
 * @class ParticipantEvent
 * @classDesc Class ParticipantEvent represents a participant event.
   @extends Oms.Base.OmsEvent
 * @memberof Oms.Conference
 * @hideconstructor
 */

var ParticipantEvent = function ParticipantEvent(type, init) {
  var that = new EventModule.OmsEvent(type, init);
  /**
   * @member {Oms.Conference.Participant} participant
   * @instance
   * @memberof Oms.Conference.ParticipantEvent
   */

  that.participant = init.participant;
  return that;
};
/**
 * @class ConferenceClientConfiguration
 * @classDesc Configuration for ConferenceClient.
 * @memberOf Oms.Conference
 * @hideconstructor
 */


var ConferenceClientConfiguration = function ConferenceClientConfiguration() {
  _classCallCheck(this, ConferenceClientConfiguration);

  /**
   * @member {?RTCConfiguration} rtcConfiguration
   * @instance
   * @memberof Oms.Conference.ConferenceClientConfiguration
   * @desc It will be used for creating PeerConnection.
   * @see {@link https://www.w3.org/TR/webrtc/#rtcconfiguration-dictionary|RTCConfiguration Dictionary of WebRTC 1.0}.
   * @example
   * // Following object can be set to conferenceClientConfiguration.rtcConfiguration.
   * {
   *   iceServers: [{
   *      urls: "stun:example.com:3478"
   *   }, {
   *     urls: [
   *       "turn:example.com:3478?transport=udp",
   *       "turn:example.com:3478?transport=tcp"
   *     ],
   *      credential: "password",
   *      username: "username"
   *   }
   * }
   */
  this.rtcConfiguration = undefined;
};
/**
 * @class ConferenceClient
 * @classdesc The ConferenceClient handles PeerConnections between client and server. For conference controlling, please refer to REST API guide.
 * Events:
 *
 * | Event Name            | Argument Type                    | Fired when       |
 * | --------------------- | ---------------------------------| ---------------- |
 * | streamadded           | Oms.Base.StreamEvent             | A new stream is available in the conference. |
 * | participantjoined     | Oms.Conference.ParticipantEvent  | A new participant joined the conference. |
 * | messagereceived       | Oms.Base.MessageEvent            | A new message is received. |
 * | serverdisconnected    | Oms.Base.OmsEvent                | Disconnected from conference server. |
 *
 * @memberof Oms.Conference
 * @extends Oms.Base.EventDispatcher
 * @constructor
 * @param {?Oms.Conference.ConferenceClientConfiguration } config Configuration for ConferenceClient.
 * @param {?Oms.Conference.SioSignaling } signalingImpl Signaling channel implementation for ConferenceClient. SDK uses default signaling channel implementation if this parameter is undefined. Currently, a Socket.IO signaling channel implementation was provided as ics.conference.SioSignaling. However, it is not recommended to directly access signaling channel or customize signaling channel for ConferenceClient as this time.
 */


var ConferenceClient = function ConferenceClient(config, signalingImpl) {
  Object.setPrototypeOf(this, new EventModule.EventDispatcher());
  config = config || {};
  var self = this;
  var signalingState = SignalingState.READY;
  var signaling = signalingImpl ? signalingImpl : new _signaling.SioSignaling();
  var me;
  var room;
  var remoteStreams = new Map(); // Key is stream ID, value is a RemoteStream.

  var participants = new Map(); // Key is participant ID, value is a Participant object.

  var publishChannels = new Map(); // Key is MediaStream's ID, value is pc channel.

  var channels = new Map(); // Key is channel's internal ID, value is channel.

  function onSignalingMessage(notification, data) {
    if (notification === 'soac' || notification === 'progress') {
      if (!channels.has(data.id)) {
        _logger.default.warning('Cannot find a channel for incoming data.');

        return;
      }

      channels.get(data.id).onMessage(notification, data);
    } else if (notification === 'stream') {
      if (data.status === 'add') {
        fireStreamAdded(data.data);
      } else if (data.status === 'remove') {
        fireStreamRemoved(data);
      } else if (data.status === 'update') {
        // Broadcast audio/video update status to channel so specific events can be fired on publication or subscription.
        if (data.data.field === 'audio.status' || data.data.field === 'video.status') {
          channels.forEach(function (c) {
            c.onMessage(notification, data);
          });
        } else if (data.data.field === 'activeInput') {
          fireActiveAudioInputChange(data);
        } else if (data.data.field === 'video.layout') {
          fireLayoutChange(data);
        } else if (data.data.field === '.') {
          updateRemoteStream(data.data.value);
        } else {
          _logger.default.warning('Unknown stream event from MCU.');
        }
      }
    } else if (notification === 'text') {
      fireMessageReceived(data);
    } else if (notification === 'participant') {
      fireParticipantEvent(data);
    }
  }

  signaling.addEventListener('data', function (event) {
    onSignalingMessage(event.message.notification, event.message.data);
  });
  signaling.addEventListener('disconnect', function () {
    clean();
    signalingState = SignalingState.READY;
    self.dispatchEvent(new EventModule.OmsEvent('serverdisconnected'));
  });

  function fireParticipantEvent(data) {
    if (data.action === 'join') {
      data = data.data;
      var participant = new _participant2.Participant(data.id, data.role, data.user);
      participants.set(data.id, participant);
      var event = new ParticipantEvent('participantjoined', {
        participant: participant
      });
      self.dispatchEvent(event);
    } else if (data.action === 'leave') {
      var participantId = data.data;

      if (!participants.has(participantId)) {
        _logger.default.warning('Received leave message from MCU for an unknown participant.');

        return;
      }

      var _participant = participants.get(participantId);

      participants.delete(participantId);

      _participant.dispatchEvent(new EventModule.OmsEvent('left'));
    }
  }

  function fireMessageReceived(data) {
    var messageEvent = new EventModule.MessageEvent('messagereceived', {
      message: data.message,
      origin: data.from,
      to: data.to
    });
    self.dispatchEvent(messageEvent);
  }

  function fireStreamAdded(info) {
    var stream = createRemoteStream(info);
    remoteStreams.set(stream.id, stream);
    var streamEvent = new StreamModule.StreamEvent('streamadded', {
      stream: stream
    });
    self.dispatchEvent(streamEvent);
  }

  function fireStreamRemoved(info) {
    if (!remoteStreams.has(info.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(info.id);
    var streamEvent = new EventModule.OmsEvent('ended');
    remoteStreams.delete(stream.id);
    stream.dispatchEvent(streamEvent);
  }

  function fireActiveAudioInputChange(info) {
    if (!remoteStreams.has(info.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(info.id);
    var streamEvent = new _mixedstream.ActiveAudioInputChangeEvent('activeaudioinputchange', {
      activeAudioInputStreamId: info.data.value
    });
    stream.dispatchEvent(streamEvent);
  }

  function fireLayoutChange(info) {
    if (!remoteStreams.has(info.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(info.id);
    var streamEvent = new _mixedstream.LayoutChangeEvent('layoutchange', {
      layout: info.data.value
    });
    stream.dispatchEvent(streamEvent);
  }

  function updateRemoteStream(streamInfo) {
    if (!remoteStreams.has(streamInfo.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(streamInfo.id);
    stream.settings = StreamUtilsModule.convertToPublicationSettings(streamInfo.media);
    stream.capabilities = StreamUtilsModule.convertToSubscriptionCapabilities(streamInfo.media);
    var streamEvent = new EventModule.OmsEvent('updated');
    stream.dispatchEvent(streamEvent);
  }

  function createRemoteStream(streamInfo) {
    if (streamInfo.type === 'mixed') {
      return new _mixedstream.RemoteMixedStream(streamInfo);
    } else {
      var audioSourceInfo, videoSourceInfo;

      if (streamInfo.media.audio) {
        audioSourceInfo = streamInfo.media.audio.source;
      }

      if (streamInfo.media.video) {
        videoSourceInfo = streamInfo.media.video.source;
      }

      var stream = new StreamModule.RemoteStream(streamInfo.id, streamInfo.info.owner, undefined, new StreamModule.StreamSourceInfo(audioSourceInfo, videoSourceInfo), streamInfo.info.attributes);
      stream.settings = StreamUtilsModule.convertToPublicationSettings(streamInfo.media);
      stream.capabilities = StreamUtilsModule.convertToSubscriptionCapabilities(streamInfo.media);
      return stream;
    }
  }

  function sendSignalingMessage(type, message) {
    return signaling.send(type, message);
  }

  function createPeerConnectionChannel() {
    // Construct an signaling sender/receiver for ConferencePeerConnection.
    var signalingForChannel = Object.create(EventModule.EventDispatcher);
    signalingForChannel.sendSignalingMessage = sendSignalingMessage;
    var pcc = new _channel.ConferencePeerConnectionChannel(config, signalingForChannel);
    pcc.addEventListener('id', function (messageEvent) {
      channels.set(messageEvent.message, pcc);
    });
    return pcc;
  }

  function clean() {
    participants.clear();
    remoteStreams.clear();
  }

  Object.defineProperty(this, 'info', {
    configurable: false,
    get: function get() {
      if (!room) {
        return null;
      }

      return new _info.ConferenceInfo(room.id, Array.from(participants, function (x) {
        return x[1];
      }), Array.from(remoteStreams, function (x) {
        return x[1];
      }), me);
    }
  });
  /**
   * @function join
   * @instance
   * @desc Join a conference.
   * @memberof Oms.Conference.ConferenceClient
   * @returns {Promise<ConferenceInfo, Error>} Return a promise resolved with current conference's information if successfully join the conference. Or return a promise rejected with a newly created Oms.Error if failed to join the conference.
   * @param {string} token Token is issued by conference server(nuve).
   */

  this.join = function (tokenString) {
    return new Promise(function (resolve, reject) {
      var token = JSON.parse(_base.Base64.decodeBase64(tokenString));
      var isSecured = token.secure === true;
      var host = token.host;

      if (typeof host !== 'string') {
        reject(new _error.ConferenceError('Invalid host.'));
        return;
      }

      if (host.indexOf('http') === -1) {
        host = isSecured ? 'https://' + host : 'http://' + host;
      }

      if (signalingState !== SignalingState.READY) {
        reject(new _error.ConferenceError('connection state invalid'));
        return;
      }

      signalingState = SignalingState.CONNECTING;
      var loginInfo = {
        token: tokenString,
        userAgent: Utils.sysInfo(),
        protocol: protocolVersion
      };
      signaling.connect(host, isSecured, loginInfo).then(function (resp) {
        signalingState = SignalingState.CONNECTED;
        room = resp.room;

        if (room.streams !== undefined) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = room.streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var st = _step.value;

              if (st.type === 'mixed') {
                st.viewport = st.info.label;
              }

              remoteStreams.set(st.id, createRemoteStream(st));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

        }

        if (resp.room && resp.room.participants !== undefined) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = resp.room.participants[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var p = _step2.value;
              participants.set(p.id, new _participant2.Participant(p.id, p.role, p.user));

              if (p.id === resp.id) {
                me = participants.get(p.id);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        resolve(new _info.ConferenceInfo(resp.room.id, Array.from(participants.values()), Array.from(remoteStreams.values()), me));
      }, function (e) {
        signalingState = SignalingState.READY;
        reject(new _error.ConferenceError(e));
      });
    });
  };
  /**
   * @function publish
   * @memberof Oms.Conference.ConferenceClient
   * @instance
   * @desc Publish a LocalStream to conference server. Other participants will be able to subscribe this stream when it is successfully published.
   * @param {Oms.Base.LocalStream} stream The stream to be published.
   * @param {Oms.Base.PublishOptions} options Options for publication.
   * @returns {Promise<Publication, Error>} Returned promise will be resolved with a newly created Publication once specific stream is successfully published, or rejected with a newly created Error if stream is invalid or options cannot be satisfied. Successfully published means PeerConnection is established and server is able to process media data.
   */


  this.publish = function (stream, options) {
    if (!(stream instanceof StreamModule.LocalStream)) {
      return Promise.reject(new _error.ConferenceError('Invalid stream.'));
    }

    if (publishChannels.has(stream.mediaStream.id)) {
      return Promise.reject(new _error.ConferenceError('Cannot publish a published stream.'));
    }

    var channel = createPeerConnectionChannel();
    return channel.publish(stream, options);
  };
  /**
   * @function subscribe
   * @memberof Oms.Conference.ConferenceClient
   * @instance
   * @desc Subscribe a RemoteStream from conference server.
   * @param {Oms.Base.RemoteStream} stream The stream to be subscribed.
   * @param {Oms.Conference.SubscribeOptions} options Options for subscription.
   * @returns {Promise<Subscription, Error>} Returned promise will be resolved with a newly created Subscription once specific stream is successfully subscribed, or rejected with a newly created Error if stream is invalid or options cannot be satisfied. Successfully subscribed means PeerConnection is established and server was started to send media data.
   */


  this.subscribe = function (stream, options) {
    if (!(stream instanceof StreamModule.RemoteStream)) {
      return Promise.reject(new _error.ConferenceError('Invalid stream.'));
    }

    var channel = createPeerConnectionChannel();
    return channel.subscribe(stream, options);
  };
  /**
   * @function send
   * @memberof Oms.Conference.ConferenceClient
   * @instance
   * @desc Send a text message to a participant or all participants.
   * @param {string} message Message to be sent.
   * @param {string} participantId Receiver of this message. Message will be sent to all participants if participantId is undefined.
   * @returns {Promise<void, Error>} Returned promise will be resolved when conference server received certain message.
   */


  this.send = function (message, participantId) {
    if (participantId === undefined) {
      participantId = 'all';
    }

    return sendSignalingMessage('text', {
      to: participantId,
      message: message
    });
  };
  /**
   * @function leave
   * @memberOf Oms.Conference.ConferenceClient
   * @instance
   * @desc Leave a conference.
   * @returns {Promise<void, Error>} Returned promise will be resolved with undefined once the connection is disconnected.
   */


  this.leave = function () {
    return signaling.disconnect().then(function () {
      clean();
      signalingState = SignalingState.READY;
    });
  };
};

exports.ConferenceClient = ConferenceClient;

},{"../base/base64.js":1,"../base/event.js":3,"../base/logger.js":5,"../base/stream.js":10,"../base/utils.js":11,"./channel.js":12,"./error.js":14,"./info.js":16,"./mixedstream.js":17,"./participant.js":18,"./signaling.js":19,"./streamutils.js":20}],14:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceError = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ConferenceError =
/*#__PURE__*/
function (_Error) {
  _inherits(ConferenceError, _Error);

  function ConferenceError(message) {
    _classCallCheck(this, ConferenceError);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConferenceError).call(this, message));
  }

  return ConferenceError;
}(_wrapNativeSuper(Error));

exports.ConferenceError = ConferenceError;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ConferenceClient", {
  enumerable: true,
  get: function get() {
    return _client.ConferenceClient;
  }
});
Object.defineProperty(exports, "SioSignaling", {
  enumerable: true,
  get: function get() {
    return _signaling.SioSignaling;
  }
});

var _client = require("./client.js");

var _signaling = require("./signaling.js");

},{"./client.js":13,"./signaling.js":19}],16:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * @class ConferenceInfo
 * @classDesc Information for a conference.
 * @memberOf Oms.Conference
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceInfo = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConferenceInfo = function ConferenceInfo(id, participants, remoteStreams, myInfo) {
  _classCallCheck(this, ConferenceInfo);

  /**
   * @member {string} id
   * @instance
   * @memberof Oms.Conference.ConferenceInfo
   * @desc Conference ID.
   */
  this.id = id;
  /**
   * @member {Array<Oms.Conference.Participant>} participants
   * @instance
   * @memberof Oms.Conference.ConferenceInfo
   * @desc Participants in the conference.
   */

  this.participants = participants;
  /**
   * @member {Array<Oms.Base.RemoteStream>} remoteStreams
   * @instance
   * @memberof Oms.Conference.ConferenceInfo
   * @desc Streams published by participants. It also includes streams published by current user.
   */

  this.remoteStreams = remoteStreams;
  /**
   * @member {Oms.Base.Participant} self
   * @instance
   * @memberof Oms.Conference.ConferenceInfo
   */

  this.self = myInfo;
};

exports.ConferenceInfo = ConferenceInfo;

},{}],17:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayoutChangeEvent = exports.ActiveAudioInputChangeEvent = exports.RemoteMixedStream = void 0;

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var StreamUtilsModule = _interopRequireWildcard(require("./streamutils.js"));

var _event = require("../base/event.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class RemoteMixedStream
 * @classDesc Mixed stream from conference server.
 * Events:
 *
 * | Event Name             | Argument Type    | Fired when       |
 * | -----------------------| ---------------- | ---------------- |
 * | activeaudioinputchange | Event            | Audio activeness of input stream(of the mixed stream) is changed. |
 * | layoutchange           | Event            | Video's layout has been changed. It usually happens when a new video is mixed into the target mixed stream or an existing video has been removed from mixed stream. |
 *
 * @memberOf Oms.Conference
 * @extends Oms.Base.RemoteStream
 * @hideconstructor
 */
var RemoteMixedStream =
/*#__PURE__*/
function (_StreamModule$RemoteS) {
  _inherits(RemoteMixedStream, _StreamModule$RemoteS);

  function RemoteMixedStream(info) {
    var _this;

    _classCallCheck(this, RemoteMixedStream);

    if (info.type !== 'mixed') {
      throw new TypeError('Not a mixed stream');
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RemoteMixedStream).call(this, info.id, undefined, undefined, new StreamModule.StreamSourceInfo('mixed', 'mixed')));
    _this.settings = StreamUtilsModule.convertToPublicationSettings(info.media);
    _this.capabilities = new StreamUtilsModule.convertToSubscriptionCapabilities(info.media);
    return _this;
  }

  return RemoteMixedStream;
}(StreamModule.RemoteStream);
/**
 * @class ActiveAudioInputChangeEvent
 * @classDesc Class ActiveInputChangeEvent represents an active audio input change event.
 * @memberof Oms.Conference
 * @hideconstructor
 */


exports.RemoteMixedStream = RemoteMixedStream;

var ActiveAudioInputChangeEvent =
/*#__PURE__*/
function (_OmsEvent) {
  _inherits(ActiveAudioInputChangeEvent, _OmsEvent);

  function ActiveAudioInputChangeEvent(type, init) {
    var _this2;

    _classCallCheck(this, ActiveAudioInputChangeEvent);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ActiveAudioInputChangeEvent).call(this, type));
    /**
     * @member {string} activeAudioInputStreamId
     * @instance
     * @memberof Oms.Conference.ActiveAudioInputChangeEvent
     * @desc The ID of input stream(of the mixed stream) whose audio is active.
     */

    _this2.activeAudioInputStreamId = init.activeAudioInputStreamId;
    return _this2;
  }

  return ActiveAudioInputChangeEvent;
}(_event.OmsEvent);
/**
 * @class LayoutChangeEvent
 * @classDesc Class LayoutChangeEvent represents an video layout change event.
 * @memberof Oms.Conference
 * @hideconstructor
 */


exports.ActiveAudioInputChangeEvent = ActiveAudioInputChangeEvent;

var LayoutChangeEvent =
/*#__PURE__*/
function (_OmsEvent2) {
  _inherits(LayoutChangeEvent, _OmsEvent2);

  function LayoutChangeEvent(type, init) {
    var _this3;

    _classCallCheck(this, LayoutChangeEvent);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(LayoutChangeEvent).call(this, type));
    /**
     * @member {object} layout
     * @instance
     * @memberof Oms.Conference.LayoutChangeEvent
     * @desc Current video's layout. It's an array of map which maps each stream to a region.
     */

    _this3.layout = init.layout;
    return _this3;
  }

  return LayoutChangeEvent;
}(_event.OmsEvent);

exports.LayoutChangeEvent = LayoutChangeEvent;

},{"../base/event.js":3,"../base/stream.js":10,"./streamutils.js":20}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Participant = void 0;

var EventModule = _interopRequireWildcard(require("../base/event.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

'use strict';
/**
 * @class Participant
 * @memberOf Oms.Conference
 * @classDesc The Participant defines a participant in a conference.
 * Events:
 *
 * | Event Name      | Argument Type      | Fired when       |
 * | ----------------| ------------------ | ---------------- |
 * | left            | Oms.Base.OmsEvent  | The participant left the conference. |
 *
 * @extends Oms.Base.EventDispatcher
 * @hideconstructor
 */


var Participant =
/*#__PURE__*/
function (_EventModule$EventDis) {
  _inherits(Participant, _EventModule$EventDis);

  function Participant(id, role, userId) {
    var _this;

    _classCallCheck(this, Participant);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Participant).call(this));
    /**
     * @member {string} id
     * @instance
     * @memberof Oms.Conference.Participant
     * @desc The ID of the participant. It varies when a single user join different conferences.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'id', {
      configurable: false,
      writable: false,
      value: id
    });
    /**
     * @member {string} role
     * @instance
     * @memberof Oms.Conference.Participant
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'role', {
      configurable: false,
      writable: false,
      value: role
    });
    /**
     * @member {string} userId
     * @instance
     * @memberof Oms.Conference.Participant
     * @desc The user ID of the participant. It can be integrated into existing account management system.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'userId', {
      configurable: false,
      writable: false,
      value: userId
    });
    return _this;
  }

  return Participant;
}(EventModule.EventDispatcher);

exports.Participant = Participant;

},{"../base/event.js":3}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SioSignaling = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var EventModule = _interopRequireWildcard(require("../base/event.js"));

var _error = require("./error.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

'use strict';

function handleResponse(status, data, resolve, reject) {
  if (status === 'ok' || status === 'success') {
    resolve(data);
  } else if (status === 'error') {
    reject(data);
  } else {
    _logger.default.error('MCU returns unknown ack.');
  }
}

    var MAX_TRIALS = 5;
/**
 * @class SioSignaling
 * @classdesc Socket.IO signaling channel for ConferenceClient. It is not recommended to directly access this class.
 * @memberof Oms.Conference
 * @extends Oms.Base.EventDispatcher
 * @constructor
 * @param {?Object } sioConfig Configuration for Socket.IO options.
 * @see https://socket.io/docs/client-api/#io-url-options
 */

var SioSignaling =
/*#__PURE__*/
function (_EventModule$EventDis) {
  _inherits(SioSignaling, _EventModule$EventDis);

  function SioSignaling() {
    var _this;

    _classCallCheck(this, SioSignaling);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SioSignaling).call(this));
    _this._socket = null;
    _this._loggedIn = false;
    _this._reconnectTimes = 0;
    _this._reconnectionTicket = null;
    return _this;
  }

  _createClass(SioSignaling, [{
    key: "connect",
    value: function connect(host, isSecured, loginInfo) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var opts = {
          'reconnection': true,
          'reconnectionAttempts': MAX_TRIALS,
          'force new connection': true
        };
        _this2._socket = io(host, opts);
        ['participant', 'text', 'stream', 'progress'].forEach(function (notification) {
          _this2._socket.on(notification, function (data) {
            _this2.dispatchEvent(new EventModule.MessageEvent('data', {
              message: {
                notification: notification,
                data: data
              }
            }));
          });
        });

        _this2._socket.on('reconnecting', function () {
          _this2._reconnectTimes++;
        });

        _this2._socket.on('reconnect_failed', function () {
          if (_this2._reconnectTimes >= MAX_TRIALS) {
            _this2.dispatchEvent(new EventModule.OmsEvent('disconnect'));
          }
        });

        _this2._socket.on('drop', function () {
          _this2._reconnectTimes = MAX_TRIALS;
        });

        _this2._socket.on('disconnect', function () {
          if (_this2._reconnectTimes >= MAX_TRIALS) {
            _this2._loggedIn = false;

            _this2.dispatchEvent(new EventModule.OmsEvent('disconnect'));
          }
        });

        _this2._socket.emit('login', loginInfo, function (status, data) {
          if (status === 'ok') {
            _this2._loggedIn = true;
            _this2._reconnectionTicket = data.reconnectionTicket;

            _this2._socket.on('connect', function () {
              // re-login with reconnection ticket.
              _this2._socket.emit('relogin', _this2._reconnectionTicket, function (status, data) {
                if (status === 'ok') {
                  _this2._reconnectTimes = 0;
                  _this2._reconnectionTicket = data;
                } else {
                  _this2.dispatchEvent(new EventModule.OmsEvent('disconnect'));
                }
              });
            });
          }

          handleResponse(status, data, resolve, reject);
        });
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      var _this3 = this;

      if (!this._socket || this._socket.disconnected) {
        return Promise.reject(new _error.ConferenceError('Portal is not connected.'));
      }

      return new Promise(function (resolve, reject) {
        _this3._socket.emit('logout', function (status, data) {
          // Maximize the reconnect times to disable reconnection.
          _this3._reconnectTimes = MAX_TRIALS;

          _this3._socket.disconnect();

          handleResponse(status, data, resolve, reject);
        });
      });
    }
  }, {
    key: "send",
    value: function send(requestName, requestData) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4._socket.emit(requestName, requestData, function (status, data) {
          handleResponse(status, data, resolve, reject);
        });
      });
    }
  }]);

  return SioSignaling;
}(EventModule.EventDispatcher);

exports.SioSignaling = SioSignaling;

},{"../base/event.js":3,"../base/logger.js":5,"./error.js":14}],20:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToPublicationSettings = convertToPublicationSettings;
exports.convertToSubscriptionCapabilities = convertToSubscriptionCapabilities;

var PublicationModule = _interopRequireWildcard(require("../base/publication.js"));

var MediaFormatModule = _interopRequireWildcard(require("../base/mediaformat.js"));

var CodecModule = _interopRequireWildcard(require("../base/codec.js"));

var SubscriptionModule = _interopRequireWildcard(require("./subscription.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function extractBitrateMultiplier(input) {
  if (typeof input !== 'string' || !input.startsWith('x')) {
    L.Logger.warning('Invalid bitrate multiplier input.');
    return 0;
  }

  return Number.parseFloat(input.replace(/^x/, ''));
}

function sortNumbers(x, y) {
  return x - y;
}

function sortResolutions(x, y) {
  if (x.width !== y.width) {
    return x.width - y.width;
  } else {
    return x.height - y.height;
  }
}

function convertToPublicationSettings(mediaInfo) {
  var audio, audioCodec, video, videoCodec, resolution, framerate, bitrate, keyFrameInterval;

  if (mediaInfo.audio) {
    if (mediaInfo.audio.format) {
      audioCodec = new CodecModule.AudioCodecParameters(mediaInfo.audio.format.codec, mediaInfo.audio.format.channelNum, mediaInfo.audio.format.sampleRate);
    }

    audio = new PublicationModule.AudioPublicationSettings(audioCodec);
  }

  if (mediaInfo.video) {
    if (mediaInfo.video.format) {
      videoCodec = new CodecModule.VideoCodecParameters(mediaInfo.video.format.codec, mediaInfo.video.format.profile);
    }

    if (mediaInfo.video.parameters) {
      if (mediaInfo.video.parameters.resolution) {
        resolution = new MediaFormatModule.Resolution(mediaInfo.video.parameters.resolution.width, mediaInfo.video.parameters.resolution.height);
      }

      framerate = mediaInfo.video.parameters.framerate;
      bitrate = mediaInfo.video.parameters.bitrate * 1000;
      keyFrameInterval = mediaInfo.video.parameters.keyFrameInterval;
    }

    video = new PublicationModule.VideoPublicationSettings(videoCodec, resolution, framerate, bitrate, keyFrameInterval);
  }

  return new PublicationModule.PublicationSettings(audio, video);
}

function convertToSubscriptionCapabilities(mediaInfo) {
  var audio, video;

  if (mediaInfo.audio) {
    var audioCodecs = [];

    if (mediaInfo.audio && mediaInfo.audio.format) {
      audioCodecs.push(new CodecModule.AudioCodecParameters(mediaInfo.audio.format.codec, mediaInfo.audio.format.channelNum, mediaInfo.audio.format.sampleRate));
    }

    if (mediaInfo.audio && mediaInfo.audio.optional && mediaInfo.audio.optional.format) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = mediaInfo.audio.optional.format[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var audioCodecInfo = _step.value;
          var audioCodec = new CodecModule.AudioCodecParameters(audioCodecInfo.codec, audioCodecInfo.channelNum, audioCodecInfo.sampleRate);
          audioCodecs.push(audioCodec);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    audioCodecs.sort();
    audio = new SubscriptionModule.AudioSubscriptionCapabilities(audioCodecs);
  }

  if (mediaInfo.video) {
    var videoCodecs = [];

    if (mediaInfo.video && mediaInfo.video.format) {
      videoCodecs.push(new CodecModule.VideoCodecParameters(mediaInfo.video.format.codec, mediaInfo.video.format.profile));
    }

    if (mediaInfo.video && mediaInfo.video.optional && mediaInfo.video.optional.format) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = mediaInfo.video.optional.format[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var videoCodecInfo = _step2.value;
          var videoCodec = new CodecModule.VideoCodecParameters(videoCodecInfo.codec, videoCodecInfo.profile);
          videoCodecs.push(videoCodec);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    videoCodecs.sort();
    var resolutions = Array.from(mediaInfo.video.optional.parameters.resolution, function (r) {
      return new MediaFormatModule.Resolution(r.width, r.height);
    });

    if (mediaInfo.video && mediaInfo.video.parameters && mediaInfo.video.parameters.resolution) {
      resolutions.push(new MediaFormatModule.Resolution(mediaInfo.video.parameters.resolution.width, mediaInfo.video.parameters.resolution.height));
    }

    resolutions.sort(sortResolutions);
    var bitrates = Array.from(mediaInfo.video.optional.parameters.bitrate, function (bitrate) {
      return extractBitrateMultiplier(bitrate);
    });
    bitrates.push(1.0);
    bitrates.sort(sortNumbers);
    var frameRates = JSON.parse(JSON.stringify(mediaInfo.video.optional.parameters.framerate));

    if (mediaInfo.video && mediaInfo.video.parameters && mediaInfo.video.parameters.framerate) {
      frameRates.push(mediaInfo.video.parameters.framerate);
    }

    frameRates.sort(sortNumbers);
    var keyFrameIntervals = JSON.parse(JSON.stringify(mediaInfo.video.optional.parameters.keyFrameInterval));

    if (mediaInfo.video && mediaInfo.video.parameters && mediaInfo.video.parameters.keyFrameInterval) {
      keyFrameIntervals.push(mediaInfo.video.parameters.keyFrameInterval);
    }

    keyFrameIntervals.sort(sortNumbers);
    video = new SubscriptionModule.VideoSubscriptionCapabilities(videoCodecs, resolutions, frameRates, bitrates, keyFrameIntervals);
  }

  return new SubscriptionModule.SubscriptionCapabilities(audio, video);
}

},{"../base/codec.js":2,"../base/mediaformat.js":6,"../base/publication.js":8,"./subscription.js":21}],21:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subscription = exports.SubscriptionUpdateOptions = exports.VideoSubscriptionUpdateOptions = exports.SubscribeOptions = exports.VideoSubscriptionConstraints = exports.AudioSubscriptionConstraints = exports.SubscriptionCapabilities = exports.VideoSubscriptionCapabilities = exports.AudioSubscriptionCapabilities = void 0;

var MediaFormatModule = _interopRequireWildcard(require("../base/mediaformat.js"));

var CodecModule = _interopRequireWildcard(require("../base/codec.js"));

var _event = require("../base/event.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioSubscriptionCapabilities
 * @memberOf Oms.Conference
 * @classDesc Represents the audio capability for subscription.
 * @hideconstructor
 */
var AudioSubscriptionCapabilities = function AudioSubscriptionCapabilities(codecs) {
  _classCallCheck(this, AudioSubscriptionCapabilities);

  /**
   * @member {Array.<Oms.Base.AudioCodecParameters>} codecs
   * @instance
   * @memberof Oms.Conference.AudioSubscriptionCapabilities
   */
  this.codecs = codecs;
};
/**
 * @class VideoSubscriptionCapabilities
 * @memberOf Oms.Conference
 * @classDesc Represents the video capability for subscription.
 * @hideconstructor
 */


exports.AudioSubscriptionCapabilities = AudioSubscriptionCapabilities;

var VideoSubscriptionCapabilities = function VideoSubscriptionCapabilities(codecs, resolutions, frameRates, bitrateMultipliers, keyFrameIntervals) {
  _classCallCheck(this, VideoSubscriptionCapabilities);

  /**
   * @member {Array.<Oms.Base.VideoCodecParameters>} codecs
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionCapabilities
   */
  this.codecs = codecs;
  /**
   * @member {Array.<Oms.Base.Resolution>} resolution
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionCapabilities
   */

  this.resolutions = resolutions;
  /**
   * @member {Array.<number>} frameRates
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionCapabilities
   */

  this.frameRates = frameRates;
  /**
   * @member {Array.<number>} bitrateMultipliers
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionCapabilities
   */

  this.bitrateMultipliers = bitrateMultipliers;
  /**
   * @member {Array.<number>} keyFrameIntervals
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionCapabilities
   */

  this.keyFrameIntervals = keyFrameIntervals;
};
/**
 * @class SubscriptionCapabilities
 * @memberOf Oms.Conference
 * @classDesc Represents the capability for subscription.
 * @hideconstructor
 */


exports.VideoSubscriptionCapabilities = VideoSubscriptionCapabilities;

var SubscriptionCapabilities = function SubscriptionCapabilities(audio, video) {
  _classCallCheck(this, SubscriptionCapabilities);

  /**
   * @member {?AudioSubscriptionCapabilities} audio
   * @instance
   * @memberof Oms.Conference.SubscriptionCapabilities
   */
  this.audio = audio;
  /**
   * @member {?VideoSubscriptionCapabilities} video
   * @instance
   * @memberof Oms.Conference.SubscriptionCapabilities
   */

  this.video = video;
};
/**
 * @class AudioSubscriptionConstraints
 * @memberOf Oms.Conference
 * @classDesc Represents the audio constraints for subscription.
 * @hideconstructor
 */


exports.SubscriptionCapabilities = SubscriptionCapabilities;

var AudioSubscriptionConstraints = function AudioSubscriptionConstraints(codecs) {
  _classCallCheck(this, AudioSubscriptionConstraints);

  /**
   * @member {?Array.<Oms.Base.AudioCodecParameters>} codecs
   * @instance
   * @memberof Oms.Conference.AudioSubscriptionConstraints
   * @desc Codecs accepted. If none of `codecs` supported by both sides, connection fails. Leave it undefined will use all possible codecs.
   */
  this.codecs = codecs;
};
/**
 * @class VideoSubscriptionConstraints
 * @memberOf Oms.Conference
 * @classDesc Represents the video constraints for subscription.
 * @hideconstructor
 */


exports.AudioSubscriptionConstraints = AudioSubscriptionConstraints;

var VideoSubscriptionConstraints = function VideoSubscriptionConstraints(codecs, resolution, frameRate, bitrateMultiplier, keyFrameInterval) {
  _classCallCheck(this, VideoSubscriptionConstraints);

  /**
   * @member {?Array.<Oms.Base.VideoCodecParameters>} codecs
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionConstraints
   * @desc Codecs accepted. If none of `codecs` supported by both sides, connection fails. Leave it undefined will use all possible codecs.
   */
  this.codecs = codecs;
  /**
   * @member {?Oms.Base.Resolution} resolution
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionConstraints
   * @desc Only resolutions listed in VideoSubscriptionCapabilities are allowed.
   */

  this.resolution = resolution;
  /**
   * @member {?number} frameRate
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionConstraints
   * @desc Only frameRates listed in VideoSubscriptionCapabilities are allowed.
   */

  this.frameRate = frameRate;
  /**
   * @member {?number} bitrateMultiplier
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionConstraints
   * @desc Only bitrateMultipliers listed in VideoSubscriptionCapabilities are allowed.
   */

  this.bitrateMultiplier = bitrateMultiplier;
  /**
   * @member {?number} keyFrameInterval
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionConstraints
   * @desc Only keyFrameIntervals listed in VideoSubscriptionCapabilities are allowed.
   */

  this.keyFrameInterval = keyFrameInterval;
};
/**
 * @class SubscribeOptions
 * @memberOf Oms.Conference
 * @classDesc SubscribeOptions defines options for subscribing a Oms.Base.RemoteStream.
 */


exports.VideoSubscriptionConstraints = VideoSubscriptionConstraints;

var SubscribeOptions = function SubscribeOptions(audio, video) {
  _classCallCheck(this, SubscribeOptions);

  /**
   * @member {?AudioSubscriptionConstraints} audio
   * @instance
   * @memberof Oms.Conference.SubscribeOptions
   */
  this.audio = audio;
  /**
   * @member {?VideoSubscriptionConstraints} video
   * @instance
   * @memberof Oms.Conference.SubscribeOptions
   */

  this.video = video;
};
/**
 * @class VideoSubscriptionUpdateOptions
 * @memberOf Oms.Conference
 * @classDesc VideoSubscriptionUpdateOptions defines options for updating a subscription's video part.
 * @hideconstructor
 */


exports.SubscribeOptions = SubscribeOptions;

var VideoSubscriptionUpdateOptions = function VideoSubscriptionUpdateOptions() {
  _classCallCheck(this, VideoSubscriptionUpdateOptions);

  /**
   * @member {?Oms.Base.Resolution} resolution
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionUpdateOptions
   * @desc Only resolutions listed in VideoSubscriptionCapabilities are allowed.
   */
  this.resolution = undefined;
  /**
   * @member {?number} frameRates
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionUpdateOptions
   * @desc Only frameRates listed in VideoSubscriptionCapabilities are allowed.
   */

  this.frameRate = undefined;
  /**
   * @member {?number} bitrateMultipliers
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionUpdateOptions
   * @desc Only bitrateMultipliers listed in VideoSubscriptionCapabilities are allowed.
   */

  this.bitrateMultipliers = undefined;
  /**
   * @member {?number} keyFrameIntervals
   * @instance
   * @memberof Oms.Conference.VideoSubscriptionUpdateOptions
   * @desc Only keyFrameIntervals listed in VideoSubscriptionCapabilities are allowed.
   */

  this.keyFrameInterval = undefined;
};
/**
 * @class SubscriptionUpdateOptions
 * @memberOf Oms.Conference
 * @classDesc SubscriptionUpdateOptions defines options for updating a subscription.
 * @hideconstructor
 */


exports.VideoSubscriptionUpdateOptions = VideoSubscriptionUpdateOptions;

var SubscriptionUpdateOptions = function SubscriptionUpdateOptions() {
  _classCallCheck(this, SubscriptionUpdateOptions);

  /**
   * @member {?VideoSubscriptionUpdateOptions} video
   * @instance
   * @memberof Oms.Conference.SubscriptionUpdateOptions
   */
  this.video = undefined;
};
/**
 * @class Subscription
 * @memberof Oms.Conference
 * @classDesc Subscription is a receiver for receiving a stream.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | ended           | Event            | Subscription is ended. |
 * | mute            | MuteEvent        | Publication is muted. Remote side stopped sending audio and/or video data. |
 * | unmute          | MuteEvent        | Publication is unmuted. Remote side continued sending audio and/or video data. |
 *
 * @extends Oms.Base.EventDispatcher
 * @hideconstructor
 */


exports.SubscriptionUpdateOptions = SubscriptionUpdateOptions;

var Subscription =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Subscription, _EventDispatcher);

  function Subscription(id, stop, getStats, mute, unmute, applyOptions) {
    var _this;

    _classCallCheck(this, Subscription);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Subscription).call(this));

    if (!id) {
      throw new TypeError('ID cannot be null or undefined.');
    }
    /**
     * @member {string} id
     * @instance
     * @memberof Oms.Conference.Subscription
     */


    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'id', {
      configurable: false,
      writable: false,
      value: id
    });
    /**
     * @function stop
     * @instance
     * @desc Stop certain subscription. Once a subscription is stopped, it cannot be recovered.
     * @memberof Oms.Conference.Subscription
     * @returns {undefined}
     */

    _this.stop = stop;
    /**
     * @function getStats
     * @instance
     * @desc Get stats of underlying PeerConnection.
     * @memberof Oms.Conference.Subscription
     * @returns {Promise<RTCStatsReport, Error>}
     */

    _this.getStats = getStats;
    /**
     * @function mute
     * @instance
     * @desc Stop reeving data from remote endpoint.
     * @memberof Oms.Conference.Subscription
     * @param {Oms.Base.TrackKind } kind Kind of tracks to be muted.
     * @returns {Promise<undefined, Error>}
     */

    _this.mute = mute;
    /**
     * @function unmute
     * @instance
     * @desc Continue reeving data from remote endpoint.
     * @memberof Oms.Conference.Subscription
     * @param {Oms.Base.TrackKind } kind Kind of tracks to be unmuted.
     * @returns {Promise<undefined, Error>}
     */

    _this.unmute = unmute;
    /**
     * @function applyOptions
     * @instance
     * @desc Update subscription with given options.
     * @memberof Oms.Conference.Subscription
     * @param {Oms.Conference.SubscriptionUpdateOptions } options Subscription update options.
     * @returns {Promise<undefined, Error>}
     */

    _this.applyOptions = applyOptions;
    return _this;
  }

  return Subscription;
}(_event.EventDispatcher);

exports.Subscription = Subscription;

},{"../base/codec.js":2,"../base/event.js":3,"../base/mediaformat.js":6}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Conference = exports.P2P = exports.Base = void 0;

var base = _interopRequireWildcard(require("./base/export.js"));

var p2p = _interopRequireWildcard(require("./p2p/export.js"));

var conference = _interopRequireWildcard(require("./conference/export.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Base objects for both P2P and conference.
 * @namespace Oms.Base
 */
var Base = base;
/**
 * P2P WebRTC connections.
 * @namespace Oms.P2P
 */

exports.Base = Base;
var P2P = p2p;
/**
 * WebRTC connections with conference server.
 * @namespace Oms.Conference
 */

exports.P2P = P2P;
var Conference = conference;
exports.Conference = Conference;

},{"./base/export.js":4,"./conference/export.js":15,"./p2p/export.js":24}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorByCode = getErrorByCode;
exports.P2PError = exports.errors = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
var errors = {
  // 2100-2999 for P2P errors
  // 2100-2199 for connection errors
  // 2100-2109 for server errors
  P2P_CONN_SERVER_UNKNOWN: {
    code: 2100,
    message: 'Server unknown error.'
  },
  P2P_CONN_SERVER_UNAVAILABLE: {
    code: 2101,
    message: 'Server is unavaliable.'
  },
  P2P_CONN_SERVER_BUSY: {
    code: 2102,
    message: 'Server is too busy.'
  },
  P2P_CONN_SERVER_NOT_SUPPORTED: {
    code: 2103,
    message: 'Method has not been supported by server.'
  },
  // 2110-2119 for client errors
  P2P_CONN_CLIENT_UNKNOWN: {
    code: 2110,
    message: 'Client unknown error.'
  },
  P2P_CONN_CLIENT_NOT_INITIALIZED: {
    code: 2111,
    message: 'Connection is not initialized.'
  },
  // 2120-2129 for authentication errors
  P2P_CONN_AUTH_UNKNOWN: {
    code: 2120,
    message: 'Authentication unknown error.'
  },
  P2P_CONN_AUTH_FAILED: {
    code: 2121,
    message: 'Wrong username or token.'
  },
  // 2200-2299 for message transport errors
  P2P_MESSAGING_TARGET_UNREACHABLE: {
    code: 2201,
    message: 'Remote user cannot be reached.'
  },
  P2P_CLIENT_DENIED: {
    code: 2202,
    message: 'User is denied.'
  },
  // 2301-2399 for chat room errors
  // 2401-2499 for client errors
  P2P_CLIENT_UNKNOWN: {
    code: 2400,
    message: 'Unknown errors.'
  },
  P2P_CLIENT_UNSUPPORTED_METHOD: {
    code: 2401,
    message: 'This method is unsupported in current browser.'
  },
  P2P_CLIENT_ILLEGAL_ARGUMENT: {
    code: 2402,
    message: 'Illegal argument.'
  },
  P2P_CLIENT_INVALID_STATE: {
    code: 2403,
    message: 'Invalid peer state.'
  },
  P2P_CLIENT_NOT_ALLOWED: {
    code: 2404,
    message: 'Remote user is not allowed.'
  },
  // 2501-2599 for WebRTC erros.
  P2P_WEBRTC_UNKNOWN: {
    code: 2500,
    message: 'WebRTC error.'
  },
  P2P_WEBRTC_SDP: {
    code: 2502,
    message: 'SDP error.'
  }
};
exports.errors = errors;

function getErrorByCode(errorCode) {
  var codeErrorMap = {
    2100: errors.P2P_CONN_SERVER_UNKNOWN,
    2101: errors.P2P_CONN_SERVER_UNAVAILABLE,
    2102: errors.P2P_CONN_SERVER_BUSY,
    2103: errors.P2P_CONN_SERVER_NOT_SUPPORTED,
    2110: errors.P2P_CONN_CLIENT_UNKNOWN,
    2111: errors.P2P_CONN_CLIENT_NOT_INITIALIZED,
    2120: errors.P2P_CONN_AUTH_UNKNOWN,
    2121: errors.P2P_CONN_AUTH_FAILED,
    2201: errors.P2P_MESSAGING_TARGET_UNREACHABLE,
    2400: errors.P2P_CLIENT_UNKNOWN,
    2401: errors.P2P_CLIENT_UNSUPPORTED_METHOD,
    2402: errors.P2P_CLIENT_ILLEGAL_ARGUMENT,
    2403: errors.P2P_CLIENT_INVALID_STATE,
    2404: errors.P2P_CLIENT_NOT_ALLOWED,
    2500: errors.P2P_WEBRTC_UNKNOWN,
    2501: errors.P2P_WEBRTC_SDP
  };
  return codeErrorMap[errorCode];
}

var P2PError =
/*#__PURE__*/
function (_Error) {
  _inherits(P2PError, _Error);

  function P2PError(error, message) {
    var _this;

    _classCallCheck(this, P2PError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(P2PError).call(this, message));

    if (typeof error === 'number') {
      _this.code = error;
    } else {
      _this.code = error.code;
    }

    return _this;
  }

  return P2PError;
}(_wrapNativeSuper(Error));

exports.P2PError = P2PError;

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "P2PClient", {
  enumerable: true,
  get: function get() {
    return _p2pclient.default;
  }
});
Object.defineProperty(exports, "P2PError", {
  enumerable: true,
  get: function get() {
    return _error.P2PError;
  }
});

var _p2pclient = _interopRequireDefault(require("./p2pclient.js"));

var _error = require("./error.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./error.js":23,"./p2pclient.js":25}],25:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _event = require("../base/event.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var ErrorModule = _interopRequireWildcard(require("./error.js"));

var _peerconnectionChannel = _interopRequireDefault(require("./peerconnection-channel.js"));

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConnectionState = {
  READY: 1,
  CONNECTING: 2,
  CONNECTED: 3
};
var pcDisconnectTimeout = 15000; // Close peerconnection after disconnect 15s.let isConnectedToSignalingChannel = false;

var offerOptions = {
  'offerToReceiveAudio': true,
  'offerToReceiveVideo': true
};
var sysInfo = Utils.sysInfo();
var supportsPlanB = Utils.isSafari() ? true : false;
var supportsUnifiedPlan = Utils.isSafari() ? false : true;
/**
 * @function isArray
 * @desc Test if an object is an array.
 * @return {boolean} DESCRIPTION
 * @private
 */

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
/*
 * Return negative value if id1<id2, positive value if id1>id2
 */


var compareID = function compareID(id1, id2) {
  return id1.localeCompare(id2);
}; // If targetId is peerId, then return targetId.


var getPeerId = function getPeerId(targetId) {
  return targetId;
};

var changeNegotiationState = function changeNegotiationState(peer, state) {
  peer.negotiationState = state;
}; // Do stop chat locally.


var stopChatLocally = function stopChatLocally(peer, originatorId) {
  if (peer.state === PeerState.CONNECTED || peer.state === PeerState.CONNECTING) {
    if (peer.sendDataChannel) {
      peer.sendDataChannel.close();
    }

    if (peer.receiveDataChannel) {
      peer.receiveDataChannel.close();
    }

    if (peer.connection && peer.connection.iceConnectionState !== 'closed') {
      peer.connection.close();
    }

    if (peer.state !== PeerState.READY) {
      peer.state = PeerState.READY;
      that.dispatchEvent(new Woogeen.ChatEvent({
        type: 'chat-stopped',
        peerId: peer.id,
        senderId: originatorId
      }));
    } // Unbind events for the pc, so the old pc will not impact new peerconnections created for the same target later.


    unbindEvetsToPeerConnection(peer.connection);
  }
};
/**
 * @class P2PClientConfiguration
 * @classDesc Configuration for P2PClient.
 * @memberOf Oms.P2P
 * @hideconstructor
 */


var P2PClientConfiguration = function P2PClientConfiguration() {
  /**
   * @member {?Array<Oms.Base.AudioEncodingParameters>} audioEncoding
   * @instance
   * @desc Encoding parameters for publishing audio tracks.
   * @memberof Oms.P2P.P2PClientConfiguration
   */
  this.audioEncoding = undefined;
  /**
   * @member {?Array<Oms.Base.VideoEncodingParameters>} videoEncoding
   * @instance
   * @desc Encoding parameters for publishing video tracks.
   * @memberof Oms.P2P.P2PClientConfiguration
   */

  this.videoEncoding = undefined;
  /**
   * @member {?RTCConfiguration} rtcConfiguration
   * @instance
   * @memberof Oms.P2P.P2PClientConfiguration
   * @desc It will be used for creating PeerConnection.
   * @see {@link https://www.w3.org/TR/webrtc/#rtcconfiguration-dictionary|RTCConfiguration Dictionary of WebRTC 1.0}.
   * @example
   * // Following object can be set to p2pClientConfiguration.rtcConfiguration.
   * {
   *   iceServers: [{
   *      urls: "stun:example.com:3478"
   *   }, {
   *     urls: [
   *       "turn:example.com:3478?transport=udp",
   *       "turn:example.com:3478?transport=tcp"
   *     ],
   *      credential: "password",
   *      username: "username"
   *   }
   * }
   */

  this.rtcConfiguration = undefined;
};
/**
 * @class P2PClient
 * @classDesc The P2PClient handles PeerConnections between different clients.
 * Events:
 *
 * | Event Name            | Argument Type    | Fired when       |
 * | --------------------- | ---------------- | ---------------- |
 * | streamadded           | StreamEvent      | A new stream is sent from remote endpoint. |
 * | messagereceived       | MessageEvent     | A new message is received. |
 * | serverdisconnected    | OmsEvent         | Disconnected from signaling server. |
 *
 * @memberof Oms.P2P
 * @extends Oms.Base.EventDispatcher
 * @constructor
 * @param {?Oms.P2P.P2PClientConfiguration } config Configuration for P2PClient.
 */


var P2PClient = function P2PClient(configuration, signalingChannel) {
  Object.setPrototypeOf(this, new _event.EventDispatcher());
  var config = configuration;
  var signaling = signalingChannel;
  var channels = new Map(); // Map of PeerConnectionChannels.

  var self = this;
  var state = ConnectionState.READY;
  var myId;

  signaling.onMessage = function (origin, message) {
    _logger.default.debug('Received signaling message from ' + origin + ': ' + message);

    var data = JSON.parse(message);

    if (data.type === 'chat-closed') {
      if (channels.has(origin)) {
        getOrCreateChannel(origin).onMessage(data);
        channels.delete(origin);
      }

      return;
    }

    if (self.allowedRemoteIds.indexOf(origin) >= 0) {
      getOrCreateChannel(origin).onMessage(data);
    } else {
      sendSignalingMessage(origin, 'chat-closed', ErrorModule.errors.P2P_CLIENT_DENIED);
    }
  };

  signaling.onServerDisconnected = function () {
    state = ConnectionState.READY;
    self.dispatchEvent(new _event.OmsEvent('serverdisconnected'));
  };
  /**
   * @member {array} allowedRemoteIds
   * @memberof Oms.P2P.P2PClient
   * @instance
   * @desc Only allowed remote endpoint IDs are able to publish stream or send message to current endpoint. Removing an ID from allowedRemoteIds does stop existing connection with certain endpoint. Please call stop to stop the PeerConnection.
   */


  this.allowedRemoteIds = [];
  /**
   * @function connect
   * @instance
   * @desc Connect to signaling server. Since signaling can be customized, this method does not define how a token looks like. SDK passes token to signaling channel without changes.
   * @memberof Oms.P2P.P2PClient
   * @returns {Promise<object, Error>} It returns a promise resolved with an object returned by signaling channel once signaling channel reports connection has been established.
   */

  this.connect = function (token) {
    if (state === ConnectionState.READY) {
      state = ConnectionState.CONNECTING;
    } else {
      _logger.default.warning('Invalid connection state: ' + state);

      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE));
    }

    return new Promise(function (resolve, reject) {
      signaling.connect(token).then(function (id) {
        myId = id;
        state = ConnectionState.CONNECTED;
        resolve(myId);
      }, function (errCode) {
        reject(new ErrorModule.P2PError(ErrorModule.getErrorByCode(errCode)));
      });
    });
  };
  /**
   * @function disconnect
   * @instance
   * @desc Disconnect from the signaling channel. It stops all existing sessions with remote endpoints.
   * @memberof Oms.P2P.P2PClient
   * @returns {Promise<undefined, Error>}
   */


  this.disconnect = function () {
    if (state == ConnectionState.READY) {
      return;
    }

    channels.forEach(function (channel) {
      channel.stop();
    });
    channels.clear();
    signaling.disconnect();
  };
  /**
   * @function publish
   * @instance
   * @desc Publish a stream to a remote endpoint.
   * @memberof Oms.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @param {LocalStream} stream A LocalStream to be published.
   * @returns {Promise<Publication, Error>} A promised resolved when remote side received the certain stream. However, remote endpoint may not display this stream, or ignore it.
   */


  this.publish = function (remoteId, stream) {
    if (state !== ConnectionState.CONNECTED) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'P2P Client is not connected to signaling channel.'));
    }

    if (this.allowedRemoteIds.indexOf(remoteId) < 0) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_NOT_ALLOWED));
    }

    return Promise.resolve(getOrCreateChannel(remoteId).publish(stream));
  };
  /**
   * @function send
   * @instance
   * @desc Send a message to remote endpoint.
   * @memberof Oms.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @param {string} message Message to be sent. It should be a string.
   * @returns {Promise<undefined, Error>} It returns a promise resolved when remote endpoint received certain message.
   */


  this.send = function (remoteId, message) {
    if (state !== ConnectionState.CONNECTED) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'P2P Client is not connected to signaling channel.'));
    }

    if (this.allowedRemoteIds.indexOf(remoteId) < 0) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_NOT_ALLOWED));
    }

    return Promise.resolve(getOrCreateChannel(remoteId).send(message));
  };
  /**
   * @function stop
   * @instance
   * @desc Clean all resources associated with given remote endpoint. It may include RTCPeerConnection, RTCRtpTransceiver and RTCDataChannel. It still possible to publish a stream, or send a message to given remote endpoint after stop.
   * @memberof Oms.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @returns {undefined}
   */


  this.stop = function (remoteId) {
    if (!channels.has(remoteId)) {
      _logger.default.warning('No PeerConnection between current endpoint and specific remote endpoint.');

      return;
    }

    channels.get(remoteId).stop();
    channels.delete(remoteId);
  };
  /**
   * @function getStats
   * @instance
   * @desc Get stats of underlying PeerConnection.
   * @memberof Oms.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @returns {Promise<RTCStatsReport, Error>} It returns a promise resolved with an RTCStatsReport or reject with an Error if there is no connection with specific user.
   */


  this.getStats = function (remoteId) {
    if (!channels.has(remoteId)) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'No PeerConnection between current endpoint and specific remote endpoint.'));
    }

    return channels.get(remoteId).getStats();
  };

  var sendSignalingMessage = function sendSignalingMessage(remoteId, type, message) {
    var msg = {
      type: type
    };

    if (message) {
      msg.data = message;
    }

    return signaling.send(remoteId, JSON.stringify(msg)).catch(function (e) {
      if (typeof e === 'number') {
        throw ErrorModule.getErrorByCode(e);
      }
    });
  };

  var getOrCreateChannel = function getOrCreateChannel(remoteId) {
    if (!channels.has(remoteId)) {
      // Construct an signaling sender/receiver for P2PPeerConnection.
      var signalingForChannel = Object.create(_event.EventDispatcher);
      signalingForChannel.sendSignalingMessage = sendSignalingMessage;
      var pcc = new _peerconnectionChannel.default(config, myId, remoteId, signalingForChannel);
      pcc.addEventListener('streamadded', function (streamEvent) {
        self.dispatchEvent(streamEvent);
      });
      pcc.addEventListener('messagereceived', function (messageEvent) {
        self.dispatchEvent(messageEvent);
      });
      pcc.addEventListener('ended', function () {
        channels.delete(remoteId);
      });
      channels.set(remoteId, pcc);
    }

    return channels.get(remoteId);
  };
};

var _default = P2PClient;
exports.default = _default;

},{"../base/event.js":3,"../base/logger.js":5,"../base/stream.js":10,"../base/utils.js":11,"./error.js":23,"./peerconnection-channel.js":26}],26:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.P2PPeerConnectionChannelEvent = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _event = require("../base/event.js");

var _publication = require("../base/publication.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var ErrorModule = _interopRequireWildcard(require("./error.js"));

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var SdpUtils = _interopRequireWildcard(require("../base/sdputils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/*
  Event for Stream.
*/
var P2PPeerConnectionChannelEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(P2PPeerConnectionChannelEvent, _Event);

  function P2PPeerConnectionChannelEvent(init) {
    var _this;

    _classCallCheck(this, P2PPeerConnectionChannelEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(P2PPeerConnectionChannelEvent).call(this, init));
    _this.stream = init.stream;
    return _this;
  }

  return P2PPeerConnectionChannelEvent;
}(_wrapNativeSuper(Event));

exports.P2PPeerConnectionChannelEvent = P2PPeerConnectionChannelEvent;
var DataChannelLabel = {
  MESSAGE: 'message',
  FILE: 'file'
};
var SignalingType = {
  DENIED: 'chat-denied',
  CLOSED: 'chat-closed',
  NEGOTIATION_NEEDED: 'chat-negotiation-needed',
  TRACK_SOURCES: 'chat-track-sources',
  STREAM_INFO: 'chat-stream-info',
  SDP: 'chat-signal',
  TRACKS_ADDED: 'chat-tracks-added',
  TRACKS_REMOVED: 'chat-tracks-removed',
  DATA_RECEIVED: 'chat-data-received',
  UA: 'chat-ua'
};
var offerOptions = {
  'offerToReceiveAudio': true,
  'offerToReceiveVideo': true
};
var sysInfo = Utils.sysInfo();

var P2PPeerConnectionChannel =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(P2PPeerConnectionChannel, _EventDispatcher);

  // |signaling| is an object has a method |sendSignalingMessage|.
  function P2PPeerConnectionChannel(config, localId, remoteId, signaling) {
    var _this2;

    _classCallCheck(this, P2PPeerConnectionChannel);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(P2PPeerConnectionChannel).call(this));
    _this2._config = config;
    _this2._localId = localId;
    _this2._remoteId = remoteId;
    _this2._signaling = signaling;
    _this2._pc = null;
    _this2._publishedStreams = new Map(); // Key is streams published, value is its publication.

    _this2._pendingStreams = []; // Streams going to be added to PeerConnection.

    _this2._publishingStreams = []; // Streams have been added to PeerConnection, but does not receive ack from remote side.

    _this2._pendingUnpublishStreams = []; // Streams going to be removed.
    // Key is MediaStream's ID, value is an object {source:{audio:string, video:string}, attributes: object, stream: RemoteStream, mediaStream: MediaStream}. `stream` and `mediaStream` will be set when `track` event is fired on `RTCPeerConnection`. `mediaStream` will be `null` after `streamadded` event is fired on `P2PClient`. Other propertes will be set upon `STREAM_INFO` event from signaling channel.

    _this2._remoteStreamInfo = new Map();
    _this2._remoteStreams = [];
    _this2._remoteTrackSourceInfo = new Map(); // Key is MediaStreamTrack's ID, value is source info.

    _this2._publishPromises = new Map(); // Key is MediaStream's ID, value is an object has |resolve| and |reject|.

    _this2._unpublishPromises = new Map(); // Key is MediaStream's ID, value is an object has |resolve| and |reject|.

    _this2._publishingStreamTracks = new Map(); // Key is MediaStream's ID, value is an array of the ID of its MediaStreamTracks that haven't been acked.

    _this2._publishedStreamTracks = new Map(); // Key is MediaStream's ID, value is an array of the ID of its MediaStreamTracks that haven't been removed.

    _this2._isNegotiationNeeded = false;
    _this2._negotiating = false;
    _this2._remoteSideSupportsRemoveStream = true;
    _this2._remoteSideSupportsPlanB = true;
    _this2._remoteSideSupportsUnifiedPlan = true;
    _this2._remoteIceCandidates = [];
    _this2._dataChannels = new Map(); // Key is data channel's label, value is a RTCDataChannel.

    _this2._pendingMessages = [];
    _this2._dataSeq = 1; // Sequence number for data channel messages.

    _this2._sendDataPromises = new Map(); // Key is data sequence number, value is an object has |resolve| and |reject|.

    _this2._addedTrackIds = []; // Tracks that have been added after receiving remote SDP but before connection is established. Draining these messages when ICE connection state is connected.

    _this2._isCaller = true;
    _this2._infoSent = false;
    _this2._disposed = false;

    _this2._createPeerConnection();

    return _this2;
  }

  _createClass(P2PPeerConnectionChannel, [{
    key: "publish",
    value: function publish(stream) {
      var _this3 = this;

      if (!(stream instanceof StreamModule.LocalStream)) {
        return Promise.reject(new TypeError('Invalid stream.'));
      }

      if (this._publishedStreams.has(stream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT, 'Duplicated stream.'));
      }

      if (this._areAllTracksEnded(stream.mediaStream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'All tracks are ended.'));
      }

      return Promise.all([this._sendClosedMsgIfNecessary(), this._sendSysInfoIfNecessary(), this._sendStreamInfo(stream)]).then(function () {
        return new Promise(function (resolve, reject) {
          // Replace |addStream| with PeerConnection.addTrack when all browsers are ready.
          _this3._pc.addStream(stream.mediaStream);

          _this3._publishingStreams.push(stream);

          var trackIds = Array.from(stream.mediaStream.getTracks(), function (track) {
            return track.id;
          });

          _this3._publishingStreamTracks.set(stream.mediaStream.id, trackIds);

          _this3._publishPromises.set(stream.mediaStream.id, {
            resolve: resolve,
            reject: reject
          });

          if (!_this3._dataChannels.has(DataChannelLabel.MESSAGE)) {
            _this3._createDataChannel(DataChannelLabel.MESSAGE);
          }
        });
      });
    }
  }, {
    key: "send",
    value: function send(message) {
      var _this4 = this;

      if (!(typeof message === 'string')) {
        return Promise.reject(new TypeError('Invalid message.'));
      }

      var data = {
        id: this._dataSeq++,
        data: message
      };
      var promise = new Promise(function (resolve, reject) {
        _this4._sendDataPromises.set(data.id, {
          resolve: resolve,
          reject: reject
        });
      });

      if (!this._dataChannels.has(DataChannelLabel.MESSAGE)) {
        this._createDataChannel(DataChannelLabel.MESSAGE);
      }

      this._sendClosedMsgIfNecessary().catch(function (err) {
        _logger.default.debug('Failed to send closed message.' + err.message);
      });

      this._sendSysInfoIfNecessary().catch(function (err) {
        _logger.default.debug('Failed to send sysInfo.' + err.message);
      });

      var dc = this._dataChannels.get(DataChannelLabel.MESSAGE);

      if (dc.readyState === 'open') {
        this._dataChannels.get(DataChannelLabel.MESSAGE).send(JSON.stringify(data));
      } else {
        this._pendingMessages.push(data);
      }

      return promise;
    }
  }, {
    key: "stop",
    value: function stop() {
      this._stop(undefined, true);
    }
  }, {
    key: "getStats",
    value: function getStats(mediaStream) {
      var _this5 = this;

      if (this._pc) {
        if (mediaStream === undefined) {
          return this._pc.getStats();
        } else {
          var tracksStatsReports = [];
          return Promise.all([mediaStream.getTracks().forEach(function (track) {
            _this5._getStats(track, tracksStatsReports);
          })]).then(function () {
            return new Promise(function (resolve, reject) {
              resolve(tracksStatsReports);
            });
          });
        }
      } else {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE));
      }
    }
  }, {
    key: "_getStats",
    value: function _getStats(mediaStreamTrack, reportsResult) {
      return this._pc.getStats(mediaStreamTrack).then(function (statsReport) {
        reportsResult.push(statsReport);
      });
    } // This method is called by P2PClient when there is new signaling message arrived.

  }, {
    key: "onMessage",
    value: function onMessage(message) {
      this._SignalingMesssageHandler(message);
    }
  }, {
    key: "_sendSdp",
    value: function _sendSdp(sdp) {
      return this._signaling.sendSignalingMessage(this._remoteId, SignalingType.SDP, sdp);
    }
  }, {
    key: "_sendSignalingMessage",
    value: function _sendSignalingMessage(type, message) {
      return this._signaling.sendSignalingMessage(this._remoteId, type, message);
    }
  }, {
    key: "_SignalingMesssageHandler",
    value: function _SignalingMesssageHandler(message) {
      _logger.default.debug('Channel received message: ' + message);

      switch (message.type) {
        case SignalingType.UA:
          this._handleRemoteCapability(message.data);

          this._sendSysInfoIfNecessary();

          break;

        case SignalingType.TRACK_SOURCES:
          this._trackSourcesHandler(message.data);

          break;

        case SignalingType.STREAM_INFO:
          this._streamInfoHandler(message.data);

          break;

        case SignalingType.SDP:
          this._sdpHandler(message.data);

          break;

        case SignalingType.TRACKS_ADDED:
          this._tracksAddedHandler(message.data);

          break;

        case SignalingType.TRACKS_REMOVED:
          this._tracksRemovedHandler(message.data);

          break;

        case SignalingType.DATA_RECEIVED:
          this._dataReceivedHandler(message.data);

          break;

        case SignalingType.CLOSED:
          this._chatClosedHandler(message.data);

          break;

        case SignalingType.NEGOTIATION_NEEDED:
          this._doNegotiate();

          break;

        default:
          _logger.default.error('Invalid signaling message received. Type: ' + message.type);

      }
    }
  }, {
    key: "_tracksAddedHandler",
    value: function _tracksAddedHandler(ids) {
      var _this6 = this;

      // Currently, |ids| contains all track IDs of a MediaStream. Following algorithm also handles |ids| is a part of a MediaStream's tracks.
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var id = _step.value;

          // It could be a problem if there is a track published with different MediaStreams.
          _this6._publishingStreamTracks.forEach(function (mediaTrackIds, mediaStreamId) {
            for (var i = 0; i < mediaTrackIds.length; i++) {
              if (mediaTrackIds[i] === id) {
                // Move this track from publishing tracks to published tracks.
                if (!_this6._publishedStreamTracks.has(mediaStreamId)) {
                  _this6._publishedStreamTracks.set(mediaStreamId, []);
                }

                _this6._publishedStreamTracks.get(mediaStreamId).push(mediaTrackIds[i]);

                mediaTrackIds.splice(i, 1);
              } // Resolving certain publish promise when remote endpoint received all tracks of a MediaStream.


              if (mediaTrackIds.length == 0) {
                var _ret = function () {
                  if (!_this6._publishPromises.has(mediaStreamId)) {
                    _logger.default.warning('Cannot find the promise for publishing ' + mediaStreamId);

                    return "continue";
                  }

                  var targetStreamIndex = _this6._publishingStreams.findIndex(function (element) {
                    return element.mediaStream.id == mediaStreamId;
                  });

                  var targetStream = _this6._publishingStreams[targetStreamIndex];

                  _this6._publishingStreams.splice(targetStreamIndex, 1);

                  var publication = new _publication.Publication(id, function () {
                    _this6._unpublish(targetStream).then(function () {
                      publication.dispatchEvent(new _event.OmsEvent('ended'));
                    }, function (err) {
                      // Use debug mode because this error usually doesn't block stopping a publication.
                      _logger.default.debug('Something wrong happened during stopping a publication. ' + err.message);
                    });
                  }, function () {
                    if (!targetStream || !targetStream.mediaStream) {
                      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'Publication is not available.'));
                    }

                    return _this6.getStats(targetStream.mediaStream);
                  });

                  _this6._publishedStreams.set(targetStream, publication);

                  _this6._publishPromises.get(mediaStreamId).resolve(publication);

                  _this6._publishPromises.delete(mediaStreamId);
                }();

                if (_ret === "continue")
              }
            }
          });
        };

        for (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "_tracksRemovedHandler",
    value: function _tracksRemovedHandler(ids) {
      var _this7 = this;

      // Currently, |ids| contains all track IDs of a MediaStream. Following algorithm also handles |ids| is a part of a MediaStream's tracks.
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop2 = function _loop2() {
          var id = _step2.value;

          // It could be a problem if there is a track published with different MediaStreams.
          _this7._publishedStreamTracks.forEach(function (mediaTrackIds, mediaStreamId) {
            for (var i = 0; i < mediaTrackIds.length; i++) {
              if (mediaTrackIds[i] === id) {
                mediaTrackIds.splice(i, 1);
              }
            }
          });
        };

        for (var _iterator2 = ids[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop2();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "_dataReceivedHandler",
    value: function _dataReceivedHandler(id) {
      if (!this._sendDataPromises.has(id)) {
        _logger.default.warning('Received unknown data received message. ID: ' + id);


      } else {
        this._sendDataPromises.get(id).resolve();
      }
    }
  }, {
    key: "_sdpHandler",
    value: function _sdpHandler(sdp) {
      if (sdp.type === 'offer') {
        this._onOffer(sdp);
      } else if (sdp.type === 'answer') {
        this._onAnswer(sdp);
      } else if (sdp.type === 'candidates') {
        this._onRemoteIceCandidate(sdp);
      }
    }
  }, {
    key: "_trackSourcesHandler",
    value: function _trackSourcesHandler(data) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var info = _step3.value;

          this._remoteTrackSourceInfo.set(info.id, info.source);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "_streamInfoHandler",
    value: function _streamInfoHandler(data) {
      if (!data) {
        _logger.default.warning('Unexpected stream info.');

        return;
      }

      this._remoteStreamInfo.set(data.id, {
        source: data.source,
        attributes: data.attributes,
        stream: null,
        mediaStream: null,
        trackIds: data.tracks // Track IDs may not match at sender and receiver sides. Keep it for legacy porposes.

      });
    }
  }, {
    key: "_chatClosedHandler",
    value: function _chatClosedHandler(data) {
      this._disposed = true;

      this._stop(data, false);
    }
  }, {
    key: "_onOffer",
    value: function _onOffer(sdp) {
      var _this8 = this;

      _logger.default.debug('About to set remote description. Signaling state: ' + this._pc.signalingState);

      sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._config); // Firefox only has one codec in answer, which does not truly reflect its
      // decoding capability. So we set codec preference to remote offer, and let
      // Firefox choose its preferred codec.
      // Reference: https://bugzilla.mozilla.org/show_bug.cgi?id=814227.

      if (Utils.isFirefox()) {
        sdp.sdp = this._setCodecOrder(sdp.sdp);
      }

      var sessionDescription = new RTCSessionDescription(sdp);

      this._pc.setRemoteDescription(sessionDescription).then(function () {
        _this8._createAndSendAnswer();
      }, function (error) {
        _logger.default.debug('Set remote description failed. Message: ' + error.message);

        _this8._stop(error, true);
      });
    }
  }, {
    key: "_onAnswer",
    value: function _onAnswer(sdp) {
      var _this9 = this;

      _logger.default.debug('About to set remote description. Signaling state: ' + this._pc.signalingState);

      sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._config);
      var sessionDescription = new RTCSessionDescription(sdp);

      this._pc.setRemoteDescription(new RTCSessionDescription(sessionDescription)).then(function () {
        _logger.default.debug('Set remote descripiton successfully.');

        _this9._drainPendingMessages();
      }, function (error) {
        _logger.default.debug('Set remote description failed. Message: ' + error.message);

        _this9._stop(error, true);
      });
    }
  }, {
    key: "_onLocalIceCandidate",
    value: function _onLocalIceCandidate(event) {
      if (event.candidate) {
        this._sendSdp({
          type: 'candidates',
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex
        }).catch(function (e) {
          _logger.default.warning('Failed to send candidate.');
        });
      } else {
        _logger.default.debug('Empty candidate.');
      }
    }
  }, {
    key: "_onRemoteTrackAdded",
    value: function _onRemoteTrackAdded(event) {
      _logger.default.debug('Remote track added.');

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = event.streams[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var stream = _step4.value;

          if (!this._remoteStreamInfo.has(stream.id)) {
            _logger.default.warning('Missing stream info.');

            return;
          }

          if (!this._remoteStreamInfo.get(stream.id).stream) {
            this._setStreamToRemoteStreamInfo(stream);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        this._checkIceConnectionStateAndFireEvent();
      } else {
        this._addedTrackIds.concat(event.track.id);
      }
    }
  }, {
    key: "_onRemoteStreamAdded",
    value: function _onRemoteStreamAdded(event) {
      _logger.default.debug('Remote stream added.');

      if (!this._remoteStreamInfo.has(event.stream.id)) {
        _logger.default.warning('Cannot find source info for stream ' + event.stream.id);

        return;
      }

      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        this._sendSignalingMessage(SignalingType.TRACKS_ADDED, tracksInfo);
      } else {
        this._addedTrackIds = this._addedTrackIds.concat(this._remoteStreamInfo.get(event.stream.id).trackIds);
      }

      var audioTrackSource = this._remoteStreamInfo.get(event.stream.id).source.audio;

      var videoTrackSource = this._remoteStreamInfo.get(event.stream.id).source.video;

      var sourceInfo = new StreamModule.StreamSourceInfo(audioTrackSource, videoTrackSource);

      if (Utils.isSafari()) {
        if (!sourceInfo.audio) {
          event.stream.getAudioTracks().forEach(function (track) {
            event.stream.removeTrack(track);
          });
        }

        if (!sourceInfo.video) {
          event.stream.getVideoTracks().forEach(function (track) {
            event.stream.removeTrack(track);
          });
        }
      }

      var attributes = this._remoteStreamInfo.get(event.stream.id).attributes;

      var stream = new StreamModule.RemoteStream(undefined, this._remoteId, event.stream, sourceInfo, attributes);

      if (stream) {
        this._remoteStreams.push(stream);

        var streamEvent = new StreamModule.StreamEvent('streamadded', {
          stream: stream
        });
        this.dispatchEvent(streamEvent);
      }
    }
  }, {
    key: "_onRemoteStreamRemoved",
    value: function _onRemoteStreamRemoved(event) {
      _logger.default.debug('Remote stream removed.');

      var i = this._remoteStreams.findIndex(function (s) {
        return s.mediaStream.id === event.stream.id;
      });

      if (i !== -1) {
        var stream = this._remoteStreams[i];

        this._streamRemoved(stream);

        this._remoteStreams.splice(i, 1);
      }
    }
  }, {
    key: "_onNegotiationneeded",
    value: function _onNegotiationneeded() {
      _logger.default.debug('On negotiation needed.');

      if (this._pc.signalingState === 'stable' && this._negotiating === false) {
        this._negotiating = true;

        this._doNegotiate();

        this._isNegotiationNeeded = false;
      } else {
        this._isNegotiationNeeded = true;
      }
    }
  }, {
    key: "_onRemoteIceCandidate",
    value: function _onRemoteIceCandidate(candidateInfo) {
      var candidate = new RTCIceCandidate({
        candidate: candidateInfo.candidate,
        sdpMid: candidateInfo.sdpMid,
        sdpMLineIndex: candidateInfo.sdpMLineIndex
      });

      if (this._pc.remoteDescription && this._pc.remoteDescription.sdp !== "") {
        _logger.default.debug('Add remote ice candidates.');

        this._pc.addIceCandidate(candidate).catch(function (error) {
          _logger.default.warning('Error processing ICE candidate: ' + error);
        });
      } else {
        _logger.default.debug('Cache remote ice candidates.');

        this._remoteIceCandidates.push(candidate);
      }
    }
  }, {
    key: "_onSignalingStateChange",
    value: function _onSignalingStateChange(event) {
      _logger.default.debug('Signaling state changed: ' + this._pc.signalingState);

      if (this._pc.signalingState === 'closed') {//stopChatLocally(peer, peer.id);
      } else if (this._pc.signalingState === 'stable') {
        this._negotiating = false;

        if (this._isNegotiationNeeded) {
          this._onNegotiationneeded();
        } else {
          this._drainPendingStreams();

          this._drainPendingMessages();
        }
      } else if (this._pc.signalingState === 'have-remote-offer') {
        this._drainPendingRemoteIceCandidates();
      }
    }
  }, {
    key: "_onIceConnectionStateChange",
    value: function _onIceConnectionStateChange(event) {
      if (event.currentTarget.iceConnectionState === 'closed' || event.currentTarget.iceConnectionState === 'failed') {
        var _error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_UNKNOWN, 'ICE connection failed or closed.');

        this._stop(_error, true);
      } else if (event.currentTarget.iceConnectionState === 'connected' || event.currentTarget.iceConnectionState === 'completed') {
        this._sendSignalingMessage(SignalingType.TRACKS_ADDED, this._addedTrackIds);

        this._addedTrackIds = [];

        this._checkIceConnectionStateAndFireEvent();
      }
    }
  }, {
    key: "_onDataChannelMessage",
    value: function _onDataChannelMessage(event) {
      var message = JSON.parse(event.data);

      _logger.default.debug('Data channel message received: ' + message.data);

      this._sendSignalingMessage(SignalingType.DATA_RECEIVED, message.id);

      var messageEvent = new _event.MessageEvent('messagereceived', {
        message: message.data,
        origin: this._remoteId
      });
      this.dispatchEvent(messageEvent);
    }
  }, {
    key: "_onDataChannelOpen",
    value: function _onDataChannelOpen(event) {
      _logger.default.debug("Data Channel is opened.");

      if (event.target.label === DataChannelLabel.MESSAGE) {
        _logger.default.debug('Data channel for messages is opened.');

        this._drainPendingMessages();
      }
    }
  }, {
    key: "_onDataChannelClose",
    value: function _onDataChannelClose(event) {
      _logger.default.debug('Data Channel is closed.');
    }
  }, {
    key: "_streamRemoved",
    value: function _streamRemoved(stream) {
      if (!this._remoteStreamInfo.has(stream.mediaStream.id)) {
        _logger.default.warning('Cannot find stream info.');
      }

      this._sendSignalingMessage(SignalingType.TRACKS_REMOVED, this._remoteStreamInfo.get(stream.mediaStream.id).trackIds);

      var event = new _event.OmsEvent('ended');
      stream.dispatchEvent(event);
    }
  }, {
    key: "_isUnifiedPlan",
    value: function _isUnifiedPlan() {
      if (Utils.isFirefox()) {
        return true;
      }

      var pc = new RTCPeerConnection({
        sdpSemantics: 'unified-plan'
      });
      return pc.getConfiguration() && pc.getConfiguration().sdpSemantics === 'plan-b';
    }
  }, {
    key: "_createPeerConnection",
    value: function _createPeerConnection() {
      var _this10 = this;

      var pcConfiguration = this._config.rtcConfiguration || {};

      if (Utils.isChrome()) {
        pcConfiguration.sdpSemantics = 'unified-plan';
      }

      this._pc = new RTCPeerConnection(pcConfiguration); // Firefox 59 implemented addTransceiver. However, mid in SDP will differ from track's ID in this case. And transceiver's mid is null.

      if (typeof this._pc.addTransceiver === 'function' && Utils.isSafari()) {
        this._pc.addTransceiver('audio');

        this._pc.addTransceiver('video');
      }

      if (!this._isUnifiedPlan()) {
        this._pc.onaddstream = function (event) {
          // TODO: Legacy API, should be removed when all UAs implemented WebRTC 1.0.
          _this10._onRemoteStreamAdded.apply(_this10, [event]);
        };

        this._pc.onremovestream = function (event) {
          _this10._onRemoteStreamRemoved.apply(_this10, [event]);
        };
      } else {
        this._pc.ontrack = function (event) {
          _this10._onRemoteTrackAdded.apply(_this10, [event]);
        };
      }

      this._pc.onnegotiationneeded = function (event) {
        _this10._onNegotiationneeded.apply(_this10, [event]);
      };

      this._pc.onicecandidate = function (event) {
        _this10._onLocalIceCandidate.apply(_this10, [event]);
      };

      this._pc.onsignalingstatechange = function (event) {
        _this10._onSignalingStateChange.apply(_this10, [event]);
      };

      this._pc.ondatachannel = function (event) {
        _logger.default.debug('On data channel.'); // Save remote created data channel.


        if (!_this10._dataChannels.has(event.channel.label)) {
          _this10._dataChannels.set(event.channel.label, event.channel);

          _logger.default.debug('Save remote created data channel.');
        }

        _this10._bindEventsToDataChannel(event.channel);
      };

      this._pc.oniceconnectionstatechange = function (event) {
        _this10._onIceConnectionStateChange.apply(_this10, [event]);
      };
      /*
      this._pc.oniceChannelStatechange = function(event) {
        _onIceChannelStateChange(peer, event);
      };
       = function() {
        onNegotiationneeded(peers[peer.id]);
      };
       //DataChannel
      this._pc.ondatachannel = function(event) {
        Logger.debug(myId + ': On data channel');
        // Save remote created data channel.
        if (!peer.dataChannels[event.channel.label]) {
          peer.dataChannels[event.channel.label] = event.channel;
          Logger.debug('Save remote created data channel.');
        }
        bindEventsToDataChannel(event.channel, peer);
      };*/

    }
  }, {
    key: "_drainPendingStreams",
    value: function _drainPendingStreams() {
      _logger.default.debug('Draining pending streams.');

      if (this._pc && this._pc.signalingState === 'stable') {
        _logger.default.debug('Peer connection is ready for draining pending streams.');

        for (var i = 0; i < this._pendingStreams.length; i++) {
          var stream = this._pendingStreams[i]; // OnNegotiationNeeded event will be triggered immediately after adding stream to PeerConnection in Firefox.
          // And OnNegotiationNeeded handler will execute drainPendingStreams. To avoid add the same stream multiple times,
          // shift it from pending stream list before adding it to PeerConnection.

          this._pendingStreams.shift();

          if (!stream.mediaStream) {
            continue;
          }

          this._pc.addStream(stream.mediaStream);

          _logger.default.debug('Added stream to peer connection.');

          this._publishingStreams.push(stream);
        }

        this._pendingStreams.length = 0;

        for (var j = 0; j < this._pendingUnpublishStreams.length; j++) {
          if (!this._pendingUnpublishStreams[j].mediaStream) {
            continue;
          }

          this._pc.removeStream(this._pendingUnpublishStreams[j].mediaStream);

          this._unpublishPromises.get(this._pendingUnpublishStreams[j].mediaStream.id).resolve();

          this._publishedStreams.delete(this._pendingUnpublishStreams[j]);

          _logger.default.debug('Remove stream.');
        }

        this._pendingUnpublishStreams.length = 0;
      }
    }
  }, {
    key: "_drainPendingRemoteIceCandidates",
    value: function _drainPendingRemoteIceCandidates() {
      for (var i = 0; i < this._remoteIceCandidates.length; i++) {
        _logger.default.debug('Add candidate');

        this._pc.addIceCandidate(this._remoteIceCandidates[i]).catch(function (error) {
          _logger.default.warning('Error processing ICE candidate: ' + error);
        });
      }

      this._remoteIceCandidates.length = 0;
    }
  }, {
    key: "_drainPendingMessages",
    value: function _drainPendingMessages() {
      _logger.default.debug('Draining pending messages.');

      if (this._pendingMessages.length == 0) {
        return;
      }

      var dc = this._dataChannels.get(DataChannelLabel.MESSAGE);

      if (dc && dc.readyState === 'open') {
        for (var i = 0; i < this._pendingMessages.length; i++) {
          _logger.default.debug('Sending message via data channel: ' + this._pendingMessages[i]);

          dc.send(JSON.stringify(this._pendingMessages[i]));
        }

        this._pendingMessages.length = 0;
      } else if (this._pc && !dc) {
        this._createDataChannel(DataChannelLabel.MESSAGE);
      }
    }
  }, {
    key: "_sendStreamInfo",
    value: function _sendStreamInfo(stream) {
      if (!stream || !stream.mediaStream) {
        return new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }

      var info = [];
      stream.mediaStream.getTracks().map(function (track) {
        info.push({
          id: track.id,
          source: stream.source[track.kind]
        });
      });
      return Promise.all([this._sendSignalingMessage(SignalingType.TRACK_SOURCES, info), this._sendSignalingMessage(SignalingType.STREAM_INFO, {
        id: stream.mediaStream.id,
        attributes: stream.attributes,
        // Track IDs may not match at sender and receiver sides.
        tracks: Array.from(info, function (item) {
          return item.id;
        }),
        // This is a workaround for Safari. Please use track-sources if possible.
        source: stream.source
      })]);
    }
  }, {
    key: "_sendSysInfoIfNecessary",
    value: function _sendSysInfoIfNecessary() {
      if (this._infoSent) {
        return Promise.resolve();
      }

      this._infoSent = true;
      return this._sendSignalingMessage(SignalingType.UA, sysInfo);
    }
  }, {
    key: "_sendClosedMsgIfNecessary",
    value: function _sendClosedMsgIfNecessary() {
      if (this._pc.remoteDescription === null || this._pc.remoteDescription.sdp === "") {
        return this._sendSignalingMessage(SignalingType.CLOSED);
      }

      return Promise.resolve();
    }
  }, {
    key: "_handleRemoteCapability",
    value: function _handleRemoteCapability(ua) {
      if (ua.sdk && ua.sdk && ua.sdk.type === "JavaScript" && ua.runtime && ua.runtime.name === "Firefox") {
        this._remoteSideSupportsRemoveStream = false;
        this._remoteSideSupportsPlanB = false;
        this._remoteSideSupportsUnifiedPlan = true;
      } else {
        // Remote side is iOS/Android/C++ which uses Google's WebRTC stack.
        this._remoteSideSupportsRemoveStream = true;
        this._remoteSideSupportsPlanB = true;
        this._remoteSideSupportsUnifiedPlan = false;
      }
    }
  }, {
    key: "_doNegotiate",
    value: function _doNegotiate() {
      if (this._isCaller) {
        this._createAndSendOffer();
      } else {
        this._sendSignalingMessage(SignalingType.NEGOTIATION_NEEDED);
      }
    }
  }, {
    key: "_setCodecOrder",
    value: function _setCodecOrder(sdp) {
      if (this._config.audioEncodings) {
        var audioCodecNames = Array.from(this._config.audioEncodings, function (encodingParameters) {
          return encodingParameters.codec.name;
        });
        sdp = SdpUtils.reorderCodecs(sdp, 'audio', audioCodecNames);
      }

      if (this._config.videoEncodings) {
        var videoCodecNames = Array.from(this._config.videoEncodings, function (encodingParameters) {
          return encodingParameters.codec.name;
        });
        sdp = SdpUtils.reorderCodecs(sdp, 'video', videoCodecNames);
      }

      return sdp;
    }
  }, {
    key: "_setMaxBitrate",
    value: function _setMaxBitrate(sdp, options) {
      if (_typeof(options.audioEncodings) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.audioEncodings);
      }

      if (_typeof(options.videoEncodings) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.videoEncodings);
      }

      return sdp;
    }
  }, {
    key: "_setRtpSenderOptions",
    value: function _setRtpSenderOptions(sdp, options) {
      sdp = this._setMaxBitrate(sdp, options);
      return sdp;
    }
  }, {
    key: "_setRtpReceiverOptions",
    value: function _setRtpReceiverOptions(sdp) {
      sdp = this._setCodecOrder(sdp);
      return sdp;
    }
  }, {
    key: "_createAndSendOffer",
    value: function _createAndSendOffer() {
      var _this11 = this;

      if (!this._pc) {
        _logger.default.error('Peer connection have not been created.');

        return;
      }

      this._isNegotiationNeeded = false;
      this._isCaller = true;
      var localDesc;

      this._pc.createOffer(offerOptions).then(function (desc) {
        desc.sdp = _this11._setRtpReceiverOptions(desc.sdp);
        localDesc = desc;
        return _this11._pc.setLocalDescription(desc);
      }).then(function () {
        return _this11._sendSdp(localDesc);
      }).catch(function (e) {
        _logger.default.error(e.message + ' Please check your codec settings.');

        var error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_SDP, e.message);

        _this11._stop(error, true);
      });
    }
  }, {
    key: "_createAndSendAnswer",
    value: function _createAndSendAnswer() {
      var _this12 = this;

      this._drainPendingStreams();

      this._isNegotiationNeeded = false;
      this._isCaller = false;
      var localDesc;

      this._pc.createAnswer().then(function (desc) {
        desc.sdp = _this12._setRtpReceiverOptions(desc.sdp);
        localDesc = desc;
        return _this12._pc.setLocalDescription(desc);
      }).then(function () {
        return _this12._sendSdp(localDesc);
      }).catch(function (e) {
        _logger.default.error(e.message + ' Please check your codec settings.');

        var error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_SDP, e.message);

        _this12._stop(error, true);
      });
    }
  }, {
    key: "_getAndDeleteTrackSourceInfo",
    value: function _getAndDeleteTrackSourceInfo(tracks) {
      if (tracks.length > 0) {
        var trackId = tracks[0].id;

        if (this._remoteTrackSourceInfo.has(trackId)) {
          var sourceInfo = this._remoteTrackSourceInfo.get(trackId);

          this._remoteTrackSourceInfo.delete(trackId);

          return sourceInfo;
        } else {
          _logger.default.warning('Cannot find source info for ' + trackId);
        }
      }
    }
  }, {
    key: "_unpublish",
    value: function _unpublish(stream) {
      var _this13 = this;

      if (navigator.mozGetUserMedia || !this._remoteSideSupportsRemoveStream) {
        // Actually unpublish is supported. It is a little bit complex since Firefox implemented WebRTC spec while Chrome implemented an old API.
        _logger.default.error('Stopping a publication is not supported on Firefox. Please use P2PClient.stop() to stop the connection with remote endpoint.');

        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_UNSUPPORTED_METHOD));
      }

      if (!this._publishedStreams.has(stream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT));
      }

      this._pendingUnpublishStreams.push(stream);

      return new Promise(function (resolve, reject) {
        _this13._unpublishPromises.set(stream.mediaStream.id, {
          resolve: resolve,
          reject: reject
        });

        _this13._drainPendingStreams();
      });
    }
  }, {
    key: "_createDataChannel",
    // Make sure |_pc| is available before calling this method.
    value: function _createDataChannel(label) {
      if (this._dataChannels.has(label)) {
        _logger.default.warning('Data channel labeled ' + label + ' already exists.');

        return;
      }

      if (!this._pc) {
        _logger.default.debug('PeerConnection is not available before creating DataChannel.');

        return;
      }

      _logger.default.debug('Create data channel.');

      var dc = this._pc.createDataChannel(label);

      this._bindEventsToDataChannel(dc);

      this._dataChannels.set(DataChannelLabel.MESSAGE, dc);
    }
  }, {
    key: "_bindEventsToDataChannel",
    value: function _bindEventsToDataChannel(dc) {
      var _this14 = this;

      dc.onmessage = function (event) {
        _this14._onDataChannelMessage.apply(_this14, [event]);
      };

      dc.onopen = function (event) {
        _this14._onDataChannelOpen.apply(_this14, [event]);
      };

      dc.onclose = function (event) {
        _this14._onDataChannelClose.apply(_this14, [event]);
      };

      dc.onerror = function (event) {
        _logger.default.debug("Data Channel Error:", error);
      };
    }
  }, {
    key: "_areAllTracksEnded",
    value: function _areAllTracksEnded(mediaStream) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = mediaStream.getTracks()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var track = _step5.value;

          if (track.readyState === 'live') {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return true;
    }
  }, {
    key: "_stop",
    value: function _stop(error, notifyRemote) {
      var promiseError = error;

      if (!promiseError) {
        promiseError = new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_UNKNOWN);
      }

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this._dataChannels[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _step6$value = _slicedToArray(_step6.value, 2),
              label = _step6$value[0],
              dc = _step6$value[1];

          dc.close();
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      this._dataChannels.clear();

      if (this._pc && this._pc.iceConnectionState !== 'closed') {
        this._pc.close();
      }

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this._publishPromises[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _step7$value = _slicedToArray(_step7.value, 2),
              id = _step7$value[0],
              promise = _step7$value[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      this._publishPromises.clear();

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this._unpublishPromises[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _step8$value = _slicedToArray(_step8.value, 2),
              id = _step8$value[0],
              promise = _step8$value[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      this._unpublishPromises.clear();

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = this._sendDataPromises[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var _step9$value = _slicedToArray(_step9.value, 2),
              id = _step9$value[0],
              promise = _step9$value[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      this._sendDataPromises.clear(); // Fire ended event if publication or remote stream exists.


      this._publishedStreams.forEach(function (publication) {
        publication.dispatchEvent(new _event.OmsEvent('ended'));
      });

      this._publishedStreams.clear();

      this._remoteStreams.forEach(function (stream) {
        stream.dispatchEvent(new _event.OmsEvent('ended'));
      });

      this._remoteStreams = [];

      if (!this._disposed) {
        if (notifyRemote) {
          var sendError;

          if (error) {
            sendError = JSON.parse(JSON.stringify(error)); // Avoid to leak detailed error to remote side.

            sendError.message = 'Error happened at remote side.';
          }

          this._sendSignalingMessage(SignalingType.CLOSED, sendError).catch(function (err) {
            _logger.default.debug('Failed to send close.' + err.message);
          });
        }

        this.dispatchEvent(new Event('ended'));
      }
    }
  }, {
    key: "_setStreamToRemoteStreamInfo",
    value: function _setStreamToRemoteStreamInfo(mediaStream) {
      var info = this._remoteStreamInfo.get(mediaStream.id);

      var attributes = info.attributes;
      var sourceInfo = new StreamModule.StreamSourceInfo(this._remoteStreamInfo.get(mediaStream.id).source.audio, this._remoteStreamInfo.get(mediaStream.id).source.video);
      info.stream = new StreamModule.RemoteStream(undefined, this._remoteId, mediaStream, sourceInfo, attributes);
      info.mediaStream = mediaStream;
      var stream = info.stream;

      if (stream) {
        this._remoteStreams.push(stream);
      } else {
        _logger.default.warning('Failed to create RemoteStream.');
      }
    }
  }, {
    key: "_checkIceConnectionStateAndFireEvent",
    value: function _checkIceConnectionStateAndFireEvent() {
      var _this15 = this;

      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
          var _loop3 = function _loop3() {
            var _step10$value = _slicedToArray(_step10.value, 2),
                id = _step10$value[0],
                info = _step10$value[1];

            if (info.mediaStream) {
              var streamEvent = new StreamModule.StreamEvent('streamadded', {
                stream: info.stream
              });

              if (_this15._isUnifiedPlan()) {
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                  for (var _iterator11 = info.mediaStream.getTracks()[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var track = _step11.value;
                    track.addEventListener('ended', function () {
                      if (self._areAllTracksEnded(info.mediaStream)) {
                        self._onRemoteStreamRemoved(info.stream);
                      }
                    });
                  }
                } catch (err) {
                  _didIteratorError11 = true;
                  _iteratorError11 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
                      _iterator11.return();
                    }
                  } finally {
                    if (_didIteratorError11) {
                      throw _iteratorError11;
                    }
                  }
                }
              }

              _this15._sendSignalingMessage(SignalingType.TRACKS_ADDED, info.trackIds);

              _this15._remoteStreamInfo.get(info.mediaStream.id).mediaStream = null;

              _this15.dispatchEvent(streamEvent);
            }
          };

          for (var _iterator10 = this._remoteStreamInfo[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            _loop3();
          }
        } catch (err) {
          _didIteratorError10 = true;
          _iteratorError10 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
              _iterator10.return();
            }
          } finally {
            if (_didIteratorError10) {
              throw _iteratorError10;
            }
          }
        }
      }
    }
  }]);

  return P2PPeerConnectionChannel;
}(_event.EventDispatcher);

var _default = P2PPeerConnectionChannel;
exports.default = _default;

},{"../base/event.js":3,"../base/logger.js":5,"../base/publication.js":8,"../base/sdputils.js":9,"../base/stream.js":10,"../base/utils.js":11,"./error.js":23}]},{},[22])(22)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2RrL2Jhc2UvYmFzZTY0LmpzIiwic3JjL3Nkay9iYXNlL2NvZGVjLmpzIiwic3JjL3Nkay9iYXNlL2V2ZW50LmpzIiwic3JjL3Nkay9iYXNlL2V4cG9ydC5qcyIsInNyYy9zZGsvYmFzZS9sb2dnZXIuanMiLCJzcmMvc2RrL2Jhc2UvbWVkaWFmb3JtYXQuanMiLCJzcmMvc2RrL2Jhc2UvbWVkaWFzdHJlYW0tZmFjdG9yeS5qcyIsInNyYy9zZGsvYmFzZS9wdWJsaWNhdGlvbi5qcyIsInNyYy9zZGsvYmFzZS9zZHB1dGlscy5qcyIsInNyYy9zZGsvYmFzZS9zdHJlYW0uanMiLCJzcmMvc2RrL2Jhc2UvdXRpbHMuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvY2hhbm5lbC5qcyIsInNyYy9zZGsvY29uZmVyZW5jZS9jbGllbnQuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvZXJyb3IuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvZXhwb3J0LmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL2luZm8uanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvbWl4ZWRzdHJlYW0uanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvcGFydGljaXBhbnQuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2Uvc2lnbmFsaW5nLmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL3N0cmVhbXV0aWxzLmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL3N1YnNjcmlwdGlvbi5qcyIsInNyYy9zZGsvZXhwb3J0LmpzIiwic3JjL3Nkay9wMnAvZXJyb3IuanMiLCJzcmMvc2RrL3AycC9leHBvcnQuanMiLCJzcmMvc2RrL3AycC9wMnBjbGllbnQuanMiLCJzcmMvc2RrL3AycC9wZWVyY29ubmVjdGlvbi1jaGFubmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QztBQUNoRCxvQkFBQSxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBZ0MsWUFBTTtBQUNwQywwQkFBSSxJQUFJLENBQUMsa0JBQUwsQ0FBd0IsSUFBSSxDQUFDLFdBQTdCLENBQUosRUFBK0M7QUFDN0Msd0JBQUEsSUFBSSxDQUFDLHNCQUFMLENBQTRCLElBQUksQ0FBQyxNQUFqQztBQUNEO0FBQ0YscUJBSkQ7QUFLRDtBQVB3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUTFCOztBQUNELGNBQUEsT0FBSSxDQUFDLHFCQUFMLENBQTJCLGFBQWEsQ0FBQyxZQUF6QyxFQUF1RCxJQUFJLENBQUMsUUFBNUQ7O0FBQ0EsY0FBQSxPQUFJLENBQUMsaUJBQUwsQ0FBdUIsR0FBdkIsQ0FBMkIsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsRUFBNUMsRUFBZ0QsV0FBaEQsR0FBOEQsSUFBOUQ7O0FBQ0EsY0FBQSxPQUFJLENBQUMsYUFBTCxDQUFtQixXQUFuQjtBQUNEO0FBbEJVOztBQUNiLGlDQUF5QixLQUFLLGlCQUE5Qix3SUFBaUQ7QUFBQTtBQWtCaEQ7QUFuQlk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQW9CZDtBQUNGOzs7O0VBbDdCb0Msc0I7O2VBczdCeEIsd0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBNSVQgTGljZW5zZVxuLy9cbi8vIENvcHlyaWdodCAoYykgMjAxMiBVbml2ZXJzaWRhZCBQb2xpdMOpY25pY2EgZGUgTWFkcmlkXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuLy8gY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4vLyBTT0ZUV0FSRS5cblxuLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4vLyBUaGlzIGZpbGUgaXMgYm9ycm93ZWQgZnJvbSBseW5ja2lhL2xpY29kZSB3aXRoIHNvbWUgbW9kaWZpY2F0aW9ucy5cblxuLypnbG9iYWwgdW5lc2NhcGUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnQgY29uc3QgQmFzZTY0ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgRU5EX09GX0lOUFVULCBiYXNlNjRDaGFycywgcmV2ZXJzZUJhc2U2NENoYXJzLCBiYXNlNjRTdHIsIGJhc2U2NENvdW50LFxuICAgIGksIHNldEJhc2U2NFN0ciwgcmVhZEJhc2U2NCwgZW5jb2RlQmFzZTY0LCByZWFkUmV2ZXJzZUJhc2U2NCwgbnRvcyxcbiAgICBkZWNvZGVCYXNlNjQ7XG5cbiAgRU5EX09GX0lOUFVUID0gLTE7XG5cbiAgYmFzZTY0Q2hhcnMgPSBbXG4gICAgJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsXG4gICAgJ0knLCAnSicsICdLJywgJ0wnLCAnTScsICdOJywgJ08nLCAnUCcsXG4gICAgJ1EnLCAnUicsICdTJywgJ1QnLCAnVScsICdWJywgJ1cnLCAnWCcsXG4gICAgJ1knLCAnWicsICdhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsXG4gICAgJ2cnLCAnaCcsICdpJywgJ2onLCAnaycsICdsJywgJ20nLCAnbicsXG4gICAgJ28nLCAncCcsICdxJywgJ3InLCAncycsICd0JywgJ3UnLCAndicsXG4gICAgJ3cnLCAneCcsICd5JywgJ3onLCAnMCcsICcxJywgJzInLCAnMycsXG4gICAgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5JywgJysnLCAnLydcbiAgXTtcblxuICByZXZlcnNlQmFzZTY0Q2hhcnMgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgYmFzZTY0Q2hhcnMubGVuZ3RoOyBpID0gaSArIDEpIHtcbiAgICByZXZlcnNlQmFzZTY0Q2hhcnNbYmFzZTY0Q2hhcnNbaV1dID0gaTtcbiAgfVxuXG4gIHNldEJhc2U2NFN0ciA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGJhc2U2NFN0ciA9IHN0cjtcbiAgICBiYXNlNjRDb3VudCA9IDA7XG4gIH07XG5cbiAgcmVhZEJhc2U2NCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjO1xuICAgIGlmICghYmFzZTY0U3RyKSB7XG4gICAgICByZXR1cm4gRU5EX09GX0lOUFVUO1xuICAgIH1cbiAgICBpZiAoYmFzZTY0Q291bnQgPj0gYmFzZTY0U3RyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIEVORF9PRl9JTlBVVDtcbiAgICB9XG4gICAgYyA9IGJhc2U2NFN0ci5jaGFyQ29kZUF0KGJhc2U2NENvdW50KSAmIDB4ZmY7XG4gICAgYmFzZTY0Q291bnQgPSBiYXNlNjRDb3VudCArIDE7XG4gICAgcmV0dXJuIGM7XG4gIH07XG5cbiAgZW5jb2RlQmFzZTY0ID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJlc3VsdCwgaW5CdWZmZXIsIGRvbmU7XG4gICAgc2V0QmFzZTY0U3RyKHN0cik7XG4gICAgcmVzdWx0ID0gJyc7XG4gICAgaW5CdWZmZXIgPSBuZXcgQXJyYXkoMyk7XG4gICAgZG9uZSA9IGZhbHNlO1xuICAgIHdoaWxlICghZG9uZSAmJiAoaW5CdWZmZXJbMF0gPSByZWFkQmFzZTY0KCkpICE9PSBFTkRfT0ZfSU5QVVQpIHtcbiAgICAgIGluQnVmZmVyWzFdID0gcmVhZEJhc2U2NCgpO1xuICAgICAgaW5CdWZmZXJbMl0gPSByZWFkQmFzZTY0KCk7XG4gICAgICByZXN1bHQgPSByZXN1bHQgKyAoYmFzZTY0Q2hhcnNbaW5CdWZmZXJbMF0gPj4gMl0pO1xuICAgICAgaWYgKGluQnVmZmVyWzFdICE9PSBFTkRfT0ZfSU5QVVQpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKGJhc2U2NENoYXJzWygoaW5CdWZmZXJbMF0gPDwgNCkgJiAweDMwKSB8IChcbiAgICAgICAgICBpbkJ1ZmZlclsxXSA+PiA0KV0pO1xuICAgICAgICBpZiAoaW5CdWZmZXJbMl0gIT09IEVORF9PRl9JTlBVVCkge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1soKGluQnVmZmVyWzFdIDw8IDIpICYgMHgzYykgfCAoXG4gICAgICAgICAgICBpbkJ1ZmZlclsyXSA+PiA2KV0pO1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1tpbkJ1ZmZlclsyXSAmIDB4M0ZdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAoYmFzZTY0Q2hhcnNbKChpbkJ1ZmZlclsxXSA8PCAyKSAmIDB4M2MpXSk7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKCc9Jyk7XG4gICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1soKGluQnVmZmVyWzBdIDw8IDQpICYgMHgzMCldKTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKCc9Jyk7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCArICgnPScpO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICByZWFkUmV2ZXJzZUJhc2U2NCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghYmFzZTY0U3RyKSB7XG4gICAgICByZXR1cm4gRU5EX09GX0lOUFVUO1xuICAgIH1cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKGJhc2U2NENvdW50ID49IGJhc2U2NFN0ci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIEVORF9PRl9JTlBVVDtcbiAgICAgIH1cbiAgICAgIHZhciBuZXh0Q2hhcmFjdGVyID0gYmFzZTY0U3RyLmNoYXJBdChiYXNlNjRDb3VudCk7XG4gICAgICBiYXNlNjRDb3VudCA9IGJhc2U2NENvdW50ICsgMTtcbiAgICAgIGlmIChyZXZlcnNlQmFzZTY0Q2hhcnNbbmV4dENoYXJhY3Rlcl0pIHtcbiAgICAgICAgcmV0dXJuIHJldmVyc2VCYXNlNjRDaGFyc1tuZXh0Q2hhcmFjdGVyXTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0Q2hhcmFjdGVyID09PSAnQScpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIG50b3MgPSBmdW5jdGlvbihuKSB7XG4gICAgbiA9IG4udG9TdHJpbmcoMTYpO1xuICAgIGlmIChuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgbiA9IFwiMFwiICsgbjtcbiAgICB9XG4gICAgbiA9IFwiJVwiICsgbjtcbiAgICByZXR1cm4gdW5lc2NhcGUobik7XG4gIH07XG5cbiAgZGVjb2RlQmFzZTY0ID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJlc3VsdCwgaW5CdWZmZXIsIGRvbmU7XG4gICAgc2V0QmFzZTY0U3RyKHN0cik7XG4gICAgcmVzdWx0ID0gXCJcIjtcbiAgICBpbkJ1ZmZlciA9IG5ldyBBcnJheSg0KTtcbiAgICBkb25lID0gZmFsc2U7XG4gICAgd2hpbGUgKCFkb25lICYmIChpbkJ1ZmZlclswXSA9IHJlYWRSZXZlcnNlQmFzZTY0KCkpICE9PSBFTkRfT0ZfSU5QVVQgJiZcbiAgICAgIChpbkJ1ZmZlclsxXSA9IHJlYWRSZXZlcnNlQmFzZTY0KCkpICE9PSBFTkRfT0ZfSU5QVVQpIHtcbiAgICAgIGluQnVmZmVyWzJdID0gcmVhZFJldmVyc2VCYXNlNjQoKTtcbiAgICAgIGluQnVmZmVyWzNdID0gcmVhZFJldmVyc2VCYXNlNjQoKTtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCArIG50b3MoKCgoaW5CdWZmZXJbMF0gPDwgMikgJiAweGZmKSB8IGluQnVmZmVyWzFdID4+XG4gICAgICAgIDQpKTtcbiAgICAgIGlmIChpbkJ1ZmZlclsyXSAhPT0gRU5EX09GX0lOUFVUKSB7XG4gICAgICAgIHJlc3VsdCArPSBudG9zKCgoKGluQnVmZmVyWzFdIDw8IDQpICYgMHhmZikgfCBpbkJ1ZmZlclsyXSA+PiAyKSk7XG4gICAgICAgIGlmIChpbkJ1ZmZlclszXSAhPT0gRU5EX09GX0lOUFVUKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgbnRvcygoKChpbkJ1ZmZlclsyXSA8PCA2KSAmIDB4ZmYpIHwgaW5CdWZmZXJbXG4gICAgICAgICAgICAzXSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGVuY29kZUJhc2U2NDogZW5jb2RlQmFzZTY0LFxuICAgIGRlY29kZUJhc2U2NDogZGVjb2RlQmFzZTY0XG4gIH07XG59KCkpO1xuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjb25zdCBBdWRpb0NvZGVjID0ge1xuICBQQ01VOiAncGNtdScsXG4gIFBDTUE6ICdwY21hJyxcbiAgT1BVUzogJ29wdXMnLFxuICBHNzIyOiAnZzcyMicsXG4gIElTQUM6ICdpU0FDJyxcbiAgSUxCQzogJ2lMQkMnLFxuICBBQUM6ICdhYWMnLFxuICBBQzM6ICdhYzMnLFxuICBORUxMWU1PU0VSOiAnbmVsbHltb3Nlcidcbn07XG4vKipcbiAqIEBjbGFzcyBBdWRpb0NvZGVjUGFyYW1ldGVyc1xuICogQG1lbWJlck9mIE9tcy5CYXNlXG4gKiBAY2xhc3NEZXNjIENvZGVjIHBhcmFtZXRlcnMgZm9yIGFuIGF1ZGlvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9Db2RlY1BhcmFtZXRlcnMge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjaGFubmVsQ291bnQsIGNsb2NrUmF0ZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gbmFtZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5BdWRpb0NvZGVjUGFyYW1ldGVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIE5hbWUgb2YgYSBjb2RlYy4gUGxlYXNlIGEgdmFsdWUgaW4gT21zLkJhc2UuQXVkaW9Db2RlYy4gSG93ZXZlciwgc29tZSBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgYWxsIHRoZSB2YWx1ZXMgaW4gT21zLkJhc2UuQXVkaW9Db2RlYy5cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGNoYW5uZWxDb3VudFxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5BdWRpb0NvZGVjUGFyYW1ldGVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIE51bWJlcnMgb2YgY2hhbm5lbHMgZm9yIGFuIGF1ZGlvIHRyYWNrLlxuICAgICAqL1xuICAgIHRoaXMuY2hhbm5lbENvdW50ID0gY2hhbm5lbENvdW50O1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGNsb2NrUmF0ZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5BdWRpb0NvZGVjUGFyYW1ldGVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIFRoZSBjb2RlYyBjbG9jayByYXRlIGV4cHJlc3NlZCBpbiBIZXJ0ei5cbiAgICAgKi9cbiAgICB0aGlzLmNsb2NrUmF0ZSA9IGNsb2NrUmF0ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBBdWRpb0VuY29kaW5nUGFyYW1ldGVyc1xuICogQG1lbWJlck9mIE9tcy5CYXNlXG4gKiBAY2xhc3NEZXNjIEVuY29kaW5nIHBhcmFtZXRlcnMgZm9yIHNlbmRpbmcgYW4gYXVkaW8gdHJhY2suXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBBdWRpb0VuY29kaW5nUGFyYW1ldGVycyB7XG4gIGNvbnN0cnVjdG9yKGNvZGVjLCBtYXhCaXRyYXRlKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P09tcy5CYXNlLkF1ZGlvQ29kZWNQYXJhbWV0ZXJzfSBjb2RlY1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5BdWRpb0VuY29kaW5nUGFyYW1ldGVyc1xuICAgICAqL1xuICAgIHRoaXMuY29kZWMgPSBjb2RlYztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBtYXhCaXRyYXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLkF1ZGlvRW5jb2RpbmdQYXJhbWV0ZXJzXG4gICAgICogQGRlc2MgTWF4IGJpdHJhdGUgZXhwcmVzc2VkIGluIGticHMuXG4gICAgICovXG4gICAgdGhpcy5tYXhCaXRyYXRlID0gbWF4Qml0cmF0ZTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgVmlkZW9Db2RlYyA9IHtcbiAgVlA4OiAndnA4JyxcbiAgVlA5OiAndnA5JyxcbiAgSDI2NDogJ2gyNjQnLFxuICBIMjY1OiAnaDI2NSdcbn07XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvQ29kZWNQYXJhbWV0ZXJzXG4gKiBAbWVtYmVyT2YgT21zLkJhc2VcbiAqIEBjbGFzc0Rlc2MgQ29kZWMgcGFyYW1ldGVycyBmb3IgYSB2aWRlbyB0cmFjay5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFZpZGVvQ29kZWNQYXJhbWV0ZXJzIHtcbiAgY29uc3RydWN0b3IobmFtZSwgcHJvZmlsZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gbmFtZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5WaWRlb0NvZGVjUGFyYW1ldGVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIE5hbWUgb2YgYSBjb2RlYy4gUGxlYXNlIGEgdmFsdWUgaW4gT21zLkJhc2UuQXVkaW9Db2RlYy4gSG93ZXZlciwgc29tZSBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgYWxsIHRoZSB2YWx1ZXMgaW4gT21zLkJhc2UuQXVkaW9Db2RlYy5cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9zdHJpbmd9IHByb2ZpbGVcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuVmlkZW9Db2RlY1BhcmFtZXRlcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBUaGUgcHJvZmlsZSBvZiBhIGNvZGVjLiBQcm9maWxlIG1heSBub3QgYXBwbHkgdG8gYWxsIGNvZGVjcy5cbiAgICAgKi9cbiAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvRW5jb2RpbmdQYXJhbWV0ZXJzXG4gKiBAbWVtYmVyT2YgT21zLkJhc2VcbiAqIEBjbGFzc0Rlc2MgRW5jb2RpbmcgcGFyYW1ldGVycyBmb3Igc2VuZGluZyBhIHZpZGVvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnMge1xuICBjb25zdHJ1Y3Rvcihjb2RlYywgbWF4Qml0cmF0ZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9PbXMuQmFzZS5WaWRlb0NvZGVjUGFyYW1ldGVyc30gY29kZWNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjID0gY29kZWM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gbWF4Qml0cmF0ZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5WaWRlb0VuY29kaW5nUGFyYW1ldGVyc1xuICAgICAqIEBkZXNjIE1heCBiaXRyYXRlIGV4cHJlc3NlZCBpbiBrYnBzLlxuICAgICAqL1xuICAgIHRoaXMubWF4Qml0cmF0ZSA9IG1heEJpdHJhdGU7XG4gIH1cbn1cbiIsIi8vIE1JVCBMaWNlbnNlXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDEyIFVuaXZlcnNpZGFkIFBvbGl0w6ljbmljYSBkZSBNYWRyaWRcbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG4vLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8vIFRoaXMgZmlsZSBpcyBib3Jyb3dlZCBmcm9tIGx5bmNraWEvbGljb2RlIHdpdGggc29tZSBtb2RpZmljYXRpb25zLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlclxuICogQGNsYXNzRGVzYyBBIHNoaW0gZm9yIEV2ZW50VGFyZ2V0LiBNaWdodCBiZSBjaGFuZ2VkIHRvIEV2ZW50VGFyZ2V0IGxhdGVyLlxuICogQG1lbWJlcm9mIE9tcy5CYXNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjb25zdCBFdmVudERpc3BhdGNoZXIgPSBmdW5jdGlvbigpIHtcbiAgLy8gUHJpdmF0ZSB2YXJzXG4gIGNvbnN0IHNwZWMgPSB7fTtcbiAgc3BlYy5kaXNwYXRjaGVyID0ge307XG4gIHNwZWMuZGlzcGF0Y2hlci5ldmVudExpc3RlbmVycyA9IHt9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lclxuICAgKiBAZGVzYyBUaGlzIGZ1bmN0aW9uIHJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIGFzIGEgaGFuZGxlciBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgZXZlbnQuIEl0J3Mgc2hvcnRlbmVkIGZvcm0gaXMgb24oZXZlbnRUeXBlLCBsaXN0ZW5lcikuIFNlZSB0aGUgZXZlbnQgZGVzY3JpcHRpb24gaW4gdGhlIGZvbGxvd2luZyB0YWJsZS48YnI+XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgRXZlbnQgc3RyaW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciBDYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIHRoaXMuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICBpZiAoc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50VHlwZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50VHlwZV0gPSBbXTtcbiAgICB9XG4gICAgc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50VHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyXG4gICAqIEBkZXNjIFRoaXMgZnVuY3Rpb24gcmVtb3ZlcyBhIHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXIuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgRXZlbnQgc3RyaW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciBDYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIpIHtcbiAgICBpZiAoIXNwZWMuZGlzcGF0Y2hlci5ldmVudExpc3RlbmVyc1tldmVudFR5cGVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBpbmRleCA9IHNwZWMuZGlzcGF0Y2hlci5ldmVudExpc3RlbmVyc1tldmVudFR5cGVdLmluZGV4T2YobGlzdGVuZXIpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHNwZWMuZGlzcGF0Y2hlci5ldmVudExpc3RlbmVyc1tldmVudFR5cGVdLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gY2xlYXJFdmVudExpc3RlbmVyXG4gICAqIEBkZXNjIFRoaXMgZnVuY3Rpb24gcmVtb3ZlcyBhbGwgZXZlbnQgbGlzdGVuZXJzIGZvciBvbmUgdHlwZS5cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBFdmVudCBzdHJpbmcuXG4gICAqL1xuICB0aGlzLmNsZWFyRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50VHlwZSkge1xuICAgIHNwZWMuZGlzcGF0Y2hlci5ldmVudExpc3RlbmVyc1tldmVudFR5cGVdID0gW107XG4gIH07XG5cbiAgLy8gSXQgZGlzcGF0Y2ggYSBuZXcgZXZlbnQgdG8gdGhlIGV2ZW50IGxpc3RlbmVycywgYmFzZWQgb24gdGhlIHR5cGVcbiAgLy8gb2YgZXZlbnQuIEFsbCBldmVudHMgYXJlIGludGVuZGVkIHRvIGJlIExpY29kZUV2ZW50cy5cbiAgdGhpcy5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoIXNwZWMuZGlzcGF0Y2hlci5ldmVudExpc3RlbmVyc1tldmVudC50eXBlXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnQudHlwZV0ubWFwKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICBsaXN0ZW5lcihldmVudCk7XG4gICAgfSk7XG4gIH07XG59O1xuXG4vKipcbiAqIEBjbGFzcyBPbXNFdmVudFxuICogQGNsYXNzRGVzYyBDbGFzcyBPbXNFdmVudCByZXByZXNlbnRzIGEgZ2VuZXJpYyBFdmVudCBpbiB0aGUgbGlicmFyeS5cbiAqIEBtZW1iZXJvZiBPbXMuQmFzZVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgT21zRXZlbnQge1xuICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBNZXNzYWdlRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgTWVzc2FnZUV2ZW50IHJlcHJlc2VudHMgYSBtZXNzYWdlIEV2ZW50IGluIHRoZSBsaWJyYXJ5LlxuICogQG1lbWJlcm9mIE9tcy5CYXNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXNzYWdlRXZlbnQgZXh0ZW5kcyBPbXNFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIGluaXQpIHtcbiAgICBzdXBlcih0eXBlKTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IG9yaWdpblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5NZXNzYWdlRXZlbnRcbiAgICAgKiBAZGVzYyBJRCBvZiB0aGUgcmVtb3RlIGVuZHBvaW50IHdobyBwdWJsaXNoZWQgdGhpcyBzdHJlYW0uXG4gICAgICovXG4gICAgdGhpcy5vcmlnaW4gPSBpbml0Lm9yaWdpbjtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuTWVzc2FnZUV2ZW50XG4gICAgICovXG4gICAgdGhpcy5tZXNzYWdlID0gaW5pdC5tZXNzYWdlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gdG9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuTWVzc2FnZUV2ZW50XG4gICAgICogQGRlc2MgVmFsdWVzIGNvdWxkIGJlIFwiYWxsXCIsIFwibWVcIiBpbiBjb25mZXJlbmNlIG1vZGUsIG9yIHVuZGVmaW5lZCBpbiBQMlAgbW9kZS4uXG4gICAgICovXG4gICAgdGhpcy50byA9IGluaXQudG87XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgRXJyb3JFdmVudFxuICogQGNsYXNzRGVzYyBDbGFzcyBFcnJvckV2ZW50IHJlcHJlc2VudHMgYW4gZXJyb3IgRXZlbnQgaW4gdGhlIGxpYnJhcnkuXG4gKiBAbWVtYmVyb2YgT21zLkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEVycm9yRXZlbnQgZXh0ZW5kcyBPbXNFdmVudHtcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge0Vycm9yfSBlcnJvclxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5FcnJvckV2ZW50XG4gICAgICovXG4gICAgdGhpcy5lcnJvciA9IGluaXQuZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgTXV0ZUV2ZW50XG4gKiBAY2xhc3NEZXNjIENsYXNzIE11dGVFdmVudCByZXByZXNlbnRzIGEgbXV0ZSBvciB1bm11dGUgZXZlbnQuXG4gKiBAbWVtYmVyb2YgT21zLkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIE11dGVFdmVudCBleHRlbmRzIE9tc0V2ZW50IHtcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCl7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T21zLkJhc2UuVHJhY2tLaW5kfSBraW5kXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLk11dGVFdmVudFxuICAgICAqL1xuICAgIHRoaXMua2luZCA9IGluaXQua2luZDtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG5leHBvcnQgKiBmcm9tICcuL21lZGlhc3RyZWFtLWZhY3RvcnkuanMnXG5leHBvcnQgKiBmcm9tICcuL3N0cmVhbS5qcydcbmV4cG9ydCAqIGZyb20gJy4vbWVkaWFmb3JtYXQuanMnXG4iLCIvLyBNSVQgTGljZW5zZVxuLy9cbi8vIENvcHlyaWdodCAoYykgMjAxMiBVbml2ZXJzaWRhZCBQb2xpdMOpY25pY2EgZGUgTWFkcmlkXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuLy8gY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4vLyBTT0ZUV0FSRS5cblxuLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4vLyBUaGlzIGZpbGUgaXMgYm9ycm93ZWQgZnJvbSBseW5ja2lhL2xpY29kZSB3aXRoIHNvbWUgbW9kaWZpY2F0aW9ucy5cblxuLypnbG9iYWwgY29uc29sZSovXG5cbi8qXG4gKiBBUEkgdG8gd3JpdGUgbG9ncyBiYXNlZCBvbiB0cmFkaXRpb25hbCBsb2dnaW5nIG1lY2hhbmlzbXM6IGRlYnVnLCB0cmFjZSwgaW5mbywgd2FybmluZywgZXJyb3JcbiAqL1xudmFyIExvZ2dlciA9IChmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBERUJVRyA9IDAsXG4gICAgVFJBQ0UgPSAxLFxuICAgIElORk8gPSAyLFxuICAgIFdBUk5JTkcgPSAzLFxuICAgIEVSUk9SID0gNCxcbiAgICBOT05FID0gNTtcblxuICB2YXIgbm9PcCA9IGZ1bmN0aW9uKCkge307XG5cbiAgLy8gfHRoYXR8IGlzIHRoZSBvYmplY3QgdG8gYmUgcmV0dXJuZWQuXG4gIHZhciB0aGF0ID0ge1xuICAgIERFQlVHOiBERUJVRyxcbiAgICBUUkFDRTogVFJBQ0UsXG4gICAgSU5GTzogSU5GTyxcbiAgICBXQVJOSU5HOiBXQVJOSU5HLFxuICAgIEVSUk9SOiBFUlJPUixcbiAgICBOT05FOiBOT05FXG4gIH07XG5cbiAgdGhhdC5sb2cgPSB3aW5kb3cuY29uc29sZS5sb2cuYmluZCh3aW5kb3cuY29uc29sZSk7XG5cbiAgdmFyIGJpbmRUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93LmNvbnNvbGVbdHlwZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB3aW5kb3cuY29uc29sZVt0eXBlXS5iaW5kKHdpbmRvdy5jb25zb2xlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHdpbmRvdy5jb25zb2xlLmxvZy5iaW5kKHdpbmRvdy5jb25zb2xlKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHNldExvZ0xldmVsID0gZnVuY3Rpb24obGV2ZWwpIHtcbiAgICBpZiAobGV2ZWwgPD0gREVCVUcpIHtcbiAgICAgIHRoYXQuZGVidWcgPSBiaW5kVHlwZSgnbG9nJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuZGVidWcgPSBub09wO1xuICAgIH1cbiAgICBpZiAobGV2ZWwgPD0gVFJBQ0UpIHtcbiAgICAgIHRoYXQudHJhY2UgPSBiaW5kVHlwZSgndHJhY2UnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC50cmFjZSA9IG5vT3A7XG4gICAgfVxuICAgIGlmIChsZXZlbCA8PSBJTkZPKSB7XG4gICAgICB0aGF0LmluZm8gPSBiaW5kVHlwZSgnaW5mbycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LmluZm8gPSBub09wO1xuICAgIH1cbiAgICBpZiAobGV2ZWwgPD0gV0FSTklORykge1xuICAgICAgdGhhdC53YXJuaW5nID0gYmluZFR5cGUoJ3dhcm4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC53YXJuaW5nID0gbm9PcDtcbiAgICB9XG4gICAgaWYgKGxldmVsIDw9IEVSUk9SKSB7XG4gICAgICB0aGF0LmVycm9yID0gYmluZFR5cGUoJ2Vycm9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuZXJyb3IgPSBub09wO1xuICAgIH1cbiAgfTtcblxuICBzZXRMb2dMZXZlbChERUJVRyk7IC8vIERlZmF1bHQgbGV2ZWwgaXMgZGVidWcuXG5cbiAgdGhhdC5zZXRMb2dMZXZlbCA9IHNldExvZ0xldmVsO1xuXG4gIHJldHVybiB0aGF0O1xufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9nZ2VyO1xuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG4vKipcbiAqIFNvdXJjZSBpbmZvIGFib3V0IGFuIGF1ZGlvIHRyYWNrLiBWYWx1ZXM6ICdtaWMnLCAnc2NyZWVuLWNhc3QnLCAnZmlsZScsICdtaXhlZCcuXG4gKiBAbWVtYmVyT2YgT21zLkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IEF1ZGlvU291cmNlSW5mbyA9IHtcbiAgTUlDOiAnbWljJyxcbiAgU0NSRUVOQ0FTVDogJ3NjcmVlbi1jYXN0JyxcbiAgRklMRTogJ2ZpbGUnLFxuICBNSVhFRDogJ21peGVkJ1xufTtcblxuLyoqXG4gKiBTb3VyY2UgaW5mbyBhYm91dCBhIHZpZGVvIHRyYWNrLiBWYWx1ZXM6ICdjYW1lcmEnLCAnc2NyZWVuLWNhc3QnLCAnZmlsZScsICdtaXhlZCcuXG4gKiBAbWVtYmVyT2YgT21zLkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFZpZGVvU291cmNlSW5mbyA9IHtcbiAgQ0FNRVJBOiAnY2FtZXJhJyxcbiAgU0NSRUVOQ0FTVDogJ3NjcmVlbi1jYXN0JyxcbiAgRklMRTogJ2ZpbGUnLFxuICBNSVhFRDogJ21peGVkJ1xufTtcblxuLyoqXG4gKiBLaW5kIG9mIGEgdHJhY2suIFZhbHVlczogJ2F1ZGlvJyBmb3IgYXVkaW8gdHJhY2ssICd2aWRlbycgZm9yIHZpZGVvIHRyYWNrLCAnYXYnIGZvciBib3RoIGF1ZGlvIGFuZCB2aWRlbyB0cmFja3MuXG4gKiBAbWVtYmVyT2YgT21zLkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFRyYWNrS2luZCA9IHtcbiAgLyoqXG4gICAqIEF1ZGlvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBBVURJTzogJ2F1ZGlvJyxcbiAgLyoqXG4gICAqIFZpZGVvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBWSURFTzogJ3ZpZGVvJyxcbiAgLyoqXG4gICAqIEJvdGggYXVkaW8gYW5kIHZpZGVvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBBVURJT19BTkRfVklERU86ICdhdidcbn07XG4vKipcbiAqIEBjbGFzcyBSZXNvbHV0aW9uXG4gKiBAbWVtYmVyT2YgT21zLkJhc2VcbiAqIEBjbGFzc0Rlc2MgVGhlIFJlc29sdXRpb24gZGVmaW5lcyB0aGUgc2l6ZSBvZiBhIHJlY3RhbmdsZS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XG4gKi9cbmV4cG9ydCBjbGFzcyBSZXNvbHV0aW9uIHtcbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge251bWJlcn0gd2lkdGhcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuUmVzb2x1dGlvblxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IGhlaWdodFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5SZXNvbHV0aW9uXG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscy5qcydcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXIuanMnXG5pbXBvcnQgeyBSZXNvbHV0aW9uIH0gZnJvbSAnLi9tZWRpYWZvcm1hdC5qcydcbmltcG9ydCAqIGFzIE1lZGlhRm9ybWF0TW9kdWxlIGZyb20gJy4vbWVkaWFmb3JtYXQuanMnXG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvVHJhY2tDb25zdHJhaW50c1xuICogQGNsYXNzRGVzYyBDb25zdHJhaW50cyBmb3IgY3JlYXRpbmcgYW4gYXVkaW8gTWVkaWFTdHJlYW1UcmFjay5cbiAqIEBtZW1iZXJvZiBPbXMuQmFzZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09tcy5CYXNlLkF1ZGlvU291cmNlSW5mb30gc291cmNlIFNvdXJjZSBpbmZvIG9mIHRoaXMgYXVkaW8gdHJhY2suXG4gKi9cbmV4cG9ydCBjbGFzcyBBdWRpb1RyYWNrQ29uc3RyYWludHMge1xuICBjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcbiAgICBpZiAoIU9iamVjdC52YWx1ZXMoTWVkaWFGb3JtYXRNb2R1bGUuQXVkaW9Tb3VyY2VJbmZvKVxuICAgICAgICAgICAgIC5zb21lKHYgPT4gdiA9PT0gc291cmNlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBzb3VyY2UuJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gc291cmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLkF1ZGlvVHJhY2tDb25zdHJhaW50c1xuICAgICAqIEBkZXNjIFZhbHVlcyBjb3VsZCBiZSBcIm1pY1wiLCBcInNjcmVlbi1jYXN0XCIsIFwiZmlsZVwiIG9yIFwibWl4ZWRcIi5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGRldmljZUlkXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLkF1ZGlvVHJhY2tDb25zdHJhaW50c1xuICAgICAqIEBkZXNjIERvIG5vdCBwcm92aWRlIGRldmljZUlkIGlmIHNvdXJjZSBpcyBub3QgXCJtaWNcIi5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAc2VlIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9tZWRpYWNhcHR1cmUtbWFpbi8jZGVmLWNvbnN0cmFpbnQtZGV2aWNlSWRcbiAgICAgKi9cbiAgICAgdGhpcy5kZXZpY2VJZCA9IHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBWaWRlb1RyYWNrQ29uc3RyYWludHNcbiAqIEBjbGFzc0Rlc2MgQ29uc3RyYWludHMgZm9yIGNyZWF0aW5nIGEgdmlkZW8gTWVkaWFTdHJlYW1UcmFjay5cbiAqIEBtZW1iZXJvZiBPbXMuQmFzZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09tcy5CYXNlLlZpZGVvU291cmNlSW5mb30gc291cmNlIFNvdXJjZSBpbmZvIG9mIHRoaXMgdmlkZW8gdHJhY2suXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1RyYWNrQ29uc3RyYWludHMge1xuICBjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcbiAgICBpZiAoIU9iamVjdC52YWx1ZXMoTWVkaWFGb3JtYXRNb2R1bGUuVmlkZW9Tb3VyY2VJbmZvKVxuICAgICAgICAgICAgIC5zb21lKHYgPT4gdiA9PT0gc291cmNlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBzb3VyY2UuJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gc291cmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLlZpZGVvVHJhY2tDb25zdHJhaW50c1xuICAgICAqIEBkZXNjIFZhbHVlcyBjb3VsZCBiZSBcImNhbWVyYVwiLCBcInNjcmVlbi1jYXN0XCIsIFwiZmlsZVwiIG9yIFwibWl4ZWRcIi5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGRldmljZUlkXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLlZpZGVvVHJhY2tDb25zdHJhaW50c1xuICAgICAqIEBkZXNjIERvIG5vdCBwcm92aWRlIGRldmljZUlkIGlmIHNvdXJjZSBpcyBub3QgXCJjYW1lcmFcIi5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAc2VlIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9tZWRpYWNhcHR1cmUtbWFpbi8jZGVmLWNvbnN0cmFpbnQtZGV2aWNlSWRcbiAgICAgKi9cblxuICAgIHRoaXMuZGV2aWNlSWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtPbXMuQmFzZS5SZXNvbHV0aW9ufSByZXNvbHV0aW9uXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLlZpZGVvVHJhY2tDb25zdHJhaW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMucmVzb2x1dGlvbiA9IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge251bWJlcn0gZnJhbWVSYXRlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLlZpZGVvVHJhY2tDb25zdHJhaW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMuZnJhbWVSYXRlID0gdW5kZWZpbmVkO1xuICB9XG59XG4vKipcbiAqIEBjbGFzcyBTdHJlYW1Db25zdHJhaW50c1xuICogQGNsYXNzRGVzYyBDb25zdHJhaW50cyBmb3IgY3JlYXRpbmcgYSBNZWRpYVN0cmVhbSBmcm9tIHNjcmVlbiBtaWMgYW5kIGNhbWVyYS5cbiAqIEBtZW1iZXJvZiBPbXMuQmFzZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gez9PbXMuQmFzZS5BdWRpb1RyYWNrQ29uc3RyYWludHN9IGF1ZGlvQ29uc3RyYWludHNcbiAqIEBwYXJhbSB7P09tcy5CYXNlLlZpZGVvVHJhY2tDb25zdHJhaW50c30gdmlkZW9Db25zdHJhaW50c1xuICogQHBhcmFtIHs/c3RyaW5nfSBleHRlbnNpb25JZCBUaGUgSUQgb2YgQ2hyb21lIHNjcmVlbiBzaGFyaW5nIGV4dGVuc2lvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmVhbUNvbnN0cmFpbnRzIHtcbiAgY29uc3RydWN0b3IoYXVkaW9Db25zdHJhaW50cyA9IGZhbHNlLCB2aWRlb0NvbnN0cmFpbnRzID0gZmFsc2UpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtPbXMuQmFzZS5NZWRpYVN0cmVhbVRyYWNrRGV2aWNlQ29uc3RyYWludHNGb3JBdWRpb30gYXVkaW9cbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuTWVkaWFTdHJlYW1EZXZpY2VDb25zdHJhaW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMuYXVkaW8gPSBhdWRpb0NvbnN0cmFpbnRzO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge09tcy5CYXNlLk1lZGlhU3RyZWFtVHJhY2tEZXZpY2VDb25zdHJhaW50c0ZvclZpZGVvfSBWaWRlb1xuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5NZWRpYVN0cmVhbURldmljZUNvbnN0cmFpbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy52aWRlbyA9IHZpZGVvQ29uc3RyYWludHM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBleHRlbnNpb25JZFxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5NZWRpYVN0cmVhbURldmljZUNvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgVGhlIElEIG9mIENocm9tZSBFeHRlbnNpb24gZm9yIHNjcmVlbiBzaGFyaW5nLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykge1xuICByZXR1cm4gKHR5cGVvZiBjb25zdHJhaW50cy52aWRlbyA9PT0gJ29iamVjdCcgJiYgY29uc3RyYWludHMudmlkZW8uc291cmNlID09PVxuICAgIE1lZGlhRm9ybWF0TW9kdWxlLlZpZGVvU291cmNlSW5mby5TQ1JFRU5DQVNUKTtcbn1cblxuLyoqXG4gKiBAY2xhc3MgTWVkaWFTdHJlYW1GYWN0b3J5XG4gKiBAY2xhc3NEZXNjIEEgZmFjdG9yeSB0byBjcmVhdGUgTWVkaWFTdHJlYW0uIFlvdSBjYW4gYWxzbyBjcmVhdGUgTWVkaWFTdHJlYW0gYnkgeW91cnNlbGYuXG4gKiBAbWVtYmVyb2YgT21zLkJhc2VcbiAqL1xuZXhwb3J0IGNsYXNzIE1lZGlhU3RyZWFtRmFjdG9yeSB7XG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gY3JlYXRlTWVkaWFTdHJlYW1cbiAgICogQHN0YXRpY1xuICAgKiBAZGVzYyBDcmVhdGUgYSBNZWRpYVN0cmVhbSB3aXRoIGdpdmVuIGNvbnN0cmFpbnRzLiBJZiB5b3Ugd2FudCB0byBjcmVhdGUgYSBNZWRpYVN0cmVhbSBmb3Igc2NyZWVuIGNhc3QsIHBsZWFzZSBtYWtlIHN1cmUgYm90aCBhdWRpbyBhbmQgdmlkZW8ncyBzb3VyY2UgYXJlIFwic2NyZWVuLWNhc3RcIi5cbiAgICogQG1lbWJlcm9mIE9tcy5CYXNlLk1lZGlhU3RyZWFtRmFjdG9yeVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNZWRpYVN0cmVhbSwgRXJyb3I+fSBSZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiBzdHJlYW0gaXMgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQsIG9yIHJlamVjdGVkIGlmIG9uZSBvZiB0aGUgZm9sbG93aW5nIGVycm9yIGhhcHBlbmVkOlxuICAgKiAtIE9uZSBvciBtb3JlIHBhcmFtZXRlcnMgY2Fubm90IGJlIHNhdGlzZmllZC5cbiAgICogLSBTcGVjaWZpZWQgZGV2aWNlIGlzIGJ1c3kuXG4gICAqIC0gQ2Fubm90IG9idGFpbiBuZWNlc3NhcnkgcGVybWlzc2lvbiBvciBvcGVyYXRpb24gaXMgY2FuY2VsZWQgYnkgdXNlci5cbiAgICogLSBWaWRlbyBzb3VyY2UgaXMgc2NyZWVuIGNhc3QsIHdoaWxlIGF1ZGlvIHNvdXJjZSBpcyBub3QuXG4gICAqIC0gQXVkaW8gc291cmNlIGlzIHNjcmVlbiBjYXN0LCB3aGlsZSB2aWRlbyBzb3VyY2UgaXMgZGlzYWJsZWQuXG4gICAqIEBwYXJhbSB7T21zLkJhc2UuU3RyZWFtQ29uc3RyYWludHN9IGNvbnN0cmFpbnRzXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlTWVkaWFTdHJlYW0oY29uc3RyYWludHMpIHtcbiAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzICE9PSAnb2JqZWN0JyB8fCAoIWNvbnN0cmFpbnRzLmF1ZGlvICYmICFcbiAgICAgICAgY29uc3RyYWludHMudmlkZW8pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignSW52YWxpZCBjb25zdHJhaW5zJykpO1xuICAgIH1cbiAgICBpZiAoIWlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiYgKHR5cGVvZiBjb25zdHJhaW50cy5hdWRpbyA9PT1cbiAgICAgICAgJ29iamVjdCcpICYmIGNvbnN0cmFpbnRzLmF1ZGlvLnNvdXJjZSA9PT0gTWVkaWFGb3JtYXRNb2R1bGUuQXVkaW9Tb3VyY2VJbmZvXG4gICAgICAuU0NSRUVOQ0FTVCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBzaGFyZSBzY3JlZW4gd2l0aG91dCB2aWRlby4nKSk7XG4gICAgfVxuICAgIGlmIChpc1ZpZGVvQ29uc3RyYWluc0ZvclNjcmVlbkNhc3QoY29uc3RyYWludHMpICYmICF1dGlscy5pc0Nocm9tZSgpICYmICF1dGlsc1xuICAgICAgLmlzRmlyZWZveCgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ1NjcmVlbiBzaGFyaW5nIG9ubHkgc3VwcG9ydHMgQ2hyb21lIGFuZCBGaXJlZm94LicpKTtcbiAgICB9XG4gICAgaWYgKGlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiYgdHlwZW9mIGNvbnN0cmFpbnRzLmF1ZGlvID09PVxuICAgICAgJ29iamVjdCcgJiYgY29uc3RyYWludHMuYXVkaW8uc291cmNlICE9PSBNZWRpYUZvcm1hdE1vZHVsZS5BdWRpb1NvdXJjZUluZm9cbiAgICAgIC5TQ1JFRU5DQVNUKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBjYXB0dXJlIHZpZGVvIGZyb20gc2NyZWVuIGNhc3Qgd2hpbGUgY2FwdHVyZSBhdWRpbyBmcm9tIG90aGVyIHNvdXJjZS4nXG4gICAgICApKTtcbiAgICB9O1xuICAgIC8vIFNjcmVlbiBzaGFyaW5nIG9uIENocm9tZSBkb2VzIG5vdCB3b3JrIHdpdGggdGhlIGxhdGVzdCBjb25zdHJhaW50cyBmb3JtYXQuXG4gICAgaWYgKGlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiYgdXRpbHMuaXNDaHJvbWUoKSkge1xuICAgICAgaWYgKCFjb25zdHJhaW50cy5leHRlbnNpb25JZCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnRXh0ZW5zaW9uIElEIG11c3QgYmUgc3BlY2lmaWVkIGZvciBzY3JlZW4gc2hhcmluZyBvbiBDaHJvbWUuJykpO1xuICAgICAgfVxuICAgICAgY29uc3QgZGVza3RvcENhcHR1cmVTb3VyY2VzID0gWydzY3JlZW4nLCAnd2luZG93JywgJ3RhYiddO1xuICAgICAgaWYgKGNvbnN0cmFpbnRzLmF1ZGlvKSB7XG4gICAgICAgIGRlc2t0b3BDYXB0dXJlU291cmNlcy5wdXNoKCdhdWRpbycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoY29uc3RyYWludHMuZXh0ZW5zaW9uSWQsIHtcbiAgICAgICAgICBnZXRTdHJlYW06IGRlc2t0b3BDYXB0dXJlU291cmNlc1xuICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY29uc3RyYWludHMuYXVkaW8gJiYgdHlwZW9mIHJlc3BvbnNlLm9wdGlvbnMgIT09XG4gICAgICAgICAgICAnb2JqZWN0Jykge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgICAgICdEZXNrdG9wIHNoYXJpbmcgd2l0aCBhdWRpbyByZXF1aXJlcyB0aGUgbGF0ZXN0IENocm9tZSBleHRlbnNpb24uIFlvdXIgYXVkaW8gY29uc3RyYWludHMgd2lsbCBiZSBpZ25vcmVkLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG1lZGlhQ29uc3RyYWludHMgPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICAgICAgICBpZiAoY29uc3RyYWludHMuYXVkaW8gJiYgKHR5cGVvZiByZXNwb25zZS5vcHRpb25zID09PVxuICAgICAgICAgICAgICAnb2JqZWN0JykpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5vcHRpb25zLmNhblJlcXVlc3RBdWRpb1RyYWNrKSB7XG4gICAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMuYXVkaW8gPSB7XG4gICAgICAgICAgICAgICAgbWFuZGF0b3J5OiB7XG4gICAgICAgICAgICAgICAgICBjaHJvbWVNZWRpYVNvdXJjZTogJ2Rlc2t0b3AnLFxuICAgICAgICAgICAgICAgICAgY2hyb21lTWVkaWFTb3VyY2VJZDogcmVzcG9uc2Uuc3RyZWFtSWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIExvZ2dlci53YXJuaW5nKFxuICAgICAgICAgICAgICAgICdTaGFyaW5nIHNjcmVlbiB3aXRoIGF1ZGlvIHdhcyBub3Qgc2VsZWN0ZWQgYnkgdXNlci4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8gPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLm1hbmRhdG9yeSA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5LmNocm9tZU1lZGlhU291cmNlID1cbiAgICAgICAgICAgICdkZXNrdG9wJztcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLm1hbmRhdG9yeS5jaHJvbWVNZWRpYVNvdXJjZUlkID1cbiAgICAgICAgICAgIHJlc3BvbnNlLnN0cmVhbUlkO1xuICAgICAgICAgIC8vIFRyYW5zZm9ybSBuZXcgY29uc3RyYWludCBmb3JtYXQgdG8gdGhlIG9sZCBzdHlsZS4gQmVjYXVzZSBjaHJvbWVNZWRpYVNvdXJjZSBvbmx5IHN1cHBvcnRlZCBpbiB0aGUgb2xkIHN0eWxlLCBhbmQgbWl4IG5ldyBhbmQgb2xkIHN0eWxlIHdpbGwgcmVzdWx0IHR5cGUgZXJyb3I6IFwiQ2Fubm90IHVzZSBib3RoIG9wdGlvbmFsL21hbmRhdG9yeSBhbmQgc3BlY2lmaWMgb3IgYWR2YW5jZWQgY29uc3RyYWludHMuXCIuXG4gICAgICAgICAgaWYgKGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24pIHtcbiAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5Lm1heEhlaWdodCA9XG4gICAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5Lm1pbkhlaWdodCA9XG4gICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24uaGVpZ2h0O1xuICAgICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby5tYW5kYXRvcnkubWF4V2lkdGggPVxuICAgICAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLm1hbmRhdG9yeS5taW5XaWR0aCA9XG4gICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24ud2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjb25zdHJhaW50cy52aWRlby5mcmFtZVJhdGUpIHtcbiAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5Lm1pbkZyYW1lUmF0ZSA9IGNvbnN0cmFpbnRzLnZpZGVvLmZyYW1lUmF0ZTtcbiAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ubWFuZGF0b3J5Lm1heEZyYW1lUmF0ZSA9XG4gICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLmZyYW1lUmF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShcbiAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNvbnN0cmFpbnRzLmF1ZGlvICYmICFjb25zdHJhaW50cy52aWRlbykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnQXQgbGVhc3Qgb25lIG9mIGF1ZGlvIGFuZCB2aWRlbyBtdXN0IGJlIHJlcXVlc3RlZC4nKSk7XG4gICAgICB9XG4gICAgICBjb25zdCBtZWRpYUNvbnN0cmFpbnRzID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzLmF1ZGlvID09PSAnb2JqZWN0JyAmJiBjb25zdHJhaW50cy5hdWRpby5zb3VyY2UgPT09XG4gICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLkF1ZGlvU291cmNlSW5mby5NSUMpIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy5hdWRpbyA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgICBpZiAodXRpbHMuaXNFZGdlKCkpIHtcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLmF1ZGlvLmRldmljZUlkID0gY29uc3RyYWludHMuYXVkaW8uZGV2aWNlSWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVkaWFDb25zdHJhaW50cy5hdWRpby5kZXZpY2VJZCA9IHtcbiAgICAgICAgICAgIGV4YWN0OiBjb25zdHJhaW50cy5hdWRpby5kZXZpY2VJZFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lZGlhQ29uc3RyYWludHMuYXVkaW8gPSBjb25zdHJhaW50cy5hdWRpbztcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgY29uc3RyYWludHMuYXVkaW8gPT09ICdvYmplY3QnICYmIGNvbnN0cmFpbnRzLmF1ZGlvLnNvdXJjZSA9PT1cbiAgICAgICAgTWVkaWFGb3JtYXRNb2R1bGUuQXVkaW9Tb3VyY2VJbmZvLlNDUkVFTkNBU1QpIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgJ1NjcmVlbiBzaGFyaW5nIHdpdGggYXVkaW8gaXMgbm90IHN1cHBvcnRlZCBpbiBGaXJlZm94LicpO1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLmF1ZGlvID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzLnZpZGVvID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyYWludHMudmlkZW8uZnJhbWVSYXRlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8uZnJhbWVSYXRlID0gY29uc3RyYWludHMudmlkZW8uZnJhbWVSYXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25zdHJhaW50cy52aWRlby5yZXNvbHV0aW9uICYmIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24ud2lkdGggJiZcbiAgICAgICAgICBjb25zdHJhaW50cy52aWRlby5yZXNvbHV0aW9uLmhlaWdodCkge1xuICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8ud2lkdGggPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLndpZHRoLmV4YWN0ID0gY29uc3RyYWludHMudmlkZW8ucmVzb2x1dGlvbi53aWR0aDtcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLmhlaWdodCA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8uaGVpZ2h0LmV4YWN0ID0gY29uc3RyYWludHMudmlkZW8ucmVzb2x1dGlvbi5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHJhaW50cy52aWRlby5kZXZpY2VJZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLmRldmljZUlkID0geyBleGFjdDogY29uc3RyYWludHMudmlkZW8uZGV2aWNlSWQgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbHMuaXNGaXJlZm94KCkgJiYgY29uc3RyYWludHMudmlkZW8uc291cmNlID09PVxuICAgICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLlZpZGVvU291cmNlSW5mby5TQ1JFRU5DQVNUKSB7XG4gICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby5tZWRpYVNvdXJjZSA9ICdzY3JlZW4nO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvID0gY29uc3RyYWludHMudmlkZW87XG4gICAgICB9XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEobWVkaWFDb25zdHJhaW50cyk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscy5qcydcbmltcG9ydCAqIGFzIE1lZGlhRm9ybWF0IGZyb20gJy4vbWVkaWFmb3JtYXQuanMnXG5pbXBvcnQgeyBFdmVudERpc3BhdGNoZXJ9IGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnXG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvUHVibGljYXRpb25TZXR0aW5nc1xuICogQG1lbWJlck9mIE9tcy5CYXNlXG4gKiBAY2xhc3NEZXNjIFRoZSBhdWRpbyBzZXR0aW5ncyBvZiBhIHB1YmxpY2F0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9QdWJsaWNhdGlvblNldHRpbmdzIHtcbiAgY29uc3RydWN0b3IoY29kZWMpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T21zLkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnN9IGNvZGVjXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLkF1ZGlvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuY29kZWMgPSBjb2RlYztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBWaWRlb1B1YmxpY2F0aW9uU2V0dGluZ3NcbiAqIEBtZW1iZXJPZiBPbXMuQmFzZVxuICogQGNsYXNzRGVzYyBUaGUgdmlkZW8gc2V0dGluZ3Mgb2YgYSBwdWJsaWNhdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFZpZGVvUHVibGljYXRpb25TZXR0aW5ncyB7XG4gIGNvbnN0cnVjdG9yKGNvZGVjLCByZXNvbHV0aW9uLCBmcmFtZVJhdGUsIGJpdHJhdGUsIGtleUZyYW1lSW50ZXJ2YWwpe1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9PbXMuQmFzZS5WaWRlb0NvZGVjUGFyYW1ldGVyc30gY29kZWNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5jb2RlYz1jb2RlYyxcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T21zLkJhc2UuUmVzb2x1dGlvbn0gcmVzb2x1dGlvblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5WaWRlb1B1YmxpY2F0aW9uU2V0dGluZ3NcbiAgICAgKi9cbiAgICB0aGlzLnJlc29sdXRpb249cmVzb2x1dGlvbjtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBmcmFtZVJhdGVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuZnJhbWVSYXRlPWZyYW1lUmF0ZTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBiaXRyYXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuYml0cmF0ZT1iaXRyYXRlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMua2V5RnJhbWVJbnRlcnZhbD1rZXlGcmFtZUludGVydmFsO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFB1YmxpY2F0aW9uU2V0dGluZ3NcbiAqIEBtZW1iZXJPZiBPbXMuQmFzZVxuICogQGNsYXNzRGVzYyBUaGUgc2V0dGluZ3Mgb2YgYSBwdWJsaWNhdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFB1YmxpY2F0aW9uU2V0dGluZ3Mge1xuICBjb25zdHJ1Y3RvcihhdWRpbywgdmlkZW8pe1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge09tcy5CYXNlLkF1ZGlvUHVibGljYXRpb25TZXR0aW5nc30gYXVkaW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuYXVkaW89YXVkaW87XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T21zLkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzfSB2aWRlb1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy52aWRlbz12aWRlbztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBQdWJsaWNhdGlvblxuICogQG1lbWJlck9mIE9tcy5CYXNlXG4gKiBAY2xhc3NEZXNjIFB1YmxpY2F0aW9uIHJlcHJlc2VudHMgYSBzZW5kZXIgZm9yIHB1Ymxpc2hpbmcgYSBzdHJlYW0uIEl0IGhhbmRsZXMgdGhlIGFjdGlvbnMgb24gYSBMb2NhbFN0cmVhbSBwdWJsaXNoZWQgdG8gYSBjb25mZXJlbmNlLlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgIHwgQXJndW1lbnQgVHlwZSAgICB8IEZpcmVkIHdoZW4gICAgICAgfFxuICogfCAtLS0tLS0tLS0tLS0tLS0tfCAtLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLSB8XG4gKiB8IGVuZGVkICAgICAgICAgICB8IEV2ZW50ICAgICAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyBlbmRlZC4gfFxuICogfCBtdXRlICAgICAgICAgICAgfCBNdXRlRXZlbnQgICAgICAgIHwgUHVibGljYXRpb24gaXMgbXV0ZWQuIENsaWVudCBzdG9wcGVkIHNlbmRpbmcgYXVkaW8gYW5kL29yIHZpZGVvIGRhdGEgdG8gcmVtb3RlIGVuZHBvaW50LiB8XG4gKiB8IHVubXV0ZSAgICAgICAgICB8IE11dGVFdmVudCAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyB1bm11dGVkLiBDbGllbnQgY29udGludWVkIHNlbmRpbmcgYXVkaW8gYW5kL29yIHZpZGVvIGRhdGEgdG8gcmVtb3RlIGVuZHBvaW50LiB8XG4gKlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgUHVibGljYXRpb24gZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICBjb25zdHJ1Y3RvcihpZCwgc3RvcCwgZ2V0U3RhdHMsIG11dGUsIHVubXV0ZSkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBpZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5QdWJsaWNhdGlvblxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGlkID8gaWQgOiBVdGlscy5jcmVhdGVVdWlkKClcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gc3RvcFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIFN0b3AgY2VydGFpbiBwdWJsaWNhdGlvbi4gT25jZSBhIHN1YnNjcmlwdGlvbiBpcyBzdG9wcGVkLCBpdCBjYW5ub3QgYmUgcmVjb3ZlcmVkLlxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5QdWJsaWNhdGlvblxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICovXG4gICAgdGhpcy5zdG9wID0gc3RvcDtcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gZ2V0U3RhdHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBHZXQgc3RhdHMgb2YgdW5kZXJseWluZyBQZWVyQ29ubmVjdGlvbi5cbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuUHVibGljYXRpb25cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSVENTdGF0c1JlcG9ydCwgRXJyb3I+fVxuICAgICAqL1xuICAgIHRoaXMuZ2V0U3RhdHMgPSBnZXRTdGF0cztcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gbXV0ZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIFN0b3Agc2VuZGluZyBkYXRhIHRvIHJlbW90ZSBlbmRwb2ludC5cbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuUHVibGljYXRpb25cbiAgICAgKiBAcGFyYW0ge09tcy5CYXNlLlRyYWNrS2luZCB9IGtpbmQgS2luZCBvZiB0cmFja3MgdG8gYmUgbXV0ZWQuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dW5kZWZpbmVkLCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5tdXRlID0gbXV0ZTtcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gdW5tdXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgQ29udGludWUgc2VuZGluZyBkYXRhIHRvIHJlbW90ZSBlbmRwb2ludC5cbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuUHVibGljYXRpb25cbiAgICAgKiBAcGFyYW0ge09tcy5CYXNlLlRyYWNrS2luZCB9IGtpbmQgS2luZCBvZiB0cmFja3MgdG8gYmUgdW5tdXRlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICAgKi9cbiAgICB0aGlzLnVubXV0ZSA9IHVubXV0ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBQdWJsaXNoT3B0aW9uc1xuICogQG1lbWJlck9mIE9tcy5CYXNlXG4gKiBAY2xhc3NEZXNjIFB1Ymxpc2hPcHRpb25zIGRlZmluZXMgb3B0aW9ucyBmb3IgcHVibGlzaGluZyBhIE9tcy5CYXNlLkxvY2FsU3RyZWFtLlxuICovXG5leHBvcnQgY2xhc3MgUHVibGlzaE9wdGlvbnMge1xuICBjb25zdHJ1Y3RvcihhdWRpbywgdmlkZW8pIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/QXJyYXk8T21zLkJhc2UuQXVkaW9FbmNvZGluZ1BhcmFtZXRlcnM+fSBhdWRpb1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5QdWJsaXNoT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMuYXVkaW8gPSBhdWRpbztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/QXJyYXk8T21zLkJhc2UuVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnM+fSB2aWRlb1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5QdWJsaXNoT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMudmlkZW8gPSB2aWRlbztcbiAgfVxufVxuIiwiLypcbiAqICBDb3B5cmlnaHQgKGMpIDIwMTQgVGhlIFdlYlJUQyBwcm9qZWN0IGF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGEgQlNELXN0eWxlIGxpY2Vuc2VcbiAqICB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IG9mIHRoZSBzb3VyY2VcbiAqICB0cmVlLlxuICovXG5cbi8qIE1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlc2Ugb3B0aW9ucyBhdCBqc2hpbnQuY29tL2RvY3Mvb3B0aW9ucyAqL1xuXG4vKiBnbG9iYWxzICBhZGFwdGVyLCB0cmFjZSAqL1xuLyogZXhwb3J0ZWQgc2V0Q29kZWNQYXJhbSwgaWNlQ2FuZGlkYXRlVHlwZSwgZm9ybWF0VHlwZVByZWZlcmVuY2UsXG4gICBtYXliZVNldE9wdXNPcHRpb25zLCBtYXliZVByZWZlckF1ZGlvUmVjZWl2ZUNvZGVjLFxuICAgbWF5YmVQcmVmZXJBdWRpb1NlbmRDb2RlYywgbWF5YmVTZXRBdWRpb1JlY2VpdmVCaXRSYXRlLFxuICAgbWF5YmVTZXRBdWRpb1NlbmRCaXRSYXRlLCBtYXliZVByZWZlclZpZGVvUmVjZWl2ZUNvZGVjLFxuICAgbWF5YmVQcmVmZXJWaWRlb1NlbmRDb2RlYywgbWF5YmVTZXRWaWRlb1JlY2VpdmVCaXRSYXRlLFxuICAgbWF5YmVTZXRWaWRlb1NlbmRCaXRSYXRlLCBtYXliZVNldFZpZGVvU2VuZEluaXRpYWxCaXRSYXRlLFxuICAgbWF5YmVSZW1vdmVWaWRlb0ZlYywgbWVyZ2VDb25zdHJhaW50cywgcmVtb3ZlQ29kZWNQYXJhbSovXG5cbi8qIFRoaXMgZmlsZSBpcyBib3Jyb3dlZCBmcm9tIGFwcHJ0YyB3aXRoIHNvbWUgbW9kaWZpY2F0aW9ucy4gKi9cbi8qIENvbW1pdCBoYXNoOiBjNmFmMGMyNWU5YWY1MjdmNzFiM2FjZGQ2YmZhMTM4OWQ3NzhmN2JkICsgUFIgNTMwICovXG5cbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXIuanMnO1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG1lcmdlQ29uc3RyYWludHMoY29uczEsIGNvbnMyKSB7XG4gIGlmICghY29uczEgfHwgIWNvbnMyKSB7XG4gICAgcmV0dXJuIGNvbnMxIHx8IGNvbnMyO1xuICB9XG4gIHZhciBtZXJnZWQgPSBjb25zMTtcbiAgZm9yICh2YXIga2V5IGluIGNvbnMyKSB7XG4gICAgbWVyZ2VkW2tleV0gPSBjb25zMltrZXldO1xuICB9XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cbmZ1bmN0aW9uIGljZUNhbmRpZGF0ZVR5cGUoY2FuZGlkYXRlU3RyKSB7XG4gIHJldHVybiBjYW5kaWRhdGVTdHIuc3BsaXQoJyAnKVs3XTtcbn1cblxuLy8gVHVybnMgdGhlIGxvY2FsIHR5cGUgcHJlZmVyZW5jZSBpbnRvIGEgaHVtYW4tcmVhZGFibGUgc3RyaW5nLlxuLy8gTm90ZSB0aGF0IHRoaXMgbWFwcGluZyBpcyBicm93c2VyLXNwZWNpZmljLlxuZnVuY3Rpb24gZm9ybWF0VHlwZVByZWZlcmVuY2UocHJlZikge1xuICBpZiAoYWRhcHRlci5icm93c2VyRGV0YWlscy5icm93c2VyID09PSAnY2hyb21lJykge1xuICAgIHN3aXRjaCAocHJlZikge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gJ1RVUk4vVExTJztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuICdUVVJOL1RDUCc7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiAnVFVSTi9VRFAnO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9IGVsc2UgaWYgKGFkYXB0ZXIuYnJvd3NlckRldGFpbHMuYnJvd3NlciA9PT0gJ2ZpcmVmb3gnKSB7XG4gICAgc3dpdGNoIChwcmVmKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiAnVFVSTi9UQ1AnO1xuICAgICAgY2FzZSA1OlxuICAgICAgICByZXR1cm4gJ1RVUk4vVURQJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIG1heWJlU2V0T3B1c09wdGlvbnMoc2RwLCBwYXJhbXMpIHtcbiAgLy8gU2V0IE9wdXMgaW4gU3RlcmVvLCBpZiBzdGVyZW8gaXMgdHJ1ZSwgdW5zZXQgaXQsIGlmIHN0ZXJlbyBpcyBmYWxzZSwgYW5kXG4gIC8vIGRvIG5vdGhpbmcgaWYgb3RoZXJ3aXNlLlxuICBpZiAocGFyYW1zLm9wdXNTdGVyZW8gPT09ICd0cnVlJykge1xuICAgIHNkcCA9IHNldENvZGVjUGFyYW0oc2RwLCAnb3B1cy80ODAwMCcsICdzdGVyZW8nLCAnMScpO1xuICB9IGVsc2UgaWYgKHBhcmFtcy5vcHVzU3RlcmVvID09PSAnZmFsc2UnKSB7XG4gICAgc2RwID0gcmVtb3ZlQ29kZWNQYXJhbShzZHAsICdvcHVzLzQ4MDAwJywgJ3N0ZXJlbycpO1xuICB9XG5cbiAgLy8gU2V0IE9wdXMgRkVDLCBpZiBvcHVzZmVjIGlzIHRydWUsIHVuc2V0IGl0LCBpZiBvcHVzZmVjIGlzIGZhbHNlLCBhbmRcbiAgLy8gZG8gbm90aGluZyBpZiBvdGhlcndpc2UuXG4gIGlmIChwYXJhbXMub3B1c0ZlYyA9PT0gJ3RydWUnKSB7XG4gICAgc2RwID0gc2V0Q29kZWNQYXJhbShzZHAsICdvcHVzLzQ4MDAwJywgJ3VzZWluYmFuZGZlYycsICcxJyk7XG4gIH0gZWxzZSBpZiAocGFyYW1zLm9wdXNGZWMgPT09ICdmYWxzZScpIHtcbiAgICBzZHAgPSByZW1vdmVDb2RlY1BhcmFtKHNkcCwgJ29wdXMvNDgwMDAnLCAndXNlaW5iYW5kZmVjJyk7XG4gIH1cblxuICAvLyBTZXQgT3B1cyBEVFgsIGlmIG9wdXNkdHggaXMgdHJ1ZSwgdW5zZXQgaXQsIGlmIG9wdXNkdHggaXMgZmFsc2UsIGFuZFxuICAvLyBkbyBub3RoaW5nIGlmIG90aGVyd2lzZS5cbiAgaWYgKHBhcmFtcy5vcHVzRHR4ID09PSAndHJ1ZScpIHtcbiAgICBzZHAgPSBzZXRDb2RlY1BhcmFtKHNkcCwgJ29wdXMvNDgwMDAnLCAndXNlZHR4JywgJzEnKTtcbiAgfSBlbHNlIGlmIChwYXJhbXMub3B1c0R0eCA9PT0gJ2ZhbHNlJykge1xuICAgIHNkcCA9IHJlbW92ZUNvZGVjUGFyYW0oc2RwLCAnb3B1cy80ODAwMCcsICd1c2VkdHgnKTtcbiAgfVxuXG4gIC8vIFNldCBPcHVzIG1heHBsYXliYWNrcmF0ZSwgaWYgcmVxdWVzdGVkLlxuICBpZiAocGFyYW1zLm9wdXNNYXhQYnIpIHtcbiAgICBzZHAgPSBzZXRDb2RlY1BhcmFtKFxuICAgICAgICBzZHAsICdvcHVzLzQ4MDAwJywgJ21heHBsYXliYWNrcmF0ZScsIHBhcmFtcy5vcHVzTWF4UGJyKTtcbiAgfVxuICByZXR1cm4gc2RwO1xufVxuXG5mdW5jdGlvbiBtYXliZVNldEF1ZGlvU2VuZEJpdFJhdGUoc2RwLCBwYXJhbXMpIHtcbiAgaWYgKCFwYXJhbXMuYXVkaW9TZW5kQml0cmF0ZSkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgTG9nZ2VyLmRlYnVnKCdQcmVmZXIgYXVkaW8gc2VuZCBiaXRyYXRlOiAnICsgcGFyYW1zLmF1ZGlvU2VuZEJpdHJhdGUpO1xuICByZXR1cm4gcHJlZmVyQml0UmF0ZShzZHAsIHBhcmFtcy5hdWRpb1NlbmRCaXRyYXRlLCAnYXVkaW8nKTtcbn1cblxuZnVuY3Rpb24gbWF5YmVTZXRBdWRpb1JlY2VpdmVCaXRSYXRlKHNkcCwgcGFyYW1zKSB7XG4gIGlmICghcGFyYW1zLmF1ZGlvUmVjdkJpdHJhdGUpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIExvZ2dlci5kZWJ1ZygnUHJlZmVyIGF1ZGlvIHJlY2VpdmUgYml0cmF0ZTogJyArIHBhcmFtcy5hdWRpb1JlY3ZCaXRyYXRlKTtcbiAgcmV0dXJuIHByZWZlckJpdFJhdGUoc2RwLCBwYXJhbXMuYXVkaW9SZWN2Qml0cmF0ZSwgJ2F1ZGlvJyk7XG59XG5cbmZ1bmN0aW9uIG1heWJlU2V0VmlkZW9TZW5kQml0UmF0ZShzZHAsIHBhcmFtcykge1xuICBpZiAoIXBhcmFtcy52aWRlb1NlbmRCaXRyYXRlKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBMb2dnZXIuZGVidWcoJ1ByZWZlciB2aWRlbyBzZW5kIGJpdHJhdGU6ICcgKyBwYXJhbXMudmlkZW9TZW5kQml0cmF0ZSk7XG4gIHJldHVybiBwcmVmZXJCaXRSYXRlKHNkcCwgcGFyYW1zLnZpZGVvU2VuZEJpdHJhdGUsICd2aWRlbycpO1xufVxuXG5mdW5jdGlvbiBtYXliZVNldFZpZGVvUmVjZWl2ZUJpdFJhdGUoc2RwLCBwYXJhbXMpIHtcbiAgaWYgKCFwYXJhbXMudmlkZW9SZWN2Qml0cmF0ZSkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgTG9nZ2VyLmRlYnVnKCdQcmVmZXIgdmlkZW8gcmVjZWl2ZSBiaXRyYXRlOiAnICsgcGFyYW1zLnZpZGVvUmVjdkJpdHJhdGUpO1xuICByZXR1cm4gcHJlZmVyQml0UmF0ZShzZHAsIHBhcmFtcy52aWRlb1JlY3ZCaXRyYXRlLCAndmlkZW8nKTtcbn1cblxuLy8gQWRkIGEgYj1BUzpiaXRyYXRlIGxpbmUgdG8gdGhlIG09bWVkaWFUeXBlIHNlY3Rpb24uXG5mdW5jdGlvbiBwcmVmZXJCaXRSYXRlKHNkcCwgYml0cmF0ZSwgbWVkaWFUeXBlKSB7XG4gIHZhciBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG5cbiAgLy8gRmluZCBtIGxpbmUgZm9yIHRoZSBnaXZlbiBtZWRpYVR5cGUuXG4gIHZhciBtTGluZUluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdtPScsIG1lZGlhVHlwZSk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdGYWlsZWQgdG8gYWRkIGJhbmR3aWR0aCBsaW5lIHRvIHNkcCwgYXMgbm8gbS1saW5lIGZvdW5kJyk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIC8vIEZpbmQgbmV4dCBtLWxpbmUgaWYgYW55LlxuICB2YXIgbmV4dE1MaW5lSW5kZXggPSBmaW5kTGluZUluUmFuZ2Uoc2RwTGluZXMsIG1MaW5lSW5kZXggKyAxLCAtMSwgJ209Jyk7XG4gIGlmIChuZXh0TUxpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIG5leHRNTGluZUluZGV4ID0gc2RwTGluZXMubGVuZ3RoO1xuICB9XG5cbiAgLy8gRmluZCBjLWxpbmUgY29ycmVzcG9uZGluZyB0byB0aGUgbS1saW5lLlxuICB2YXIgY0xpbmVJbmRleCA9IGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgbUxpbmVJbmRleCArIDEsXG4gICAgICBuZXh0TUxpbmVJbmRleCwgJ2M9Jyk7XG4gIGlmIChjTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdGYWlsZWQgdG8gYWRkIGJhbmR3aWR0aCBsaW5lIHRvIHNkcCwgYXMgbm8gYy1saW5lIGZvdW5kJyk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIC8vIENoZWNrIGlmIGJhbmR3aWR0aCBsaW5lIGFscmVhZHkgZXhpc3RzIGJldHdlZW4gYy1saW5lIGFuZCBuZXh0IG0tbGluZS5cbiAgdmFyIGJMaW5lSW5kZXggPSBmaW5kTGluZUluUmFuZ2Uoc2RwTGluZXMsIGNMaW5lSW5kZXggKyAxLFxuICAgICAgbmV4dE1MaW5lSW5kZXgsICdiPUFTJyk7XG4gIGlmIChiTGluZUluZGV4KSB7XG4gICAgc2RwTGluZXMuc3BsaWNlKGJMaW5lSW5kZXgsIDEpO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBiIChiYW5kd2lkdGgpIHNkcCBsaW5lLlxuICB2YXIgYndMaW5lID0gJ2I9QVM6JyArIGJpdHJhdGU7XG4gIC8vIEFzIHBlciBSRkMgNDU2NiwgdGhlIGIgbGluZSBzaG91bGQgZm9sbG93IGFmdGVyIGMtbGluZS5cbiAgc2RwTGluZXMuc3BsaWNlKGNMaW5lSW5kZXggKyAxLCAwLCBid0xpbmUpO1xuICBzZHAgPSBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbiAgcmV0dXJuIHNkcDtcbn1cblxuLy8gQWRkIGFuIGE9Zm10cDogeC1nb29nbGUtbWluLWJpdHJhdGU9a2JwcyBsaW5lLCBpZiB2aWRlb1NlbmRJbml0aWFsQml0cmF0ZVxuLy8gaXMgc3BlY2lmaWVkLiBXZSdsbCBhbHNvIGFkZCBhIHgtZ29vZ2xlLW1pbi1iaXRyYXRlIHZhbHVlLCBzaW5jZSB0aGUgbWF4XG4vLyBtdXN0IGJlID49IHRoZSBtaW4uXG5mdW5jdGlvbiBtYXliZVNldFZpZGVvU2VuZEluaXRpYWxCaXRSYXRlKHNkcCwgcGFyYW1zKSB7XG4gIHZhciBpbml0aWFsQml0cmF0ZSA9IHBhcnNlSW50KHBhcmFtcy52aWRlb1NlbmRJbml0aWFsQml0cmF0ZSk7XG4gIGlmICghaW5pdGlhbEJpdHJhdGUpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgLy8gVmFsaWRhdGUgdGhlIGluaXRpYWwgYml0cmF0ZSB2YWx1ZS5cbiAgdmFyIG1heEJpdHJhdGUgPSBwYXJzZUludChpbml0aWFsQml0cmF0ZSk7XG4gIHZhciBiaXRyYXRlID0gcGFyc2VJbnQocGFyYW1zLnZpZGVvU2VuZEJpdHJhdGUpO1xuICBpZiAoYml0cmF0ZSkge1xuICAgIGlmIChpbml0aWFsQml0cmF0ZSA+IGJpdHJhdGUpIHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnQ2xhbXBpbmcgaW5pdGlhbCBiaXRyYXRlIHRvIG1heCBiaXRyYXRlIG9mICcgKyBiaXRyYXRlICsgJyBrYnBzLicpO1xuICAgICAgaW5pdGlhbEJpdHJhdGUgPSBiaXRyYXRlO1xuICAgICAgcGFyYW1zLnZpZGVvU2VuZEluaXRpYWxCaXRyYXRlID0gaW5pdGlhbEJpdHJhdGU7XG4gICAgfVxuICAgIG1heEJpdHJhdGUgPSBiaXRyYXRlO1xuICB9XG5cbiAgdmFyIHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcblxuICAvLyBTZWFyY2ggZm9yIG0gbGluZS5cbiAgdmFyIG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgJ3ZpZGVvJyk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdGYWlsZWQgdG8gZmluZCB2aWRlbyBtLWxpbmUnKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIC8vIEZpZ3VyZSBvdXQgdGhlIGZpcnN0IGNvZGVjIHBheWxvYWQgdHlwZSBvbiB0aGUgbT12aWRlbyBTRFAgbGluZS5cbiAgdmFyIHZpZGVvTUxpbmUgPSBzZHBMaW5lc1ttTGluZUluZGV4XTtcbiAgdmFyIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdtPXZpZGVvXFxcXHNcXFxcZCtcXFxcc1tBLVovXStcXFxccycpO1xuICB2YXIgc2VuZFBheWxvYWRUeXBlID0gdmlkZW9NTGluZS5zcGxpdChwYXR0ZXJuKVsxXS5zcGxpdCgnICcpWzBdO1xuICB2YXIgZm10cExpbmUgPSBzZHBMaW5lc1tmaW5kTGluZShzZHBMaW5lcywgJ2E9cnRwbWFwJywgc2VuZFBheWxvYWRUeXBlKV07XG4gIHZhciBjb2RlY05hbWUgPSBmbXRwTGluZS5zcGxpdCgnYT1ydHBtYXA6JyArXG4gICAgICBzZW5kUGF5bG9hZFR5cGUpWzFdLnNwbGl0KCcvJylbMF07XG5cbiAgLy8gVXNlIGNvZGVjIGZyb20gcGFyYW1zIGlmIHNwZWNpZmllZCB2aWEgVVJMIHBhcmFtLCBvdGhlcndpc2UgdXNlIGZyb20gU0RQLlxuICB2YXIgY29kZWMgPSBwYXJhbXMudmlkZW9TZW5kQ29kZWMgfHwgY29kZWNOYW1lO1xuICBzZHAgPSBzZXRDb2RlY1BhcmFtKHNkcCwgY29kZWMsICd4LWdvb2dsZS1taW4tYml0cmF0ZScsXG4gICAgICBwYXJhbXMudmlkZW9TZW5kSW5pdGlhbEJpdHJhdGUudG9TdHJpbmcoKSk7XG4gIHNkcCA9IHNldENvZGVjUGFyYW0oc2RwLCBjb2RlYywgJ3gtZ29vZ2xlLW1heC1iaXRyYXRlJyxcbiAgICAgIG1heEJpdHJhdGUudG9TdHJpbmcoKSk7XG5cbiAgcmV0dXJuIHNkcDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUGF5bG9hZFR5cGVGcm9tTWxpbmUobUxpbmUsIHBheWxvYWRUeXBlKSB7XG4gIG1MaW5lID0gbUxpbmUuc3BsaXQoJyAnKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtTGluZS5sZW5ndGg7ICsraSkge1xuICAgIGlmIChtTGluZVtpXSA9PT0gcGF5bG9hZFR5cGUudG9TdHJpbmcoKSkge1xuICAgICAgbUxpbmUuc3BsaWNlKGksIDEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbUxpbmUuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDb2RlY0J5TmFtZShzZHBMaW5lcywgY29kZWMpIHtcbiAgdmFyIGluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdhPXJ0cG1hcCcsIGNvZGVjKTtcbiAgaWYgKGluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcExpbmVzO1xuICB9XG4gIHZhciBwYXlsb2FkVHlwZSA9IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICBzZHBMaW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gIC8vIFNlYXJjaCBmb3IgdGhlIHZpZGVvIG09IGxpbmUgYW5kIHJlbW92ZSB0aGUgY29kZWMuXG4gIHZhciBtTGluZUluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdtPScsICd2aWRlbycpO1xuICBpZiAobUxpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHBMaW5lcztcbiAgfVxuICBzZHBMaW5lc1ttTGluZUluZGV4XSA9IHJlbW92ZVBheWxvYWRUeXBlRnJvbU1saW5lKHNkcExpbmVzW21MaW5lSW5kZXhdLFxuICAgICAgcGF5bG9hZFR5cGUpO1xuICByZXR1cm4gc2RwTGluZXM7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNvZGVjQnlQYXlsb2FkVHlwZShzZHBMaW5lcywgcGF5bG9hZFR5cGUpIHtcbiAgdmFyIGluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdhPXJ0cG1hcCcsIHBheWxvYWRUeXBlLnRvU3RyaW5nKCkpO1xuICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwTGluZXM7XG4gIH1cbiAgc2RwTGluZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAvLyBTZWFyY2ggZm9yIHRoZSB2aWRlbyBtPSBsaW5lIGFuZCByZW1vdmUgdGhlIGNvZGVjLlxuICB2YXIgbUxpbmVJbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnbT0nLCAndmlkZW8nKTtcbiAgaWYgKG1MaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwTGluZXM7XG4gIH1cbiAgc2RwTGluZXNbbUxpbmVJbmRleF0gPSByZW1vdmVQYXlsb2FkVHlwZUZyb21NbGluZShzZHBMaW5lc1ttTGluZUluZGV4XSxcbiAgICAgIHBheWxvYWRUeXBlKTtcbiAgcmV0dXJuIHNkcExpbmVzO1xufVxuXG5mdW5jdGlvbiBtYXliZVJlbW92ZVZpZGVvRmVjKHNkcCwgcGFyYW1zKSB7XG4gIGlmIChwYXJhbXMudmlkZW9GZWMgIT09ICdmYWxzZScpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgdmFyIHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcblxuICB2YXIgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9cnRwbWFwJywgJ3JlZCcpO1xuICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIHZhciByZWRQYXlsb2FkVHlwZSA9IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICBzZHBMaW5lcyA9IHJlbW92ZUNvZGVjQnlQYXlsb2FkVHlwZShzZHBMaW5lcywgcmVkUGF5bG9hZFR5cGUpO1xuXG4gIHNkcExpbmVzID0gcmVtb3ZlQ29kZWNCeU5hbWUoc2RwTGluZXMsICd1bHBmZWMnKTtcblxuICAvLyBSZW1vdmUgZm10cCBsaW5lcyBhc3NvY2lhdGVkIHdpdGggcmVkIGNvZGVjLlxuICBpbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1mbXRwJywgcmVkUGF5bG9hZFR5cGUudG9TdHJpbmcoKSk7XG4gIGlmIChpbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgdmFyIGZtdHBMaW5lID0gcGFyc2VGbXRwTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICB2YXIgcnR4UGF5bG9hZFR5cGUgPSBmbXRwTGluZS5wdDtcbiAgaWYgKHJ0eFBheWxvYWRUeXBlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBzZHBMaW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gIHNkcExpbmVzID0gcmVtb3ZlQ29kZWNCeVBheWxvYWRUeXBlKHNkcExpbmVzLCBydHhQYXlsb2FkVHlwZSk7XG4gIHJldHVybiBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbn1cblxuLy8gUHJvbW90ZXMgfGF1ZGlvU2VuZENvZGVjfCB0byBiZSB0aGUgZmlyc3QgaW4gdGhlIG09YXVkaW8gbGluZSwgaWYgc2V0LlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJBdWRpb1NlbmRDb2RlYyhzZHAsIHBhcmFtcykge1xuICByZXR1cm4gbWF5YmVQcmVmZXJDb2RlYyhzZHAsICdhdWRpbycsICdzZW5kJywgcGFyYW1zLmF1ZGlvU2VuZENvZGVjKTtcbn1cblxuLy8gUHJvbW90ZXMgfGF1ZGlvUmVjdkNvZGVjfCB0byBiZSB0aGUgZmlyc3QgaW4gdGhlIG09YXVkaW8gbGluZSwgaWYgc2V0LlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJBdWRpb1JlY2VpdmVDb2RlYyhzZHAsIHBhcmFtcykge1xuICByZXR1cm4gbWF5YmVQcmVmZXJDb2RlYyhzZHAsICdhdWRpbycsICdyZWNlaXZlJywgcGFyYW1zLmF1ZGlvUmVjdkNvZGVjKTtcbn1cblxuLy8gUHJvbW90ZXMgfHZpZGVvU2VuZENvZGVjfCB0byBiZSB0aGUgZmlyc3QgaW4gdGhlIG09YXVkaW8gbGluZSwgaWYgc2V0LlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJWaWRlb1NlbmRDb2RlYyhzZHAsIHBhcmFtcykge1xuICByZXR1cm4gbWF5YmVQcmVmZXJDb2RlYyhzZHAsICd2aWRlbycsICdzZW5kJywgcGFyYW1zLnZpZGVvU2VuZENvZGVjKTtcbn1cblxuLy8gUHJvbW90ZXMgfHZpZGVvUmVjdkNvZGVjfCB0byBiZSB0aGUgZmlyc3QgaW4gdGhlIG09YXVkaW8gbGluZSwgaWYgc2V0LlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJWaWRlb1JlY2VpdmVDb2RlYyhzZHAsIHBhcmFtcykge1xuICByZXR1cm4gbWF5YmVQcmVmZXJDb2RlYyhzZHAsICd2aWRlbycsICdyZWNlaXZlJywgcGFyYW1zLnZpZGVvUmVjdkNvZGVjKTtcbn1cblxuLy8gU2V0cyB8Y29kZWN8IGFzIHRoZSBkZWZhdWx0IHx0eXBlfCBjb2RlYyBpZiBpdCdzIHByZXNlbnQuXG4vLyBUaGUgZm9ybWF0IG9mIHxjb2RlY3wgaXMgJ05BTUUvUkFURScsIGUuZy4gJ29wdXMvNDgwMDAnLlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJDb2RlYyhzZHAsIHR5cGUsIGRpciwgY29kZWMpIHtcbiAgdmFyIHN0ciA9IHR5cGUgKyAnICcgKyBkaXIgKyAnIGNvZGVjJztcbiAgaWYgKCFjb2RlYykge1xuICAgIExvZ2dlci5kZWJ1ZygnTm8gcHJlZmVyZW5jZSBvbiAnICsgc3RyICsgJy4nKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgTG9nZ2VyLmRlYnVnKCdQcmVmZXIgJyArIHN0ciArICc6ICcgKyBjb2RlYyk7XG5cbiAgdmFyIHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcblxuICAvLyBTZWFyY2ggZm9yIG0gbGluZS5cbiAgdmFyIG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgdHlwZSk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIC8vIElmIHRoZSBjb2RlYyBpcyBhdmFpbGFibGUsIHNldCBpdCBhcyB0aGUgZGVmYXVsdCBpbiBtIGxpbmUuXG4gIHZhciBwYXlsb2FkID0gbnVsbDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZHBMaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbmRleCA9IGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgaSwgLTEsICdhPXJ0cG1hcCcsIGNvZGVjKTtcbiAgICBpZiAoaW5kZXggIT09IG51bGwpIHtcbiAgICAgIHBheWxvYWQgPSBnZXRDb2RlY1BheWxvYWRUeXBlRnJvbUxpbmUoc2RwTGluZXNbaW5kZXhdKTtcbiAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgIHNkcExpbmVzW21MaW5lSW5kZXhdID0gc2V0RGVmYXVsdENvZGVjKHNkcExpbmVzW21MaW5lSW5kZXhdLCBwYXlsb2FkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZHAgPSBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbiAgcmV0dXJuIHNkcDtcbn1cblxuLy8gU2V0IGZtdHAgcGFyYW0gdG8gc3BlY2lmaWMgY29kZWMgaW4gU0RQLiBJZiBwYXJhbSBkb2VzIG5vdCBleGlzdHMsIGFkZCBpdC5cbmZ1bmN0aW9uIHNldENvZGVjUGFyYW0oc2RwLCBjb2RlYywgcGFyYW0sIHZhbHVlKSB7XG4gIHZhciBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG4gIC8vIFNEUHMgc2VudCBmcm9tIE1DVSB1c2UgXFxuIGFzIGxpbmUgYnJlYWsuXG4gIGlmIChzZHBMaW5lcy5sZW5ndGggPD0gMSkge1xuICAgIHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXG4nKTtcbiAgfVxuXG4gIHZhciBmbXRwTGluZUluZGV4ID0gZmluZEZtdHBMaW5lKHNkcExpbmVzLCBjb2RlYyk7XG5cbiAgdmFyIGZtdHBPYmogPSB7fTtcbiAgaWYgKGZtdHBMaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICB2YXIgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9cnRwbWFwJywgY29kZWMpO1xuICAgIGlmIChpbmRleCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNkcDtcbiAgICB9XG4gICAgdmFyIHBheWxvYWQgPSBnZXRDb2RlY1BheWxvYWRUeXBlRnJvbUxpbmUoc2RwTGluZXNbaW5kZXhdKTtcbiAgICBmbXRwT2JqLnB0ID0gcGF5bG9hZC50b1N0cmluZygpO1xuICAgIGZtdHBPYmoucGFyYW1zID0ge307XG4gICAgZm10cE9iai5wYXJhbXNbcGFyYW1dID0gdmFsdWU7XG4gICAgc2RwTGluZXMuc3BsaWNlKGluZGV4ICsgMSwgMCwgd3JpdGVGbXRwTGluZShmbXRwT2JqKSk7XG4gIH0gZWxzZSB7XG4gICAgZm10cE9iaiA9IHBhcnNlRm10cExpbmUoc2RwTGluZXNbZm10cExpbmVJbmRleF0pO1xuICAgIGZtdHBPYmoucGFyYW1zW3BhcmFtXSA9IHZhbHVlO1xuICAgIHNkcExpbmVzW2ZtdHBMaW5lSW5kZXhdID0gd3JpdGVGbXRwTGluZShmbXRwT2JqKTtcbiAgfVxuXG4gIHNkcCA9IHNkcExpbmVzLmpvaW4oJ1xcclxcbicpO1xuICByZXR1cm4gc2RwO1xufVxuXG4vLyBSZW1vdmUgZm10cCBwYXJhbSBpZiBpdCBleGlzdHMuXG5mdW5jdGlvbiByZW1vdmVDb2RlY1BhcmFtKHNkcCwgY29kZWMsIHBhcmFtKSB7XG4gIHZhciBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG5cbiAgdmFyIGZtdHBMaW5lSW5kZXggPSBmaW5kRm10cExpbmUoc2RwTGluZXMsIGNvZGVjKTtcbiAgaWYgKGZtdHBMaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgdmFyIG1hcCA9IHBhcnNlRm10cExpbmUoc2RwTGluZXNbZm10cExpbmVJbmRleF0pO1xuICBkZWxldGUgbWFwLnBhcmFtc1twYXJhbV07XG5cbiAgdmFyIG5ld0xpbmUgPSB3cml0ZUZtdHBMaW5lKG1hcCk7XG4gIGlmIChuZXdMaW5lID09PSBudWxsKSB7XG4gICAgc2RwTGluZXMuc3BsaWNlKGZtdHBMaW5lSW5kZXgsIDEpO1xuICB9IGVsc2Uge1xuICAgIHNkcExpbmVzW2ZtdHBMaW5lSW5kZXhdID0gbmV3TGluZTtcbiAgfVxuXG4gIHNkcCA9IHNkcExpbmVzLmpvaW4oJ1xcclxcbicpO1xuICByZXR1cm4gc2RwO1xufVxuXG4vLyBTcGxpdCBhbiBmbXRwIGxpbmUgaW50byBhbiBvYmplY3QgaW5jbHVkaW5nICdwdCcgYW5kICdwYXJhbXMnLlxuZnVuY3Rpb24gcGFyc2VGbXRwTGluZShmbXRwTGluZSkge1xuICB2YXIgZm10cE9iaiA9IHt9O1xuICB2YXIgc3BhY2VQb3MgPSBmbXRwTGluZS5pbmRleE9mKCcgJyk7XG4gIHZhciBrZXlWYWx1ZXMgPSBmbXRwTGluZS5zdWJzdHJpbmcoc3BhY2VQb3MgKyAxKS5zcGxpdCgnOycpO1xuXG4gIHZhciBwYXR0ZXJuID0gbmV3IFJlZ0V4cCgnYT1mbXRwOihcXFxcZCspJyk7XG4gIHZhciByZXN1bHQgPSBmbXRwTGluZS5tYXRjaChwYXR0ZXJuKTtcbiAgaWYgKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID09PSAyKSB7XG4gICAgZm10cE9iai5wdCA9IHJlc3VsdFsxXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBwYXJhbXMgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlWYWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFpciA9IGtleVZhbHVlc1tpXS5zcGxpdCgnPScpO1xuICAgIGlmIChwYWlyLmxlbmd0aCA9PT0gMikge1xuICAgICAgcGFyYW1zW3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICB9XG4gIH1cbiAgZm10cE9iai5wYXJhbXMgPSBwYXJhbXM7XG5cbiAgcmV0dXJuIGZtdHBPYmo7XG59XG5cbi8vIEdlbmVyYXRlIGFuIGZtdHAgbGluZSBmcm9tIGFuIG9iamVjdCBpbmNsdWRpbmcgJ3B0JyBhbmQgJ3BhcmFtcycuXG5mdW5jdGlvbiB3cml0ZUZtdHBMaW5lKGZtdHBPYmopIHtcbiAgaWYgKCFmbXRwT2JqLmhhc093blByb3BlcnR5KCdwdCcpIHx8ICFmbXRwT2JqLmhhc093blByb3BlcnR5KCdwYXJhbXMnKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBwdCA9IGZtdHBPYmoucHQ7XG4gIHZhciBwYXJhbXMgPSBmbXRwT2JqLnBhcmFtcztcbiAgdmFyIGtleVZhbHVlcyA9IFtdO1xuICB2YXIgaSA9IDA7XG4gIGZvciAodmFyIGtleSBpbiBwYXJhbXMpIHtcbiAgICBrZXlWYWx1ZXNbaV0gPSBrZXkgKyAnPScgKyBwYXJhbXNba2V5XTtcbiAgICArK2k7XG4gIH1cbiAgaWYgKGkgPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gJ2E9Zm10cDonICsgcHQudG9TdHJpbmcoKSArICcgJyArIGtleVZhbHVlcy5qb2luKCc7Jyk7XG59XG5cbi8vIEZpbmQgZm10cCBhdHRyaWJ1dGUgZm9yIHxjb2RlY3wgaW4gfHNkcExpbmVzfC5cbmZ1bmN0aW9uIGZpbmRGbXRwTGluZShzZHBMaW5lcywgY29kZWMpIHtcbiAgLy8gRmluZCBwYXlsb2FkIG9mIGNvZGVjLlxuICB2YXIgcGF5bG9hZCA9IGdldENvZGVjUGF5bG9hZFR5cGUoc2RwTGluZXMsIGNvZGVjKTtcbiAgLy8gRmluZCB0aGUgcGF5bG9hZCBpbiBmbXRwIGxpbmUuXG4gIHJldHVybiBwYXlsb2FkID8gZmluZExpbmUoc2RwTGluZXMsICdhPWZtdHA6JyArIHBheWxvYWQudG9TdHJpbmcoKSkgOiBudWxsO1xufVxuXG4vLyBGaW5kIHRoZSBsaW5lIGluIHNkcExpbmVzIHRoYXQgc3RhcnRzIHdpdGggfHByZWZpeHwsIGFuZCwgaWYgc3BlY2lmaWVkLFxuLy8gY29udGFpbnMgfHN1YnN0cnwgKGNhc2UtaW5zZW5zaXRpdmUgc2VhcmNoKS5cbmZ1bmN0aW9uIGZpbmRMaW5lKHNkcExpbmVzLCBwcmVmaXgsIHN1YnN0cikge1xuICByZXR1cm4gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCAwLCAtMSwgcHJlZml4LCBzdWJzdHIpO1xufVxuXG4vLyBGaW5kIHRoZSBsaW5lIGluIHNkcExpbmVzW3N0YXJ0TGluZS4uLmVuZExpbmUgLSAxXSB0aGF0IHN0YXJ0cyB3aXRoIHxwcmVmaXh8XG4vLyBhbmQsIGlmIHNwZWNpZmllZCwgY29udGFpbnMgfHN1YnN0cnwgKGNhc2UtaW5zZW5zaXRpdmUgc2VhcmNoKS5cbmZ1bmN0aW9uIGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgc3RhcnRMaW5lLCBlbmRMaW5lLCBwcmVmaXgsIHN1YnN0cikge1xuICB2YXIgcmVhbEVuZExpbmUgPSBlbmRMaW5lICE9PSAtMSA/IGVuZExpbmUgOiBzZHBMaW5lcy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSBzdGFydExpbmU7IGkgPCByZWFsRW5kTGluZTsgKytpKSB7XG4gICAgaWYgKHNkcExpbmVzW2ldLmluZGV4T2YocHJlZml4KSA9PT0gMCkge1xuICAgICAgaWYgKCFzdWJzdHIgfHxcbiAgICAgICAgICBzZHBMaW5lc1tpXS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc3Vic3RyLnRvTG93ZXJDYXNlKCkpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIEdldHMgdGhlIGNvZGVjIHBheWxvYWQgdHlwZSBmcm9tIHNkcCBsaW5lcy5cbmZ1bmN0aW9uIGdldENvZGVjUGF5bG9hZFR5cGUoc2RwTGluZXMsIGNvZGVjKSB7XG4gIHZhciBpbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1ydHBtYXAnLCBjb2RlYyk7XG4gIHJldHVybiBpbmRleCA/IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pIDogbnVsbDtcbn1cblxuLy8gR2V0cyB0aGUgY29kZWMgcGF5bG9hZCB0eXBlIGZyb20gYW4gYT1ydHBtYXA6WCBsaW5lLlxuZnVuY3Rpb24gZ2V0Q29kZWNQYXlsb2FkVHlwZUZyb21MaW5lKHNkcExpbmUpIHtcbiAgdmFyIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdhPXJ0cG1hcDooXFxcXGQrKSBbYS16QS1aMC05LV0rXFxcXC9cXFxcZCsnKTtcbiAgdmFyIHJlc3VsdCA9IHNkcExpbmUubWF0Y2gocGF0dGVybik7XG4gIHJldHVybiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPT09IDIpID8gcmVzdWx0WzFdIDogbnVsbDtcbn1cblxuLy8gUmV0dXJucyBhIG5ldyBtPSBsaW5lIHdpdGggdGhlIHNwZWNpZmllZCBjb2RlYyBhcyB0aGUgZmlyc3Qgb25lLlxuZnVuY3Rpb24gc2V0RGVmYXVsdENvZGVjKG1MaW5lLCBwYXlsb2FkKSB7XG4gIHZhciBlbGVtZW50cyA9IG1MaW5lLnNwbGl0KCcgJyk7XG5cbiAgLy8gSnVzdCBjb3B5IHRoZSBmaXJzdCB0aHJlZSBwYXJhbWV0ZXJzOyBjb2RlYyBvcmRlciBzdGFydHMgb24gZm91cnRoLlxuICB2YXIgbmV3TGluZSA9IGVsZW1lbnRzLnNsaWNlKDAsIDMpO1xuXG4gIC8vIFB1dCB0YXJnZXQgcGF5bG9hZCBmaXJzdCBhbmQgY29weSBpbiB0aGUgcmVzdC5cbiAgbmV3TGluZS5wdXNoKHBheWxvYWQpO1xuICBmb3IgKHZhciBpID0gMzsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGVsZW1lbnRzW2ldICE9PSBwYXlsb2FkKSB7XG4gICAgICBuZXdMaW5lLnB1c2goZWxlbWVudHNbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3TGluZS5qb2luKCcgJyk7XG59XG5cbi8qIEJlbG93IGFyZSBuZXdseSBhZGRlZCBmdW5jdGlvbnMgKi9cblxuLy8gRm9sbG93aW5nIGNvZGVjcyB3aWxsIG5vdCBiZSByZW1vdmVkIGZyb20gU0RQIGV2ZW50IHRoZXkgYXJlIG5vdCBpbiB0aGVcbi8vIHVzZXItc3BlY2lmaWVkIGNvZGVjIGxpc3QuXG5jb25zdCBhdWRpb0NvZGVjV2hpdGVMaXN0ID0gWydDTicsICd0ZWxlcGhvbmUtZXZlbnQnXTtcbmNvbnN0IHZpZGVvQ29kZWNXaGl0ZUxpc3QgPSBbJ3JlZCcsICd1bHBmZWMnXTtcblxuLy8gUmV0dXJucyBhIG5ldyBtPSBsaW5lIHdpdGggdGhlIHNwZWNpZmllZCBjb2RlYyBvcmRlci5cbmZ1bmN0aW9uIHNldENvZGVjT3JkZXIobUxpbmUsIHBheWxvYWRzKSB7XG4gIHZhciBlbGVtZW50cyA9IG1MaW5lLnNwbGl0KCcgJyk7XG5cbiAgLy8gSnVzdCBjb3B5IHRoZSBmaXJzdCB0aHJlZSBwYXJhbWV0ZXJzOyBjb2RlYyBvcmRlciBzdGFydHMgb24gZm91cnRoLlxuICB2YXIgbmV3TGluZSA9IGVsZW1lbnRzLnNsaWNlKDAsIDMpO1xuXG4gIC8vIENvbmNhdCBwYXlsb2FkIHR5cGVzLlxuICBuZXdMaW5lID0gbmV3TGluZS5jb25jYXQocGF5bG9hZHMpO1xuXG4gIHJldHVybiBuZXdMaW5lLmpvaW4oJyAnKTtcbn1cblxuLy8gQXBwZW5kIFJUWCBwYXlsb2FkcyBmb3IgZXhpc3RpbmcgcGF5bG9hZHMuXG5mdW5jdGlvbiBhcHBlbmRSdHhQYXlsb2FkcyhzZHBMaW5lcywgcGF5bG9hZHMpIHtcbiAgZm9yIChjb25zdCBwYXlsb2FkIG9mIHBheWxvYWRzKSB7XG4gICAgY29uc3QgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9Zm10cCcsICdhcHQ9JyArIHBheWxvYWQpO1xuICAgIGlmIChpbmRleCAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgZm10cExpbmUgPSBwYXJzZUZtdHBMaW5lKHNkcExpbmVzW2luZGV4XSk7XG4gICAgICBwYXlsb2Fkcy5wdXNoKGZtdHBMaW5lLnB0KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBheWxvYWRzO1xufVxuXG4vLyBSZW1vdmUgYSBjb2RlYyB3aXRoIGFsbCBpdHMgYXNzb2NpYXRlZCBhIGxpbmVzLlxuZnVuY3Rpb24gcmVtb3ZlQ29kZWNGcmFtQUxpbmUoc2RwTGluZXMsIHBheWxvYWQpe1xuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cCgnYT0ocnRwbWFwfHJ0Y3AtZmJ8Zm10cCk6JytwYXlsb2FkKydcXFxccycpO1xuICBmb3IobGV0IGk9c2RwTGluZXMubGVuZ3RoLTE7aT4wO2ktLSl7XG4gICAgaWYoc2RwTGluZXNbaV0ubWF0Y2gocGF0dGVybikpe1xuICAgICAgc2RwTGluZXMuc3BsaWNlKGksIDEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc2RwTGluZXM7XG59XG5cbi8vIFJlb3JkZXIgY29kZWNzIGluIG0tbGluZSBhY2NvcmRpbmcgdGhlIG9yZGVyIG9mIHxjb2RlY3N8LiBSZW1vdmUgY29kZWNzIGZyb21cbi8vIG0tbGluZSBpZiBpdCBpcyBub3QgcHJlc2VudCBpbiB8Y29kZWNzfFxuLy8gVGhlIGZvcm1hdCBvZiB8Y29kZWN8IGlzICdOQU1FL1JBVEUnLCBlLmcuICdvcHVzLzQ4MDAwJy5cbmV4cG9ydCBmdW5jdGlvbiByZW9yZGVyQ29kZWNzKHNkcCwgdHlwZSwgY29kZWNzKXtcbiAgaWYgKCFjb2RlY3MgfHwgY29kZWNzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBjb2RlY3MgPSB0eXBlID09PSAnYXVkaW8nID8gY29kZWNzLmNvbmNhdChhdWRpb0NvZGVjV2hpdGVMaXN0KSA6IGNvZGVjcy5jb25jYXQoXG4gICAgdmlkZW9Db2RlY1doaXRlTGlzdCk7XG5cbiAgdmFyIHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcblxuICAvLyBTZWFyY2ggZm9yIG0gbGluZS5cbiAgdmFyIG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgdHlwZSk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIGxldCBvcmlnaW5QYXlsb2FkcyA9IHNkcExpbmVzW21MaW5lSW5kZXhdLnNwbGl0KCcgJyk7XG4gIG9yaWdpblBheWxvYWRzLnNwbGljZSgwLCAzKTtcblxuICAvLyBJZiB0aGUgY29kZWMgaXMgYXZhaWxhYmxlLCBzZXQgaXQgYXMgdGhlIGRlZmF1bHQgaW4gbSBsaW5lLlxuICB2YXIgcGF5bG9hZHMgPSBbXTtcbiAgZm9yIChjb25zdCBjb2RlYyBvZiBjb2RlY3MpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNkcExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaW5kZXggPSBmaW5kTGluZUluUmFuZ2Uoc2RwTGluZXMsIGksIC0xLCAnYT1ydHBtYXAnLCBjb2RlYyk7XG4gICAgICBpZiAoaW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgIHBheWxvYWRzLnB1c2gocGF5bG9hZCk7XG4gICAgICAgICAgaSA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHBheWxvYWRzID0gYXBwZW5kUnR4UGF5bG9hZHMoc2RwTGluZXMsIHBheWxvYWRzKTtcbiAgc2RwTGluZXNbbUxpbmVJbmRleF0gPSBzZXRDb2RlY09yZGVyKHNkcExpbmVzW21MaW5lSW5kZXhdLCBwYXlsb2Fkcyk7XG5cbiAgLy8gUmVtb3ZlIGEgbGluZXMuXG4gIGZvcihjb25zdCBwYXlsb2FkIG9mIG9yaWdpblBheWxvYWRzKXtcbiAgICBpZiAocGF5bG9hZHMuaW5kZXhPZihwYXlsb2FkKT09PS0xKSB7XG4gICAgICBzZHBMaW5lcyA9IHJlbW92ZUNvZGVjRnJhbUFMaW5lKHNkcExpbmVzLCBwYXlsb2FkKTtcbiAgICB9XG4gIH1cblxuICBzZHAgPSBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbiAgcmV0dXJuIHNkcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1heEJpdHJhdGUoc2RwLCBlbmNvZGluZ1BhcmFtZXRlcnNMaXN0KSB7XG4gIGZvciAoY29uc3QgZW5jb2RpbmdQYXJhbWV0ZXJzIG9mIGVuY29kaW5nUGFyYW1ldGVyc0xpc3QpIHtcbiAgICBpZiAoZW5jb2RpbmdQYXJhbWV0ZXJzLm1heEJpdHJhdGUpIHtcbiAgICAgIHNkcCA9IHNldENvZGVjUGFyYW0oXG4gICAgICAgICAgc2RwLCBlbmNvZGluZ1BhcmFtZXRlcnMuY29kZWMubmFtZSwgJ3gtZ29vZ2xlLW1heC1iaXRyYXRlJyxcbiAgICAgICAgICAoZW5jb2RpbmdQYXJhbWV0ZXJzLm1heEJpdHJhdGUpLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc2RwO1xufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyLmpzJ1xuaW1wb3J0IHtPbXNFdmVudH0gZnJvbSAnLi9ldmVudC5qcydcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnXG5pbXBvcnQgeyBFdmVudERpc3BhdGNoZXJ9IGZyb20gJy4vZXZlbnQuanMnO1xuXG5mdW5jdGlvbiBpc0FsbG93ZWRWYWx1ZShvYmosIGFsbG93ZWRWYWx1ZXMpIHtcbiAgcmV0dXJuIChhbGxvd2VkVmFsdWVzLnNvbWUoKGVsZSkgPT4ge1xuICAgIHJldHVybiBlbGUgPT09IG9iajtcbiAgfSkpO1xufVxuLyoqXG4gKiBAY2xhc3MgU3RyZWFtU291cmNlSW5mb1xuICogQG1lbWJlck9mIE9tcy5CYXNlXG4gKiBAY2xhc3NEZXNjIEluZm9ybWF0aW9uIG9mIGEgc3RyZWFtJ3Mgc291cmNlLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZGVzY3JpcHRpb24gQXVkaW8gc291cmNlIGluZm8gb3IgdmlkZW8gc291cmNlIGluZm8gY291bGQgYmUgdW5kZWZpbmVkIGlmIGEgc3RyZWFtIGRvZXMgbm90IGhhdmUgYXVkaW8vdmlkZW8gdHJhY2suXG4gKiBAcGFyYW0gez9zdHJpbmd9IGF1ZGlvU291cmNlSW5mbyBBdWRpbyBzb3VyY2UgaW5mby4gQWNjZXB0ZWQgdmFsdWVzIGFyZTogXCJtaWNcIiwgXCJzY3JlZW4tY2FzdFwiLCBcImZpbGVcIiwgXCJtaXhlZFwiIG9yIHVuZGVmaW5lZC5cbiAqIEBwYXJhbSB7P3N0cmluZ30gdmlkZW9Tb3VyY2VJbmZvIFZpZGVvIHNvdXJjZSBpbmZvLiBBY2NlcHRlZCB2YWx1ZXMgYXJlOiBcImNhbWVyYVwiLCBcInNjcmVlbi1jYXN0XCIsIFwiZmlsZVwiLCBcIm1peGVkXCIgb3IgdW5kZWZpbmVkLlxuICovXG5leHBvcnQgY2xhc3MgU3RyZWFtU291cmNlSW5mbyB7XG4gIGNvbnN0cnVjdG9yKGF1ZGlvU291cmNlSW5mbywgdmlkZW9Tb3VyY2VJbmZvKSB7XG4gICAgaWYgKCFpc0FsbG93ZWRWYWx1ZShhdWRpb1NvdXJjZUluZm8sIFt1bmRlZmluZWQsICdtaWMnLCAnc2NyZWVuLWNhc3QnLFxuICAgICAgICAnZmlsZScsICdtaXhlZCdcbiAgICAgIF0pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmNvcnJlY3QgdmFsdWUgZm9yIGF1ZGlvU291cmNlSW5mbycpO1xuICAgIH1cbiAgICBpZiAoIWlzQWxsb3dlZFZhbHVlKHZpZGVvU291cmNlSW5mbywgW3VuZGVmaW5lZCwgJ2NhbWVyYScsICdzY3JlZW4tY2FzdCcsXG4gICAgICAgICdmaWxlJywgJ2VuY29kZWQtZmlsZScsICdyYXctZmlsZScsICdtaXhlZCdcbiAgICAgIF0pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmNvcnJlY3QgdmFsdWUgZm9yIHZpZGVvU291cmNlSW5mbycpO1xuICAgIH1cbiAgICB0aGlzLmF1ZGlvID0gYXVkaW9Tb3VyY2VJbmZvO1xuICAgIHRoaXMudmlkZW8gPSB2aWRlb1NvdXJjZUluZm87XG4gIH1cbn1cbi8qKlxuICogQGNsYXNzIFN0cmVhbVxuICogQG1lbWJlck9mIE9tcy5CYXNlXG4gKiBAY2xhc3NEZXNjIEJhc2UgY2xhc3Mgb2Ygc3RyZWFtcy5cbiAqIEBleHRlbmRzIE9tcy5CYXNlLkV2ZW50RGlzcGF0Y2hlclxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgU3RyZWFtIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgY29uc3RydWN0b3Ioc3RyZWFtLCBzb3VyY2VJbmZvLCBhdHRyaWJ1dGVzKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoKHN0cmVhbSAmJiAhKHN0cmVhbSBpbnN0YW5jZW9mIE1lZGlhU3RyZWFtKSkgfHwgKHR5cGVvZiBzb3VyY2VJbmZvICE9PSAnb2JqZWN0JykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBzdHJlYW0gb3Igc291cmNlSW5mby4nKTtcbiAgICAgIH1cbiAgICBpZiAoc3RyZWFtICYmICgoc3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkubGVuZ3RoID4gMCAmJiAhc291cmNlSW5mby5hdWRpbykgfHxcbiAgICAgICAgc3RyZWFtLmdldFZpZGVvVHJhY2tzKCkubGVuZ3RoID4gMCAmJiAhc291cmNlSW5mby52aWRlbykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ01pc3NpbmcgYXVkaW8gc291cmNlIGluZm8gb3IgdmlkZW8gc291cmNlIGluZm8uJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9NZWRpYVN0cmVhbX0gbWVkaWFTdHJlYW1cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuU3RyZWFtXG4gICAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cudzMub3JnL1RSL21lZGlhY2FwdHVyZS1zdHJlYW1zLyNtZWRpYXN0cmVhbXxNZWRpYVN0cmVhbSBBUEkgb2YgTWVkaWEgQ2FwdHVyZSBhbmQgU3RyZWFtc30uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtZWRpYVN0cmVhbScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlOiBzdHJlYW1cbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtPbXMuQmFzZS5TdHJlYW1Tb3VyY2VJbmZvfSBzb3VyY2VcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuU3RyZWFtXG4gICAgICogQGRlc2MgU291cmNlIGluZm8gb2YgYSBzdHJlYW0uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzb3VyY2UnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNvdXJjZUluZm9cbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IGF0dHJpYnV0ZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuU3RyZWFtXG4gICAgICogQGRlc2MgQ3VzdG9tIGF0dHJpYnV0ZXMgb2YgYSBzdHJlYW0uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdhdHRyaWJ1dGVzJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNcbiAgICB9KTtcbiAgfTtcbn1cbi8qKlxuICogQGNsYXNzIExvY2FsU3RyZWFtXG4gKiBAY2xhc3NEZXNjIFN0cmVhbSBjYXB0dXJlZCBmcm9tIGN1cnJlbnQgZW5kcG9pbnQuXG4gKiBAbWVtYmVyT2YgT21zLkJhc2VcbiAqIEBleHRlbmRzIE9tcy5CYXNlLlN0cmVhbVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge01lZGlhU3RyZWFtfSBzdHJlYW0gVW5kZXJseWluZyBNZWRpYVN0cmVhbS5cbiAqIEBwYXJhbSB7T21zLkJhc2UuU3RyZWFtU291cmNlSW5mb30gc291cmNlSW5mbyBJbmZvcm1hdGlvbiBhYm91dCBzdHJlYW0ncyBzb3VyY2UuXG4gKiBAcGFyYW0ge29iamVjdH0gYXR0cmlidXRlcyBDdXN0b20gYXR0cmlidXRlcyBvZiB0aGUgc3RyZWFtLlxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxTdHJlYW0gZXh0ZW5kcyBTdHJlYW0ge1xuICBjb25zdHJ1Y3RvcihzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpIHtcbiAgICBpZighKHN0cmVhbSBpbnN0YW5jZW9mIE1lZGlhU3RyZWFtKSl7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHN0cmVhbS4nKTtcbiAgICB9XG4gICAgc3VwZXIoc3RyZWFtLCBzb3VyY2VJbmZvLCBhdHRyaWJ1dGVzKTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLkxvY2FsU3RyZWFtXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdpZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogVXRpbHMuY3JlYXRlVXVpZCgpXG4gICAgfSk7XG4gIH07XG59XG4vKipcbiAqIEBjbGFzcyBSZW1vdGVTdHJlYW1cbiAqIEBjbGFzc0Rlc2MgU3RyZWFtIHNlbnQgZnJvbSBhIHJlbW90ZSBlbmRwb2ludC5cbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgICAgfFxuICogfCAtLS0tLS0tLS0tLS0tLS0tfCAtLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgZW5kZWQgICAgICAgICAgIHwgRXZlbnQgICAgICAgICAgICB8IFN0cmVhbSBpcyBlbmRlZC4gICB8XG4gKiB8IHVwZGF0ZWQgICAgICAgICB8IEV2ZW50ICAgICAgICAgICAgfCBTdHJlYW0gaXMgdXBkYXRlZC4gfFxuICpcbiAqIEBtZW1iZXJPZiBPbXMuQmFzZVxuICogQGV4dGVuZHMgT21zLkJhc2UuU3RyZWFtXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBSZW1vdGVTdHJlYW0gZXh0ZW5kcyBTdHJlYW0ge1xuICBjb25zdHJ1Y3RvcihpZCwgb3JpZ2luLCBzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpIHtcbiAgICBzdXBlcihzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuUmVtb3RlU3RyZWFtXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdpZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogaWQgPyBpZCA6IFV0aWxzLmNyZWF0ZVV1aWQoKVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gb3JpZ2luXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5CYXNlLlJlbW90ZVN0cmVhbVxuICAgICAqIEBkZXNjIElEIG9mIHRoZSByZW1vdGUgZW5kcG9pbnQgd2hvIHB1Ymxpc2hlZCB0aGlzIHN0cmVhbS5cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ29yaWdpbicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogb3JpZ2luXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T21zLkJhc2UuUHVibGljYXRpb25TZXR0aW5nc30gc2V0dGluZ3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuUmVtb3RlU3RyZWFtXG4gICAgICogQGRlc2MgT3JpZ2luYWwgc2V0dGluZ3MgZm9yIHB1Ymxpc2hpbmcgdGhpcyBzdHJlYW0uIFRoaXMgcHJvcGVydHkgaXMgb25seSB2YWxpZCBpbiBjb25mZXJlbmNlIG1vZGUuXG4gICAgICovXG4gICAgdGhpcy5zZXR0aW5ncyA9IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtPbXMuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXN9IGNhcGFiaWxpdGllc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQmFzZS5SZW1vdGVTdHJlYW1cbiAgICAgKiBAZGVzYyBDYXBhYmlsaXRpZXMgcmVtb3RlIGVuZHBvaW50IHByb3ZpZGVzIGZvciBzdWJzY3JpcHRpb24uIFRoaXMgcHJvcGVydHkgaXMgb25seSB2YWxpZCBpbiBjb25mZXJlbmNlIG1vZGUuXG4gICAgICovXG4gICAgdGhpcy5jYXBhYmlsaXRpZXMgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgU3RyZWFtRXZlbnRcbiAqIEBjbGFzc0Rlc2MgRXZlbnQgZm9yIFN0cmVhbS5cbiAqIEBleHRlbmRzIE9tcy5CYXNlLk9tc0V2ZW50XG4gKiBAbWVtYmVyb2YgT21zLkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmVhbUV2ZW50IGV4dGVuZHMgT21zRXZlbnQge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T21zLkJhc2UuU3RyZWFtfSBzdHJlYW1cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkJhc2UuU3RyZWFtRXZlbnRcbiAgICAgKi9cbiAgICB0aGlzLnN0cmVhbSA9IGluaXQuc3RyZWFtO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cblwidXNlIHN0cmljdFwiO1xuY29uc3Qgc2RrVmVyc2lvbiA9ICc0LjEnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNGaXJlZm94KCkge1xuICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goXCJGaXJlZm94XCIpICE9PSBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2hyb21lKCkge1xuICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goJ0Nocm9tZScpICE9PSBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzU2FmYXJpKCkge1xuICByZXR1cm4gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNFZGdlKCkge1xuICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0VkZ2VcXC8oXFxkKykuKFxcZCspJC8pICE9PSBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVV1aWQoKSB7XG4gIHJldHVybiAneHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCxcbiAgICAgIHYgPSBjID09PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpO1xuICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbi8vIFJldHVybnMgc3lzdGVtIGluZm9ybWF0aW9uLlxuLy8gRm9ybWF0OiB7c2RrOnt2ZXJzaW9uOioqLCB0eXBlOioqfSwgcnVudGltZTp7dmVyc2lvbjoqKiwgbmFtZToqKn0sIG9zOnt2ZXJzaW9uOioqLCBuYW1lOioqfX07XG5leHBvcnQgZnVuY3Rpb24gc3lzSW5mbygpIHtcbiAgdmFyIGluZm8gPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgaW5mby5zZGsgPSB7XG4gICAgdmVyc2lvbjogc2RrVmVyc2lvbixcbiAgICB0eXBlOiAnSmF2YVNjcmlwdCdcbiAgfTtcbiAgLy8gUnVudGltZSBpbmZvLlxuICB2YXIgdXNlckFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgdmFyIGZpcmVmb3hSZWdleCA9IC9GaXJlZm94XFwvKFswLTlcXC5dKykvO1xuICB2YXIgY2hyb21lUmVnZXggPSAvQ2hyb21lXFwvKFswLTlcXC5dKykvO1xuICB2YXIgZWRnZVJlZ2V4ID0gL0VkZ2VcXC8oWzAtOVxcLl0rKS87XG4gIHZhciBzYWZhcmlWZXJzaW9uUmVnZXggPSAvVmVyc2lvblxcLyhbMC05XFwuXSspIFNhZmFyaS87XG4gIHZhciByZXN1bHQgPSBjaHJvbWVSZWdleC5leGVjKHVzZXJBZ2VudCk7XG4gIGlmIChyZXN1bHQpIHtcbiAgICBpbmZvLnJ1bnRpbWUgPSB7XG4gICAgICBuYW1lOiAnQ2hyb21lJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXVxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ID0gZmlyZWZveFJlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ucnVudGltZSA9IHtcbiAgICAgIG5hbWU6ICdGaXJlZm94JyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXVxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ID0gZWRnZVJlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ucnVudGltZSA9IHtcbiAgICAgIG5hbWU6ICdFZGdlJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoaXNTYWZhcmkoKSkge1xuICAgIHJlc3VsdCA9IHNhZmFyaVZlcnNpb25SZWdleC5leGVjKHVzZXJBZ2VudCk7XG4gICAgaW5mby5ydW50aW1lID0ge1xuICAgICAgbmFtZTogJ1NhZmFyaScsXG4gICAgfVxuICAgIGluZm8ucnVudGltZS52ZXJzaW9uID0gcmVzdWx0ID8gcmVzdWx0WzFdIDogJ1Vua25vd24nO1xuICB9IGVsc2Uge1xuICAgIGluZm8ucnVudGltZSA9IHtcbiAgICAgIG5hbWU6ICdVbmtub3duJyxcbiAgICAgIHZlcnNpb246ICdVbmtub3duJ1xuICAgIH07XG4gIH1cbiAgLy8gT1MgaW5mby5cbiAgdmFyIHdpbmRvd3NSZWdleCA9IC9XaW5kb3dzIE5UIChbMC05XFwuXSspLztcbiAgdmFyIG1hY1JlZ2V4ID0gL0ludGVsIE1hYyBPUyBYIChbMC05X1xcLl0rKS87XG4gIHZhciBpUGhvbmVSZWdleCA9IC9pUGhvbmUgT1MgKFswLTlfXFwuXSspLztcbiAgdmFyIGxpbnV4UmVnZXggPSAvWDExOyBMaW51eC87XG4gIHZhciBhbmRyb2lkUmVnZXggPSAvQW5kcm9pZCggKFswLTlcXC5dKykpPy87XG4gIHZhciBjaHJvbWl1bU9zUmVnZXggPSAvQ3JPUy87XG4gIGlmIChyZXN1bHQgPSB3aW5kb3dzUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdXaW5kb3dzIE5UJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXVxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ID0gbWFjUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdNYWMgT1MgWCcsXG4gICAgICB2ZXJzaW9uOiByZXN1bHRbMV0ucmVwbGFjZSgvXy9nLCAnLicpXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBpUGhvbmVSZWdleC5leGVjKHVzZXJBZ2VudCkpIHtcbiAgICBpbmZvLm9zID0ge1xuICAgICAgbmFtZTogJ2lQaG9uZSBPUycsXG4gICAgICB2ZXJzaW9uOiByZXN1bHRbMV0ucmVwbGFjZSgvXy9nLCAnLicpXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBsaW51eFJlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnTGludXgnLFxuICAgICAgdmVyc2lvbjogJ1Vua25vd24nXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBhbmRyb2lkUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdBbmRyb2lkJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXSB8fCAnVW5rbm93bidcbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCA9IGNocm9taXVtT3NSZWdleC5leGVjKHVzZXJBZ2VudCkpIHtcbiAgICBpbmZvLm9zID0ge1xuICAgICAgbmFtZTogJ0Nocm9tZSBPUycsXG4gICAgICB2ZXJzaW9uOiAnVW5rbm93bidcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnVW5rbm93bicsXG4gICAgICB2ZXJzaW9uOiAnVW5rbm93bidcbiAgICB9O1xuICB9XG4gIGluZm8uY2FwYWJpbGl0aWVzID0ge1xuICAgIGNvbnRpbnVhbEljZUdhdGhlcmluZzogZmFsc2UsXG4gICAgdW5pZmllZFBsYW46IGZhbHNlLFxuICAgIHN0cmVhbVJlbW92YWJsZTogaW5mby5ydW50aW1lLm5hbWUgIT09ICdGaXJlZm94J1xuICB9O1xuICByZXR1cm4gaW5mbztcbn07XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcyc7XG5pbXBvcnQgeyBFdmVudERpc3BhdGNoZXIsIE1lc3NhZ2VFdmVudCwgT21zRXZlbnQsIEVycm9yRXZlbnQsIE11dGVFdmVudCB9IGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnO1xuaW1wb3J0IHsgVHJhY2tLaW5kIH0gZnJvbSAnLi4vYmFzZS9tZWRpYWZvcm1hdC5qcydcbmltcG9ydCB7IFB1YmxpY2F0aW9uIH0gZnJvbSAnLi4vYmFzZS9wdWJsaWNhdGlvbi5qcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL3N1YnNjcmlwdGlvbi5qcydcbmltcG9ydCB7IENvbmZlcmVuY2VFcnJvciB9IGZyb20gJy4vZXJyb3IuanMnXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuLi9iYXNlL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIEVycm9yTW9kdWxlIGZyb20gJy4vZXJyb3IuanMnO1xuaW1wb3J0ICogYXMgU3RyZWFtTW9kdWxlIGZyb20gJy4uL2Jhc2Uvc3RyZWFtLmpzJztcbmltcG9ydCAqIGFzIFNkcFV0aWxzIGZyb20gJy4uL2Jhc2Uvc2RwdXRpbHMuanMnO1xuXG5leHBvcnQgY2xhc3MgQ29uZmVyZW5jZVBlZXJDb25uZWN0aW9uQ2hhbm5lbCBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgc2lnbmFsaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG51bGw7XG4gICAgdGhpcy5fc2lnbmFsaW5nID0gc2lnbmFsaW5nO1xuICAgIHRoaXMuX3BjID0gbnVsbDtcbiAgICB0aGlzLl9pbnRlcm5hbElkID0gbnVsbDsgIC8vIEl0J3MgcHVibGljYXRpb24gSUQgb3Igc3Vic2NyaXB0aW9uIElELlxuICAgIHRoaXMuX3BlbmRpbmdDYW5kaWRhdGVzID0gW107XG4gICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5fcHVibGlzaFByb21pc2UgPSBudWxsO1xuICAgIHRoaXMuX3N1YnNjcmliZWRTdHJlYW0gPSBudWxsO1xuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbSA9IG51bGw7XG4gICAgdGhpcy5fcHVibGljYXRpb24gPSBudWxsO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fZGlzY29ubmVjdFRpbWVyID0gbnVsbDsgIC8vIFRpbWVyIGZvciBQZWVyQ29ubmVjdGlvbiBkaXNjb25uZWN0ZWQuIFdpbGwgc3RvcCBjb25uZWN0aW9uIGFmdGVyIHRpbWVyLlxuICAgIHRoaXMuX2VuZGVkID0gZmFsc2U7XG4gIH1cblxuICBvbk1lc3NhZ2Uobm90aWZpY2F0aW9uLCBtZXNzYWdlKSB7XG4gICAgc3dpdGNoIChub3RpZmljYXRpb24pIHtcbiAgICAgIGNhc2UgJ3Byb2dyZXNzJzpcbiAgICAgICAgaWYgKG1lc3NhZ2Uuc3RhdHVzID09PSAnc29hYycpXG4gICAgICAgICAgdGhpcy5fc2RwSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBlbHNlIGlmIChtZXNzYWdlLnN0YXR1cyA9PT0gJ3JlYWR5JylcbiAgICAgICAgICB0aGlzLl9yZWFkeUhhbmRsZXIoKTtcbiAgICAgICAgZWxzZSBpZihtZXNzYWdlLnN0YXR1cyA9PT0gJ2Vycm9yJylcbiAgICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJlYW0nOlxuICAgICAgICB0aGlzLl9vblN0cmVhbUV2ZW50KG1lc3NhZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdVbmtub3duIG5vdGlmaWNhdGlvbiBmcm9tIE1DVS4nKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaXNoKHN0cmVhbSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMgPSB7IGF1ZGlvOiAhIXN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLCB2aWRlbzogISFzdHJlYW1cbiAgICAgICAgICAubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKSB9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignT3B0aW9ucyBzaG91bGQgYmUgYW4gb2JqZWN0LicpKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXVkaW8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0aW9ucy5hdWRpbyA9ICEhc3RyZWFtLm1lZGlhU3RyZWFtLmdldEF1ZGlvVHJhY2tzKCk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnZpZGVvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMudmlkZW8gPSAhIXN0cmVhbS5tZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpO1xuICAgIH1cbiAgICBpZiAoISFvcHRpb25zLmF1ZGlvID09PSAhc3RyZWFtLm1lZGlhU3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkubGVuZ3RoIHx8ICEhXG4gICAgICBvcHRpb25zLnZpZGVvID09PSAhc3RyZWFtLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgJ29wdGlvbnMuYXVkaW8vdmlkZW8gaXMgaW5jb25zaXN0ZW50IHdpdGggdHJhY2tzIHByZXNlbnRlZCBpbiB0aGUgTWVkaWFTdHJlYW0uJ1xuICAgICAgKSk7XG4gICAgfVxuICAgIGlmICgob3B0aW9ucy5hdWRpbyA9PT0gZmFsc2UgfHwgb3B0aW9ucy5hdWRpbyA9PT0gbnVsbCkgJiZcbiAgICAgIChvcHRpb25zLnZpZGVvID09PSBmYWxzZSB8fCBvcHRpb25zLnZpZGVvID09PSBudWxsKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICdDYW5ub3QgcHVibGlzaCBhIHN0cmVhbSB3aXRob3V0IGF1ZGlvIGFuZCB2aWRlby4nKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hdWRpbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLmF1ZGlvKSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnb3B0aW9ucy5hdWRpbyBzaG91bGQgYmUgYSBib29sZWFuIG9yIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcGFyYW1ldGVycyBvZiBvcHRpb25zLmF1ZGlvKSB7XG4gICAgICAgIGlmICghcGFyYW1ldGVycy5jb2RlYyB8fCB0eXBlb2YgcGFyYW1ldGVycy5jb2RlYy5uYW1lICE9PSAnc3RyaW5nJyB8fCAoXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLm1heEJpdHJhdGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcGFyYW1ldGVycy5tYXhCaXRyYXRlICE9PVxuICAgICAgICAgICAgJ251bWJlcicpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAnb3B0aW9ucy5hdWRpbyBoYXMgaW5jb3JyZWN0IHBhcmFtZXRlcnMuJykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy52aWRlbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLnZpZGVvKSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnb3B0aW9ucy52aWRlbyBzaG91bGQgYmUgYSBib29sZWFuIG9yIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcGFyYW1ldGVycyBvZiBvcHRpb25zLnZpZGVvKSB7XG4gICAgICAgIGlmICghcGFyYW1ldGVycy5jb2RlYyB8fCB0eXBlb2YgcGFyYW1ldGVycy5jb2RlYy5uYW1lICE9PSAnc3RyaW5nJyB8fCAoXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLm1heEJpdHJhdGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcGFyYW1ldGVycy5tYXhCaXRyYXRlICE9PVxuICAgICAgICAgICAgJ251bWJlcicpIHx8IChwYXJhbWV0ZXJzLmNvZGVjLnByb2ZpbGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcGFyYW1ldGVyc1xuICAgICAgICAgICAgLmNvZGVjLnByb2ZpbGUgIT09ICdzdHJpbmcnKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgJ29wdGlvbnMudmlkZW8gaGFzIGluY29ycmVjdCBwYXJhbWV0ZXJzLicpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICBjb25zdCBtZWRpYU9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLl9jcmVhdGVQZWVyQ29ubmVjdGlvbigpO1xuICAgIGlmIChzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKS5sZW5ndGggPiAwICYmIG9wdGlvbnMuYXVkaW8gIT09XG4gICAgICBmYWxzZSAmJiBvcHRpb25zLmF1ZGlvICE9PSBudWxsKSB7XG4gICAgICBpZiAoc3RyZWFtLm1lZGlhU3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkubGVuZ3RoID4gMSkge1xuICAgICAgICBMb2dnZXIud2FybmluZyhcbiAgICAgICAgICAnUHVibGlzaGluZyBhIHN0cmVhbSB3aXRoIG11bHRpcGxlIGF1ZGlvIHRyYWNrcyBpcyBub3QgZnVsbHkgc3VwcG9ydGVkLidcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hdWRpbyAhPT0gJ2Jvb2xlYW4nICYmIHR5cGVvZiBvcHRpb25zLmF1ZGlvICE9PVxuICAgICAgICAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgICAnVHlwZSBvZiBhdWRpbyBvcHRpb25zIHNob3VsZCBiZSBib29sZWFuIG9yIGFuIG9iamVjdC4nXG4gICAgICAgICkpO1xuICAgICAgfVxuICAgICAgbWVkaWFPcHRpb25zLmF1ZGlvID0ge307XG4gICAgICBtZWRpYU9wdGlvbnMuYXVkaW8uc291cmNlID0gc3RyZWFtLnNvdXJjZS5hdWRpbztcbiAgICAgIGZvcihjb25zdCB0cmFjayBvZiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKSl7XG4gICAgICAgIHRoaXMuX3BjLmFkZFRyYWNrKHRyYWNrLCBzdHJlYW0ubWVkaWFTdHJlYW0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtZWRpYU9wdGlvbnMuYXVkaW8gPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpLmxlbmd0aCA+IDAgJiYgb3B0aW9ucy52aWRlbyAhPT1cbiAgICAgIGZhbHNlICYmIG9wdGlvbnMudmlkZW8gIT09IG51bGwpIHtcbiAgICAgIGlmIChzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKS5sZW5ndGggPiAxKSB7XG4gICAgICAgIExvZ2dlci53YXJuaW5nKFxuICAgICAgICAgICdQdWJsaXNoaW5nIGEgc3RyZWFtIHdpdGggbXVsdGlwbGUgdmlkZW8gdHJhY2tzIGlzIG5vdCBmdWxseSBzdXBwb3J0ZWQuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvID0ge307XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8uc291cmNlID0gc3RyZWFtLnNvdXJjZS52aWRlbztcbiAgICAgIGNvbnN0IHRyYWNrU2V0dGluZ3MgPSBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXS5nZXRTZXR0aW5ncygpO1xuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgIHJlc29sdXRpb246IHtcbiAgICAgICAgICB3aWR0aDogdHJhY2tTZXR0aW5ncy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRyYWNrU2V0dGluZ3MuaGVpZ2h0XG4gICAgICAgIH0sXG4gICAgICAgIGZyYW1lcmF0ZTogdHJhY2tTZXR0aW5ncy5mcmFtZVJhdGVcbiAgICAgIH07XG4gICAgICBmb3IoY29uc3QgdHJhY2sgb2Ygc3RyZWFtLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkpe1xuICAgICAgICB0aGlzLl9wYy5hZGRUcmFjayh0cmFjaywgc3RyZWFtLm1lZGlhU3RyZWFtKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbSA9IHN0cmVhbTtcbiAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3B1Ymxpc2gnLCB7XG4gICAgICBtZWRpYTogbWVkaWFPcHRpb25zLFxuICAgICAgYXR0cmlidXRlczogc3RyZWFtLmF0dHJpYnV0ZXNcbiAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlRXZlbnQgPSBuZXcgTWVzc2FnZUV2ZW50KCdpZCcsIHtcbiAgICAgICAgbWVzc2FnZTogZGF0YS5pZCxcbiAgICAgICAgb3JpZ2luOiB0aGlzLl9yZW1vdGVJZFxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobWVzc2FnZUV2ZW50KTtcbiAgICAgIHRoaXMuX2ludGVybmFsSWQgPSBkYXRhLmlkO1xuICAgICAgY29uc3Qgb2ZmZXJPcHRpb25zID0ge1xuICAgICAgICBvZmZlclRvUmVjZWl2ZUF1ZGlvOiBmYWxzZSxcbiAgICAgICAgb2ZmZXJUb1JlY2VpdmVWaWRlbzogZmFsc2VcbiAgICAgIH07XG4gICAgICBpZiAodHlwZW9mIHRoaXMuX3BjLmFkZFRyYW5zY2VpdmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIHxkaXJlY3Rpb258IHNlZW1zIG5vdCB3b3JraW5nIG9uIFNhZmFyaS5cbiAgICAgICAgaWYgKG1lZGlhT3B0aW9ucy5hdWRpbyAmJiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKSA+IDApIHtcbiAgICAgICAgICBjb25zdCBhdWRpb1RyYW5zY2VpdmVyID0gdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ2F1ZGlvJywgeyBkaXJlY3Rpb246ICdzZW5kb25seScgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lZGlhT3B0aW9ucy52aWRlbyAmJiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKSA+IDApIHtcbiAgICAgICAgICBjb25zdCB2aWRlb1RyYW5zY2VpdmVyID0gdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ3ZpZGVvJywgeyBkaXJlY3Rpb246ICdzZW5kb25seScgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBsb2NhbERlc2M7XG4gICAgICB0aGlzLl9wYy5jcmVhdGVPZmZlcihvZmZlck9wdGlvbnMpLnRoZW4oZGVzYyA9PiB7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXNjO1xuICAgICAgfSkudGhlbihkZXNjID0+IHtcbiAgICAgICAgbG9jYWxEZXNjID0gZGVzYztcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BjLnNldExvY2FsRGVzY3JpcHRpb24oZGVzYyk7XG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCdzb2FjJywge1xuICAgICAgICAgIGlkOiB0aGlzXG4gICAgICAgICAgICAuX2ludGVybmFsSWQsXG4gICAgICAgICAgc2lnbmFsaW5nOiBsb2NhbERlc2NcbiAgICAgICAgfSk7XG4gICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgTG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIG9mZmVyIG9yIHNldCBTRFAuIE1lc3NhZ2U6ICcgKyBlLm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLl91bnB1Ymxpc2goKTtcbiAgICAgICAgdGhpcy5fcmVqZWN0UHJvbWlzZShlKTtcbiAgICAgICAgdGhpcy5fZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgdGhpcy5fdW5wdWJsaXNoKCk7XG4gICAgICB0aGlzLl9yZWplY3RQcm9taXNlKGUpO1xuICAgICAgdGhpcy5fZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fcHVibGlzaFByb21pc2UgPSB7IHJlc29sdmU6IHJlc29sdmUsIHJlamVjdDogcmVqZWN0IH07XG4gICAgfSk7XG4gIH1cblxuICBzdWJzY3JpYmUoc3RyZWFtLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgYXVkaW86ICEhc3RyZWFtLmNhcGFiaWxpdGllcy5hdWRpbyxcbiAgICAgICAgdmlkZW86ICEhc3RyZWFtLmNhcGFiaWxpdGllcy52aWRlb1xuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ09wdGlvbnMgc2hvdWxkIGJlIGFuIG9iamVjdC4nKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF1ZGlvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMuYXVkaW8gPSAhIXN0cmVhbS5jYXBhYmlsaXRpZXMuYXVkaW9cbiAgICB9XG4gICAgaWYgKG9wdGlvbnMudmlkZW8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0aW9ucy52aWRlbyA9ICEhc3RyZWFtLmNhcGFiaWxpdGllcy52aWRlb1xuICAgIH1cbiAgICBpZiAoKG9wdGlvbnMuYXVkaW8gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5hdWRpbyAhPT0gJ29iamVjdCcgJiZcbiAgICAgICAgdHlwZW9mIG9wdGlvbnMuYXVkaW8gIT09ICdib29sZWFuJyAmJiBvcHRpb25zLmF1ZGlvICE9PSBudWxsKSB8fCAoXG4gICAgICAgIG9wdGlvbnMudmlkZW8gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy52aWRlbyAhPT0gJ29iamVjdCcgJiZcbiAgICAgICAgdHlwZW9mIG9wdGlvbnMudmlkZW8gIT09ICdib29sZWFuJyAmJiBvcHRpb25zLnZpZGVvICE9PSBudWxsKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb3B0aW9ucyB0eXBlLicpKVxuICAgIH1cbiAgICBpZiAob3B0aW9ucy5hdWRpbyAmJiAhc3RyZWFtLmNhcGFiaWxpdGllcy5hdWRpbyB8fCAob3B0aW9ucy52aWRlbyAmJlxuICAgICAgICAhc3RyZWFtLmNhcGFiaWxpdGllcy52aWRlbykpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKFxuICAgICAgICAnb3B0aW9ucy5hdWRpby92aWRlbyBjYW5ub3QgYmUgdHJ1ZSBvciBhbiBvYmplY3QgaWYgdGhlcmUgaXMgbm8gYXVkaW8vdmlkZW8gdHJhY2sgaW4gcmVtb3RlIHN0cmVhbS4nXG4gICAgICApKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXVkaW8gPT09IGZhbHNlICYmIG9wdGlvbnMudmlkZW8gPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBzdWJzY3JpYmUgYSBzdHJlYW0gd2l0aG91dCBhdWRpbyBhbmQgdmlkZW8uJykpO1xuICAgIH1cbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICBjb25zdCBtZWRpYU9wdGlvbnMgPSB7fTtcbiAgICBpZiAob3B0aW9ucy5hdWRpbykge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmF1ZGlvID09PSAnb2JqZWN0JyAmJiBBcnJheS5pc0FycmF5KG9wdGlvbnMuYXVkaW8uY29kZWNzKSkge1xuICAgICAgICBpZiAob3B0aW9ucy5hdWRpby5jb2RlY3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAnQXVkaW8gY29kZWMgY2Fubm90IGJlIGFuIGVtcHR5IGFycmF5LicpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbWVkaWFPcHRpb25zLmF1ZGlvID0ge307XG4gICAgICBtZWRpYU9wdGlvbnMuYXVkaW8uZnJvbSA9IHN0cmVhbS5pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVkaWFPcHRpb25zLmF1ZGlvID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnZpZGVvKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMudmlkZW8gPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkob3B0aW9ucy52aWRlby5jb2RlY3MpKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnZpZGVvLmNvZGVjcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICdWaWRlbyBjb2RlYyBjYW5ub3QgYmUgYW4gZW1wdHkgYXJyYXkuJykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8gPSB7fTtcbiAgICAgIG1lZGlhT3B0aW9ucy52aWRlby5mcm9tID0gc3RyZWFtLmlkO1xuICAgICAgaWYgKG9wdGlvbnMudmlkZW8ucmVzb2x1dGlvbiB8fCBvcHRpb25zLnZpZGVvLmZyYW1lUmF0ZSB8fCAob3B0aW9ucy52aWRlb1xuICAgICAgICAgIC5iaXRyYXRlTXVsdGlwbGllciAmJiBvcHRpb25zLnZpZGVvLmJpdHJhdGVNdWx0aXBsaWVyICE9PSAxKSB8fFxuICAgICAgICBvcHRpb25zLnZpZGVvLmtleUZyYW1lSW50ZXJ2YWwpIHtcbiAgICAgICAgbWVkaWFPcHRpb25zLnZpZGVvLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgcmVzb2x1dGlvbjogb3B0aW9ucy52aWRlby5yZXNvbHV0aW9uLFxuICAgICAgICAgIGZyYW1lcmF0ZTogb3B0aW9ucy52aWRlby5mcmFtZVJhdGUsXG4gICAgICAgICAgYml0cmF0ZTogb3B0aW9ucy52aWRlby5iaXRyYXRlTXVsdGlwbGllciA/ICd4JyArIG9wdGlvbnMudmlkZW8uYml0cmF0ZU11bHRpcGxpZXJcbiAgICAgICAgICAgIC50b1N0cmluZygpIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGtleUZyYW1lSW50ZXJ2YWw6IG9wdGlvbnMudmlkZW8ua2V5RnJhbWVJbnRlcnZhbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lZGlhT3B0aW9ucy52aWRlbyA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLl9zdWJzY3JpYmVkU3RyZWFtID0gc3RyZWFtO1xuICAgIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgnc3Vic2NyaWJlJywge1xuICAgICAgbWVkaWE6IG1lZGlhT3B0aW9uc1xuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VFdmVudCA9IG5ldyBNZXNzYWdlRXZlbnQoJ2lkJywge1xuICAgICAgICBtZXNzYWdlOiBkYXRhLmlkLFxuICAgICAgICBvcmlnaW46IHRoaXMuX3JlbW90ZUlkXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChtZXNzYWdlRXZlbnQpO1xuICAgICAgdGhpcy5faW50ZXJuYWxJZCA9IGRhdGEuaWQ7XG4gICAgICB0aGlzLl9jcmVhdGVQZWVyQ29ubmVjdGlvbigpO1xuICAgICAgY29uc3Qgb2ZmZXJPcHRpb25zID0ge1xuICAgICAgICBvZmZlclRvUmVjZWl2ZUF1ZGlvOiAhIW9wdGlvbnMuYXVkaW8sXG4gICAgICAgIG9mZmVyVG9SZWNlaXZlVmlkZW86ICEhb3B0aW9ucy52aWRlb1xuICAgICAgfTtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gfGRpcmVjdGlvbnwgc2VlbXMgbm90IHdvcmtpbmcgb24gU2FmYXJpLlxuICAgICAgICBpZiAobWVkaWFPcHRpb25zLmF1ZGlvKSB7XG4gICAgICAgICAgY29uc3QgYXVkaW9UcmFuc2NlaXZlciA9IHRoaXMuX3BjLmFkZFRyYW5zY2VpdmVyKCdhdWRpbycsIHsgZGlyZWN0aW9uOiAncmVjdm9ubHknIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZWRpYU9wdGlvbnMudmlkZW8pIHtcbiAgICAgICAgICBjb25zdCB2aWRlb1RyYW5zY2VpdmVyID0gdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ3ZpZGVvJywgeyBkaXJlY3Rpb246ICdyZWN2b25seScgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX3BjLmNyZWF0ZU9mZmVyKG9mZmVyT3B0aW9ucykudGhlbihkZXNjID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICBkZXNjLnNkcCA9IHRoaXMuX3NldFJ0cFJlY2VpdmVyT3B0aW9ucyhkZXNjLnNkcCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGMuc2V0TG9jYWxEZXNjcmlwdGlvbihkZXNjKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3NvYWMnLCB7XG4gICAgICAgICAgICBpZDogdGhpc1xuICAgICAgICAgICAgICAuX2ludGVybmFsSWQsXG4gICAgICAgICAgICBzaWduYWxpbmc6IGRlc2NcbiAgICAgICAgICB9KVxuICAgICAgICB9LCBmdW5jdGlvbihlcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgICBMb2dnZXIuZXJyb3IoJ1NldCBsb2NhbCBkZXNjcmlwdGlvbiBmYWlsZWQuIE1lc3NhZ2U6ICcgK1xuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZXJyb3JNZXNzYWdlKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgTG9nZ2VyLmVycm9yKCdDcmVhdGUgb2ZmZXIgZmFpbGVkLiBFcnJvciBpbmZvOiAnICsgSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgZXJyb3IpKTtcbiAgICAgIH0pLmNhdGNoKGU9PntcbiAgICAgICAgTG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIG9mZmVyIG9yIHNldCBTRFAuIE1lc3NhZ2U6ICcgKyBlLm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLl9yZWplY3RQcm9taXNlKGUpO1xuICAgICAgICB0aGlzLl9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fcmVqZWN0UHJvbWlzZShlKTtcbiAgICAgIHRoaXMuX2ZpcmVFbmRlZEV2ZW50T25QdWJsaWNhdGlvbk9yU3Vic2NyaXB0aW9uKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVByb21pc2UgPSB7IHJlc29sdmU6IHJlc29sdmUsIHJlamVjdDogcmVqZWN0IH07XG4gICAgfSk7XG4gIH1cblxuICBfdW5wdWJsaXNoKCkge1xuICAgIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgndW5wdWJsaXNoJywgeyBpZDogdGhpcy5faW50ZXJuYWxJZCB9KVxuICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICBMb2dnZXIud2FybmluZygnTUNVIHJldHVybnMgbmVnYXRpdmUgYWNrIGZvciB1bnB1Ymxpc2hpbmcsICcgKyBlKTtcbiAgICAgIH0pO1xuICAgIGlmICh0aGlzLl9wYyAmJiB0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSAhPT0gJ2Nsb3NlZCcpIHtcbiAgICAgIHRoaXMuX3BjLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgndW5zdWJzY3JpYmUnLCB7XG4gICAgICAgIGlkOiB0aGlzLl9pbnRlcm5hbElkXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICBMb2dnZXIud2FybmluZygnTUNVIHJldHVybnMgbmVnYXRpdmUgYWNrIGZvciB1bnN1YnNjcmliaW5nLCAnICsgZSk7XG4gICAgICB9KTtcbiAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgIT09ICdjbG9zZWQnKSB7XG4gICAgICB0aGlzLl9wYy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIF9tdXRlT3JVbm11dGUoaXNNdXRlLCBpc1B1YiwgdHJhY2tLaW5kKSB7XG4gICAgY29uc3QgZXZlbnROYW1lID0gaXNQdWIgPyAnc3RyZWFtLWNvbnRyb2wnIDpcbiAgICAgICdzdWJzY3JpcHRpb24tY29udHJvbCc7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gaXNNdXRlID8gJ3BhdXNlJyA6ICdwbGF5JztcbiAgICByZXR1cm4gdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKGV2ZW50TmFtZSwge1xuICAgICAgaWQ6IHRoaXMuX2ludGVybmFsSWQsXG4gICAgICBvcGVyYXRpb246IG9wZXJhdGlvbixcbiAgICAgIGRhdGE6IHRyYWNrS2luZFxuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKCFpc1B1Yikge1xuICAgICAgICBjb25zdCBtdXRlRXZlbnROYW1lID0gaXNNdXRlID8gJ211dGUnIDogJ3VubXV0ZSc7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi5kaXNwYXRjaEV2ZW50KG5ldyBNdXRlRXZlbnQobXV0ZUV2ZW50TmFtZSwgeyBraW5kOiB0cmFja0tpbmQgfSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2FwcGx5T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb3B0aW9ucy52aWRlbyAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKFxuICAgICAgICAnT3B0aW9ucyBzaG91bGQgYmUgYW4gb2JqZWN0LicpKTtcbiAgICB9XG4gICAgY29uc3QgdmlkZW9PcHRpb25zID0ge307XG4gICAgdmlkZW9PcHRpb25zLnJlc29sdXRpb24gPSBvcHRpb25zLnZpZGVvLnJlc29sdXRpb247XG4gICAgdmlkZW9PcHRpb25zLmZyYW1lcmF0ZSA9IG9wdGlvbnMudmlkZW8uZnJhbWVSYXRlO1xuICAgIHZpZGVvT3B0aW9ucy5iaXRyYXRlID0gb3B0aW9ucy52aWRlby5iaXRyYXRlTXVsdGlwbGllciA/ICd4JyArIG9wdGlvbnMudmlkZW9cbiAgICAgIC5iaXRyYXRlTXVsdGlwbGllclxuICAgICAgLnRvU3RyaW5nKCkgOiB1bmRlZmluZWQ7XG4gICAgdmlkZW9PcHRpb25zLmtleUZyYW1lSW50ZXJ2YWwgPSBvcHRpb25zLnZpZGVvLmtleUZyYW1lSW50ZXJ2YWw7XG4gICAgcmV0dXJuIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgnc3Vic2NyaXB0aW9uLWNvbnRyb2wnLCB7XG4gICAgICBpZDogdGhpcy5faW50ZXJuYWxJZCxcbiAgICAgIG9wZXJhdGlvbjogJ3VwZGF0ZScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHZpZGVvOiB7IHBhcmFtZXRlcnM6IHZpZGVvT3B0aW9ucyB9XG4gICAgICB9XG4gICAgfSkudGhlbigpO1xuICB9XG5cbiAgX29uUmVtb3RlU3RyZWFtQWRkZWQoZXZlbnQpIHtcbiAgICBMb2dnZXIuZGVidWcoJ1JlbW90ZSBzdHJlYW0gYWRkZWQuJyk7XG4gICAgaWYgKHRoaXMuX3N1YnNjcmliZWRTdHJlYW0pIHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZWRTdHJlYW0ubWVkaWFTdHJlYW0gPSBldmVudC5zdHJlYW1zWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGlzIGlzIG5vdCBleHBlY3RlZCBwYXRoLiBIb3dldmVyLCB0aGlzIGlzIGdvaW5nIHRvIGhhcHBlbiBvbiBTYWZhcmlcbiAgICAgIC8vIGJlY2F1c2UgaXQgZG9lcyBub3Qgc3VwcG9ydCBzZXR0aW5nIGRpcmVjdGlvbiBvZiB0cmFuc2NlaXZlci5cbiAgICAgIExvZ2dlci53YXJuaW5nKCdSZWNlaXZlZCByZW1vdGUgc3RyZWFtIHdpdGhvdXQgc3Vic2NyaXB0aW9uLicpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkxvY2FsSWNlQ2FuZGlkYXRlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmNhbmRpZGF0ZSkge1xuICAgICAgaWYgKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlICE9PSAnc3RhYmxlJykge1xuICAgICAgICB0aGlzLl9wZW5kaW5nQ2FuZGlkYXRlcy5wdXNoKGV2ZW50LmNhbmRpZGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZW5kQ2FuZGlkYXRlKGV2ZW50LmNhbmRpZGF0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnRW1wdHkgY2FuZGlkYXRlLicpO1xuICAgIH1cbiAgfVxuXG4gIF9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpIHtcbiAgICBpZiAodGhpcy5fZW5kZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fZW5kZWQgPSB0cnVlO1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE9tc0V2ZW50KCdlbmRlZCcpXG4gICAgaWYgKHRoaXMuX3B1YmxpY2F0aW9uKSB7XG4gICAgICB0aGlzLl9wdWJsaWNhdGlvbi5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgIHRoaXMuX3B1YmxpY2F0aW9uLnN0b3AoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLnN0b3AoKTtcbiAgICB9XG4gIH1cblxuICBfcmVqZWN0UHJvbWlzZShlcnJvcikge1xuICAgIGlmICghZXJyb3IpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IENvbmZlcmVuY2VFcnJvcignQ29ubmVjdGlvbiBmYWlsZWQgb3IgY2xvc2VkLicpO1xuICAgIH1cbiAgICAvLyBSZWplY3RpbmcgY29ycmVzcG9uZGluZyBwcm9taXNlIGlmIHB1Ymxpc2hpbmcgYW5kIHN1YnNjcmliaW5nIGlzIG9uZ29pbmcuXG4gICAgaWYgKHRoaXMuX3B1Ymxpc2hQcm9taXNlKSB7XG4gICAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgdGhpcy5fcHVibGlzaFByb21pc2UgPSB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zdWJzY3JpYmVQcm9taXNlKSB7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVQcm9taXNlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIF9vbkljZUNvbm5lY3Rpb25TdGF0ZUNoYW5nZShldmVudCkge1xuICAgIGlmICghZXZlbnQgfHwgIWV2ZW50LmN1cnJlbnRUYXJnZXQpXG4gICAgICByZXR1cm47XG5cbiAgICBMb2dnZXIuZGVidWcoJ0lDRSBjb25uZWN0aW9uIHN0YXRlIGNoYW5nZWQgdG8gJyArIGV2ZW50LmN1cnJlbnRUYXJnZXQuaWNlQ29ubmVjdGlvblN0YXRlKTtcbiAgICBpZiAoZXZlbnQuY3VycmVudFRhcmdldC5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdjbG9zZWQnIHx8IGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICAgIC5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdmYWlsZWQnKSB7XG4gICAgICB0aGlzLl9yZWplY3RQcm9taXNlKG5ldyBDb25mZXJlbmNlRXJyb3IoJ0lDRSBjb25uZWN0aW9uIGZhaWxlZCBvciBjbG9zZWQuJykpO1xuICAgICAgLy8gRmlyZSBlbmRlZCBldmVudCBpZiBwdWJsaWNhdGlvbiBvciBzdWJzY3JpcHRpb24gZXhpc3RzLlxuICAgICAgdGhpcy5fZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICBfc2VuZENhbmRpZGF0ZShjYW5kaWRhdGUpIHtcbiAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3NvYWMnLCB7XG4gICAgICBpZDogdGhpcy5faW50ZXJuYWxJZCxcbiAgICAgIHNpZ25hbGluZzoge1xuICAgICAgICB0eXBlOiAnY2FuZGlkYXRlJyxcbiAgICAgICAgY2FuZGlkYXRlOiB7XG4gICAgICAgICAgY2FuZGlkYXRlOiAnYT0nICsgY2FuZGlkYXRlLmNhbmRpZGF0ZSxcbiAgICAgICAgICBzZHBNaWQ6IGNhbmRpZGF0ZS5zZHBNaWQsXG4gICAgICAgICAgc2RwTUxpbmVJbmRleDogY2FuZGlkYXRlLnNkcE1MaW5lSW5kZXhcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZVBlZXJDb25uZWN0aW9uKCkge1xuICAgIGNvbnN0IHBjQ29uZmlndXJhdGlvbiA9IHRoaXMuX2NvbmZpZy5ydGNDb25maWd1cmF0aW9uIHx8IHt9O1xuICAgIGlmIChVdGlscy5pc0Nocm9tZSgpKSB7XG4gICAgICBwY0NvbmZpZ3VyYXRpb24uc2RwU2VtYW50aWNzID0gJ3VuaWZpZWQtcGxhbic7XG4gICAgfVxuICAgIHRoaXMuX3BjID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKHBjQ29uZmlndXJhdGlvbik7XG4gICAgdGhpcy5fcGMub25pY2VjYW5kaWRhdGUgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uTG9jYWxJY2VDYW5kaWRhdGUuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbnRyYWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vblJlbW90ZVN0cmVhbUFkZGVkLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uSWNlQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gIH1cblxuICBfZ2V0U3RhdHMoKSB7XG4gICAgaWYgKHRoaXMuX3BjKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGMuZ2V0U3RhdHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICdQZWVyQ29ubmVjdGlvbiBpcyBub3QgYXZhaWxhYmxlLicpKTtcbiAgICB9XG4gIH1cblxuICBfcmVhZHlIYW5kbGVyKCkge1xuICAgIGlmICh0aGlzLl9zdWJzY3JpYmVQcm9taXNlKSB7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKHRoaXMuX2ludGVybmFsSWQsICgpID0+IHtcbiAgICAgICAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgICAgICB9LCAoKSA9PiB0aGlzLl9nZXRTdGF0cygpLFxuICAgICAgICB0cmFja0tpbmQgPT4gdGhpcy5fbXV0ZU9yVW5tdXRlKHRydWUsIGZhbHNlLCB0cmFja0tpbmQpLFxuICAgICAgICB0cmFja0tpbmQgPT4gdGhpcy5fbXV0ZU9yVW5tdXRlKGZhbHNlLCBmYWxzZSwgdHJhY2tLaW5kKSxcbiAgICAgICAgb3B0aW9ucyA9PiB0aGlzLl9hcHBseU9wdGlvbnMob3B0aW9ucykpO1xuICAgICAgLy8gRmlyZSBzdWJzY3JpcHRpb24ncyBlbmRlZCBldmVudCB3aGVuIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVuZGVkLlxuICAgICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbS5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLmRpc3BhdGNoRXZlbnQoJ2VuZGVkJywgbmV3IE9tc0V2ZW50KCdlbmRlZCcpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZS5yZXNvbHZlKHRoaXMuX3N1YnNjcmlwdGlvbik7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wdWJsaXNoUHJvbWlzZSkge1xuICAgICAgdGhpcy5fcHVibGljYXRpb24gPSBuZXcgUHVibGljYXRpb24odGhpcy5faW50ZXJuYWxJZCwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3VucHVibGlzaCgpO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfSwgKCkgPT4gdGhpcy5fZ2V0U3RhdHMoKSxcbiAgICAgICAgdHJhY2tLaW5kID0+IHRoaXMuX211dGVPclVubXV0ZSh0cnVlLCB0cnVlLCB0cmFja0tpbmQpLFxuICAgICAgICB0cmFja0tpbmQgPT4gdGhpcy5fbXV0ZU9yVW5tdXRlKGZhbHNlLCB0cnVlLCB0cmFja0tpbmQpKTtcbiAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlLnJlc29sdmUodGhpcy5fcHVibGljYXRpb24pO1xuICAgICAgLy8gRG8gbm90IGZpcmUgcHVibGljYXRpb24ncyBlbmRlZCBldmVudCB3aGVuIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVuZGVkLlxuICAgICAgLy8gSXQgbWF5IHN0aWxsIHNlbmRpbmcgc2lsZW5jZSBvciBibGFjayBmcmFtZXMuXG4gICAgICAvLyBSZWZlciB0byBodHRwczovL3czYy5naXRodWIuaW8vd2VicnRjLXBjLyNydGNydHBzZW5kZXItaW50ZXJmYWNlLlxuICAgIH1cbiAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZSA9IG51bGw7XG4gIH1cblxuICBfc2RwSGFuZGxlcihzZHApIHtcbiAgICBpZiAoc2RwLnR5cGUgPT09ICdhbnN3ZXInKSB7XG4gICAgICBpZiAoKHRoaXMuX3B1YmxpY2F0aW9uIHx8IHRoaXMuX3B1Ymxpc2hQcm9taXNlKSAmJiB0aGlzLl9vcHRpb25zKSB7XG4gICAgICAgIHNkcC5zZHAgPSB0aGlzLl9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcC5zZHAsIHRoaXMuX29wdGlvbnMpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcGMuc2V0UmVtb3RlRGVzY3JpcHRpb24oc2RwKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3BlbmRpbmdDYW5kaWRhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiB0aGlzLl9wZW5kaW5nQ2FuZGlkYXRlcykge1xuICAgICAgICAgICAgdGhpcy5fc2VuZENhbmRpZGF0ZShjYW5kaWRhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIExvZ2dlci5lcnJvcignU2V0IHJlbW90ZSBkZXNjcmlwdGlvbiBmYWlsZWQ6ICcgKyBlcnJvcik7XG4gICAgICAgIHRoaXMuX3JlamVjdFByb21pc2UoZXJyb3IpO1xuICAgICAgICB0aGlzLl9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2Vycm9ySGFuZGxlcihlcnJvck1lc3NhZ2UpIHtcbiAgICBjb25zdCBwID0gdGhpcy5fcHVibGlzaFByb21pc2UgfHwgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZTtcbiAgICBpZiAocCkge1xuICAgICAgcC5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihlcnJvck1lc3NhZ2UpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGlzcGF0Y2hlciA9IHRoaXMuX3B1YmxpY2F0aW9uIHx8IHRoaXMuX3N1YnNjcmlwdGlvbjtcbiAgICBpZiAoIWRpc3BhdGNoZXIpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdOZWl0aGVyIHB1YmxpY2F0aW9uIG5vciBzdWJzY3JpcHRpb24gaXMgYXZhaWxhYmxlLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlcnJvciA9IG5ldyBDb25mZXJlbmNlRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICBjb25zdCBlcnJvckV2ZW50ID0gbmV3IEVycm9yRXZlbnQoJ2Vycm9yJywge1xuICAgICAgZXJyb3I6IGVycm9yXG4gICAgfSk7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGVycm9yRXZlbnQpO1xuICB9XG5cbiAgX3NldENvZGVjT3JkZXIoc2RwLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuX3B1YmxpY2F0aW9uIHx8IHRoaXMuX3B1Ymxpc2hQcm9taXNlKSB7XG4gICAgICBpZiAob3B0aW9ucy5hdWRpbykge1xuICAgICAgICBjb25zdCBhdWRpb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKG9wdGlvbnMuYXVkaW8sXG4gICAgICAgICAgZW5jb2RpbmdQYXJhbWV0ZXJzID0+IGVuY29kaW5nUGFyYW1ldGVycy5jb2RlYy5uYW1lKTtcbiAgICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICdhdWRpbycsIGF1ZGlvQ29kZWNOYW1lcyk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy52aWRlbykge1xuICAgICAgICBjb25zdCB2aWRlb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKG9wdGlvbnMudmlkZW8sXG4gICAgICAgICAgZW5jb2RpbmdQYXJhbWV0ZXJzID0+IGVuY29kaW5nUGFyYW1ldGVycy5jb2RlYy5uYW1lKTtcbiAgICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICd2aWRlbycsIHZpZGVvQ29kZWNOYW1lcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvcHRpb25zLmF1ZGlvICYmIG9wdGlvbnMuYXVkaW8uY29kZWNzKSB7XG4gICAgICAgIGNvbnN0IGF1ZGlvQ29kZWNOYW1lcyA9IEFycmF5LmZyb20ob3B0aW9ucy5hdWRpby5jb2RlY3MsIGNvZGVjID0+XG4gICAgICAgICAgY29kZWMubmFtZSk7XG4gICAgICAgIHNkcCA9IFNkcFV0aWxzLnJlb3JkZXJDb2RlY3Moc2RwLCAnYXVkaW8nLCBhdWRpb0NvZGVjTmFtZXMpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMudmlkZW8gJiYgb3B0aW9ucy52aWRlby5jb2RlY3MpIHtcbiAgICAgICAgY29uc3QgdmlkZW9Db2RlY05hbWVzID0gQXJyYXkuZnJvbShvcHRpb25zLnZpZGVvLmNvZGVjcywgY29kZWMgPT5cbiAgICAgICAgICBjb2RlYy5uYW1lKTtcbiAgICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICd2aWRlbycsIHZpZGVvQ29kZWNOYW1lcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBfc2V0TWF4Qml0cmF0ZShzZHAsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXVkaW8gPT09ICdvYmplY3QnKSB7XG4gICAgICBzZHAgPSBTZHBVdGlscy5zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucy5hdWRpbyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy52aWRlbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNkcCA9IFNkcFV0aWxzLnNldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zLnZpZGVvKTtcbiAgICB9XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcCwgb3B0aW9ucykge1xuICAgIHNkcCA9IHRoaXMuX3NldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgX3NldFJ0cFJlY2VpdmVyT3B0aW9ucyhzZHAsIG9wdGlvbnMpIHtcbiAgICBzZHAgPSB0aGlzLl9zZXRDb2RlY09yZGVyKHNkcCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIC8vIEhhbmRsZSBzdHJlYW0gZXZlbnQgc2VudCBmcm9tIE1DVS4gU29tZSBzdHJlYW0gZXZlbnRzIHNob3VsZCBiZSBwdWJsaWNhdGlvbiBldmVudCBvciBzdWJzY3JpcHRpb24gZXZlbnQuIEl0IHdpbGwgYmUgaGFuZGxlZCBoZXJlLlxuICBfb25TdHJlYW1FdmVudChtZXNzYWdlKSB7XG4gICAgbGV0IGV2ZW50VGFyZ2V0O1xuICAgIGlmICh0aGlzLl9wdWJsaWNhdGlvbiAmJiBtZXNzYWdlLmlkID09PSB0aGlzLl9wdWJsaWNhdGlvbi5pZCkge1xuICAgICAgZXZlbnRUYXJnZXQgPSB0aGlzLl9wdWJsaWNhdGlvbjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbSAmJiBtZXNzYWdlLmlkID09PSB0aGlzLl9zdWJzY3JpYmVkU3RyZWFtLmlkKSB7XG4gICAgICBldmVudFRhcmdldCA9IHRoaXMuX3N1YnNjcmlwdGlvbjtcbiAgICB9XG4gICAgaWYgKCFldmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgdHJhY2tLaW5kO1xuICAgIGlmIChtZXNzYWdlLmRhdGEuZmllbGQgPT09ICdhdWRpby5zdGF0dXMnKSB7XG4gICAgICB0cmFja0tpbmQgPSBUcmFja0tpbmQuQVVESU87XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmRhdGEuZmllbGQgPT09ICd2aWRlby5zdGF0dXMnKSB7XG4gICAgICB0cmFja0tpbmQgPSBUcmFja0tpbmQuVklERU87XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdJbnZhbGlkIGRhdGEgZmllbGQgZm9yIHN0cmVhbSB1cGRhdGUgaW5mby4nKTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UuZGF0YS52YWx1ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgIGV2ZW50VGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IE11dGVFdmVudCgndW5tdXRlJywgeyBraW5kOiB0cmFja0tpbmQgfSkpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5kYXRhLnZhbHVlID09PSAnaW5hY3RpdmUnKSB7XG4gICAgICBldmVudFRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBNdXRlRXZlbnQoJ211dGUnLCB7IGtpbmQ6IHRyYWNrS2luZCB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdJbnZhbGlkIGRhdGEgdmFsdWUgZm9yIHN0cmVhbSB1cGRhdGUgaW5mby4nKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgKiBhcyBFdmVudE1vZHVsZSBmcm9tICcuLi9iYXNlL2V2ZW50LmpzJ1xuaW1wb3J0IHsgU2lvU2lnbmFsaW5nIGFzIFNpZ25hbGluZyB9IGZyb20gJy4vc2lnbmFsaW5nLmpzJ1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcydcbmltcG9ydCB7IEJhc2U2NCB9IGZyb20gJy4uL2Jhc2UvYmFzZTY0LmpzJ1xuaW1wb3J0IHsgQ29uZmVyZW5jZUVycm9yIH0gZnJvbSAnLi9lcnJvci5qcydcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL2Jhc2UvdXRpbHMuanMnXG5pbXBvcnQgKiBhcyBTdHJlYW1Nb2R1bGUgZnJvbSAnLi4vYmFzZS9zdHJlYW0uanMnXG5pbXBvcnQgeyBQYXJ0aWNpcGFudCB9IGZyb20gJy4vcGFydGljaXBhbnQuanMnXG5pbXBvcnQgeyBDb25mZXJlbmNlSW5mbyB9IGZyb20gJy4vaW5mby5qcydcbmltcG9ydCB7IENvbmZlcmVuY2VQZWVyQ29ubmVjdGlvbkNoYW5uZWwgfSBmcm9tICcuL2NoYW5uZWwuanMnXG5pbXBvcnQgeyBSZW1vdGVNaXhlZFN0cmVhbSwgQWN0aXZlQXVkaW9JbnB1dENoYW5nZUV2ZW50LCBMYXlvdXRDaGFuZ2VFdmVudCB9IGZyb20gJy4vbWl4ZWRzdHJlYW0uanMnXG5pbXBvcnQgKiBhcyBTdHJlYW1VdGlsc01vZHVsZSBmcm9tICcuL3N0cmVhbXV0aWxzLmpzJ1xuXG5jb25zdCBTaWduYWxpbmdTdGF0ZSA9IHtcbiAgUkVBRFk6IDEsXG4gIENPTk5FQ1RJTkc6IDIsXG4gIENPTk5FQ1RFRDogM1xufTtcblxuY29uc3QgcHJvdG9jb2xWZXJzaW9uID0gJzEuMCc7XG5cbi8qKlxuICogQGNsYXNzIFBhcnRpY2lwYW50RXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgUGFydGljaXBhbnRFdmVudCByZXByZXNlbnRzIGEgcGFydGljaXBhbnQgZXZlbnQuXG4gICBAZXh0ZW5kcyBPbXMuQmFzZS5PbXNFdmVudFxuICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNvbnN0IFBhcnRpY2lwYW50RXZlbnQgPSBmdW5jdGlvbih0eXBlLCBpbml0KSB7XG4gIGNvbnN0IHRoYXQgPSBuZXcgRXZlbnRNb2R1bGUuT21zRXZlbnQodHlwZSwgaW5pdCk7XG4gIC8qKlxuICAgKiBAbWVtYmVyIHtPbXMuQ29uZmVyZW5jZS5QYXJ0aWNpcGFudH0gcGFydGljaXBhbnRcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZS5QYXJ0aWNpcGFudEV2ZW50XG4gICAqL1xuICB0aGF0LnBhcnRpY2lwYW50ID0gaW5pdC5wYXJ0aWNpcGFudDtcbiAgcmV0dXJuIHRoYXQ7XG59O1xuXG4vKipcbiAqIEBjbGFzcyBDb25mZXJlbmNlQ2xpZW50Q29uZmlndXJhdGlvblxuICogQGNsYXNzRGVzYyBDb25maWd1cmF0aW9uIGZvciBDb25mZXJlbmNlQ2xpZW50LlxuICogQG1lbWJlck9mIE9tcy5Db25mZXJlbmNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIENvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P1JUQ0NvbmZpZ3VyYXRpb259IHJ0Y0NvbmZpZ3VyYXRpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuQ29uZmVyZW5jZUNsaWVudENvbmZpZ3VyYXRpb25cbiAgICAgKiBAZGVzYyBJdCB3aWxsIGJlIHVzZWQgZm9yIGNyZWF0aW5nIFBlZXJDb25uZWN0aW9uLlxuICAgICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93ZWJydGMvI3J0Y2NvbmZpZ3VyYXRpb24tZGljdGlvbmFyeXxSVENDb25maWd1cmF0aW9uIERpY3Rpb25hcnkgb2YgV2ViUlRDIDEuMH0uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBGb2xsb3dpbmcgb2JqZWN0IGNhbiBiZSBzZXQgdG8gY29uZmVyZW5jZUNsaWVudENvbmZpZ3VyYXRpb24ucnRjQ29uZmlndXJhdGlvbi5cbiAgICAgKiB7XG4gICAgICogICBpY2VTZXJ2ZXJzOiBbe1xuICAgICAqICAgICAgdXJsczogXCJzdHVuOmV4YW1wbGUuY29tOjM0NzhcIlxuICAgICAqICAgfSwge1xuICAgICAqICAgICB1cmxzOiBbXG4gICAgICogICAgICAgXCJ0dXJuOmV4YW1wbGUuY29tOjM0Nzg/dHJhbnNwb3J0PXVkcFwiLFxuICAgICAqICAgICAgIFwidHVybjpleGFtcGxlLmNvbTozNDc4P3RyYW5zcG9ydD10Y3BcIlxuICAgICAqICAgICBdLFxuICAgICAqICAgICAgY3JlZGVudGlhbDogXCJwYXNzd29yZFwiLFxuICAgICAqICAgICAgdXNlcm5hbWU6IFwidXNlcm5hbWVcIlxuICAgICAqICAgfVxuICAgICAqIH1cbiAgICAgKi9cbiAgICB0aGlzLnJ0Y0NvbmZpZ3VyYXRpb24gPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgQ29uZmVyZW5jZUNsaWVudFxuICogQGNsYXNzZGVzYyBUaGUgQ29uZmVyZW5jZUNsaWVudCBoYW5kbGVzIFBlZXJDb25uZWN0aW9ucyBiZXR3ZWVuIGNsaWVudCBhbmQgc2VydmVyLiBGb3IgY29uZmVyZW5jZSBjb250cm9sbGluZywgcGxlYXNlIHJlZmVyIHRvIFJFU1QgQVBJIGd1aWRlLlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgICAgICAgIHwgQXJndW1lbnQgVHlwZSAgICAgICAgICAgICAgICAgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfCAtLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgc3RyZWFtYWRkZWQgICAgICAgICAgIHwgT21zLkJhc2UuU3RyZWFtRXZlbnQgICAgICAgICAgICAgfCBBIG5ldyBzdHJlYW0gaXMgYXZhaWxhYmxlIGluIHRoZSBjb25mZXJlbmNlLiB8XG4gKiB8IHBhcnRpY2lwYW50am9pbmVkICAgICB8IE9tcy5Db25mZXJlbmNlLlBhcnRpY2lwYW50RXZlbnQgIHwgQSBuZXcgcGFydGljaXBhbnQgam9pbmVkIHRoZSBjb25mZXJlbmNlLiB8XG4gKiB8IG1lc3NhZ2VyZWNlaXZlZCAgICAgICB8IE9tcy5CYXNlLk1lc3NhZ2VFdmVudCAgICAgICAgICAgIHwgQSBuZXcgbWVzc2FnZSBpcyByZWNlaXZlZC4gfFxuICogfCBzZXJ2ZXJkaXNjb25uZWN0ZWQgICAgfCBPbXMuQmFzZS5PbXNFdmVudCAgICAgICAgICAgICAgICB8IERpc2Nvbm5lY3RlZCBmcm9tIGNvbmZlcmVuY2Ugc2VydmVyLiB8XG4gKlxuICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlXG4gKiBAZXh0ZW5kcyBPbXMuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHs/T21zLkNvbmZlcmVuY2UuQ29uZmVyZW5jZUNsaWVudENvbmZpZ3VyYXRpb24gfSBjb25maWcgQ29uZmlndXJhdGlvbiBmb3IgQ29uZmVyZW5jZUNsaWVudC5cbiAqIEBwYXJhbSB7P09tcy5Db25mZXJlbmNlLlNpb1NpZ25hbGluZyB9IHNpZ25hbGluZ0ltcGwgU2lnbmFsaW5nIGNoYW5uZWwgaW1wbGVtZW50YXRpb24gZm9yIENvbmZlcmVuY2VDbGllbnQuIFNESyB1c2VzIGRlZmF1bHQgc2lnbmFsaW5nIGNoYW5uZWwgaW1wbGVtZW50YXRpb24gaWYgdGhpcyBwYXJhbWV0ZXIgaXMgdW5kZWZpbmVkLiBDdXJyZW50bHksIGEgU29ja2V0LklPIHNpZ25hbGluZyBjaGFubmVsIGltcGxlbWVudGF0aW9uIHdhcyBwcm92aWRlZCBhcyBpY3MuY29uZmVyZW5jZS5TaW9TaWduYWxpbmcuIEhvd2V2ZXIsIGl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byBkaXJlY3RseSBhY2Nlc3Mgc2lnbmFsaW5nIGNoYW5uZWwgb3IgY3VzdG9taXplIHNpZ25hbGluZyBjaGFubmVsIGZvciBDb25mZXJlbmNlQ2xpZW50IGFzIHRoaXMgdGltZS5cbiAqL1xuZXhwb3J0IGNvbnN0IENvbmZlcmVuY2VDbGllbnQgPSBmdW5jdGlvbihjb25maWcsIHNpZ25hbGluZ0ltcGwpIHtcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIG5ldyBFdmVudE1vZHVsZS5FdmVudERpc3BhdGNoZXIoKSk7XG4gIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIGxldCBzaWduYWxpbmdTdGF0ZSA9IFNpZ25hbGluZ1N0YXRlLlJFQURZO1xuICBjb25zdCBzaWduYWxpbmcgPSBzaWduYWxpbmdJbXBsID8gc2lnbmFsaW5nSW1wbCA6IChuZXcgU2lnbmFsaW5nKCkpO1xuICBsZXQgbWU7XG4gIGxldCByb29tO1xuICBsZXQgcmVtb3RlU3RyZWFtcyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIHN0cmVhbSBJRCwgdmFsdWUgaXMgYSBSZW1vdGVTdHJlYW0uXG4gIGNvbnN0IHBhcnRpY2lwYW50cyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIHBhcnRpY2lwYW50IElELCB2YWx1ZSBpcyBhIFBhcnRpY2lwYW50IG9iamVjdC5cbiAgY29uc3QgcHVibGlzaENoYW5uZWxzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgcGMgY2hhbm5lbC5cbiAgY29uc3QgY2hhbm5lbHMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBjaGFubmVsJ3MgaW50ZXJuYWwgSUQsIHZhbHVlIGlzIGNoYW5uZWwuXG5cbiAgZnVuY3Rpb24gb25TaWduYWxpbmdNZXNzYWdlIChub3RpZmljYXRpb24sIGRhdGEpIHtcbiAgICBpZiAobm90aWZpY2F0aW9uID09PSAnc29hYycgfHwgbm90aWZpY2F0aW9uID09PSAncHJvZ3Jlc3MnKSB7XG4gICAgICBpZiAoIWNoYW5uZWxzLmhhcyhkYXRhLmlkKSkge1xuICAgICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgYSBjaGFubmVsIGZvciBpbmNvbWluZyBkYXRhLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjaGFubmVscy5nZXQoZGF0YS5pZCkub25NZXNzYWdlKG5vdGlmaWNhdGlvbiwgZGF0YSk7XG4gICAgfSBlbHNlIGlmIChub3RpZmljYXRpb24gPT09ICdzdHJlYW0nKSB7XG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdhZGQnKSB7XG4gICAgICAgIGZpcmVTdHJlYW1BZGRlZChkYXRhLmRhdGEpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgZmlyZVN0cmVhbVJlbW92ZWQoZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEuc3RhdHVzID09PSAndXBkYXRlJykge1xuICAgICAgICAvLyBCcm9hZGNhc3QgYXVkaW8vdmlkZW8gdXBkYXRlIHN0YXR1cyB0byBjaGFubmVsIHNvIHNwZWNpZmljIGV2ZW50cyBjYW4gYmUgZmlyZWQgb24gcHVibGljYXRpb24gb3Igc3Vic2NyaXB0aW9uLlxuICAgICAgICBpZiAoZGF0YS5kYXRhLmZpZWxkID09PSAnYXVkaW8uc3RhdHVzJyB8fCBkYXRhLmRhdGEuZmllbGQgPT09XG4gICAgICAgICAgJ3ZpZGVvLnN0YXR1cycpIHtcbiAgICAgICAgICBjaGFubmVscy5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgYy5vbk1lc3NhZ2Uobm90aWZpY2F0aW9uLCBkYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmRhdGEuZmllbGQgPT09ICdhY3RpdmVJbnB1dCcpIHtcbiAgICAgICAgICBmaXJlQWN0aXZlQXVkaW9JbnB1dENoYW5nZShkYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmRhdGEuZmllbGQgPT09ICd2aWRlby5sYXlvdXQnKSB7XG4gICAgICAgICAgZmlyZUxheW91dENoYW5nZShkYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmRhdGEuZmllbGQgPT09ICcuJykge1xuICAgICAgICAgIHVwZGF0ZVJlbW90ZVN0cmVhbShkYXRhLmRhdGEudmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIExvZ2dlci53YXJuaW5nKCdVbmtub3duIHN0cmVhbSBldmVudCBmcm9tIE1DVS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm90aWZpY2F0aW9uID09PSAndGV4dCcpIHtcbiAgICAgIGZpcmVNZXNzYWdlUmVjZWl2ZWQoZGF0YSk7XG4gICAgfSBlbHNlIGlmKG5vdGlmaWNhdGlvbiA9PT0gJ3BhcnRpY2lwYW50Jyl7XG4gICAgICBmaXJlUGFydGljaXBhbnRFdmVudChkYXRhKTtcbiAgICB9XG4gIH07XG5cbiAgc2lnbmFsaW5nLmFkZEV2ZW50TGlzdGVuZXIoJ2RhdGEnLCAoZXZlbnQpID0+IHtcbiAgICBvblNpZ25hbGluZ01lc3NhZ2UoZXZlbnQubWVzc2FnZS5ub3RpZmljYXRpb24sIGV2ZW50Lm1lc3NhZ2UuZGF0YSk7XG4gIH0pO1xuXG4gIHNpZ25hbGluZy5hZGRFdmVudExpc3RlbmVyKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgIGNsZWFuKCk7XG4gICAgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5SRUFEWTtcbiAgICBzZWxmLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk9tc0V2ZW50KCdzZXJ2ZXJkaXNjb25uZWN0ZWQnKSk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGZpcmVQYXJ0aWNpcGFudEV2ZW50KGRhdGEpIHtcbiAgICBpZiAoZGF0YS5hY3Rpb24gPT09ICdqb2luJykge1xuICAgICAgZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgIGNvbnN0IHBhcnRpY2lwYW50ID0gbmV3IFBhcnRpY2lwYW50KGRhdGEuaWQsIGRhdGEucm9sZSwgZGF0YS51c2VyKVxuICAgICAgcGFydGljaXBhbnRzLnNldChkYXRhLmlkLCBwYXJ0aWNpcGFudCk7XG4gICAgICBjb25zdCBldmVudCA9IG5ldyBQYXJ0aWNpcGFudEV2ZW50KCdwYXJ0aWNpcGFudGpvaW5lZCcsIHsgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50IH0pO1xuICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKGRhdGEuYWN0aW9uID09PSAnbGVhdmUnKSB7XG4gICAgICBjb25zdCBwYXJ0aWNpcGFudElkID0gZGF0YS5kYXRhO1xuICAgICAgaWYgKCFwYXJ0aWNpcGFudHMuaGFzKHBhcnRpY2lwYW50SWQpKSB7XG4gICAgICAgIExvZ2dlci53YXJuaW5nKFxuICAgICAgICAgICdSZWNlaXZlZCBsZWF2ZSBtZXNzYWdlIGZyb20gTUNVIGZvciBhbiB1bmtub3duIHBhcnRpY2lwYW50LicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwYXJ0aWNpcGFudCA9IHBhcnRpY2lwYW50cy5nZXQocGFydGljaXBhbnRJZCk7XG4gICAgICBwYXJ0aWNpcGFudHMuZGVsZXRlKHBhcnRpY2lwYW50SWQpO1xuICAgICAgcGFydGljaXBhbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnRNb2R1bGUuT21zRXZlbnQoJ2xlZnQnKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmlyZU1lc3NhZ2VSZWNlaXZlZChkYXRhKSB7XG4gICAgY29uc3QgbWVzc2FnZUV2ZW50ID0gbmV3IEV2ZW50TW9kdWxlLk1lc3NhZ2VFdmVudCgnbWVzc2FnZXJlY2VpdmVkJywge1xuICAgICAgbWVzc2FnZTogZGF0YS5tZXNzYWdlLFxuICAgICAgb3JpZ2luOiBkYXRhLmZyb20sXG4gICAgICB0bzogZGF0YS50b1xuICAgIH0pO1xuICAgIHNlbGYuZGlzcGF0Y2hFdmVudChtZXNzYWdlRXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlyZVN0cmVhbUFkZGVkKGluZm8pIHtcbiAgICBjb25zdCBzdHJlYW0gPSBjcmVhdGVSZW1vdGVTdHJlYW0oaW5mbyk7XG4gICAgcmVtb3RlU3RyZWFtcy5zZXQoc3RyZWFtLmlkLCBzdHJlYW0pO1xuICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IFN0cmVhbU1vZHVsZS5TdHJlYW1FdmVudCgnc3RyZWFtYWRkZWQnLCB7XG4gICAgICBzdHJlYW06IHN0cmVhbVxuICAgIH0pO1xuICAgIHNlbGYuZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBmaXJlU3RyZWFtUmVtb3ZlZChpbmZvKSB7XG4gICAgaWYgKCFyZW1vdGVTdHJlYW1zLmhhcyhpbmZvLmlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNwZWNpZmljIHJlbW90ZSBzdHJlYW0uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0cmVhbSA9IHJlbW90ZVN0cmVhbXMuZ2V0KGluZm8uaWQpO1xuICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IEV2ZW50TW9kdWxlLk9tc0V2ZW50KCdlbmRlZCcpO1xuICAgIHJlbW90ZVN0cmVhbXMuZGVsZXRlKHN0cmVhbS5pZCk7XG4gICAgc3RyZWFtLmRpc3BhdGNoRXZlbnQoc3RyZWFtRXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlyZUFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2UoaW5mbykge1xuICAgIGlmICghcmVtb3RlU3RyZWFtcy5oYXMoaW5mby5pZCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdDYW5ub3QgZmluZCBzcGVjaWZpYyByZW1vdGUgc3RyZWFtLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdHJlYW0gPSByZW1vdGVTdHJlYW1zLmdldChpbmZvLmlkKTtcbiAgICBjb25zdCBzdHJlYW1FdmVudCA9IG5ldyBBY3RpdmVBdWRpb0lucHV0Q2hhbmdlRXZlbnQoXG4gICAgICAnYWN0aXZlYXVkaW9pbnB1dGNoYW5nZScsIHtcbiAgICAgICAgYWN0aXZlQXVkaW9JbnB1dFN0cmVhbUlkOiBpbmZvLmRhdGEudmFsdWVcbiAgICAgIH0pO1xuICAgIHN0cmVhbS5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpcmVMYXlvdXRDaGFuZ2UoaW5mbykge1xuICAgIGlmICghcmVtb3RlU3RyZWFtcy5oYXMoaW5mby5pZCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdDYW5ub3QgZmluZCBzcGVjaWZpYyByZW1vdGUgc3RyZWFtLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdHJlYW0gPSByZW1vdGVTdHJlYW1zLmdldChpbmZvLmlkKTtcbiAgICBjb25zdCBzdHJlYW1FdmVudCA9IG5ldyBMYXlvdXRDaGFuZ2VFdmVudChcbiAgICAgICdsYXlvdXRjaGFuZ2UnLCB7XG4gICAgICAgIGxheW91dDogaW5mby5kYXRhLnZhbHVlXG4gICAgICB9KTtcbiAgICBzdHJlYW0uZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVSZW1vdGVTdHJlYW0oc3RyZWFtSW5mbykge1xuICAgIGlmICghcmVtb3RlU3RyZWFtcy5oYXMoc3RyZWFtSW5mby5pZCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdDYW5ub3QgZmluZCBzcGVjaWZpYyByZW1vdGUgc3RyZWFtLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdHJlYW0gPSByZW1vdGVTdHJlYW1zLmdldChzdHJlYW1JbmZvLmlkKTtcbiAgICBzdHJlYW0uc2V0dGluZ3MgPSBTdHJlYW1VdGlsc01vZHVsZS5jb252ZXJ0VG9QdWJsaWNhdGlvblNldHRpbmdzKHN0cmVhbUluZm9cbiAgICAgIC5tZWRpYSk7XG4gICAgc3RyZWFtLmNhcGFiaWxpdGllcyA9IFN0cmVhbVV0aWxzTW9kdWxlLmNvbnZlcnRUb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhcbiAgICAgIHN0cmVhbUluZm8ubWVkaWEpO1xuICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IEV2ZW50TW9kdWxlLk9tc0V2ZW50KCd1cGRhdGVkJyk7XG4gICAgc3RyZWFtLmRpc3BhdGNoRXZlbnQoc3RyZWFtRXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUmVtb3RlU3RyZWFtKHN0cmVhbUluZm8pIHtcbiAgICBpZiAoc3RyZWFtSW5mby50eXBlID09PSAnbWl4ZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlbW90ZU1peGVkU3RyZWFtKHN0cmVhbUluZm8pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgYXVkaW9Tb3VyY2VJbmZvLCB2aWRlb1NvdXJjZUluZm87XG4gICAgICBpZiAoc3RyZWFtSW5mby5tZWRpYS5hdWRpbykge1xuICAgICAgICBhdWRpb1NvdXJjZUluZm8gPSBzdHJlYW1JbmZvLm1lZGlhLmF1ZGlvLnNvdXJjZTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHJlYW1JbmZvLm1lZGlhLnZpZGVvKSB7XG4gICAgICAgIHZpZGVvU291cmNlSW5mbyA9IHN0cmVhbUluZm8ubWVkaWEudmlkZW8uc291cmNlO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbU1vZHVsZS5SZW1vdGVTdHJlYW0oc3RyZWFtSW5mby5pZCwgc3RyZWFtSW5mby5pbmZvXG4gICAgICAgIC5vd25lciwgdW5kZWZpbmVkLCBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbVNvdXJjZUluZm8oYXVkaW9Tb3VyY2VJbmZvLFxuICAgICAgICAgIHZpZGVvU291cmNlSW5mbyksIHN0cmVhbUluZm8uaW5mby5hdHRyaWJ1dGVzKTtcbiAgICAgIHN0cmVhbS5zZXR0aW5ncyA9IFN0cmVhbVV0aWxzTW9kdWxlLmNvbnZlcnRUb1B1YmxpY2F0aW9uU2V0dGluZ3MoXG4gICAgICAgIHN0cmVhbUluZm8ubWVkaWEpO1xuICAgICAgc3RyZWFtLmNhcGFiaWxpdGllcyA9IFN0cmVhbVV0aWxzTW9kdWxlLmNvbnZlcnRUb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhcbiAgICAgICAgc3RyZWFtSW5mby5tZWRpYSk7XG4gICAgICByZXR1cm4gc3RyZWFtO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNlbmRTaWduYWxpbmdNZXNzYWdlKHR5cGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gc2lnbmFsaW5nLnNlbmQodHlwZSwgbWVzc2FnZSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGVlckNvbm5lY3Rpb25DaGFubmVsKCkge1xuICAgIC8vIENvbnN0cnVjdCBhbiBzaWduYWxpbmcgc2VuZGVyL3JlY2VpdmVyIGZvciBDb25mZXJlbmNlUGVlckNvbm5lY3Rpb24uXG4gICAgY29uc3Qgc2lnbmFsaW5nRm9yQ2hhbm5lbCA9IE9iamVjdC5jcmVhdGUoRXZlbnRNb2R1bGUuRXZlbnREaXNwYXRjaGVyKTtcbiAgICBzaWduYWxpbmdGb3JDaGFubmVsLnNlbmRTaWduYWxpbmdNZXNzYWdlID0gc2VuZFNpZ25hbGluZ01lc3NhZ2U7XG4gICAgY29uc3QgcGNjID0gbmV3IENvbmZlcmVuY2VQZWVyQ29ubmVjdGlvbkNoYW5uZWwoY29uZmlnLCBzaWduYWxpbmdGb3JDaGFubmVsKTtcbiAgICBwY2MuYWRkRXZlbnRMaXN0ZW5lcignaWQnLCAobWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICBjaGFubmVscy5zZXQobWVzc2FnZUV2ZW50Lm1lc3NhZ2UsIHBjYyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHBjYztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFuKCkge1xuICAgIHBhcnRpY2lwYW50cy5jbGVhcigpO1xuICAgIHJlbW90ZVN0cmVhbXMuY2xlYXIoKTtcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaW5mbycsIHtcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgIGdldDogKCkgPT4ge1xuICAgICAgaWYgKCFyb29tKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBDb25mZXJlbmNlSW5mbyhyb29tLmlkLCBBcnJheS5mcm9tKHBhcnRpY2lwYW50cywgeCA9PiB4W1xuICAgICAgICAxXSksIEFycmF5LmZyb20ocmVtb3RlU3RyZWFtcywgeCA9PiB4WzFdKSwgbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBqb2luXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBKb2luIGEgY29uZmVyZW5jZS5cbiAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8Q29uZmVyZW5jZUluZm8sIEVycm9yPn0gUmV0dXJuIGEgcHJvbWlzZSByZXNvbHZlZCB3aXRoIGN1cnJlbnQgY29uZmVyZW5jZSdzIGluZm9ybWF0aW9uIGlmIHN1Y2Nlc3NmdWxseSBqb2luIHRoZSBjb25mZXJlbmNlLiBPciByZXR1cm4gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggYSBuZXdseSBjcmVhdGVkIE9tcy5FcnJvciBpZiBmYWlsZWQgdG8gam9pbiB0aGUgY29uZmVyZW5jZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIFRva2VuIGlzIGlzc3VlZCBieSBjb25mZXJlbmNlIHNlcnZlcihudXZlKS5cbiAgICovXG4gIHRoaXMuam9pbiA9IGZ1bmN0aW9uKHRva2VuU3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gSlNPTi5wYXJzZShCYXNlNjQuZGVjb2RlQmFzZTY0KHRva2VuU3RyaW5nKSk7XG4gICAgICBjb25zdCBpc1NlY3VyZWQgPSAodG9rZW4uc2VjdXJlID09PSB0cnVlKTtcbiAgICAgIGxldCBob3N0ID0gdG9rZW4uaG9zdDtcbiAgICAgIGlmICh0eXBlb2YgaG9zdCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoJ0ludmFsaWQgaG9zdC4nKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChob3N0LmluZGV4T2YoJ2h0dHAnKSA9PT0gLTEpIHtcbiAgICAgICAgaG9zdCA9IGlzU2VjdXJlZCA/ICgnaHR0cHM6Ly8nICsgaG9zdCkgOiAoJ2h0dHA6Ly8nICsgaG9zdCk7XG4gICAgICB9XG4gICAgICBpZiAoc2lnbmFsaW5nU3RhdGUgIT09IFNpZ25hbGluZ1N0YXRlLlJFQURZKSB7XG4gICAgICAgIHJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKCdjb25uZWN0aW9uIHN0YXRlIGludmFsaWQnKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5DT05ORUNUSU5HO1xuXG4gICAgICBjb25zdCBsb2dpbkluZm8gPSB7XG4gICAgICAgIHRva2VuOiB0b2tlblN0cmluZyxcbiAgICAgICAgdXNlckFnZW50OiBVdGlscy5zeXNJbmZvKCksXG4gICAgICAgIHByb3RvY29sOiBwcm90b2NvbFZlcnNpb25cbiAgICAgIH07XG5cbiAgICAgIHNpZ25hbGluZy5jb25uZWN0KGhvc3QsIGlzU2VjdXJlZCwgbG9naW5JbmZvKS50aGVuKChyZXNwKSA9PiB7XG4gICAgICAgIHNpZ25hbGluZ1N0YXRlID0gU2lnbmFsaW5nU3RhdGUuQ09OTkVDVEVEO1xuICAgICAgICByb29tID0gcmVzcC5yb29tO1xuICAgICAgICBpZiAocm9vbS5zdHJlYW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHN0IG9mIHJvb20uc3RyZWFtcykge1xuICAgICAgICAgICAgaWYgKHN0LnR5cGUgPT09ICdtaXhlZCcpIHtcbiAgICAgICAgICAgICAgc3Qudmlld3BvcnQgPSBzdC5pbmZvLmxhYmVsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtb3RlU3RyZWFtcy5zZXQoc3QuaWQsIGNyZWF0ZVJlbW90ZVN0cmVhbShzdCkpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3Aucm9vbSAmJiByZXNwLnJvb20ucGFydGljaXBhbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcmVzcC5yb29tLnBhcnRpY2lwYW50cykge1xuICAgICAgICAgICAgcGFydGljaXBhbnRzLnNldChwLmlkLCBuZXcgUGFydGljaXBhbnQocC5pZCwgcC5yb2xlLCBwLnVzZXIpKTtcbiAgICAgICAgICAgIGlmIChwLmlkID09PSByZXNwLmlkKSB7XG4gICAgICAgICAgICAgIG1lID0gcGFydGljaXBhbnRzLmdldChwLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShuZXcgQ29uZmVyZW5jZUluZm8ocmVzcC5yb29tLmlkLCBBcnJheS5mcm9tKHBhcnRpY2lwYW50c1xuICAgICAgICAgIC52YWx1ZXMoKSksIEFycmF5LmZyb20ocmVtb3RlU3RyZWFtcy52YWx1ZXMoKSksIG1lKSk7XG4gICAgICB9LCAoZSkgPT4ge1xuICAgICAgICBzaWduYWxpbmdTdGF0ZSA9IFNpZ25hbGluZ1N0YXRlLlJFQURZO1xuICAgICAgICByZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihlKSlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gcHVibGlzaFxuICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuQ29uZmVyZW5jZUNsaWVudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgUHVibGlzaCBhIExvY2FsU3RyZWFtIHRvIGNvbmZlcmVuY2Ugc2VydmVyLiBPdGhlciBwYXJ0aWNpcGFudHMgd2lsbCBiZSBhYmxlIHRvIHN1YnNjcmliZSB0aGlzIHN0cmVhbSB3aGVuIGl0IGlzIHN1Y2Nlc3NmdWxseSBwdWJsaXNoZWQuXG4gICAqIEBwYXJhbSB7T21zLkJhc2UuTG9jYWxTdHJlYW19IHN0cmVhbSBUaGUgc3RyZWFtIHRvIGJlIHB1Ymxpc2hlZC5cbiAgICogQHBhcmFtIHtPbXMuQmFzZS5QdWJsaXNoT3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIGZvciBwdWJsaWNhdGlvbi5cbiAgICogQHJldHVybnMge1Byb21pc2U8UHVibGljYXRpb24sIEVycm9yPn0gUmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGggYSBuZXdseSBjcmVhdGVkIFB1YmxpY2F0aW9uIG9uY2Ugc3BlY2lmaWMgc3RyZWFtIGlzIHN1Y2Nlc3NmdWxseSBwdWJsaXNoZWQsIG9yIHJlamVjdGVkIHdpdGggYSBuZXdseSBjcmVhdGVkIEVycm9yIGlmIHN0cmVhbSBpcyBpbnZhbGlkIG9yIG9wdGlvbnMgY2Fubm90IGJlIHNhdGlzZmllZC4gU3VjY2Vzc2Z1bGx5IHB1Ymxpc2hlZCBtZWFucyBQZWVyQ29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZCBhbmQgc2VydmVyIGlzIGFibGUgdG8gcHJvY2VzcyBtZWRpYSBkYXRhLlxuICAgKi9cbiAgdGhpcy5wdWJsaXNoID0gZnVuY3Rpb24oc3RyZWFtLCBvcHRpb25zKSB7XG4gICAgaWYgKCEoc3RyZWFtIGluc3RhbmNlb2YgU3RyZWFtTW9kdWxlLkxvY2FsU3RyZWFtKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoJ0ludmFsaWQgc3RyZWFtLicpKTtcbiAgICB9XG4gICAgaWYgKHB1Ymxpc2hDaGFubmVscy5oYXMoc3RyZWFtLm1lZGlhU3RyZWFtLmlkKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICdDYW5ub3QgcHVibGlzaCBhIHB1Ymxpc2hlZCBzdHJlYW0uJykpO1xuICAgIH1cbiAgICBjb25zdCBjaGFubmVsID0gY3JlYXRlUGVlckNvbm5lY3Rpb25DaGFubmVsKCk7XG4gICAgcmV0dXJuIGNoYW5uZWwucHVibGlzaChzdHJlYW0sIG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gc3Vic2NyaWJlXG4gICAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZS5Db25mZXJlbmNlQ2xpZW50XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBTdWJzY3JpYmUgYSBSZW1vdGVTdHJlYW0gZnJvbSBjb25mZXJlbmNlIHNlcnZlci5cbiAgICogQHBhcmFtIHtPbXMuQmFzZS5SZW1vdGVTdHJlYW19IHN0cmVhbSBUaGUgc3RyZWFtIHRvIGJlIHN1YnNjcmliZWQuXG4gICAqIEBwYXJhbSB7T21zLkNvbmZlcmVuY2UuU3Vic2NyaWJlT3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIGZvciBzdWJzY3JpcHRpb24uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFN1YnNjcmlwdGlvbiwgRXJyb3I+fSBSZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCBhIG5ld2x5IGNyZWF0ZWQgU3Vic2NyaXB0aW9uIG9uY2Ugc3BlY2lmaWMgc3RyZWFtIGlzIHN1Y2Nlc3NmdWxseSBzdWJzY3JpYmVkLCBvciByZWplY3RlZCB3aXRoIGEgbmV3bHkgY3JlYXRlZCBFcnJvciBpZiBzdHJlYW0gaXMgaW52YWxpZCBvciBvcHRpb25zIGNhbm5vdCBiZSBzYXRpc2ZpZWQuIFN1Y2Nlc3NmdWxseSBzdWJzY3JpYmVkIG1lYW5zIFBlZXJDb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkIGFuZCBzZXJ2ZXIgd2FzIHN0YXJ0ZWQgdG8gc2VuZCBtZWRpYSBkYXRhLlxuICAgKi9cbiAgdGhpcy5zdWJzY3JpYmUgPSBmdW5jdGlvbihzdHJlYW0sIG9wdGlvbnMpIHtcbiAgICBpZiAoIShzdHJlYW0gaW5zdGFuY2VvZiBTdHJlYW1Nb2R1bGUuUmVtb3RlU3RyZWFtKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoJ0ludmFsaWQgc3RyZWFtLicpKTtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGNyZWF0ZVBlZXJDb25uZWN0aW9uQ2hhbm5lbCgpO1xuICAgIHJldHVybiBjaGFubmVsLnN1YnNjcmliZShzdHJlYW0sIG9wdGlvbnMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gc2VuZFxuICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuQ29uZmVyZW5jZUNsaWVudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgU2VuZCBhIHRleHQgbWVzc2FnZSB0byBhIHBhcnRpY2lwYW50IG9yIGFsbCBwYXJ0aWNpcGFudHMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIE1lc3NhZ2UgdG8gYmUgc2VudC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcnRpY2lwYW50SWQgUmVjZWl2ZXIgb2YgdGhpcyBtZXNzYWdlLiBNZXNzYWdlIHdpbGwgYmUgc2VudCB0byBhbGwgcGFydGljaXBhbnRzIGlmIHBhcnRpY2lwYW50SWQgaXMgdW5kZWZpbmVkLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkLCBFcnJvcj59IFJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aGVuIGNvbmZlcmVuY2Ugc2VydmVyIHJlY2VpdmVkIGNlcnRhaW4gbWVzc2FnZS5cbiAgICovXG4gIHRoaXMuc2VuZCA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHBhcnRpY2lwYW50SWQpIHtcbiAgICBpZiAocGFydGljaXBhbnRJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBwYXJ0aWNpcGFudElkID0gJ2FsbCc7XG4gICAgfVxuICAgIHJldHVybiBzZW5kU2lnbmFsaW5nTWVzc2FnZSgndGV4dCcsIHsgdG86IHBhcnRpY2lwYW50SWQsIG1lc3NhZ2U6IG1lc3NhZ2UgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBsZWF2ZVxuICAgKiBAbWVtYmVyT2YgT21zLkNvbmZlcmVuY2UuQ29uZmVyZW5jZUNsaWVudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgTGVhdmUgYSBjb25mZXJlbmNlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkLCBFcnJvcj59IFJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoIHVuZGVmaW5lZCBvbmNlIHRoZSBjb25uZWN0aW9uIGlzIGRpc2Nvbm5lY3RlZC5cbiAgICovXG4gIHRoaXMubGVhdmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2lnbmFsaW5nLmRpc2Nvbm5lY3QoKS50aGVuKCgpID0+IHtcbiAgICAgIGNsZWFuKCk7XG4gICAgICBzaWduYWxpbmdTdGF0ZSA9IFNpZ25hbGluZ1N0YXRlLlJFQURZO1xuICAgIH0pO1xuICB9O1xufTtcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY2xhc3MgQ29uZmVyZW5jZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuZXhwb3J0IHtDb25mZXJlbmNlQ2xpZW50fSBmcm9tICcuL2NsaWVudC5qcydcbmV4cG9ydCB7U2lvU2lnbmFsaW5nfSBmcm9tICcuL3NpZ25hbGluZy5qcydcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBjbGFzcyBDb25mZXJlbmNlSW5mb1xuICogQGNsYXNzRGVzYyBJbmZvcm1hdGlvbiBmb3IgYSBjb25mZXJlbmNlLlxuICogQG1lbWJlck9mIE9tcy5Db25mZXJlbmNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25mZXJlbmNlSW5mbyB7XG4gIGNvbnN0cnVjdG9yKGlkLCBwYXJ0aWNpcGFudHMsIHJlbW90ZVN0cmVhbXMsIG15SW5mbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuQ29uZmVyZW5jZUluZm9cbiAgICAgKiBAZGVzYyBDb25mZXJlbmNlIElELlxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheTxPbXMuQ29uZmVyZW5jZS5QYXJ0aWNpcGFudD59IHBhcnRpY2lwYW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZS5Db25mZXJlbmNlSW5mb1xuICAgICAqIEBkZXNjIFBhcnRpY2lwYW50cyBpbiB0aGUgY29uZmVyZW5jZS5cbiAgICAgKi9cbiAgICB0aGlzLnBhcnRpY2lwYW50cyA9IHBhcnRpY2lwYW50cztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheTxPbXMuQmFzZS5SZW1vdGVTdHJlYW0+fSByZW1vdGVTdHJlYW1zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VJbmZvXG4gICAgICogQGRlc2MgU3RyZWFtcyBwdWJsaXNoZWQgYnkgcGFydGljaXBhbnRzLiBJdCBhbHNvIGluY2x1ZGVzIHN0cmVhbXMgcHVibGlzaGVkIGJ5IGN1cnJlbnQgdXNlci5cbiAgICAgKi9cbiAgICB0aGlzLnJlbW90ZVN0cmVhbXMgPSByZW1vdGVTdHJlYW1zO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge09tcy5CYXNlLlBhcnRpY2lwYW50fSBzZWxmXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLkNvbmZlcmVuY2VJbmZvXG4gICAgICovXG4gICAgdGhpcy5zZWxmID0gbXlJbmZvO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgU3RyZWFtTW9kdWxlIGZyb20gJy4uL2Jhc2Uvc3RyZWFtLmpzJ1xuaW1wb3J0ICogYXMgU3RyZWFtVXRpbHNNb2R1bGUgZnJvbSAnLi9zdHJlYW11dGlscy5qcydcbmltcG9ydCB7IE9tc0V2ZW50IH0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcydcblxuLyoqXG4gKiBAY2xhc3MgUmVtb3RlTWl4ZWRTdHJlYW1cbiAqIEBjbGFzc0Rlc2MgTWl4ZWQgc3RyZWFtIGZyb20gY29uZmVyZW5jZSBzZXJ2ZXIuXG4gKiBFdmVudHM6XG4gKlxuICogfCBFdmVudCBOYW1lICAgICAgICAgICAgIHwgQXJndW1lbnQgVHlwZSAgICB8IEZpcmVkIHdoZW4gICAgICAgfFxuICogfCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwgLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBhY3RpdmVhdWRpb2lucHV0Y2hhbmdlIHwgRXZlbnQgICAgICAgICAgICB8IEF1ZGlvIGFjdGl2ZW5lc3Mgb2YgaW5wdXQgc3RyZWFtKG9mIHRoZSBtaXhlZCBzdHJlYW0pIGlzIGNoYW5nZWQuIHxcbiAqIHwgbGF5b3V0Y2hhbmdlICAgICAgICAgICB8IEV2ZW50ICAgICAgICAgICAgfCBWaWRlbydzIGxheW91dCBoYXMgYmVlbiBjaGFuZ2VkLiBJdCB1c3VhbGx5IGhhcHBlbnMgd2hlbiBhIG5ldyB2aWRlbyBpcyBtaXhlZCBpbnRvIHRoZSB0YXJnZXQgbWl4ZWQgc3RyZWFtIG9yIGFuIGV4aXN0aW5nIHZpZGVvIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSBtaXhlZCBzdHJlYW0uIHxcbiAqXG4gKiBAbWVtYmVyT2YgT21zLkNvbmZlcmVuY2VcbiAqIEBleHRlbmRzIE9tcy5CYXNlLlJlbW90ZVN0cmVhbVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgUmVtb3RlTWl4ZWRTdHJlYW0gZXh0ZW5kcyBTdHJlYW1Nb2R1bGUuUmVtb3RlU3RyZWFtIHtcbiAgY29uc3RydWN0b3IoaW5mbykge1xuICAgIGlmIChpbmZvLnR5cGUgIT09ICdtaXhlZCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vdCBhIG1peGVkIHN0cmVhbScpO1xuICAgIH1cbiAgICBzdXBlcihpbmZvLmlkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbmV3IFN0cmVhbU1vZHVsZS5TdHJlYW1Tb3VyY2VJbmZvKFxuICAgICAgJ21peGVkJywgJ21peGVkJykpO1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IFN0cmVhbVV0aWxzTW9kdWxlLmNvbnZlcnRUb1B1YmxpY2F0aW9uU2V0dGluZ3MoaW5mby5tZWRpYSk7XG5cbiAgICB0aGlzLmNhcGFiaWxpdGllcyA9IG5ldyBTdHJlYW1VdGlsc01vZHVsZS5jb252ZXJ0VG9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMoXG4gICAgICBpbmZvLm1lZGlhKTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBBY3RpdmVBdWRpb0lucHV0Q2hhbmdlRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgQWN0aXZlSW5wdXRDaGFuZ2VFdmVudCByZXByZXNlbnRzIGFuIGFjdGl2ZSBhdWRpbyBpbnB1dCBjaGFuZ2UgZXZlbnQuXG4gKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIEFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2VFdmVudCBleHRlbmRzIE9tc0V2ZW50IHtcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gYWN0aXZlQXVkaW9JbnB1dFN0cmVhbUlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLkFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2VFdmVudFxuICAgICAqIEBkZXNjIFRoZSBJRCBvZiBpbnB1dCBzdHJlYW0ob2YgdGhlIG1peGVkIHN0cmVhbSkgd2hvc2UgYXVkaW8gaXMgYWN0aXZlLlxuICAgICAqL1xuICAgIHRoaXMuYWN0aXZlQXVkaW9JbnB1dFN0cmVhbUlkID0gaW5pdC5hY3RpdmVBdWRpb0lucHV0U3RyZWFtSWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgTGF5b3V0Q2hhbmdlRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgTGF5b3V0Q2hhbmdlRXZlbnQgcmVwcmVzZW50cyBhbiB2aWRlbyBsYXlvdXQgY2hhbmdlIGV2ZW50LlxuICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBMYXlvdXRDaGFuZ2VFdmVudCBleHRlbmRzIE9tc0V2ZW50e1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7b2JqZWN0fSBsYXlvdXRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuTGF5b3V0Q2hhbmdlRXZlbnRcbiAgICAgKiBAZGVzYyBDdXJyZW50IHZpZGVvJ3MgbGF5b3V0LiBJdCdzIGFuIGFycmF5IG9mIG1hcCB3aGljaCBtYXBzIGVhY2ggc3RyZWFtIHRvIGEgcmVnaW9uLlxuICAgICAqL1xuICAgIHRoaXMubGF5b3V0ID0gaW5pdC5sYXlvdXQ7XG4gIH1cbn1cblxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG5pbXBvcnQgKiBhcyBFdmVudE1vZHVsZSBmcm9tICcuLi9iYXNlL2V2ZW50LmpzJztcblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBjbGFzcyBQYXJ0aWNpcGFudFxuICogQG1lbWJlck9mIE9tcy5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFRoZSBQYXJ0aWNpcGFudCBkZWZpbmVzIGEgcGFydGljaXBhbnQgaW4gYSBjb25mZXJlbmNlLlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgIHwgQXJndW1lbnQgVHlwZSAgICAgIHwgRmlyZWQgd2hlbiAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBsZWZ0ICAgICAgICAgICAgfCBPbXMuQmFzZS5PbXNFdmVudCAgfCBUaGUgcGFydGljaXBhbnQgbGVmdCB0aGUgY29uZmVyZW5jZS4gfFxuICpcbiAqIEBleHRlbmRzIE9tcy5CYXNlLkV2ZW50RGlzcGF0Y2hlclxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgUGFydGljaXBhbnQgZXh0ZW5kcyBFdmVudE1vZHVsZS5FdmVudERpc3BhdGNoZXIge1xuICBjb25zdHJ1Y3RvcihpZCwgcm9sZSwgdXNlcklkKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlBhcnRpY2lwYW50XG4gICAgICogQGRlc2MgVGhlIElEIG9mIHRoZSBwYXJ0aWNpcGFudC4gSXQgdmFyaWVzIHdoZW4gYSBzaW5nbGUgdXNlciBqb2luIGRpZmZlcmVudCBjb25mZXJlbmNlcy5cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBpZFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gcm9sZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZS5QYXJ0aWNpcGFudFxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncm9sZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogcm9sZVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gdXNlcklkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlBhcnRpY2lwYW50XG4gICAgICogQGRlc2MgVGhlIHVzZXIgSUQgb2YgdGhlIHBhcnRpY2lwYW50LiBJdCBjYW4gYmUgaW50ZWdyYXRlZCBpbnRvIGV4aXN0aW5nIGFjY291bnQgbWFuYWdlbWVudCBzeXN0ZW0uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd1c2VySWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHVzZXJJZFxuICAgIH0pO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8qIGdsb2JhbCBpbyAqL1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcydcbmltcG9ydCAqIGFzIEV2ZW50TW9kdWxlIGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnXG5pbXBvcnQgeyBDb25mZXJlbmNlRXJyb3IgfSBmcm9tICcuL2Vycm9yLmpzJ1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gIGlmIChzdGF0dXMgPT09ICdvaycgfHwgc3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICByZXNvbHZlKGRhdGEpO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ2Vycm9yJykge1xuICAgIHJlamVjdChkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBMb2dnZXIuZXJyb3IoJ01DVSByZXR1cm5zIHVua25vd24gYWNrLicpO1xuICB9XG59O1xuXG5jb25zdCBNQVhfVFJJQUxTID0gNTtcbi8qKlxuICogQGNsYXNzIFNpb1NpZ25hbGluZ1xuICogQGNsYXNzZGVzYyBTb2NrZXQuSU8gc2lnbmFsaW5nIGNoYW5uZWwgZm9yIENvbmZlcmVuY2VDbGllbnQuIEl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byBkaXJlY3RseSBhY2Nlc3MgdGhpcyBjbGFzcy5cbiAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZVxuICogQGV4dGVuZHMgT21zLkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P09iamVjdCB9IHNpb0NvbmZpZyBDb25maWd1cmF0aW9uIGZvciBTb2NrZXQuSU8gb3B0aW9ucy5cbiAqIEBzZWUgaHR0cHM6Ly9zb2NrZXQuaW8vZG9jcy9jbGllbnQtYXBpLyNpby11cmwtb3B0aW9uc1xuICovXG5leHBvcnQgY2xhc3MgU2lvU2lnbmFsaW5nIGV4dGVuZHMgRXZlbnRNb2R1bGUuRXZlbnREaXNwYXRjaGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9zb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuX2xvZ2dlZEluID0gZmFsc2U7XG4gICAgdGhpcy5fcmVjb25uZWN0VGltZXMgPSAwO1xuICAgIHRoaXMuX3JlY29ubmVjdGlvblRpY2tldCA9IG51bGw7XG4gIH1cblxuICBjb25uZWN0KGhvc3QsIGlzU2VjdXJlZCwgbG9naW5JbmZvKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAncmVjb25uZWN0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3JlY29ubmVjdGlvbkF0dGVtcHRzJzogTUFYX1RSSUFMUyxcbiAgICAgICAgJ2ZvcmNlIG5ldyBjb25uZWN0aW9uJzogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHRoaXMuX3NvY2tldCA9IGlvKGhvc3QsIG9wdHMpO1xuICAgICAgWydwYXJ0aWNpcGFudCcsICd0ZXh0JywgJ3N0cmVhbScsICdwcm9ncmVzcyddLmZvckVhY2goKFxuICAgICAgICBub3RpZmljYXRpb24pID0+IHtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKG5vdGlmaWNhdGlvbiwgKGRhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk1lc3NhZ2VFdmVudCgnZGF0YScsIHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgICAgICAgbm90aWZpY2F0aW9uOiBub3RpZmljYXRpb24sXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9zb2NrZXQub24oJ3JlY29ubmVjdGluZycsICgpID0+IHtcbiAgICAgICAgdGhpcy5fcmVjb25uZWN0VGltZXMrKztcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc29ja2V0Lm9uKCdyZWNvbm5lY3RfZmFpbGVkJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0VGltZXMgPj0gTUFYX1RSSUFMUykge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnRNb2R1bGUuT21zRXZlbnQoJ2Rpc2Nvbm5lY3QnKSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLl9zb2NrZXQub24oJ2Ryb3AnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX3JlY29ubmVjdFRpbWVzID0gTUFYX1RSSUFMUztcbiAgICAgIH0pXG4gICAgICB0aGlzLl9zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9yZWNvbm5lY3RUaW1lcyA+PSBNQVhfVFJJQUxTKSB7XG4gICAgICAgICAgdGhpcy5fbG9nZ2VkSW4gPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk9tc0V2ZW50KCdkaXNjb25uZWN0JykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdsb2dpbicsIGxvZ2luSW5mbywgKHN0YXR1cywgZGF0YSkgPT4ge1xuICAgICAgICBpZiAoc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgdGhpcy5fbG9nZ2VkSW4gPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX3JlY29ubmVjdGlvblRpY2tldCA9IGRhdGEucmVjb25uZWN0aW9uVGlja2V0O1xuICAgICAgICAgIHRoaXMuX3NvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIC8vIHJlLWxvZ2luIHdpdGggcmVjb25uZWN0aW9uIHRpY2tldC5cbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdyZWxvZ2luJywgdGhpcy5fcmVjb25uZWN0aW9uVGlja2V0LCAoc3RhdHVzLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3RUaW1lcyA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb25uZWN0aW9uVGlja2V0ID0gZGF0YTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk9tc0V2ZW50KCdkaXNjb25uZWN0JykpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGhhbmRsZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCB8fCB0aGlzLl9zb2NrZXQuZGlzY29ubmVjdGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgJ1BvcnRhbCBpcyBub3QgY29ubmVjdGVkLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdsb2dvdXQnLCAoc3RhdHVzLCBkYXRhKSA9PiB7XG4gICAgICAgIC8vIE1heGltaXplIHRoZSByZWNvbm5lY3QgdGltZXMgdG8gZGlzYWJsZSByZWNvbm5lY3Rpb24uXG4gICAgICAgIHRoaXMuX3JlY29ubmVjdFRpbWVzID0gTUFYX1RSSUFMUztcbiAgICAgICAgdGhpcy5fc29ja2V0LmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgaGFuZGxlUmVzcG9uc2Uoc3RhdHVzLCBkYXRhLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kKHJlcXVlc3ROYW1lLCByZXF1ZXN0RGF0YSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLl9zb2NrZXQuZW1pdChyZXF1ZXN0TmFtZSwgcmVxdWVzdERhdGEsIChzdGF0dXMsIGRhdGEpID0+IHtcbiAgICAgICAgaGFuZGxlUmVzcG9uc2Uoc3RhdHVzLCBkYXRhLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgKiBhcyBQdWJsaWNhdGlvbk1vZHVsZSBmcm9tICcuLi9iYXNlL3B1YmxpY2F0aW9uLmpzJ1xuaW1wb3J0ICogYXMgTWVkaWFGb3JtYXRNb2R1bGUgZnJvbSAnLi4vYmFzZS9tZWRpYWZvcm1hdC5qcydcbmltcG9ydCAqIGFzIENvZGVjTW9kdWxlIGZyb20gJy4uL2Jhc2UvY29kZWMuanMnXG5pbXBvcnQgKiBhcyBTdWJzY3JpcHRpb25Nb2R1bGUgZnJvbSAnLi9zdWJzY3JpcHRpb24uanMnXG5cbmZ1bmN0aW9uIGV4dHJhY3RCaXRyYXRlTXVsdGlwbGllcihpbnB1dCkge1xuICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyB8fCAhaW5wdXQuc3RhcnRzV2l0aCgneCcpKSB7XG4gICAgTC5Mb2dnZXIud2FybmluZygnSW52YWxpZCBiaXRyYXRlIG11bHRpcGxpZXIgaW5wdXQuJyk7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIE51bWJlci5wYXJzZUZsb2F0KGlucHV0LnJlcGxhY2UoL154LywgJycpKTtcbn1cblxuZnVuY3Rpb24gc29ydE51bWJlcnMoeCwgeSkge1xuICByZXR1cm4geCAtIHk7XG59XG5cbmZ1bmN0aW9uIHNvcnRSZXNvbHV0aW9ucyh4LCB5KSB7XG4gIGlmICh4LndpZHRoICE9PSB5LndpZHRoKSB7XG4gICAgcmV0dXJuIHgud2lkdGggLSB5LndpZHRoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB4LmhlaWdodCAtIHkuaGVpZ2h0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9QdWJsaWNhdGlvblNldHRpbmdzKG1lZGlhSW5mbykge1xuICBsZXQgYXVkaW8sIGF1ZGlvQ29kZWMsIHZpZGVvLCB2aWRlb0NvZGVjLCByZXNvbHV0aW9uLCBmcmFtZXJhdGUsIGJpdHJhdGUsXG4gICAga2V5RnJhbWVJbnRlcnZhbDtcbiAgaWYgKG1lZGlhSW5mby5hdWRpbykge1xuICAgIGlmIChtZWRpYUluZm8uYXVkaW8uZm9ybWF0KSB7XG4gICAgICBhdWRpb0NvZGVjID0gbmV3IENvZGVjTW9kdWxlLkF1ZGlvQ29kZWNQYXJhbWV0ZXJzKG1lZGlhSW5mby5hdWRpby5mb3JtYXRcbiAgICAgICAgLmNvZGVjLCBtZWRpYUluZm8uYXVkaW8uZm9ybWF0LmNoYW5uZWxOdW0sIG1lZGlhSW5mby5hdWRpby5mb3JtYXQuc2FtcGxlUmF0ZVxuICAgICAgKTtcbiAgICB9XG4gICAgYXVkaW8gPSBuZXcgUHVibGljYXRpb25Nb2R1bGUuQXVkaW9QdWJsaWNhdGlvblNldHRpbmdzKGF1ZGlvQ29kZWMpO1xuICB9XG4gIGlmIChtZWRpYUluZm8udmlkZW8pIHtcbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvLmZvcm1hdCkge1xuICAgICAgdmlkZW9Db2RlYyA9IG5ldyBDb2RlY01vZHVsZS5WaWRlb0NvZGVjUGFyYW1ldGVycyhtZWRpYUluZm8udmlkZW9cbiAgICAgICAgLmZvcm1hdC5jb2RlYywgbWVkaWFJbmZvLnZpZGVvLmZvcm1hdC5wcm9maWxlKTtcbiAgICB9XG4gICAgaWYgKG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzKSB7XG4gICAgICBpZiAobWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMucmVzb2x1dGlvbikge1xuICAgICAgICByZXNvbHV0aW9uID0gbmV3IE1lZGlhRm9ybWF0TW9kdWxlLlJlc29sdXRpb24obWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnNcbiAgICAgICAgICAucmVzb2x1dGlvbi53aWR0aCwgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMucmVzb2x1dGlvbi5oZWlnaHQpO1xuICAgICAgfVxuICAgICAgZnJhbWVyYXRlID0gbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMuZnJhbWVyYXRlO1xuICAgICAgYml0cmF0ZSA9IG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLmJpdHJhdGUgKiAxMDAwO1xuICAgICAga2V5RnJhbWVJbnRlcnZhbCA9IG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLmtleUZyYW1lSW50ZXJ2YWw7XG4gICAgfVxuICAgIHZpZGVvID0gbmV3IFB1YmxpY2F0aW9uTW9kdWxlLlZpZGVvUHVibGljYXRpb25TZXR0aW5ncyh2aWRlb0NvZGVjLFxuICAgICAgcmVzb2x1dGlvbiwgZnJhbWVyYXRlLCBiaXRyYXRlLCBrZXlGcmFtZUludGVydmFsXG4gICAgKTtcbiAgfVxuICByZXR1cm4gbmV3IFB1YmxpY2F0aW9uTW9kdWxlLlB1YmxpY2F0aW9uU2V0dGluZ3MoYXVkaW8sIHZpZGVvKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhtZWRpYUluZm8pIHtcbiAgbGV0IGF1ZGlvLCB2aWRlbztcbiAgaWYgKG1lZGlhSW5mby5hdWRpbykge1xuICAgIGNvbnN0IGF1ZGlvQ29kZWNzID0gW107XG4gICAgaWYgKG1lZGlhSW5mby5hdWRpbyAmJiBtZWRpYUluZm8uYXVkaW8uZm9ybWF0KSB7XG4gICAgICBhdWRpb0NvZGVjcy5wdXNoKG5ldyBDb2RlY01vZHVsZS5BdWRpb0NvZGVjUGFyYW1ldGVycyhcbiAgICAgICAgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdC5jb2RlYywgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdC5jaGFubmVsTnVtLFxuICAgICAgICBtZWRpYUluZm8uYXVkaW8uZm9ybWF0LnNhbXBsZVJhdGUpKTtcbiAgICB9XG4gICAgaWYgKG1lZGlhSW5mby5hdWRpbyAmJiBtZWRpYUluZm8uYXVkaW8ub3B0aW9uYWwgJiZcbiAgICAgIG1lZGlhSW5mby5hdWRpby5vcHRpb25hbC5mb3JtYXQpIHtcbiAgICAgIGZvciAoY29uc3QgYXVkaW9Db2RlY0luZm8gb2YgbWVkaWFJbmZvLmF1ZGlvLm9wdGlvbmFsLmZvcm1hdCkge1xuICAgICAgICBjb25zdCBhdWRpb0NvZGVjID0gbmV3IENvZGVjTW9kdWxlLkF1ZGlvQ29kZWNQYXJhbWV0ZXJzKFxuICAgICAgICAgIGF1ZGlvQ29kZWNJbmZvLmNvZGVjLCBhdWRpb0NvZGVjSW5mby5jaGFubmVsTnVtLFxuICAgICAgICAgIGF1ZGlvQ29kZWNJbmZvLnNhbXBsZVJhdGUpO1xuICAgICAgICBhdWRpb0NvZGVjcy5wdXNoKGF1ZGlvQ29kZWMpO1xuICAgICAgfVxuICAgIH1cbiAgICBhdWRpb0NvZGVjcy5zb3J0KCk7XG4gICAgYXVkaW8gPSBuZXcgU3Vic2NyaXB0aW9uTW9kdWxlLkF1ZGlvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzKGF1ZGlvQ29kZWNzKTtcbiAgfVxuICBpZiAobWVkaWFJbmZvLnZpZGVvKSB7XG4gICAgY29uc3QgdmlkZW9Db2RlY3MgPSBbXTtcbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvICYmIG1lZGlhSW5mby52aWRlby5mb3JtYXQpIHtcbiAgICAgIHZpZGVvQ29kZWNzLnB1c2gobmV3IENvZGVjTW9kdWxlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzKFxuICAgICAgICBtZWRpYUluZm8udmlkZW8uZm9ybWF0LmNvZGVjLCBtZWRpYUluZm8udmlkZW8uZm9ybWF0LnByb2ZpbGUpKTtcbiAgICB9XG4gICAgaWYgKG1lZGlhSW5mby52aWRlbyAmJiBtZWRpYUluZm8udmlkZW8ub3B0aW9uYWwgJiZcbiAgICAgIG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5mb3JtYXQpIHtcbiAgICAgIGZvciAoY29uc3QgdmlkZW9Db2RlY0luZm8gb2YgbWVkaWFJbmZvLnZpZGVvLm9wdGlvbmFsLmZvcm1hdCkge1xuICAgICAgICBjb25zdCB2aWRlb0NvZGVjID0gbmV3IENvZGVjTW9kdWxlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzKFxuICAgICAgICAgIHZpZGVvQ29kZWNJbmZvLmNvZGVjLCB2aWRlb0NvZGVjSW5mby5wcm9maWxlKTtcbiAgICAgICAgdmlkZW9Db2RlY3MucHVzaCh2aWRlb0NvZGVjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmlkZW9Db2RlY3Muc29ydCgpO1xuICAgIGNvbnN0IHJlc29sdXRpb25zID0gQXJyYXkuZnJvbShcbiAgICAgIG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5wYXJhbWV0ZXJzLnJlc29sdXRpb24sXG4gICAgICByID0+IG5ldyBNZWRpYUZvcm1hdE1vZHVsZS5SZXNvbHV0aW9uKHIud2lkdGgsIHIuaGVpZ2h0KSk7XG4gICAgaWYgKG1lZGlhSW5mby52aWRlbyAmJiBtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycyAmJlxuICAgICAgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMucmVzb2x1dGlvbikge1xuICAgICAgcmVzb2x1dGlvbnMucHVzaChuZXcgTWVkaWFGb3JtYXRNb2R1bGUuUmVzb2x1dGlvbihcbiAgICAgICAgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMucmVzb2x1dGlvbi53aWR0aCxcbiAgICAgICAgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMucmVzb2x1dGlvbi5oZWlnaHQpKTtcbiAgICB9XG4gICAgcmVzb2x1dGlvbnMuc29ydChzb3J0UmVzb2x1dGlvbnMpO1xuICAgIGNvbnN0IGJpdHJhdGVzID0gQXJyYXkuZnJvbShcbiAgICAgIG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5wYXJhbWV0ZXJzLmJpdHJhdGUsXG4gICAgICBiaXRyYXRlID0+IGV4dHJhY3RCaXRyYXRlTXVsdGlwbGllcihiaXRyYXRlKSk7XG4gICAgYml0cmF0ZXMucHVzaCgxLjApO1xuICAgIGJpdHJhdGVzLnNvcnQoc29ydE51bWJlcnMpO1xuICAgIGNvbnN0IGZyYW1lUmF0ZXMgPSBKU09OLnBhcnNlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkobWVkaWFJbmZvLnZpZGVvLm9wdGlvbmFsLnBhcmFtZXRlcnMuZnJhbWVyYXRlKSk7XG4gICAgaWYgKG1lZGlhSW5mby52aWRlbyAmJiBtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycyAmJiBtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVyc1xuICAgICAgLmZyYW1lcmF0ZSkge1xuICAgICAgZnJhbWVSYXRlcy5wdXNoKG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLmZyYW1lcmF0ZSk7XG4gICAgfVxuICAgIGZyYW1lUmF0ZXMuc29ydChzb3J0TnVtYmVycyk7XG4gICAgY29uc3Qga2V5RnJhbWVJbnRlcnZhbHMgPSBKU09OLnBhcnNlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkobWVkaWFJbmZvLnZpZGVvLm9wdGlvbmFsLnBhcmFtZXRlcnMua2V5RnJhbWVJbnRlcnZhbCkpO1xuICAgIGlmIChtZWRpYUluZm8udmlkZW8gJiYgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMgJiYgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnNcbiAgICAgIC5rZXlGcmFtZUludGVydmFsKSB7XG4gICAgICBrZXlGcmFtZUludGVydmFscy5wdXNoKG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLmtleUZyYW1lSW50ZXJ2YWwpO1xuICAgIH1cbiAgICBrZXlGcmFtZUludGVydmFscy5zb3J0KHNvcnROdW1iZXJzKTtcbiAgICB2aWRlbyA9IG5ldyBTdWJzY3JpcHRpb25Nb2R1bGUuVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMoXG4gICAgICB2aWRlb0NvZGVjcywgcmVzb2x1dGlvbnMsIGZyYW1lUmF0ZXMsIGJpdHJhdGVzLCBrZXlGcmFtZUludGVydmFscyk7XG4gIH1cbiAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25Nb2R1bGUuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzKGF1ZGlvLCB2aWRlbyk7XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgTWVkaWFGb3JtYXRNb2R1bGUgZnJvbSAnLi4vYmFzZS9tZWRpYWZvcm1hdC5qcydcbmltcG9ydCAqIGFzIENvZGVjTW9kdWxlIGZyb20gJy4uL2Jhc2UvY29kZWMuanMnXG5pbXBvcnQgeyBFdmVudERpc3BhdGNoZXJ9IGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnXG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gKiBAbWVtYmVyT2YgT21zLkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgUmVwcmVzZW50cyB0aGUgYXVkaW8gY2FwYWJpbGl0eSBmb3Igc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMge1xuICBjb25zdHJ1Y3Rvcihjb2RlY3MpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48T21zLkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuQXVkaW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjcyA9IGNvZGVjcztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc1xuICogQG1lbWJlck9mIE9tcy5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIHZpZGVvIGNhcGFiaWxpdHkgZm9yIHN1YnNjcmlwdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIHtcbiAgY29uc3RydWN0b3IoY29kZWNzLCByZXNvbHV0aW9ucywgZnJhbWVSYXRlcywgYml0cmF0ZU11bHRpcGxpZXJzLFxuICAgIGtleUZyYW1lSW50ZXJ2YWxzKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7QXJyYXkuPE9tcy5CYXNlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzPn0gY29kZWNzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5jb2RlY3MgPSBjb2RlY3M7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7QXJyYXkuPE9tcy5CYXNlLlJlc29sdXRpb24+fSByZXNvbHV0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9ucyA9IHJlc29sdXRpb25zO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge0FycmF5LjxudW1iZXI+fSBmcmFtZVJhdGVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGVzID0gZnJhbWVSYXRlcztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48bnVtYmVyPn0gYml0cmF0ZU11bHRpcGxpZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5iaXRyYXRlTXVsdGlwbGllcnMgPSBiaXRyYXRlTXVsdGlwbGllcnM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7QXJyYXkuPG51bWJlcj59IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFscyA9IGtleUZyYW1lSW50ZXJ2YWxzO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmlwdGlvbkNhcGFiaWxpdGllc1xuICogQG1lbWJlck9mIE9tcy5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIGNhcGFiaWxpdHkgZm9yIHN1YnNjcmlwdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyB7XG4gIGNvbnN0cnVjdG9yKGF1ZGlvLCB2aWRlbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BdWRpb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc30gYXVkaW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5hdWRpbyA9IGF1ZGlvO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9WaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc30gdmlkZW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy52aWRlbyA9IHZpZGVvO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAqIEBtZW1iZXJPZiBPbXMuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBSZXByZXNlbnRzIHRoZSBhdWRpbyBjb25zdHJhaW50cyBmb3Igc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50cyB7XG4gIGNvbnN0cnVjdG9yKGNvZGVjcykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BcnJheS48T21zLkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuQXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIENvZGVjcyBhY2NlcHRlZC4gSWYgbm9uZSBvZiBgY29kZWNzYCBzdXBwb3J0ZWQgYnkgYm90aCBzaWRlcywgY29ubmVjdGlvbiBmYWlscy4gTGVhdmUgaXQgdW5kZWZpbmVkIHdpbGwgdXNlIGFsbCBwb3NzaWJsZSBjb2RlY3MuXG4gICAgICovXG4gICAgdGhpcy5jb2RlY3MgPSBjb2RlY3M7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICogQG1lbWJlck9mIE9tcy5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIHZpZGVvIGNvbnN0cmFpbnRzIGZvciBzdWJzY3JpcHRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvbkNvbnN0cmFpbnRzIHtcbiAgY29uc3RydWN0b3IoY29kZWNzLCByZXNvbHV0aW9uLCBmcmFtZVJhdGUsIGJpdHJhdGVNdWx0aXBsaWVyLFxuICAgIGtleUZyYW1lSW50ZXJ2YWwpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/QXJyYXkuPE9tcy5CYXNlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzPn0gY29kZWNzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAgICAgKiBAZGVzYyBDb2RlY3MgYWNjZXB0ZWQuIElmIG5vbmUgb2YgYGNvZGVjc2Agc3VwcG9ydGVkIGJ5IGJvdGggc2lkZXMsIGNvbm5lY3Rpb24gZmFpbHMuIExlYXZlIGl0IHVuZGVmaW5lZCB3aWxsIHVzZSBhbGwgcG9zc2libGUgY29kZWNzLlxuICAgICAqL1xuICAgIHRoaXMuY29kZWNzID0gY29kZWNzO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9PbXMuQmFzZS5SZXNvbHV0aW9ufSByZXNvbHV0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAgICAgKiBAZGVzYyBPbmx5IHJlc29sdXRpb25zIGxpc3RlZCBpbiBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLnJlc29sdXRpb24gPSByZXNvbHV0aW9uO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGZyYW1lUmF0ZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvbkNvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgT25seSBmcmFtZVJhdGVzIGxpc3RlZCBpbiBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLmZyYW1lUmF0ZSA9IGZyYW1lUmF0ZTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBiaXRyYXRlTXVsdGlwbGllclxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvbkNvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgT25seSBiaXRyYXRlTXVsdGlwbGllcnMgbGlzdGVkIGluIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMuYml0cmF0ZU11bHRpcGxpZXIgPSBiaXRyYXRlTXVsdGlwbGllcjtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBrZXlGcmFtZUludGVydmFsXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAgICAgKiBAZGVzYyBPbmx5IGtleUZyYW1lSW50ZXJ2YWxzIGxpc3RlZCBpbiBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLmtleUZyYW1lSW50ZXJ2YWwgPSBrZXlGcmFtZUludGVydmFsO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmliZU9wdGlvbnNcbiAqIEBtZW1iZXJPZiBPbXMuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBTdWJzY3JpYmVPcHRpb25zIGRlZmluZXMgb3B0aW9ucyBmb3Igc3Vic2NyaWJpbmcgYSBPbXMuQmFzZS5SZW1vdGVTdHJlYW0uXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmVPcHRpb25zIHtcbiAgY29uc3RydWN0b3IoYXVkaW8sIHZpZGVvKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P0F1ZGlvU3Vic2NyaXB0aW9uQ29uc3RyYWludHN9IGF1ZGlvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlN1YnNjcmliZU9wdGlvbnNcbiAgICAgKi9cbiAgICB0aGlzLmF1ZGlvID0gYXVkaW87XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P1ZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHN9IHZpZGVvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlN1YnNjcmliZU9wdGlvbnNcbiAgICAgKi9cbiAgICB0aGlzLnZpZGVvID0gdmlkZW87XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gKiBAbWVtYmVyT2YgT21zLkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIGRlZmluZXMgb3B0aW9ucyBmb3IgdXBkYXRpbmcgYSBzdWJzY3JpcHRpb24ncyB2aWRlbyBwYXJ0LlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P09tcy5CYXNlLlJlc29sdXRpb259IHJlc29sdXRpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gICAgICogQGRlc2MgT25seSByZXNvbHV0aW9ucyBsaXN0ZWQgaW4gVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGZyYW1lUmF0ZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gICAgICogQGRlc2MgT25seSBmcmFtZVJhdGVzIGxpc3RlZCBpbiBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLmZyYW1lUmF0ZSA9IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBiaXRyYXRlTXVsdGlwbGllcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gICAgICogQGRlc2MgT25seSBiaXRyYXRlTXVsdGlwbGllcnMgbGlzdGVkIGluIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMuYml0cmF0ZU11bHRpcGxpZXJzID0gdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9uc1xuICAgICAqIEBkZXNjIE9ubHkga2V5RnJhbWVJbnRlcnZhbHMgbGlzdGVkIGluIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMua2V5RnJhbWVJbnRlcnZhbCA9IHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBTdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gKiBAbWVtYmVyT2YgT21zLkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9ucyBkZWZpbmVzIG9wdGlvbnMgZm9yIHVwZGF0aW5nIGEgc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9ucyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9WaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnN9IHZpZGVvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAgICAgKi9cbiAgICB0aGlzLnZpZGVvID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmlwdGlvblxuICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFN1YnNjcmlwdGlvbiBpcyBhIHJlY2VpdmVyIGZvciByZWNlaXZpbmcgYSBzdHJlYW0uXG4gKiBFdmVudHM6XG4gKlxuICogfCBFdmVudCBOYW1lICAgICAgfCBBcmd1bWVudCBUeXBlICAgIHwgRmlyZWQgd2hlbiAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgZW5kZWQgICAgICAgICAgIHwgRXZlbnQgICAgICAgICAgICB8IFN1YnNjcmlwdGlvbiBpcyBlbmRlZC4gfFxuICogfCBtdXRlICAgICAgICAgICAgfCBNdXRlRXZlbnQgICAgICAgIHwgUHVibGljYXRpb24gaXMgbXV0ZWQuIFJlbW90ZSBzaWRlIHN0b3BwZWQgc2VuZGluZyBhdWRpbyBhbmQvb3IgdmlkZW8gZGF0YS4gfFxuICogfCB1bm11dGUgICAgICAgICAgfCBNdXRlRXZlbnQgICAgICAgIHwgUHVibGljYXRpb24gaXMgdW5tdXRlZC4gUmVtb3RlIHNpZGUgY29udGludWVkIHNlbmRpbmcgYXVkaW8gYW5kL29yIHZpZGVvIGRhdGEuIHxcbiAqXG4gKiBAZXh0ZW5kcyBPbXMuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbiBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKGlkLCBzdG9wLCBnZXRTdGF0cywgbXV0ZSwgdW5tdXRlLCBhcHBseU9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmICghaWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0lEIGNhbm5vdCBiZSBudWxsIG9yIHVuZGVmaW5lZC4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBpZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBpZFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBzdG9wXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCBjZXJ0YWluIHN1YnNjcmlwdGlvbi4gT25jZSBhIHN1YnNjcmlwdGlvbiBpcyBzdG9wcGVkLCBpdCBjYW5ub3QgYmUgcmVjb3ZlcmVkLlxuICAgICAqIEBtZW1iZXJvZiBPbXMuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25cbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIHRoaXMuc3RvcCA9IHN0b3A7XG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uIGdldFN0YXRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgR2V0IHN0YXRzIG9mIHVuZGVybHlpbmcgUGVlckNvbm5lY3Rpb24uXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFJUQ1N0YXRzUmVwb3J0LCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5nZXRTdGF0cyA9IGdldFN0YXRzO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBtdXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCByZWV2aW5nIGRhdGEgZnJvbSByZW1vdGUgZW5kcG9pbnQuXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEBwYXJhbSB7T21zLkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSBtdXRlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICAgKi9cbiAgICB0aGlzLm11dGUgPSBtdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiB1bm11dGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBDb250aW51ZSByZWV2aW5nIGRhdGEgZnJvbSByZW1vdGUgZW5kcG9pbnQuXG4gICAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEBwYXJhbSB7T21zLkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSB1bm11dGVkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHVuZGVmaW5lZCwgRXJyb3I+fVxuICAgICAqL1xuICAgIHRoaXMudW5tdXRlID0gdW5tdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBhcHBseU9wdGlvbnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBVcGRhdGUgc3Vic2NyaXB0aW9uIHdpdGggZ2l2ZW4gb3B0aW9ucy5cbiAgICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uXG4gICAgICogQHBhcmFtIHtPbXMuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIH0gb3B0aW9ucyBTdWJzY3JpcHRpb24gdXBkYXRlIG9wdGlvbnMuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dW5kZWZpbmVkLCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5hcHBseU9wdGlvbnMgPSBhcHBseU9wdGlvbnM7XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuL2Jhc2UvZXhwb3J0LmpzJ1xuaW1wb3J0ICogYXMgcDJwIGZyb20gJy4vcDJwL2V4cG9ydC5qcydcbmltcG9ydCAqIGFzIGNvbmZlcmVuY2UgZnJvbSAnLi9jb25mZXJlbmNlL2V4cG9ydC5qcydcblxuLyoqXG4gKiBCYXNlIG9iamVjdHMgZm9yIGJvdGggUDJQIGFuZCBjb25mZXJlbmNlLlxuICogQG5hbWVzcGFjZSBPbXMuQmFzZVxuICovXG5leHBvcnQgY29uc3QgQmFzZSA9IGJhc2U7XG5cbi8qKlxuICogUDJQIFdlYlJUQyBjb25uZWN0aW9ucy5cbiAqIEBuYW1lc3BhY2UgT21zLlAyUFxuICovXG5leHBvcnQgY29uc3QgUDJQID0gcDJwO1xuXG4vKipcbiAqIFdlYlJUQyBjb25uZWN0aW9ucyB3aXRoIGNvbmZlcmVuY2Ugc2VydmVyLlxuICogQG5hbWVzcGFjZSBPbXMuQ29uZmVyZW5jZVxuICovXG5leHBvcnQgY29uc3QgQ29uZmVyZW5jZSA9IGNvbmZlcmVuY2U7XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbmV4cG9ydCBjb25zdCBlcnJvcnMgPSB7XG4gIC8vIDIxMDAtMjk5OSBmb3IgUDJQIGVycm9yc1xuICAvLyAyMTAwLTIxOTkgZm9yIGNvbm5lY3Rpb24gZXJyb3JzXG4gIC8vIDIxMDAtMjEwOSBmb3Igc2VydmVyIGVycm9yc1xuICBQMlBfQ09OTl9TRVJWRVJfVU5LTk9XTjoge1xuICAgIGNvZGU6IDIxMDAsXG4gICAgbWVzc2FnZTogJ1NlcnZlciB1bmtub3duIGVycm9yLidcbiAgfSxcbiAgUDJQX0NPTk5fU0VSVkVSX1VOQVZBSUxBQkxFOiB7XG4gICAgY29kZTogMjEwMSxcbiAgICBtZXNzYWdlOiAnU2VydmVyIGlzIHVuYXZhbGlhYmxlLidcbiAgfSxcbiAgUDJQX0NPTk5fU0VSVkVSX0JVU1k6IHtcbiAgICBjb2RlOiAyMTAyLFxuICAgIG1lc3NhZ2U6ICdTZXJ2ZXIgaXMgdG9vIGJ1c3kuJ1xuICB9LFxuICBQMlBfQ09OTl9TRVJWRVJfTk9UX1NVUFBPUlRFRDoge1xuICAgIGNvZGU6IDIxMDMsXG4gICAgbWVzc2FnZTogJ01ldGhvZCBoYXMgbm90IGJlZW4gc3VwcG9ydGVkIGJ5IHNlcnZlci4nXG4gIH0sXG4gIC8vIDIxMTAtMjExOSBmb3IgY2xpZW50IGVycm9yc1xuICBQMlBfQ09OTl9DTElFTlRfVU5LTk9XTjoge1xuICAgIGNvZGU6IDIxMTAsXG4gICAgbWVzc2FnZTogJ0NsaWVudCB1bmtub3duIGVycm9yLidcbiAgfSxcbiAgUDJQX0NPTk5fQ0xJRU5UX05PVF9JTklUSUFMSVpFRDoge1xuICAgIGNvZGU6IDIxMTEsXG4gICAgbWVzc2FnZTogJ0Nvbm5lY3Rpb24gaXMgbm90IGluaXRpYWxpemVkLidcbiAgfSxcbiAgLy8gMjEyMC0yMTI5IGZvciBhdXRoZW50aWNhdGlvbiBlcnJvcnNcbiAgUDJQX0NPTk5fQVVUSF9VTktOT1dOOiB7XG4gICAgY29kZTogMjEyMCxcbiAgICBtZXNzYWdlOiAnQXV0aGVudGljYXRpb24gdW5rbm93biBlcnJvci4nXG4gIH0sXG4gIFAyUF9DT05OX0FVVEhfRkFJTEVEOiB7XG4gICAgY29kZTogMjEyMSxcbiAgICBtZXNzYWdlOiAnV3JvbmcgdXNlcm5hbWUgb3IgdG9rZW4uJ1xuICB9LFxuICAvLyAyMjAwLTIyOTkgZm9yIG1lc3NhZ2UgdHJhbnNwb3J0IGVycm9yc1xuICBQMlBfTUVTU0FHSU5HX1RBUkdFVF9VTlJFQUNIQUJMRToge1xuICAgIGNvZGU6IDIyMDEsXG4gICAgbWVzc2FnZTogJ1JlbW90ZSB1c2VyIGNhbm5vdCBiZSByZWFjaGVkLidcbiAgfSxcbiAgUDJQX0NMSUVOVF9ERU5JRUQ6IHtcbiAgICBjb2RlOiAyMjAyLFxuICAgIG1lc3NhZ2U6ICdVc2VyIGlzIGRlbmllZC4nXG4gIH0sXG4gIC8vIDIzMDEtMjM5OSBmb3IgY2hhdCByb29tIGVycm9yc1xuICAvLyAyNDAxLTI0OTkgZm9yIGNsaWVudCBlcnJvcnNcbiAgUDJQX0NMSUVOVF9VTktOT1dOOiB7XG4gICAgY29kZTogMjQwMCxcbiAgICBtZXNzYWdlOiAnVW5rbm93biBlcnJvcnMuJ1xuICB9LFxuICBQMlBfQ0xJRU5UX1VOU1VQUE9SVEVEX01FVEhPRDoge1xuICAgIGNvZGU6IDI0MDEsXG4gICAgbWVzc2FnZTogJ1RoaXMgbWV0aG9kIGlzIHVuc3VwcG9ydGVkIGluIGN1cnJlbnQgYnJvd3Nlci4nXG4gIH0sXG4gIFAyUF9DTElFTlRfSUxMRUdBTF9BUkdVTUVOVDoge1xuICAgIGNvZGU6IDI0MDIsXG4gICAgbWVzc2FnZTogJ0lsbGVnYWwgYXJndW1lbnQuJ1xuICB9LFxuICBQMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEU6IHtcbiAgICBjb2RlOiAyNDAzLFxuICAgIG1lc3NhZ2U6ICdJbnZhbGlkIHBlZXIgc3RhdGUuJ1xuICB9LFxuICBQMlBfQ0xJRU5UX05PVF9BTExPV0VEOiB7XG4gICAgY29kZTogMjQwNCxcbiAgICBtZXNzYWdlOiAnUmVtb3RlIHVzZXIgaXMgbm90IGFsbG93ZWQuJ1xuICB9LFxuICAvLyAyNTAxLTI1OTkgZm9yIFdlYlJUQyBlcnJvcy5cbiAgUDJQX1dFQlJUQ19VTktOT1dOOntcbiAgICBjb2RlOiAyNTAwLFxuICAgIG1lc3NhZ2U6ICdXZWJSVEMgZXJyb3IuJ1xuICB9LFxuICBQMlBfV0VCUlRDX1NEUDp7XG4gICAgY29kZToyNTAyLFxuICAgIG1lc3NhZ2U6ICdTRFAgZXJyb3IuJ1xuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXJyb3JCeUNvZGUoZXJyb3JDb2RlKSB7XG4gIGNvbnN0IGNvZGVFcnJvck1hcCA9IHtcbiAgICAyMTAwOiBlcnJvcnMuUDJQX0NPTk5fU0VSVkVSX1VOS05PV04sXG4gICAgMjEwMTogZXJyb3JzLlAyUF9DT05OX1NFUlZFUl9VTkFWQUlMQUJMRSxcbiAgICAyMTAyOiBlcnJvcnMuUDJQX0NPTk5fU0VSVkVSX0JVU1ksXG4gICAgMjEwMzogZXJyb3JzLlAyUF9DT05OX1NFUlZFUl9OT1RfU1VQUE9SVEVELFxuICAgIDIxMTA6IGVycm9ycy5QMlBfQ09OTl9DTElFTlRfVU5LTk9XTixcbiAgICAyMTExOiBlcnJvcnMuUDJQX0NPTk5fQ0xJRU5UX05PVF9JTklUSUFMSVpFRCxcbiAgICAyMTIwOiBlcnJvcnMuUDJQX0NPTk5fQVVUSF9VTktOT1dOLFxuICAgIDIxMjE6IGVycm9ycy5QMlBfQ09OTl9BVVRIX0ZBSUxFRCxcbiAgICAyMjAxOiBlcnJvcnMuUDJQX01FU1NBR0lOR19UQVJHRVRfVU5SRUFDSEFCTEUsXG4gICAgMjQwMDogZXJyb3JzLlAyUF9DTElFTlRfVU5LTk9XTixcbiAgICAyNDAxOiBlcnJvcnMuUDJQX0NMSUVOVF9VTlNVUFBPUlRFRF9NRVRIT0QsXG4gICAgMjQwMjogZXJyb3JzLlAyUF9DTElFTlRfSUxMRUdBTF9BUkdVTUVOVCxcbiAgICAyNDAzOiBlcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFLFxuICAgIDI0MDQ6IGVycm9ycy5QMlBfQ0xJRU5UX05PVF9BTExPV0VELFxuICAgIDI1MDA6IGVycm9ycy5QMlBfV0VCUlRDX1VOS05PV04sXG4gICAgMjUwMTogZXJyb3JzLlAyUF9XRUJSVENfU0RQXG4gIH07XG4gIHJldHVybiBjb2RlRXJyb3JNYXBbZXJyb3JDb2RlXTtcbn1cbmV4cG9ydCBjbGFzcyBQMlBFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZXJyb3IsIG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICBpZiAodHlwZW9mIGVycm9yID09PSAnbnVtYmVyJykge1xuICAgICAgdGhpcy5jb2RlID0gZXJyb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29kZSA9IGVycm9yLmNvZGU7XG4gICAgfVxuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBQMlBDbGllbnR9IGZyb20gJy4vcDJwY2xpZW50LmpzJ1xuZXhwb3J0IHtQMlBFcnJvcn0gZnJvbSAnLi9lcnJvci5qcydcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcyc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlciwgT21zRXZlbnR9IGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vYmFzZS91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBFcnJvck1vZHVsZSBmcm9tICcuL2Vycm9yLmpzJztcbmltcG9ydCBQMlBQZWVyQ29ubmVjdGlvbkNoYW5uZWwgZnJvbSAnLi9wZWVyY29ubmVjdGlvbi1jaGFubmVsLmpzJztcbmltcG9ydCAqIGFzIFN0cmVhbU1vZHVsZSBmcm9tICcuLi9iYXNlL3N0cmVhbS5qcyc7XG5cbmNvbnN0IENvbm5lY3Rpb25TdGF0ZSA9IHtcbiAgUkVBRFk6IDEsXG4gIENPTk5FQ1RJTkc6IDIsXG4gIENPTk5FQ1RFRDogM1xufTtcblxuY29uc3QgcGNEaXNjb25uZWN0VGltZW91dCA9IDE1MDAwOyAvLyBDbG9zZSBwZWVyY29ubmVjdGlvbiBhZnRlciBkaXNjb25uZWN0IDE1cy5sZXQgaXNDb25uZWN0ZWRUb1NpZ25hbGluZ0NoYW5uZWwgPSBmYWxzZTtcbmNvbnN0IG9mZmVyT3B0aW9ucyA9IHtcbiAgJ29mZmVyVG9SZWNlaXZlQXVkaW8nOiB0cnVlLFxuICAnb2ZmZXJUb1JlY2VpdmVWaWRlbyc6IHRydWVcbn07XG5jb25zdCBzeXNJbmZvID0gVXRpbHMuc3lzSW5mbygpO1xuY29uc3Qgc3VwcG9ydHNQbGFuQiA9IFV0aWxzLmlzU2FmYXJpKCkgPyB0cnVlIDogZmFsc2U7XG5jb25zdCBzdXBwb3J0c1VuaWZpZWRQbGFuID0gVXRpbHMuaXNTYWZhcmkoKSA/IGZhbHNlIDogdHJ1ZTtcbi8qKlxuICogQGZ1bmN0aW9uIGlzQXJyYXlcbiAqIEBkZXNjIFRlc3QgaWYgYW4gb2JqZWN0IGlzIGFuIGFycmF5LlxuICogQHJldHVybiB7Ym9vbGVhbn0gREVTQ1JJUFRJT05cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XScpO1xufVxuLypcbiAqIFJldHVybiBuZWdhdGl2ZSB2YWx1ZSBpZiBpZDE8aWQyLCBwb3NpdGl2ZSB2YWx1ZSBpZiBpZDE+aWQyXG4gKi9cbnZhciBjb21wYXJlSUQgPSBmdW5jdGlvbihpZDEsIGlkMikge1xuICByZXR1cm4gaWQxLmxvY2FsZUNvbXBhcmUoaWQyKTtcbn07XG4vLyBJZiB0YXJnZXRJZCBpcyBwZWVySWQsIHRoZW4gcmV0dXJuIHRhcmdldElkLlxudmFyIGdldFBlZXJJZCA9IGZ1bmN0aW9uKHRhcmdldElkKSB7XG4gIHJldHVybiB0YXJnZXRJZDtcbn07XG52YXIgY2hhbmdlTmVnb3RpYXRpb25TdGF0ZSA9IGZ1bmN0aW9uKHBlZXIsIHN0YXRlKSB7XG4gIHBlZXIubmVnb3RpYXRpb25TdGF0ZSA9IHN0YXRlO1xufTtcbi8vIERvIHN0b3AgY2hhdCBsb2NhbGx5LlxudmFyIHN0b3BDaGF0TG9jYWxseSA9IGZ1bmN0aW9uKHBlZXIsIG9yaWdpbmF0b3JJZCkge1xuICBpZiAocGVlci5zdGF0ZSA9PT0gUGVlclN0YXRlLkNPTk5FQ1RFRCB8fCBwZWVyLnN0YXRlID09PSBQZWVyU3RhdGUuQ09OTkVDVElORykge1xuICAgIGlmIChwZWVyLnNlbmREYXRhQ2hhbm5lbCkge1xuICAgICAgcGVlci5zZW5kRGF0YUNoYW5uZWwuY2xvc2UoKTtcbiAgICB9XG4gICAgaWYgKHBlZXIucmVjZWl2ZURhdGFDaGFubmVsKSB7XG4gICAgICBwZWVyLnJlY2VpdmVEYXRhQ2hhbm5lbC5jbG9zZSgpO1xuICAgIH1cbiAgICBpZiAocGVlci5jb25uZWN0aW9uICYmIHBlZXIuY29ubmVjdGlvbi5pY2VDb25uZWN0aW9uU3RhdGUgIT09ICdjbG9zZWQnKSB7XG4gICAgICBwZWVyLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB9XG4gICAgaWYgKHBlZXIuc3RhdGUgIT09IFBlZXJTdGF0ZS5SRUFEWSkge1xuICAgICAgcGVlci5zdGF0ZSA9IFBlZXJTdGF0ZS5SRUFEWTtcbiAgICAgIHRoYXQuZGlzcGF0Y2hFdmVudChuZXcgV29vZ2Vlbi5DaGF0RXZlbnQoe1xuICAgICAgICB0eXBlOiAnY2hhdC1zdG9wcGVkJyxcbiAgICAgICAgcGVlcklkOiBwZWVyLmlkLFxuICAgICAgICBzZW5kZXJJZDogb3JpZ2luYXRvcklkXG4gICAgICB9KSk7XG4gICAgfVxuICAgIC8vIFVuYmluZCBldmVudHMgZm9yIHRoZSBwYywgc28gdGhlIG9sZCBwYyB3aWxsIG5vdCBpbXBhY3QgbmV3IHBlZXJjb25uZWN0aW9ucyBjcmVhdGVkIGZvciB0aGUgc2FtZSB0YXJnZXQgbGF0ZXIuXG4gICAgdW5iaW5kRXZldHNUb1BlZXJDb25uZWN0aW9uKHBlZXIuY29ubmVjdGlvbik7XG4gIH1cbn07XG5cbi8qKlxuICogQGNsYXNzIFAyUENsaWVudENvbmZpZ3VyYXRpb25cbiAqIEBjbGFzc0Rlc2MgQ29uZmlndXJhdGlvbiBmb3IgUDJQQ2xpZW50LlxuICogQG1lbWJlck9mIE9tcy5QMlBcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY29uc3QgUDJQQ2xpZW50Q29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogQG1lbWJlciB7P0FycmF5PE9tcy5CYXNlLkF1ZGlvRW5jb2RpbmdQYXJhbWV0ZXJzPn0gYXVkaW9FbmNvZGluZ1xuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgRW5jb2RpbmcgcGFyYW1ldGVycyBmb3IgcHVibGlzaGluZyBhdWRpbyB0cmFja3MuXG4gICAqIEBtZW1iZXJvZiBPbXMuUDJQLlAyUENsaWVudENvbmZpZ3VyYXRpb25cbiAgICovXG4gIHRoaXMuYXVkaW9FbmNvZGluZyA9IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIEBtZW1iZXIgez9BcnJheTxPbXMuQmFzZS5WaWRlb0VuY29kaW5nUGFyYW1ldGVycz59IHZpZGVvRW5jb2RpbmdcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIEVuY29kaW5nIHBhcmFtZXRlcnMgZm9yIHB1Ymxpc2hpbmcgdmlkZW8gdHJhY2tzLlxuICAgKiBAbWVtYmVyb2YgT21zLlAyUC5QMlBDbGllbnRDb25maWd1cmF0aW9uXG4gICAqL1xuICB0aGlzLnZpZGVvRW5jb2RpbmcgPSB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBAbWVtYmVyIHs/UlRDQ29uZmlndXJhdGlvbn0gcnRjQ29uZmlndXJhdGlvblxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIE9tcy5QMlAuUDJQQ2xpZW50Q29uZmlndXJhdGlvblxuICAgKiBAZGVzYyBJdCB3aWxsIGJlIHVzZWQgZm9yIGNyZWF0aW5nIFBlZXJDb25uZWN0aW9uLlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvd2VicnRjLyNydGNjb25maWd1cmF0aW9uLWRpY3Rpb25hcnl8UlRDQ29uZmlndXJhdGlvbiBEaWN0aW9uYXJ5IG9mIFdlYlJUQyAxLjB9LlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBGb2xsb3dpbmcgb2JqZWN0IGNhbiBiZSBzZXQgdG8gcDJwQ2xpZW50Q29uZmlndXJhdGlvbi5ydGNDb25maWd1cmF0aW9uLlxuICAgKiB7XG4gICAqICAgaWNlU2VydmVyczogW3tcbiAgICogICAgICB1cmxzOiBcInN0dW46ZXhhbXBsZS5jb206MzQ3OFwiXG4gICAqICAgfSwge1xuICAgKiAgICAgdXJsczogW1xuICAgKiAgICAgICBcInR1cm46ZXhhbXBsZS5jb206MzQ3OD90cmFuc3BvcnQ9dWRwXCIsXG4gICAqICAgICAgIFwidHVybjpleGFtcGxlLmNvbTozNDc4P3RyYW5zcG9ydD10Y3BcIlxuICAgKiAgICAgXSxcbiAgICogICAgICBjcmVkZW50aWFsOiBcInBhc3N3b3JkXCIsXG4gICAqICAgICAgdXNlcm5hbWU6IFwidXNlcm5hbWVcIlxuICAgKiAgIH1cbiAgICogfVxuICAgKi9cbiAgdGhpcy5ydGNDb25maWd1cmF0aW9uID0gdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBAY2xhc3MgUDJQQ2xpZW50XG4gKiBAY2xhc3NEZXNjIFRoZSBQMlBDbGllbnQgaGFuZGxlcyBQZWVyQ29ubmVjdGlvbnMgYmV0d2VlbiBkaWZmZXJlbnQgY2xpZW50cy5cbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICAgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBzdHJlYW1hZGRlZCAgICAgICAgICAgfCBTdHJlYW1FdmVudCAgICAgIHwgQSBuZXcgc3RyZWFtIGlzIHNlbnQgZnJvbSByZW1vdGUgZW5kcG9pbnQuIHxcbiAqIHwgbWVzc2FnZXJlY2VpdmVkICAgICAgIHwgTWVzc2FnZUV2ZW50ICAgICB8IEEgbmV3IG1lc3NhZ2UgaXMgcmVjZWl2ZWQuIHxcbiAqIHwgc2VydmVyZGlzY29ubmVjdGVkICAgIHwgT21zRXZlbnQgICAgICAgICB8IERpc2Nvbm5lY3RlZCBmcm9tIHNpZ25hbGluZyBzZXJ2ZXIuIHxcbiAqXG4gKiBAbWVtYmVyb2YgT21zLlAyUFxuICogQGV4dGVuZHMgT21zLkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P09tcy5QMlAuUDJQQ2xpZW50Q29uZmlndXJhdGlvbiB9IGNvbmZpZyBDb25maWd1cmF0aW9uIGZvciBQMlBDbGllbnQuXG4gKi9cbmNvbnN0IFAyUENsaWVudCA9IGZ1bmN0aW9uKGNvbmZpZ3VyYXRpb24sIHNpZ25hbGluZ0NoYW5uZWwpIHtcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIG5ldyBFdmVudERpc3BhdGNoZXIoKSk7XG4gIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ3VyYXRpb247XG4gIGNvbnN0IHNpZ25hbGluZyA9IHNpZ25hbGluZ0NoYW5uZWw7XG4gIGNvbnN0IGNoYW5uZWxzID0gbmV3IE1hcCgpOyAvLyBNYXAgb2YgUGVlckNvbm5lY3Rpb25DaGFubmVscy5cbiAgY29uc3Qgc2VsZj10aGlzO1xuICBsZXQgc3RhdGUgPSBDb25uZWN0aW9uU3RhdGUuUkVBRFk7XG4gIGxldCBteUlkO1xuXG4gIHNpZ25hbGluZy5vbk1lc3NhZ2UgPSBmdW5jdGlvbihvcmlnaW4sIG1lc3NhZ2UpIHtcbiAgICBMb2dnZXIuZGVidWcoJ1JlY2VpdmVkIHNpZ25hbGluZyBtZXNzYWdlIGZyb20gJyArIG9yaWdpbiArICc6ICcgKyBtZXNzYWdlKTtcbiAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcbiAgICBpZiAoZGF0YS50eXBlID09PSAnY2hhdC1jbG9zZWQnKSB7XG4gICAgICBpZiAoY2hhbm5lbHMuaGFzKG9yaWdpbikpIHtcbiAgICAgICAgZ2V0T3JDcmVhdGVDaGFubmVsKG9yaWdpbikub25NZXNzYWdlKGRhdGEpO1xuICAgICAgICBjaGFubmVscy5kZWxldGUob3JpZ2luKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNlbGYuYWxsb3dlZFJlbW90ZUlkcy5pbmRleE9mKG9yaWdpbikgPj0gMCkge1xuICAgICAgZ2V0T3JDcmVhdGVDaGFubmVsKG9yaWdpbikub25NZXNzYWdlKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kU2lnbmFsaW5nTWVzc2FnZShvcmlnaW4sICdjaGF0LWNsb3NlZCcsIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0RFTklFRCk7XG4gICAgfVxuICB9O1xuXG4gIHNpZ25hbGluZy5vblNlcnZlckRpc2Nvbm5lY3RlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlID0gQ29ubmVjdGlvblN0YXRlLlJFQURZO1xuICAgIHNlbGYuZGlzcGF0Y2hFdmVudChuZXcgT21zRXZlbnQoJ3NlcnZlcmRpc2Nvbm5lY3RlZCcpKTtcbiAgfTtcblxuICAvKipcbiAgICogQG1lbWJlciB7YXJyYXl9IGFsbG93ZWRSZW1vdGVJZHNcbiAgICogQG1lbWJlcm9mIE9tcy5QMlAuUDJQQ2xpZW50XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBPbmx5IGFsbG93ZWQgcmVtb3RlIGVuZHBvaW50IElEcyBhcmUgYWJsZSB0byBwdWJsaXNoIHN0cmVhbSBvciBzZW5kIG1lc3NhZ2UgdG8gY3VycmVudCBlbmRwb2ludC4gUmVtb3ZpbmcgYW4gSUQgZnJvbSBhbGxvd2VkUmVtb3RlSWRzIGRvZXMgc3RvcCBleGlzdGluZyBjb25uZWN0aW9uIHdpdGggY2VydGFpbiBlbmRwb2ludC4gUGxlYXNlIGNhbGwgc3RvcCB0byBzdG9wIHRoZSBQZWVyQ29ubmVjdGlvbi5cbiAgICovXG4gIHRoaXMuYWxsb3dlZFJlbW90ZUlkcz1bXTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGNvbm5lY3RcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIENvbm5lY3QgdG8gc2lnbmFsaW5nIHNlcnZlci4gU2luY2Ugc2lnbmFsaW5nIGNhbiBiZSBjdXN0b21pemVkLCB0aGlzIG1ldGhvZCBkb2VzIG5vdCBkZWZpbmUgaG93IGEgdG9rZW4gbG9va3MgbGlrZS4gU0RLIHBhc3NlcyB0b2tlbiB0byBzaWduYWxpbmcgY2hhbm5lbCB3aXRob3V0IGNoYW5nZXMuXG4gICAqIEBtZW1iZXJvZiBPbXMuUDJQLlAyUENsaWVudFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxvYmplY3QsIEVycm9yPn0gSXQgcmV0dXJucyBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCBhbiBvYmplY3QgcmV0dXJuZWQgYnkgc2lnbmFsaW5nIGNoYW5uZWwgb25jZSBzaWduYWxpbmcgY2hhbm5lbCByZXBvcnRzIGNvbm5lY3Rpb24gaGFzIGJlZW4gZXN0YWJsaXNoZWQuXG4gICAqL1xuICB0aGlzLmNvbm5lY3QgPSBmdW5jdGlvbih0b2tlbikge1xuICAgIGlmIChzdGF0ZSA9PT0gQ29ubmVjdGlvblN0YXRlLlJFQURZKSB7XG4gICAgICBzdGF0ZSA9IENvbm5lY3Rpb25TdGF0ZS5DT05ORUNUSU5HO1xuICAgIH0gZWxzZSB7XG4gICAgICBMb2dnZXIud2FybmluZygnSW52YWxpZCBjb25uZWN0aW9uIHN0YXRlOiAnICsgc3RhdGUpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzaWduYWxpbmcuY29ubmVjdCh0b2tlbikudGhlbigoaWQpID0+IHtcbiAgICAgICAgbXlJZCA9IGlkO1xuICAgICAgICBzdGF0ZSA9IENvbm5lY3Rpb25TdGF0ZS5DT05ORUNURUQ7XG4gICAgICAgIHJlc29sdmUobXlJZCk7XG4gICAgICB9LCAoZXJyQ29kZSkgPT4ge1xuICAgICAgICByZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmdldEVycm9yQnlDb2RlKFxuICAgICAgICAgIGVyckNvZGUpKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGRpc2Nvbm5lY3RcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIERpc2Nvbm5lY3QgZnJvbSB0aGUgc2lnbmFsaW5nIGNoYW5uZWwuIEl0IHN0b3BzIGFsbCBleGlzdGluZyBzZXNzaW9ucyB3aXRoIHJlbW90ZSBlbmRwb2ludHMuXG4gICAqIEBtZW1iZXJvZiBPbXMuUDJQLlAyUENsaWVudFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICovXG4gIHRoaXMuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdGF0ZSA9PSBDb25uZWN0aW9uU3RhdGUuUkVBRFkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hhbm5lbHMuZm9yRWFjaCgoY2hhbm5lbCk9PntcbiAgICAgIGNoYW5uZWwuc3RvcCgpO1xuICAgIH0pO1xuICAgIGNoYW5uZWxzLmNsZWFyKCk7XG4gICAgc2lnbmFsaW5nLmRpc2Nvbm5lY3QoKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHB1Ymxpc2hcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIFB1Ymxpc2ggYSBzdHJlYW0gdG8gYSByZW1vdGUgZW5kcG9pbnQuXG4gICAqIEBtZW1iZXJvZiBPbXMuUDJQLlAyUENsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlSWQgUmVtb3RlIGVuZHBvaW50J3MgSUQuXG4gICAqIEBwYXJhbSB7TG9jYWxTdHJlYW19IHN0cmVhbSBBIExvY2FsU3RyZWFtIHRvIGJlIHB1Ymxpc2hlZC5cbiAgICogQHJldHVybnMge1Byb21pc2U8UHVibGljYXRpb24sIEVycm9yPn0gQSBwcm9taXNlZCByZXNvbHZlZCB3aGVuIHJlbW90ZSBzaWRlIHJlY2VpdmVkIHRoZSBjZXJ0YWluIHN0cmVhbS4gSG93ZXZlciwgcmVtb3RlIGVuZHBvaW50IG1heSBub3QgZGlzcGxheSB0aGlzIHN0cmVhbSwgb3IgaWdub3JlIGl0LlxuICAgKi9cbiAgdGhpcy5wdWJsaXNoID0gZnVuY3Rpb24ocmVtb3RlSWQsIHN0cmVhbSkge1xuICAgIGlmIChzdGF0ZSAhPT0gQ29ubmVjdGlvblN0YXRlLkNPTk5FQ1RFRCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFLFxuICAgICAgICAnUDJQIENsaWVudCBpcyBub3QgY29ubmVjdGVkIHRvIHNpZ25hbGluZyBjaGFubmVsLicpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYWxsb3dlZFJlbW90ZUlkcy5pbmRleE9mKHJlbW90ZUlkKSA8IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfTk9UX0FMTE9XRUQpKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShnZXRPckNyZWF0ZUNoYW5uZWwocmVtb3RlSWQpLnB1Ymxpc2goc3RyZWFtKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBzZW5kXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBTZW5kIGEgbWVzc2FnZSB0byByZW1vdGUgZW5kcG9pbnQuXG4gICAqIEBtZW1iZXJvZiBPbXMuUDJQLlAyUENsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlSWQgUmVtb3RlIGVuZHBvaW50J3MgSUQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIE1lc3NhZ2UgdG8gYmUgc2VudC4gSXQgc2hvdWxkIGJlIGEgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn0gSXQgcmV0dXJucyBhIHByb21pc2UgcmVzb2x2ZWQgd2hlbiByZW1vdGUgZW5kcG9pbnQgcmVjZWl2ZWQgY2VydGFpbiBtZXNzYWdlLlxuICAgKi9cbiAgdGhpcy5zZW5kPWZ1bmN0aW9uKHJlbW90ZUlkLCBtZXNzYWdlKXtcbiAgICBpZiAoc3RhdGUgIT09IENvbm5lY3Rpb25TdGF0ZS5DT05ORUNURUQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSxcbiAgICAgICAgJ1AyUCBDbGllbnQgaXMgbm90IGNvbm5lY3RlZCB0byBzaWduYWxpbmcgY2hhbm5lbC4nKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmFsbG93ZWRSZW1vdGVJZHMuaW5kZXhPZihyZW1vdGVJZCkgPCAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX05PVF9BTExPV0VEKSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZ2V0T3JDcmVhdGVDaGFubmVsKHJlbW90ZUlkKS5zZW5kKG1lc3NhZ2UpKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHN0b3BcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIENsZWFuIGFsbCByZXNvdXJjZXMgYXNzb2NpYXRlZCB3aXRoIGdpdmVuIHJlbW90ZSBlbmRwb2ludC4gSXQgbWF5IGluY2x1ZGUgUlRDUGVlckNvbm5lY3Rpb24sIFJUQ1J0cFRyYW5zY2VpdmVyIGFuZCBSVENEYXRhQ2hhbm5lbC4gSXQgc3RpbGwgcG9zc2libGUgdG8gcHVibGlzaCBhIHN0cmVhbSwgb3Igc2VuZCBhIG1lc3NhZ2UgdG8gZ2l2ZW4gcmVtb3RlIGVuZHBvaW50IGFmdGVyIHN0b3AuXG4gICAqIEBtZW1iZXJvZiBPbXMuUDJQLlAyUENsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlSWQgUmVtb3RlIGVuZHBvaW50J3MgSUQuXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqL1xuICB0aGlzLnN0b3AgPSBmdW5jdGlvbihyZW1vdGVJZCkge1xuICAgIGlmICghY2hhbm5lbHMuaGFzKHJlbW90ZUlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICdObyBQZWVyQ29ubmVjdGlvbiBiZXR3ZWVuIGN1cnJlbnQgZW5kcG9pbnQgYW5kIHNwZWNpZmljIHJlbW90ZSBlbmRwb2ludC4nXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaGFubmVscy5nZXQocmVtb3RlSWQpLnN0b3AoKTtcbiAgICBjaGFubmVscy5kZWxldGUocmVtb3RlSWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gZ2V0U3RhdHNcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIEdldCBzdGF0cyBvZiB1bmRlcmx5aW5nIFBlZXJDb25uZWN0aW9uLlxuICAgKiBAbWVtYmVyb2YgT21zLlAyUC5QMlBDbGllbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbW90ZUlkIFJlbW90ZSBlbmRwb2ludCdzIElELlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSVENTdGF0c1JlcG9ydCwgRXJyb3I+fSBJdCByZXR1cm5zIGEgcHJvbWlzZSByZXNvbHZlZCB3aXRoIGFuIFJUQ1N0YXRzUmVwb3J0IG9yIHJlamVjdCB3aXRoIGFuIEVycm9yIGlmIHRoZXJlIGlzIG5vIGNvbm5lY3Rpb24gd2l0aCBzcGVjaWZpYyB1c2VyLlxuICAgKi9cbiAgdGhpcy5nZXRTdGF0cyA9IGZ1bmN0aW9uKHJlbW90ZUlkKXtcbiAgICBpZighY2hhbm5lbHMuaGFzKHJlbW90ZUlkKSl7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUsJ05vIFBlZXJDb25uZWN0aW9uIGJldHdlZW4gY3VycmVudCBlbmRwb2ludCBhbmQgc3BlY2lmaWMgcmVtb3RlIGVuZHBvaW50LicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYW5uZWxzLmdldChyZW1vdGVJZCkuZ2V0U3RhdHMoKTtcbiAgfVxuXG4gIGNvbnN0IHNlbmRTaWduYWxpbmdNZXNzYWdlID0gZnVuY3Rpb24ocmVtb3RlSWQsIHR5cGUsIG1lc3NhZ2UpIHtcbiAgICBjb25zdCBtc2cgPSB7XG4gICAgICB0eXBlOiB0eXBlXG4gICAgfTtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgbXNnLmRhdGEgPSBtZXNzYWdlO1xuICAgIH1cbiAgICByZXR1cm4gc2lnbmFsaW5nLnNlbmQocmVtb3RlSWQsIEpTT04uc3RyaW5naWZ5KG1zZykpLmNhdGNoKGUgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBlID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aHJvdyBFcnJvck1vZHVsZS5nZXRFcnJvckJ5Q29kZShlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBnZXRPckNyZWF0ZUNoYW5uZWwgPSBmdW5jdGlvbihyZW1vdGVJZCkge1xuICAgIGlmICghY2hhbm5lbHMuaGFzKHJlbW90ZUlkKSkge1xuICAgICAgLy8gQ29uc3RydWN0IGFuIHNpZ25hbGluZyBzZW5kZXIvcmVjZWl2ZXIgZm9yIFAyUFBlZXJDb25uZWN0aW9uLlxuICAgICAgY29uc3Qgc2lnbmFsaW5nRm9yQ2hhbm5lbCA9IE9iamVjdC5jcmVhdGUoRXZlbnREaXNwYXRjaGVyKTtcbiAgICAgIHNpZ25hbGluZ0ZvckNoYW5uZWwuc2VuZFNpZ25hbGluZ01lc3NhZ2UgPSBzZW5kU2lnbmFsaW5nTWVzc2FnZTtcbiAgICAgIGNvbnN0IHBjYyA9IG5ldyBQMlBQZWVyQ29ubmVjdGlvbkNoYW5uZWwoY29uZmlnLCBteUlkLCByZW1vdGVJZCxcbiAgICAgICAgc2lnbmFsaW5nRm9yQ2hhbm5lbCk7XG4gICAgICBwY2MuYWRkRXZlbnRMaXN0ZW5lcignc3RyZWFtYWRkZWQnLCAoc3RyZWFtRXZlbnQpPT57XG4gICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gICAgICB9KTtcbiAgICAgIHBjYy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlcmVjZWl2ZWQnLCAobWVzc2FnZUV2ZW50KT0+e1xuICAgICAgICBzZWxmLmRpc3BhdGNoRXZlbnQobWVzc2FnZUV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgcGNjLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCk9PntcbiAgICAgICAgY2hhbm5lbHMuZGVsZXRlKHJlbW90ZUlkKTtcbiAgICAgIH0pXG4gICAgICBjaGFubmVscy5zZXQocmVtb3RlSWQsIHBjYyk7XG4gICAgfVxuICAgIHJldHVybiBjaGFubmVscy5nZXQocmVtb3RlSWQpO1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUDJQQ2xpZW50O1xuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vYmFzZS9sb2dnZXIuanMnO1xuaW1wb3J0IHtFdmVudERpc3BhdGNoZXIsIE1lc3NhZ2VFdmVudCwgT21zRXZlbnR9IGZyb20gJy4uL2Jhc2UvZXZlbnQuanMnO1xuaW1wb3J0IHtQdWJsaWNhdGlvbn0gZnJvbSAnLi4vYmFzZS9wdWJsaWNhdGlvbi5qcyc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuLi9iYXNlL3V0aWxzLmpzJztcbmltcG9ydCAqIGFzIEVycm9yTW9kdWxlIGZyb20gJy4vZXJyb3IuanMnO1xuaW1wb3J0ICogYXMgU3RyZWFtTW9kdWxlIGZyb20gJy4uL2Jhc2Uvc3RyZWFtLmpzJztcbmltcG9ydCAqIGFzIFNkcFV0aWxzIGZyb20gJy4uL2Jhc2Uvc2RwdXRpbHMuanMnO1xuXG4vKlxuICBFdmVudCBmb3IgU3RyZWFtLlxuKi9cbmV4cG9ydCBjbGFzcyBQMlBQZWVyQ29ubmVjdGlvbkNoYW5uZWxFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgY29uc3RydWN0b3IoaW5pdCkge1xuICAgIHN1cGVyKGluaXQpO1xuICAgIHRoaXMuc3RyZWFtID0gaW5pdC5zdHJlYW07XG4gIH1cbn1cblxuY29uc3QgRGF0YUNoYW5uZWxMYWJlbCA9IHtcbiAgTUVTU0FHRTogJ21lc3NhZ2UnLFxuICBGSUxFOiAnZmlsZSdcbn07XG5cbmNvbnN0IFNpZ25hbGluZ1R5cGUgPSB7XG4gIERFTklFRDogJ2NoYXQtZGVuaWVkJyxcbiAgQ0xPU0VEOiAnY2hhdC1jbG9zZWQnLFxuICBORUdPVElBVElPTl9ORUVERUQ6J2NoYXQtbmVnb3RpYXRpb24tbmVlZGVkJyxcbiAgVFJBQ0tfU09VUkNFUzogJ2NoYXQtdHJhY2stc291cmNlcycsXG4gIFNUUkVBTV9JTkZPOiAnY2hhdC1zdHJlYW0taW5mbycsXG4gIFNEUDogJ2NoYXQtc2lnbmFsJyxcbiAgVFJBQ0tTX0FEREVEOiAnY2hhdC10cmFja3MtYWRkZWQnLFxuICBUUkFDS1NfUkVNT1ZFRDogJ2NoYXQtdHJhY2tzLXJlbW92ZWQnLFxuICBEQVRBX1JFQ0VJVkVEOiAnY2hhdC1kYXRhLXJlY2VpdmVkJyxcbiAgVUE6ICdjaGF0LXVhJ1xufVxuXG5jb25zdCBvZmZlck9wdGlvbnMgPSB7XG4gICdvZmZlclRvUmVjZWl2ZUF1ZGlvJzogdHJ1ZSxcbiAgJ29mZmVyVG9SZWNlaXZlVmlkZW8nOiB0cnVlXG59O1xuXG5jb25zdCBzeXNJbmZvID0gVXRpbHMuc3lzSW5mbygpO1xuXG5jbGFzcyBQMlBQZWVyQ29ubmVjdGlvbkNoYW5uZWwgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICAvLyB8c2lnbmFsaW5nfCBpcyBhbiBvYmplY3QgaGFzIGEgbWV0aG9kIHxzZW5kU2lnbmFsaW5nTWVzc2FnZXwuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgbG9jYWxJZCwgcmVtb3RlSWQsIHNpZ25hbGluZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuX2xvY2FsSWQgPSBsb2NhbElkO1xuICAgIHRoaXMuX3JlbW90ZUlkID0gcmVtb3RlSWQ7XG4gICAgdGhpcy5fc2lnbmFsaW5nID0gc2lnbmFsaW5nO1xuICAgIHRoaXMuX3BjID0gbnVsbDtcbiAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1zID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgc3RyZWFtcyBwdWJsaXNoZWQsIHZhbHVlIGlzIGl0cyBwdWJsaWNhdGlvbi5cbiAgICB0aGlzLl9wZW5kaW5nU3RyZWFtcyA9IFtdOyAvLyBTdHJlYW1zIGdvaW5nIHRvIGJlIGFkZGVkIHRvIFBlZXJDb25uZWN0aW9uLlxuICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1zID0gW107IC8vIFN0cmVhbXMgaGF2ZSBiZWVuIGFkZGVkIHRvIFBlZXJDb25uZWN0aW9uLCBidXQgZG9lcyBub3QgcmVjZWl2ZSBhY2sgZnJvbSByZW1vdGUgc2lkZS5cbiAgICB0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtcyA9IFtdOyAgLy8gU3RyZWFtcyBnb2luZyB0byBiZSByZW1vdmVkLlxuICAgIC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBvYmplY3Qge3NvdXJjZTp7YXVkaW86c3RyaW5nLCB2aWRlbzpzdHJpbmd9LCBhdHRyaWJ1dGVzOiBvYmplY3QsIHN0cmVhbTogUmVtb3RlU3RyZWFtLCBtZWRpYVN0cmVhbTogTWVkaWFTdHJlYW19LiBgc3RyZWFtYCBhbmQgYG1lZGlhU3RyZWFtYCB3aWxsIGJlIHNldCB3aGVuIGB0cmFja2AgZXZlbnQgaXMgZmlyZWQgb24gYFJUQ1BlZXJDb25uZWN0aW9uYC4gYG1lZGlhU3RyZWFtYCB3aWxsIGJlIGBudWxsYCBhZnRlciBgc3RyZWFtYWRkZWRgIGV2ZW50IGlzIGZpcmVkIG9uIGBQMlBDbGllbnRgLiBPdGhlciBwcm9wZXJ0ZXMgd2lsbCBiZSBzZXQgdXBvbiBgU1RSRUFNX0lORk9gIGV2ZW50IGZyb20gc2lnbmFsaW5nIGNoYW5uZWwuXG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtSW5mbyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9yZW1vdGVTdHJlYW1zID0gW107XG4gICAgdGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW1UcmFjaydzIElELCB2YWx1ZSBpcyBzb3VyY2UgaW5mby5cbiAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZXMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBvYmplY3QgaGFzIHxyZXNvbHZlfCBhbmQgfHJlamVjdHwuXG4gICAgdGhpcy5fdW5wdWJsaXNoUHJvbWlzZXMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBvYmplY3QgaGFzIHxyZXNvbHZlfCBhbmQgfHJlamVjdHwuXG4gICAgdGhpcy5fcHVibGlzaGluZ1N0cmVhbVRyYWNrcyA9IG5ldyBNYXAoKTsgIC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBhcnJheSBvZiB0aGUgSUQgb2YgaXRzIE1lZGlhU3RyZWFtVHJhY2tzIHRoYXQgaGF2ZW4ndCBiZWVuIGFja2VkLlxuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbVRyYWNrcyA9IG5ldyBNYXAoKTsgIC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBhcnJheSBvZiB0aGUgSUQgb2YgaXRzIE1lZGlhU3RyZWFtVHJhY2tzIHRoYXQgaGF2ZW4ndCBiZWVuIHJlbW92ZWQuXG4gICAgdGhpcy5faXNOZWdvdGlhdGlvbk5lZWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX25lZ290aWF0aW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUmVtb3ZlU3RyZWFtID0gdHJ1ZTtcbiAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNQbGFuQiA9IHRydWU7XG4gICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzVW5pZmllZFBsYW4gPSB0cnVlO1xuICAgIHRoaXMuX3JlbW90ZUljZUNhbmRpZGF0ZXMgPSBbXTtcbiAgICB0aGlzLl9kYXRhQ2hhbm5lbHMgPSBuZXcgTWFwKCk7ICAvLyBLZXkgaXMgZGF0YSBjaGFubmVsJ3MgbGFiZWwsIHZhbHVlIGlzIGEgUlRDRGF0YUNoYW5uZWwuXG4gICAgdGhpcy5fcGVuZGluZ01lc3NhZ2VzID0gW107XG4gICAgdGhpcy5fZGF0YVNlcSA9IDE7ICAvLyBTZXF1ZW5jZSBudW1iZXIgZm9yIGRhdGEgY2hhbm5lbCBtZXNzYWdlcy5cbiAgICB0aGlzLl9zZW5kRGF0YVByb21pc2VzID0gbmV3IE1hcCgpOyAgLy8gS2V5IGlzIGRhdGEgc2VxdWVuY2UgbnVtYmVyLCB2YWx1ZSBpcyBhbiBvYmplY3QgaGFzIHxyZXNvbHZlfCBhbmQgfHJlamVjdHwuXG4gICAgdGhpcy5fYWRkZWRUcmFja0lkcyA9IFtdOyAvLyBUcmFja3MgdGhhdCBoYXZlIGJlZW4gYWRkZWQgYWZ0ZXIgcmVjZWl2aW5nIHJlbW90ZSBTRFAgYnV0IGJlZm9yZSBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLiBEcmFpbmluZyB0aGVzZSBtZXNzYWdlcyB3aGVuIElDRSBjb25uZWN0aW9uIHN0YXRlIGlzIGNvbm5lY3RlZC5cbiAgICB0aGlzLl9pc0NhbGxlciA9IHRydWU7XG4gICAgdGhpcy5faW5mb1NlbnQgPSBmYWxzZTtcbiAgICB0aGlzLl9kaXNwb3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2NyZWF0ZVBlZXJDb25uZWN0aW9uKCk7XG4gIH1cblxuICBwdWJsaXNoKHN0cmVhbSkge1xuICAgIGlmICghKHN0cmVhbSBpbnN0YW5jZW9mIFN0cmVhbU1vZHVsZS5Mb2NhbFN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHN0cmVhbS4nKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9wdWJsaXNoZWRTdHJlYW1zLmhhcyhzdHJlYW0pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQsXG4gICAgICAgICdEdXBsaWNhdGVkIHN0cmVhbS4nKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9hcmVBbGxUcmFja3NFbmRlZChzdHJlYW0ubWVkaWFTdHJlYW0pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUsXG4gICAgICAgICdBbGwgdHJhY2tzIGFyZSBlbmRlZC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5fc2VuZENsb3NlZE1zZ0lmTmVjZXNzYXJ5KCksIHRoaXMuX3NlbmRTeXNJbmZvSWZOZWNlc3NhcnkoKSwgdGhpcy5fc2VuZFN0cmVhbUluZm8oc3RyZWFtKV0pLnRoZW4oXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgLy8gUmVwbGFjZSB8YWRkU3RyZWFtfCB3aXRoIFBlZXJDb25uZWN0aW9uLmFkZFRyYWNrIHdoZW4gYWxsIGJyb3dzZXJzIGFyZSByZWFkeS5cbiAgICAgICAgICB0aGlzLl9wYy5hZGRTdHJlYW0oc3RyZWFtLm1lZGlhU3RyZWFtKTtcbiAgICAgICAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gICAgICAgICAgY29uc3QgdHJhY2tJZHMgPSBBcnJheS5mcm9tKHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRUcmFja3MoKSxcbiAgICAgICAgICAgIHRyYWNrID0+IHRyYWNrLmlkKTtcbiAgICAgICAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtVHJhY2tzLnNldChzdHJlYW0ubWVkaWFTdHJlYW0uaWQsXG4gICAgICAgICAgICB0cmFja0lkcyk7XG4gICAgICAgICAgdGhpcy5fcHVibGlzaFByb21pc2VzLnNldChzdHJlYW0ubWVkaWFTdHJlYW0uaWQsIHtcbiAgICAgICAgICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3Q6IHJlamVjdFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICghdGhpcy5fZGF0YUNoYW5uZWxzLmhhcyhEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVEYXRhQ2hhbm5lbChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG5cbiAgc2VuZChtZXNzYWdlKSB7XG4gICAgaWYgKCEodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbWVzc2FnZS4nKSk7XG4gICAgfVxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBpZDogdGhpcy5fZGF0YVNlcSsrLFxuICAgICAgZGF0YTogbWVzc2FnZVxuICAgIH07XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3NlbmREYXRhUHJvbWlzZXMuc2V0KGRhdGEuaWQsIHtcbiAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgICAgcmVqZWN0OiByZWplY3RcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmICghdGhpcy5fZGF0YUNoYW5uZWxzLmhhcyhEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpKSB7XG4gICAgICB0aGlzLl9jcmVhdGVEYXRhQ2hhbm5lbChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpO1xuICAgIH1cblxuICAgIHRoaXMuX3NlbmRDbG9zZWRNc2dJZk5lY2Vzc2FyeSgpLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIExvZ2dlci5kZWJ1ZygnRmFpbGVkIHRvIHNlbmQgY2xvc2VkIG1lc3NhZ2UuJyArIGVyci5tZXNzYWdlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3NlbmRTeXNJbmZvSWZOZWNlc3NhcnkoKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICBMb2dnZXIuZGVidWcoJ0ZhaWxlZCB0byBzZW5kIHN5c0luZm8uJyArIGVyci5tZXNzYWdlKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGRjID0gdGhpcy5fZGF0YUNoYW5uZWxzLmdldChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpO1xuICAgIGlmIChkYy5yZWFkeVN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgIHRoaXMuX2RhdGFDaGFubmVscy5nZXQoRGF0YUNoYW5uZWxMYWJlbC5NRVNTQUdFKS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcGVuZGluZ01lc3NhZ2VzLnB1c2goZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9zdG9wKHVuZGVmaW5lZCwgdHJ1ZSk7XG4gIH1cblxuICBnZXRTdGF0cyhtZWRpYVN0cmVhbSkge1xuICAgIGlmICh0aGlzLl9wYykge1xuICAgICAgaWYgKG1lZGlhU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BjLmdldFN0YXRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0cmFja3NTdGF0c1JlcG9ydHMgPSBbXTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFttZWRpYVN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge3RoaXMuX2dldFN0YXRzKHRyYWNrLCB0cmFja3NTdGF0c1JlcG9ydHMpfSldKS50aGVuKFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUodHJhY2tzU3RhdHNSZXBvcnRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUpKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0U3RhdHMobWVkaWFTdHJlYW1UcmFjaywgcmVwb3J0c1Jlc3VsdCkge1xuICAgIHJldHVybiB0aGlzLl9wYy5nZXRTdGF0cyhtZWRpYVN0cmVhbVRyYWNrKS50aGVuKFxuICAgICAgKHN0YXRzUmVwb3J0KSA9PiB7cmVwb3J0c1Jlc3VsdC5wdXNoKHN0YXRzUmVwb3J0KTt9KTtcbiAgfVxuXG4gIC8vIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSBQMlBDbGllbnQgd2hlbiB0aGVyZSBpcyBuZXcgc2lnbmFsaW5nIG1lc3NhZ2UgYXJyaXZlZC5cbiAgb25NZXNzYWdlKG1lc3NhZ2Upe1xuICAgIHRoaXMuX1NpZ25hbGluZ01lc3NzYWdlSGFuZGxlcihtZXNzYWdlKTtcbiAgfVxuXG4gIF9zZW5kU2RwKHNkcCkge1xuICAgIHJldHVybiB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UodGhpcy5fcmVtb3RlSWQsIFNpZ25hbGluZ1R5cGUuU0RQLFxuICAgICAgc2RwKTtcbiAgfVxuXG4gIF9zZW5kU2lnbmFsaW5nTWVzc2FnZSh0eXBlLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSh0aGlzLl9yZW1vdGVJZCwgdHlwZSwgbWVzc2FnZSk7XG4gIH1cblxuICBfU2lnbmFsaW5nTWVzc3NhZ2VIYW5kbGVyKG1lc3NhZ2UpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0NoYW5uZWwgcmVjZWl2ZWQgbWVzc2FnZTogJyArIG1lc3NhZ2UpO1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuVUE6XG4gICAgICAgIHRoaXMuX2hhbmRsZVJlbW90ZUNhcGFiaWxpdHkobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgdGhpcy5fc2VuZFN5c0luZm9JZk5lY2Vzc2FyeSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5UUkFDS19TT1VSQ0VTOlxuICAgICAgICB0aGlzLl90cmFja1NvdXJjZXNIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLlNUUkVBTV9JTkZPOlxuICAgICAgICB0aGlzLl9zdHJlYW1JbmZvSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5TRFA6XG4gICAgICAgIHRoaXMuX3NkcEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuVFJBQ0tTX0FEREVEOlxuICAgICAgICB0aGlzLl90cmFja3NBZGRlZEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuVFJBQ0tTX1JFTU9WRUQ6XG4gICAgICAgIHRoaXMuX3RyYWNrc1JlbW92ZWRIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLkRBVEFfUkVDRUlWRUQ6XG4gICAgICAgIHRoaXMuX2RhdGFSZWNlaXZlZEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuQ0xPU0VEOlxuICAgICAgICB0aGlzLl9jaGF0Q2xvc2VkSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5ORUdPVElBVElPTl9ORUVERUQ6XG4gICAgICAgIHRoaXMuX2RvTmVnb3RpYXRlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgTG9nZ2VyLmVycm9yKCdJbnZhbGlkIHNpZ25hbGluZyBtZXNzYWdlIHJlY2VpdmVkLiBUeXBlOiAnICsgbWVzc2FnZS50eXBlKTtcbiAgICB9XG4gIH1cblxuICBfdHJhY2tzQWRkZWRIYW5kbGVyKGlkcykge1xuICAgIC8vIEN1cnJlbnRseSwgfGlkc3wgY29udGFpbnMgYWxsIHRyYWNrIElEcyBvZiBhIE1lZGlhU3RyZWFtLiBGb2xsb3dpbmcgYWxnb3JpdGhtIGFsc28gaGFuZGxlcyB8aWRzfCBpcyBhIHBhcnQgb2YgYSBNZWRpYVN0cmVhbSdzIHRyYWNrcy5cbiAgICBmb3IgKGNvbnN0IGlkIG9mIGlkcykge1xuICAgICAgLy8gSXQgY291bGQgYmUgYSBwcm9ibGVtIGlmIHRoZXJlIGlzIGEgdHJhY2sgcHVibGlzaGVkIHdpdGggZGlmZmVyZW50IE1lZGlhU3RyZWFtcy5cbiAgICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1UcmFja3MuZm9yRWFjaCgobWVkaWFUcmFja0lkcywgbWVkaWFTdHJlYW1JZCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lZGlhVHJhY2tJZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAobWVkaWFUcmFja0lkc1tpXSA9PT0gaWQpIHtcbiAgICAgICAgICAgIC8vIE1vdmUgdGhpcyB0cmFjayBmcm9tIHB1Ymxpc2hpbmcgdHJhY2tzIHRvIHB1Ymxpc2hlZCB0cmFja3MuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3B1Ymxpc2hlZFN0cmVhbVRyYWNrcy5oYXMobWVkaWFTdHJlYW1JZCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtVHJhY2tzLnNldChtZWRpYVN0cmVhbUlkLCBbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1UcmFja3MuZ2V0KG1lZGlhU3RyZWFtSWQpLnB1c2goXG4gICAgICAgICAgICAgIG1lZGlhVHJhY2tJZHNbaV0pO1xuICAgICAgICAgICAgbWVkaWFUcmFja0lkcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFJlc29sdmluZyBjZXJ0YWluIHB1Ymxpc2ggcHJvbWlzZSB3aGVuIHJlbW90ZSBlbmRwb2ludCByZWNlaXZlZCBhbGwgdHJhY2tzIG9mIGEgTWVkaWFTdHJlYW0uXG4gICAgICAgICAgaWYgKG1lZGlhVHJhY2tJZHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fcHVibGlzaFByb21pc2VzLmhhcyhtZWRpYVN0cmVhbUlkKSkge1xuICAgICAgICAgICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgdGhlIHByb21pc2UgZm9yIHB1Ymxpc2hpbmcgJyArXG4gICAgICAgICAgICAgICAgbWVkaWFTdHJlYW1JZCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0U3RyZWFtSW5kZXggPSB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtcy5maW5kSW5kZXgoXG4gICAgICAgICAgICAgIGVsZW1lbnQgPT4gZWxlbWVudC5tZWRpYVN0cmVhbS5pZCA9PSBtZWRpYVN0cmVhbUlkKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFN0cmVhbSA9IHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1zW3RhcmdldFN0cmVhbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1zLnNwbGljZSh0YXJnZXRTdHJlYW1JbmRleCwgMSk7XG4gICAgICAgICAgICBjb25zdCBwdWJsaWNhdGlvbiA9IG5ldyBQdWJsaWNhdGlvbihcbiAgICAgICAgICAgICAgaWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl91bnB1Ymxpc2godGFyZ2V0U3RyZWFtKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uLmRpc3BhdGNoRXZlbnQobmV3IE9tc0V2ZW50KCdlbmRlZCcpKTtcbiAgICAgICAgICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBVc2UgZGVidWcgbW9kZSBiZWNhdXNlIHRoaXMgZXJyb3IgdXN1YWxseSBkb2Vzbid0IGJsb2NrIHN0b3BwaW5nIGEgcHVibGljYXRpb24uXG4gICAgICAgICAgICAgICAgICBMb2dnZXIuZGVidWcoXG4gICAgICAgICAgICAgICAgICAgICdTb21ldGhpbmcgd3JvbmcgaGFwcGVuZWQgZHVyaW5nIHN0b3BwaW5nIGEgcHVibGljYXRpb24uICcgK1xuICAgICAgICAgICAgICAgICAgICBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFN0cmVhbSB8fCAhdGFyZ2V0U3RyZWFtLm1lZGlhU3RyZWFtKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9yc1xuICAgICAgICAgICAgICAgICAgICAuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFLFxuICAgICAgICAgICAgICAgICAgICAnUHVibGljYXRpb24gaXMgbm90IGF2YWlsYWJsZS4nKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRzKHRhcmdldFN0cmVhbS5tZWRpYVN0cmVhbSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtcy5zZXQodGFyZ2V0U3RyZWFtLCBwdWJsaWNhdGlvbik7XG4gICAgICAgICAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZXMuZ2V0KG1lZGlhU3RyZWFtSWQpLnJlc29sdmUocHVibGljYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5fcHVibGlzaFByb21pc2VzLmRlbGV0ZShtZWRpYVN0cmVhbUlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF90cmFja3NSZW1vdmVkSGFuZGxlcihpZHMpIHtcbiAgICAvLyBDdXJyZW50bHksIHxpZHN8IGNvbnRhaW5zIGFsbCB0cmFjayBJRHMgb2YgYSBNZWRpYVN0cmVhbS4gRm9sbG93aW5nIGFsZ29yaXRobSBhbHNvIGhhbmRsZXMgfGlkc3wgaXMgYSBwYXJ0IG9mIGEgTWVkaWFTdHJlYW0ncyB0cmFja3MuXG4gICAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICAgIC8vIEl0IGNvdWxkIGJlIGEgcHJvYmxlbSBpZiB0aGVyZSBpcyBhIHRyYWNrIHB1Ymxpc2hlZCB3aXRoIGRpZmZlcmVudCBNZWRpYVN0cmVhbXMuXG4gICAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1UcmFja3MuZm9yRWFjaCgobWVkaWFUcmFja0lkcywgbWVkaWFTdHJlYW1JZCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lZGlhVHJhY2tJZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAobWVkaWFUcmFja0lkc1tpXSA9PT0gaWQpIHtcbiAgICAgICAgICAgIG1lZGlhVHJhY2tJZHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2RhdGFSZWNlaXZlZEhhbmRsZXIoaWQpIHtcbiAgICBpZiAoIXRoaXMuX3NlbmREYXRhUHJvbWlzZXMuaGFzKGlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ1JlY2VpdmVkIHVua25vd24gZGF0YSByZWNlaXZlZCBtZXNzYWdlLiBJRDogJyArIGlkKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VuZERhdGFQcm9taXNlcy5nZXQoaWQpLnJlc29sdmUoKTtcbiAgICB9XG4gIH1cblxuICBfc2RwSGFuZGxlcihzZHApIHtcbiAgICBpZiAoc2RwLnR5cGUgPT09ICdvZmZlcicpIHtcbiAgICAgIHRoaXMuX29uT2ZmZXIoc2RwKTtcbiAgICB9IGVsc2UgaWYgKHNkcC50eXBlID09PSAnYW5zd2VyJykge1xuICAgICAgdGhpcy5fb25BbnN3ZXIoc2RwKTtcbiAgICB9IGVsc2UgaWYgKHNkcC50eXBlID09PSAnY2FuZGlkYXRlcycpIHtcbiAgICAgIHRoaXMuX29uUmVtb3RlSWNlQ2FuZGlkYXRlKHNkcCk7XG4gICAgfVxuICB9XG5cbiAgX3RyYWNrU291cmNlc0hhbmRsZXIoZGF0YSkge1xuICAgIGZvciAoY29uc3QgaW5mbyBvZiBkYXRhKSB7XG4gICAgICB0aGlzLl9yZW1vdGVUcmFja1NvdXJjZUluZm8uc2V0KGluZm8uaWQsIGluZm8uc291cmNlKTtcbiAgICB9XG4gIH1cblxuICBfc3RyZWFtSW5mb0hhbmRsZXIoZGF0YSkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ1VuZXhwZWN0ZWQgc3RyZWFtIGluZm8uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3JlbW90ZVN0cmVhbUluZm8uc2V0KGRhdGEuaWQsIHtcbiAgICAgIHNvdXJjZTogZGF0YS5zb3VyY2UsXG4gICAgICBhdHRyaWJ1dGVzOiBkYXRhLmF0dHJpYnV0ZXMsXG4gICAgICBzdHJlYW06IG51bGwsXG4gICAgICBtZWRpYVN0cmVhbTogbnVsbCxcbiAgICAgIHRyYWNrSWRzOiBkYXRhLnRyYWNrcyAgLy8gVHJhY2sgSURzIG1heSBub3QgbWF0Y2ggYXQgc2VuZGVyIGFuZCByZWNlaXZlciBzaWRlcy4gS2VlcCBpdCBmb3IgbGVnYWN5IHBvcnBvc2VzLlxuICAgIH0pO1xuICB9XG5cbiAgX2NoYXRDbG9zZWRIYW5kbGVyKGRhdGEpIHtcbiAgICB0aGlzLl9kaXNwb3NlZCA9IHRydWU7XG4gICAgdGhpcy5fc3RvcChkYXRhLCBmYWxzZSk7XG4gIH1cblxuICBfb25PZmZlcihzZHApIHtcbiAgICBMb2dnZXIuZGVidWcoJ0Fib3V0IHRvIHNldCByZW1vdGUgZGVzY3JpcHRpb24uIFNpZ25hbGluZyBzdGF0ZTogJyArXG4gICAgICB0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSk7XG4gICAgc2RwLnNkcCA9IHRoaXMuX3NldFJ0cFNlbmRlck9wdGlvbnMoc2RwLnNkcCwgdGhpcy5fY29uZmlnKTtcbiAgICAvLyBGaXJlZm94IG9ubHkgaGFzIG9uZSBjb2RlYyBpbiBhbnN3ZXIsIHdoaWNoIGRvZXMgbm90IHRydWx5IHJlZmxlY3QgaXRzXG4gICAgLy8gZGVjb2RpbmcgY2FwYWJpbGl0eS4gU28gd2Ugc2V0IGNvZGVjIHByZWZlcmVuY2UgdG8gcmVtb3RlIG9mZmVyLCBhbmQgbGV0XG4gICAgLy8gRmlyZWZveCBjaG9vc2UgaXRzIHByZWZlcnJlZCBjb2RlYy5cbiAgICAvLyBSZWZlcmVuY2U6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTgxNDIyNy5cbiAgICBpZiAoVXRpbHMuaXNGaXJlZm94KCkpIHtcbiAgICAgIHNkcC5zZHAgPSB0aGlzLl9zZXRDb2RlY09yZGVyKHNkcC5zZHApO1xuICAgIH1cbiAgICBjb25zdCBzZXNzaW9uRGVzY3JpcHRpb24gPSBuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCk7XG4gICAgdGhpcy5fcGMuc2V0UmVtb3RlRGVzY3JpcHRpb24oc2Vzc2lvbkRlc2NyaXB0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuX2NyZWF0ZUFuZFNlbmRBbnN3ZXIoKTtcbiAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnU2V0IHJlbW90ZSBkZXNjcmlwdGlvbiBmYWlsZWQuIE1lc3NhZ2U6ICcgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgIHRoaXMuX3N0b3AoZXJyb3IsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgX29uQW5zd2VyKHNkcCkge1xuICAgIExvZ2dlci5kZWJ1ZygnQWJvdXQgdG8gc2V0IHJlbW90ZSBkZXNjcmlwdGlvbi4gU2lnbmFsaW5nIHN0YXRlOiAnICtcbiAgICAgIHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlKTtcbiAgICBzZHAuc2RwID0gdGhpcy5fc2V0UnRwU2VuZGVyT3B0aW9ucyhzZHAuc2RwLCB0aGlzLl9jb25maWcpO1xuICAgIGNvbnN0IHNlc3Npb25EZXNjcmlwdGlvbiA9IG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24oc2RwKTtcbiAgICB0aGlzLl9wYy5zZXRSZW1vdGVEZXNjcmlwdGlvbihuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKFxuICAgICAgc2Vzc2lvbkRlc2NyaXB0aW9uKSkudGhlbigoKSA9PiB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1NldCByZW1vdGUgZGVzY3JpcGl0b24gc3VjY2Vzc2Z1bGx5LicpO1xuICAgICAgdGhpcy5fZHJhaW5QZW5kaW5nTWVzc2FnZXMoKTtcbiAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnU2V0IHJlbW90ZSBkZXNjcmlwdGlvbiBmYWlsZWQuIE1lc3NhZ2U6ICcgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgIHRoaXMuX3N0b3AoZXJyb3IsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgX29uTG9jYWxJY2VDYW5kaWRhdGUoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuY2FuZGlkYXRlKSB7XG4gICAgICB0aGlzLl9zZW5kU2RwKHtcbiAgICAgICAgdHlwZTogJ2NhbmRpZGF0ZXMnLFxuICAgICAgICBjYW5kaWRhdGU6IGV2ZW50LmNhbmRpZGF0ZS5jYW5kaWRhdGUsXG4gICAgICAgIHNkcE1pZDogZXZlbnQuY2FuZGlkYXRlLnNkcE1pZCxcbiAgICAgICAgc2RwTUxpbmVJbmRleDogZXZlbnQuY2FuZGlkYXRlLnNkcE1MaW5lSW5kZXhcbiAgICAgIH0pLmNhdGNoKGU9PntcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0ZhaWxlZCB0byBzZW5kIGNhbmRpZGF0ZS4nKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0VtcHR5IGNhbmRpZGF0ZS4nKTtcbiAgICB9XG4gIH1cblxuICBfb25SZW1vdGVUcmFja0FkZGVkKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdSZW1vdGUgdHJhY2sgYWRkZWQuJyk7XG4gICAgZm9yIChjb25zdCBzdHJlYW0gb2YgZXZlbnQuc3RyZWFtcykge1xuICAgICAgaWYgKCF0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmhhcyhzdHJlYW0uaWQpKSB7XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdNaXNzaW5nIHN0cmVhbSBpbmZvLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX3JlbW90ZVN0cmVhbUluZm8uZ2V0KHN0cmVhbS5pZCkuc3RyZWFtKSB7XG4gICAgICAgIHRoaXMuX3NldFN0cmVhbVRvUmVtb3RlU3RyZWFtSW5mbyhzdHJlYW0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY29ubmVjdGVkJyB8fCB0aGlzLl9wYy5pY2VDb25uZWN0aW9uU3RhdGUgPT09XG4gICAgICAnY29tcGxldGVkJykge1xuICAgICAgdGhpcy5fY2hlY2tJY2VDb25uZWN0aW9uU3RhdGVBbmRGaXJlRXZlbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYWRkZWRUcmFja0lkcy5jb25jYXQoZXZlbnQudHJhY2suaWQpO1xuICAgIH1cbiAgfVxuXG4gIF9vblJlbW90ZVN0cmVhbUFkZGVkKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdSZW1vdGUgc3RyZWFtIGFkZGVkLicpO1xuICAgIGlmICghdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5oYXMoZXZlbnQuc3RyZWFtLmlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNvdXJjZSBpbmZvIGZvciBzdHJlYW0gJyArIGV2ZW50LnN0cmVhbS5pZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9wYy5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdjb25uZWN0ZWQnIHx8IHRoaXMuX3BjLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT1cbiAgICAgICdjb21wbGV0ZWQnKSB7XG4gICAgICB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLlRSQUNLU19BRERFRCwgdHJhY2tzSW5mbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FkZGVkVHJhY2tJZHMgPSB0aGlzLl9hZGRlZFRyYWNrSWRzLmNvbmNhdCh0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChcbiAgICAgICAgZXZlbnQuc3RyZWFtLmlkKS50cmFja0lkcyk7XG4gICAgfVxuICAgIGNvbnN0IGF1ZGlvVHJhY2tTb3VyY2UgPSB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChldmVudC5zdHJlYW0uaWQpLnNvdXJjZS5hdWRpbztcbiAgICBjb25zdCB2aWRlb1RyYWNrU291cmNlID0gdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5nZXQoZXZlbnQuc3RyZWFtLmlkKS5zb3VyY2UudmlkZW87XG4gICAgY29uc3Qgc291cmNlSW5mbyA9IG5ldyBTdHJlYW1Nb2R1bGUuU3RyZWFtU291cmNlSW5mbyhhdWRpb1RyYWNrU291cmNlLFxuICAgICAgdmlkZW9UcmFja1NvdXJjZSk7XG4gICAgaWYgKFV0aWxzLmlzU2FmYXJpKCkpIHtcbiAgICAgIGlmICghc291cmNlSW5mby5hdWRpbykge1xuICAgICAgICBldmVudC5zdHJlYW0uZ2V0QXVkaW9UcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgIGV2ZW50LnN0cmVhbS5yZW1vdmVUcmFjayh0cmFjayk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCFzb3VyY2VJbmZvLnZpZGVvKSB7XG4gICAgICAgIGV2ZW50LnN0cmVhbS5nZXRWaWRlb1RyYWNrcygpLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICAgICAgZXZlbnQuc3RyZWFtLnJlbW92ZVRyYWNrKHRyYWNrKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChldmVudC5zdHJlYW0uaWQpLmF0dHJpYnV0ZXM7XG4gICAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbU1vZHVsZS5SZW1vdGVTdHJlYW0odW5kZWZpbmVkLCB0aGlzLl9yZW1vdGVJZCwgZXZlbnQuc3RyZWFtLFxuICAgICAgc291cmNlSW5mbywgYXR0cmlidXRlcyk7XG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gICAgICBjb25zdCBzdHJlYW1FdmVudCA9IG5ldyBTdHJlYW1Nb2R1bGUuU3RyZWFtRXZlbnQoJ3N0cmVhbWFkZGVkJywge1xuICAgICAgICBzdHJlYW06IHN0cmVhbVxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoc3RyZWFtRXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIF9vblJlbW90ZVN0cmVhbVJlbW92ZWQoZXZlbnQpIHtcbiAgICBMb2dnZXIuZGVidWcoJ1JlbW90ZSBzdHJlYW0gcmVtb3ZlZC4nKTtcbiAgICBjb25zdCBpID0gdGhpcy5fcmVtb3RlU3RyZWFtcy5maW5kSW5kZXgoKHMpID0+IHtcbiAgICAgIHJldHVybiBzLm1lZGlhU3RyZWFtLmlkID09PSBldmVudC5zdHJlYW0uaWQ7XG4gICAgfSk7XG4gICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9yZW1vdGVTdHJlYW1zW2ldO1xuICAgICAgdGhpcy5fc3RyZWFtUmVtb3ZlZChzdHJlYW0pO1xuICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtcy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG5cbiAgX29uTmVnb3RpYXRpb25uZWVkZWQoKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdPbiBuZWdvdGlhdGlvbiBuZWVkZWQuJyk7XG5cbiAgICBpZiAodGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdzdGFibGUnICYmIHRoaXMuX25lZ290aWF0aW5nID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5fbmVnb3RpYXRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5fZG9OZWdvdGlhdGUoKTtcbiAgICAgIHRoaXMuX2lzTmVnb3RpYXRpb25OZWVkZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXNOZWdvdGlhdGlvbk5lZWRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgX29uUmVtb3RlSWNlQ2FuZGlkYXRlKGNhbmRpZGF0ZUluZm8pIHtcbiAgICBjb25zdCBjYW5kaWRhdGUgPSBuZXcgUlRDSWNlQ2FuZGlkYXRlKHtcbiAgICAgIGNhbmRpZGF0ZTogY2FuZGlkYXRlSW5mby5jYW5kaWRhdGUsXG4gICAgICBzZHBNaWQ6IGNhbmRpZGF0ZUluZm8uc2RwTWlkLFxuICAgICAgc2RwTUxpbmVJbmRleDogY2FuZGlkYXRlSW5mby5zZHBNTGluZUluZGV4XG4gICAgfSk7XG4gICAgaWYgKHRoaXMuX3BjLnJlbW90ZURlc2NyaXB0aW9uICYmIHRoaXMuX3BjLnJlbW90ZURlc2NyaXB0aW9uLnNkcCAhPT0gXCJcIikge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdBZGQgcmVtb3RlIGljZSBjYW5kaWRhdGVzLicpO1xuICAgICAgdGhpcy5fcGMuYWRkSWNlQ2FuZGlkYXRlKGNhbmRpZGF0ZSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBMb2dnZXIud2FybmluZygnRXJyb3IgcHJvY2Vzc2luZyBJQ0UgY2FuZGlkYXRlOiAnICsgZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnQ2FjaGUgcmVtb3RlIGljZSBjYW5kaWRhdGVzLicpO1xuICAgICAgdGhpcy5fcmVtb3RlSWNlQ2FuZGlkYXRlcy5wdXNoKGNhbmRpZGF0ZSk7XG4gICAgfVxuICB9O1xuXG4gIF9vblNpZ25hbGluZ1N0YXRlQ2hhbmdlKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdTaWduYWxpbmcgc3RhdGUgY2hhbmdlZDogJyArIHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlKTtcbiAgICBpZiAodGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgICAvL3N0b3BDaGF0TG9jYWxseShwZWVyLCBwZWVyLmlkKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlID09PSAnc3RhYmxlJykge1xuICAgICAgdGhpcy5fbmVnb3RpYXRpbmcgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLl9pc05lZ290aWF0aW9uTmVlZGVkKSB7XG4gICAgICAgIHRoaXMuX29uTmVnb3RpYXRpb25uZWVkZWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RyYWluUGVuZGluZ1N0cmVhbXMoKTtcbiAgICAgICAgdGhpcy5fZHJhaW5QZW5kaW5nTWVzc2FnZXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlID09PSAnaGF2ZS1yZW1vdGUtb2ZmZXInKSB7XG4gICAgICB0aGlzLl9kcmFpblBlbmRpbmdSZW1vdGVJY2VDYW5kaWRhdGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkljZUNvbm5lY3Rpb25TdGF0ZUNoYW5nZShldmVudCkge1xuICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nsb3NlZCcgfHwgZXZlbnQuY3VycmVudFRhcmdldFxuICAgICAgLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2ZhaWxlZCcpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfV0VCUlRDX1VOS05PV04sXG4gICAgICAgICdJQ0UgY29ubmVjdGlvbiBmYWlsZWQgb3IgY2xvc2VkLicpO1xuICAgICAgdGhpcy5fc3RvcChlcnJvciwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nvbm5lY3RlZCcgfHxcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY29tcGxldGVkJykge1xuICAgICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5UUkFDS1NfQURERUQsIHRoaXMuX2FkZGVkVHJhY2tJZHMpO1xuICAgICAgdGhpcy5fYWRkZWRUcmFja0lkcyA9IFtdO1xuICAgICAgdGhpcy5fY2hlY2tJY2VDb25uZWN0aW9uU3RhdGVBbmRGaXJlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICBfb25EYXRhQ2hhbm5lbE1lc3NhZ2UoZXZlbnQpIHtcbiAgICBjb25zdCBtZXNzYWdlPUpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgTG9nZ2VyLmRlYnVnKCdEYXRhIGNoYW5uZWwgbWVzc2FnZSByZWNlaXZlZDogJyttZXNzYWdlLmRhdGEpO1xuICAgIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuREFUQV9SRUNFSVZFRCwgbWVzc2FnZS5pZCk7XG4gICAgY29uc3QgbWVzc2FnZUV2ZW50ID0gbmV3IE1lc3NhZ2VFdmVudCgnbWVzc2FnZXJlY2VpdmVkJywge1xuICAgICAgbWVzc2FnZTogbWVzc2FnZS5kYXRhLFxuICAgICAgb3JpZ2luOiB0aGlzLl9yZW1vdGVJZFxuICAgIH0pO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChtZXNzYWdlRXZlbnQpO1xuICB9O1xuXG4gIF9vbkRhdGFDaGFubmVsT3BlbihldmVudCkge1xuICAgIExvZ2dlci5kZWJ1ZyhcIkRhdGEgQ2hhbm5lbCBpcyBvcGVuZWQuXCIpO1xuICAgIGlmIChldmVudC50YXJnZXQubGFiZWwgPT09IERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSkge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdEYXRhIGNoYW5uZWwgZm9yIG1lc3NhZ2VzIGlzIG9wZW5lZC4nKTtcbiAgICAgIHRoaXMuX2RyYWluUGVuZGluZ01lc3NhZ2VzKCk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkRhdGFDaGFubmVsQ2xvc2UoZXZlbnQpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0RhdGEgQ2hhbm5lbCBpcyBjbG9zZWQuJyk7XG4gIH07XG5cbiAgX3N0cmVhbVJlbW92ZWQoc3RyZWFtKSB7XG4gICAgaWYgKCF0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmhhcyhzdHJlYW0ubWVkaWFTdHJlYW0uaWQpKSB7XG4gICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgc3RyZWFtIGluZm8uJyk7XG4gICAgfVxuICAgIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVFJBQ0tTX1JFTU9WRUQsIHRoaXMuX3JlbW90ZVN0cmVhbUluZm9cbiAgICAgIC5nZXQoc3RyZWFtLm1lZGlhU3RyZWFtLmlkKS50cmFja0lkcyk7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgT21zRXZlbnQoJ2VuZGVkJyk7XG4gICAgc3RyZWFtLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgX2lzVW5pZmllZFBsYW4oKSB7XG4gICAgaWYgKFV0aWxzLmlzRmlyZWZveCgpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgcGMgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oe1xuICAgICAgc2RwU2VtYW50aWNzOiAndW5pZmllZC1wbGFuJ1xuICAgIH0pO1xuICAgIHJldHVybiAocGMuZ2V0Q29uZmlndXJhdGlvbigpICYmIHBjLmdldENvbmZpZ3VyYXRpb24oKS5zZHBTZW1hbnRpY3MgPT09XG4gICAgICAncGxhbi1iJyk7XG4gIH1cblxuICBfY3JlYXRlUGVlckNvbm5lY3Rpb24oKSB7XG4gICAgY29uc3QgcGNDb25maWd1cmF0aW9uID0gdGhpcy5fY29uZmlnLnJ0Y0NvbmZpZ3VyYXRpb24gfHwge307XG4gICAgaWYgKFV0aWxzLmlzQ2hyb21lKCkpIHtcbiAgICAgIHBjQ29uZmlndXJhdGlvbi5zZHBTZW1hbnRpY3MgPSAndW5pZmllZC1wbGFuJztcbiAgICB9XG4gICAgdGhpcy5fcGMgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24ocGNDb25maWd1cmF0aW9uKTtcbiAgICAvLyBGaXJlZm94IDU5IGltcGxlbWVudGVkIGFkZFRyYW5zY2VpdmVyLiBIb3dldmVyLCBtaWQgaW4gU0RQIHdpbGwgZGlmZmVyIGZyb20gdHJhY2sncyBJRCBpbiB0aGlzIGNhc2UuIEFuZCB0cmFuc2NlaXZlcidzIG1pZCBpcyBudWxsLlxuICAgIGlmICh0eXBlb2YgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIgPT09ICdmdW5jdGlvbicgJiYgVXRpbHMuaXNTYWZhcmkoKSkge1xuICAgICAgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ2F1ZGlvJyk7XG4gICAgICB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlcigndmlkZW8nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9pc1VuaWZpZWRQbGFuKCkpIHtcbiAgICAgIHRoaXMuX3BjLm9uYWRkc3RyZWFtID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIFRPRE86IExlZ2FjeSBBUEksIHNob3VsZCBiZSByZW1vdmVkIHdoZW4gYWxsIFVBcyBpbXBsZW1lbnRlZCBXZWJSVEMgMS4wLlxuICAgICAgICB0aGlzLl9vblJlbW90ZVN0cmVhbUFkZGVkLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgICAgfTtcbiAgICAgIHRoaXMuX3BjLm9ucmVtb3Zlc3RyZWFtID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuX29uUmVtb3RlU3RyZWFtUmVtb3ZlZC5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3BjLm9udHJhY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5fb25SZW1vdGVUcmFja0FkZGVkLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5fcGMub25uZWdvdGlhdGlvbm5lZWRlZCA9IChldmVudCk9PntcbiAgICAgIHRoaXMuX29uTmVnb3RpYXRpb25uZWVkZWQuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbmljZWNhbmRpZGF0ZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25Mb2NhbEljZUNhbmRpZGF0ZS5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICB9O1xuICAgIHRoaXMuX3BjLm9uc2lnbmFsaW5nc3RhdGVjaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uU2lnbmFsaW5nU3RhdGVDaGFuZ2UuYXBwbHkodGhpcywgW2V2ZW50XSlcbiAgICB9O1xuICAgIHRoaXMuX3BjLm9uZGF0YWNoYW5uZWwgPSAoZXZlbnQpID0+IHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnT24gZGF0YSBjaGFubmVsLicpO1xuICAgICAgLy8gU2F2ZSByZW1vdGUgY3JlYXRlZCBkYXRhIGNoYW5uZWwuXG4gICAgICBpZiAoIXRoaXMuX2RhdGFDaGFubmVscy5oYXMoZXZlbnQuY2hhbm5lbC5sYWJlbCkpIHtcbiAgICAgICAgdGhpcy5fZGF0YUNoYW5uZWxzLnNldChldmVudC5jaGFubmVsLmxhYmVsLCBldmVudC5jaGFubmVsKTtcbiAgICAgICAgTG9nZ2VyLmRlYnVnKCdTYXZlIHJlbW90ZSBjcmVhdGVkIGRhdGEgY2hhbm5lbC4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2JpbmRFdmVudHNUb0RhdGFDaGFubmVsKGV2ZW50LmNoYW5uZWwpO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uSWNlQ29ubmVjdGlvblN0YXRlQ2hhbmdlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgLypcbiAgICB0aGlzLl9wYy5vbmljZUNoYW5uZWxTdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBfb25JY2VDaGFubmVsU3RhdGVDaGFuZ2UocGVlciwgZXZlbnQpO1xuICAgIH07XG4gICAgID0gZnVuY3Rpb24oKSB7XG4gICAgICBvbk5lZ290aWF0aW9ubmVlZGVkKHBlZXJzW3BlZXIuaWRdKTtcbiAgICB9O1xuXG4gICAgLy9EYXRhQ2hhbm5lbFxuICAgIHRoaXMuX3BjLm9uZGF0YWNoYW5uZWwgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgTG9nZ2VyLmRlYnVnKG15SWQgKyAnOiBPbiBkYXRhIGNoYW5uZWwnKTtcbiAgICAgIC8vIFNhdmUgcmVtb3RlIGNyZWF0ZWQgZGF0YSBjaGFubmVsLlxuICAgICAgaWYgKCFwZWVyLmRhdGFDaGFubmVsc1tldmVudC5jaGFubmVsLmxhYmVsXSkge1xuICAgICAgICBwZWVyLmRhdGFDaGFubmVsc1tldmVudC5jaGFubmVsLmxhYmVsXSA9IGV2ZW50LmNoYW5uZWw7XG4gICAgICAgIExvZ2dlci5kZWJ1ZygnU2F2ZSByZW1vdGUgY3JlYXRlZCBkYXRhIGNoYW5uZWwuJyk7XG4gICAgICB9XG4gICAgICBiaW5kRXZlbnRzVG9EYXRhQ2hhbm5lbChldmVudC5jaGFubmVsLCBwZWVyKTtcbiAgICB9OyovXG4gIH1cblxuICBfZHJhaW5QZW5kaW5nU3RyZWFtcygpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0RyYWluaW5nIHBlbmRpbmcgc3RyZWFtcy4nKTtcbiAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdzdGFibGUnKSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1BlZXIgY29ubmVjdGlvbiBpcyByZWFkeSBmb3IgZHJhaW5pbmcgcGVuZGluZyBzdHJlYW1zLicpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9wZW5kaW5nU3RyZWFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9wZW5kaW5nU3RyZWFtc1tpXTtcbiAgICAgICAgLy8gT25OZWdvdGlhdGlvbk5lZWRlZCBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBpbW1lZGlhdGVseSBhZnRlciBhZGRpbmcgc3RyZWFtIHRvIFBlZXJDb25uZWN0aW9uIGluIEZpcmVmb3guXG4gICAgICAgIC8vIEFuZCBPbk5lZ290aWF0aW9uTmVlZGVkIGhhbmRsZXIgd2lsbCBleGVjdXRlIGRyYWluUGVuZGluZ1N0cmVhbXMuIFRvIGF2b2lkIGFkZCB0aGUgc2FtZSBzdHJlYW0gbXVsdGlwbGUgdGltZXMsXG4gICAgICAgIC8vIHNoaWZ0IGl0IGZyb20gcGVuZGluZyBzdHJlYW0gbGlzdCBiZWZvcmUgYWRkaW5nIGl0IHRvIFBlZXJDb25uZWN0aW9uLlxuICAgICAgICB0aGlzLl9wZW5kaW5nU3RyZWFtcy5zaGlmdCgpO1xuICAgICAgICBpZiAoIXN0cmVhbS5tZWRpYVN0cmVhbSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BjLmFkZFN0cmVhbShzdHJlYW0ubWVkaWFTdHJlYW0pO1xuICAgICAgICBMb2dnZXIuZGVidWcoJ0FkZGVkIHN0cmVhbSB0byBwZWVyIGNvbm5lY3Rpb24uJyk7XG4gICAgICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1zLnB1c2goc3RyZWFtKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3BlbmRpbmdTdHJlYW1zLmxlbmd0aCA9IDA7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXNbal0ubWVkaWFTdHJlYW0pIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wYy5yZW1vdmVTdHJlYW0odGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXNbal0ubWVkaWFTdHJlYW0pO1xuICAgICAgICB0aGlzLl91bnB1Ymxpc2hQcm9taXNlcy5nZXQodGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXNbal0ubWVkaWFTdHJlYW0uaWQpLnJlc29sdmUoKTtcbiAgICAgICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtcy5kZWxldGUodGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXNbal0pO1xuICAgICAgICBMb2dnZXIuZGVidWcoJ1JlbW92ZSBzdHJlYW0uJyk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtcy5sZW5ndGggPSAwO1xuICAgIH1cbiAgfVxuXG4gIF9kcmFpblBlbmRpbmdSZW1vdGVJY2VDYW5kaWRhdGVzKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fcmVtb3RlSWNlQ2FuZGlkYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdBZGQgY2FuZGlkYXRlJyk7XG4gICAgICB0aGlzLl9wYy5hZGRJY2VDYW5kaWRhdGUodGhpcy5fcmVtb3RlSWNlQ2FuZGlkYXRlc1tpXSkuY2F0Y2goZXJyb3I9PntcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Vycm9yIHByb2Nlc3NpbmcgSUNFIGNhbmRpZGF0ZTogJytlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5fcmVtb3RlSWNlQ2FuZGlkYXRlcy5sZW5ndGggPSAwO1xuICB9XG5cbiAgX2RyYWluUGVuZGluZ01lc3NhZ2VzKCl7XG4gICAgTG9nZ2VyLmRlYnVnKCdEcmFpbmluZyBwZW5kaW5nIG1lc3NhZ2VzLicpO1xuICAgIGlmICh0aGlzLl9wZW5kaW5nTWVzc2FnZXMubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGMgPSB0aGlzLl9kYXRhQ2hhbm5lbHMuZ2V0KERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSk7XG4gICAgaWYgKGRjICYmIGRjLnJlYWR5U3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9wZW5kaW5nTWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgTG9nZ2VyLmRlYnVnKCdTZW5kaW5nIG1lc3NhZ2UgdmlhIGRhdGEgY2hhbm5lbDogJyt0aGlzLl9wZW5kaW5nTWVzc2FnZXNbaV0pO1xuICAgICAgICBkYy5zZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMuX3BlbmRpbmdNZXNzYWdlc1tpXSkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcGVuZGluZ01lc3NhZ2VzLmxlbmd0aCA9IDA7XG4gICAgfSBlbHNlIGlmKHRoaXMuX3BjJiYhZGMpe1xuICAgICAgdGhpcy5fY3JlYXRlRGF0YUNoYW5uZWwoRGF0YUNoYW5uZWxMYWJlbC5NRVNTQUdFKTtcbiAgICB9XG4gIH1cblxuICBfc2VuZFN0cmVhbUluZm8oc3RyZWFtKSB7XG4gICAgaWYgKCFzdHJlYW0gfHwgIXN0cmVhbS5tZWRpYVN0cmVhbSkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTExFR0FMX0FSR1VNRU5UKTtcbiAgICB9XG4gICAgY29uc3QgaW5mbyA9IFtdO1xuICAgIHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRUcmFja3MoKS5tYXAoKHRyYWNrKSA9PiB7XG4gICAgICBpbmZvLnB1c2goe1xuICAgICAgICBpZDogdHJhY2suaWQsXG4gICAgICAgIHNvdXJjZTogc3RyZWFtLnNvdXJjZVt0cmFjay5raW5kXVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFt0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLlRSQUNLX1NPVVJDRVMsXG4gICAgICAgIGluZm8pLFxuICAgICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5TVFJFQU1fSU5GTywge1xuICAgICAgICBpZDogc3RyZWFtLm1lZGlhU3RyZWFtLmlkLFxuICAgICAgICBhdHRyaWJ1dGVzOiBzdHJlYW0uYXR0cmlidXRlcyxcbiAgICAgICAgLy8gVHJhY2sgSURzIG1heSBub3QgbWF0Y2ggYXQgc2VuZGVyIGFuZCByZWNlaXZlciBzaWRlcy5cbiAgICAgICAgdHJhY2tzOiBBcnJheS5mcm9tKGluZm8sIGl0ZW0gPT4gaXRlbS5pZCksXG4gICAgICAgIC8vIFRoaXMgaXMgYSB3b3JrYXJvdW5kIGZvciBTYWZhcmkuIFBsZWFzZSB1c2UgdHJhY2stc291cmNlcyBpZiBwb3NzaWJsZS5cbiAgICAgICAgc291cmNlOiBzdHJlYW0uc291cmNlXG4gICAgICB9KVxuICAgIF0pO1xuICB9XG5cblxuICBfc2VuZFN5c0luZm9JZk5lY2Vzc2FyeSgpIHtcbiAgICBpZiAodGhpcy5faW5mb1NlbnQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgdGhpcy5faW5mb1NlbnQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLlVBLCBzeXNJbmZvKTtcbiAgfVxuXG4gIF9zZW5kQ2xvc2VkTXNnSWZOZWNlc3NhcnkoKSB7XG4gICAgaWYgKHRoaXMuX3BjLnJlbW90ZURlc2NyaXB0aW9uID09PSBudWxsIHx8IHRoaXMuX3BjLnJlbW90ZURlc2NyaXB0aW9uLnNkcCA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuQ0xPU0VEKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgX2hhbmRsZVJlbW90ZUNhcGFiaWxpdHkodWEpIHtcbiAgICBpZiAodWEuc2RrICYmIHVhLnNkayAmJiB1YS5zZGsudHlwZSA9PT0gXCJKYXZhU2NyaXB0XCIgJiYgdWEucnVudGltZSAmJiB1YS5ydW50aW1lXG4gICAgICAubmFtZSA9PT0gXCJGaXJlZm94XCIpIHtcbiAgICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1JlbW92ZVN0cmVhbSA9IGZhbHNlO1xuICAgICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUGxhbkIgPSBmYWxzZTtcbiAgICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1VuaWZpZWRQbGFuID0gdHJ1ZTtcbiAgICB9IGVsc2UgeyAvLyBSZW1vdGUgc2lkZSBpcyBpT1MvQW5kcm9pZC9DKysgd2hpY2ggdXNlcyBHb29nbGUncyBXZWJSVEMgc3RhY2suXG4gICAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNSZW1vdmVTdHJlYW0gPSB0cnVlO1xuICAgICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUGxhbkIgPSB0cnVlO1xuICAgICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzVW5pZmllZFBsYW4gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBfZG9OZWdvdGlhdGUoKSB7XG4gICAgaWYgKHRoaXMuX2lzQ2FsbGVyKSB7XG4gICAgICB0aGlzLl9jcmVhdGVBbmRTZW5kT2ZmZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5ORUdPVElBVElPTl9ORUVERUQpO1xuICAgIH1cbiAgfTtcblxuICBfc2V0Q29kZWNPcmRlcihzZHApIHtcbiAgICBpZiAodGhpcy5fY29uZmlnLmF1ZGlvRW5jb2RpbmdzKSB7XG4gICAgICBjb25zdCBhdWRpb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKHRoaXMuX2NvbmZpZy5hdWRpb0VuY29kaW5ncyxcbiAgICAgICAgZW5jb2RpbmdQYXJhbWV0ZXJzID0+IGVuY29kaW5nUGFyYW1ldGVycy5jb2RlYy5uYW1lKTtcbiAgICAgIHNkcCA9IFNkcFV0aWxzLnJlb3JkZXJDb2RlY3Moc2RwLCAnYXVkaW8nLCBhdWRpb0NvZGVjTmFtZXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnZpZGVvRW5jb2RpbmdzKSB7XG4gICAgICBjb25zdCB2aWRlb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKHRoaXMuX2NvbmZpZy52aWRlb0VuY29kaW5ncyxcbiAgICAgICAgZW5jb2RpbmdQYXJhbWV0ZXJzID0+IGVuY29kaW5nUGFyYW1ldGVycy5jb2RlYy5uYW1lKTtcbiAgICAgIHNkcCA9IFNkcFV0aWxzLnJlb3JkZXJDb2RlY3Moc2RwLCAndmlkZW8nLCB2aWRlb0NvZGVjTmFtZXMpO1xuICAgIH1cbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgX3NldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmF1ZGlvRW5jb2RpbmdzID09PSAnb2JqZWN0Jykge1xuICAgICAgc2RwID0gU2RwVXRpbHMuc2V0TWF4Qml0cmF0ZShzZHAsIG9wdGlvbnMuYXVkaW9FbmNvZGluZ3MpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudmlkZW9FbmNvZGluZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgICBzZHAgPSBTZHBVdGlscy5zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucy52aWRlb0VuY29kaW5ncyk7XG4gICAgfVxuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBfc2V0UnRwU2VuZGVyT3B0aW9ucyhzZHAsIG9wdGlvbnMpIHtcbiAgICBzZHAgPSB0aGlzLl9zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9zZXRSdHBSZWNlaXZlck9wdGlvbnMoc2RwKSB7XG4gICAgc2RwID0gdGhpcy5fc2V0Q29kZWNPcmRlcihzZHApO1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBfY3JlYXRlQW5kU2VuZE9mZmVyKCkge1xuICAgIGlmICghdGhpcy5fcGMpIHtcbiAgICAgIExvZ2dlci5lcnJvcignUGVlciBjb25uZWN0aW9uIGhhdmUgbm90IGJlZW4gY3JlYXRlZC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faXNOZWdvdGlhdGlvbk5lZWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2lzQ2FsbGVyID0gdHJ1ZTtcbiAgICBsZXQgbG9jYWxEZXNjO1xuICAgIHRoaXMuX3BjLmNyZWF0ZU9mZmVyKG9mZmVyT3B0aW9ucykudGhlbihkZXNjID0+IHtcbiAgICAgIGRlc2Muc2RwID0gdGhpcy5fc2V0UnRwUmVjZWl2ZXJPcHRpb25zKGRlc2Muc2RwKTtcbiAgICAgIGxvY2FsRGVzYyA9IGRlc2M7XG4gICAgICByZXR1cm4gdGhpcy5fcGMuc2V0TG9jYWxEZXNjcmlwdGlvbihkZXNjKTtcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9zZW5kU2RwKGxvY2FsRGVzYyk7XG4gICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICBMb2dnZXIuZXJyb3IoZS5tZXNzYWdlICsgJyBQbGVhc2UgY2hlY2sgeW91ciBjb2RlYyBzZXR0aW5ncy4nKTtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfV0VCUlRDX1NEUCxcbiAgICAgICAgZS5tZXNzYWdlKTtcbiAgICAgIHRoaXMuX3N0b3AoZXJyb3IsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZUFuZFNlbmRBbnN3ZXIoKSB7XG4gICAgdGhpcy5fZHJhaW5QZW5kaW5nU3RyZWFtcygpO1xuICAgIHRoaXMuX2lzTmVnb3RpYXRpb25OZWVkZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9pc0NhbGxlciA9IGZhbHNlO1xuICAgIGxldCBsb2NhbERlc2M7XG4gICAgdGhpcy5fcGMuY3JlYXRlQW5zd2VyKCkudGhlbihkZXNjID0+IHtcbiAgICAgIGRlc2Muc2RwID0gdGhpcy5fc2V0UnRwUmVjZWl2ZXJPcHRpb25zKGRlc2Muc2RwKTtcbiAgICAgIGxvY2FsRGVzYz1kZXNjO1xuICAgICAgcmV0dXJuIHRoaXMuX3BjLnNldExvY2FsRGVzY3JpcHRpb24oZGVzYyk7XG4gICAgfSkudGhlbigoKT0+e1xuICAgICAgcmV0dXJuIHRoaXMuX3NlbmRTZHAobG9jYWxEZXNjKTtcbiAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgIExvZ2dlci5lcnJvcihlLm1lc3NhZ2UgKyAnIFBsZWFzZSBjaGVjayB5b3VyIGNvZGVjIHNldHRpbmdzLicpO1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9XRUJSVENfU0RQLFxuICAgICAgICBlLm1lc3NhZ2UpO1xuICAgICAgdGhpcy5fc3RvcChlcnJvciwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuXG4gIF9nZXRBbmREZWxldGVUcmFja1NvdXJjZUluZm8odHJhY2tzKSB7XG4gICAgaWYgKHRyYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB0cmFja0lkID0gdHJhY2tzWzBdLmlkO1xuICAgICAgaWYgKHRoaXMuX3JlbW90ZVRyYWNrU291cmNlSW5mby5oYXModHJhY2tJZCkpIHtcbiAgICAgICAgY29uc3Qgc291cmNlSW5mbyA9IHRoaXMuX3JlbW90ZVRyYWNrU291cmNlSW5mby5nZXQodHJhY2tJZCk7XG4gICAgICAgIHRoaXMuX3JlbW90ZVRyYWNrU291cmNlSW5mby5kZWxldGUodHJhY2tJZCk7XG4gICAgICAgIHJldHVybiBzb3VyY2VJbmZvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNvdXJjZSBpbmZvIGZvciAnICsgdHJhY2tJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3VucHVibGlzaChzdHJlYW0pIHtcbiAgICBpZiAobmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fCAhdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUmVtb3ZlU3RyZWFtKSB7XG4gICAgICAvLyBBY3R1YWxseSB1bnB1Ymxpc2ggaXMgc3VwcG9ydGVkLiBJdCBpcyBhIGxpdHRsZSBiaXQgY29tcGxleCBzaW5jZSBGaXJlZm94IGltcGxlbWVudGVkIFdlYlJUQyBzcGVjIHdoaWxlIENocm9tZSBpbXBsZW1lbnRlZCBhbiBvbGQgQVBJLlxuICAgICAgTG9nZ2VyLmVycm9yKFxuICAgICAgICAnU3RvcHBpbmcgYSBwdWJsaWNhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIG9uIEZpcmVmb3guIFBsZWFzZSB1c2UgUDJQQ2xpZW50LnN0b3AoKSB0byBzdG9wIHRoZSBjb25uZWN0aW9uIHdpdGggcmVtb3RlIGVuZHBvaW50LidcbiAgICAgICk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX1VOU1VQUE9SVEVEX01FVEhPRCkpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX3B1Ymxpc2hlZFN0cmVhbXMuaGFzKHN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSUxMRUdBTF9BUkdVTUVOVCkpO1xuICAgIH1cbiAgICB0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3VucHVibGlzaFByb21pc2VzLnNldChzdHJlYW0ubWVkaWFTdHJlYW0uaWQsIHtcbiAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgICAgcmVqZWN0OiByZWplY3RcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fZHJhaW5QZW5kaW5nU3RyZWFtcygpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIE1ha2Ugc3VyZSB8X3BjfCBpcyBhdmFpbGFibGUgYmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QuXG4gIF9jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCkge1xuICAgIGlmICh0aGlzLl9kYXRhQ2hhbm5lbHMuaGFzKGxhYmVsKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0RhdGEgY2hhbm5lbCBsYWJlbGVkICcrIGxhYmVsKycgYWxyZWFkeSBleGlzdHMuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKCF0aGlzLl9wYyl7XG4gICAgICBMb2dnZXIuZGVidWcoJ1BlZXJDb25uZWN0aW9uIGlzIG5vdCBhdmFpbGFibGUgYmVmb3JlIGNyZWF0aW5nIERhdGFDaGFubmVsLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBMb2dnZXIuZGVidWcoJ0NyZWF0ZSBkYXRhIGNoYW5uZWwuJyk7XG4gICAgY29uc3QgZGMgPSB0aGlzLl9wYy5jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCk7XG4gICAgdGhpcy5fYmluZEV2ZW50c1RvRGF0YUNoYW5uZWwoZGMpO1xuICAgIHRoaXMuX2RhdGFDaGFubmVscy5zZXQoRGF0YUNoYW5uZWxMYWJlbC5NRVNTQUdFLGRjKTtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzVG9EYXRhQ2hhbm5lbChkYyl7XG4gICAgZGMub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vbkRhdGFDaGFubmVsTWVzc2FnZS5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICB9O1xuICAgIGRjLm9ub3BlbiA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25EYXRhQ2hhbm5lbE9wZW4uYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICBkYy5vbmNsb3NlID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vbkRhdGFDaGFubmVsQ2xvc2UuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICBkYy5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICBMb2dnZXIuZGVidWcoXCJEYXRhIENoYW5uZWwgRXJyb3I6XCIsIGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgX2FyZUFsbFRyYWNrc0VuZGVkKG1lZGlhU3RyZWFtKSB7XG4gICAgZm9yIChjb25zdCB0cmFjayBvZiBtZWRpYVN0cmVhbS5nZXRUcmFja3MoKSkge1xuICAgICAgaWYgKHRyYWNrLnJlYWR5U3RhdGUgPT09ICdsaXZlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgX3N0b3AoZXJyb3IsIG5vdGlmeVJlbW90ZSkge1xuICAgIGxldCBwcm9taXNlRXJyb3IgPSBlcnJvcjtcbiAgICBpZiAoIXByb21pc2VFcnJvcikge1xuICAgICAgcHJvbWlzZUVycm9yID0gbmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX1VOS05PV04pO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtsYWJlbCwgZGNdIG9mIHRoaXMuX2RhdGFDaGFubmVscykge1xuICAgICAgZGMuY2xvc2UoKTtcbiAgICB9XG4gICAgdGhpcy5fZGF0YUNoYW5uZWxzLmNsZWFyKCk7XG4gICAgaWYgKHRoaXMuX3BjICYmIHRoaXMuX3BjLmljZUNvbm5lY3Rpb25TdGF0ZSAhPT0gJ2Nsb3NlZCcpIHtcbiAgICAgIHRoaXMuX3BjLmNsb3NlKCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgW2lkLCBwcm9taXNlXSBvZiB0aGlzLl9wdWJsaXNoUHJvbWlzZXMpIHtcbiAgICAgIHByb21pc2UucmVqZWN0KHByb21pc2VFcnJvcik7XG4gICAgfVxuICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlcy5jbGVhcigpO1xuICAgIGZvciAoY29uc3QgW2lkLCBwcm9taXNlXSBvZiB0aGlzLl91bnB1Ymxpc2hQcm9taXNlcykge1xuICAgICAgcHJvbWlzZS5yZWplY3QocHJvbWlzZUVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5fdW5wdWJsaXNoUHJvbWlzZXMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IFtpZCwgcHJvbWlzZV0gb2YgdGhpcy5fc2VuZERhdGFQcm9taXNlcykge1xuICAgICAgcHJvbWlzZS5yZWplY3QocHJvbWlzZUVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5fc2VuZERhdGFQcm9taXNlcy5jbGVhcigpO1xuICAgIC8vIEZpcmUgZW5kZWQgZXZlbnQgaWYgcHVibGljYXRpb24gb3IgcmVtb3RlIHN0cmVhbSBleGlzdHMuXG4gICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtcy5mb3JFYWNoKHB1YmxpY2F0aW9uID0+IHtcbiAgICAgIHB1YmxpY2F0aW9uLmRpc3BhdGNoRXZlbnQobmV3IE9tc0V2ZW50KCdlbmRlZCcpKTtcbiAgICB9KTtcbiAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1zLmNsZWFyKCk7XG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtcy5mb3JFYWNoKHN0cmVhbSA9PiB7XG4gICAgICBzdHJlYW0uZGlzcGF0Y2hFdmVudChuZXcgT21zRXZlbnQoJ2VuZGVkJykpO1xuICAgIH0pO1xuICAgIHRoaXMuX3JlbW90ZVN0cmVhbXMgPSBbXTtcbiAgICBpZighdGhpcy5fZGlzcG9zZWQpIHtcbiAgICAgIGlmIChub3RpZnlSZW1vdGUpIHtcbiAgICAgICAgbGV0IHNlbmRFcnJvcjtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgc2VuZEVycm9yID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgICAgICAgIC8vIEF2b2lkIHRvIGxlYWsgZGV0YWlsZWQgZXJyb3IgdG8gcmVtb3RlIHNpZGUuXG4gICAgICAgICAgc2VuZEVycm9yLm1lc3NhZ2UgPSAnRXJyb3IgaGFwcGVuZWQgYXQgcmVtb3RlIHNpZGUuJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLkNMT1NFRCwgc2VuZEVycm9yKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIExvZ2dlci5kZWJ1ZygnRmFpbGVkIHRvIHNlbmQgY2xvc2UuJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdlbmRlZCcpKTtcbiAgICB9XG4gIH1cblxuICBfc2V0U3RyZWFtVG9SZW1vdGVTdHJlYW1JbmZvKG1lZGlhU3RyZWFtKSB7XG4gICAgY29uc3QgaW5mbyA9IHRoaXMuX3JlbW90ZVN0cmVhbUluZm8uZ2V0KG1lZGlhU3RyZWFtLmlkKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gaW5mby5hdHRyaWJ1dGVzO1xuICAgIGNvbnN0IHNvdXJjZUluZm8gPSBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbVNvdXJjZUluZm8odGhpcy5fcmVtb3RlU3RyZWFtSW5mb1xuICAgICAgLmdldChtZWRpYVN0cmVhbS5pZCkuc291cmNlLmF1ZGlvLCB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChcbiAgICAgICAgbWVkaWFTdHJlYW0uaWQpXG4gICAgICAuc291cmNlLnZpZGVvKTtcbiAgICBpbmZvLnN0cmVhbSA9IG5ldyBTdHJlYW1Nb2R1bGUuUmVtb3RlU3RyZWFtKFxuICAgICAgdW5kZWZpbmVkLCB0aGlzLl9yZW1vdGVJZCwgbWVkaWFTdHJlYW0sXG4gICAgICBzb3VyY2VJbmZvLCBhdHRyaWJ1dGVzKTtcbiAgICBpbmZvLm1lZGlhU3RyZWFtID0gbWVkaWFTdHJlYW07XG4gICAgY29uc3Qgc3RyZWFtID0gaW5mby5zdHJlYW07XG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdGYWlsZWQgdG8gY3JlYXRlIFJlbW90ZVN0cmVhbS4nKTtcbiAgICB9XG4gIH1cblxuICBfY2hlY2tJY2VDb25uZWN0aW9uU3RhdGVBbmRGaXJlRXZlbnQoKSB7XG4gICAgaWYgKHRoaXMuX3BjLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nvbm5lY3RlZCcgfHwgdGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlID09PVxuICAgICAgJ2NvbXBsZXRlZCcpIHtcbiAgICAgIGZvciAoY29uc3QgW2lkLCBpbmZvXSBvZiB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvKSB7XG4gICAgICAgIGlmIChpbmZvLm1lZGlhU3RyZWFtKSB7XG4gICAgICAgICAgY29uc3Qgc3RyZWFtRXZlbnQgPSBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbUV2ZW50KCdzdHJlYW1hZGRlZCcsIHtcbiAgICAgICAgICAgIHN0cmVhbTogaW5mby5zdHJlYW1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodGhpcy5faXNVbmlmaWVkUGxhbigpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRyYWNrIG9mIGluZm8ubWVkaWFTdHJlYW0uZ2V0VHJhY2tzKCkpIHtcbiAgICAgICAgICAgICAgdHJhY2suYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuX2FyZUFsbFRyYWNrc0VuZGVkKGluZm8ubWVkaWFTdHJlYW0pKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLl9vblJlbW90ZVN0cmVhbVJlbW92ZWQoaW5mby5zdHJlYW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVFJBQ0tTX0FEREVELCBpbmZvLnRyYWNrSWRzKTtcbiAgICAgICAgICB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChpbmZvLm1lZGlhU3RyZWFtLmlkKS5tZWRpYVN0cmVhbSA9IG51bGw7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbDtcbiJdfQ==
