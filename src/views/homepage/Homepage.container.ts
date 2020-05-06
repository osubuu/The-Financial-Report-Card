import { connect } from 'react-redux';
import { Dispatch } from 'react';
import actions from '../../store/reducer/actions';
import { State, Action } from '../../types/types';

import Homepage from './Homepage';

const mapStateToProps = (state: State): object => ({
	companies: state.companies,
	profile: state.profile,
	fsResults: state.fsResults,
	availableFSLIs: state.availableFSLIs,
	getCompanyProfilePending: state.status.getCompanyProfilePending,
	getCompanyProfileSuccess: state.status.getCompanyProfileSuccess,
	getCompanyFinancialStatementsPending: state.status.getCompanyFinancialStatementsPending,
	getCompanyFinancialStatementsSuccess: state.status.getCompanyFinancialStatementsSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): object => ({
	getAllCompanies: (): void => dispatch(actions.getAllCompaniesRequest()),
	getProfile: (ticker: string): void => dispatch(actions.getCompanyProfileRequest(ticker)),
	getFinancialStatements: (ticker: string): void => dispatch(
		actions.getCompanyFinancialStatementsRequest(ticker),
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
