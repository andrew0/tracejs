<script>
import { Scatter } from 'vue-chartjs'

export default {
  extends: Scatter,
  props: ['datasets'],
  mounted() {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 0
        }
      }
    }
    this.renderChart({ datasets: this.datasets }, options)
  }
}
</script>
