"use strict";

var _chai = require("chai");

var _actions = require("../actions");

var _process_data = require("../util/process_data");

describe('charts helper functions', function () {
  describe('formatLabel', function () {
    it('should return properly formatted label for different values', function () {
      (0, _chai.expect)((0, _process_data.formatLabel)(1000000000000000)).to.equal('1 PW');
      (0, _chai.expect)((0, _process_data.formatLabel)(1000000000000)).to.equal('1 TW');
      (0, _chai.expect)((0, _process_data.formatLabel)(1000000000)).to.equal('1 GW');
      (0, _chai.expect)((0, _process_data.formatLabel)(1000000)).to.equal('1 MW');
      (0, _chai.expect)((0, _process_data.formatLabel)(1000)).to.equal('1 kW');
      (0, _chai.expect)((0, _process_data.formatLabel)(100)).to.equal('100 W');
    });
    it('should return properly formatted label for different values with "h" type', function () {
      (0, _chai.expect)((0, _process_data.formatLabel)(1000000000000000, null, 'h')).to.equal('1 PWh');
      (0, _chai.expect)((0, _process_data.formatLabel)(1000000000000, null, 'h')).to.equal('1 TWh');
      (0, _chai.expect)((0, _process_data.formatLabel)(1000000000, null, 'h')).to.equal('1 GWh');
      (0, _chai.expect)((0, _process_data.formatLabel)(1000000, null, 'h')).to.equal('1 MWh');
      (0, _chai.expect)((0, _process_data.formatLabel)(1000, null, 'h')).to.equal('1 kWh');
      (0, _chai.expect)((0, _process_data.formatLabel)(100, null, 'h')).to.equal('100 Wh');
    });
  });
  describe('getMomentPeriod', function () {
    it('should return proper moment.js period based on resolution', function () {
      (0, _chai.expect)((0, _process_data.getMomentPeriod)(_actions.constants.RESOLUTIONS.YEAR_MONTH)).to.equal('year');
      (0, _chai.expect)((0, _process_data.getMomentPeriod)(_actions.constants.RESOLUTIONS.MONTH_DAY)).to.equal('month');
      (0, _chai.expect)((0, _process_data.getMomentPeriod)(_actions.constants.RESOLUTIONS.HOUR_MINUTE)).to.equal('hour');
      (0, _chai.expect)((0, _process_data.getMomentPeriod)(_actions.constants.RESOLUTIONS.DAY_MINUTE)).to.equal('day');
    });
  });
});
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
}();

;