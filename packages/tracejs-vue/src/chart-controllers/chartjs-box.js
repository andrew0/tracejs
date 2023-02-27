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

  updateElement(item, index) {
    const dataset = this.getDataset();
    const datasetIndex = this.index;
    const value = dataset.data[index];
    const xScale = this._xScale;
    const yScale = this._yScale;
    const options = this._resolveElementOptions(item, index);

    // calculate the start X position of the chart
    const xZero = xScale.getPixelForTick(0);
    // calculate the width of a single X tick
    const xTickWidth = xScale.getPixelForTick(1) - xZero;

    const getPixelForCharacterAtIndex = (index) =>
      xZero + xTickWidth * (value.x + index * dataset.characterWidth);

    const x = getPixelForCharacterAtIndex(0);
    const y = yScale.getPixelForValue(value);

    const width = getPixelForCharacterAtIndex(value.word.length) - x;
    const halfWidth = width / 2;

    const height = options.height;
    const halfHeight = height / 2;

    item._xScale = xScale;
    item._yScale = yScale;
    item._options = options;
    item._datasetIndex = datasetIndex;
    item._index = index;

    const xPadding = 15;
    item._model = {
      getPixelForCharacterAtIndex,
      x: x + halfWidth,
      base: y - halfHeight,
      y: y + halfHeight,
      width: width + xPadding * 2,
      height: height,
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
      const { word, getPixelForCharacterAtIndex, y, height, borderColor } = dataElement._model;

      ctx.save();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = borderColor;
      for (let i = 0; i < word.length; i++) {
        const actualWidth = ctx.measureText(word[i]).width;
        const desiredWidth = getPixelForCharacterAtIndex(i + 1) - getPixelForCharacterAtIndex(i);
        const scaleX = desiredWidth / actualWidth;

        const x = getPixelForCharacterAtIndex(i) + desiredWidth / 2;
        ctx.scale(scaleX, 1);
        ctx.fillText(word[i], x / scaleX, y - height / 2);
        ctx.scale(1 / scaleX, 1);
      }
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
