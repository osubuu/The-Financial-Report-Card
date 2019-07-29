import 'regenerator-runtime/runtime';
import { put, select } from 'redux-saga/effects';

import actions from '../../reducer/actions';
import firebase from '../../../firebase';

const dbRef = firebase.database().ref();

export default function* saveSnapshot(action) {
	const { selectedFSLIs } = action.payload;
	const state = yield select();

	const data = {
		fsResults: JSON.stringify(state.fsResults),
		ticker: state.profile.ticker,
		selectedFSLIs,
		profile: state.profile,
		availableFSLIs: state.availableFSLIs,
	};
	try {
		const postKey = state.currentKey || dbRef.child('saves').push().key;
		const updateData = { [`/saves/${postKey}`]: data };
		yield dbRef.update(updateData);
		yield put(actions.saveSnapshotSuccess());
	} catch (e) {
		yield put(actions.saveSnapshotFailure(e));
	}
}
