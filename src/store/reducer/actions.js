import types from './types';

const actions = {
	getAllCompaniesRequest: () => ({
		type: types.GET_ALL_COMPANIES_REQUEST,
		payload: {},
	}),
	getAllCompaniesSuccess: (companiesData) => ({
		type: types.GET_ALL_COMPANIES_SUCCESS,
		payload: { companiesData },
	}),
	getAllCompaniesFailure: (error) => ({
		type: types.GET_ALL_COMPANIES_FAILURE,
		payload: { error },
	}),
	getCompanyProfileRequest: (ticker) => ({
		type: types.GET_COMPANY_PROFILE_REQUEST,
		payload: { ticker },
	}),
	getCompanyProfileSuccess: (ticker, profileData) => ({
		type: types.GET_COMPANY_PROFILE_SUCCESS,
		payload: { ticker, profileData },
	}),
	getCompanyProfileFailure: (error) => ({
		type: types.GET_COMPANY_PROFILE_FAILURE,
		payload: { error },
	}),
	getCompanyFinancialStatementsRequest: (ticker) => ({
		type: types.GET_COMPANY_FINANCIAL_STATEMENTS_REQUEST,
		payload: { ticker },
	}),
	getCompanyFinancialStatementsSuccess: (ticker, incomeStatementData, balanceSheetData) => ({
		type: types.GET_COMPANY_FINANCIAL_STATEMENTS_SUCCESS,
		payload: { ticker, incomeStatementData, balanceSheetData },
	}),
	getCompanyFinancialStatementsFailure: (error) => ({
		type: types.GET_COMPANY_FINANCIAL_STATEMENTS_FAILURE,
		payload: { error },
	}),
	saveSnapshotRequest: (selectedFSLIs) => ({
		type: types.SAVE_SNAPSHOT_REQUEST,
		payload: { selectedFSLIs },
	}),
	saveSnapshotSuccess: (currentKey) => ({
		type: types.SAVE_SNAPSHOT_SUCCESS,
		payload: { currentKey },
	}),
	saveSnapshotFailure: (error) => ({
		type: types.SAVE_SNAPSHOT_FAILURE,
		payload: { error },
	}),
	getSnapshotRequest: (currentKey) => ({
		type: types.GET_SNAPSHOT_REQUEST,
		payload: { currentKey },
	}),
	getSnapshotSuccess: (data) => ({
		type: types.GET_SNAPSHOT_SUCCESS,
		payload: { data },
	}),
	getSnapshotFailure: (error) => ({
		type: types.GET_SNAPSHOT_FAILURE,
		payload: { error },
	}),
};

export default actions;
