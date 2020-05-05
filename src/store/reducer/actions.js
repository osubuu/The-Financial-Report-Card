import types from './types';

const getAllCompaniesRequest = () => ({
	type: types.GET_ALL_COMPANIES_REQUEST,
	payload: {},
});

const getAllCompaniesSuccess = (companiesData) => ({
	type: types.GET_ALL_COMPANIES_SUCCESS,
	payload: { companiesData },
});

const getAllCompaniesFailure = (error) => ({
	type: types.GET_ALL_COMPANIES_FAILURE,
	payload: { error },
});

const getCompanyProfileRequest = (ticker) => ({
	type: types.GET_COMPANY_PROFILE_REQUEST,
	payload: { ticker },
});

const getCompanyProfileSuccess = (ticker, profileData) => ({
	type: types.GET_COMPANY_PROFILE_SUCCESS,
	payload: { ticker, profileData },
});

const getCompanyProfileFailure = (error) => ({
	type: types.GET_COMPANY_PROFILE_FAILURE,
	payload: { error },
});

const getCompanyFinancialStatementsRequest = (ticker) => ({
	type: types.GET_COMPANY_FINANCIAL_STATEMENTS_REQUEST,
	payload: { ticker },
});

const getCompanyFinancialStatementsSuccess = (ticker, incomeStatementData, balanceSheetData) => ({
	type: types.GET_COMPANY_FINANCIAL_STATEMENTS_SUCCESS,
	payload: { ticker, incomeStatementData, balanceSheetData },
});

const getCompanyFinancialStatementsFailure = (error) => ({
	type: types.GET_COMPANY_FINANCIAL_STATEMENTS_FAILURE,
	payload: { error },
});

const saveSnapshotRequest = (selectedFSLIs) => ({
	type: types.SAVE_SNAPSHOT_REQUEST,
	payload: { selectedFSLIs },
});

const saveSnapshotSuccess = (currentKey) => ({
	type: types.SAVE_SNAPSHOT_SUCCESS,
	payload: { currentKey },
});

const saveSnapshotFailure = (error) => ({
	type: types.SAVE_SNAPSHOT_FAILURE,
	payload: { error },
});

const getSnapshotRequest = (currentKey) => ({
	type: types.GET_SNAPSHOT_REQUEST,
	payload: { currentKey },
});

const getSnapshotSuccess = (data) => ({
	type: types.GET_SNAPSHOT_SUCCESS,
	payload: { data },
});

const getSnapshotFailure = (error) => ({
	type: types.GET_SNAPSHOT_FAILURE,
	payload: { error },
});

export default {
	getAllCompaniesRequest,
	getAllCompaniesSuccess,
	getAllCompaniesFailure,
	getCompanyProfileRequest,
	getCompanyProfileSuccess,
	getCompanyProfileFailure,
	getCompanyFinancialStatementsRequest,
	getCompanyFinancialStatementsSuccess,
	getCompanyFinancialStatementsFailure,
	saveSnapshotRequest,
	saveSnapshotSuccess,
	saveSnapshotFailure,
	getSnapshotRequest,
	getSnapshotSuccess,
	getSnapshotFailure,
};
