import React from 'react';
import Autocomplete from 'react-autocomplete';

// A1. Function to render items if they match user input
const matchCompanyToInput = (company, input) => {
	// Restrict length of input to 3 letters or more to reduce load
	if (input.length > 2) {
		return (
			company.name.toLowerCase().indexOf(input.toLowerCase()) !== -1
			|| company.ticker.toLowerCase().indexOf(input.toLowerCase()) !== -1
		);
	}
	return false;
};

// A2. Sort autocompletion suggestions
const sortCompanies = (a, b, value) => {
	const aLower = a.name.toLowerCase();
	const bLower = b.name.toLowerCase();
	const valueLower = value.toLowerCase();
	const queryPosA = aLower.indexOf(valueLower);
	const queryPosB = bLower.indexOf(valueLower);
	if (queryPosA !== queryPosB) {
		return queryPosA - queryPosB;
	}
	return aLower < bLower ? -1 : 1;
};

const Search = (props) => {
	const {
		handleSubmit, value, companies, getValue, getUserInput,
	} = props;
	return (
		<form className="search-form" onSubmit={handleSubmit} id="search-bar">
			<Autocomplete
				value={value}
				wrapperStyle={{
					position: 'relative',
					display: 'inline-block',
					width: '100%',
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					padding: '2rem',
					borderRadius: '7px',
				}}
				items={companies}
				inputProps={{
					placeholder: 'Search for company name or ticker',
					id: 'states-autocomplete',
				}}
				getItemValue={item => item.ticker}
				shouldItemRender={matchCompanyToInput}
				sortItems={sortCompanies}
				onChange={(event) => {
					getValue(event.target.value);
					getUserInput(event.target.value);
				}}
				onSelect={(selectValue) => {
					getUserInput(selectValue);
					getValue(selectValue);
				}}
				renderMenu={children => <ul className="menu">{children}</ul>}
				renderItem={(item, isHighlighted) => (
					<li className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.ticker}>
						<h4 className="item-name">{item.name}</h4>
						<h4 className="item-ticker">{item.ticker}</h4>
					</li>
				)}
			/>
			<button className="search-button" type="submit"><h3>SUBMIT</h3></button>
		</form>
	);
};

export default Search;
