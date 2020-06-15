import types from './types';
import Helpers from './helpers';
import { State, Action } from '../../types/types';

const initialState: State = {
	companies: [],
	fsResults: {
		is: {},
		bs: {},
	},
	profile: {} as any,
	availableFSLIs: {
		is: [],
		bs: [],
	},
	selectedFSLIs: [],
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
		getSnapshotPending: false,
		getSnapshotSuccess: false,
	},
};

function rootReducer(state: State = initialState, action: Action): State {
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
			return {
				...state,
				profile: payload.profileData,
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
			const { incomeStatementData, balanceSheetData } = payload;
			const availableFSLIs = Helpers.getAvailableFSLIs(incomeStatementData, balanceSheetData);
			return {
				...state,
				fsResults: {
					is: incomeStatementData,
					bs: balanceSheetData,
				},
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
		case types.GET_SNAPSHOT_REQUEST: {
			return {
				...state,
				status: {
					...state.status,
					getSnapshotPending: true,
					getSnapshotSuccess: false,
				},
			};
		}
		case types.GET_SNAPSHOT_SUCCESS: {
			const { data } = payload;
			return {
				...state,
				fsResults: data.fsResults,
				profile: data.profile,
				availableFSLIs: data.availableFSLIs,
				selectedFSLIs: data.selectedFSLIs,
				status: {
					...state.status,
					getSnapshotPending: false,
					getSnapshotSuccess: true,
				},
			};
		}
		case types.GET_SNAPSHOT_FAILURE: {
			return {
				...state,
				status: {
					...state.status,
					getSnapshotPending: false,
					getSnapshotSuccess: false,
				},
			};
		}
		default:
			return state;
	}
}
export default rootReducer;
