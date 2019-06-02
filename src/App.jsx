import React, { Component } from 'react';
import _ from 'lodash';
import LoadingScreen from 'react-loading-screen';

// Utils
import Utils from './utils/utils';
import Requests from './utils/requests';
import Alerts from './utils/alerts';
import Scroll from './utils/scroll';

// React Components
import Search from './components/homepage/Search';
import Results from './components/results/Results';
import Load from './components/homepage/Load';
import Intro from './components/homepage/Intro';
import Copyright from './components/homepage/Copyright';

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
	handleSubmit = (event) => {
		event.preventDefault();
		event.target.reset();
		const { value, userInput } = this.state;
		this.getUserInput(value);

		// set default states
		this.setState({
			value: '',
			randomColorPositions: Utils.getRandomUniqueNumbers(3, 7),
			defaultFSLIs: ['Revenue', 'Cost of revenue', 'Net income'],
			profileResult: {},
			chosenFSLIsArr: [],
			saved: false,
			loading: true,
			searchDone: false,
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
		this.setState({
			searchDone: false,
			error: false,
		});

		try {
			// store promises of API calls for profile and FS (both IS and BS)
			const profilePromise = Requests.getProfile(ticker);
			const isPromise = Requests.getFinancialStatements(ticker, 'financials/income-statement/');
			const bsPromise = Requests.getFinancialStatements(ticker, 'financials/balance-sheet-statement/');

			// wait for all 3 promises to be done before manipulating results
			const results = await Promise.all([profilePromise, isPromise, bsPromise]);
			this.setState({
				searchDone: true,
				loading: false,
			});
			// res[0] contains profile data, res[1] contains I/S data, res[2] contains B/S data
			this.storeProfileData(results[0]);
			this.storeFSData(results[1], 'is');
			this.storeFSData(results[2], 'bs');
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
	storeProfileData = (res) => {
		const { userInput } = this.state;
		// Remove <pre> tags to get proper format of JSON object. Parse into JSON for easier use.
		const jsonRes = JSON.parse(res.data.replace(/<pre>/g, ''))[userInput];
		jsonRes.ticker = userInput;
		this.setState({ profileResult: jsonRes });
	};

	/* D2. STORE COMPANY FS INFORMATION FROM API CALL */
	storeFSData = async (res, fsType) => {
		const {
			fsResults, availableFSLIs, userInput, defaultFSLIs,
		} = this.state;
		// Remove <pre> tags to get proper format of JSON object. Parse into JSON for easier use.
		const jsonRes = JSON.parse(res.data.replace(/<pre>/g, ''));

		// create copy of this.state.fsResults and this.state.availableFSLIs
		const fsCopy = Object.assign({}, fsResults);
		const fsliCopy = Object.assign({}, availableFSLIs);

		// update the proper property depending on type of fs (I/s or B/S)
		if (fsType === 'bs') {
			fsCopy.bs = jsonRes;
			fsliCopy.bs = Object.keys(jsonRes[userInput]);
		} else if (fsType === 'is') {
			fsCopy.is = jsonRes;
			fsliCopy.is = Object.keys(jsonRes[userInput]);
		}

		// conditional for the first run (as the default FSLIS are I/S's items)
		if (fsType === 'is') {
			let tempArr = [];

			// use underscore intersection to find similarities between default and available FSLIs
			const intersect = _.intersection(fsliCopy[fsType], defaultFSLIs);

			// if all 3 default fslis are found in the I/S FSLIs
			if (intersect.length === defaultFSLIs.length) {
				tempArr = defaultFSLIs;
			} else if (intersect.length < defaultFSLIs.length) {
				// if default fslis are only 0,1,2 compared to the I/S FSLIs
				tempArr = intersect;
				let n = 0;

				// add FSLIs that are not in the intersect yet from the difference array
				while (tempArr.length < defaultFSLIs.length) {
					// array of available FSLIs that are not in the default ones yet
					const difference = _.difference(fsliCopy[fsType], defaultFSLIs);
					tempArr.push(difference[n]);
					n += 1;
				}
			}

			await this.setState({
				fsResults: fsCopy,
				availableFSLIs: fsliCopy,
				chosenFSLIs: tempArr,
			});

			// prepare the arrays of objects for the results page
			this.prepareChosenFSLIsArr(fsType);
		}
	};

	/* D3. PREPARE THE CHOSEN FSLIS ARRAY FOR DISPLAY IN RESULTS AND FOR CHART JS */
	prepareChosenFSLIsArr = (fsType) => {
		const {
			chosenFSLIs, availableFSLIs, fsResults, userInput,
		} = this.state;
		const tempArr = [];
		let type = fsType;

		// loop through array of chosen fslis strings to prepare the array of objects with data
		for (let i = 0; i < chosenFSLIs.length; i += 1) {
			const currentIndex = chosenFSLIs[i];

			// conditional for when user changes fsli in options menu
			if (fsType === 'is-fslis' || fsType === 'bs-fslis') {
				// eslint-disable-next-line no-loop-func
				_.forEach(availableFSLIs, (fsliType) => {
					if (availableFSLIs[fsliType].indexOf(currentIndex) !== -1) {
						type = fsliType;
					}
				});
			}

			// make the object with the chosen fsli data
			const tempMap = Object.entries(fsResults[type][userInput][chosenFSLIs[i]]).map(
				([key, value]) => ({
					key,
					value,
				}),
			);

			// Push object to clean array
			tempArr.push({
				fsli: chosenFSLIs[i],
				results: tempMap,
			});
		}

		// Save cleaned up array of objects in state
		this.setState({ chosenFSLIsArr: tempArr });
	};

	/* =====================
	E. RESULTS PAGE HANDLING METHODS
	====================== */

	/* E1. LISTEN FOR ANY USER CHANGES IN THE SELECT TAGS FOR ANY OF THE 3 FSLIS */
	getUserFSLIChange = (event, index) => {
		const { chosenFSLIs } = this.state;
		chosenFSLIs[index] = event.target.value;
		this.setState({
			chosenFSLIs,
			saved: false,
		});

		// get optGroup value (either is or bs), need this for prepareChosenFSLIArr method
		const fsType = event.target.selectedOptions[0].parentNode.className;
		this.prepareChosenFSLIsArr(fsType);
	};

	renderResults = () => {
		const {
			chosenFSLIsArr, profileResult, searchDone,
			userInput, error, randomColorPositions, availableFSLIs,
		} = this.state;
		return (
			<Results
				chosenResults={chosenFSLIsArr}
				profileResult={profileResult}
				searchDone={searchDone}
				userInput={userInput}
				error={error}
				colorPos={randomColorPositions}
				availableFSLIs={availableFSLIs}
				getUserFSLIChange={this.getUserFSLIChange}
				saveToFirebase={this.saveToFirebase}
			/>
		);
	}

	renderLoadingScreen = () => {
		const { loading } = this.state;
		return (
			<LoadingScreen
				loading={loading}
				bgColor="rgba(0,0,0,0.5)"
				spinnerColor="#edac53"
				textColor="#676767"
			>
				<div />
			</LoadingScreen>
		);
	}

	renderCopyright = () => <Copyright />

	renderLoadbar = () => (
		<Load
			getDataFromFirebase={this.getDataFromFirebase}
			getSavedInput={this.getSavedInput}
		/>
	)

	renderSearchBar = () => {
		const { value, companies } = this.state;
		return (
			<Search
				getValue={this.getValue}
				handleSubmit={this.handleSubmit}
				value={value}
				companies={companies}
				getUserInput={this.getUserInput}
			/>
		);
	}

	renderHeading = () => <Intro />

	render() {
		const { searchDone, error } = this.state;
		const resultsAreReady = searchDone && !error;
		return (
			<div className="App">
				<header className="home-page">
					<div className="home-page-container">
						{this.renderHeading()}
						{this.renderSearchBar()}
						{this.renderLoadbar()}
					</div>
					{this.renderCopyright()}
				</header>
				{this.renderLoadingScreen()}
				{resultsAreReady ? this.renderResults() : null}
			</div>
		);
	}
}

export default App;
