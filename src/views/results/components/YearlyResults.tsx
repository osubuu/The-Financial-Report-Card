import React from 'react';
import { YearlyResultsProps } from '../../../types/types';

const numberWithCommas = (value: string): string => {
	if (value.length === 0) {
		return '0';
	}
	return value
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		.replace(/-(.*)/, '($1)');
};

const YearlyResults = (props: YearlyResultsProps): JSX.Element => {
	const { item } = props;

	return (
		<ul className="yearly-results">
			{item.results.map((result, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<li className="yearly-result" key={index}>
					<h5 className="year">{`${result.date} :`}</h5>
					<h5 className="result">{numberWithCommas((result.value / 1000000).toString())}</h5>
				</li>
			))}
		</ul>
	);
};

export default YearlyResults;
