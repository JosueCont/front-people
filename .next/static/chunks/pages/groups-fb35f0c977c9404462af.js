_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[37],{"/MfK":function(e,t,n){"use strict";var c=n("q1tI"),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"}}]},name:"delete",theme:"outlined"},i=n("6VBw"),r=function(e,t){return c.createElement(i.a,Object.assign({},e,{ref:t,icon:a}))};r.displayName="DeleteOutlined";t.a=c.forwardRef(r)},FZg4:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/groups",function(){return n("Gjly")}])},Gjly:function(e,t,n){"use strict";n.r(t);var c=n("o0o1"),a=n.n(c),i=n("HaE+"),r=n("ODXe"),o=n("nKUr"),s=n("Ol7k"),u=n("ZTPi"),l=n("kLXV"),d=n("Vl3Y"),f=n("tsqr"),h=n("BMrR"),j=n("kPKH"),p=n("bE4q"),m=n("2/Rp"),b=n("wCAj"),g=n("RCxd"),O=n("G3dp"),v=n("/MfK"),x=n("xvlK"),w=n("foez"),y=n("vDqi"),k=n.n(y),_=n("OcYQ"),E=n("nOHt"),N=n("q1tI"),C=s.a.Content,H=(u.a.TabPane,l.a.confirm);t.default=function(){var e=Object(E.useRouter)(),t=d.a.useForm(),n=(Object(r.a)(t,1)[0],Object(N.useState)(!1)),c=n[0],s=n[1],u=Object(N.useState)([]),l=u[0],y=u[1],I={"client-id":"5f417a53c37f6275fb614104","Content-Type":"application/json"},T=function(e){s(!0),k.a.get(_.c+"/group/list/",{headers:I}).then((function(e){e.data.data.map((function(e){e.key=e.id,e.timestamp=e.timestamp.substring(0,10)})),y(e.data.data),s(!1)})).catch((function(e){console.log(e)}))},P=function(){var e=Object(i.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n={id:t},k.a.post(_.c+"/group/delete/",n,{headers:I}).then((function(e){200===e.status&&(f.b.success({content:"Group eliminado satisfactoriamente",className:"custom-class",style:{marginTop:"20vh"}}),console.log("Elemento Eliminado",t),T())})).catch((function(e){f.b.error({content:"An error occurred",className:"custom-class",style:{marginTop:"20vh"}}),console.log(e)}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();Object(N.useEffect)((function(){T()}),[]);var q=[{title:"Nombre",dataIndex:"name",key:"name"},{title:"Fecha de creaci\xf3n",render:function(e){return Object(o.jsx)("div",{children:e.timestamp})}},{title:"Opciones",key:"id",render:function(t,n){return Object(o.jsx)("div",{children:Object(o.jsxs)(h.a,{gutter:16,children:[Object(o.jsx)(j.a,{className:"gutter-row",span:6,children:Object(o.jsx)("a",{onClick:function(){return e.push({pathname:"/groups/add",query:{type:"edit",id:n.id}})},children:Object(o.jsx)(O.a,{})})}),Object(o.jsx)(j.a,{className:"gutter-row",span:6,children:Object(o.jsx)(v.a,{onClick:function(){return e=n.id,void H({title:"Esta seguro de eliminar el elemento?",icon:Object(o.jsx)(g.a,{}),content:"Si elimina el elemento no podr\xe1 recuperarlo",onOk:function(){P(e)},onCancel:function(){}});var e}})})]})})}}];return Object(o.jsxs)(w.a,{currentKey:"1",children:[Object(o.jsxs)(p.a,{style:{margin:"16px 0"},children:[Object(o.jsx)(p.a.Item,{children:"Inicio"}),Object(o.jsx)(p.a.Item,{children:"Groups"})]}),Object(o.jsxs)(C,{className:"site-layout",children:[Object(o.jsx)("div",{style:{padding:"1%",float:"right"},children:Object(o.jsxs)(m.a,{style:{background:"#fa8c16",fontWeight:"bold",color:"white"},onClick:function(){return e.push({pathname:"/groups/add"})},children:[Object(o.jsx)(x.a,{}),"Agregar grupo"]})}),Object(o.jsx)("div",{className:"site-layout-background",style:{padding:24,minHeight:380,height:"100%"},children:Object(o.jsx)(b.a,{size:"small",columns:q,dataSource:l,loading:c})})]})]})}},OcYQ:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return c})),n.d(t,"c",(function(){return a})),n.d(t,"b",(function(){return i}));var c=e.env.NEXT_PUBLIC_API_BASE_URL,a="https://khonnect.hiumanlab.com",i="5fa42a1ca6f5f821bbe7fbea"}).call(this,n("8oxB"))}},[["FZg4",0,2,1,3,6,5,4,7,8,11,10,12,13,17]]]);