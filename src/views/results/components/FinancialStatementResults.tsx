import React from 'react';
import _ from 'lodash';
import { Line } from 'react-chartjs-2';
import {
	FinancialStatementResultsProps, SingleChartData, Result,
	SelectedFSLI, TooltipItem, ChartData,
} from '../../../types/types';

import Select from './Select';
import YearlyResults from './YearlyResults';
import ResultUtils from '../resultsUtils';

const possibleBorderColors = [
	'#396AB1',
	'#DA7C30',
	'#3E9651',
	'#CC2529',
	'#535154',
	'#6B4C9A',
	'#948B3D',
];

const possibleFillColors = [
	'#afc5e5',
	'#f4d7c0',
	'#a4dab0',
	'#f0abad',
	'#a8a6a9',
	'#c4b5db',
	'#d9d3a2',
];

const getMostRecentYears = (results: Result[]): string[] => {
	const years = _.map(results, (yearlyResult) => yearlyResult.date);
	return years.reverse(); // to display the most recent year to the right on the graph
};

const prepareDatasets = (FSLIResults: SelectedFSLI[], colors: number[]): SingleChartData[] => {
	const datasets = _.reduce(FSLIResults, (sanitizedData: SingleChartData[], result, index) => {
		const resultData = _.map(result.results, (yearlyResult: any) => {
			const valueInMillions = (yearlyResult.value / 1000000);
			return valueInMillions;
		}).reverse(); // reverse to match reversed years
		const fsliData: SingleChartData = {
			label: ResultUtils.cleanFSLIName(result.fsli),
			fill: false,
			borderColor: possibleBorderColors[colors[index]],
			backgroundColor: possibleFillColors[colors[index]],
			borderWidth: 2,
			data: resultData,
		};
		return [...sanitizedData, fsliData];
	}, []);
	return datasets;
};

const prepareChartData = (
	selectedFSLIsData: SelectedFSLI[], colors: number[],
): object => ({
	labels: getMostRecentYears(selectedFSLIsData[0].results), // x-axis data
	datasets: prepareDatasets(selectedFSLIsData, colors), // y-axis data
});

// Define configuration options for Chart JS
const chartOptions = (companyName: string): object => ({
	responsive: true,
	maintainAspectRatio: false,
	title: {
		display: true,
		text: companyName,
	},
	hover: {
		mode: 'x-axis',
		intersect: true,
	},
	tooltips: {
		mode: 'index',
		intersect: false,
		callbacks: {
			label(tooltipItem: TooltipItem, data: ChartData): string {
				// Get fsli label
				const fsli = data.datasets[tooltipItem.datasetIndex].label;
				// Get fsli value
				const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
				// apply commas through regex
				let formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				formattedValue = formattedValue.replace(/-(.*)/, '($1)');

				if (formattedValue.length === 0) {
					return `${fsli}: nil`;
				}
				return `${fsli}: ${formattedValue}`;
			},
		},
	},
	scales: {
		yAxes: [
			{
				display: true,
				scaleLabel: {
					display: true,
					labelString: '$USD (in millions)',
					fontSize: 20,
				},
				ticks: {
					beginAtZero: true,
					userCallback(value: number): string {
						const label = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/-(.*)/, '($1)');
						return `$${label}`;
					},
				},
			},
		],
		xAxes: [
			{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Financial Year End',
					fontSize: 20,
				},
			},
		],
	},
});

const FinancialStatementResults = (props: FinancialStatementResultsProps): JSX.Element => {
	const {
		chosenResults, getUserFSLIChange, availableFSLIs, colors, companyName,
	} = props;

	return (
		<section className="company-fs">
			<div className="raw-results-container">
				{/* HEADER WITH RESULTS */}
				<div className="results-header">
					<h2 className="results-title">Results</h2>
					<h3 className="currency-explanation">(in millions of $USD)</h3>
				</div>

				{/* LIST OF ALL 3 FSLIS */}
				<div className="list-of-fsli">
					{chosenResults.map((item, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<form className="single-fsli-container" key={index}>
							<h3 className="fsli-title">{ResultUtils.cleanFSLIName(item.fsli)}</h3>

							{/* SELECT BAR FOR EACH FSLI FOR USER TO CHANGE */}
							<Select
								getUserFSLIChange={getUserFSLIChange}
								item={item}
								index={index}
								availableFSLIs={availableFSLIs}
							/>

							{/* YEARLY RESULTS FOR EACH FSLI IN REGULAR TABLE FORM */}
							<YearlyResults item={item} />
						</form>
					))}
				</div>
			</div>

			{/* CHART JS WITH YEARLY RESULTS DISPLAYED TOGETHER IN ONE GRAPH */}
			<div className="chart-container">
				<Line
					data={prepareChartData(chosenResults, colors)}
					options={chartOptions(companyName)}
				/>
			</div>
		</section>
	);
};

export default FinancialStatementResults;
