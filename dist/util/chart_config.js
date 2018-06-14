"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _process_data = require("./process_data");

var _default = {
  chart: {
    type: 'line',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    spacingBottom: 20,
    spacingTop: 10,
    spacingLeft: 20,
    spacingRight: 20,
    animation: false
  },
  colors: ['#5FA2DD', '#F76C51'],
  exporting: {
    enabled: false
  },
  legend: {
    enabled: true,
    useHTML: true,
    itemStyle: {
      border: '1px solid #ccc',
      padding: '10px',
      paddingLeft: '20px'
    },
    itemMarginTop: 10,
    symbolPadding: -14,
    squareSymbol: true,
    symbolRadius: 0,
    symbolHeight: 10,
    symbolWidth: 10
  },
  title: {
    text: null,
    margin: 0,
    style: {
      color: '#000'
    }
  },
  credits: {
    enabled: false
  },
  loading: {
    hideDuration: 800,
    showDuration: 800,
    labelStyle: {
      color: 'black',
      'font-size': '20pt'
    }
  },
  xAxis: {
    lineWidth: 1,
    tickWidth: 1,
    type: 'datetime',
    startOnTick: false,
    endOnTick: false,
    tickmarkPlacement: 'between',
    labels: {
      enabled: true,
      style: {
        color: '#000'
      }
    },
    title: {
      enabled: false
    }
  },
  yAxis: {
    gridLineWidth: 1,
    min: 0,
    labels: {
      enabled: true,
      formatter: function formatter() {
        return (0, _process_data.formatLabel)(this.value, 'axis');
      }
    },
    title: {
      margin: 0,
      text: ''
    },
    credits: {
      enabled: false
    }
  },
  plotOptions: {
    series: {
      fillOpacity: 0.5,
      turboThreshold: 0
    },
    line: {
      borderWidth: 0,
      cursor: 'pointer',
      events: {// click: (event) => zoomInGroup(event.point.x),
      },
      marker: {
        enabled: false
      }
    },
    column: {
      cursor: 'pointer',
      stacking: 'normal',
      events: {// click: (event) => zoomInGroup(event.point.x),
      }
    }
  },
  tooltip: {
    // shared: true,
    // split: true,
    headerFormat: '',
    useHTML: true,
    backgroundColor: '#a8a8a8',
    padding: 0,
    style: {
      color: 'white',
      minWidth: '100px'
    },
    dateTimeLabelFormats: {
      millisecond: '%e.%b, %H:%M:%S.%L',
      second: '%e.%b, %H:%M:%S',
      minute: '%e.%b, %H:%M',
      hour: '%e.%b, %H:%M',
      day: '%e.%b.%Y',
      week: 'Week from %e.%b.%Y',
      month: '%B %Y',
      year: '%Y'
    }
  }
};
var _default2 = _default;
exports.default = _default2;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, "default", "app/util/chart_config.js");
}();

;