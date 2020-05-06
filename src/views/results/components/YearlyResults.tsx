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
			{item.results.map((result, index) => {
				if (result.key !== 'TTM') {
					return (
						// eslint-disable-next-line react/no-array-index-key
						<li className="yearly-result" key={index}>
							<h5 className="year">{`${result.key} :`}</h5>
							<h5 className="result">{numberWithCommas(result.value)}</h5>
						</li>
					);
				}
				return null;
			})}
		</ul>
	);
};

export default YearlyResults;
