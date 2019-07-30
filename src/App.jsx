import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Homepage from './views/homepage/Homepage.container';
import Results from './views/results/Results.container';

// Styling
import './App.css';

const App = () => (
	<BrowserRouter basename="/the-financial-report-card">
		<div className="App">
			<Route exact path="/" component={Homepage} />
			<Route exact path="/results" component={Results} />
			<Route exact path="/results/:key" component={Results} />
		</div>
	</BrowserRouter>
);

export default App;
