_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[35],{"2qu3":function(e,t,n){"use strict";var r=n("oI91"),a=n("/GRZ"),o=n("i2R6");function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){var n;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"===typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return s(e,t)}(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var r=0,a=function(){};return{s:a,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return i=e.done,e},e:function(e){c=!0,o=e},f:function(){try{i||null==n.return||n.return()}finally{if(c)throw o}}}}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}t.__esModule=!0,t.default=void 0;var u,d=(u=n("q1tI"))&&u.__esModule?u:{default:u},f=n("8L3h"),p=n("jwwS");var b=[],m=[],h=!1;function j(e){var t=e(),n={loading:!0,loaded:null,error:null};return n.promise=t.then((function(e){return n.loading=!1,n.loaded=e,e})).catch((function(e){throw n.loading=!1,n.error=e,e})),n}function v(e){var t={loading:!1,loaded:{},error:null},n=[];try{Object.keys(e).forEach((function(r){var a=j(e[r]);a.loading?t.loading=!0:(t.loaded[r]=a.loaded,t.error=a.error),n.push(a.promise),a.promise.then((function(e){t.loaded[r]=e})).catch((function(e){t.error=e}))}))}catch(r){t.error=r}return t.promise=Promise.all(n).then((function(e){return t.loading=!1,e})).catch((function(e){throw t.loading=!1,e})),t}function y(e,t){return d.default.createElement(function(e){return e&&e.__esModule?e.default:e}(e),t)}function O(e,t){var n=Object.assign({loader:null,loading:null,delay:200,timeout:null,render:y,webpack:null,modules:null},t),r=null;function a(){if(!r){var t=new g(e,n);r={getCurrentValue:t.getCurrentValue.bind(t),subscribe:t.subscribe.bind(t),retry:t.retry.bind(t),promise:t.promise.bind(t)}}return r.promise()}if(!h&&"function"===typeof n.webpack){var o=n.webpack();m.push((function(e){var t,n=l(o);try{for(n.s();!(t=n.n()).done;){var r=t.value;if(-1!==e.indexOf(r))return a()}}catch(i){n.e(i)}finally{n.f()}}))}var i=function(e,t){a();var o=d.default.useContext(p.LoadableContext),i=(0,f.useSubscription)(r);return d.default.useImperativeHandle(t,(function(){return{retry:r.retry}}),[]),o&&Array.isArray(n.modules)&&n.modules.forEach((function(e){o(e)})),d.default.useMemo((function(){return i.loading||i.error?d.default.createElement(n.loading,{isLoading:i.loading,pastDelay:i.pastDelay,timedOut:i.timedOut,error:i.error,retry:r.retry}):i.loaded?n.render(i.loaded,e):null}),[e,i])};return i.preload=function(){return a()},i.displayName="LoadableComponent",d.default.forwardRef(i)}var g=function(){function e(t,n){a(this,e),this._loadFn=t,this._opts=n,this._callbacks=new Set,this._delay=null,this._timeout=null,this.retry()}return o(e,[{key:"promise",value:function(){return this._res.promise}},{key:"retry",value:function(){var e=this;this._clearTimeouts(),this._res=this._loadFn(this._opts.loader),this._state={pastDelay:!1,timedOut:!1};var t=this._res,n=this._opts;t.loading&&("number"===typeof n.delay&&(0===n.delay?this._state.pastDelay=!0:this._delay=setTimeout((function(){e._update({pastDelay:!0})}),n.delay)),"number"===typeof n.timeout&&(this._timeout=setTimeout((function(){e._update({timedOut:!0})}),n.timeout))),this._res.promise.then((function(){e._update({}),e._clearTimeouts()})).catch((function(t){e._update({}),e._clearTimeouts()})),this._update({})}},{key:"_update",value:function(e){this._state=c(c({},this._state),{},{error:this._res.error,loaded:this._res.loaded,loading:this._res.loading},e),this._callbacks.forEach((function(e){return e()}))}},{key:"_clearTimeouts",value:function(){clearTimeout(this._delay),clearTimeout(this._timeout)}},{key:"getCurrentValue",value:function(){return this._state}},{key:"subscribe",value:function(e){var t=this;return this._callbacks.add(e),function(){t._callbacks.delete(e)}}}]),e}();function x(e){return O(j,e)}function w(e,t){for(var n=[];e.length;){var r=e.pop();n.push(r(t))}return Promise.all(n).then((function(){if(e.length)return w(e,t)}))}x.Map=function(e){if("function"!==typeof e.render)throw new Error("LoadableMap requires a `render(loaded, props)` function");return O(v,e)},x.preloadAll=function(){return new Promise((function(e,t){w(b).then(e,t)}))},x.preloadReady=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return new Promise((function(t){var n=function(){return h=!0,t()};w(m,e).then(n,n)}))},window.__NEXT_PRELOADREADY=x.preloadReady;var _=x;t.default=_},"5d96":function(e,t,n){"use strict";n.r(t);var r=n("o0o1"),a=n.n(r),o=n("HaE+"),i=n("ODXe"),c=n("nKUr"),l=n("q1tI"),s=n("foez"),u=n("Vl3Y"),d=n("wFql"),f=n("5rEg"),p=n("TeRw"),b=n("bE4q"),m=n("BMrR"),h=n("kPKH"),j=n("2fM7"),v=n("Sdc0"),y=n("2/Rp"),O=n("nOHt"),g=n("RaW5"),x=n("p46w"),w=n.n(x),_=n("vDqi"),C=n.n(_),k=n("OcYQ"),E=(n("UKKK"),n("OZ65"),n("a6RD")),S=n.n(E)()((function(){return Promise.all([n.e(25),n.e(43)]).then(n.t.bind(null,"/Bhm",7))}),{ssr:!1,loadableGenerated:{webpack:function(){return["/Bhm"]},modules:["react-froala-wysiwyg"]}});t.default=function(){var e=w.a.get("userToken")?w.a.get("userToken"):null,t=u.a.useForm(),n=Object(i.a)(t,1)[0],r=d.a.Title,x=(f.a.TextArea,Object(O.useRouter)()),_=Object(l.useState)(null),E=_[0],I=_[1],P=Object(l.useState)(!1),D=P[0],N=P[1],T=Object(l.useState)(null),A=T[0],R=T[1],M=Object(l.useState)(null),q=M[0],K=M[1],L=Object(l.useState)([]),U=L[0],F=L[1],G=Object(l.useState)([]),B=G[0],H=G[1],z=Object(l.useState)([]),J=z[0],X=z[1],V=JSON.parse(e);Object(l.useEffect)((function(){V&&(R(V.user_i),Y())}),[]);var W=function(){var e=Object(o.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.khonnect_id=A,t.created_by=A,e.prev=2,e.next=5,g.a.post("/noticenter/notification/",t);case 5:n=e.sent,n.data,p.a.success({message:"Notification Title",description:"Informaci\xf3n enviada correctamente."}),x.push("/comunication/releases"),console.log("res",n.data),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(2),console.log("error",e.t0);case 15:return e.prev=15,N(!1),e.finish(15);case 18:case"end":return e.stop()}}),e,null,[[2,12,15,18]])})));return function(t){return e.apply(this,arguments)}}(),Y=function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return C.a.get(k.a+"/person/person-type/").then((function(e){if(200===e.status){var t=e.data.results;t=t.map((function(e){return{label:e.name,value:e.id}})),F(t)}})).catch((function(e){console.log(e)})),e.prev=1,e.next=4,g.a.get("/business/node/");case 4:n=e.sent,r=n.data.results,console.log("data",r),o=[],r.map((function(e){o.push({value:e.id,label:e.name})})),K(o),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(1),console.log("error",e.t0);case 15:C.a.get(k.a+"/business/department/").then((function(e){if(200===e.status){var t=e.data.results;t=t.map((function(e){return{label:e.name,value:e.id}})),X(t)}})).catch((function(e){console.log(e)}));case 16:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(t){return e.apply(this,arguments)}}();return Object(c.jsxs)(s.a,{currentKey:"4.1",children:[Object(c.jsxs)(b.a,{children:[Object(c.jsx)(b.a.Item,{children:"Home"}),Object(c.jsx)(b.a.Item,{children:"Comunicados"}),Object(c.jsx)(b.a.Item,{children:"Nuevo"})]},"Breadcrumb"),Object(c.jsx)("div",{className:"container back-white",style:{width:"100%"},children:Object(c.jsx)(m.a,{justify:"center",children:Object(c.jsx)(h.a,{span:"23",style:{padding:"20px 0 30px 0"},children:Object(c.jsx)(u.a,{form:n,layout:"horizontal",labelCol:{xs:24,sm:24,md:5},onFinish:W,children:Object(c.jsxs)(m.a,{children:[Object(c.jsx)(h.a,{span:24,children:Object(c.jsx)(r,{level:3,children:"Datos Generales"},"dats_gnrl")}),Object(c.jsxs)(h.a,{xs:24,sm:24,md:13,lg:13,xl:13,children:[Object(c.jsx)(u.a.Item,{name:"category",label:"Categoria",labelAlign:"left",children:Object(c.jsx)(j.a,{style:{width:250},options:[{label:"Noticias",value:"Noticia"},{label:"Aviso",value:"Aviso"}]})}),Object(c.jsx)(u.a.Item,{label:"Titulo",name:"title",labelAlign:"left",children:Object(c.jsx)(f.a,{className:"formItemPayment"})}),Object(c.jsx)(u.a.Item,{name:"message",label:"Mensaje",labelAlign:"left",children:Object(c.jsx)(S,{tag:"textarea",model:E,onModelChange:I},"message")})]}),Object(c.jsx)(h.a,{span:24,children:Object(c.jsx)(r,{level:3,children:"Segmentaci\xf3n"},"segmentacion")}),Object(c.jsx)(h.a,{xs:24,sm:24,md:13,lg:13,xl:13,children:Object(c.jsx)(u.a.Item,{name:"send_to_all",label:"Enviar a todos",labelAlign:"left",children:Object(c.jsx)(v.a,{})})}),Object(c.jsx)(h.a,{xs:24,sm:24,md:13,lg:13,xl:13,children:Object(c.jsxs)(m.a,{children:[Object(c.jsxs)(h.a,{xs:24,sm:24,md:12,lg:12,xl:12,children:[Object(c.jsx)(u.a.Item,{name:"company",label:"Empresa",labelCol:{span:10},children:Object(c.jsx)(j.a,{options:q,onChange:function(e){console.log(e)},placeholder:"Empresa"})}),Object(c.jsx)(u.a.Item,{name:"departament",label:"Departamento",labelCol:{span:10},children:Object(c.jsx)(j.a,{options:J,onChange:function(e){n.setFieldsValue({target_job:null}),C.a.get(k.a+"/business/department/".concat(e,"/job_for_department/")).then((function(e){if(200===e.status){var t=e.data;t=t.map((function(e){return{label:e.name,value:e.id}})),H(t)}else H([])})).catch((function(e){console.log(e),H([])}))},placeholder:"Departamento"})}),Object(c.jsx)(u.a.Item,{name:"target_job",label:"Puesto de trabajo",labelCol:{span:10},children:Object(c.jsx)(j.a,{options:B})})]}),Object(c.jsxs)(h.a,{xs:24,sm:24,md:12,lg:12,xl:12,children:[Object(c.jsx)(u.a.Item,{name:"target_person_type",label:"Tipo de persona",labelCol:{span:10},children:Object(c.jsx)(j.a,{options:U})}),Object(c.jsx)(u.a.Item,{name:"target_gender",label:"Genero",labelCol:{span:10},children:Object(c.jsx)(j.a,{options:[{label:"Masculino",value:1},{label:"Femenino",value:2},{label:"Otro",value:3}]})})]})]})}),Object(c.jsxs)(h.a,{span:24,style:{textAlign:"right"},children:[Object(c.jsx)(y.a,{onClick:function(){x.push("/comunication/releases")},disabled:D,style:{padding:"0 50px",margin:"0 10px"},children:"Cancelar"},"cancel"),Object(c.jsx)(y.a,{htmlType:"submit",loading:D,type:"primary",style:{padding:"0 50px",margin:"0 10px"},children:"Enviar"},"save")]})]})})})})})]})}},OXNG:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/comunication/releases/new",function(){return n("5d96")}])},OZ65:function(e,t,n){},OcYQ:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"c",(function(){return a})),n.d(t,"b",(function(){return o}));var r="https://demo.people.hiumanlab.com",a="https://khonnect.hiumanlab.com",o="5fa42a1ca6f5f821bbe7fbea"},RaW5:function(e,t,n){"use strict";var r=n("o0o1"),a=n.n(r),o=n("HaE+"),i=n("vDqi"),c=n.n(i),l=n("p46w"),s=n.n(l),u={baseURL:"https://demo.people.hiumanlab.com",headers:{"Content-Type":"application/json","Accept-Language":"en"}},d=c.a.create(u);d.interceptors.request.use(function(){var e=Object(o.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(n=s.a.get("token")?s.a.get("token"):"")&&(t.headers.Authorization="JWT ".concat(n)),e.abrupt("return",t);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),(function(e){return console.log("error-axios",e.response),Promise.reject(e)})),t.a=d},Sdc0:function(e,t,n){"use strict";var r=n("wx14"),a=n("rePB"),o=n("q1tI"),i=n("ODXe"),c=n("Ff2n"),l=n("TSYQ"),s=n.n(l),u=n("6cGi"),d=n("4IlW"),f=o.forwardRef((function(e,t){var n,r=e.prefixCls,l=void 0===r?"rc-switch":r,f=e.className,p=e.checked,b=e.defaultChecked,m=e.disabled,h=e.loadingIcon,j=e.checkedChildren,v=e.unCheckedChildren,y=e.onClick,O=e.onChange,g=e.onKeyDown,x=Object(c.a)(e,["prefixCls","className","checked","defaultChecked","disabled","loadingIcon","checkedChildren","unCheckedChildren","onClick","onChange","onKeyDown"]),w=Object(u.a)(!1,{value:p,defaultValue:b}),_=Object(i.a)(w,2),C=_[0],k=_[1];function E(e,t){var n=C;return m||(k(n=e),null===O||void 0===O||O(n,t)),n}var S=s()(l,f,(n={},Object(a.a)(n,"".concat(l,"-checked"),C),Object(a.a)(n,"".concat(l,"-disabled"),m),n));return o.createElement("button",Object.assign({},x,{type:"button",role:"switch","aria-checked":C,disabled:m,className:S,ref:t,onKeyDown:function(e){e.which===d.a.LEFT?E(!1,e):e.which===d.a.RIGHT&&E(!0,e),null===g||void 0===g||g(e)},onClick:function(e){var t=E(!C,e);null===y||void 0===y||y(t,e)}}),h,o.createElement("span",{className:"".concat(l,"-inner")},C?j:v))}));f.displayName="Switch";var p=f,b=n("ye1Q"),m=n("g0mS"),h=n("H84U"),j=n("3Nzz"),v=n("uaoM"),y=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n},O=o.forwardRef((function(e,t){var n,i=e.prefixCls,c=e.size,l=e.loading,u=e.className,d=void 0===u?"":u,f=e.disabled,O=y(e,["prefixCls","size","loading","className","disabled"]);Object(v.a)("checked"in O||!("value"in O),"Switch","`value` is not a valid prop, do you mean `checked`?");var g=o.useContext(h.b),x=g.getPrefixCls,w=g.direction,_=o.useContext(j.b),C=x("switch",i),k=o.createElement("div",{className:"".concat(C,"-handle")},l&&o.createElement(b.a,{className:"".concat(C,"-loading-icon")})),E=s()((n={},Object(a.a)(n,"".concat(C,"-small"),"small"===(c||_)),Object(a.a)(n,"".concat(C,"-loading"),l),Object(a.a)(n,"".concat(C,"-rtl"),"rtl"===w),n),d);return o.createElement(m.a,{insertExtraNode:!0},o.createElement(p,Object(r.a)({},O,{prefixCls:C,className:E,disabled:f||l,ref:t,loadingIcon:k})))}));O.__ANT_SWITCH=!0,O.displayName="Switch";t.a=O},UKKK:function(e,t,n){},a6RD:function(e,t,n){"use strict";var r=n("oI91");function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}t.__esModule=!0,t.noSSR=l,t.default=function(e,t){var n=i.default,r={loading:function(e){e.error,e.isLoading;return e.pastDelay,null}};e instanceof Promise?r.loader=function(){return e}:"function"===typeof e?r.loader=e:"object"===typeof e&&(r=o(o({},r),e));if(r=o(o({},r),t),"object"===typeof e&&!(e instanceof Promise)&&(e.render&&(r.render=function(t,n){return e.render(n,t)}),e.modules)){n=i.default.Map;var a={},c=e.modules();Object.keys(c).forEach((function(e){var t=c[e];"function"!==typeof t.then?a[e]=t:a[e]=function(){return t.then((function(e){return e.default||e}))}})),r.loader=a}r.loadableGenerated&&delete(r=o(o({},r),r.loadableGenerated)).loadableGenerated;if("boolean"===typeof r.ssr){if(!r.ssr)return delete r.ssr,l(n,r);delete r.ssr}return n(r)};c(n("q1tI"));var i=c(n("2qu3"));function c(e){return e&&e.__esModule?e:{default:e}}function l(e,t){return delete t.webpack,delete t.modules,e(t)}},jwwS:function(e,t,n){"use strict";var r;t.__esModule=!0,t.LoadableContext=void 0;var a=((r=n("q1tI"))&&r.__esModule?r:{default:r}).default.createContext(null);t.LoadableContext=a},oI91:function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},p46w:function(e,t,n){var r,a;!function(o){if(void 0===(a="function"===typeof(r=o)?r.call(t,n,t,e):r)||(e.exports=a),!0,e.exports=o(),!!0){var i=window.Cookies,c=window.Cookies=o();c.noConflict=function(){return window.Cookies=i,c}}}((function(){function e(){for(var e=0,t={};e<arguments.length;e++){var n=arguments[e];for(var r in n)t[r]=n[r]}return t}function t(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function n(r){function a(){}function o(t,n,o){if("undefined"!==typeof document){"number"===typeof(o=e({path:"/"},a.defaults,o)).expires&&(o.expires=new Date(1*new Date+864e5*o.expires)),o.expires=o.expires?o.expires.toUTCString():"";try{var i=JSON.stringify(n);/^[\{\[]/.test(i)&&(n=i)}catch(s){}n=r.write?r.write(n,t):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var c="";for(var l in o)o[l]&&(c+="; "+l,!0!==o[l]&&(c+="="+o[l].split(";")[0]));return document.cookie=t+"="+n+c}}function i(e,n){if("undefined"!==typeof document){for(var a={},o=document.cookie?document.cookie.split("; "):[],i=0;i<o.length;i++){var c=o[i].split("="),l=c.slice(1).join("=");n||'"'!==l.charAt(0)||(l=l.slice(1,-1));try{var s=t(c[0]);if(l=(r.read||r)(l,s)||t(l),n)try{l=JSON.parse(l)}catch(u){}if(a[s]=l,e===s)break}catch(u){}}return e?a[e]:a}}return a.set=o,a.get=function(e){return i(e,!1)},a.getJSON=function(e){return i(e,!0)},a.remove=function(t,n){o(t,"",e(n,{expires:-1}))},a.defaults={},a.withConverter=n,a}((function(){}))}))}},[["OXNG",0,2,1,3,4,5,6,9,8,7,12,14]]]);