import types from './types';
import Helpers from './helpers';

const initialState = {
	companies: [],
	fsResults: {
		is: {},
		bs: {},
	},
	profileResult: {},
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
	loading: false,
	status: {
		getAllCompaniesPending: false,
		getAllCompaniesSuccess: false,
	},
};
function rootReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case types.GET_ALL_COMPANIES_REQUEST: {
			return {
				...state,
				status: {
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
					getAllCompaniesPending: false,
					getAllCompaniesSuccess: true,
				},
			};
		}
		case types.GET_ALL_COMPANIES_FAILURE: {
			return {
				...state,
				status: {
					getAllCompaniesPending: false,
					getAllCompaniesSuccess: false,
				},
			};
		}
		default:
			return state;
	}
}
export default rootReducer;
