import React, { Component } from 'react';
import _ from 'lodash';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Utils
import Utils from './utils/utils';
import Requests from './utils/requests';
import Alerts from './utils/alerts';
import Scroll from './utils/scroll';

// Views
import Homepage from './views/homepage/Homepage';
import Results from './views/results/Results';

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

	async componentDidMount() {
		const { data: companiesData } = await Requests.getAllCompanies();
		// get rid of companies that don't have FS. these include tickers that have "." or "-"
		const regex = RegExp('[.-=]');
		const validCompanies = _.reduce(companiesData, (acc, company) => {
			const { symbol, name } = company;
			if (name && regex.test(symbol) === false) {
				const companyInfo = {
					name,
					ticker: symbol,
				};
				return [...acc, companyInfo];
			}
			return acc;
		}, []);
		this.setState({ companies: validCompanies });
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
  B. SEARCH BAR METHODS
  ====================== */

	/* B1. SET STATE OF USER INPUT */
	getUserInput = (input) => {
		this.setState({ userInput: input.trim().toUpperCase() });
	};

	/* B2. GET USER INPUT FROM SEARCH BAR */
	getValue = (input) => {
		this.setState({ value: input });
	};

	/* B3. EVENT HANDLER FOR WHEN USER SUBMITS THEIR SEARCH */
	handleSubmit = async (event) => {
		event.preventDefault();
		event.target.reset();
		const { value, userInput } = this.state;
		this.getUserInput(value);

		// set default states
		await this.setState({
			value: '',
			randomColorPositions: Utils.getRandomUniqueNumbers(3, 7),
			defaultFSLIs: ['Revenue', 'Cost of revenue', 'Net income'],
			profileResult: {},
			chosenFSLIsArr: [],
			saved: false,
			loading: true,
			searchDone: false,
			error: false,
		});

		// Prepare API CALLS
		this.getData(userInput);
	};

	/* =====================
  C. API CALL METHODS
  ====================== */

	/* C1. FUNCTION TO SET UP THE API CALLS AND MANAGE THEIR PROMISES */
	getData = async (ticker) => {
		if (!ticker) {
			this.setState({ loading: false });
			Alerts.noTickerSubmitted();
			return;
		}
		try {
			const profilePromise = Requests.getProfile(ticker);
			const isPromise = Requests.getFinancialStatements(ticker, 'financials/income-statement/');
			const bsPromise = Requests.getFinancialStatements(ticker, 'financials/balance-sheet-statement/');

			const results = await Promise.all([profilePromise, isPromise, bsPromise]);
			this.setState({
				searchDone: true,
				loading: false,
			});
			// res[0] contains profile data, res[1] contains I/S data, res[2] contains B/S data
			await Promise.all([
				this.storeProfileData(results[0]),
				this.storeFSData(results[1], 'is'),
				this.storeFSData(results[2], 'bs'),
			]);
			this.prepareChosenFSLIsArr();
		} catch (error) {
			// if error 404 or page unreachable because company is not available on FMP
			if (error.response || error.request) {
				this.setState({
					error: true,
					searchDone: true,
					loading: false,
				});
				Alerts.dataNotFound();
			} else {
				// else it's an unavailable FSLI, so display "No FS Found" and show profile information
				this.setState({ searchDone: true });
			}
		}

		Scroll.toResults();
	};

	/* =====================
  D. API RESULTS STORING/HANDLING METHODS
  ====================== */

	/* D1. STORE COMPANY PROFILE INFORMATION FROM API CALL */
	storeProfileData = async (res) => {
		const { userInput } = this.state;
		const jsonRes = JSON.parse(res.data.replace(/<pre>/g, ''))[userInput];
		jsonRes.ticker = userInput;
		this.setState({ profileResult: jsonRes });
	};

	/* D2. STORE COMPANY FS INFORMATION FROM API CALL */
	storeFSData = async (res, fsType) => {
		const {
			fsResults, availableFSLIs, userInput, defaultFSLIs,
		} = this.state;
		let { chosenFSLIs } = this.state;
		const jsonRes = JSON.parse(res.data.replace(/<pre>/g, ''));

		fsResults[fsType] = jsonRes;
		availableFSLIs[fsType] = _.keys(jsonRes[userInput]);

		// conditional for the first run (as the default FSLIS are I/S's items)
		if (fsType === 'is') {
			const intersect = _.intersection(fsResults[fsType], defaultFSLIs);
			chosenFSLIs = intersect.length === defaultFSLIs.length ? defaultFSLIs : intersect;

			// add FSLIs that are not in the intersect yet from the difference array, if any
			let n = 0;
			const difference = _.difference(availableFSLIs[fsType], defaultFSLIs);
			while (chosenFSLIs.length < defaultFSLIs.length) {
				chosenFSLIs.push(difference[n]);
				n += 1;
			}
			await this.setState({ chosenFSLIs });
		}

		await this.setState({
			fsResults,
			availableFSLIs,
			chosenFSLIs,
		});
	}

	/* D3. PREPARE THE CHOSEN FSLIS ARRAY FOR DISPLAY IN RESULTS AND FOR CHART JS */
	prepareChosenFSLIsArr = () => {
		const {
			chosenFSLIs, availableFSLIs, fsResults, userInput,
		} = this.state;
		const chosenFSLIsArr = [];

		// loop through array of chosen fslis strings to prepare the array of objects with data
		for (let i = 0; i < chosenFSLIs.length; i += 1) {
			const fsli = chosenFSLIs[i];
			const type = _.includes(availableFSLIs.is, fsli) ? 'is' : 'bs';

			const fsliData = _.entries(fsResults[type][userInput][fsli]);
			const results = _.map(fsliData, ([key, value]) => ({ key, value }));
			chosenFSLIsArr.push({
				fsli,
				results,
			});
		}

		this.setState({ chosenFSLIsArr });
	};

	/* =====================
	E. RESULTS PAGE HANDLING METHODS
	====================== */

	/* E1. LISTEN FOR ANY USER CHANGES IN THE SELECT TAGS FOR ANY OF THE 3 FSLIS */
	getUserFSLIChange = async (event, index) => {
		const { chosenFSLIs } = this.state;
		chosenFSLIs[index] = event.target.value;
		await this.setState({
			chosenFSLIs,
			saved: false,
		});
		this.prepareChosenFSLIsArr();
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

	renderHomepage = (props) => {
		const {
			loading, value, companies, searchDone, error,
		} = this.state;
		const resultsAreReady = searchDone && !error;
		return (
			<Homepage
				value={value}
				loading={loading}
				getValue={this.getValue}
				companies={companies}
				handleSubmit={this.handleSubmit}
				getUserInput={this.getUserInput}
				getSavedInput={this.getSavedInput}
				resultsAreReady={resultsAreReady}
				getDataFromFirebase={this.getDataFromFirebase}
				{...props}
			/>
		);
	}

	render() {
		return (
			<Router>
				<div className="App">
					<Route exact path="/" render={props => this.renderHomepage(props)} />
					<Route exact path="/results" render={() => this.renderResults()} />
				</div>
			</Router>
		);
	}
}

export default App;
