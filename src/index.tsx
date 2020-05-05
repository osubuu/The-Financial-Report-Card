import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from './store/store';
import Router from './router/router';
import registerServiceWorker from './serviceWorker/registerServiceWorker';

// Styling
import './styles.css';

ReactDOM.render(
	<Provider store={Store}>
		<Router />
	</Provider>,
	document.getElementById('root'),
);
registerServiceWorker();
