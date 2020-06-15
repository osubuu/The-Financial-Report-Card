
import _ from 'lodash';
import {
	FinancialStatementResults, AvailableFSLIs, SelectedFSLI,
} from '../../types/types';


const determineDefaultFSLIs = (
	fsResults: FinancialStatementResults, availableFSLIs: AvailableFSLIs,
): string[] => {
	const defaultFSLIs = ['revenue', 'costOfRevenue', 'netIncome'];
	const incomeStatement = fsResults.is;
	const incomeStatementFSLIs = _.keys(incomeStatement[_.keys(incomeStatement)[0]]);

	const intersect = _.intersection(incomeStatementFSLIs, defaultFSLIs);
	const chosenFSLIs = intersect.length === defaultFSLIs.length ? defaultFSLIs : intersect;

	// add FSLIs that are not in the intersect yet from the difference array, if any
	let n = 0;
	const difference = _.difference(availableFSLIs.is, defaultFSLIs);
	while (chosenFSLIs.length < defaultFSLIs.length) {
		chosenFSLIs.push(difference[n]);
		n += 1;
	}
	return chosenFSLIs;
};

const prepareSelectedFSLisArray = (
	chosenFSLIs: string[],
	availableFSLIs: AvailableFSLIs,
	fsResults: FinancialStatementResults,
): SelectedFSLI[] => {
	// loop through array of chosen fslis strings to prepare the array of objects with data
	const selectedFSLIsArray: SelectedFSLI[] = [];
	for (let i = 0; i < chosenFSLIs.length; i += 1) {
		const fsli = chosenFSLIs[i];
		const type = _.includes(availableFSLIs.is, fsli) ? 'is' : 'bs';
		const fsData = fsResults[type];

		selectedFSLIsArray.push({
			fsli,
			results: _.map(fsData, (annualData): any => ({
				date: annualData.date,
				value: annualData[fsli],
			})),
		});
	}
	return selectedFSLIsArray;
};

const getRandomUniqueNumbers = (amountOfUniqueNumbers: number, range: number): number[] => {
	const uniqueNumbers: number[] = [];
	while (uniqueNumbers.length < amountOfUniqueNumbers) {
		const randomNumber = _.random(range);
		// make sure each numbers are unique
		if (!_.includes(uniqueNumbers, randomNumber)) {
			uniqueNumbers.push(randomNumber);
		}
	}
	return uniqueNumbers;
};

const cleanFSLIName = (fsli: string): string => {
	const fsliDisplayName = fsli.replace(/([A-Z])/g, ' $1').trim();
	return _.upperFirst(fsliDisplayName);
};

export default {
	determineDefaultFSLIs,
	prepareSelectedFSLisArray,
	getRandomUniqueNumbers,
	cleanFSLIName,
};
