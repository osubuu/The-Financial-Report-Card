import React from "react";
import FinancialStatementResults from "./FinancialStatementResults";
import CompanyProfile from "./CompanyProfile";

const Results = props => {
  return (
    <section className="results">
      {/* If API call gives any request errors
      {props.error === true ? (
        <h4 className="error">
          Data could not be retrieved for this company. Please search for
          another company.
        </h4>
      ) : null} */}
      {/* Check if API call gave us back profile information and if so then display */}
      {Object.keys(props.profileResult).length === 0 &&
      props.searchDone === true &&
      props.error === false ? (
        <section className="company-fs">
          <h4 className="no-results-header" style={{ display: "block" }}>
            No Info On This Company
          </h4>
        </section>
      ) : (
        <CompanyProfile
          profileResult={props.profileResult}
          userInput={props.userInput}
          error={props.error}
          saveToFirebase={props.saveToFirebase}
        />
      )}
      {/* Check if API call gave us back FS and if so then display */}
      {Object.keys(props.chosenResults).length === 0 &&
      props.searchDone === true &&
      props.error === false ? (
        <section className="company-fs">
          <h4 className="no-results-header" style={{ display: "block" }}>
            No Financial Statements Found
          </h4>
        </section>
      ) : (
        <FinancialStatementResults
          chosenResults={props.chosenResults}
          companyName={props.profileResult.companyName}
          error={props.error}
          colorPos={props.colorPos}
          searchDone={props.searchDone}
          availableFSLIs={props.availableFSLIs}
          getUserFSLIChange={props.getUserFSLIChange}
        />
      )}
    </section>
  );
};

export default Results;
