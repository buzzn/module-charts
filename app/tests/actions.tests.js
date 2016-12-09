import { expect } from 'chai';
import { actions, constants } from '../actions';

describe('charts actions', () => {
  it('should create an action to set group', () => {
    const group = 'group';
    const expectedAction = { type: constants.SET_GROUP, group };
    expect(actions.setGroup(group)).to.eql(expectedAction);
  });

  it('should create action to set ids', () => {
    const ids = 'ids';
    const expectedAction = { type: constants.SET_IDS, ids };
    expect(actions.setIds(ids)).to.eql(expectedAction);
  });

  it('should create action to set data', () => {
    const data = 'data';
    const expectedAction = { type: constants.SET_DATA, data };
    expect(actions.setData(data)).to.eql(expectedAction);
  });

  it('should create action to set resolution', () => {
    const resolution = 'resolution';
    const expectedAction = { type: constants.SET_RESOLUTION, resolution };
    expect(actions.setResolution(resolution)).to.eql(expectedAction);
  });

  it('should create action to set timestamp', () => {
    const timestamp = 'timestamp';
    const expectedAction = { type: constants.SET_TIMESTAMP, timestamp };
    expect(actions.setTimestamp(timestamp)).to.eql(expectedAction);
  });

  it('should create action to set loading state', () => {
    expect(actions.loading()).to.eql({ type: constants.LOADING });
  });

  it('should create action to set loaded state', () => {
    expect(actions.loaded()).to.eql({ type: constants.LOADED });
  });

  it('should create action to set chart update', () => {
    expect(actions.chartUpdate()).to.eql({ type: constants.CHART_UPDATE });
  });

  it('should create action to set scores', () => {
    const scores = 'scores';
    const expectedAction = { type: constants.SET_SCORES, scores };
    expect(actions.setScores(scores)).to.eql(expectedAction);
  });
});
