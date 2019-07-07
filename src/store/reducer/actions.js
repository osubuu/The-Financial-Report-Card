import types from './types';

const actions = {
	getAllCompaniesRequest: () => ({
		type: types.GET_ALL_COMPANIES_REQUEST,
		payload: {},
	}),
	getAllCompaniesSuccess: companiesData => ({
		type: types.GET_ALL_COMPANIES_SUCCESS,
		payload: { companiesData },
	}),
	getAllCompaniesFailure: error => ({
		type: types.GET_ALL_COMPANIES_FAILURE,
		payload: { error },
	}),
	getCompanyProfileRequest: ticker => ({
		type: types.GET_COMPANY_PROFILE_REQUEST,
		payload: { ticker },
	}),
	getCompanyProfileSuccess: (ticker, profileData) => ({
		type: types.GET_COMPANY_PROFILE_SUCCESS,
		payload: { ticker, profileData },
	}),
	getCompanyProfileFailure: error => ({
		type: types.GET_COMPANY_PROFILE_FAILURE,
		payload: { error },
	}),
};

export default actions;
