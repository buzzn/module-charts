import React from 'react';

export default ({ Chart, constants, loading, limit, changeDate, timestamp, resolution, changeResolution, changePage }) => (
  <div className="col-12 chart-wrapper">
    <div style={{ position: 'relative' }}>
      <div className="text-center">
        <button className="btn btn-default year" onClick={ () => changeResolution(constants.RESOLUTIONS.YEAR_MONTH) } disabled={ loading }>Jahr</button>
        <button className="btn btn-default month" onClick={ () => changeResolution(constants.RESOLUTIONS.MONTH_DAY) } disabled={ loading }>Monat</button>
        <button className="btn btn-default day" onClick={ () => changeResolution(constants.RESOLUTIONS.DAY_MINUTE) } disabled={ loading }>Tag</button>
        <button className="btn btn-default hour" onClick={ () => changeResolution(constants.RESOLUTIONS.HOUR_MINUTE) } disabled={ loading }>Stunde</button>
      </div>
      <button className="btn btn-default btn-icon btn-circle icon-lg btn-chart-prev fa fa-chevron-left fa-2x" onClick={ () => changePage('prev') } disabled={ loading }></button>
      <button className="btn btn-default btn-icon btn-circle icon-lg btn-chart-next pull-right fa fa-chevron-right fa-2x" onClick={ () => changePage('next') } disabled={ loading || limit }></button>
      <Chart layout="horizontal" />
    </div>
  </div>
);
