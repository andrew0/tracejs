import{_ as k,g as _,T as A}from"./index.c1e4cfe3.js";import{C as f,N as C}from"./constants.2145432e.js";import{C as h,g as V}from"./BaseChart.b567492b.js";import{d as y,q as I,z as w,o as g,x as N,c as v,a as c,t as b,D as S,B as D}from"./vendor.9f3413dc.js";var $=h.helpers.options.resolve;h.controllers.matrix=h.DatasetController.extend({dataElementType:h.elements.Rectangle,update:function(e){var a=this,t=a.getMeta(),s=t.data||[],r,i;for(a._xScale=a.getScaleForId(t.xAxisID),a._yScale=a.getScaleForId(t.yAxisID),r=0,i=s.length;r<i;++r)a.updateElement(s[r],r,e)},updateElement:function(e,a,t){var s=this,r=s.getDataset(),i=s.index,n=r.data[a],d=s._xScale,l=s._yScale,o=s._resolveElementOptions(e,a),u=t?d.getBasePixel():d.getPixelForValue(n,a,i),m=t?l.getBasePixel():l.getPixelForValue(n,a,i),p=o.height,T=o.width,x=p/2;e._xScale=d,e._yScale=l,e._options=o,e._datasetIndex=i,e._index=a,e._model={x:u,base:m-x,y:m+x,width:T,height:p,backgroundColor:o.backgroundColor,borderColor:o.borderColor,borderSkipped:o.borderSkipped,borderWidth:o.borderWidth},e.pivot()},draw:function(){var e=this,a=e.getMeta().data||[],t,s;for(t=0,s=a.length;t<s;++t)a[t].draw()},_resolveElementOptions:function(e,a){var t=this,s=t.chart,r=s.data.datasets,i=r[t.index],n=s.options.elements.rectangle,d={},l,o,u,m={chart:s,dataIndex:a,dataset:i,datasetIndex:t.index},p=["backgroundColor","borderColor","borderSkipped","borderWidth","width","height"];for(l=0,o=p.length;l<o;++l)u=p[l],d[u]=$([i[u],n[u]],m,a);return d}});h.defaults.matrix={hover:{mode:"nearest",intersect:!0},tooltips:{mode:"nearest",intersect:!0},scales:{xAxes:[{type:"linear"}],yAxes:[{type:"linear"}]},elements:{rectangle:{borderSkipped:!1,width:20,height:20}}};var M=y({extends:V("matrix-chart","matrix"),props:{chartData:Array,chartTitle:String,xAxisTitle:String,yAxisTitle:String,yLabelCallback:Function,numXTicks:Number,numYTicks:Number,yStepSize:Number,simConfig:Object},data(){return{options:{responsive:!0,maintainAspectRatio:!1,animation:{duration:0},legend:{display:!1},tooltips:{enabled:!1},title:{display:!0,text:this.chartTitle},scales:{xAxes:[{ticks:{display:!0,min:0,max:this.numXTicks-1,stepSize:1},gridLines:{display:!1},scaleLabel:{display:!0,labelString:this.xAxisTitle}}],yAxes:[{ticks:{display:!0,min:0,max:this.numYTicks,stepSize:this.yStepSize||1,callback:this.yLabelCallback||(e=>e),fontColor:"transparent"},gridLines:{display:!0},scaleLabel:{display:!0,labelString:this.yAxisTitle}}]}}}},watch:{chartData:function(){this.updateChart()}},mounted(){this.addPlugin({afterDraw:e=>{const a=e.ctx,t=e.scales["y-axis-0"],s=t.getPixelForTick(1)-t.getPixelForTick(0);h.helpers.each(t.ticks,function(r,i){if(i===t.ticks.length-1)return;const n=t.right,d=t.getPixelForTick(i),l=10;a.save(),a.textBaseline="middle",a.textAlign="right",a.fillStyle="rgba(0, 0, 0, 0.8)",a.fillText(r,n-l,d+s/2),a.restore()})}}),this.updateChart()},methods:{updateChart(){const e=[];for(const[t,s]of this.chartData.entries())for(const[r,i]of s.entries())i>0&&e.push({x:r+.5,y:this.numYTicks-.5-t,v:(Math.min(Math.max(i,0),1)-this.simConfig.min)/(this.simConfig.max-this.simConfig.min)});const a={datasets:[{label:"My Matrix",data:e,backgroundColor:t=>{const s=t.dataset.data[t.dataIndex];return`rgba(0, 0, 0, ${s?s.v:0})`},width:t=>{const{right:s,left:r}=t.chart.chartArea;return(s-r)/this.options.scales.xAxes[0].ticks.max},height:t=>{const{bottom:s,top:r}=t.chart.chartArea;return(s-r)/this.options.scales.yAxes[0].ticks.max}}]};this.renderChart(a,this.options)}}});const P=y({components:{SimulationChart:M},setup(){const e=_();return{store:e,numXTicks:f.length*C,numYTicks:C,chartData:I(()=>{try{return e.isModelInputValid.value=!0,new A(e.config).inputLayer||[]}catch{return e.isModelInputValid.value=!1,[]}}),yLabelCallback(a,t){return t<f.length?f[t]:null}}}});function F(e,a,t,s,r,i){const n=w("SimulationChart");return g(),N(n,{"chart-data":e.chartData,"chart-title":"Model Input","x-axis-title":"Time","y-axis-title":"Feature Continua","y-label-callback":e.yLabelCallback,"num-x-ticks":e.store.config.fSlices+1,"num-y-ticks":e.numXTicks,"y-step-size":e.numYTicks,"sim-config":e.store.config},null,8,["chart-data","y-label-callback","num-x-ticks","num-y-ticks","y-step-size","sim-config"])}var K=k(P,[["render",F]]);const B=y({name:"ConfigInput",props:{modelValue:{type:[String,Number],default:""},lastValue:{type:[String,Number],default:null},label:{type:String,default:""},note:{type:String,default:""},error:{type:String,default:""},type:{type:String,default:"number"}},emits:["update:modelValue"],setup(e,{emit:a}){return{onChange:t=>{const s=e.type==="number"?Number(t.target.value):t.target.value;a("update:modelValue",s)}}}}),E={class:"field is-horizontal",style:{width:"30rem"}},L={class:"field-label"},z={class:"label",style:{width:"10rem"}},R={class:"field-body"},j={class:"field"},O=["type","value"],Y={class:"help is-info"},X={key:0,class:"help is-danger"},U=c("span",{class:"has-text-weight-bold"},"ERROR",-1);function W(e,a,t,s,r,i){return g(),v("div",E,[c("div",L,[c("label",z,b(e.label),1),e.lastValue!=null&&e.lastValue!==e.modelValue?(g(),v("button",{key:0,class:"button is-small",onClick:a[0]||(a[0]=n=>e.$emit("update:modelValue",e.lastValue))}," Reset ")):S("",!0)]),c("div",R,[c("div",j,[c("input",{class:"input",type:e.type,value:e.modelValue,onChange:a[1]||(a[1]=(...n)=>e.onChange&&e.onChange(...n))},null,40,O),c("p",Y,b(e.note),1),e.error?(g(),v("p",X,[U,D(" "+b(e.error),1)])):S("",!0)])])])}var Q=k(B,[["render",W]]);export{Q as C,K as M,M as S};