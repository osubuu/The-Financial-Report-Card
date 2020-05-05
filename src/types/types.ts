export interface Action {
	type: string;
	payload: {
		[key: string]: any;
	};
}

export interface ActionTypes {
	[actionType: string]: string;
}

export interface RawCompany {
	date: string;
	iexId: string;
	isEnabled: boolean;
	name: string;
	symbol: string;
	type: string;
}

export interface Company {
  name: string;
  ticker: string;
}

export interface Profile {
	companyName: string;
	ticker: string;
	exchange: string;
	CEO: string;
	sector: string;
	industry: string;
	description: string;
	website: string;
}

export interface FinancialStatement {
	[ticker: string]: {
		[fsli: string]: {
			[year: string]: string;
		};
	};
}

export interface FinancialStatementResults {
	is: FinancialStatement;
	bs: FinancialStatement;
}

export interface AvailableFSLIs {
	is: string[];
	bs: string[];
}

export interface Result {
	key: string;
	value: string;
}

export interface SelectedFSLI {
	fsli: string;
	results: Result[];
}

export interface SnapshotData {
	fsResults: FinancialStatementResults;
	selectedFSLIs: SelectedFSLI[];
	profile: Profile;
	availableFSLIs: AvailableFSLIs;
}

export interface State {
  companies: Company[];
	fsResults: FinancialStatementResults;
	profile: Profile;
	availableFSLIs: AvailableFSLIs;
	selectedFSLIs: SelectedFSLI[];
	currentKey: string;
	status: {
		getAllCompaniesPending: boolean;
		getAllCompaniesSuccess: boolean;
		getCompanyProfilePending: boolean;
		getCompanyProfileSuccess: boolean;
		getCompanyFinancialStatementsPending: boolean;
		getCompanyFinancialStatementsSuccess: boolean;
		saveSnapshotPending: boolean;
		saveSnapshotSuccess: boolean;
		getSnapshotPending: boolean;
		getSnapshotSuccess: boolean;
	};
}
