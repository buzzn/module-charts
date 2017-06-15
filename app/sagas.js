import { constants, actions } from './actions';
import { delay } from 'redux-saga';
import { call, put, fork, take, select, race, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import api from './api';
import { getMomentPeriod } from './util/process_data';

export const getConfig = state => state.config;
export const getCharts = state => state.charts;

export function* clearData() {
  yield put(actions.setData({ inData: [], outData: [] }));
}

export function* fetchData({ apiUrl, apiPath, token, groupId }) {
  yield put(actions.loading());

  const { resolution, timestamp } = yield select(getCharts);

  try {
    const data = yield call(api.getChart, { apiUrl, apiPath, groupId, timestamp, resolution, token });
    yield put(actions.setData(data));
    if (resolution !== constants.RESOLUTIONS.HOUR_MINUTE) {
      const interval = getMomentPeriod(resolution);
      // const scores = yield call(api.getScores, { apiUrl, apiPath, groupId, timestamp, interval, token });
      // yield put(actions.setScores(scores));
    }
  } catch (error) {
    console.log(error);
    yield call(clearData);
  }

  yield put(actions.loaded());
}

export function* getData({ apiUrl, apiPath, token }, { groupId }) {
  while (true) {
    yield call(fetchData, { apiUrl, apiPath, token, groupId });

    const { resolution, timestamp, shouldUpdate } = yield select(getCharts);

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

export function* chartSagas({ apiUrl, apiPath, token, groupId }) {
  yield takeLatest(constants.SET_GROUP, getData, { apiUrl, apiPath, token });
  if (groupId) yield put(actions.setGroup(groupId));
}

export default function* chartsSaga() {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  let { groupId } = yield select(getCharts);
  if (groupId) {
    yield call(fetchData, { apiUrl, apiPath, token, groupId });
  }

  while (true) {
    const sagas = yield fork(chartSagas, { apiUrl, apiPath, token, groupId });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    const { groupId: newGroupId } = yield select(getCharts);
    groupId = newGroupId;
    yield cancel(sagas);
  }
}
