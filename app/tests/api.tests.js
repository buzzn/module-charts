import 'isomorphic-fetch';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
import moment from 'moment';
import api, { uriTimestamp, getPower } from '../api';
import { constants } from '../actions';

describe('chart api', () => {
  const apiUrl = 'http://localhost:3000';
  const apiPath = '/api/v1';
  const group = 'groupId';

  chai.use(chaiAsPromised);
  const expect = chai.expect;

  it('should return formatted group metering points', () => {
    nock(apiUrl)
    .get(`${apiPath}/groups/${group}/metering-points`)
    .reply(200, {
      meta: { total_pages: 2 },
    });

    nock(apiUrl)
    .get(`${apiPath}/groups/${group}/metering-points?page=1`)
    .reply(200, {
      data: [{ id: 'mp1', attributes: { mode: 'in' } }],
      meta: { total_pages: 2 },
    });

    nock(apiUrl)
    .get(`${apiPath}/groups/${group}/metering-points?page=2`)
    .reply(200, {
      data: [{ id: 'mp2', attributes: { mode: 'out' } }],
      meta: { total_pages: 2 },
    });

    return expect(api.getIds({ apiUrl, apiPath, group }))
    .to.eventually.eql({ inIds: ['mp1'], outIds: ['mp2'] });
  });

  it('should return power data for metering points', () => {
    const timestamp = new Date();
    const resolution = constants.RESOLUTIONS.DAY_MINUTE;
    const id = 'mpId';

    nock(apiUrl)
    .get(`${apiPath}/aggregates/past?timestamp=${uriTimestamp(timestamp)}&resolution=${resolution}&metering_point_ids=${[id]}`)
    .reply(200, [
      { timestamp: timestamp.toISOString(), power_milliwatt: 113856.0 },
      { timestamp: moment(timestamp).add(15, 'minutes').toISOString(), power_milliwatt: 113856.0 },
    ]);

    return expect(api.getData({ apiUrl, apiPath, ids: [id], timestamp, resolution }))
    .to.eventually.eql([{ id, values: [
      { powerMilliwatt: getPower({ power_milliwatt: 113856.0 }, resolution), timestamp: timestamp.getTime() },
      { powerMilliwatt: getPower({ power_milliwatt: 113856.0 }, resolution), timestamp: moment(timestamp).add(15, 'minutes').valueOf() },
    ] }]);
  });

  it('getPower should use proper power field name based on resolution', () => {
    expect(getPower({ power_milliwatt: 1000 }, constants.RESOLUTIONS.DAY_MINUTE))
    .to.eql(1);
    expect(getPower({ power_milliwatt: 1000 }, constants.RESOLUTIONS.HOUR_MINUTE))
    .to.eql(1);
    expect(getPower({ energy_milliwatt_hour: 1000 }, constants.RESOLUTIONS.MONTH_DAY))
    .to.eql(1);
    expect(getPower({ energy_milliwatt_hour: 1000 }, constants.RESOLUTIONS.YEAR_MONTH))
    .to.eql(1);
  });

  it('should return scores for the group', () => {
    const group = 'groupId';
    const timestamp = new Date();
    const interval = 'month';

    nock(apiUrl)
    .get(`${apiPath}/groups/${group}/scores?timestamp=${uriTimestamp(timestamp)}&interval=${interval}`)
    .reply(200, { data: [
      { attributes: { mode: 'fitting', value: 10 } },
      { attributes: { mode: 'autarchy', value: 10 } },
      { attributes: { mode: 'closeness', value: 10 } },
      { attributes: { mode: 'sufficiency', value: 10 } },
    ] });

    return expect(api.getScores({ apiUrl, apiPath, group, interval, timestamp }))
    .to.eventually.eql({ fitting: 10, autarchy: 10, closeness: 10, sufficiency: 10 });
  });
});
