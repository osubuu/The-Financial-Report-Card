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

	componentDidUpdate(prevProps) {
		const {
			resultsAreReady, history,
		} = this.props;
		const resultsLoaded = !prevProps.resultsAreReady && resultsAreReady;
		console.log(this.state);
		console.log(this.props);

		if (resultsLoaded) history.push('/results');
	}

	/* B2. GET USER INPUT FROM SEARCH BAR */
	getSearchValue = (input) => {
		this.setState({ searchValue: input });
	};

	renderLoadingScreen = () => {
		const { loading } = this.props;
		if (loading === undefined) return null;
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
		const {
			companies, handleSubmit,
		} = this.props;
		const { searchValue } = this.state;
		return (
			<Search
				getValue={this.getSearchValue}
				handleSubmit={handleSubmit}
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
