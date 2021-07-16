(function() {
var exports = {};
exports.id = 2888;
exports.ids = [2888];
exports.modules = {

/***/ 4855:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ _app; }
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(5282);
// EXTERNAL MODULE: ./node_modules/antd/dist/antd.css
var antd = __webpack_require__(4722);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
;// CONCATENATED MODULE: ./context/reducers/user.js
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
var external_js_cookie_ = __webpack_require__(6155);
var external_js_cookie_default = /*#__PURE__*/__webpack_require__.n(external_js_cookie_);
;// CONCATENATED MODULE: ./context/index.js



 // initial state

const initialState = {
  user: {},
  lang: 'es-mx',
  generalSettings: {}
}; // create context

const Context = /*#__PURE__*/(0,external_react_.createContext)({});
external_js_cookie_default().set('lang', 'es-mx'); // combine reducer function

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
  } = (0,external_react_.useReducer)(combineReducers(user), initialState);
  const value = {
    state,
    dispatch
  };
  return /*#__PURE__*/jsx_runtime_.jsx(Context.Provider, {
    value: value,
    children: children
  });
};


;// CONCATENATED MODULE: ./lang/esmx.js
const esmx = {
  'web.init': 'Inicio',
  'home.import_people': 'Importar personas',
  'header.intranet': 'Intranet',
  'header.groups': 'Grupos',
  'header.config': 'Configuración'
};
;// CONCATENATED MODULE: ./lang/enus.js
const enus = {
  'web.init': 'Home',
  'home.import_people': 'Import people',
  'header.intranet': 'Intranet',
  'header.groups': 'Groups',
  'header.config': 'Configuration'
};
;// CONCATENATED MODULE: ./lang/messages.js


const langMessages = {
  'es-mx': esmx,
  'en-us': enus
};
// EXTERNAL MODULE: external "react-intl"
var external_react_intl_ = __webpack_require__(1687);
;// CONCATENATED MODULE: ./pages/_app.js


function _app_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _app_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { _app_ownKeys(Object(source), true).forEach(function (key) { _app_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { _app_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _app_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











function App({
  Component,
  pageProps
}) {
  return /*#__PURE__*/jsx_runtime_.jsx(Provider, {
    children: /*#__PURE__*/jsx_runtime_.jsx(external_react_intl_.IntlProvider, {
      locale: 'es-mx',
      defaultLocale: "es-mx",
      messages: langMessages["es-mx"],
      children: /*#__PURE__*/jsx_runtime_.jsx(Component, _app_objectSpread({}, pageProps))
    })
  });
}

/* harmony default export */ var _app = (App);

/***/ }),

/***/ 4722:
/***/ (function() {



/***/ }),

/***/ 6155:
/***/ (function(module) {

"use strict";
module.exports = require("js-cookie");;

/***/ }),

/***/ 9297:
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ 1687:
/***/ (function(module) {

"use strict";
module.exports = require("react-intl");;

/***/ }),

/***/ 5282:
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-runtime");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__(4855));
module.exports = __webpack_exports__;

})();