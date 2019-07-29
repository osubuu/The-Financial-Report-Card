import React, { Component } from 'react';
import _ from 'lodash';
import FinancialStatementResults from './components/FinancialStatementResults';
import CompanyProfile from './components/CompanyProfile';

import resultsUtils from './resultsUtils';

class Results extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedFSLIsArray: [],
		};
	}

	componentDidMount() {
		const {
			fsResults, availableFSLIs, profile,
			companies, history,
		} = this.props;

		if (_.isEmpty(companies)) {
			history.push('/');
		} else {
			const fsResultsAvailable = !_.isEmpty(fsResults.is) || !_.isEmpty(fsResults.bs);
			const fslisAvailable = !_.isEmpty(availableFSLIs.is) || !_.isEmpty(availableFSLIs.bs);

			if (fsResultsAvailable && fslisAvailable) {
				const selectedFSLIs = resultsUtils.determineDefaultFSLIs(fsResults, availableFSLIs);
				const selectedFSLIsArray = resultsUtils.prepareSelectedFSLisArray(
					selectedFSLIs, availableFSLIs, fsResults, profile,
				);
				this.setState({ selectedFSLIsArray });
			}
		}
	}

	handleSaveSnapshot = () => {
		const { saveSnapshot } = this.props;
		const { selectedFSLIsArray } = this.state;
		saveSnapshot(selectedFSLIsArray);
	};

	getUserFSLIChange = async (event, index) => {
		const { fsResults, availableFSLIs, profile } = this.props;
		const { selectedFSLIsArray } = this.state;

		const newSelectedFSLIs = _.map(selectedFSLIsArray, item => item.fsli);
		newSelectedFSLIs[index] = event.target.value;
		const newSelectedFSLIsArray = resultsUtils.prepareSelectedFSLisArray(
			newSelectedFSLIs, availableFSLIs, fsResults, profile,
		);
		this.setState({ selectedFSLIsArray: newSelectedFSLIsArray });
	};

	render() {
		const { availableFSLIs, profile } = this.props;
		const { selectedFSLIsArray } = this.state;
		const colorPos = resultsUtils.getRandomUniqueNumbers(3, 7);
		return (
			<section className="results">
				{_.isEmpty(profile).length === 0 ? (
					<section className="company-fs">
						<h4 className="no-results-header" style={{ display: 'block' }}>
							No Info On This Company
						</h4>
					</section>
				) : (
					<CompanyProfile
						profileResult={profile}
						saveToFirebase={this.handleSaveSnapshot}
					/>
				)}

				{_.isEmpty(selectedFSLIsArray) ? (
					<section className="company-fs">
						<h4 className="no-results-header" style={{ display: 'block' }}>
							No Financial Statements Found.
						</h4>
					</section>
				) : (
					<FinancialStatementResults
						chosenResults={selectedFSLIsArray}
						companyName={profile.companyName}
						colorPos={colorPos}
						availableFSLIs={availableFSLIs}
						getUserFSLIChange={this.getUserFSLIChange}
					/>
				)}
			</section>
		);
	}
}

export default Results;
