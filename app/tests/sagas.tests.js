import { expect } from 'chai';
import { delay } from 'redux-saga';
import { call, put, fork, take, select, race } from 'redux-saga/effects';
import moment from 'moment';
import chartsSaga, { getConfig, getCharts, clearAll, clearData, getIds, getData, getToken } from '../sagas';
import { constants, actions } from '../actions';
import api from '../api';
import { getMomentPeriod } from '../util/process_data';

describe('charts sagas', () => {
  describe('helper selectors should return proper state parts', () => {
    const state = { config: 'config', charts: 'charts', auth: { token: 'token' } };

    it('config selector', () => {
      expect(getConfig(state)).to.eql(state.config);
    });

    it('charts selector', () => {
      expect(getCharts(state)).to.eql(state.charts);
    });

    it('token selector', () => {
      expect(getToken(state)).to.eql(state.auth.token);
    });
  });

  describe('main flow', () => {
    const apiUrl = 'http://localhost:3000';
    const apiPath = '/api/v1/';
    const generator = chartsSaga();

    it('should get apiUrl and apiPath from the state', () => {
      expect(generator.next().value)
      .to.eql(select(getConfig));
    });

    it('should fork getIds saga', () => {
      expect(generator.next({ apiUrl, apiPath }).value)
      .to.eql(fork(getIds, { apiUrl, apiPath }));
    });

    it('should fork getData saga', () => {
      expect(generator.next({ apiUrl, apiPath }).value)
      .to.eql(fork(getData, { apiUrl, apiPath }));
    });
  });

  describe('clear all', () => {
    const generator = clearAll();

    it('should dispatch setIds with empty arrays', () => {
      expect(generator.next().value)
      .to.eql(put(actions.setIds({ inIds: [], outIds: [] })));
    });

    it('should dispatch setData with empty arrays', () => {
      expect(generator.next().value)
      .to.eql(put(actions.setData({ inData: [], outData: [] })));
    });
  });

  describe('clear data', () => {
    const generator = clearData();

    it('should dispatch setData with empty arrays', () => {
      expect(generator.next().value)
      .to.eql(put(actions.setData({ inData: [], outData: [] })));
    });
  });

  describe('getIds correct flow', () => {
    const apiUrl = 'http://localhost:3000';
    const apiPath = '/api/v1/';
    const group = 'group';
    const token = 'token';
    const inIds = [];
    const outIds = [];
    const generator = getIds({ apiUrl, apiPath });

    it('should dispatch loading', () => {
      expect(generator.next().value)
      .to.eql(put(actions.loading()));
    });

    it('should wait for SET_GROUP action', () => {
      expect(generator.next().value)
      .to.eql(take(constants.SET_GROUP));
    });

    it('should get token from state', () => {
      expect(generator.next({ group }).value)
      .to.eql(select(getToken));
    });

    it('should call api.getIds with api params', () => {
      expect(generator.next(token).value)
      .to.eql(call(api.getIds, { apiUrl, apiPath, group, token }));
    });

    it('should dispatch setIds with received ids', () => {
      expect(generator.next({ inIds, outIds }).value)
      .to.eql(put(actions.setIds({ inIds, outIds })));
    });

    it('should dispatch chartUpdate', () => {
      expect(generator.next().value)
      .to.eql(put(actions.chartUpdate()));
    });
  });

  describe('getIds error flow', () => {
    const apiUrl = 'http://localhost:3000';
    const apiPath = '/api/v1/';
    const group = 'group';
    const token = 'token';
    const generator = getIds({ apiUrl, apiPath });

    it('should call clearAll if case of error', () => {
      generator.next();
      generator.next();
      generator.next({ group });
      generator.next(token);
      expect(generator.next().value)
      .to.eql(call(clearAll));
    });
  });

  describe('getIds no group flow', () => {
    const apiUrl = 'http://localhost:3000';
    const apiPath = '/api/v1/';
    const group = null;
    const token = 'token';
    const generator = getIds({ apiUrl, apiPath });

    it('should call clearAll if there is no groupId', () => {
      generator.next();
      generator.next();
      generator.next({ group });
      expect(generator.next(token).value)
      .to.eql(call(clearAll));
    });
  });

  describe('getData correct currentTime flow', () => {
    const apiUrl = 'http://localhost:3000';
    const apiPath = '/api/v1/';
    const group = 'group';
    const token = 'token';
    const inIds = [];
    const outIds = [];
    const inData = [];
    const outData = [];
    const timestamp = moment().subtract(2, 'days').toDate();
    const resolution = constants.RESOLUTIONS.DAY_MINUTE;
    const interval = getMomentPeriod(resolution);
    const scores = { score: '' };
    const shouldUpdate = true;
    const generator = getData({ apiUrl, apiPath });

    it('should wait for SET_IDS action', () => {
      expect(generator.next().value)
      .to.eql(take(constants.SET_IDS));
    });

    it('should dispatch loading action', () => {
      expect(generator.next().value)
      .to.eql(put(actions.loading()));
    });

    it('should select required data from store', () => {
      expect(generator.next().value)
      .to.eql(select(getCharts));
    });

    it('should call api.getData for inIds', () => {
      expect(generator.next({ inIds, outIds, resolution, timestamp, shouldUpdate, group }).value)
      .to.eql(select(getToken));
    });

    it('should call api.getData for inIds', () => {
      expect(generator.next(token).value)
      .to.eql(call(api.getData, { apiUrl, apiPath, ids: inIds, timestamp, resolution, token }));
    });

    it('should call api.getData for outIds', () => {
      expect(generator.next(inData).value)
      .to.eql(call(api.getData, { apiUrl, apiPath, ids: outIds, timestamp, resolution, token }));
    });

    it('should call api.getScores', () => {
      expect(generator.next(outData).value)
      .to.eql(call(api.getScores, { apiUrl, apiPath, group, timestamp, interval, token }));
    });

    it('should dispatch setData with received data', () => {
      expect(generator.next(scores).value)
      .to.eql(put(actions.setData({ inData, outData })));
    });

    it('should dispatch setScores with received data', () => {
      expect(generator.next().value)
      .to.eql(put(actions.setScores(scores)));
    });

    it('should dispatch loaded', () => {
      expect(generator.next().value)
      .to.eql(put(actions.loaded()));
    });

    it('should wait for data refresh events', () => {
      expect(generator.next().value)
      .to.eql(race({
        delay: call(delay, 30 * 60 * 1000),
        chartUpdate: take(constants.CHART_UPDATE),
      }));
    });

    it('should dispatch detTimestamp action in case of autorefresh and a new date threshold', () => {
      expect(generator.next({ chartUpdate: null }).value)
      .to.eql(put(actions.setTimestamp(new Date())));
    });

    it('should call clearData', () => {
      expect(generator.next().value)
      .to.eql(call(clearData));
    });
  });

  describe('getData correct pastTime flow', () => {
    const apiUrl = 'http://localhost:3000';
    const apiPath = '/api/v1/';
    const group = 'group';
    const token = 'token';
    const inIds = [];
    const outIds = [];
    const inData = [];
    const outData = [];
    const timestamp = new Date();
    const resolution = constants.RESOLUTIONS.DAY_MINUTE;
    const scores = { score: '' };
    const shouldUpdate = false;
    const generator = getData({ apiUrl, apiPath });

    it('should wait for CHART_UPDATE', () => {
      generator.next();
      generator.next();
      generator.next();
      generator.next({ inIds, outIds, resolution, timestamp, shouldUpdate, group });
      generator.next(token);
      generator.next(inData);
      generator.next(outData);
      generator.next(scores);
      generator.next();
      generator.next();
      expect(generator.next().value)
      .to.eql(take(constants.CHART_UPDATE));
    });

    it('should call clearData', () => {
      expect(generator.next().value)
      .to.eql(call(clearData));
    });
  });

  describe('getData errorflow', () => {
    const apiUrl = 'http://localhost:3000';
    const apiPath = '/api/v1/';
    const token = 'token';
    const inIds = [];
    const timestamp = new Date();
    const resolution = constants.RESOLUTIONS.DAY_MINUTE;
    const generator = getData({ apiUrl, apiPath });

    it('should call clearData in case of error', () => {
      generator.next();
      generator.next();
      generator.next();
      generator.next({ apiUrl, apiPath, inIds, timestamp, resolution });
      generator.next(token);
      expect(generator.throw('err').value)
      .to.eql(call(clearData));
    });
  });
});
