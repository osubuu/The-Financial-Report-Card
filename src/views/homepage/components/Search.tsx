import React from 'react';
import Autocomplete from 'react-autocomplete';
import { Company, SearchProps, InputElement } from '../../../types/types';

// A1. Function to render items if they match user input
const matchCompanyToInput = (company: Company, input: string): boolean => {
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
const sortCompanies = (a: Company, b: Company, value: string): number => {
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

const Search = (props: SearchProps): JSX.Element => {
	const {
		handleSubmit, value, companies, getValue,
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
				getItemValue={(item: Company): string => item.ticker}
				shouldItemRender={matchCompanyToInput}
				sortItems={sortCompanies}
				onChange={(event: InputElement): void => { getValue(event.target.value); }}
				onSelect={(selectValue: string): void => { getValue(selectValue); }}
				renderMenu={(children: Company[]): JSX.Element => <ul className="menu">{children}</ul>}
				renderItem={(item: Company, isHighlighted: boolean): JSX.Element => (
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
