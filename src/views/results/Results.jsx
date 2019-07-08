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
		const { fsResults, availableFSLIs, profile } = this.props;
		const selectedFSLIs = resultsUtils.determineDefaultFSLIs(fsResults, availableFSLIs);
		const selectedFSLIsArray = resultsUtils.prepareSelectedFSLisArray(
			selectedFSLIs, availableFSLIs, fsResults, profile,
		);
		this.setState({ selectedFSLIsArray });
	}

	/* E1. LISTEN FOR ANY USER CHANGES IN THE SELECT TAGS FOR ANY OF THE 3 FSLIS */
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
						// error={error}
						// saveToFirebase={saveToFirebase}
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
						// error={error}
						colorPos={colorPos}
						// searchDone={searchDone}
						availableFSLIs={availableFSLIs}
						getUserFSLIChange={this.getUserFSLIChange}
					/>
				)}
			</section>
		);
	}
}

export default Results;
