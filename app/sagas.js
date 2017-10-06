import { delay } from 'redux-saga';
import { call, put, fork, take, select, race, takeLatest, cancel } from 'redux-saga/effects';
import moment from 'moment';
import { constants, actions } from './actions';
import api from './api';
import { getMomentPeriod } from './util/process_data';

export const getConfig = state => state.config;
export const getCharts = state => state.charts;

export function* clearData() {
  yield put(actions.setData([]));
}

export function* fetchData({ apiUrl, apiPath, token, groupId, registerId }) {
  yield put(actions.loading());

  const { resolution, timestamp } = yield select(getCharts);

  try {
    // TODO: add api call for register chart data if !!registerId
    const data = yield call(api.getGroupChart, { apiUrl, apiPath, groupId, timestamp, resolution, token });
    yield put(actions.setData(data));
  } catch (error) {
    console.log(error);
    yield call(clearData);
  }

  yield put(actions.loaded());
}

export function* getData({ apiUrl, apiPath, token }, { groupId, registerId }) {
  while (true) {
    yield call(fetchData, { apiUrl, apiPath, token, groupId, registerId });

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

export function* chartSagas({ apiUrl, apiPath, token, groupId, registerId }) {
  yield takeLatest(constants.SET_GROUP_ID, getData, { apiUrl, apiPath, token });
  if (groupId) yield put(actions.setGroupId({ groupId, registerId }));
}

export default function* chartsSaga() {
  const { apiUrl, apiPath } = yield take(constants.SET_API_PARAMS);
  let { token } = yield take(constants.SET_TOKEN);

  let { groupId, registerId } = yield select(getCharts);
  if (groupId) {
    yield call(fetchData, { apiUrl, apiPath, token, groupId, registerId });
  }

  while (true) {
    const sagas = yield fork(chartSagas, { apiUrl, apiPath, token, groupId, registerId });
    const payload = yield take(constants.SET_TOKEN);
    token = payload.token;
    const { groupId: newGroupId, registerId: newRegisterId } = yield select(getCharts);
    groupId = newGroupId;
    registerId = newRegisterId;
    yield cancel(sagas);
  }
}
