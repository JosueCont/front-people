/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function() {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./context/index.js":
/*!**************************!*\
  !*** ./context/index.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Context\": function() { return /* binding */ Context; },\n/* harmony export */   \"Provider\": function() { return /* binding */ Provider; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _reducers_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reducers/user */ \"./context/reducers/user.js\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! js-cookie */ \"js-cookie\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_3__);\n\nvar _jsxFileName = \"/home/hiumanlab/Documents/projects/front-people/context/index.js\";\n\n\n // initial state\n\nconst initialState = {\n  user: {},\n  lang: 'es-mx',\n  generalSettings: {}\n}; // create context\n\nconst Context = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({});\njs_cookie__WEBPACK_IMPORTED_MODULE_3___default().set('lang', 'es-mx'); // combine reducer function\n\nconst combineReducers = (...reducers) => (state, action) => {\n  for (let i = 0; i < reducers.length; i++) state = reducers[i](state, action);\n\n  return state;\n}; // context provider\n\n\nconst Provider = ({\n  children\n}) => {\n  const {\n    0: state,\n    1: dispatch\n  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useReducer)(combineReducers(_reducers_user__WEBPACK_IMPORTED_MODULE_2__.user), initialState);\n  const value = {\n    state,\n    dispatch\n  };\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Context.Provider, {\n    value: value,\n    children: children\n  }, void 0, false, {\n    fileName: _jsxFileName,\n    lineNumber: 27,\n    columnNumber: 12\n  }, undefined);\n};\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raG9ubmVjdC1mcm9udC8uL2NvbnRleHQvaW5kZXguanM/MDI2NSJdLCJuYW1lcyI6WyJpbml0aWFsU3RhdGUiLCJ1c2VyIiwibGFuZyIsImdlbmVyYWxTZXR0aW5ncyIsIkNvbnRleHQiLCJjcmVhdGVDb250ZXh0IiwiY29va2llIiwiY29tYmluZVJlZHVjZXJzIiwicmVkdWNlcnMiLCJzdGF0ZSIsImFjdGlvbiIsImkiLCJsZW5ndGgiLCJQcm92aWRlciIsImNoaWxkcmVuIiwiZGlzcGF0Y2giLCJ1c2VSZWR1Y2VyIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtDQUdBOztBQUNBLE1BQU1BLFlBQVksR0FBRztBQUNqQkMsTUFBSSxFQUFFLEVBRFc7QUFFakJDLE1BQUksRUFBQyxPQUZZO0FBR2pCQyxpQkFBZSxFQUFDO0FBSEMsQ0FBckIsQyxDQU1BOztBQUNBLE1BQU1DLE9BQU8sZ0JBQUdDLG9EQUFhLENBQUMsRUFBRCxDQUE3QjtBQUNBQyxvREFBQSxDQUFXLE1BQVgsRUFBbUIsT0FBbkIsRSxDQUVBOztBQUNBLE1BQU1DLGVBQWUsR0FBRyxDQUFDLEdBQUdDLFFBQUosS0FBaUIsQ0FBQ0MsS0FBRCxFQUFRQyxNQUFSLEtBQW1CO0FBQ3hELE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsUUFBUSxDQUFDSSxNQUE3QixFQUFxQ0QsQ0FBQyxFQUF0QyxFQUEwQ0YsS0FBSyxHQUFHRCxRQUFRLENBQUNHLENBQUQsQ0FBUixDQUFZRixLQUFaLEVBQW1CQyxNQUFuQixDQUFSOztBQUMxQyxTQUFPRCxLQUFQO0FBQ0gsQ0FIRCxDLENBS0E7OztBQUNBLE1BQU1JLFFBQVEsR0FBRyxDQUFDO0FBQUVDO0FBQUYsQ0FBRCxLQUFrQjtBQUMvQixRQUFNO0FBQUEsT0FBQ0wsS0FBRDtBQUFBLE9BQVFNO0FBQVIsTUFBb0JDLGlEQUFVLENBQUNULGVBQWUsQ0FBQ04sZ0RBQUQsQ0FBaEIsRUFBd0JELFlBQXhCLENBQXBDO0FBQ0EsUUFBTWlCLEtBQUssR0FBRztBQUFFUixTQUFGO0FBQVNNO0FBQVQsR0FBZDtBQUVBLHNCQUFPLDhEQUFDLE9BQUQsQ0FBUyxRQUFUO0FBQWtCLFNBQUssRUFBRUUsS0FBekI7QUFBQSxjQUFpQ0g7QUFBakM7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUFQO0FBQ0gsQ0FMRCIsImZpbGUiOiIuL2NvbnRleHQvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWR1Y2VyLCBjcmVhdGVDb250ZXh0IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB1c2VyIH0gZnJvbSBcIi4vcmVkdWNlcnMvdXNlclwiO1xuaW1wb3J0IGNvb2tpZSBmcm9tIFwianMtY29va2llXCI7XG5cbi8vIGluaXRpYWwgc3RhdGVcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICB1c2VyOiB7fSxcbiAgICBsYW5nOidlcy1teCcsXG4gICAgZ2VuZXJhbFNldHRpbmdzOnt9XG59O1xuXG4vLyBjcmVhdGUgY29udGV4dFxuY29uc3QgQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoe30pO1xuY29va2llLnNldCgnbGFuZycsICdlcy1teCcpO1xuXG4vLyBjb21iaW5lIHJlZHVjZXIgZnVuY3Rpb25cbmNvbnN0IGNvbWJpbmVSZWR1Y2VycyA9ICguLi5yZWR1Y2VycykgPT4gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlZHVjZXJzLmxlbmd0aDsgaSsrKSBzdGF0ZSA9IHJlZHVjZXJzW2ldKHN0YXRlLCBhY3Rpb24pO1xuICAgIHJldHVybiBzdGF0ZTtcbn07XG5cbi8vIGNvbnRleHQgcHJvdmlkZXJcbmNvbnN0IFByb3ZpZGVyID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICAgIGNvbnN0IFtzdGF0ZSwgZGlzcGF0Y2hdID0gdXNlUmVkdWNlcihjb21iaW5lUmVkdWNlcnModXNlciksIGluaXRpYWxTdGF0ZSk7XG4gICAgY29uc3QgdmFsdWUgPSB7IHN0YXRlLCBkaXNwYXRjaCB9O1xuXG4gICAgcmV0dXJuIDxDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0+e2NoaWxkcmVufTwvQ29udGV4dC5Qcm92aWRlcj47XG59O1xuXG5leHBvcnQgeyBDb250ZXh0LCBQcm92aWRlciB9OyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./context/index.js\n");

/***/ }),

/***/ "./context/reducers/user.js":
/*!**********************************!*\
  !*** ./context/reducers/user.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"user\": function() { return /* binding */ user; }\n/* harmony export */ });\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nconst LOGGED_IN_USER = \"LOGGED_IN_USER\",\n      CHANGE_LANG = \"CHANGE_LANG\",\n      COMPANY_SELECTED = \"COMPANY_SELECTED\";\nfunction user(state, action) {\n  switch (action.type) {\n    case LOGGED_IN_USER:\n      return _objectSpread(_objectSpread({}, state), {}, {\n        user: action.payload\n      });\n\n    case CHANGE_LANG:\n      return _objectSpread(_objectSpread({}, state), {}, {\n        lang: action.payload\n      });\n\n    default:\n      return state;\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raG9ubmVjdC1mcm9udC8uL2NvbnRleHQvcmVkdWNlcnMvdXNlci5qcz9lOTM0Il0sIm5hbWVzIjpbIkxPR0dFRF9JTl9VU0VSIiwiQ0hBTkdFX0xBTkciLCJDT01QQU5ZX1NFTEVDVEVEIiwidXNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInBheWxvYWQiLCJsYW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsTUFBTUEsY0FBYyxHQUFDLGdCQUFyQjtBQUFBLE1BQ0FDLFdBQVcsR0FBRSxhQURiO0FBQUEsTUFFQUMsZ0JBQWdCLEdBQUcsa0JBRm5CO0FBS08sU0FBU0MsSUFBVCxDQUFjQyxLQUFkLEVBQXFCQyxNQUFyQixFQUE2QjtBQUNoQyxVQUFRQSxNQUFNLENBQUNDLElBQWY7QUFDSSxTQUFLTixjQUFMO0FBQ0ksNkNBQVlJLEtBQVo7QUFBbUJELFlBQUksRUFBRUUsTUFBTSxDQUFDRTtBQUFoQzs7QUFDSixTQUFLTixXQUFMO0FBQ0ksNkNBQVlHLEtBQVo7QUFBbUJJLFlBQUksRUFBRUgsTUFBTSxDQUFDRTtBQUFoQzs7QUFDSjtBQUNJLGFBQU9ILEtBQVA7QUFOUjtBQVFIIiwiZmlsZSI6Ii4vY29udGV4dC9yZWR1Y2Vycy91c2VyLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgTE9HR0VEX0lOX1VTRVI9XCJMT0dHRURfSU5fVVNFUlwiLFxuQ0hBTkdFX0xBTkc9IFwiQ0hBTkdFX0xBTkdcIixcbkNPTVBBTllfU0VMRUNURUQgPSBcIkNPTVBBTllfU0VMRUNURURcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgTE9HR0VEX0lOX1VTRVI6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdXNlcjogYWN0aW9uLnBheWxvYWQgfTtcbiAgICAgICAgY2FzZSBDSEFOR0VfTEFORzpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBsYW5nOiBhY3Rpb24ucGF5bG9hZCB9O1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./context/reducers/user.js\n");

/***/ }),

/***/ "./lang/enus.js":
/*!**********************!*\
  !*** ./lang/enus.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"enus\": function() { return /* binding */ enus; }\n/* harmony export */ });\nconst enus = {\n  'web.init': 'Home',\n  'home.import_people': 'Import people',\n  'header.intranet': 'Intranet',\n  'header.groups': 'Groups',\n  'header.config': 'Configuration'\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raG9ubmVjdC1mcm9udC8uL2xhbmcvZW51cy5qcz84YWE3Il0sIm5hbWVzIjpbImVudXMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBTyxNQUFNQSxJQUFJLEdBQUc7QUFDaEIsY0FBVyxNQURLO0FBRWhCLHdCQUFxQixlQUZMO0FBR2hCLHFCQUFrQixVQUhGO0FBSWhCLG1CQUFnQixRQUpBO0FBS2hCLG1CQUFnQjtBQUxBLENBQWIiLCJmaWxlIjoiLi9sYW5nL2VudXMuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgZW51cyA9IHtcbiAgICAnd2ViLmluaXQnOidIb21lJyxcbiAgICAnaG9tZS5pbXBvcnRfcGVvcGxlJzonSW1wb3J0IHBlb3BsZScsXG4gICAgJ2hlYWRlci5pbnRyYW5ldCc6J0ludHJhbmV0JyxcbiAgICAnaGVhZGVyLmdyb3Vwcyc6J0dyb3VwcycsXG4gICAgJ2hlYWRlci5jb25maWcnOidDb25maWd1cmF0aW9uJ1xufSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lang/enus.js\n");

/***/ }),

/***/ "./lang/esmx.js":
/*!**********************!*\
  !*** ./lang/esmx.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"esmx\": function() { return /* binding */ esmx; }\n/* harmony export */ });\nconst esmx = {\n  'web.init': 'Inicio',\n  'home.import_people': 'Importar personas',\n  'header.intranet': 'Intranet',\n  'header.groups': 'Grupos',\n  'header.config': 'Configuración'\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raG9ubmVjdC1mcm9udC8uL2xhbmcvZXNteC5qcz8xYTA1Il0sIm5hbWVzIjpbImVzbXgiXSwibWFwcGluZ3MiOiI7Ozs7QUFBTyxNQUFNQSxJQUFJLEdBQUc7QUFDaEIsY0FBVyxRQURLO0FBRWhCLHdCQUFxQixtQkFGTDtBQUdoQixxQkFBa0IsVUFIRjtBQUloQixtQkFBZ0IsUUFKQTtBQUtoQixtQkFBZ0I7QUFMQSxDQUFiIiwiZmlsZSI6Ii4vbGFuZy9lc214LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGVzbXggPSB7XG4gICAgJ3dlYi5pbml0JzonSW5pY2lvJyxcbiAgICAnaG9tZS5pbXBvcnRfcGVvcGxlJzonSW1wb3J0YXIgcGVyc29uYXMnLFxuICAgICdoZWFkZXIuaW50cmFuZXQnOidJbnRyYW5ldCcsXG4gICAgJ2hlYWRlci5ncm91cHMnOidHcnVwb3MnLFxuICAgICdoZWFkZXIuY29uZmlnJzonQ29uZmlndXJhY2nDs24nXG5cbn0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lang/esmx.js\n");

/***/ }),

/***/ "./lang/messages.js":
/*!**************************!*\
  !*** ./lang/messages.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"langMessages\": function() { return /* binding */ langMessages; }\n/* harmony export */ });\n/* harmony import */ var _esmx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esmx */ \"./lang/esmx.js\");\n/* harmony import */ var _enus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enus */ \"./lang/enus.js\");\n\n\nconst langMessages = {\n  'es-mx': _esmx__WEBPACK_IMPORTED_MODULE_0__.esmx,\n  'en-us': _enus__WEBPACK_IMPORTED_MODULE_1__.enus\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raG9ubmVjdC1mcm9udC8uL2xhbmcvbWVzc2FnZXMuanM/MTExMyJdLCJuYW1lcyI6WyJsYW5nTWVzc2FnZXMiLCJlc214IiwiZW51cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUVPLE1BQU1BLFlBQVksR0FBRztBQUN4QixXQUFRQyx1Q0FEZ0I7QUFFeEIsV0FBUUMsdUNBQUlBO0FBRlksQ0FBckIiLCJmaWxlIjoiLi9sYW5nL21lc3NhZ2VzLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtlc214fSBmcm9tICcuL2VzbXgnXG5pbXBvcnQge2VudXN9IGZyb20gJy4vZW51cydcblxuZXhwb3J0IGNvbnN0IGxhbmdNZXNzYWdlcyA9IHtcbiAgICAnZXMtbXgnOmVzbXgsXG4gICAgJ2VuLXVzJzplbnVzXG59OyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lang/messages.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var antd_dist_antd_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! antd/dist/antd.css */ \"./node_modules/antd/dist/antd.css\");\n/* harmony import */ var antd_dist_antd_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(antd_dist_antd_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_vars_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/vars.css */ \"./styles/vars.css\");\n/* harmony import */ var _styles_vars_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_vars_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _styles_person_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/person.css */ \"./styles/person.css\");\n/* harmony import */ var _styles_person_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_person_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../context */ \"./context/index.js\");\n/* harmony import */ var _lang_messages__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lang/messages */ \"./lang/messages.js\");\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ \"react-intl\");\n/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_intl__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_8__);\n\nvar _jsxFileName = \"/home/hiumanlab/Documents/projects/front-people/pages/_app.js\";\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\n\n\n\n\n\n\n\n\nfunction App({\n  Component,\n  pageProps\n}) {\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context__WEBPACK_IMPORTED_MODULE_5__.Provider, {\n    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_intl__WEBPACK_IMPORTED_MODULE_7__.IntlProvider, {\n      locale: 'es-mx',\n      defaultLocale: \"es-mx\",\n      messages: _lang_messages__WEBPACK_IMPORTED_MODULE_6__.langMessages[\"es-mx\"],\n      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, _objectSpread({}, pageProps), void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 17,\n        columnNumber: 13\n      }, this)\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 16,\n      columnNumber: 9\n    }, this)\n  }, void 0, false, {\n    fileName: _jsxFileName,\n    lineNumber: 15,\n    columnNumber: 5\n  }, this);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (App);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raG9ubmVjdC1mcm9udC8uL3BhZ2VzL19hcHAuanM/ZDUzMCJdLCJuYW1lcyI6WyJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJsYW5nTWVzc2FnZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLFNBQVNBLEdBQVQsQ0FBYTtBQUFFQyxXQUFGO0FBQWFDO0FBQWIsQ0FBYixFQUF1QztBQUVyQyxzQkFDRSw4REFBQyw4Q0FBRDtBQUFBLDJCQUNJLDhEQUFDLG9EQUFEO0FBQWMsWUFBTSxFQUFFLE9BQXRCO0FBQStCLG1CQUFhLEVBQUMsT0FBN0M7QUFBcUQsY0FBUSxFQUFFQyxpRUFBL0Q7QUFBQSw2QkFDSSw4REFBQyxTQUFELG9CQUFlRCxTQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFESjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREo7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQURGO0FBT0Q7O0FBRUQsK0RBQWVGLEdBQWYiLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiYW50ZC9kaXN0L2FudGQuY3NzXCI7XG5pbXBvcnQgXCIuLi9zdHlsZXMvZ2xvYmFscy5jc3NcIjtcbmltcG9ydCBcIi4uL3N0eWxlcy92YXJzLmNzc1wiO1xuaW1wb3J0IFwiLi4vc3R5bGVzL3BlcnNvbi5jc3NcIjtcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcIi4uL2NvbnRleHRcIjtcbmltcG9ydCB7bGFuZ01lc3NhZ2VzfSBmcm9tIFwiLi4vbGFuZy9tZXNzYWdlc1wiO1xuaW1wb3J0IHtJbnRsUHJvdmlkZXJ9IGZyb20gXCJyZWFjdC1pbnRsXCI7XG5pbXBvcnQgUmVhY3QsIHt1c2VDb250ZXh0LCB1c2VFZmZlY3R9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9jb250ZXh0XCI7XG5cblxuZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuXG4gIHJldHVybiAoXG4gICAgPFByb3ZpZGVyPlxuICAgICAgICA8SW50bFByb3ZpZGVyIGxvY2FsZT17J2VzLW14J30gZGVmYXVsdExvY2FsZT1cImVzLW14XCIgbWVzc2FnZXM9e2xhbmdNZXNzYWdlc1snZXMtbXgnXX0+XG4gICAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICAgIDwvSW50bFByb3ZpZGVyPlxuICAgIDwvUHJvdmlkZXI+XG4pXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./node_modules/antd/dist/antd.css":
/*!*****************************************!*\
  !*** ./node_modules/antd/dist/antd.css ***!
  \*****************************************/
/***/ (function() {



/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (function() {



/***/ }),

/***/ "./styles/person.css":
/*!***************************!*\
  !*** ./styles/person.css ***!
  \***************************/
/***/ (function() {



/***/ }),

/***/ "./styles/vars.css":
/*!*************************!*\
  !*** ./styles/vars.css ***!
  \*************************/
/***/ (function() {



/***/ }),

/***/ "js-cookie":
/*!****************************!*\
  !*** external "js-cookie" ***!
  \****************************/
/***/ (function(module) {

"use strict";
module.exports = require("js-cookie");;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ "react-intl":
/*!*****************************!*\
  !*** external "react-intl" ***!
  \*****************************/
/***/ (function(module) {

"use strict";
module.exports = require("react-intl");;

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-dev-runtime");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();