import _ from 'lodash';
import { RawCompany, Company, AvailableFSLIs } from '../../types/types';

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

const getAvailableFSLIs = (incomeStatementData: any, balanceSheetData: any): AvailableFSLIs => {
	const fslisToOmit = [
		// remove metadata info
		'date',
		'symbol',
		'fillingDate',
		'acceptedDate',
		'period',
		'link',
		'finalLink',
		// remove ratios for now
		'grossProfitRatio',
		'ebitdaratio',
		'operatingIncomeRatio',
		'incomeBeforeTaxRatio',
		'netIncomeRatio',
		'eps',
		'epsdiluted',
	];
	return {
		is: _.keys(_.omit(incomeStatementData[0], fslisToOmit)),
		bs: _.keys(_.omit(balanceSheetData[0], fslisToOmit)),
	};
};
export default {
	sanitizeCompaniesData,
	getAvailableFSLIs,
};
