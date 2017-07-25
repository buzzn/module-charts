import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';
import moment from 'moment';
import map from 'lodash/map';
import config from '../util/chart_config';
import { calcEnergy, getMomentPeriod, formatLabel } from '../util/process_data';
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

  draw(props) {
    const { resolution, timestamp, chartData, setResolution, setTimestamp, chartUpdate, layout, withTitle } = props;

    const chartTitle = { text: '' };

    let currentType = '';

    const axisFormatter = function(type) {
      return function() { return formatLabel(this.value, 'axis', type); };
    };

    const tooltipFormatter = function(type) {
      return function() {
        switch (resolution) {
          case constants.RESOLUTIONS.DAY_MINUTE:
            return `
              <div style="text-align: center; font-size: 16px; padding-bottom: 6px"><b>${this.series.name}</b></div>
              <hr style="margin: 0; border-top: 1px solid black;"/>
              Time: <b>${moment(this.x).format('DD. MMMM, HH:mm')}</b><br/>
              Power: <b>${formatLabel(this.y, resolution)}</b><br/>
              Energy: <b>${formatLabel(calcEnergy(this.series.data.map(p => ({ timestamp: p.x, value: p.y })), resolution, this.x), 'tooltip', type)}</b><br/>
                   `;
          case constants.RESOLUTIONS.YEAR_MONTH:
            return `
              <div style="text-align: center; font-size: 16px; padding-bottom: 6px"><b>${this.series.name}</b></div>
              <hr style="margin: 0; border-top: 1px solid black;"/>
              Time: <b>${moment(this.x).format('MMMM. YYYY')}</b><br/>
              Energy: <b>${formatLabel(this.y, resolution, 'h')}</b><br/>
                   `;
          case constants.RESOLUTIONS.MONTH_DAY:
            return `
              <div style="text-align: center; font-size: 16px; padding-bottom: 6px"><b>${this.series.name}</b></div>
              <hr style="margin: 0; border-top: 1px solid black;"/>
              Time: <b>${moment(this.x).format('DD. MMMM')}</b><br/>
              Energy: <b>${formatLabel(this.y, resolution, 'h')}</b><br/>
                   `;
          case constants.RESOLUTIONS.HOUR_MINUTE:
            return `
              <div style="text-align: center; font-size: 16px; padding-bottom: 6px"><b>${this.series.name}</b></div>
              <hr style="margin: 0; border-top: 1px solid black;"/>
              Time: <b>${moment(this.x).format('HH:mm')}</b><br/>
              Power: <b>${formatLabel(this.y, resolution)}</b><br/>
                   `;
          default:
            return '';
        }
      };
    };

    moment.locale('de');
    switch (resolution) {
      case constants.RESOLUTIONS.YEAR_MONTH:
        chartTitle.text = moment(timestamp).format('YYYY');
        currentType = 'h';
        break;
      case constants.RESOLUTIONS.MONTH_DAY:
        chartTitle.text = moment(timestamp).format('MMMM YYYY');
        currentType = 'h';
        break;
      case constants.RESOLUTIONS.HOUR_MINUTE:
        chartTitle.text = `${moment(timestamp).format('DD.MM.YYYY')} ... ${moment(timestamp).startOf('hour').format('HH:mm')} - ${moment(timestamp).endOf('hour').format('HH:mm')}`;
        currentType = '';
        break;
      default:
      case constants.RESOLUTIONS.DAY_MINUTE:
        chartTitle.text = moment(timestamp).format('DD.MM.YYYY');
        currentType = 'h';
        break;
    }

    if (withTitle) {
      this.chart.setTitle(chartTitle);
    } else {
      this.chart.setTitle(null);
    }

    if (this.chart.series.length < chartData.length) {
      for (const chartObj of chartData.sort((a, b) => (a.id - b.id))) {
        this.chart.addSeries({
          name: chartObj.name,
          color: chartObj.color,
          stack: chartObj.direction,
          data: map(chartObj.values, v => ([v.timestamp, v.value])),
        });
      }
    } else {
      for (const chartObj of chartData) {
        this.chart.series[chartObj.id].setData(map(chartObj.values, v => ([v.timestamp, v.value])));
        this.chart.series[chartObj.id].update({
          color: chartObj.color,
          stack: chartObj.direction,
          name: chartObj.name,
        });
      }
    }

    if (layout === 'vertical') {
      this.chart.legend.update({
        align: 'left',
        verticalAlign: 'middle',
        layout: 'vertical',
      });
    } else {
      this.chart.legend.update({
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
      });
    }

    this.chart.legend.update({
      labelFormatter: function() {
        return `<div style="margin-top: -10px">${this.name}</div>
                <div style="margin-top: 4px; font-size: 14px">
                  ${formatLabel(calcEnergy((chartData.find(c => c.name === this.name) || {}).values || [], resolution), 'legend', currentType)}
                </div>`
      },
    });

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
        this.chart.update({
          yAxis: {
            labels: {
              formatter: axisFormatter(currentType),
            },
          },
        });
        this.chart.series.forEach((series) => {
          series.update({
            type: 'column',
            tooltip: { pointFormatter: tooltipFormatter(currentType) },
            events: { click(event) { zoomIn(event.point.x, resolution); } },
          });
        });
        break;
      default:
        this.chart.update({
          yAxis: {
            labels: {
              formatter: axisFormatter(currentType),
            },
          },
        });
        this.chart.series.forEach((series) => {
          series.update({
            type: 'line',
            tooltip: { pointFormatter: tooltipFormatter(currentType) },
            events: { click(event) { zoomIn(event.point.x, resolution); } },
          });
        });
        break;
    }

    const momentRes = getMomentPeriod(resolution);

    this.chart.xAxis[0].setExtremes(moment(timestamp).startOf(momentRes).valueOf(), moment(timestamp).endOf(momentRes).valueOf());
    this.chart.redraw();
  }

  componentDidMount() {
    this.chart = this.refs.chart.getChart();
    this.draw(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.draw(nextProps);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <ReactHighcharts config={ config } ref="chart" domProps={{ className: 'chart', style: { width: '100%', height: '100%' } }}></ReactHighcharts>
    );
  }
}

function mapStateToProps(state) {
  // TODO: replace 'charts' with 'mountedPath' ownProps parameter or constant
  return {
    resolution: state.charts.resolution,
    timestamp: state.charts.timestamp,
    chartData: state.charts.chartData,
  };
}

export default connect(mapStateToProps, {
  setResolution: actions.setResolution,
  setTimestamp: actions.setTimestamp,
  chartUpdate: actions.chartUpdate,
})(Chart);
