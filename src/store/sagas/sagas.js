import createSagaMiddleWare from 'redux-saga';
import { takeLatest, all } from 'redux-saga/effects';
import types from '../reducer/types';

import getAllCompanies from './requests/getAllCompanies';
// import getCompanyProfile from './getCompanyProfile';
// import getCompanyFinancialStatements from './getCompanyFinancialStatements';


const sagaMiddleWare = createSagaMiddleWare();

function* saga() {
	yield all([
		takeLatest(types.GET_ALL_COMPANIES_REQUEST, getAllCompanies),
		// takeLatest(types.GET_COMPANY_PROFILE, getCompanyProfile),
		// takeLatest(types.GET_COMPANY_FINANCIAL_STATEMENTS, getCompanyFinancialStatements),
	]);
}

const runSaga = () => { sagaMiddleWare.run(saga); };

export { sagaMiddleWare as saga, runSaga };
