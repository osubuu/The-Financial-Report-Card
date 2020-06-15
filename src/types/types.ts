export type FormElement = React.FormEvent<HTMLFormElement>;
export type InputElement = React.ChangeEvent<HTMLInputElement>;
export type SelectElement = React.ChangeEvent<HTMLSelectElement>;

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
	symbol: string;
	price: number;
	beta: number;
	volAvg: number;
	mktCap: number;
	lastDiv: number;
	range: string;
	changes: number;
	companyName: string;
	exchange: string;
	exchangeShortName: string;
	industry: string;
	website: string;
	description: string;
	ceo: string;
	sector: string;
	dcfDiff: number;
	dcf: number;
	image: string;
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
	date: string;
	value: number;
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

export interface LoaderProps {
	condition: boolean;
}

export interface HomepageProps {
	companies: Company[];
	profile: Profile;
	fsResults: FinancialStatementResults;
	availableFSLIs: AvailableFSLIs;
	getCompanyProfilePending: boolean;
	getCompanyProfileSuccess: boolean;
	getCompanyFinancialStatementsPending: boolean;
	getCompanyFinancialStatementsSuccess: boolean;

	getAllCompanies: () => void;
	getProfile: (ticker: string) => void;
	getFinancialStatements: (ticker: string) => void;

	history: {
		push: (path: string) => void;
	};
}

export interface HomepageState {
	searchValue: string;
	profileReady: boolean;
	financialsReady: boolean;
}

export interface SearchProps {
	getValue: (input: string) => void;
	handleSubmit: (event: FormElement) => void;
	value: string;
	companies: Company[];
}
export interface ResultsProps {
	companies: Company[];
	profile: Profile;
	fsResults: FinancialStatementResults;
	availableFSLIs: AvailableFSLIs;
	selectedFSLIs: SelectedFSLI[];
	currentKey: string;
	getCompanyProfileSuccess: boolean;
	getCompanyFinancialStatementsSuccess: boolean;
	saveSnapshotPending: boolean;
	saveSnapshotSuccess: boolean;
	getSnapshotPending: boolean;
	getSnapshotSuccess: boolean;

	saveSnapshot: (data: SelectedFSLI[]) => void;
	getSnapshot: (currentKey: string) => void;

	history: {
		push: (path: string) => void;
	};
	match: {
		params: {
			key: string;
		};
	};
}

export interface ResultsState {
	selectedFSLIsData: SelectedFSLI[];
	colors: number[];
}

export interface CompanyProfileProps {
	profile: Profile;
	saveToFirebase: () => void;
}

export interface FinancialStatementResultsProps {
	chosenResults: SelectedFSLI[];
	getUserFSLIChange: (event: SelectElement, index: number) => void;
	availableFSLIs: AvailableFSLIs;
	colors: number[];
	companyName: string;
}

export interface SingleChartData {
	label: string;
	fill: boolean;
	borderColor: string;
	backgroundColor: string;
	borderWidth: number;
	data: number[];
}

export interface TooltipItem {
	datasetIndex: number;
	index: number;
	label: string;
	value: string;
	x: number;
	xLabel: string;
	y: number;
	yLabel: number;
}

export interface ChartData {
	datasets: SingleChartData[];
	labels: string[];
}

export interface SelectProps {
	getUserFSLIChange: (event: SelectElement, index: number) => void;
	item: SelectedFSLI;
	index: number;
	availableFSLIs: AvailableFSLIs;
}

export interface YearlyResultsProps {
	item: SelectedFSLI;
}
