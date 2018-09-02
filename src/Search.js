import React from "react";
import Autocomplete from "react-autocomplete";
import { matchCompanyToInput, sortCompanies } from "./utils";

const Search = props => {
  return (
    <form className="search-form" onSubmit={props.handleSubmit} id="search-bar">
      <Autocomplete
        value={props.value}
        wrapperStyle={{ position: "relative", display: "inline-block" }}
        items={props.companies}
        inputProps={{
          placeholder: "Enter a public US company name or ticker",
          id: "states-autocomplete"
        }}
        getItemValue={item => item.ticker}
        shouldItemRender={matchCompanyToInput}
        sortItems={sortCompanies}
        onChange={(event, value) => props.getValue(value)}
        onSelect={value => {
          props.getUserInput(value);
          props.getValue(value);
        }}
        renderMenu={children => <ul className="menu">{children}</ul>}
        renderItem={(item, isHighlighted) => (
          <li
            className={`item ${isHighlighted ? "item-highlighted" : ""}`}
            key={item.ticker}
          >
            <h4 className="item-name">{item.name}</h4>
            <h4 className="item-ticker">({item.ticker})</h4>
          </li>
        )}
      />
      {/* <label htmlFor="search-bar" className="search-placeholder">
        Enter any US Public Companies
      </label> */}
      <button className="search-button" type="submit">
        <i className="fas fa-search" />
      </button>
    </form>
  );
};

export default Search;
