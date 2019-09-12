<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'
// eslint-disable-next-line
import chartjsChartMatrix from 'chartjs-chart-matrix'

export default {
  extends: generateChart('matrix', 'matrix'),
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    chartTitle: String,
    xAxisTitle: String,
    yAxisTitle: String,
    yLabelCallback: Function,
    numXTicks: Number,
    numYTicks: Number,
    yStepSize: Number
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        title: {
          display: true,
          text: this.chartTitle
        },
        scales: {
          xAxes: [{
            ticks: {
              display: true,
              min: 0,
              max: this.numXTicks - 1,
              stepSize: 1
            },
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: this.xAxisTitle
            }
          }],
          yAxes: [{
            ticks: {
              display: true,
              min: 0,
              max: this.yStepSize && this.yStepSize > 1 ? this.numYTicks - 1 : this.numYTicks,
              stepSize: this.yStepSize || 1,
              callback: this.yLabelCallback || (value => value),
              fontColor: 'transparent'
            },
            gridLines: {
              display: true
            },
            scaleLabel: {
              display: true,
              labelString: this.yAxisTitle
            }
          }]
        }
      }
    }
  },
  watch: {
    chartData: function() {
      this.updateChart()
    }
  },
  mounted() {
    this.addPlugin({
      beforeDraw: chart => {
        // hide original tick
        chart.scales['y-axis-0'].options.ticks.fontColor = 'transparent'
      },
      afterDraw: chart => {
        const ctx = chart.ctx
        const yAxis = chart.scales['y-axis-0']
        const tickGap = yAxis.getPixelForTick(1) - yAxis.getPixelForTick(0)
        // loop through ticks array
        Chart.helpers.each(yAxis.ticks, function(tick, index) {
          if (index === yAxis.ticks.length - 1) return
          const xPos = yAxis.right
          const yPos = yAxis.getPixelForTick(index)
          const xPadding = 10
          // draw tick
          ctx.save()
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'right'
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
          ctx.fillText(tick, xPos - xPadding, yPos + tickGap / 2)
          ctx.restore()
        })
      }
    })
    this.updateChart()
  },
  methods: {
    updateChart() {
      const data = []
      for (const [y, row] of this.chartData.entries()) {
        for (const [x, val] of row.entries()) {
          const v = Math.min(Math.max(val, 0), 1.0)
          if (v > 0) {
            data.push({ x: x + 0.5, y: this.numYTicks - 0.5 - y, v })
          }
        }
      }

      const chartData = {
        datasets: [{
          label: 'My Matrix',
          data,
          backgroundColor: ctx => {
            const value = ctx.dataset.data[ctx.dataIndex].v
            return `rgba(0, 0, 0, ${value})`
          },
          width: ctx => {
            const { right, left } = ctx.chart.chartArea
            return (right - left) / this.options.scales.xAxes[0].ticks.max
          },
          height: ctx => {
            const { bottom, top } = ctx.chart.chartArea
            return (bottom - top) / this.options.scales.yAxes[0].ticks.max
          }
        }]
      }
      this.renderChart(chartData, this.options)
    }
  }
}
</script>
