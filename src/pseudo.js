/* NAME SPACING */
const app = {};

/* 1. MAKE CALL TO IEX FOR ALL COMPANY NAMES AND TICKERS */
const IEXUrl = "https://api.iextrading.com/1.0/ref-data/symbols";
app.initialGather = () => {
  // make AXIOS CALL IN APP.JS in ComponentDidMount
};

/* 2. STORE IEX COMPANY NAMES AND TICKERS IN A MAP AS KEY/VALUE PAIR */
app.storeNameAndTicker = () => {
  // Loop through results
  // Extract only company name and symbol
};

/* 2.1 SUGGESTION AUTOCOMPLETION FUNCTION */
app.suggestionAutocomplete = () => {};

/* 3. GET USER INPUT */
app.getUserInput = () => {
  // Event listener for enter

  // Run getTicker function
  let ticker = app.getTicker();

  return ticker;
};

/* 3.1 GET TICKER FOR THE INPUTED COMPANY NAME */
app.getTicker = () => {
  // Loop through map and obtain relevant ticker
};

/* 4. MAKE CALL TO FINANCIAL MODELING PREP FOR FINANCIAL STATEMENT DATA */
const companyTicker = app.getUserInput();
const FMPUrl = `https://financialmodelingprep.com/api/financials/balance-sheet-statement/${companyTicker}`;
app.getFinancialStatements = () => {
  // Make axios call to FMP
  // Store data
};

/* 5. DISPLAY FINANCIAL INFORMATION */
app.displayFinancialData = () => {
  // Append to DOM
};

/* EXTRA STUFF */

// CHART JS FOR DATA VISUALIZATION

// SAVE PREVIOUS SEARCHES IN FIREBASE

// ALLOW USER TO CHOOSE WHICH FSLI TO SEE
