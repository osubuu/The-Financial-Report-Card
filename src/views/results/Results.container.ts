import { connect } from 'react-redux';
import { Dispatch } from 'react';
import actions from '../../store/reducer/actions';
import { State, Action, SelectedFSLI } from '../../types/types';

import Results from './Results';

const mapStateToProps = (state: State): object => ({
	companies: state.companies,
	profile: state.profile,
	fsResults: state.fsResults,
	availableFSLIs: state.availableFSLIs,
	selectedFSLIs: state.selectedFSLIs,
	currentKey: state.currentKey,
	getCompanyProfileSuccess: state.status.getCompanyProfileSuccess,
	getCompanyFinancialStatementsSuccess: state.status.getCompanyFinancialStatementsSuccess,
	saveSnapshotPending: state.status.saveSnapshotPending,
	saveSnapshotSuccess: state.status.saveSnapshotSuccess,
	getSnapshotPending: state.status.getSnapshotPending,
	getSnapshotSuccess: state.status.getSnapshotSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): object => ({
	saveSnapshot: (data: SelectedFSLI[]): void => dispatch(actions.saveSnapshotRequest(data)),
	getSnapshot: (currentKey: string): void => dispatch(actions.getSnapshotRequest(currentKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
