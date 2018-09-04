import React from "react";

const YearlyResults = props => {
  return (
    <ul className="yearly-results">
      {props.item.results.map((result, i) => {
        if (result.key !== "TTM") {
          return (
            <li className="yearly-result" key={i}>
              <h5 className="year">{result.key} :</h5>
              <h5 className="result">{props.numberWithCommas(result.value)}</h5>
            </li>
          );
        } else {
          return null;
        }
      })}
    </ul>
  );
};

export default YearlyResults;
