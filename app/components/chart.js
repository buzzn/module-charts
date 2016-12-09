import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';
import moment from 'moment';
import map from 'lodash/map';
import config from '../util/chart_config';
import { sumData, getMomentPeriod } from '../util/process_data';
import { constants, actions } from '../actions';

export class Chart extends Component {
  componentWillMount() {
    ReactHighcharts.Highcharts.setOptions({
      global: {
        // timezoneOffset: (new Date()).getTimezoneOffset(),
        useUTC: false,
      },
    });
  }

  componentDidMount() {
    this.chart = this.refs.chart.getChart();
  }

  componentWillReceiveProps(nextProps) {
    const { resolution, timestamp, inData, outData, setResolution, setTimestamp, chartUpdate } = nextProps;

    const inSum = sumData({ data: inData, resolution });
    const outSum = sumData({ data: outData, resolution });

    const chartTitle = { text: '' };

    moment.locale('de');
    switch (resolution) {
      case constants.RESOLUTIONS.YEAR_MONTH:
        chartTitle.text = moment(timestamp).format('YYYY');
        break;
      case constants.RESOLUTIONS.MONTH_DAY:
        chartTitle.text = moment(timestamp).format('MMMM YYYY');
        break;
      case constants.RESOLUTIONS.HOUR_MINUTE:
        chartTitle.text = `${moment(timestamp).format('DD.MM.YYYY')} ... ${moment(timestamp).startOf('hour').format('HH:mm')} - ${moment(timestamp).endOf('hour').format('HH:mm')}`;
        break;
      default:
      case constants.RESOLUTIONS.DAY_MINUTE:
        chartTitle.text = moment(timestamp).format('DD.MM.YYYY');
        break;
    }

    this.chart.setTitle(chartTitle);

    if (this.chart.series.length === 0) {
      this.chart.addSeries({ name: 'Gesamtverbrauch', data: map(inSum, v => ([v.timestamp, v.powerMilliwatt])) });
      this.chart.addSeries({ name: 'Gesamterzeugung', data: map(outSum, v => ([v.timestamp, v.powerMilliwatt])) });
    } else {
      this.chart.series[0].setData(map(inSum, v => ([v.timestamp, v.powerMilliwatt])));
      this.chart.series[1].setData(map(outSum, v => ([v.timestamp, v.powerMilliwatt])));
    }

    const zoomIn = (newTimestamp, currentResolution) => {
      if (currentResolution === constants.RESOLUTIONS.HOUR_MINUTE) return;
      let newResolution = constants.RESOLUTIONS.DAY_MINUTE;
      switch (currentResolution) {
        case constants.RESOLUTIONS.YEAR_MONTH:
          newResolution = constants.RESOLUTIONS.MONTH_DAY;
          break;
        case constants.RESOLUTIONS.MONTH_DAY:
          newResolution = constants.RESOLUTIONS.DAY_MINUTE;
          break;
        default:
          newResolution = constants.RESOLUTIONS.HOUR_MINUTE;
          break;
      }
      setResolution(newResolution);
      setTimestamp(newTimestamp);
      chartUpdate();
    };

    switch (resolution) {
      case constants.RESOLUTIONS.YEAR_MONTH:
      case constants.RESOLUTIONS.MONTH_DAY:
        this.chart.series.forEach(series => series.update({ type: 'column', events: { click(event) { zoomIn(event.point.x, resolution); } } }));
        break;
      default:
        this.chart.series.forEach(series => series.update({ type: 'areaspline', events: { click(event) { zoomIn(event.point.x, resolution); } } }));
        break;
    }

    const momentRes = getMomentPeriod(resolution);

    this.chart.xAxis[0].setExtremes(moment(timestamp).startOf(momentRes).valueOf(), moment(timestamp).endOf(momentRes).valueOf());
    // this.chart.yAxis[0].setExtremes();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <ReactHighcharts config={ config } ref="chart" domProps={{ className: 'chart', style: { width: '94%', height: '300px', marginLeft: '3%' } }}></ReactHighcharts>
    );
  }
}

function mapStateToProps(state) {
  // TODO: replace 'charts' with 'mountedPath' ownProps parameter or constant
  return {
    resolution: state.charts.resolution,
    timestamp: state.charts.timestamp,
    inData: state.charts.inData,
    outData: state.charts.outData,
  };
}

export default connect(mapStateToProps, {
  setResolution: actions.setResolution,
  setTimestamp: actions.setTimestamp,
  chartUpdate: actions.chartUpdate,
})(Chart);
