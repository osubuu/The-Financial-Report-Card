/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import LoadingScreen from 'react-loading-screen';
import _ from 'lodash';

import Alerts from '../../utils/alerts';

import FinancialStatementResults from './components/FinancialStatementResults';
import CompanyProfile from './components/CompanyProfile';
import resultsUtils from './resultsUtils';

class Results extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedFSLIsData: [],
		};
	}

	componentDidMount() {
		const {
			fsResults, availableFSLIs, profile,
			companies, history, match,
			getSnapshot,
		} = this.props;
		if (match.params.key) {
			getSnapshot(match.params.key);
		} else if (_.isEmpty(companies)) {
			history.push('/');
		} else {
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
		return (
			<LoadingScreen
				loading={getSnapshotPending}
				bgColor="rgba(0,0,0,0.5)"
				spinnerColor="#edac53"
				textColor="#676767"
			>
				<div />
			</LoadingScreen>
		);
	}

	renderFinancialStatements = () => {
		const { availableFSLIs, profile, getSnapshotPending } = this.props;
		const { selectedFSLIsData } = this.state;
		const colorPos = resultsUtils.getRandomUniqueNumbers(3, 7);

		return _.isEmpty(selectedFSLIsData) ? (
			<section className="company-fs">
				<h4 className="no-results-header" style={{ display: 'block' }}>
					{getSnapshotPending ? '' : 'No Financial Statements Found.'}
				</h4>
			</section>
		) : (
			<FinancialStatementResults
				chosenResults={selectedFSLIsData}
				companyName={profile.companyName}
				colorPos={colorPos}
				availableFSLIs={availableFSLIs}
				getUserFSLIChange={this.getUserFSLIChange}
			/>
		);
	}

	renderProfile = () => {
		const { profile } = this.props;
		return _.isEmpty(profile)
			? <section className="company-profile" />
			: (
				<CompanyProfile
					profileResult={profile}
					saveToFirebase={this.handleSaveSnapshot}
				/>
			);
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
