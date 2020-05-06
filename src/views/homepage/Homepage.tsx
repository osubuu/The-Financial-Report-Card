/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react';
import { HomepageProps, HomepageState, FormElement } from '../../types/types';

import Alerts from '../../utils/alerts';

import Search from './components/Search';
import Intro from './components/Intro';
import Copyright from './components/Copyright';
import Loader from '../shared/Loader';


class Homepage extends Component<HomepageProps, HomepageState> {
	constructor(props: HomepageProps) {
		super(props);
		this.state = {
			searchValue: '',
			profileReady: false,
			financialsReady: false,
		};
	}

	componentDidMount(): void {
		const { getAllCompanies, companies } = this.props;
		if (companies.length === 0) {
			getAllCompanies();
		}
	}

	componentDidUpdate(prevProps: HomepageProps): void {
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

	getSearchValue = (input: string): void => {
		this.setState({ searchValue: input });
	};

	handleSubmit = (event: FormElement): void => {
		event.preventDefault();

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

	renderLoadingScreen = (): JSX.Element => {
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

	renderCopyright = (): JSX.Element => <Copyright />

	renderSearchBar = (): JSX.Element => {
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

	renderHeading = (): JSX.Element => <Intro />

	render(): JSX.Element {
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
