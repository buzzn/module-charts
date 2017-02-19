import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import ChartInfoPanel from './chart_info_panel';
import { constants, actions } from '../actions';
import { getMomentPeriod } from '../util/process_data';
import Chart from './chart';
import ChartLayout from './chart_layout';

export class ChartWrapper extends Component {
  static defaultProps = {
    Layout: ChartLayout,
  };

  changePage(direction) {
    const { setTimestamp, resolution, timestamp, chartUpdate } = this.props;
    let newTimestamp = new Date();
    const period = getMomentPeriod(resolution);
    if (direction === 'prev') {
      newTimestamp = moment(timestamp).subtract(1, period).toDate();
    } else {
      newTimestamp = moment(timestamp).add(1, period).toDate();
    }
    setTimestamp(newTimestamp);
    chartUpdate();
  }

  changeResolution(newResolution) {
    const { setResolution, chartUpdate } = this.props;
    setResolution(newResolution);
    chartUpdate();
  }

  render() {
    const { resolution, timestamp, Layout } = this.props;
    const limit = moment(timestamp).endOf(getMomentPeriod(resolution)).isSameOrAfter(new Date());

    return (
      <Layout
        { ...this.props }
        limit={ limit }
        constants={ constants }
        Chart={ Chart }
        ChartInfoPanel={ ChartInfoPanel }
        changePage={ this.changePage.bind(this) }
        changeResolution={ this.changeResolution.bind(this) } />
    );
  }
}

function mapStateToProps(state) {
  // TODO: replace 'charts' with 'mountedPath' ownProps parameter or constant
  return {
    resolution: state.charts.resolution,
    timestamp: state.charts.timestamp,
    loading: state.charts.loading,
    scores: state.charts.scores,
  };
}

export default connect(mapStateToProps, {
  setResolution: actions.setResolution,
  setTimestamp: actions.setTimestamp,
  chartUpdate: actions.chartUpdate,
})(ChartWrapper);
