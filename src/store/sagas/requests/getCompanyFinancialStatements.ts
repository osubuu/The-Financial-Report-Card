import 'regenerator-runtime/runtime';
import { call, put } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { fetchData } from '../sagaUtils';
import { Action } from '../../../types/types';

import actions from '../../reducer/actions';

const getPath = (statementType: string, ticker: string): string => {
	const basePath = 'https://financialmodelingprep.com/api/financials';
	return `${basePath}/${statementType}/${ticker}`;
};

const getParams = (path: string): object => ({
	method: 'GET',
	url: 'https://proxy.hackeryou.com',
	dataResponse: 'jsonp',
	params: {
		reqUrl: path,
	},
});

export default function* getCompanyFinancialStatements(action: Action): SagaIterator {
	const { ticker } = action.payload;

	const incomeStatementPath = getPath('income-statement', ticker);
	const balanceSheetPath = getPath('balance-sheet-statement', ticker);
	const incomeStatementParams = getParams(incomeStatementPath);
	const balanceSheetParams = getParams(balanceSheetPath);
	try {
		const incomeStatementResponse = yield call(fetchData, incomeStatementParams);
		const balanceSheetResponse = yield call(fetchData, balanceSheetParams);
		yield put(actions.getCompanyFinancialStatementsSuccess(
			ticker,
			incomeStatementResponse.data,
			balanceSheetResponse.data,
		));
	} catch (e) {
		yield put(actions.getCompanyFinancialStatementsFailure(e));
	}
}
