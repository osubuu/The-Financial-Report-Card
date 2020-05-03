import { connect } from 'react-redux';
import actions from '../../store/reducer/actions';

import Homepage from './Homepage';

const mapStateToProps = (state) => ({
	companies: state.companies,
	profile: state.profile,
	fsResults: state.fsResults,
	availableFSLIs: state.availableFSLIs,
	getCompanyProfilePending: state.status.getCompanyProfilePending,
	getCompanyProfileSuccess: state.status.getCompanyProfileSuccess,
	getCompanyFinancialStatementsPending: state.status.getCompanyFinancialStatementsPending,
	getCompanyFinancialStatementsSuccess: state.status.getCompanyFinancialStatementsSuccess,
});

const mapDispatchToProps = (dispatch) => ({
	getAllCompanies: () => dispatch(actions.getAllCompaniesRequest()),
	getProfile: (ticker) => dispatch(actions.getCompanyProfileRequest(ticker)),
	getFinancialStatements: (ticker) => dispatch(
		actions.getCompanyFinancialStatementsRequest(ticker),
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
