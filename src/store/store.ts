import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer/reducer';
import { saga, runSaga } from './sagas/sagas';

const Store = createStore(
	rootReducer,
	applyMiddleware(saga),
);
runSaga();

export default Store;
