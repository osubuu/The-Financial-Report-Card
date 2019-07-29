import types from './types';
import Helpers from './helpers';

const initialState = {
	companies: [],
	fsResults: {
		is: {},
		bs: {},
	},
	profile: {},
	availableFSLIs: {
		is: [],
		bs: [],
	},
	userInput: '',
	currentKey: '',
	status: {
		getAllCompaniesPending: false,
		getAllCompaniesSuccess: false,
		getCompanyProfilePending: false,
		getCompanyProfileSuccess: false,
		getCompanyFinancialStatementsPending: false,
		getCompanyFinancialStatementsSuccess: false,
		saveSnapshotPending: false,
		saveSnapshotSuccess: false,
	},
};

function rootReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case types.GET_ALL_COMPANIES_REQUEST: {
			return {
				...state,
				status: {
					...state.status,
					getAllCompaniesPending: true,
					getAllCompaniesSuccess: false,
				},
			};
		}
		case types.GET_ALL_COMPANIES_SUCCESS: {
			const { companiesData } = payload;
			const validCompanies = Helpers.sanitizeCompaniesData(companiesData);
			return {
				...state,
				companies: validCompanies,
				status: {
					...state.status,
					getAllCompaniesPending: false,
					getAllCompaniesSuccess: true,
				},
			};
		}
		case types.GET_ALL_COMPANIES_FAILURE: {
			return {
				...state,
				status: {
					...state.status,
					getAllCompaniesPending: false,
					getAllCompaniesSuccess: false,
				},
			};
		}
		case types.GET_COMPANY_PROFILE_REQUEST: {
			return {
				...state,
				profile: { ...initialState.profile },
				status: {
					...state.status,
					getCompanyProfilePending: true,
					getCompanyProfileSuccess: false,
				},
			};
		}
		case types.GET_COMPANY_PROFILE_SUCCESS: {
			const { profileData, ticker } = payload;
			const profile = Helpers.sanitizeProfileData(ticker, profileData);
			return {
				...state,
				profile,
				status: {
					...state.status,
					getCompanyProfilePending: false,
					getCompanyProfileSuccess: true,
				},
			};
		}
		case types.GET_COMPANY_PROFILE_FAILURE: {
			return {
				...state,
				status: {
					...state.status,
					getCompanyProfilePending: false,
					getCompanyProfileSuccess: false,
				},
			};
		}
		case types.GET_COMPANY_FINANCIAL_STATEMENTS_REQUEST: {
			return {
				...state,
				fsResults: { ...initialState.fsResults },
				availableFSLIs: { ...initialState.availableFSLIs },
				status: {
					...state.status,
					getCompanyFinancialStatementsPending: true,
					getCompanyFinancialStatementsSuccess: false,
				},
			};
		}
		case types.GET_COMPANY_FINANCIAL_STATEMENTS_SUCCESS: {
			const { ticker, incomeStatementData, balanceSheetData } = payload;
			const fsResults = Helpers.sanitizeFinancialStatementData(
				incomeStatementData,
				balanceSheetData,
			);
			const availableFSLIs = Helpers.getAvailableFSLIs(ticker, fsResults);
			return {
				...state,
				fsResults,
				availableFSLIs,
				status: {
					...state.status,
					getCompanyFinancialStatementsPending: false,
					getCompanyFinancialStatementsSuccess: true,
				},
			};
		}
		case types.GET_COMPANY_FINANCIAL_STATEMENTS_FAILURE: {
			return {
				...state,
				status: {
					...state.status,
					getCompanyFinancialStatementsPending: false,
					getCompanyFinancialStatementsSuccess: false,
				},
			};
		}
		case types.SAVE_SNAPSHOT_REQUEST: {
			return {
				...state,
				status: {
					...state.status,
					saveSnapshotPending: true,
					saveSnapshotSuccess: false,
				},
			};
		}
		case types.SAVE_SNAPSHOT_SUCCESS: {
			const { currentKey } = payload;
			return {
				...state,
				currentKey,
				status: {
					...state.status,
					saveSnapshotPending: false,
					saveSnapshotSuccess: true,
				},
			};
		}
		case types.SAVE_SNAPSHOT_FAILURE: {
			return {
				...state,
				status: {
					...state.status,
					saveSnapshotPending: false,
					saveSnapshotSuccess: false,
				},
			};
		}
		default:
			return state;
	}
}
export default rootReducer;
