import { connect } from 'react-redux';
import actions from '../../store/reducer/actions';

import Results from './Results';

const mapStateToProps = state => ({
	profile: state.profile,
	fsResults: state.fsResults,
	availableFSLIs: state.availableFSLIs,
});

const mapDispatchToProps = dispatch => ({
	// getAllCompanies: () => dispatch(actions.getAllCompaniesRequest()),
	// getProfile: ticker => dispatch(actions.getCompanyProfileRequest(ticker)),
	// getFinancialStatements: ticker => dispatch(actions.getCompanyFinancialStatementsRequest(ticker)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
