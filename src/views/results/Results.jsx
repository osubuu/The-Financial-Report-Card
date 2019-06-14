import React from 'react';
import FinancialStatementResults from './components/FinancialStatementResults';
import CompanyProfile from './components/CompanyProfile';

const Results = (props) => {
	const {
		profileResult, searchDone, error, chosenResults,
		colorPos, availableFSLIs, getUserFSLIChange, saveToFirebase,
	} = props;

	return (
		<section className="results">
			{Object.keys(profileResult).length === 0 && searchDone && !error ? (
				<section className="company-fs">
					<h4 className="no-results-header" style={{ display: 'block' }}>
						No Info On This Company
					</h4>
				</section>
			) : (
				<CompanyProfile
					profileResult={profileResult}
					error={error}
					saveToFirebase={saveToFirebase}
				/>
			)}

			{Object.keys(chosenResults).length === 0 && searchDone && !error ? (
				<section className="company-fs">
					<h4 className="no-results-header" style={{ display: 'block' }}>
						No Financial Statements Found.
					</h4>
				</section>
			) : (
				<FinancialStatementResults
					chosenResults={chosenResults}
					companyName={profileResult.companyName}
					error={error}
					colorPos={colorPos}
					searchDone={searchDone}
					availableFSLIs={availableFSLIs}
					getUserFSLIChange={getUserFSLIChange}
				/>
			)}
		</section>
	);
};

export default Results;
