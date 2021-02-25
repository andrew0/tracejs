import{d as e,o as l,c as a,a as n,t as o,b as t,g as d,r as i,e as u,f as s,p as c,h as m,F as r,i as p,w as f,v as g,j as V,k as b,_ as h,l as v}from"./index.fea91626.js";import{_ as y,C as P,N as U}from"./ModelInputChart.bb31fef4.js";import"./BaseChart.de79a112.js";var S=e({name:"ConfigInput",props:{modelValue:{type:[String,Number],default:""},label:{type:String,default:""},note:{type:String,default:""},type:{type:String,default:"number"}},emits:["update:modelValue"],setup:(e,{emit:l})=>({onInput:a=>{const n="number"===e.type?Number(a.target.value):a.target.value;l("update:modelValue",n)}})});const x={class:"field is-horizontal",style:{width:"30rem"}},A={class:"field-label"},F={class:"label",style:{width:"10rem"}},I={class:"field-body"},w={class:"field"},C={class:"help is-info"};S.render=function(e,t,d,i,u,s){return l(),a("div",x,[n("div",A,[n("label",F,o(e.label),1)]),n("div",I,[n("div",w,[n("input",{class:"input",type:e.type,value:e.modelValue,onInput:t[1]||(t[1]=(...l)=>e.onInput&&e.onInput(...l))},null,40,["type","value"]),n("p",C,o(e.note),1)])])])};var D=e({name:"ParametersTab",components:{ConfigInput:S,ModelInputChart:y},setup(){const e=d();return{config:t((()=>e.config))}}});var E={columns:"_columns_q8nxg_2"};const W={style:{padding:"1rem",width:"600px","overflow-y":"auto"}},_={style:{flex:"1",display:"flex","align-items":"center","justify-content":"center"}};(D.__cssModules={}).$style=E,D.render=function(e,o,t,d,u,s){const c=i("config-input"),m=i("ModelInputChart");return l(),a("div",{class:e.$style.columns},[n("div",W,[n(c,{modelValue:e.config.modelInput,"onUpdate:modelValue":o[1]||(o[1]=l=>e.config.modelInput=l),label:"Model Input",note:"",type:"text"},null,8,["modelValue"]),n(c,{modelValue:e.config.continuumSpec,"onUpdate:modelValue":o[2]||(o[2]=l=>e.config.continuumSpec=l),label:"continuumSpec",note:"Ambiguous phoneme continuum",type:"text"},null,8,["modelValue"]),n(c,{modelValue:e.config.alpha.IF,"onUpdate:modelValue":o[3]||(o[3]=l=>e.config.alpha.IF=l),label:"ALPHA[if]",note:"Input-Feature weights"},null,8,["modelValue"]),n(c,{modelValue:e.config.alpha.FP,"onUpdate:modelValue":o[4]||(o[4]=l=>e.config.alpha.FP=l),label:"ALPHA[fp]",note:"Feature-Phoneme weights"},null,8,["modelValue"]),n(c,{modelValue:e.config.alpha.PW,"onUpdate:modelValue":o[5]||(o[5]=l=>e.config.alpha.PW=l),label:"ALPHA[pw]",note:"Phoneme-Word weights"},null,8,["modelValue"]),n(c,{modelValue:e.config.alpha.PF,"onUpdate:modelValue":o[6]||(o[6]=l=>e.config.alpha.PF=l),label:"ALPHA[pf]",note:"Phoneme-Feature weights"},null,8,["modelValue"]),n(c,{modelValue:e.config.alpha.WP,"onUpdate:modelValue":o[7]||(o[7]=l=>e.config.alpha.WP=l),label:"ALPHA[wp]",note:"Word-Phoneme weights"},null,8,["modelValue"]),n(c,{modelValue:e.config.gamma.F,"onUpdate:modelValue":o[8]||(o[8]=l=>e.config.gamma.F=l),label:"GAMMA[f]",note:"Feature layer inhibition"},null,8,["modelValue"]),n(c,{modelValue:e.config.gamma.P,"onUpdate:modelValue":o[9]||(o[9]=l=>e.config.gamma.P=l),label:"GAMMA[p]",note:"Phoneme layer inhibition"},null,8,["modelValue"]),n(c,{modelValue:e.config.gamma.W,"onUpdate:modelValue":o[10]||(o[10]=l=>e.config.gamma.W=l),label:"GAMMA[w]",note:"Word layer inhibition"},null,8,["modelValue"]),n(c,{modelValue:e.config.decay.F,"onUpdate:modelValue":o[11]||(o[11]=l=>e.config.decay.F=l),label:"DECAY[f]",note:"Feature decay"},null,8,["modelValue"]),n(c,{modelValue:e.config.decay.P,"onUpdate:modelValue":o[12]||(o[12]=l=>e.config.decay.P=l),label:"DECAY[p]",note:"Phoneme decay"},null,8,["modelValue"]),n(c,{modelValue:e.config.decay.W,"onUpdate:modelValue":o[13]||(o[13]=l=>e.config.decay.W=l),label:"DECAY[w]",note:"Word decay"},null,8,["modelValue"]),n(c,{modelValue:e.config.rest.F,"onUpdate:modelValue":o[14]||(o[14]=l=>e.config.rest.F=l),label:"REST[f]",note:"Feature resting activation"},null,8,["modelValue"]),n(c,{modelValue:e.config.rest.P,"onUpdate:modelValue":o[15]||(o[15]=l=>e.config.rest.P=l),label:"REST[p]",note:"Phoneme resting activation"},null,8,["modelValue"]),n(c,{modelValue:e.config.rest.W,"onUpdate:modelValue":o[16]||(o[16]=l=>e.config.rest.W=l),label:"REST[w]",note:"Word resting activation"},null,8,["modelValue"]),n(c,{modelValue:e.config.noiseSD,"onUpdate:modelValue":o[17]||(o[17]=l=>e.config.noiseSD=l),label:"Input Noise (SD)",note:""},null,8,["modelValue"]),n(c,{modelValue:e.config.stochasticitySD,"onUpdate:modelValue":o[18]||(o[18]=l=>e.config.stochasticitySD=l),label:"Stochasticity (SD)",note:"McClelland: 0.02"},null,8,["modelValue"]),n(c,{modelValue:e.config.atten,"onUpdate:modelValue":o[19]||(o[19]=l=>e.config.atten=l),label:"Attention",note:"Lexical gain"},null,8,["modelValue"]),n(c,{modelValue:e.config.bias,"onUpdate:modelValue":o[20]||(o[20]=l=>e.config.bias=l),label:"Bias",note:"Lexical bias"},null,8,["modelValue"]),n(c,{modelValue:e.config.spreadScale[0],"onUpdate:modelValue":o[21]||(o[21]=l=>e.config.spreadScale[0]=l),label:"spreadScale",note:"Scales FETSPREADs"},null,8,["modelValue"]),n(c,{modelValue:e.config.min,"onUpdate:modelValue":o[22]||(o[22]=l=>e.config.min=l),label:"Min",note:"Minimum activation"},null,8,["modelValue"]),n(c,{modelValue:e.config.max,"onUpdate:modelValue":o[23]||(o[23]=l=>e.config.max=l),label:"Max",note:"Maximum activation"},null,8,["modelValue"]),n(c,{modelValue:e.config.spread[0],"onUpdate:modelValue":o[24]||(o[24]=l=>e.config.spread[0]=l),label:"FETSPREAD[pow]",note:"Power feature spread"},null,8,["modelValue"]),n(c,{modelValue:e.config.spread[1],"onUpdate:modelValue":o[25]||(o[25]=l=>e.config.spread[1]=l),label:"FETSPREAD[voc]",note:"Vocalic feature spread"},null,8,["modelValue"]),n(c,{modelValue:e.config.spread[2],"onUpdate:modelValue":o[26]||(o[26]=l=>e.config.spread[2]=l),label:"FETSPREAD[dif]",note:"Diffuse feature spread"},null,8,["modelValue"]),n(c,{modelValue:e.config.spread[3],"onUpdate:modelValue":o[27]||(o[27]=l=>e.config.spread[3]=l),label:"FETSPREAD[acu]",note:"Accute feature spread"},null,8,["modelValue"]),n(c,{modelValue:e.config.spread[4],"onUpdate:modelValue":o[28]||(o[28]=l=>e.config.spread[4]=l),label:"FETSPREAD[gra]",note:"Gradient/Consonental feature spread"},null,8,["modelValue"]),n(c,{modelValue:e.config.spread[5],"onUpdate:modelValue":o[29]||(o[29]=l=>e.config.spread[5]=l),label:"FETSPREAD[voi]",note:"Voiced feature spread"},null,8,["modelValue"]),n(c,{modelValue:e.config.spread[6],"onUpdate:modelValue":o[30]||(o[30]=l=>e.config.spread[6]=l),label:"FETSPREAD[bur]",note:"Burst feature spread"},null,8,["modelValue"]),n(c,{modelValue:e.config.fSlices,"onUpdate:modelValue":o[31]||(o[31]=l=>e.config.fSlices=l),label:"fSlices",note:"Number of time steps"},null,8,["modelValue"]),n(c,{modelValue:e.config.deltaInput,"onUpdate:modelValue":o[32]||(o[32]=l=>e.config.deltaInput=l),label:"deltaInput",note:"Input phoneme interval"},null,8,["modelValue"]),n(c,{modelValue:e.config.nreps,"onUpdate:modelValue":o[33]||(o[33]=l=>e.config.nreps=l),label:"nreps",note:"Input presentation rate"},null,8,["modelValue"]),n(c,{modelValue:e.config.slicesPerPhon,"onUpdate:modelValue":o[34]||(o[34]=l=>e.config.slicesPerPhon=l),label:"slicesPerPhon",note:"Phoneme/Word slices per Feature"},null,8,["modelValue"]),n(c,{modelValue:e.config.lengthNormalization,"onUpdate:modelValue":o[35]||(o[35]=l=>e.config.lengthNormalization=l),label:"lengthNormalization",note:"0 or 1; normalize length effects."},null,8,["modelValue"])]),n("div",_,[n(m,{style:{width:"700px",height:"500px"},reactive:""})])],2)};var k=e({name:"PhonologyTab",setup(){const e=d(),l=e.sortedPhonemes,a=u(l.value[0]);return{continua:P,numFeatures:U,sortedPhonemes:l,activePhoneme:a,addPhoneme:()=>{const l=s();e.config.phonology.push(l),a.value=l},deleteSelected:()=>{const n=e.config.phonology.indexOf(a.value),o=e.config.phonology.indexOf(a.value);n>=0&&(e.config.phonology.splice(n,1),a.value=l.value[Math.min(o,l.value.length-1)])}}}});const M=b("data-v-1070b2de");c("data-v-1070b2de");const T={style:{margin:"1rem"}},L={class:"columns"},R={class:"column is-2"},N={class:"panel is-hoverable",style:{background:"white"}},j={key:0,class:"column"},z={class:"field is-horizontal",style:{width:"8rem"}},$=n("div",{class:"field-label"},[n("label",{class:"label"},"Label")],-1),q={class:"field-body"},H=n("h1",{class:"title is-5 is-marginless"},"Phoneme Specification",-1),G={class:"table is-bordered"},B=n("th",null,"#",-1),Y=n("h1",{class:"title is-5 is-marginless"},"Duration Scalar",-1),O={class:"table is-bordered"};m();const J=M(((e,t,d,i,u,s)=>(l(),a("div",T,[n("div",L,[n("div",R,[n("div",N,[(l(!0),a(r,null,p(e.sortedPhonemes,((n,t)=>(l(),a("a",{key:t,class:{"panel-block":!0,"is-active":n===e.activePhoneme},onClick:l=>e.activePhoneme=n},o(n.label||"null"),11,["onClick"])))),128))]),n("a",{class:"button",onClick:t[1]||(t[1]=(...l)=>e.addPhoneme&&e.addPhoneme(...l))},"Add phoneme"),n("a",{class:"button",onClick:t[2]||(t[2]=(...l)=>e.deleteSelected&&e.deleteSelected(...l))},"Delete selected")]),e.activePhoneme?(l(),a("div",j,[n("div",z,[$,n("div",q,[f(n("input",{class:"input",type:"text","onUpdate:modelValue":t[3]||(t[3]=l=>e.activePhoneme.label=l)},null,512),[[g,e.activePhoneme.label]])])]),H,n("table",G,[n("thead",null,[n("tr",null,[B,(l(!0),a(r,null,p(e.continua,((e,n)=>(l(),a("th",{key:n},o(e),1)))),128))])]),n("tbody",null,[(l(!0),a(r,null,p(e.numFeatures,((t,d)=>(l(),a("tr",{key:d},[n("td",null,o(t),1),(l(!0),a(r,null,p(e.continua.length,((o,t)=>(l(),a("td",{key:t,class:"is-paddingless"},[f(n("input",{class:"input",style:{width:"5rem"},type:"number","onUpdate:modelValue":l=>e.activePhoneme.features[t*e.numFeatures+d]=l},null,8,["onUpdate:modelValue"]),[[g,e.activePhoneme.features[t*e.numFeatures+d]]])])))),128))])))),128))])]),Y,n("table",O,[n("thead",null,[n("tr",null,[(l(!0),a(r,null,p(e.continua,((e,n)=>(l(),a("th",{key:n},o(e),1)))),128))])]),n("tbody",null,[n("tr",null,[(l(!0),a(r,null,p(e.continua.length,((o,t)=>(l(),a("td",{key:t,class:"is-paddingless"},[f(n("input",{class:"input",style:{width:"5rem"},type:"number","onUpdate:modelValue":l=>e.activePhoneme.durationScalar[t]=l},null,8,["onUpdate:modelValue"]),[[g,e.activePhoneme.durationScalar[t]]])])))),128))])])])])):V("",!0)])]))));k.render=J,k.__scopeId="data-v-1070b2de";var K=e({name:"LexiconTab",setup(){const e=d(),l=t((()=>e.config.lexicon));return{lexicon:l,addWord:()=>l.value.unshift({phon:"",freq:0,prime:0}),deleteWord:e=>l.value.splice(e,1),deleteAll:()=>l.value.splice(0,l.value.length)}}});const Q={style:{margin:"1rem"}},X={style:{display:"flex","margin-bottom":"1rem"}},Z={class:"table is-bordered"},ee=n("th",null,"Lexical Items",-1),le=n("th",null,"Frequency",-1),ae=n("th",null,"Priming",-1),ne={class:"is-paddingless"},oe={class:"is-paddingless"},te={class:"is-paddingless"},de={class:"is-paddingless"},ie={class:"is-paddingless"};K.render=function(e,o,t,d,i,u){return l(),a("div",Q,[n("div",X,[n("a",{class:"button",onClick:o[1]||(o[1]=(...l)=>e.addWord&&e.addWord(...l)),style:{"margin-right":"0.5rem"}},"Add word")]),n("table",Z,[n("thead",null,[n("tr",null,[ee,le,ae,n("th",ne,[n("a",{class:"button",onClick:o[2]||(o[2]=l=>e.deleteAll())},"Delete All")])])]),n("tbody",null,[(l(!0),a(r,null,p(e.lexicon,((o,t)=>(l(),a("tr",{key:t},[n("td",oe,[f(n("input",{class:"input",type:"text","onUpdate:modelValue":e=>o.phon=e},null,8,["onUpdate:modelValue"]),[[g,o.phon]])]),n("td",te,[f(n("input",{class:"input",type:"text","onUpdate:modelValue":e=>o.freq=e},null,8,["onUpdate:modelValue"]),[[g,o.freq]])]),n("td",de,[f(n("input",{class:"input",type:"text","onUpdate:modelValue":e=>o.prime=e},null,8,["onUpdate:modelValue"]),[[g,o.prime]])]),n("td",ie,[n("a",{class:"button is-fullwidth",onClick:l=>e.deleteWord(t)},"Delete",8,["onClick"])])])))),128))])])])};var ue=e({name:"ConfigTab",components:{NavigationTabs:h},setup(){const e=[{label:"Parameters",component:D},{label:"Phonology",component:k},{label:"Lexicon",component:K}],l=u(0);return{labels:e.map((e=>e.label)),activeIndex:l,activeComponent:t((()=>e[l.value].component)),store:d()}}});var se={container:"_container_jxura_2",nav:"_nav_jxura_8",main:"_main_jxura_13"};(ue.__cssModules={}).$style=se,ue.render=function(e,o,t,d,u,s){const c=i("NavigationTabs");return l(),a("div",{class:e.$style.container},[n("div",{class:e.$style.nav},[n(c,{labels:e.labels,"active-index":e.activeIndex,"onUpdate:active-index":o[1]||(o[1]=l=>e.activeIndex=l)},null,8,["labels","active-index"])],2),n("div",{class:e.$style.main},[(l(),a(v(e.activeComponent)))],2)],2)};export default ue;