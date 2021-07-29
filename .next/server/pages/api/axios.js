(function() {
var exports = {};
exports.id = 2878;
exports.ids = [2878];
exports.modules = {

/***/ 8448:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ axios; }
});

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(2376);
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_);
;// CONCATENATED MODULE: external "react-native"
var external_react_native_namespaceObject = require("react-native");;
;// CONCATENATED MODULE: ./pages/api/axios.jsx


const axiosAPI = external_axios_default().create({
  //   baseURL: "https://royalty.hiumanlab.com/",
  baseURL: "http://demo.localhost:8000/",
  headers: {
    "Content-Type": "application/json"
  }
});
axiosAPI.interceptors.request.use(async function (config) {
  let item = await external_react_native_namespaceObject.AsyncStorage.getItem("user");
  let object = JSON.parse(item);
  let token = "";

  if (object) {
    token = object.token;
  }

  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});
/* harmony default export */ var axios = (axiosAPI);

/***/ }),

/***/ 2376:
/***/ (function(module) {

"use strict";
module.exports = require("axios");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__(8448));
module.exports = __webpack_exports__;

})();