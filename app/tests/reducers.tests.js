import { expect } from 'chai';
import moment from 'moment';
import reducers, { shouldUpdate } from '../reducers';
import { getMomentPeriod } from '../util/process_data';
import { constants } from '../actions';

describe('charts reducers', () => {
  const current = new Date();

  const initialState = {
    group: '',
    inIds: [],
    outIds: [],
    resolution: constants.RESOLUTIONS.DAY_MINUTE,
    timestamp: current,
    inData: [],
    outData: [],
    loading: false,
    shouldUpdate: true,
    scores: {},
  };

  it('shouldUpdate helper function should return true only for the "current time"', () => {
    const currentTime = current;
    const pastTime = moment(current).subtract(2, 'days').toDate();
    expect(shouldUpdate(currentTime, constants.RESOLUTIONS.DAY_MINUTE)).to.be.true;
    expect(shouldUpdate(pastTime, constants.RESOLUTIONS.DAY_MINUTE)).to.be.false;
  });

  it('should return the initial state', () => {
    // initialState is a workaround for time difference failures when using new Date()
    // another solution can be mocking Date/Date.now
    expect(reducers(initialState, {})).to.eql(initialState);
  });

  it('should handle SET_GROUP', () => {
    const group = 'group';
    const action = { type: constants.SET_GROUP, group };
    expect(reducers(initialState, action)).to.eql({ ...initialState, group });
  });

  it('should handle SET_IDS', () => {
    const ids = { inIds: ['1'], outIds: ['2'] };
    const action = { type: constants.SET_IDS, ids };
    expect(reducers(initialState, action)).to.eql({ ...initialState, ...ids });
  });

  it('should handle SET_DATA', () => {
    const data = { inData: ['1'], outData: ['2'] };
    const action = { type: constants.SET_DATA, data };
    expect(reducers(initialState, action)).to.eql({ ...initialState, ...data });
  });

  it('should handle SET_RESOLUTION', () => {
    const resolution = constants.RESOLUTIONS.YEAR_MONTH;
    const action = { type: constants.SET_RESOLUTION, resolution };
    expect(reducers(initialState, action))
    .to.eql({ ...initialState, resolution, shouldUpdate: shouldUpdate(initialState.timestamp, resolution) });
  });

  it('should handle SET_TIMESTAMP', () => {
    const timestamp = moment(current).subtract(1, 'year').toDate();
    const action = { type: constants.SET_TIMESTAMP, timestamp };
    expect(reducers(initialState, action))
    .to.eql({ ...initialState, timestamp, shouldUpdate: shouldUpdate(timestamp, initialState.resolution) });
  });

  it('should handle LOADING', () => {
    const action = { type: constants.LOADING };
    expect(reducers(initialState, action)).to.eql({ ...initialState, loading: true });
  });

  it('should handle LOADED', () => {
    const action = { type: constants.LOADED };
    expect(reducers(initialState, action)).to.eql({ ...initialState, loading: false });
  });

  it('should handle SET_SCORES', () => {
    const scores = { score: 1 };
    const action = { type: constants.SET_SCORES, scores };
    expect(reducers(initialState, action)).to.eql({ ...initialState, scores });
  });

  it('should handle CHART_UPDATE', () => {
    const action = { type: constants.CHART_UPDATE };
    expect(reducers(initialState, action)).to.eql(initialState);
  });
});
