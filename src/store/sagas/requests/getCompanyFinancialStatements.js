import 'regenerator-runtime/runtime';
import { call, put, select } from 'redux-saga/effects';

import {
	fetchData, getParams, handleGenericError,
	getAuthState, getSlicerState,
} from '../../common';
import { actions } from '../../../reducers/slicer/slicer';

export default function* loadProjectStats(action) {
	const { token } = yield select(getAuthState);
	const { currentProject: projectId, projects } = yield select(getSlicerState);
	const path = `projects/${projectId}/statistics`;
	const params = getParams('GET', token);
	try {
		const response = yield call(fetchData, path, params);
		const { statistics } = response;
		const project = {
			...projects[projectId],
			stats: statistics,
		};
		yield put(actions.loadProjectStatsSuccess(project));
	} catch (e) {
		yield call(handleGenericError, action, e);
	}
}
