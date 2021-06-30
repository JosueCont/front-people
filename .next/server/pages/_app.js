module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "1TCz":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__("F5FC");

// EXTERNAL MODULE: ./node_modules/antd/dist/antd.css
var antd = __webpack_require__("TpwP");

// EXTERNAL MODULE: ./styles/globals.css
var globals = __webpack_require__("zPlV");

// EXTERNAL MODULE: ./styles/vars.css
var vars = __webpack_require__("d+eA");

// EXTERNAL MODULE: ./styles/person.css
var person = __webpack_require__("T9so");

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__("cDcd");

// CONCATENATED MODULE: ./context/reducers/user.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const LOGGED_IN_USER = "LOGGED_IN_USER",
      CHANGE_LANG = "CHANGE_LANG",
      COMPANY_SELECTED = "COMPANY_SELECTED";
function user(state, action) {
  switch (action.type) {
    case LOGGED_IN_USER:
      return _objectSpread(_objectSpread({}, state), {}, {
        user: action.payload
      });

    case CHANGE_LANG:
      return _objectSpread(_objectSpread({}, state), {}, {
        lang: action.payload
      });

    default:
      return state;
  }
}
// EXTERNAL MODULE: external "js-cookie"
var external_js_cookie_ = __webpack_require__("vmXh");
var external_js_cookie_default = /*#__PURE__*/__webpack_require__.n(external_js_cookie_);

// CONCATENATED MODULE: ./context/index.js



 // initial state

const initialState = {
  user: {},
  lang: 'es-mx',
  generalSettings: {}
}; // create context

const Context = /*#__PURE__*/Object(external_react_["createContext"])({});
external_js_cookie_default.a.set('lang', 'es-mx'); // combine reducer function

const combineReducers = (...reducers) => (state, action) => {
  for (let i = 0; i < reducers.length; i++) state = reducers[i](state, action);

  return state;
}; // context provider


const Provider = ({
  children
}) => {
  const {
    0: state,
    1: dispatch
  } = Object(external_react_["useReducer"])(combineReducers(user), initialState);
  const value = {
    state,
    dispatch
  };
  return /*#__PURE__*/Object(jsx_runtime_["jsx"])(Context.Provider, {
    value: value,
    children: children
  });
};


// CONCATENATED MODULE: ./lang/esmx.js
const esmx = {
  'web.init': 'Inicio',
  'home.import_people': 'Importar personas',
  'header.intranet': 'Intranet',
  'header.groups': 'Grupos',
  'header.config': 'Configuración'
};
// CONCATENATED MODULE: ./lang/enus.js
const enus = {
  'web.init': 'Home',
  'home.import_people': 'Import people',
  'header.intranet': 'Intranet',
  'header.groups': 'Groups',
  'header.config': 'Configuration'
};
// CONCATENATED MODULE: ./lang/messages.js


const langMessages = {
  'es-mx': esmx,
  'en-us': enus
};
// EXTERNAL MODULE: external "react-intl"
var external_react_intl_ = __webpack_require__("k004");

// CONCATENATED MODULE: ./pages/_app.js


function _app_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _app_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { _app_ownKeys(Object(source), true).forEach(function (key) { _app_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { _app_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _app_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











function App({
  Component,
  pageProps
}) {
  return /*#__PURE__*/Object(jsx_runtime_["jsx"])(Provider, {
    children: /*#__PURE__*/Object(jsx_runtime_["jsx"])(external_react_intl_["IntlProvider"], {
      locale: 'es-mx',
      defaultLocale: "es-mx",
      messages: langMessages['es-mx'],
      children: /*#__PURE__*/Object(jsx_runtime_["jsx"])(Component, _app_objectSpread({}, pageProps))
    })
  });
}

/* harmony default export */ var _app = __webpack_exports__["default"] = (App);

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("1TCz");


/***/ }),

/***/ "F5FC":
/***/ (function(module, exports) {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "T9so":
/***/ (function(module, exports) {



/***/ }),

/***/ "TpwP":
/***/ (function(module, exports) {



/***/ }),

/***/ "cDcd":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "d+eA":
/***/ (function(module, exports) {



/***/ }),

/***/ "k004":
/***/ (function(module, exports) {

module.exports = require("react-intl");

/***/ }),

/***/ "vmXh":
/***/ (function(module, exports) {

module.exports = require("js-cookie");

/***/ }),

/***/ "zPlV":
/***/ (function(module, exports) {



/***/ })

/******/ });