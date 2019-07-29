import { connect } from 'react-redux';
import actions from '../../store/reducer/actions';

import Results from './Results';

const mapStateToProps = state => ({
	companies: state.companies,
	profile: state.profile,
	fsResults: state.fsResults,
	availableFSLIs: state.availableFSLIs,
	currentKey: state.currentKey,
	getCompanyProfileSuccess: state.status.getCompanyProfileSuccess,
	getCompanyFinancialStatementsSuccess: state.status.getCompanyFinancialStatementsSuccess,
	saveSnapshotPending: state.status.saveSnapshotPending,
	saveSnapshotSuccess: state.status.saveSnapshotSuccess,
});

const mapDispatchToProps = dispatch => ({
	saveSnapshot: data => dispatch(actions.saveSnapshotRequest(data)),
	getSnapshot: currentKey => dispatch(actions.getSnapshotRequest(currentKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
