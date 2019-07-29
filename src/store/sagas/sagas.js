import createSagaMiddleWare from 'redux-saga';
import { takeLatest, all } from 'redux-saga/effects';
import types from '../reducer/types';

import getAllCompanies from './requests/getAllCompanies';
import getCompanyProfile from './requests/getCompanyProfile';
import getCompanyFinancialStatements from './requests/getCompanyFinancialStatements';
import saveSnapshot from './requests/saveSnapshot';
import getSnapshot from './requests/getSnapshot';


const sagaMiddleWare = createSagaMiddleWare();

function* saga() {
	yield all([
		takeLatest(types.GET_ALL_COMPANIES_REQUEST, getAllCompanies),
		takeLatest(types.GET_COMPANY_PROFILE_REQUEST, getCompanyProfile),
		takeLatest(types.GET_COMPANY_FINANCIAL_STATEMENTS_REQUEST, getCompanyFinancialStatements),
		takeLatest(types.SAVE_SNAPSHOT_REQUEST, saveSnapshot),
		takeLatest(types.GET_SNAPSHOT_REQUEST, getSnapshot),
	]);
}

const runSaga = () => { sagaMiddleWare.run(saga); };

export { sagaMiddleWare as saga, runSaga };
