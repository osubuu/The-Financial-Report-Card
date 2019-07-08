import React, { Component } from 'react';
import LoadingScreen from 'react-loading-screen';

import Search from './components/Search';
import Load from './components/Load';
import Intro from './components/Intro';
import Copyright from './components/Copyright';


class Homepage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: '',
		};
	}

	componentDidMount() {
		const { getAllCompanies } = this.props;
		getAllCompanies();
	}

	componentDidUpdate() {
		const {
			getCompanyProfileSuccess,
			getCompanyFinancialStatementsSuccess,
			history,
		} = this.props;
		const resultsLoaded = getCompanyProfileSuccess && getCompanyFinancialStatementsSuccess;

		console.log(this.props);
		if (resultsLoaded) history.push('/results');
	}

	/* B2. GET USER INPUT FROM SEARCH BAR */
	getSearchValue = (input) => {
		this.setState({ searchValue: input });
	};

	/* B3. EVENT HANDLER FOR WHEN USER SUBMITS THEIR SEARCH */
	handleSubmit = (event) => {
		event.preventDefault();
		event.target.reset();

		const { getProfile, getFinancialStatements } = this.props;
		const { searchValue } = this.state;
		const requestValue = searchValue.trim().toUpperCase();

		getProfile(requestValue);
		getFinancialStatements(requestValue);

		this.setState({ searchValue: '' });
	};

	renderLoadingScreen = () => {
		const {
			getCompanyProfilePending,
			getCompanyFinancialStatementsPending,
		} = this.props;
		return (
			<LoadingScreen
				loading={getCompanyProfilePending || getCompanyFinancialStatementsPending}
				bgColor="rgba(0,0,0,0.5)"
				spinnerColor="#edac53"
				textColor="#676767"
			>
				<div />
			</LoadingScreen>
		);
	}


	renderCopyright = () => <Copyright />

	renderLoadbar = () => {
		const { getDataFromFirebase, getSavedInput } = this.props;
		return (
			<Load
				getDataFromFirebase={getDataFromFirebase}
				getSavedInput={getSavedInput}
			/>
		);
	}


	renderSearchBar = () => {
		const { companies } = this.props;
		const { searchValue } = this.state;
		return (
			<Search
				getValue={this.getSearchValue}
				handleSubmit={this.handleSubmit}
				value={searchValue}
				companies={companies}
			/>
		);
	}


	renderHeading = () => <Intro />

	render() {
		return (
			<header className="home-page">
				<div className="home-page-container">
					{this.renderHeading()}
					{this.renderSearchBar()}
					{this.renderLoadbar()}
				</div>
				{this.renderCopyright()}
				{this.renderLoadingScreen()}
			</header>
		);
	}
}

export default Homepage;
