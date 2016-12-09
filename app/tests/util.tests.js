import { expect } from 'chai';
import { constants } from '../actions';
import { formatLabel, getMomentPeriod, matchesTimestamp, sumData } from '../util/process_data';

describe('charts helper functions', () => {
  describe('formatLabel', () => {
    it('should return properly formatted label for different values', () => {
      expect(formatLabel(1000000000000000)).to.equal('1 PWh');
      expect(formatLabel(1000000000000)).to.equal('1 TWh');
      expect(formatLabel(1000000000)).to.equal('1 GWh');
      expect(formatLabel(1000000)).to.equal('1 MWh');
      expect(formatLabel(1000)).to.equal('1 kWh');
      expect(formatLabel(100)).to.equal('100 Wh');
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

  describe('matchesTimestamp', () => {
    it('should return true for YEAR_MONTH resolution when difference is ±15 days', () => {
      expect(matchesTimestamp(0, (15 * 24 * 60 * 60 * 1000), constants.RESOLUTIONS.YEAR_MONTH))
      .to.be.true;
      expect(matchesTimestamp(0, (15 * 24 * 60 * 60 * 1000 + 1), constants.RESOLUTIONS.YEAR_MONTH))
      .to.be.false;
    });

    it('should return true for MONTH_DAY resolution when difference is ±12 hours', () => {
      expect(matchesTimestamp(0, (12 * 60 * 60 * 1000), constants.RESOLUTIONS.MONTH_DAY))
      .to.be.true;
      expect(matchesTimestamp(0, (12 * 60 * 60 * 1000 + 1), constants.RESOLUTIONS.MONTH_DAY))
      .to.be.false;
    });

    it('should return true for DAY_MINUTE resolution when difference is ±8 minutes', () => {
      expect(matchesTimestamp(0, (8 * 60 * 1000), constants.RESOLUTIONS.DAY_MINUTE))
      .to.be.true;
      expect(matchesTimestamp(0, (8 * 60 * 1000 + 1), constants.RESOLUTIONS.DAY_MINUTE))
      .to.be.false;
    });

    it('should return true for HOUR_MINUTE resolution when difference is ±1 second', () => {
      expect(matchesTimestamp(0, 1000, constants.RESOLUTIONS.HOUR_MINUTE))
      .to.be.true;
      expect(matchesTimestamp(0, (1000 + 1), constants.RESOLUTIONS.HOUR_MINUTE))
      .to.be.false;
    });
  });

  describe('sumData', () => {
    const data = [
      {
        id: 'm1',
        values: [
          {
            powerMilliwatt: 10,
            timestamp: 1480006800000,
          },
          {
            powerMilliwatt: 10,
            timestamp: 1480007700000,
          },
          {
            powerMilliwatt: 10,
            timestamp: 1480008600000,
          },
          {
            powerMilliwatt: 10,
            timestamp: 1480009500000,
          },
        ],
      },
      {
        id: 'm2',
        values: [
          {
            powerMilliwatt: 10,
            timestamp: 1480006800000,
          },
          {
            powerMilliwatt: 10,
            timestamp: 1480007700000 - (8 * 60 * 1000 - 1),
          },
          {
            powerMilliwatt: 10,
            timestamp: 1480008600000 - (8 * 60 * 1000 + 1),
          },
        ],
      }
    ];

    it('should return default data array if input data is empty', () => {
      expect(sumData({ data: [], resolution: constants.RESOLUTIONS.DAY_MINUTE }))
      .to.eql([{ timestamp: (new Date).getTime(), powerMilliwatt: -1 }]);
    });

    it('should sum data even with small timestamp differences', () => {
      expect(sumData({ data, resolution: constants.RESOLUTIONS.DAY_MINUTE }))
      .to.eql([
        { timestamp: 1480006800000, powerMilliwatt: 20 },
        { timestamp: 1480007700000, powerMilliwatt: 20 },
        { timestamp: 1480008600000, powerMilliwatt: 10 },
        { timestamp: 1480009500000, powerMilliwatt: 10 },
      ]);
    });
  });
});
