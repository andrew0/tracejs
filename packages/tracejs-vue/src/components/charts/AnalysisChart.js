import { defineComponent } from 'vue';
import { Scatter } from './BaseChart';
import { reactiveProp } from './mixins';

export default defineComponent({
  extends: Scatter,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 0,
            hitRadius: 0,
          },
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
});
