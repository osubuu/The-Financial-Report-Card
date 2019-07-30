import 'regenerator-runtime/runtime';
import { put } from 'redux-saga/effects';

import actions from '../../reducer/actions';
import firebase from '../../../firebase';

const dbRef = firebase.database().ref();

export default function* getSnapshot(action) {
	const { currentKey } = action.payload;
	try {
		const snapshot = yield dbRef.child(`/saves/${currentKey}`).once('value');

		const data = {
			fsResults: snapshot.val().fsResults,
			selectedFSLIs: snapshot.val().selectedFSLIs,
			profile: snapshot.val().profile,
			availableFSLIs: snapshot.val().availableFSLIs,
		};
		yield put(actions.getSnapshotSuccess(data));
	} catch (e) {
		yield put(actions.getSnapshotFailure(e));
	}
}
