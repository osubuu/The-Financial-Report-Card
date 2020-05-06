import 'regenerator-runtime/runtime';
import { put, select } from 'redux-saga/effects';

import actions from '../../reducer/actions';
import firebase from '../../../database/firebase';
import { Action } from '../../../types/types';

const dbRef = firebase.database().ref();

export default function* saveSnapshot(action: Action): any {
	const { selectedFSLIs } = action.payload;
	const state = yield select();

	const data = {
		fsResults: state.fsResults,
		selectedFSLIs,
		profile: state.profile,
		availableFSLIs: state.availableFSLIs,
	};
	try {
		const postKey = state.currentKey || dbRef.child('saves').push().key;
		const updateData = { [`/saves/${postKey}`]: data };
		yield dbRef.update(updateData);
		yield put(actions.saveSnapshotSuccess(postKey));
	} catch (e) {
		yield put(actions.saveSnapshotFailure(e));
	}
}
