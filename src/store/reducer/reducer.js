import types from './types';
import Helpers from './helpers';

const initialState = {
	companies: [],
	fsResults: {
		is: {},
		bs: {},
	},
	profile: {},
	searchDone: false,
	availableFSLIs: {
		is: [],
		bs: [],
	},
	defaultFSLIs: ['Revenue', 'Cost of revenue', 'Net income'],
	chosenFSLIs: [],
	chosenFSLIsArr: [],
	userInput: '',
	error: false,
	randomColorPositions: [],
	saved: false,
	currentKey: '',
	status: {
		getAllCompaniesPending: false,
		getAllCompaniesSuccess: false,
		getCompanyProfilePending: false,
		getCompanyProfileSuccess: false,
		getCompanyFinancialStatementsPending: false,
		getCompanyFinancialStatementsSuccess: false,
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
		default:
			return state;
	}
}
export default rootReducer;
