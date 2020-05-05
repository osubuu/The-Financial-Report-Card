import _ from 'lodash';

const sanitizeCompaniesData = (rawCompaniesData) => {
	// get rid of companies that don't have FS. these include tickers that have "." or "-"
	const regex = RegExp('[.-=]');
	const validCompanies = _.reduce(rawCompaniesData, (acc, company) => {
		const { symbol, name } = company;
		if (name && !regex.test(symbol)) {
			const companyInfo = {
				name,
				ticker: symbol,
			};
			acc.push(companyInfo);
		}
		return acc;
	}, []);
	return validCompanies;
};

const sanitizeProfileData = (ticker, rawProfileData) => {
	const sanitizedProfileData = JSON.parse(rawProfileData.replace(/<pre>/g, ''))[ticker];
	sanitizedProfileData.ticker = ticker;
	return sanitizedProfileData;
};

const sanitizeFinancialStatementData = (rawIncomeStatementData, rawBalanceSheetData) => ({
	is: JSON.parse(rawIncomeStatementData.replace(/<pre>/g, '')),
	bs: JSON.parse(rawBalanceSheetData.replace(/<pre>/g, '')),
});

const getAvailableFSLIs = (ticker, fsResults) => ({
	is: _.keys(fsResults.is[ticker]),
	bs: _.keys(fsResults.bs[ticker]),
});

export default {
	sanitizeCompaniesData,
	sanitizeProfileData,
	sanitizeFinancialStatementData,
	getAvailableFSLIs,
};
