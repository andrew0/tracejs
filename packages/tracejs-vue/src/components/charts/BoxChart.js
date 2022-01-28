import '../../chart-controllers/chartjs-box.js';
import { defineComponent } from 'vue';
import { generateChart } from './BaseChart';

const colorPalette = [
  'black',
  'red',
  'orange',
  'green',
  'blue',
  'magenta',
  'darkgray',
  'darkgray',
  'darkgray',
  'darkgray',
];

export default defineComponent({
  extends: generateChart('box-chart', 'box'),
  props: {
    chartData: Array,
    chartTitle: String,
    xAxisTitle: String,
    yAxisTitle: String,
    numXTicks: Number,
    simConfig: Object,
    borderWidth: {
      type: Number,
      default: 1.0,
    },
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0,
        },
        hover: {
          animationDuration: 0,
        },
        responsiveAnimationDuration: 0,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        title: {
          display: true,
          text: this.chartTitle,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: true,
                min: 0,
                max: this.numXTicks - 1,
                stepSize: 1,
              },
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: this.xAxisTitle,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: true,
                min: 0,
                max: 1,
                stepSize: 0.1,
              },
              gridLines: {
                display: true,
              },
              scaleLabel: {
                display: true,
                labelString: this.yAxisTitle,
              },
            },
          ],
        },
      },
    };
  },
  watch: {
    chartData() {
      this.updateChart();
    },
  },
  mounted() {
    this.updateChart();
  },
  methods: {
    updateChart() {
      // order chart data by y value
      const sorted = this.chartData.slice().sort((a, b) => b.y - a.y);

      // build map of word -> color
      const words = [];
      for (const { word } of sorted) {
        if (!words.includes(word)) {
          words.push(word);
        }
      }
      const wordColors = {};
      for (const [index, word] of words.entries()) {
        wordColors[word] = colorPalette[Math.min(index, colorPalette.length - 1)];
      }

      const chartData = {
        datasets: [
          {
            label: 'My Matrix',
            data: this.chartData,
            backgroundColor: () => 'transparent',
            borderColor: (ctx) =>
              ctx.dataset.data[ctx.dataIndex]
                ? wordColors[ctx.dataset.data[ctx.dataIndex].word]
                : 'transparent',
            borderWidth: () => this.borderWidth,
            width: (ctx) => {
              const { right, left } = ctx.chart.chartArea;
              return ((right - left) / this.options.scales.xAxes[0].ticks.max) * 5;
            },
            height: (ctx) => {
              const { bottom, top } = ctx.chart.chartArea;
              return (bottom - top) / this.options.scales.yAxes[0].ticks.max / 10;
            },
          },
        ],
      };
      this.renderChart(chartData, this.options);
    },
  },
});
