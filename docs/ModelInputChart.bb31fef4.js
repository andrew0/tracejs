import{d as t,b as e,g as a,T as i,o as s,c as r,r as n}from"./index.fea91626.js";import{C as l,g as o}from"./BaseChart.de79a112.js";var c=l.helpers.options.resolve;l.controllers.matrix=l.DatasetController.extend({dataElementType:l.elements.Rectangle,update:function(t){var e,a,i=this,s=i.getMeta(),r=s.data||[];for(i._xScale=i.getScaleForId(s.xAxisID),i._yScale=i.getScaleForId(s.yAxisID),e=0,a=r.length;e<a;++e)i.updateElement(r[e],e,t)},updateElement:function(t,e,a){var i=this,s=i.getDataset(),r=i.index,n=s.data[e],l=i._xScale,o=i._yScale,c=i._resolveElementOptions(t,e),d=a?l.getBasePixel():l.getPixelForValue(n,e,r),h=a?o.getBasePixel():o.getPixelForValue(n,e,r),u=c.height,x=c.width,m=u/2;t._xScale=l,t._yScale=o,t._options=c,t._datasetIndex=r,t._index=e,t._model={x:d,base:h-m,y:h+m,width:x,height:u,backgroundColor:c.backgroundColor,borderColor:c.borderColor,borderSkipped:c.borderSkipped,borderWidth:c.borderWidth},t.pivot()},draw:function(){var t,e,a=this.getMeta().data||[];for(t=0,e=a.length;t<e;++t)a[t].draw()},_resolveElementOptions:function(t,e){var a,i,s,r=this,n=r.chart,l=n.data.datasets[r.index],o=n.options.elements.rectangle,d={},h={chart:n,dataIndex:e,dataset:l,datasetIndex:r.index},u=["backgroundColor","borderColor","borderSkipped","borderWidth","width","height"];for(a=0,i=u.length;a<i;++a)d[s=u[a]]=c([l[s],o[s]],h,e);return d}}),l.defaults.matrix={hover:{mode:"nearest",intersect:!0},tooltips:{mode:"nearest",intersect:!0},scales:{xAxes:[{type:"linear"}],yAxes:[{type:"linear"}]},elements:{rectangle:{borderSkipped:!1,width:20,height:20}}};var d=t({extends:o("matrix-chart","matrix"),props:{chartData:Array,chartTitle:String,xAxisTitle:String,yAxisTitle:String,yLabelCallback:Function,numXTicks:Number,numYTicks:Number,yStepSize:Number,simConfig:Object},data(){return{options:{responsive:!0,maintainAspectRatio:!1,animation:{duration:0},legend:{display:!1},tooltips:{enabled:!1},title:{display:!0,text:this.chartTitle},scales:{xAxes:[{ticks:{display:!0,min:0,max:this.numXTicks-1,stepSize:1},gridLines:{display:!1},scaleLabel:{display:!0,labelString:this.xAxisTitle}}],yAxes:[{ticks:{display:!0,min:0,max:this.numYTicks,stepSize:this.yStepSize||1,callback:this.yLabelCallback||(t=>t),fontColor:"transparent"},gridLines:{display:!0},scaleLabel:{display:!0,labelString:this.yAxisTitle}}]}}}},watch:{chartData:function(){this.updateChart()}},mounted(){this.addPlugin({afterDraw:t=>{const e=t.ctx,a=t.scales["y-axis-0"],i=a.getPixelForTick(1)-a.getPixelForTick(0);l.helpers.each(a.ticks,(function(t,s){if(s===a.ticks.length-1)return;const r=a.right,n=a.getPixelForTick(s);e.save(),e.textBaseline="middle",e.textAlign="right",e.fillStyle="rgba(0, 0, 0, 0.8)",e.fillText(t,r-10,n+i/2),e.restore()}))}}),this.updateChart()},methods:{updateChart(){const t=[];for(const[a,i]of this.chartData.entries())for(const[e,s]of i.entries())s>0&&t.push({x:e+.5,y:this.numYTicks-.5-a,v:(Math.min(Math.max(s,0),1)-this.simConfig.min)/(this.simConfig.max-this.simConfig.min)});const e={datasets:[{label:"My Matrix",data:t,backgroundColor:t=>{const e=t.dataset.data[t.dataIndex];return`rgba(0, 0, 0, ${e?e.v:0})`},width:t=>{const{right:e,left:a}=t.chart.chartArea;return(e-a)/this.options.scales.xAxes[0].ticks.max},height:t=>{const{bottom:e,top:a}=t.chart.chartArea;return(e-a)/this.options.scales.yAxes[0].ticks.max}}]};this.renderChart(e,this.options)}}});const h=["POW","VOC","DIF","ACU","GRD","VOI","BUR"],u=9;var x=t({components:{SimulationChart:d},props:{reactive:{type:Boolean,default:!1}},setup(t){const s=a();return{store:s,numXTicks:9*h.length,numYTicks:9,chartData:e((()=>{var e;return t.reactive?new i(s.config).inputLayer||[]:(null==(e=s.sim.value)?void 0:e.inputLayer[s.currentCycle.value])||[]})),yLabelCallback:(t,e)=>e<h.length?h[e]:null}}});x.render=function(t,e,a,i,l,o){const c=n("SimulationChart");return s(),r(c,{"chart-data":t.chartData,"chart-title":"Model Input","x-axis-title":"Time","y-axis-title":"Feature Continua","y-label-callback":t.yLabelCallback,"num-x-ticks":t.store.config.fSlices+1,"num-y-ticks":t.numXTicks,"y-step-size":t.numYTicks,"sim-config":t.store.config},null,8,["chart-data","y-label-callback","num-x-ticks","num-y-ticks","y-step-size","sim-config"])};export{h as C,u as N,d as S,x as _};