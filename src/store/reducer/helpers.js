import _ from 'lodash';

const Helpers = {
	sanitizeCompaniesData: (rawCompaniesData) => {
		// get rid of companies that don't have FS. these include tickers that have "." or "-"
		const regex = RegExp('[.-=]');
		const validCompanies = _.reduce(rawCompaniesData, (acc, company) => {
			const { symbol, name } = company;
			if (name && regex.test(symbol) === false) {
				const companyInfo = {
					name,
					ticker: symbol,
				};
				return [...acc, companyInfo];
			}
			return acc;
		}, []);
		return validCompanies;
	},
};

export default Helpers;
