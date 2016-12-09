import { formatLabel } from './process_data';

export default {
  chart: {
    type: 'areaspline',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    spacingBottom: 20,
    spacingTop: 10,
    spacingLeft: 20,
    spacingRight: 20,
    animation: false,
  },
  colors: ['#5FA2DD', '#F76C51'],
  exporting: { enabled: false },
  legend: { enabled: true },
  title: {
    margin: 0,
    style: { color: '#000' },
  },
  credits: { enabled: false },
  loading: {
    hideDuration: 800,
    showDuration: 800,
    labelStyle: {
      color: 'black',
      'font-size': '20pt',
    },
  },
  xAxis: {
    lineWidth: 1,
    tickWidth: 1,
    type: 'datetime',
    startOnTick: false,
    endOnTick: false,
    labels: {
      enabled: true,
      style: { color: '#000' },
    },
    title: { enabled: false },
  },
  yAxis: {
    gridLineWidth: 0,
    min: 0,
    labels: {
      enabled: true,
      formatter: function() { return formatLabel(this.value, 'axis'); },
    },
    title: {
      margin: 0,
      text: '',
    },
    credits: { enabled: false },
  },
  plotOptions: {
    series: {
      fillOpacity: 0.5,
      turboThreshold: 0,
    },
    areaspline: {
      borderWidth: 0,
      cursor: 'pointer',
      events: {
        // click: (event) => zoomInGroup(event.point.x),
      },
      marker: { enabled: false },
    },
    column: {
      cursor: 'pointer',
      events: {
        // click: (event) => zoomInGroup(event.point.x),
      },
    },
  },
  tooltip: {
    shared: true,
    pointFormatter: function() { return `${this.series.name}: <b>${formatLabel(this.y, 'tooltip')}</b><br/>`; },
    dateTimeLabelFormats: {
      millisecond: '%e.%b, %H:%M:%S.%L',
      second: '%e.%b, %H:%M:%S',
      minute: '%e.%b, %H:%M',
      hour: '%e.%b, %H:%M',
      day: '%e.%b.%Y',
      week: 'Week from %e.%b.%Y',
      month: '%B %Y',
      year: '%Y',
    },
  },
};
