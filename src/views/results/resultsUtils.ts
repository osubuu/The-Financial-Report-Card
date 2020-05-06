
import _ from 'lodash';
import {
	FinancialStatementResults, AvailableFSLIs, Profile, SelectedFSLI,
} from '../../types/types';


const determineDefaultFSLIs = (
	fsResults: FinancialStatementResults, availableFSLIs: AvailableFSLIs,
): string[] => {
	const defaultFSLIs = ['Revenue', 'Cost of revenue', 'Net income'];
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
	profile: Profile,
): SelectedFSLI[] => {
	// loop through array of chosen fslis strings to prepare the array of objects with data
	const { ticker } = profile;
	const selectedFSLIsArray: SelectedFSLI[] = [];
	for (let i = 0; i < chosenFSLIs.length; i += 1) {
		const fsli = chosenFSLIs[i];
		const type = _.includes(availableFSLIs.is, fsli) ? 'is' : 'bs';

		const fsliData = _.entries(fsResults[type][ticker][fsli]);
		const results = _.map(fsliData, ([key, value]) => ({ key, value }));
		selectedFSLIsArray.push({
			fsli,
			results,
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

export default {
	determineDefaultFSLIs,
	prepareSelectedFSLisArray,
	getRandomUniqueNumbers,
};
