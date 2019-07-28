import { connect } from 'react-redux';
import actions from '../../store/reducer/actions';

import Results from './Results';

const mapStateToProps = state => ({
	companies: state.companies,
	profile: state.profile,
	fsResults: state.fsResults,
	availableFSLIs: state.availableFSLIs,
	getCompanyProfileSuccess: state.status.getCompanyProfileSuccess,
	getCompanyFinancialStatementsSuccess: state.status.getCompanyFinancialStatementsSuccess,
});

const mapDispatchToProps = dispatch => ({
	// getAllCompanies: () => dispatch(actions.getAllCompaniesRequest()),
	// getProfile: ticker => dispatch(actions.getCompanyProfileRequest(ticker)),
	// getFinancialStatements: ticker => dispatch(actions.getCompanyFinancialStatementsRequest(ticker)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
