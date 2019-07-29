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
	saveSnapshot: data => dispatch(actions.saveSnapshotRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
