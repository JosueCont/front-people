(function() {
var exports = {};
exports.id = 2313;
exports.ids = [2313];
exports.modules = {

/***/ 5807:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/* harmony default export */ __webpack_exports__["default"] = ((req, res) => {
  res.statusCode = 200;
  res.json({
    name: 'John Doe'
  });
});

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__(5807));
module.exports = __webpack_exports__;

})();