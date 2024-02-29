/*!
 * Vueform Mask Plugin v1.0.0 (https://github.com/vueform/plugin-mask)
 * Copyright (c) 2024-present Adam Berecz <adam@vueform.com>
 * Licensed under the MIT License
 */

import{toRefs as e,ref as a,computed as l,onMounted as u,watch as t}from"vue";import v from"imask";var o={apply:"TextElement",props:{mask:{required:!1,type:[String,Object,Array,Function]},unmask:{require:!1,type:Boolean,default:!1},allowIncomplete:{require:!1,type:Boolean,default:!1}},setup(o,n,s){const{mask:r,inputType:p,formatLoad:m,unmask:d,allowIncomplete:i}=e(o);if(!r.value)return s;const{nullValue:k,value:y,el$:f,path:c,form$:V}=s,w=a(null),x=a(y.value),I=l((()=>"string"==typeof r.value?{mask:r.value}:"function"==typeof r.value?r.value(v):r.value)),M=l({get:()=>x.value,set:e=>x.value=e}),g=()=>"text"===p.value||(console.error(`Input mask only works with type="text" (found at: '${c.value}').`),!1),h=()=>{M.value=w.value.displayValue,i.value||w.value.masked.isComplete?y.value=d.value?w.value.masked.unmaskedValue:w.value.displayValue:y.value=k.value},q=()=>{w.value&&w.value.destroy()},$=()=>{w.value&&q(),w.value=v(f.value.input,I.value),w.value.on("accept",(()=>{h()})),h()};return u((()=>{g()&&$()})),t(p,(e=>{g()})),t(I,((e,a)=>{w.value&&$()}),{deep:!0}),{...s,Mask:w,destroyMask:q,initMask:$,syncMask:h,handleInput:()=>{},model:M,load:(e,a=!1)=>{let l=a&&m.value?m.value(e,V.value):e;y.value=l,w.value&&(w.value[d.value?"unmaskedValue":"value"]=l)},update:e=>{y.value=e,w.value&&(w.value[d.value?"unmaskedValue":"value"]=e)}}}};export{o as default};