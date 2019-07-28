import React, { Component } from 'react';
import _ from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Utils
import Utils from './utils/utils';
import Requests from './utils/requests';
import Alerts from './utils/alerts';
import Scroll from './utils/scroll';

// Views
import Homepage from './views/homepage/Homepage.container';
import Results from './views/results/Results.container';

// Styling
import './App.css';

// reference to firebase root
import firebase from './firebase';

const dbRef = firebase.database().ref();

class App extends Component {
	/* =====================
  STATES
  ====================== */
	constructor() {
		super();
		this.state = {
			companies: [],
			fsResults: {
				is: {},
				bs: {},
			},
			profileResult: {},
			searchDone: false,
			availableFSLIs: {
				is: [],
				bs: [],
			},
			defaultFSLIs: ['Revenue', 'Cost of revenue', 'Net income'],
			chosenFSLIs: [],
			chosenFSLIsArr: [],
			userInput: '',
			value: '',
			error: false,
			randomColorPositions: [],
			saved: false,
			currentKey: '',
			savedInput: '',
			loading: false,
		};
	}

	/* =====================
  A. FIREBASE METHODS
  ====================== */

	/* A1. RETRIEVE DATA FROM FIREBASE WHEN USER SUBMITS KEY */
	getDataFromFirebase = async (event) => {
		event.preventDefault();
		event.target.reset();
		this.setState({
			chosenFSLIsArr: [],
			searchDone: false,
			loading: true,
		});
		const { savedInput: key } = this.state;

		// retrieve data from firebase
		try {
			const snapshot = await dbRef.child(`/saves/${key}`).once('value');
			this.setState({
				userInput: snapshot.val().ticker,
				defaultFSLIs: ['Revenue', 'Cost of revenue', 'Net income'],
				profileResult: snapshot.val().profile,
				chosenFSLIs: snapshot.val().fslis,
				chosenFSLIsArr: snapshot.val().fslisArr,
				fsResults: JSON.parse(snapshot.val().allResults),
				availableFSLIs: snapshot.val().availableFSLIs,
				randomColorPositions: Utils.getRandomUniqueNumbers(3, 7),
				searchDone: true,
				loading: false,
			});
			Scroll.toResults();
		} catch (error) {
			Alerts.wrongSnapshotKey();
			this.setState({ loading: false });
		}
	};

	/* A2. LISTEN FOR USER INPUT (KEY) IN LOADING BAR */
	getSavedInput = (e) => {
		this.setState({ savedInput: e.target.value });
	};

	/* A3. SAVE CURRENT RESULTS TO FIREBASE */
	saveToFirebase = () => {
		const {
			saved, fsResults, userInput,
			chosenFSLIs, chosenFSLIsArr, profileResult,
			availableFSLIs, currentKey,
		} = this.state;

		const postData = {
			allResults: JSON.stringify(fsResults),
			ticker: userInput,
			fslis: chosenFSLIs,
			fslisArr: chosenFSLIsArr,
			profile: profileResult,
			availableFSLIs,
		};

		// store info to firebase
		const PostKey = saved ? currentKey : dbRef.child('saves').push().key;
		const updates = { [`/saves/${PostKey}`]: postData };
		dbRef.update(updates);

		this.setState({
			saved: true,
			currentKey: PostKey,
		});

		Alerts.snapshotKeyCreated(PostKey);
	};

	/* =====================
	F. RENDER VIEWS
	====================== */

	renderResults = () => {
		const {
			chosenFSLIsArr, profileResult, searchDone,
			userInput, error, randomColorPositions, availableFSLIs,
		} = this.state;
		return (
			<Results
				error={error}
				colorPos={randomColorPositions}
				userInput={userInput}
				searchDone={searchDone}
				chosenResults={chosenFSLIsArr}
				profileResult={profileResult}
				availableFSLIs={availableFSLIs}
				saveToFirebase={this.saveToFirebase}
				getUserFSLIChange={this.getUserFSLIChange}
			/>
		);
	}

	// renderHomepage = (props) => {
	// 	const {
	// 		loading, value, companies, searchDone, error,
	// 	} = this.state;
	// 	const resultsAreReady = searchDone && !error;
	// 	return (
	// 		<Homepage
	// 			value={value}
	// 			loading={loading}
	// 			getValue={this.getValue}
	// 			companies={companies}
	// 			handleSubmit={this.handleSubmit}
	// 			// getUserInput={this.getUserInput}
	// 			getSavedInput={this.getSavedInput}
	// 			resultsAreReady={resultsAreReady}
	// 			getDataFromFirebase={this.getDataFromFirebase}
	// 			{...props}
	// 		/>
	// 	);
	// }

	render() {
		return (
			<Router>
				<div className="App">
					<Route exact path="/" component={Homepage} />
					<Route exact path="/results" component={Results} />
				</div>
			</Router>
		);
	}
}

export default App;
