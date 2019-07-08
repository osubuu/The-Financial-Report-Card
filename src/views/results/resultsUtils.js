
import _ from 'lodash';

const Utils = {
	determineDefaultFSLIs: (fsResults, availableFSLIs) => {
		const defaultFSLIs = ['Revenue', 'Cost of revenue', 'Net income'];

		const intersect = _.intersection(fsResults.is, defaultFSLIs);
		const chosenFSLIs = intersect.length === defaultFSLIs.length ? defaultFSLIs : intersect;

		// add FSLIs that are not in the intersect yet from the difference array, if any
		let n = 0;
		const difference = _.difference(availableFSLIs.is, defaultFSLIs);
		while (chosenFSLIs.length < defaultFSLIs.length) {
			chosenFSLIs.push(difference[n]);
			n += 1;
		}
		return chosenFSLIs;
	},
	prepareSelectedFSLisArray: (selectedFSLIs, availableFSLIs, fsResults, profile) => {
		// loop through array of chosen fslis strings to prepare the array of objects with data
		const { ticker } = profile;
		const selectedFSLIsArray = [];
		for (let i = 0; i < selectedFSLIs.length; i += 1) {
			const fsli = selectedFSLIs[i];
			const type = _.includes(availableFSLIs.is, fsli) ? 'is' : 'bs';

			const fsliData = _.entries(fsResults[type][ticker][fsli]);
			const results = _.map(fsliData, ([key, value]) => ({ key, value }));
			selectedFSLIsArray.push({
				fsli,
				results,
			});
		}
		return selectedFSLIsArray;
	},
	getRandomUniqueNumbers: (amountOfUniqueNumbers, range) => {
		const uniqueNumbers = [];
		while (uniqueNumbers.length < amountOfUniqueNumbers) {
			const randomNumber = _.random(range);
			// make sure each numbers are unique
			if (!_.includes(uniqueNumbers, randomNumber)) {
				uniqueNumbers.push(randomNumber);
			}
		}
		return uniqueNumbers;
	},
};

export default Utils;
