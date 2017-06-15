import { expect } from 'chai';
import { constants } from '../actions';
import { formatLabel, getMomentPeriod } from '../util/process_data';

describe('charts helper functions', () => {
  describe('formatLabel', () => {
    it('should return properly formatted label for different values', () => {
      expect(formatLabel(1000000000000000)).to.equal('1 PW');
      expect(formatLabel(1000000000000)).to.equal('1 TW');
      expect(formatLabel(1000000000)).to.equal('1 GW');
      expect(formatLabel(1000000)).to.equal('1 MW');
      expect(formatLabel(1000)).to.equal('1 kW');
      expect(formatLabel(100)).to.equal('100 W');
    });

    it('should return properly formatted label for different values with "h" type', () => {
      expect(formatLabel(1000000000000000, null, 'h')).to.equal('1 PWh');
      expect(formatLabel(1000000000000, null, 'h')).to.equal('1 TWh');
      expect(formatLabel(1000000000, null, 'h')).to.equal('1 GWh');
      expect(formatLabel(1000000, null, 'h')).to.equal('1 MWh');
      expect(formatLabel(1000, null, 'h')).to.equal('1 kWh');
      expect(formatLabel(100, null, 'h')).to.equal('100 Wh');
    });
  });

  describe('getMomentPeriod', () => {
    it('should return proper moment.js period based on resolution', () => {
      expect(getMomentPeriod(constants.RESOLUTIONS.YEAR_MONTH)).to.equal('year');
      expect(getMomentPeriod(constants.RESOLUTIONS.MONTH_DAY)).to.equal('month');
      expect(getMomentPeriod(constants.RESOLUTIONS.HOUR_MINUTE)).to.equal('hour');
      expect(getMomentPeriod(constants.RESOLUTIONS.DAY_MINUTE)).to.equal('day');
    });
  });
});
