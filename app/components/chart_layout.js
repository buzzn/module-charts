import React from 'react';

export default ({ Chart, ChartInfoPanel, constants, scores, loading, limit, changeResolution, changePage }) => (
  <div className="col-sm-12 col-md-6 col-lg-6 chart-wrapper">
    <div className="row">
      <div className="col-sm-12 col-md-6 col-lg-6">
        <ChartInfoPanel {...{ text: 'Autarkie', icon: 'fa-flag-checkered', data: scores.autarchy }} />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6">
        <ChartInfoPanel {...{ text: 'Sparsamkeit', icon: 'fa-power-off', data: scores.sufficiency }} />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12 col-md-12 col-lg-12">
        <div className="panel">
          <div className="panel-body" style={{ position: 'relative' }}>
            <div className="text-center">
              <button className="btn btn-default year" onClick={ () => changeResolution(constants.RESOLUTIONS.YEAR_MONTH) } disabled={ loading }>Jahr</button>
              <button className="btn btn-default month" onClick={ () => changeResolution(constants.RESOLUTIONS.MONTH_DAY) } disabled={ loading }>Monat</button>
              <button className="btn btn-default day" onClick={ () => changeResolution(constants.RESOLUTIONS.DAY_MINUTE) } disabled={ loading }>Tag</button>
              <button className="btn btn-default hour" onClick={ () => changeResolution(constants.RESOLUTIONS.HOUR_MINUTE) } disabled={ loading }>Stunde</button>
            </div>
            <button className="btn btn-default btn-icon btn-circle icon-lg btn-chart-prev fa fa-chevron-left fa-2x" onClick={ () => changePage('prev') } disabled={ loading }></button>
            <button className="btn btn-default btn-icon btn-circle icon-lg btn-chart-next pull-right fa fa-chevron-right fa-2x" onClick={ () => changePage('next') } disabled={ loading || limit }></button>
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
      <div className="col-sm-12 col-md-6 col-lg-6">
        <ChartInfoPanel {...{ text: 'Passung', icon: 'fa-line-chart', data: scores.fitting }} />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6">
        <ChartInfoPanel {...{ text: 'Lokalität', icon: 'fa-map-marker', data: scores.closeness }} />
      </div>
    </div>
  </div>
);
