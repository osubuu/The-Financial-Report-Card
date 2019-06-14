import React from 'react';

const YearlyResults = (props) => {
	const { item, numberWithCommas } = props;

	return (
		<ul className="yearly-results">
			{item.results.map((result, i) => {
				if (result.key !== 'TTM') {
					return (
						// eslint-disable-next-line react/no-array-index-key
						<li className="yearly-result" key={i}>
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
