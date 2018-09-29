import React from "react";

const Select = props => {
  return (
    <div className="select-div">
      <select
        onChange={event => props.getUserFSLIChange(event, props.i)}
        className="all-fslis-select"
        defaultValue={props.item.fsli}
        key={props.i}
      >
        {props.availableFSLIs.is ? (
          <optgroup className="is-fslis" label="Income Statement">
            {props.availableFSLIs.is.map(fsli => {
              return (
                <option value={fsli} key={fsli}>
                  {fsli}
                </option>
              );
            })}
          </optgroup>
        ) : null}

        {props.availableFSLIs.bs ? (
          <optgroup className="bs-fslis" label="Balance Sheet">
            {props.availableFSLIs.bs.map(fsli => {
              return (
                <option value={fsli} key={fsli}>
                  {fsli}
                </option>
              );
            })}
          </optgroup>
        ) : null}
      </select>
    </div>
  );
};

export default Select;
