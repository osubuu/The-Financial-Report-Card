/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import _ from 'lodash';

import Alerts from '../../utils/alerts';

import FinancialStatementResults from './components/FinancialStatementResults';
import CompanyProfile from './components/CompanyProfile';
import resultsUtils from './resultsUtils';
import Loader from '../shared/Loader';

class Results extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedFSLIsData: [],
			colors: resultsUtils.getRandomUniqueNumbers(3, 7),
		};
	}

	componentDidMount() {
		const {
			fsResults, availableFSLIs, profile,
			companies, history, match,
			getSnapshot,
		} = this.props;

		if (match.params.key) {
			// load snapshot if user arrives from share URL
			getSnapshot(match.params.key);
		} else if (_.isEmpty(companies)) {
			// push user back to homepage if they did not come from a share URL
			history.push('/');
		} else {
			// user was brought here from homepage
			const fsResultsAvailable = !_.isEmpty(fsResults.is) || !_.isEmpty(fsResults.bs);
			const fslisAvailable = !_.isEmpty(availableFSLIs.is) || !_.isEmpty(availableFSLIs.bs);

			if (fsResultsAvailable && fslisAvailable) {
				const selectedFSLIs = resultsUtils.determineDefaultFSLIs(fsResults, availableFSLIs);
				const selectedFSLIsData = resultsUtils.prepareSelectedFSLisArray(
					selectedFSLIs, availableFSLIs, fsResults, profile,
				);
				this.setState({ selectedFSLIsData });
			}
		}
	}

	componentDidUpdate(prevProps) {
		const {
			saveSnapshotSuccess, getSnapshotSuccess, currentKey, selectedFSLIs,
		} = this.props;

		const snapshotSaved = !prevProps.saveSnapshotSuccess && saveSnapshotSuccess;
		const snapshotLoaded = !prevProps.getSnapshotSuccess && getSnapshotSuccess;

		if (snapshotSaved) {
			const url = `${window.location.origin}/results/${currentKey}`;
			Alerts.snapshotKeyCreated(url);
		}

		if (snapshotLoaded) {
			this.setState({ selectedFSLIsData: selectedFSLIs });
		}
	}

	handleSaveSnapshot = () => {
		const { saveSnapshot } = this.props;
		const { selectedFSLIsData } = this.state;
		saveSnapshot(selectedFSLIsData);
	};

	getUserFSLIChange = async (event, index) => {
		const { fsResults, availableFSLIs, profile } = this.props;
		const { selectedFSLIsData } = this.state;

		const newSelectedFSLIs = _.map(selectedFSLIsData, item => item.fsli);
		newSelectedFSLIs[index] = event.target.value;
		const newSelectedFSLIsArray = resultsUtils.prepareSelectedFSLisArray(
			newSelectedFSLIs, availableFSLIs, fsResults, profile,
		);
		this.setState({ selectedFSLIsData: newSelectedFSLIsArray });
	};

	renderLoadingScreen = () => {
		const { getSnapshotPending } = this.props;
		return <Loader condition={getSnapshotPending} />;
	}

	renderFinancialStatements = () => {
		const { availableFSLIs, profile, getSnapshotPending } = this.props;
		const { selectedFSLIsData, colors } = this.state;

		const fallback = (
			<section className="company-fs">
				<h4 className="no-results-header" style={{ display: 'block' }}>
					{getSnapshotPending ? '' : 'No Financial Statements Found.'}
				</h4>
			</section>
		);
		const results = (
			<FinancialStatementResults
				chosenResults={selectedFSLIsData}
				companyName={profile.companyName}
				colors={colors}
				availableFSLIs={availableFSLIs}
				getUserFSLIChange={this.getUserFSLIChange}
			/>
		);
		return _.isEmpty(selectedFSLIsData) ? fallback : results;
	}

	renderProfile = () => {
		const { profile } = this.props;
		const fallback = <section className="company-profile" />;
		const results = (
			<CompanyProfile
				profileResult={profile}
				saveToFirebase={this.handleSaveSnapshot}
			/>
		);
		return _.isEmpty(profile) ? fallback : results;
	}

	render() {
		return (
			<section className="results">
				{this.renderProfile()}
				{this.renderFinancialStatements()}
				{this.renderLoadingScreen()}
			</section>
		);
	}
}

export default Results;
