import _ from 'lodash';

const Utils = {
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
