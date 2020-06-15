/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import _ from 'lodash';
import { ResultsProps, ResultsState, SelectElement } from '../../types/types';

import Alerts from '../../utils/alerts';

import FinancialStatementResults from './components/FinancialStatementResults';
import CompanyProfile from './components/CompanyProfile';
import ResultsUtils from './resultsUtils';
import Loader from '../shared/Loader';

class Results extends Component<ResultsProps, ResultsState> {
	constructor(props) {
		super(props);
		this.state = {
			selectedFSLIsData: [],
			colors: ResultsUtils.getRandomUniqueNumbers(3, 7),
		};
	}

	componentDidMount(): void {
		const {
			fsResults, availableFSLIs,
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
				const selectedFSLIs = ResultsUtils.determineDefaultFSLIs(fsResults, availableFSLIs);
				const selectedFSLIsData = ResultsUtils.prepareSelectedFSLisArray(
					selectedFSLIs, availableFSLIs, fsResults,
				);
				this.setState({ selectedFSLIsData });
			}
		}
	}

	componentDidUpdate(prevProps: ResultsProps): void {
		const {
			saveSnapshotSuccess, getSnapshotSuccess, currentKey, selectedFSLIs,
			getSnapshotPending,
		} = this.props;

		const snapshotSaved = !prevProps.saveSnapshotSuccess && saveSnapshotSuccess;
		const snapshotLoaded = !prevProps.getSnapshotSuccess && getSnapshotSuccess;
		const snapshotFailedToLoad = prevProps.getSnapshotPending
			&& !getSnapshotPending
			&& !getSnapshotSuccess;

		if (snapshotSaved) {
			const currentUrl = window.location.href;
			const newUrlBase = currentUrl.substring(0, currentUrl.indexOf('/results/'));
			const newUrl = `${newUrlBase}/results/${currentKey}`;
			Alerts.snapshotUrlCreated(newUrl);
		}

		if (snapshotLoaded) {
			this.setState({ selectedFSLIsData: selectedFSLIs });
		}

		if (snapshotFailedToLoad) {
			Alerts.wrongSnapshotUrl();
		}
	}

	handleSaveSnapshot = (): void => {
		const { saveSnapshot } = this.props;
		const { selectedFSLIsData } = this.state;
		saveSnapshot(selectedFSLIsData);
	};

	getUserFSLIChange = async (event: SelectElement, index: number): Promise<void> => {
		const { fsResults, availableFSLIs } = this.props;
		const { selectedFSLIsData } = this.state;

		const newSelectedFSLIs = _.map(selectedFSLIsData, (item) => item.fsli);
		newSelectedFSLIs[index] = event.target.value;
		const newSelectedFSLIsArray = ResultsUtils.prepareSelectedFSLisArray(
			newSelectedFSLIs, availableFSLIs, fsResults,
		);
		this.setState({ selectedFSLIsData: newSelectedFSLIsArray });
	};

	renderLoadingScreen = (): JSX.Element => {
		const { getSnapshotPending } = this.props;
		return <Loader condition={getSnapshotPending} />;
	}

	renderFinancialStatements = (): JSX.Element => {
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

	renderProfile = (): JSX.Element => {
		const { profile } = this.props;
		const fallback = <section className="company-profile" />;
		const results = (
			<CompanyProfile
				profile={profile}
				saveToFirebase={this.handleSaveSnapshot}
			/>
		);
		return _.isEmpty(profile) ? fallback : results;
	}

	render(): JSX.Element {
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
