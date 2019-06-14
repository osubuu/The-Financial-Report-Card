import React, { Component } from 'react';
import LoadingScreen from 'react-loading-screen';

import Search from './components/Search';
import Load from './components/Load';
import Intro from './components/Intro';
import Copyright from './components/Copyright';


class Homepage extends Component {
	componentDidUpdate(prevProps) {
		const { resultsAreReady, history } = this.props;
		const resultsLoaded = !prevProps.resultsAreReady && resultsAreReady;

		if (resultsLoaded) history.push('/results');
	}

	renderLoadingScreen = () => {
		const { loading } = this.props;
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
			value, companies, getValue, handleSubmit, getUserInput,
		} = this.props;
		return (
			<Search
				getValue={getValue}
				handleSubmit={handleSubmit}
				value={value}
				companies={companies}
				getUserInput={getUserInput}
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
