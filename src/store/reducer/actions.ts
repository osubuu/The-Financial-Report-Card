import types from './types';
import {
	Action, Company, Profile, SnapshotData, SelectedFSLI,
} from '../../types/types';

const getAllCompaniesRequest = (): Action => ({
	type: types.GET_ALL_COMPANIES_REQUEST,
	payload: {},
});

const getAllCompaniesSuccess = (companiesData: Company[]): Action => ({
	type: types.GET_ALL_COMPANIES_SUCCESS,
	payload: { companiesData },
});

const getAllCompaniesFailure = (error: any): Action => ({
	type: types.GET_ALL_COMPANIES_FAILURE,
	payload: { error },
});

const getCompanyProfileRequest = (ticker: string): Action => ({
	type: types.GET_COMPANY_PROFILE_REQUEST,
	payload: { ticker },
});

const getCompanyProfileSuccess = (profileData: Profile): Action => ({
	type: types.GET_COMPANY_PROFILE_SUCCESS,
	payload: { profileData },
});

const getCompanyProfileFailure = (error: any): Action => ({
	type: types.GET_COMPANY_PROFILE_FAILURE,
	payload: { error },
});

const getCompanyFinancialStatementsRequest = (ticker: string): Action => ({
	type: types.GET_COMPANY_FINANCIAL_STATEMENTS_REQUEST,
	payload: { ticker },
});

const getCompanyFinancialStatementsSuccess = (
	incomeStatementData: any, balanceSheetData: any,
): Action => ({
	type: types.GET_COMPANY_FINANCIAL_STATEMENTS_SUCCESS,
	payload: { incomeStatementData, balanceSheetData },
});

const getCompanyFinancialStatementsFailure = (error: any): Action => ({
	type: types.GET_COMPANY_FINANCIAL_STATEMENTS_FAILURE,
	payload: { error },
});

const saveSnapshotRequest = (selectedFSLIs: SelectedFSLI[]): Action => ({
	type: types.SAVE_SNAPSHOT_REQUEST,
	payload: { selectedFSLIs },
});

const saveSnapshotSuccess = (currentKey: string): Action => ({
	type: types.SAVE_SNAPSHOT_SUCCESS,
	payload: { currentKey },
});

const saveSnapshotFailure = (error: any): Action => ({
	type: types.SAVE_SNAPSHOT_FAILURE,
	payload: { error },
});

const getSnapshotRequest = (currentKey: string): Action => ({
	type: types.GET_SNAPSHOT_REQUEST,
	payload: { currentKey },
});

const getSnapshotSuccess = (data: SnapshotData): Action => ({
	type: types.GET_SNAPSHOT_SUCCESS,
	payload: { data },
});

const getSnapshotFailure = (error: any): Action => ({
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
