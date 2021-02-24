import Chart from 'chart.js';

Chart.controllers.box = Chart.DatasetController.extend({
  dataElementType: Chart.elements.Rectangle,

  update(reset) {
    const meta = this.getMeta();
    const data = meta.data || [];

    this._xScale = this.getScaleForId(meta.xAxisID);
    this._yScale = this.getScaleForId(meta.yAxisID);

    for (const [i, dataElement] of data.entries()) {
      this.updateElement(dataElement, i, reset);
    }
  },

  updateElement(item, index, reset) {
    const dataset = this.getDataset();
    const datasetIndex = this.index;
    const value = dataset.data[index];
    const xScale = this._xScale;
    const yScale = this._yScale;
    const options = this._resolveElementOptions(item, index);
    const x = reset ? xScale.getBasePixel() : xScale.getPixelForValue(value, index, datasetIndex);
    const y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(value, index, datasetIndex);
    const h = options.height;
    const w = options.width;
    const halfH = h / 2;

    item._xScale = xScale;
    item._yScale = yScale;
    item._options = options;
    item._datasetIndex = datasetIndex;
    item._index = index;

    item._model = {
      xCenter: x,
      x: x,
      base: y - halfH,
      y: y + halfH,
      width: w,
      height: h,
      backgroundColor: options.backgroundColor,
      borderColor: options.borderColor,
      borderSkipped: options.borderSkipped,
      borderWidth: options.borderWidth,
      word: value.word,
    };

    item.pivot();
  },

  draw() {
    const data = this.getMeta().data || [];
    const ctx = this.chart.ctx;

    for (const dataElement of data) {
      const { word, xCenter, y, height, borderColor } = dataElement._model;
      const xPadding = 10;

      ctx.save();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.font = 'bold 16px "Helvetica Neue", Helvetica, Arial, sans-serif';
      ctx.fillStyle = borderColor;
      dataElement._model.width = ctx.measureText(word).width + xPadding * 2;
      dataElement._model.x = xCenter + dataElement._model.width / 2 - xPadding;
      ctx.fillText(word, dataElement._model.x, y - height / 2);
      ctx.restore();

      dataElement.draw();
    }
  },

  _resolveElementOptions(rectangle, index) {
    const chart = this.chart;
    const datasets = chart.data.datasets;
    const dataset = datasets[this.index];
    const options = chart.options.elements.rectangle;
    const values = {};

    // Scriptable options
    const context = {
      chart: chart,
      dataIndex: index,
      dataset: dataset,
      datasetIndex: this.index,
    };

    const keys = [
      'backgroundColor',
      'borderColor',
      'borderSkipped',
      'borderWidth',
      'width',
      'height',
    ];

    for (const key of keys) {
      values[key] = Chart.helpers.options.resolve([dataset[key], options[key]], context, index);
    }

    return values;
  },
});

Chart.defaults.box = {
  hover: {
    mode: 'nearest',
    intersect: true,
  },
  tooltips: {
    mode: 'nearest',
    intersect: true,
  },
  scales: {
    xAxes: [
      {
        type: 'linear',
      },
    ],
    yAxes: [
      {
        type: 'linear',
      },
    ],
  },
  elements: {
    rectangle: {
      borderSkipped: false,
      width: 20,
      height: 20,
    },
  },
};
