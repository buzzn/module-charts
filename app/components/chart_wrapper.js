import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import ChartInfoPanel from './chart_info_panel';
import { constants, actions } from '../actions';
import { getMomentPeriod } from '../util/process_data';
import Chart from './chart';

export class ChartWrapper extends Component {
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
    const { resolution, timestamp, loading, scores } = this.props;
    const limit = moment(timestamp).endOf(getMomentPeriod(resolution)).isSameOrAfter(new Date());

    return (
      <div className="col-sm-12 col-md-6 col-lg-6 chart-wrapper">
        <div className="row">
          <ChartInfoPanel {...{ text: 'Autarkie', icon: 'fa-flag-checkered', data: scores.autarchy }} />
          <ChartInfoPanel {...{ text: 'Sparsamkeit', icon: 'fa-power-off', data: scores.sufficiency }} />
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="panel">
              <div className="panel-body" style={{ position: 'relative' }}>
                <div className="text-center">
                  <button className="btn btn-default year" onClick={ () => this.changeResolution(constants.RESOLUTIONS.YEAR_MONTH) } disabled={ loading }>Jahr</button>
                  <button className="btn btn-default month" onClick={ () => this.changeResolution(constants.RESOLUTIONS.MONTH_DAY) } disabled={ loading }>Monat</button>
                  <button className="btn btn-default day" onClick={ () => this.changeResolution(constants.RESOLUTIONS.DAY_MINUTE) } disabled={ loading }>Tag</button>
                  <button className="btn btn-default hour" onClick={ () => this.changeResolution(constants.RESOLUTIONS.HOUR_MINUTE) } disabled={ loading }>Stunde</button>
                </div>
                <button className="btn btn-default btn-icon btn-circle icon-lg btn-chart-prev fa fa-chevron-left fa-2x" onClick={ this.changePage.bind(this, 'prev') } disabled={ loading }></button>
                <button className="btn btn-default btn-icon btn-circle icon-lg btn-chart-next pull-right fa fa-chevron-right fa-2x" onClick={ this.changePage.bind(this, 'next') } disabled={ loading || limit }></button>
                <Chart />
                <div className="basic-loading" style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: loading ? 10 : -10,
                  background: 'rgba(255, 255, 255, 0.7)',
                }}>
                  <div style={{ color: 'grey', fontSize: '28px', fontWeight: 'bolder', marginLeft: '40%', marginTop: '35%' }}>
                    Loading...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <ChartInfoPanel {...{ text: 'Passung', icon: 'fa-line-chart', data: scores.fitting }} />
          <ChartInfoPanel {...{ text: 'Lokalität', icon: 'fa-map-marker', data: scores.closeness }} />
        </div>
      </div>
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
