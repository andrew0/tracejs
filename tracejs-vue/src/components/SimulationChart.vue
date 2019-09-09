<script>
import { generateChart } from 'vue-chartjs'
// eslint-disable-next-line
import chartjsChartMatrix from 'chartjs-chart-matrix'

export default {
  extends: generateChart('matrix', 'matrix'),
  // mixins: [reactiveProp],
  props: {
    featureData: {
      type: Array,
      default: () => []
    }
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
        scales: {
          xAxes: [{
            ticks: {
              display: true,
              min: 0,
              max: 99,
              stepSize: 1
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            ticks: {
              display: true,
              min: 0,
              max: 62,
              stepSize: 9
            },
            gridLines: {
              display: true
            }
          }]
        }
      }
    }
  },
  watch: {
    featureData: function() {
      this.updateChart()
    }
  },
  mounted() {
    this.updateChart()
  },
  methods: {
    updateChart() {
      const data = []
      for (const [y, row] of this.featureData.entries()) {
        for (const [x, val] of row.entries()) {
          const v = Math.min(Math.max(val, 0), 1.0)
          if (v > 0) {
            data.push({ x: x - 0.5, y: 62.5 - y, v })
          }
        }
      }

      const chartData = {
        datasets: [{
          label: 'My Matrix',
          data,
          backgroundColor: ctx => {
            var value = ctx.dataset.data[ctx.dataIndex].v
            return `rgba(0, 0, 0, ${value})`
          },
          width: ctx => {
            var a = ctx.chart.chartArea;
            return (a.right - a.left) / 99;
          },
          height: ctx => {
            var a = ctx.chart.chartArea;
            return (a.bottom - a.top) / 62;
          }
        }]
      }
      this.renderChart(chartData, this.options)
    }
  }
}
</script>
