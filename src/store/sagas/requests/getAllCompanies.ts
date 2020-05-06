import 'regenerator-runtime/runtime';
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { quickFetchData } from '../sagaUtils';

import actions from '../../reducer/actions';

export default function* getAllCompanies(): SagaIterator {
	const path = 'https://api.iextrading.com/1.0/ref-data/symbols';
	try {
		const response = yield call(quickFetchData, path);
		yield put(actions.getAllCompaniesSuccess(response.data));
	} catch (e) {
		yield put(actions.getAllCompaniesFailure(e));
	}
}
