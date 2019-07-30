import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Homepage from './views/homepage/Homepage.container';
import Results from './views/results/Results.container';

// Styling
import './App.css';

const App = () => (
	<Router>
		<div className="App">
			<Route exact path="/" component={Homepage} />
			<Route exact path="/results" component={Results} />
			<Route exact path="/results/:key" component={Results} />
		</div>
	</Router>
);

export default App;
