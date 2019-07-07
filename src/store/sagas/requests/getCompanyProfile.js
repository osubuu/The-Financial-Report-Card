import 'regenerator-runtime/runtime';
import { call, put } from 'redux-saga/effects';
import { fetchData } from '../sagaUtils';

import actions from '../../reducer/actions';

export default function* getCompanyProfile(action) {
	const { ticker } = action.payload;
	const path = `https://financialmodelingprep.com/api/company/profile/${ticker}`;
	const params = {
		method: 'GET',
		url: 'https://proxy.hackeryou.com',
		dataResponse: 'jsonp',
		params: {
			reqUrl: path,
		},
	};
	try {
		const response = yield call(fetchData, params);
		yield put(actions.getCompanyProfileSuccess(ticker, response.data));
	} catch (e) {
		yield put(actions.getCompanyProfileFailure(e));
	}
}
