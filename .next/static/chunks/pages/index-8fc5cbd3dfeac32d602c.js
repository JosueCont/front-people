_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[15],{"+KLJ":function(e,t,n){"use strict";var r=n("pVnL"),o=n.n(r),a=n("lSNA"),c=n.n(a),i=n("J4zp"),s=n.n(i),u=n("q1tI"),l=n("V/uB"),f=n.n(l),p=n("0G8d"),d=n.n(p),m=n("xddM"),h=n.n(m),v=n("ESPI"),y=n.n(v),b=n("Z/ur"),g=n.n(b),w=n("J84W"),x=n.n(w),j=n("sKbD"),O=n.n(j),C=n("72Ab"),k=n.n(C),E=n("kbBi"),_=n.n(E),S=n("8XRh"),I=n("TSYQ"),M=n.n(I),N=n("H84U");var P=n("lwsE"),A=n.n(P),R=n("W8MJ"),H=n.n(R),T=n("7W2i"),q=n.n(T),D=n("LQ03"),U=n.n(D),B=function(e){q()(n,e);var t=U()(n);function n(){var e;return A()(this,n),(e=t.apply(this,arguments)).state={error:void 0,info:{componentStack:""}},e}return H()(n,[{key:"componentDidCatch",value:function(e,t){this.setState({error:e,info:t})}},{key:"render",value:function(){var e=this.props,t=e.message,n=e.description,r=e.children,o=this.state,a=o.error,c=o.info,i=c&&c.componentStack?c.componentStack:null,s="undefined"===typeof t?(a||"").toString():t,l="undefined"===typeof n?i:n;return a?u.createElement(F,{type:"error",message:s,description:u.createElement("pre",null,l)}):r}}]),n}(u.Component),L=n("0n0R"),J=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n},K={success:x.a,info:k.a,error:_.a,warning:O.a},W={success:d.a,info:y.a,error:g.a,warning:h.a},X=function(e){var t,n=e.description,r=e.prefixCls,a=e.message,i=e.banner,l=e.className,p=void 0===l?"":l,d=e.style,m=e.onMouseEnter,h=e.onMouseLeave,v=e.onClick,y=e.afterClose,b=e.showIcon,g=e.closable,w=e.closeText,x=J(e,["description","prefixCls","message","banner","className","style","onMouseEnter","onMouseLeave","onClick","afterClose","showIcon","closable","closeText"]),j=u.useState(!1),O=s()(j,2),C=O[0],k=O[1],E=u.useRef(),_=u.useContext(N.b),I=_.getPrefixCls,P=_.direction,A=I("alert",r),R=function(e){var t;k(!0),null===(t=x.onClose)||void 0===t||t.call(x,e)},H=!!w||g,T=function(){var e=x.type;return void 0!==e?e:i?"warning":"info"}(),q=!(!i||void 0!==b)||b,D=M()(A,"".concat(A,"-").concat(T),(t={},c()(t,"".concat(A,"-with-description"),!!n),c()(t,"".concat(A,"-no-icon"),!q),c()(t,"".concat(A,"-banner"),!!i),c()(t,"".concat(A,"-closable"),H),c()(t,"".concat(A,"-rtl"),"rtl"===P),t),p),U=function(e){return Object.keys(e).reduce((function(t,n){return"data-"!==n.substr(0,5)&&"aria-"!==n.substr(0,5)&&"role"!==n||"data-__"===n.substr(0,7)||(t[n]=e[n]),t}),{})}(x);return u.createElement(S.b,{visible:!C,motionName:"".concat(A,"-motion"),motionAppear:!1,motionEnter:!1,onLeaveStart:function(e){return{maxHeight:e.offsetHeight}},onLeaveEnd:y},(function(e){var t=e.className,r=e.style;return u.createElement("div",o()({ref:E,"data-show":!C,className:M()(D,t),style:o()(o()({},d),r),onMouseEnter:m,onMouseLeave:h,onClick:v,role:"alert"},U),q?function(){var e=x.icon,t=(n?W:K)[T]||null;return e?Object(L.c)(e,u.createElement("span",{className:"".concat(A,"-icon")},e),(function(){return{className:M()("".concat(A,"-icon"),c()({},e.props.className,e.props.className))}})):u.createElement(t,{className:"".concat(A,"-icon")})}():null,u.createElement("span",{className:"".concat(A,"-message")},a),u.createElement("span",{className:"".concat(A,"-description")},n),H?u.createElement("button",{type:"button",onClick:R,className:"".concat(A,"-close-icon"),tabIndex:0},w?u.createElement("span",{className:"".concat(A,"-close-text")},w):u.createElement(f.a,null)):null)}))};X.ErrorBoundary=B;var F=t.a=X},"/0+H":function(e,t,n){"use strict";t.__esModule=!0,t.isInAmpMode=c,t.useAmp=function(){return c(o.default.useContext(a.AmpStateContext))};var r,o=(r=n("q1tI"))&&r.__esModule?r:{default:r},a=n("lwAK");function c(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.ampFirst,n=void 0!==t&&t,r=e.hybrid,o=void 0!==r&&r,a=e.hasQuery,c=void 0!==a&&a;return n||o&&c}},"48fX":function(e,t,n){var r=n("qhzo");e.exports=function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&r(e,t)}},"5fIB":function(e,t,n){var r=n("7eYB");e.exports=function(e){if(Array.isArray(e))return r(e)}},"8Kt/":function(e,t,n){"use strict";n("oI91");t.__esModule=!0,t.defaultHead=l,t.default=void 0;var r,o=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=u();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var a=r?Object.getOwnPropertyDescriptor(e,o):null;a&&(a.get||a.set)?Object.defineProperty(n,o,a):n[o]=e[o]}n.default=e,t&&t.set(e,n);return n}(n("q1tI")),a=(r=n("Xuae"))&&r.__esModule?r:{default:r},c=n("lwAK"),i=n("FYa8"),s=n("/0+H");function u(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return u=function(){return e},e}function l(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[o.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(o.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function f(e,t){return"string"===typeof t||"number"===typeof t?e:t.type===o.default.Fragment?e.concat(o.default.Children.toArray(t.props.children).reduce((function(e,t){return"string"===typeof t||"number"===typeof t?e:e.concat(t)}),[])):e.concat(t)}var p=["name","httpEquiv","charSet","itemProp"];function d(e,t){return e.reduce((function(e,t){var n=o.default.Children.toArray(t.props.children);return e.concat(n)}),[]).reduce(f,[]).reverse().concat(l(t.inAmpMode)).filter(function(){var e=new Set,t=new Set,n=new Set,r={};return function(o){var a=!0;if(o.key&&"number"!==typeof o.key&&o.key.indexOf("$")>0){var c=o.key.slice(o.key.indexOf("$")+1);e.has(c)?a=!1:e.add(c)}switch(o.type){case"title":case"base":t.has(o.type)?a=!1:t.add(o.type);break;case"meta":for(var i=0,s=p.length;i<s;i++){var u=p[i];if(o.props.hasOwnProperty(u))if("charSet"===u)n.has(u)?a=!1:n.add(u);else{var l=o.props[u],f=r[u]||new Set;f.has(l)?a=!1:(f.add(l),r[u]=f)}}}return a}}()).reverse().map((function(e,t){var n=e.key||t;return o.default.cloneElement(e,{key:n})}))}function m(e){var t=e.children,n=(0,o.useContext)(c.AmpStateContext),r=(0,o.useContext)(i.HeadManagerContext);return o.default.createElement(a.default,{reduceComponentsToState:d,headManager:r,inAmpMode:(0,s.isInAmpMode)(n)},t)}m.rewind=function(){};var h=m;t.default=h},FYa8:function(e,t,n){"use strict";var r;t.__esModule=!0,t.HeadManagerContext=void 0;var o=((r=n("q1tI"))&&r.__esModule?r:{default:r}).default.createContext({});t.HeadManagerContext=o},RNiq:function(e,t,n){"use strict";n.r(t);var r=n("nKUr"),o=(n("8Kt/"),n("q1tI")),a=n("o0o1"),c=n.n(a),i=n("HaE+"),s=n("W9HT"),u=n("Vl3Y"),l=n("5rEg"),f=n("kaz8"),p=n("+KLJ"),d=n("2/Rp"),m=n("nOHt"),h=n("OcYQ"),v=n("vDqi"),y=n.n(v),b=n("p46w"),g=n.n(b);function w(e){this.message=e}w.prototype=new Error,w.prototype.name="InvalidCharacterError";var x="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(e){var t=String(e).replace(/=+$/,"");if(t.length%4==1)throw new w("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,r,o=0,a=0,c="";r=t.charAt(a++);~r&&(n=o%4?64*n+r:r,o++%4)?c+=String.fromCharCode(255&n>>(-2*o&6)):0)r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(r);return c};function j(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(e){return decodeURIComponent(x(e).replace(/(.)/g,(function(e,t){var n=t.charCodeAt(0).toString(16).toUpperCase();return n.length<2&&(n="0"+n),"%"+n})))}(t)}catch(e){return x(t)}}function O(e){this.message=e}O.prototype=new Error,O.prototype.name="InvalidTokenError";var C=function(e,t){if("string"!=typeof e)throw new O("Invalid token specified");var n=!0===(t=t||{}).header?0:1;try{return JSON.parse(j(e.split(".")[n]))}catch(e){throw new O("Invalid token specified: "+e.message)}},k=function(){var e=Object(m.useRouter)(),t=Object(o.useState)(null),n=t[0],a=t[1],v=Object(o.useState)(!1),b=v[0],x=v[1],j=function(){var t=Object(i.a)(c.a.mark((function t(n,r){var o,i;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:try{x(!1),a(!0),o={"client-id":"5f417a53c37f6275fb614104","Content-Type":"application/json"},i={email:n,password:r},y.a.post(h.b+"/login/",i,{headers:o}).then((function(t){if(200===t.status){var n=C(t.data.token);n&&(g.a.set("userToken",n),a(!1),e.push({pathname:"/home"}))}else a(!1),x(!0)})).catch((function(e){a(!1),x(!0),console.log(e)}))}catch(w){alert("Hubo un  problema al iniciar sesi\xf3n, por favor verifica tus credenciales"),console.log(w)}case 1:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}();return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(s.a,{tip:"Loading...",spinning:n}),Object(r.jsxs)(u.a,{name:"normal_login",className:"login-form",initialValues:{remember:!0},onFinish:function(e){j(e.email,e.password)},children:[Object(r.jsx)(u.a.Item,{name:"email",label:"Correo",rules:[{required:!0,message:"Please input your Email!"}],children:Object(r.jsx)(l.a,{placeholder:"Username"})}),Object(r.jsx)(u.a.Item,{name:"password",label:"Contrase\xf1a",rules:[{required:!0,message:"Please input your Password!"}],children:Object(r.jsx)(l.a,{type:"password",placeholder:"Password"})}),Object(r.jsx)(u.a.Item,{children:Object(r.jsx)(u.a.Item,{name:"remember",valuePropName:"checked",className:"ckeck-khor",noStyle:!0,children:Object(r.jsx)(f.a,{children:"Remember me"})})}),b&&Object(r.jsx)(p.a,{message:"Error iniciar sesi\xf3n",description:"La contrase\xf1a y/o correo no son correctos",type:"error",style:{textAlign:"center"}}),Object(r.jsx)(u.a.Item,{children:Object(r.jsx)(d.a,{style:{width:"100%!important"},type:"primary",htmlType:"submit",className:"login-form-button",children:"Log in"})})]})]})};t.default=function(){return Object(r.jsx)(r.Fragment,{children:Object(r.jsx)("div",{className:"containerPrincipal",children:Object(r.jsxs)("div",{className:"loginContainer",children:[Object(r.jsxs)("div",{style:{textAlign:"left"},children:[Object(r.jsx)("h1",{className:"font-color-khor",children:"KHOR+"}),Object(r.jsx)("p",{className:"font-color-khor",children:"A new people management experience"})]}),Object(r.jsx)(k,{})]})})})}},T0f4:function(e,t){function n(t){return e.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},n(t)}e.exports=n},Xuae:function(e,t,n){"use strict";var r=n("mPvQ"),o=n("/GRZ"),a=n("i2R6"),c=(n("qXWd"),n("48fX")),i=n("tCBg"),s=n("T0f4");function u(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=s(e);if(t){var o=s(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return i(this,n)}}t.__esModule=!0,t.default=void 0;var l=n("q1tI"),f=function(e){c(n,e);var t=u(n);function n(e){var a;return o(this,n),(a=t.call(this,e))._hasHeadManager=void 0,a.emitChange=function(){a._hasHeadManager&&a.props.headManager.updateHead(a.props.reduceComponentsToState(r(a.props.headManager.mountedInstances),a.props))},a._hasHeadManager=a.props.headManager&&a.props.headManager.mountedInstances,a}return a(n,[{key:"componentDidMount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.add(this),this.emitChange()}},{key:"componentDidUpdate",value:function(){this.emitChange()}},{key:"componentWillUnmount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.delete(this),this.emitChange()}},{key:"render",value:function(){return null}}]),n}(l.Component);t.default=f},kG2m:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},lwAK:function(e,t,n){"use strict";var r;t.__esModule=!0,t.AmpStateContext=void 0;var o=((r=n("q1tI"))&&r.__esModule?r:{default:r}).default.createContext({});t.AmpStateContext=o},mPvQ:function(e,t,n){var r=n("5fIB"),o=n("rlHP"),a=n("KckH"),c=n("kG2m");e.exports=function(e){return r(e)||o(e)||a(e)||c()}},oI91:function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},p46w:function(e,t,n){var r,o;!function(a){if(void 0===(o="function"===typeof(r=a)?r.call(t,n,t,e):r)||(e.exports=o),!0,e.exports=a(),!!0){var c=window.Cookies,i=window.Cookies=a();i.noConflict=function(){return window.Cookies=c,i}}}((function(){function e(){for(var e=0,t={};e<arguments.length;e++){var n=arguments[e];for(var r in n)t[r]=n[r]}return t}function t(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function n(r){function o(){}function a(t,n,a){if("undefined"!==typeof document){"number"===typeof(a=e({path:"/"},o.defaults,a)).expires&&(a.expires=new Date(1*new Date+864e5*a.expires)),a.expires=a.expires?a.expires.toUTCString():"";try{var c=JSON.stringify(n);/^[\{\[]/.test(c)&&(n=c)}catch(u){}n=r.write?r.write(n,t):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var i="";for(var s in a)a[s]&&(i+="; "+s,!0!==a[s]&&(i+="="+a[s].split(";")[0]));return document.cookie=t+"="+n+i}}function c(e,n){if("undefined"!==typeof document){for(var o={},a=document.cookie?document.cookie.split("; "):[],c=0;c<a.length;c++){var i=a[c].split("="),s=i.slice(1).join("=");n||'"'!==s.charAt(0)||(s=s.slice(1,-1));try{var u=t(i[0]);if(s=(r.read||r)(s,u)||t(s),n)try{s=JSON.parse(s)}catch(l){}if(o[u]=s,e===u)break}catch(l){}}return e?o[e]:o}}return o.set=a,o.get=function(e){return c(e,!1)},o.getJSON=function(e){return c(e,!0)},o.remove=function(t,n){a(t,"",e(n,{expires:-1}))},o.defaults={},o.withConverter=n,o}((function(){}))}))},qXWd:function(e,t){e.exports=function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}},rlHP:function(e,t){e.exports=function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},tCBg:function(e,t,n){var r=n("C+bE"),o=n("qXWd");e.exports=function(e,t){return!t||"object"!==r(t)&&"function"!==typeof t?o(e):t}},vlRD:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n("RNiq")}])}},[["vlRD",0,2,1,3]]]);