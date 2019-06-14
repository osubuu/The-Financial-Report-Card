import React from 'react';

const Intro = () => {
	const description = 'Need a quick look into the past? Make a search below and get back a financial snapshot of a US public company\'s most recent years.';
	return (
		<div className="intro">
			<h1 className="app-name">The Financial Report Card</h1>
			<h3 className="app-description">{description}</h3>
		</div>
	);
};

export default Intro;
