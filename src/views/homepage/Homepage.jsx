/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';

import Alerts from '../../utils/alerts';

import Search from './components/Search';
import Intro from './components/Intro';
import Copyright from './components/Copyright';
import Loader from '../shared/Loader';


class Homepage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: '',
			profileReady: false,
			financialsReady: false,
		};
	}

	componentDidMount() {
		const { getAllCompanies, companies } = this.props;
		if (companies.length === 0) {
			getAllCompanies();
		}
	}

	componentDidUpdate(prevProps) {
		const {
			getCompanyProfilePending,
			getCompanyProfileSuccess,
			getCompanyFinancialStatementsSuccess,
			history,
		} = this.props;

		const { profileReady, financialsReady } = this.state;
		const profileLoaded = !prevProps.getCompanyProfileSuccess && getCompanyProfileSuccess;
		const profileNotFound = prevProps.getCompanyProfilePending
			&& !getCompanyProfilePending
			&& !getCompanyProfileSuccess;
		const financialsLoaded = !prevProps.getCompanyFinancialStatementsSuccess
			&& getCompanyFinancialStatementsSuccess;

		if (profileLoaded) {
			this.setState({ profileReady: true });
		}

		if (financialsLoaded) {
			this.setState({ financialsReady: true });
		}

		if (profileNotFound) {
			Alerts.dataNotFound();
			return;
		}

		if (profileReady && financialsReady) {
			history.push('/results');
		}
	}

	getSearchValue = (input) => {
		this.setState({ searchValue: input });
	};

	handleSubmit = (event) => {
		event.preventDefault();
		event.target.reset();

		const { getProfile, getFinancialStatements } = this.props;
		const { searchValue } = this.state;
		const requestValue = searchValue.trim().toUpperCase();

		if (!requestValue) {
			Alerts.noTickerSubmitted();
			return;
		}

		getProfile(requestValue);
		getFinancialStatements(requestValue);

		this.setState({
			searchValue: '',
			profileReady: false,
			financialsReady: false,
		});
	};

	renderLoadingScreen = () => {
		const {
			getCompanyProfilePending,
			getCompanyFinancialStatementsPending,
		} = this.props;
		return (
			<Loader
				condition={getCompanyProfilePending || getCompanyFinancialStatementsPending}
			/>
		);
	}

	renderCopyright = () => <Copyright />

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
				</div>
				{this.renderCopyright()}
				{this.renderLoadingScreen()}
			</header>
		);
	}
}

export default Homepage;
