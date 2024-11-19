/*! For license information please see background.js.LICENSE.txt */
(()=>{"use strict";var e={15287:(e,t)=>{var r=Symbol.for("react.element"),n=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),c=Symbol.for("react.profiler"),a=Symbol.for("react.provider"),s=Symbol.for("react.context"),i=Symbol.for("react.forward_ref"),l=Symbol.for("react.suspense"),f=Symbol.for("react.memo"),d=Symbol.for("react.lazy"),p=Symbol.iterator,y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},m=Object.assign,h={};function g(e,t,r){this.props=e,this.context=t,this.refs=h,this.updater=r||y}function b(){}function v(e,t,r){this.props=e,this.context=t,this.refs=h,this.updater=r||y}g.prototype.isReactComponent={},g.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},g.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},b.prototype=g.prototype;var S=v.prototype=new b;S.constructor=v,m(S,g.prototype),S.isPureReactComponent=!0;var _=Array.isArray,k=Object.prototype.hasOwnProperty,E={current:null},C={key:!0,ref:!0,__self:!0,__source:!0};function w(e,t,n){var o,u={},c=null,a=null;if(null!=t)for(o in void 0!==t.ref&&(a=t.ref),void 0!==t.key&&(c=""+t.key),t)k.call(t,o)&&!C.hasOwnProperty(o)&&(u[o]=t[o]);var s=arguments.length-2;if(1===s)u.children=n;else if(1<s){for(var i=Array(s),l=0;l<s;l++)i[l]=arguments[l+2];u.children=i}if(e&&e.defaultProps)for(o in s=e.defaultProps)void 0===u[o]&&(u[o]=s[o]);return{$$typeof:r,type:e,key:c,ref:a,props:u,_owner:E.current}}function R(e){return"object"==typeof e&&null!==e&&e.$$typeof===r}var j=/\/+/g;function U(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,(function(e){return t[e]}))}(""+e.key):t.toString(36)}function O(e,t,o,u,c){var a=typeof e;"undefined"!==a&&"boolean"!==a||(e=null);var s=!1;if(null===e)s=!0;else switch(a){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case r:case n:s=!0}}if(s)return c=c(s=e),e=""===u?"."+U(s,0):u,_(c)?(o="",null!=e&&(o=e.replace(j,"$&/")+"/"),O(c,t,o,"",(function(e){return e}))):null!=c&&(R(c)&&(c=function(e,t){return{$$typeof:r,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(c,o+(!c.key||s&&s.key===c.key?"":(""+c.key).replace(j,"$&/")+"/")+e)),t.push(c)),1;if(s=0,u=""===u?".":u+":",_(e))for(var i=0;i<e.length;i++){var l=u+U(a=e[i],i);s+=O(a,t,o,l,c)}else if(l=function(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=p&&e[p]||e["@@iterator"])?e:null}(e),"function"==typeof l)for(e=l.call(e),i=0;!(a=e.next()).done;)s+=O(a=a.value,t,o,l=u+U(a,i++),c);else if("object"===a)throw t=String(e),Error("Objects are not valid as a React child (found: "+("[object Object]"===t?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function x(e,t,r){if(null==e)return e;var n=[],o=0;return O(e,n,"","",(function(e){return t.call(r,e,o++)})),n}function $(e){if(-1===e._status){var t=e._result;(t=t()).then((function(t){0!==e._status&&-1!==e._status||(e._status=1,e._result=t)}),(function(t){0!==e._status&&-1!==e._status||(e._status=2,e._result=t)})),-1===e._status&&(e._status=0,e._result=t)}if(1===e._status)return e._result.default;throw e._result}var P={current:null},I={transition:null},L={ReactCurrentDispatcher:P,ReactCurrentBatchConfig:I,ReactCurrentOwner:E};function T(){throw Error("act(...) is not supported in production builds of React.")}t.Children={map:x,forEach:function(e,t,r){x(e,(function(){t.apply(this,arguments)}),r)},count:function(e){var t=0;return x(e,(function(){t++})),t},toArray:function(e){return x(e,(function(e){return e}))||[]},only:function(e){if(!R(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},t.Component=g,t.Fragment=o,t.Profiler=c,t.PureComponent=v,t.StrictMode=u,t.Suspense=l,t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=L,t.act=T,t.cloneElement=function(e,t,n){if(null==e)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=m({},e.props),u=e.key,c=e.ref,a=e._owner;if(null!=t){if(void 0!==t.ref&&(c=t.ref,a=E.current),void 0!==t.key&&(u=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(i in t)k.call(t,i)&&!C.hasOwnProperty(i)&&(o[i]=void 0===t[i]&&void 0!==s?s[i]:t[i])}var i=arguments.length-2;if(1===i)o.children=n;else if(1<i){s=Array(i);for(var l=0;l<i;l++)s[l]=arguments[l+2];o.children=s}return{$$typeof:r,type:e.type,key:u,ref:c,props:o,_owner:a}},t.createContext=function(e){return(e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null}).Provider={$$typeof:a,_context:e},e.Consumer=e},t.createElement=w,t.createFactory=function(e){var t=w.bind(null,e);return t.type=e,t},t.createRef=function(){return{current:null}},t.forwardRef=function(e){return{$$typeof:i,render:e}},t.isValidElement=R,t.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:$}},t.memo=function(e,t){return{$$typeof:f,type:e,compare:void 0===t?null:t}},t.startTransition=function(e){var t=I.transition;I.transition={};try{e()}finally{I.transition=t}},t.unstable_act=T,t.useCallback=function(e,t){return P.current.useCallback(e,t)},t.useContext=function(e){return P.current.useContext(e)},t.useDebugValue=function(){},t.useDeferredValue=function(e){return P.current.useDeferredValue(e)},t.useEffect=function(e,t){return P.current.useEffect(e,t)},t.useId=function(){return P.current.useId()},t.useImperativeHandle=function(e,t,r){return P.current.useImperativeHandle(e,t,r)},t.useInsertionEffect=function(e,t){return P.current.useInsertionEffect(e,t)},t.useLayoutEffect=function(e,t){return P.current.useLayoutEffect(e,t)},t.useMemo=function(e,t){return P.current.useMemo(e,t)},t.useReducer=function(e,t,r){return P.current.useReducer(e,t,r)},t.useRef=function(e){return P.current.useRef(e)},t.useState=function(e){return P.current.useState(e)},t.useSyncExternalStore=function(e,t,r){return P.current.useSyncExternalStore(e,t,r)},t.useTransition=function(){return P.current.useTransition()},t.version="18.3.1"},96540:(e,t,r)=>{e.exports=r(15287)},3507:(e,t,r)=>{const n=(0,r(42341).create)((e=>(chrome.storage.local.get(["task","currentUrl","isContentDetected"],(t=>{e({task:t.task||null,currentUrl:t.currentUrl||null,isContentDetected:t.isContentDetected||!1})})),{task:null,currentUrl:null,isContentDetected:!1,setTask:t=>{e({task:t}),chrome.storage.local.set({task:t})},setCurrentUrl:t=>{e({currentUrl:t}),chrome.storage.local.set({currentUrl:t})},setContentDetected:t=>{e({isContentDetected:t}),chrome.storage.local.set({isContentDetected:t})}})));t.default=n},42341:(e,t,r)=>{var n=r(7978),o=r(71778);Object.keys(n).forEach((function(e){"default"===e||Object.prototype.hasOwnProperty.call(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:function(){return n[e]}})})),Object.keys(o).forEach((function(e){"default"===e||Object.prototype.hasOwnProperty.call(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})}))},71778:(e,t,r)=>{var n=r(96540),o=r(7978);const u=e=>e;function c(e,t=u){const r=n.useSyncExternalStore(e.subscribe,(()=>t(e.getState())),(()=>t(e.getInitialState())));return n.useDebugValue(r),r}const a=e=>{const t=o.createStore(e),r=e=>c(t,e);return Object.assign(r,t),r};t.create=e=>e?a(e):a,t.useStore=c},7978:(e,t)=>{const r=e=>{let t;const r=new Set,n=(e,n)=>{const o="function"==typeof e?e(t):e;if(!Object.is(o,t)){const e=t;t=(null!=n?n:"object"!=typeof o||null===o)?o:Object.assign({},t,o),r.forEach((r=>r(t,e)))}},o=()=>t,u={setState:n,getState:o,getInitialState:()=>c,subscribe:e=>(r.add(e),()=>r.delete(e))},c=t=e(n,o,u);return u};t.createStore=e=>e?r(e):r}},t={},r=function r(n){var o=t[n];if(void 0!==o)return o.exports;var u=t[n]={exports:{}};return e[n](u,u.exports,r),u.exports}(3507);chrome.tabs.onUpdated.addListener(((e,t,r)=>{r.url.startsWith("chrome://")||"complete"===t.status&&r.url&&chrome.tabs.sendMessage(e,{action:"triggerCheckContent",forceVisible:!1})})),chrome.action.onClicked.addListener((e=>{chrome.tabs.sendMessage(e.id,{action:"toggleTaskCard"})})),chrome.runtime.onMessage.addListener(((e,t,r)=>{if("getCurrentTabUrl"===e.action)return chrome.tabs.query({active:!0,currentWindow:!0},(e=>{e.length>0&&e[0].url?r({url:e[0].url}):(console.error("No active tab or URL found"),r({error:"No active tab or URL found"}))})),!0})),chrome.runtime.onMessage.addListener(((e,t,n)=>{if("checkContent"===e.action){const{forceVisible:n}=e;return console.log("fv1",n),chrome.tabs.query({active:!0,currentWindow:!0},(async e=>{if(chrome.runtime.lastError)return void console.error("Error querying tabs:",chrome.runtime.lastError.message);if(0===e.length||!e[0].url)return void console.error("No active tab or URL found.");const o=e[0]?.url;if(o)try{const e=await fetch("http://localhost:5001/api/check-content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:o})}),u=await e.json(),c=u.exists&&"Completed"===u.task.progress,a=u.exists?u.task:null;console.log("isdet",c),r.default.getState().setTask(a),console.log("GETTING STATE",a),r.default.getState().setCurrentUrl(o),r.default.getState().setContentDetected(c),console.log("Updated task in background:",r.default.getState().task),console.log("Updated URL in background:",r.default.getState().currentUrl),chrome.scripting.executeScript({target:{tabId:t.tab.id},func:(e,t)=>{let r=document.getElementById("popup-root");r&&r.remove(),r=document.getElementById("popup-root"),r||(r=document.createElement("div"),r.id="popup-root",document.body.appendChild(r)),console.log("fv2",t),console.log("isDetected:",e),console.log("forceVisible:",t),e||t?(r.className="task-card-visible",console.log("fv3",e),console.log("fv31",e||t)):(r.className="task-card-hidden",console.log("fv4",e))},args:[c,n]},(()=>{chrome.runtime.lastError?console.error("Error during executeScript:",chrome.runtime.lastError.message):(console.log("Globals set and popup-root created if needed"),chrome.scripting.executeScript({target:{tabId:t.tab.id},files:["popup.js"]}))}))}catch(e){console.error("Error checking content:",e)}})),!0}})),chrome.runtime.onMessage.addListener(((e,t,r)=>{if("captureImage"===e.action)return chrome.tabs.query({active:!0,currentWindow:!0},(async e=>{const t=e[0].url;if(console.log("test1"),e[0].id){if(console.log("Current URL:",t),!t)return console.error("Current URL is undefined"),void r({error:"Current URL is undefined"});try{console.log("test2"),chrome.scripting.executeScript({target:{tabId:e[0].id},func:e=>{console.log("test3");let t=0,r=null;if(!e)return console.error("Passed URL is undefined inside func"),null;if(-1!==e.indexOf("youtube.com")&&-1!==e.indexOf("/watch")){const t=new URL(e).searchParams.get("v");console.log(t),t&&(img.src=`https://img.youtube.com/vi/${t}/maxresdefault.jpg`,r=img)}return r||document.querySelectorAll("img").forEach((e=>{if(e.offsetHeight&&e.offsetWidth&&null!==e.offsetParent){const n=e.offsetHeight*e.offsetWidth;n>t&&(t=n,r=e)}})),r?r.src:null},args:[t]},(e=>{const t=e[0].result;r({imageUrl:t})}))}catch(e){console.error("Error during script execution:",e)}}})),!0}))})();