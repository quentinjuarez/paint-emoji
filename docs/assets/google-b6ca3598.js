import{d as c,L as a,M as i,i as u,f as l,c as p,m as _,a as s,o as h,_ as m}from"./index-23249a80.js";const f={class:"m-auto flex size-20 h-screen items-center justify-center"},d=s("svg",{class:"animate-spin text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24"},[s("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"}),s("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"})],-1),g=c({__name:"google",setup(w){const t=a(),o=i(),r=u();return l(async()=>{try{const{code:e}=t.query;return e&&await r.loginGoogle({code:e})&&o.push("/"),o.push("/")}catch(e){console.error(e),o.push("/")}}),(e,n)=>(h(),p("div",f,[_(" LOADING SVG "),d]))}}),y=m(g,[["__file","/Users/quentinjuarez/Documents/Perso/shape-emoji-vue/src/pages/oauth/google.vue"]]);export{y as default};
