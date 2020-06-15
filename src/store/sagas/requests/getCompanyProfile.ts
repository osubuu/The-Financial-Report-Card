import 'regenerator-runtime/runtime';
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { fetchData, apiKey } from '../sagaUtils';
import { Action } from '../../../types/types';

import actions from '../../reducer/actions';

export default function* getCompanyProfile(action: Action): SagaIterator {
	const { ticker } = action.payload;
	const path = `https://financialmodelingprep.com/api/v3/profile/${ticker}`;
	const params = {
		method: 'GET',
		url: path,
		dataResponse: 'json',
		params: {
			apikey: apiKey,
		},
	};
	try {
		const response = yield call(fetchData, params);
		yield put(actions.getCompanyProfileSuccess(response.data[0]));
	} catch (e) {
		yield put(actions.getCompanyProfileFailure(e));
	}
}
