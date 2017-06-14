import { constants, actions } from './actions';
import { delay } from 'redux-saga';
import { call, put, fork, take, select, race, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import api from './api';
import { getMomentPeriod } from './util/process_data';

export const getConfig = state => state.config;
export const getCharts = state => state.charts;
// TODO: switch to action with parameter later, decouple from module-auth
export const getToken = state => (state.auth || {}).token;

export function* clearData() {
  yield put(actions.setData({ inData: [], outData: [] }));
}

export function* getData({ apiUrl, apiPath }) {
  while (true) {
    yield put(actions.loading());

    const { resolution, timestamp, shouldUpdate, group } = yield select(getCharts);
    const token = yield select(getToken);

    try {
      const data = yield call(api.getChart, { apiUrl, apiPath, group, timestamp, resolution, token });
      yield put(actions.setData(data));
      if (resolution !== constants.RESOLUTIONS.HOUR_MINUTE) {
        const interval = getMomentPeriod(resolution);
        const scores = yield call(api.getScores, { apiUrl, apiPath, group, timestamp, interval, token });
        yield put(actions.setScores(scores));
      }
    } catch (error) {
      console.log(error);
      yield call(clearData);
    }

    yield put(actions.loaded());

    if (shouldUpdate) {
      let updateDelay = 5 * 60 * 1000;

      switch (resolution) {
        case constants.RESOLUTIONS.YEAR_MONTH:
          updateDelay = 24 * 60 * 60 * 1000;
          break;
        case constants.RESOLUTIONS.MONTH_DAY:
          updateDelay = 60 * 60 * 1000;
          break;
        case constants.RESOLUTIONS.HOUR_MINUTE:
          updateDelay = 5 * 60 * 1000;
          break;
        default:
        case constants.RESOLUTIONS.DAY_MINUTE:
          updateDelay = 30 * 60 * 1000;
          break;
      }

      const { chartUpdate } = yield race({
        delay: call(delay, updateDelay),
        chartUpdate: take(constants.CHART_UPDATE),
      });

      if (!chartUpdate && moment(timestamp).endOf(getMomentPeriod(resolution)).isBefore(new Date())) {
        yield put(actions.setTimestamp(new Date()));
      }
    } else {
      yield take(constants.CHART_UPDATE);
    }

    yield call(clearData);
  }
}

export default function* chartsSaga() {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  yield takeLatest(constants.SET_GROUP, getData, { apiUrl, apiPath });

  // let groupId = yield select(getGroupId);
  // if (groupId) {
  //   yield fork(getGroupBubbles, { apiUrl, apiPath, token, groupId });
  // }

  while (true) {
    // const sagas = yield fork(bubblesSagas, { apiUrl, apiPath, token, groupId });
    const sagas = takeLatest(constants.SET_GROUP, getData, { apiUrl, apiPath });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    yield cancel(sagas);
  }
}
