(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[13],{"+QRC":function(e,t,n){"use strict";var r=n("E9nw"),i={"text/plain":"Text","text/html":"Url",default:"Text"};e.exports=function(e,t){var n,a,o,l,c,s,p=!1;t||(t={}),n=t.debug||!1;try{if(o=r(),l=document.createRange(),c=document.getSelection(),(s=document.createElement("span")).textContent=e,s.style.all="unset",s.style.position="fixed",s.style.top=0,s.style.clip="rect(0, 0, 0, 0)",s.style.whiteSpace="pre",s.style.webkitUserSelect="text",s.style.MozUserSelect="text",s.style.msUserSelect="text",s.style.userSelect="text",s.addEventListener("copy",(function(r){if(r.stopPropagation(),t.format)if(r.preventDefault(),"undefined"===typeof r.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var a=i[t.format]||i.default;window.clipboardData.setData(a,e)}else r.clipboardData.clearData(),r.clipboardData.setData(t.format,e);t.onCopy&&(r.preventDefault(),t.onCopy(r.clipboardData))})),document.body.appendChild(s),l.selectNodeContents(s),c.addRange(l),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");p=!0}catch(d){n&&console.error("unable to copy using execCommand: ",d),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),p=!0}catch(d){n&&console.error("unable to copy using clipboardData: ",d),n&&console.error("falling back to prompt"),a=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"\u2318":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:"Copy to clipboard: #{key}, Enter"),window.prompt(a,e)}}finally{c&&("function"==typeof c.removeRange?c.removeRange(l):c.removeAllRanges()),s&&document.body.removeChild(s),o()}return p}},E9nw:function(e,t){e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],r=0;r<e.rangeCount;r++)n.push(e.getRangeAt(r));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach((function(t){e.addRange(t)})),t&&t.focus()}}},oI91:function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},wFql:function(e,t,n){"use strict";var r=n("wx14"),i=n("rePB"),a=n("q1tI"),o=n("TSYQ"),l=n.n(o),c=n("c+Xe"),s=n("H84U"),p=n("uaoM"),d=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},u=function(e,t){var n=e.prefixCls,o=e.component,u=void 0===o?"article":o,f=e.className,y=e["aria-label"],b=e.setContentRef,m=e.children,h=d(e,["prefixCls","component","className","aria-label","setContentRef","children"]),v=t;return b&&(Object(p.a)(!1,"Typography","`setContentRef` is deprecated. Please use `ref` instead."),v=Object(c.a)(t,b)),a.createElement(s.a,null,(function(e){var t=e.getPrefixCls,o=e.direction,c=u,s=t("typography",n),p=l()(s,Object(i.a)({},"".concat(s,"-rtl"),"rtl"===o),f);return a.createElement(c,Object(r.a)({className:p,"aria-label":y,ref:v},h),m)}))},f=a.forwardRef(u);f.displayName="Typography";var y=f,b=n("U8pU"),m=n("bT9E"),h=n("KQm4"),v=n("1OyB"),g=n("vuIU"),O=n("Ji7U"),E=n("LK+K"),x=n("Zm9Q"),C=n("+QRC"),w=n.n(C),j=n("G3dp"),S=n("bRQS"),k={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"}}]},name:"copy",theme:"outlined"},N=n("6VBw"),R=function(e,t){return a.createElement(N.a,Object.assign({},e,{ref:t,icon:k}))};R.displayName="CopyOutlined";var T=a.forwardRef(R),P=n("t23M"),I=n("wEI+"),D=n("YMnH"),A=n("4IlW"),H=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},z={border:0,background:"transparent",padding:0,lineHeight:"inherit",display:"inline-block"},U=a.forwardRef((function(e,t){var n=e.style,i=e.noStyle,o=e.disabled,l=H(e,["style","noStyle","disabled"]),c={};return i||(c=Object(r.a)({},z)),o&&(c.pointerEvents="none"),c=Object(r.a)(Object(r.a)({},c),n),a.createElement("div",Object(r.a)({role:"button",tabIndex:0,ref:t},l,{onKeyDown:function(e){e.keyCode===A.a.ENTER&&e.preventDefault()},onKeyUp:function(t){var n=t.keyCode,r=e.onClick;n===A.a.ENTER&&r&&r()},style:c}))})),M=n("oHiP"),L=function(e){if("undefined"!==typeof window&&window.document&&window.document.documentElement){var t=Array.isArray(e)?e:[e],n=window.document.documentElement;return t.some((function(e){return e in n.style}))}return!1},F=(L(["flex","webkitFlex","Flex","msFlex"]),n("3S7+")),K=n("ODXe"),B={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M864 170h-60c-4.4 0-8 3.6-8 8v518H310v-73c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 000 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-75h498c35.3 0 64-28.7 64-64V178c0-4.4-3.6-8-8-8z"}}]},name:"enter",theme:"outlined"},Q=function(e,t){return a.createElement(N.a,Object.assign({},e,{ref:t,icon:B}))};Q.displayName="EnterOutlined";var V,W=a.forwardRef(Q),_=n("whJP"),J=function(e){var t=e.prefixCls,n=e["aria-label"],r=e.className,o=e.style,c=e.direction,s=e.maxLength,p=e.autoSize,d=void 0===p||p,u=e.value,f=e.onSave,y=e.onCancel,b=a.useRef(),m=a.useRef(!1),h=a.useRef(),v=a.useState(u),g=Object(K.a)(v,2),O=g[0],E=g[1];a.useEffect((function(){E(u)}),[u]),a.useEffect((function(){if(b.current&&b.current.resizableTextArea){var e=b.current.resizableTextArea.textArea;e.focus();var t=e.value.length;e.setSelectionRange(t,t)}}),[]);var x=function(){f(O.trim())},C=l()(t,"".concat(t,"-edit-content"),Object(i.a)({},"".concat(t,"-rtl"),"rtl"===c),r);return a.createElement("div",{className:C,style:o},a.createElement(_.a,{ref:b,maxLength:s,value:O,onChange:function(e){var t=e.target;E(t.value.replace(/[\n\r]/g,""))},onKeyDown:function(e){var t=e.keyCode;m.current||(h.current=t)},onKeyUp:function(e){var t=e.keyCode,n=e.ctrlKey,r=e.altKey,i=e.metaKey,a=e.shiftKey;h.current!==t||m.current||n||r||i||a||(t===A.a.ENTER?x():t===A.a.ESC&&y())},onCompositionStart:function(){m.current=!0},onCompositionEnd:function(){m.current=!1},onBlur:function(){x()},"aria-label":n,autoSize:d}),a.createElement(W,{className:"".concat(t,"-edit-content-confirm")}))},X=n("i8i4"),q={padding:0,margin:0,display:"inline",lineHeight:"inherit"};function Y(e){if(!e)return 0;var t=e.match(/^\d*(\.\d*)?/);return t?Number(t[0]):0}var G=function(e,t,n,r,i){V||((V=document.createElement("div")).setAttribute("aria-hidden","true"),document.body.appendChild(V));var o,l=t.rows,c=t.suffix,s=void 0===c?"":c,p=window.getComputedStyle(e),d=(o=p,Array.prototype.slice.apply(o).map((function(e){return"".concat(e,": ").concat(o.getPropertyValue(e),";")})).join("")),u=Y(p.lineHeight),f=Math.round(u*(l+1)+Y(p.paddingTop)+Y(p.paddingBottom));V.setAttribute("style",d),V.style.position="fixed",V.style.left="0",V.style.height="auto",V.style.minHeight="auto",V.style.maxHeight="auto",V.style.top="-999999px",V.style.zIndex="-1000",V.style.textOverflow="clip",V.style.whiteSpace="normal",V.style.webkitLineClamp="none";var y=function(e){var t=[];return e.forEach((function(e){var n=t[t.length-1];"string"===typeof e&&"string"===typeof n?t[t.length-1]+=e:t.push(e)})),t}(Object(x.a)(n));function b(){return V.offsetHeight<f}if(Object(X.render)(a.createElement("div",{style:q},a.createElement("span",{style:q},y,s),a.createElement("span",{style:q},r)),V),b())return Object(X.unmountComponentAtNode)(V),{content:n,text:V.innerHTML,ellipsis:!1};var m=Array.prototype.slice.apply(V.childNodes[0].childNodes[0].cloneNode(!0).childNodes).filter((function(e){return 8!==e.nodeType})),h=Array.prototype.slice.apply(V.childNodes[0].childNodes[1].cloneNode(!0).childNodes);Object(X.unmountComponentAtNode)(V);var v=[];V.innerHTML="";var g=document.createElement("span");V.appendChild(g);var O=document.createTextNode(i+s);function E(e){g.insertBefore(e,O)}function C(e,t){var n=e.nodeType;if(1===n)return E(e),b()?{finished:!1,reactNode:y[t]}:(g.removeChild(e),{finished:!0,reactNode:null});if(3===n){var r=e.textContent||"",i=document.createTextNode(r);return E(i),function e(t,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:n.length,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,o=Math.floor((r+i)/2),l=n.slice(0,o);if(t.textContent=l,r>=i-1)for(var c=i;c>=r;c-=1){var s=n.slice(0,c);if(t.textContent=s,b()||!s)return c===n.length?{finished:!1,reactNode:n}:{finished:!0,reactNode:s}}return b()?e(t,n,o,i,o):e(t,n,r,o,a)}(i,r)}return{finished:!1,reactNode:null}}return g.appendChild(O),h.forEach((function(e){V.appendChild(e)})),m.some((function(e,t){var n=C(e,t),r=n.finished,i=n.reactNode;return i&&v.push(i),r})),{content:v,text:V.innerHTML,ellipsis:!0}},Z=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},$=L("webkitLineClamp"),ee=L("textOverflow");var te=function(e){Object(O.a)(n,e);var t=Object(E.a)(n);function n(){var e;return Object(v.a)(this,n),(e=t.apply(this,arguments)).contentRef=a.createRef(),e.state={edit:!1,copied:!1,ellipsisText:"",ellipsisContent:null,isEllipsis:!1,expanded:!1,clientRendered:!1},e.getPrefixCls=function(){var t=e.props.prefixCls;return(0,e.context.getPrefixCls)("typography",t)},e.onExpandClick=function(t){var n=e.getEllipsis().onExpand;e.setState({expanded:!0}),n&&n(t)},e.onEditClick=function(){e.triggerEdit(!0)},e.onEditChange=function(t){var n=e.getEditable().onChange;n&&n(t),e.triggerEdit(!1)},e.onEditCancel=function(){e.triggerEdit(!1)},e.onCopyClick=function(t){t.preventDefault();var n=e.props,i=n.children,a=n.copyable,o=Object(r.a)({},"object"===Object(b.a)(a)?a:null);void 0===o.text&&(o.text=String(i)),w()(o.text||""),e.setState({copied:!0},(function(){o.onCopy&&o.onCopy(),e.copyId=window.setTimeout((function(){e.setState({copied:!1})}),3e3)}))},e.setEditRef=function(t){e.editIcon=t},e.triggerEdit=function(t){var n=e.getEditable().onStart;t&&n&&n(),e.setState({edit:t},(function(){!t&&e.editIcon&&e.editIcon.focus()}))},e.resizeOnNextFrame=function(){M.a.cancel(e.rafId),e.rafId=Object(M.a)((function(){e.syncEllipsis()}))},e}return Object(g.a)(n,[{key:"componentDidMount",value:function(){this.setState({clientRendered:!0}),this.resizeOnNextFrame()}},{key:"componentDidUpdate",value:function(e){var t=this.props.children,n=this.getEllipsis(),r=this.getEllipsis(e);t===e.children&&n.rows===r.rows||this.resizeOnNextFrame()}},{key:"componentWillUnmount",value:function(){window.clearTimeout(this.copyId),M.a.cancel(this.rafId)}},{key:"getEditable",value:function(e){var t=this.state.edit,n=(e||this.props).editable;return n?Object(r.a)({editing:t},"object"===Object(b.a)(n)?n:null):{editing:t}}},{key:"getEllipsis",value:function(e){var t=(e||this.props).ellipsis;return t?Object(r.a)({rows:1,expandable:!1},"object"===Object(b.a)(t)?t:null):{}}},{key:"canUseCSSEllipsis",value:function(){var e=this.state.clientRendered,t=this.props,n=t.editable,r=t.copyable,i=this.getEllipsis(),a=i.rows,o=i.expandable,l=i.suffix,c=i.onEllipsis,s=i.tooltip;return!l&&!s&&(!(n||r||o||!e||c)&&(1===a?ee:$))}},{key:"syncEllipsis",value:function(){var e=this.state,t=e.ellipsisText,n=e.isEllipsis,r=e.expanded,i=this.getEllipsis(),a=i.rows,o=i.suffix,l=i.onEllipsis,c=this.props.children;if(a&&!(a<0)&&this.contentRef.current&&!r&&!this.canUseCSSEllipsis()){Object(p.a)(Object(x.a)(c).every((function(e){return"string"===typeof e})),"Typography","`ellipsis` should use string as children only.");var s=G(this.contentRef.current,{rows:a,suffix:o},c,this.renderOperations(!0),"..."),d=s.content,u=s.text,f=s.ellipsis;t===u&&n===f||(this.setState({ellipsisText:u,ellipsisContent:d,isEllipsis:f}),n!==f&&l&&l(f))}}},{key:"renderExpand",value:function(e){var t,n=this.getEllipsis(),r=n.expandable,i=n.symbol,o=this.state,l=o.expanded,c=o.isEllipsis;return r&&(e||!l&&c)?(t=i||this.expandStr,a.createElement("a",{key:"expand",className:"".concat(this.getPrefixCls(),"-expand"),onClick:this.onExpandClick,"aria-label":this.expandStr},t)):null}},{key:"renderEdit",value:function(){var e=this.props.editable;if(e){var t=e.icon,n=e.tooltip,r=Object(x.a)(n)[0]||this.editStr,i="string"===typeof r?r:"";return a.createElement(F.a,{key:"edit",title:!1===n?"":r},a.createElement(U,{ref:this.setEditRef,className:"".concat(this.getPrefixCls(),"-edit"),onClick:this.onEditClick,"aria-label":i},t||a.createElement(j.a,{role:"button"})))}}},{key:"renderCopy",value:function(){var e=this.state.copied,t=this.props.copyable;if(t){var n=this.getPrefixCls(),r=t.tooltips,i=Object(x.a)(r);0===i.length&&(i=[this.copyStr,this.copiedStr]);var o=e?i[1]:i[0],c="string"===typeof o?o:"",s=Object(x.a)(t.icon);return a.createElement(F.a,{key:"copy",title:!1===r?"":o},a.createElement(U,{className:l()("".concat(n,"-copy"),e&&"".concat(n,"-copy-success")),onClick:this.onCopyClick,"aria-label":c},e?s[1]||a.createElement(S.a,null):s[0]||a.createElement(T,null)))}}},{key:"renderEditInput",value:function(){var e=this.props,t=e.children,n=e.className,r=e.style,i=this.context.direction,o=this.getEditable(),l=o.maxLength,c=o.autoSize;return a.createElement(J,{value:"string"===typeof t?t:"",onSave:this.onEditChange,onCancel:this.onEditCancel,prefixCls:this.getPrefixCls(),className:n,style:r,direction:i,maxLength:l,autoSize:c})}},{key:"renderOperations",value:function(e){return[this.renderExpand(e),this.renderEdit(),this.renderCopy()].filter((function(e){return e}))}},{key:"renderContent",value:function(){var e=this,t=this.state,n=t.ellipsisContent,o=t.isEllipsis,c=t.expanded,s=this.props,p=s.component,d=s.children,u=s.className,f=s.type,b=s.disabled,v=s.style,g=Z(s,["component","children","className","type","disabled","style"]),O=this.context.direction,E=this.getEllipsis(),x=E.rows,C=E.suffix,w=E.tooltip,j=this.getPrefixCls(),S=Object(m.a)(g,["prefixCls","editable","copyable","ellipsis","mark","code","delete","underline","strong","keyboard"].concat(Object(h.a)(I.a))),k=this.canUseCSSEllipsis(),N=1===x&&k,R=x&&x>1&&k,T=d;if(x&&o&&!c&&!k){var A=g.title,H=A||"";A||"string"!==typeof d&&"number"!==typeof d||(H=String(d)),H=null===H||void 0===H?void 0:H.slice(String(n||"").length),T=a.createElement(a.Fragment,null,n,a.createElement("span",{title:H,"aria-hidden":"true"},"..."),C),w&&(T=a.createElement(F.a,{title:!0===w?d:w},a.createElement("span",null,T)))}else T=a.createElement(a.Fragment,null,d,C);return T=function(e,t){var n=e.mark,r=e.code,i=e.underline,o=e.delete,l=e.strong,c=e.keyboard,s=t;function p(e,t){e&&(s=a.createElement(t,{},s))}return p(l,"strong"),p(i,"u"),p(o,"del"),p(r,"code"),p(n,"mark"),p(c,"kbd"),s}(this.props,T),a.createElement(D.a,{componentName:"Text"},(function(t){var n,o=t.edit,c=t.copy,s=t.copied,d=t.expand;return e.editStr=o,e.copyStr=c,e.copiedStr=s,e.expandStr=d,a.createElement(P.a,{onResize:e.resizeOnNextFrame,disabled:!x},a.createElement(y,Object(r.a)({className:l()((n={},Object(i.a)(n,"".concat(j,"-").concat(f),f),Object(i.a)(n,"".concat(j,"-disabled"),b),Object(i.a)(n,"".concat(j,"-ellipsis"),x),Object(i.a)(n,"".concat(j,"-ellipsis-single-line"),N),Object(i.a)(n,"".concat(j,"-ellipsis-multiple-line"),R),n),u),style:Object(r.a)(Object(r.a)({},v),{WebkitLineClamp:R?x:void 0}),component:p,ref:e.contentRef,direction:O},S),T,e.renderOperations()))}))}},{key:"render",value:function(){return this.getEditable().editing?this.renderEditInput():this.renderContent()}}],[{key:"getDerivedStateFromProps",value:function(e){var t=e.children,n=e.editable;return Object(p.a)(!n||"string"===typeof t,"Typography","When `editable` is enabled, the `children` should use string."),{}}}]),n}(a.Component);te.contextType=s.b,te.defaultProps={children:""};var ne=te,re=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},ie=function(e){var t=e.ellipsis,n=re(e,["ellipsis"]),i=a.useMemo((function(){return t&&"object"===Object(b.a)(t)?Object(m.a)(t,["expandable","rows"]):t}),[t]);return Object(p.a)("object"!==Object(b.a)(t)||!t||!("expandable"in t)&&!("rows"in t),"Typography.Text","`ellipsis` do not support `expandable` or `rows` props."),a.createElement(ne,Object(r.a)({},n,{ellipsis:i,component:"span"}))},ae=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},oe=function(e,t){var n=e.ellipsis,i=e.rel,o=ae(e,["ellipsis","rel"]);Object(p.a)("object"!==Object(b.a)(n),"Typography.Link","`ellipsis` only supports boolean value.");var l=a.useRef(null);a.useImperativeHandle(t,(function(){var e;return null===(e=l.current)||void 0===e?void 0:e.contentRef.current}));var c=Object(r.a)(Object(r.a)({},o),{rel:void 0===i&&"_blank"===o.target?"noopener noreferrer":i});return delete c.navigate,a.createElement(ne,Object(r.a)({},c,{ref:l,ellipsis:!!n,component:"a"}))},le=a.forwardRef(oe),ce=n("CWQg"),se=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},pe=Object(ce.b)(1,2,3,4,5),de=function(e){var t,n=e.level,i=void 0===n?1:n,o=se(e,["level"]);return-1!==pe.indexOf(i)?t="h".concat(i):(Object(p.a)(!1,"Typography.Title","Title only accept `1 | 2 | 3 | 4 | 5` as `level` value. And `5` need 4.6.0+ version."),t="h1"),a.createElement(ne,Object(r.a)({},o,{component:t}))},ue=function(e){return a.createElement(ne,Object(r.a)({},e,{component:"div"}))},fe=y;fe.Text=ie,fe.Link=le,fe.Title=de,fe.Paragraph=ue;t.a=fe}}]);