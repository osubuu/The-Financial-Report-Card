import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer/reducer';
import { saga, runSaga } from './sagas/sagas';

const store = createStore(
	rootReducer,
	applyMiddleware(saga),
);
runSaga();

export default store;
