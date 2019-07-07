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
};

export default actions;
