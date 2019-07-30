import React from 'react';
import {
	Route, Switch, HashRouter,
} from 'react-router-dom';

import Homepage from './views/homepage/Homepage.container';
import Results from './views/results/Results.container';

// Styling
import './App.css';

const App = () => (
	<HashRouter basename="/the-financial-report-card">
		<div className="App">
			<Switch>
				<Route exact path="/" component={Homepage} />
				<Route exact path="/results" component={Results} />
				<Route exact path="/results/:key" component={Results} />
			</Switch>
		</div>
	</HashRouter>
);

export default App;
