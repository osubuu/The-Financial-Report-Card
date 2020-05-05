import _ from 'lodash';
import {
	RawCompany, Company, Profile, FinancialStatementResults, AvailableFSLIs,
} from '../../types/types';

const sanitizeCompaniesData = (rawCompaniesData: RawCompany[]): Company[] => {
	// get rid of companies that don't have FS. these include tickers that have "." or "-"
	const regex = RegExp('[.-=]');
	const validCompanies = _.reduce(rawCompaniesData, (acc: Company[], company: RawCompany) => {
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

const sanitizeProfileData = (ticker: string, rawProfileData: string): Profile => {
	const sanitizedProfileData = JSON.parse(rawProfileData.replace(/<pre>/g, ''))[ticker];
	return {
		companyName: sanitizedProfileData.companyName,
		exchange: sanitizedProfileData.exchange,
		CEO: sanitizedProfileData.CEO,
		sector: sanitizedProfileData.sector,
		industry: sanitizedProfileData.industry,
		description: sanitizedProfileData.description,
		website: sanitizedProfileData.website,
		ticker,
	};
};

const sanitizeFinancialStatementData = (
	rawIncomeStatementData: string, rawBalanceSheetData: string,
): FinancialStatementResults => ({
	is: JSON.parse(rawIncomeStatementData.replace(/<pre>/g, '')),
	bs: JSON.parse(rawBalanceSheetData.replace(/<pre>/g, '')),
});

const getAvailableFSLIs = (
	ticker: string, fsResults: FinancialStatementResults,
): AvailableFSLIs => ({
	is: _.keys(fsResults.is[ticker]),
	bs: _.keys(fsResults.bs[ticker]),
});

export default {
	sanitizeCompaniesData,
	sanitizeProfileData,
	sanitizeFinancialStatementData,
	getAvailableFSLIs,
};
