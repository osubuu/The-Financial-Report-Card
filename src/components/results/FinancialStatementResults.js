import React from "react";
import { Line } from "react-chartjs-2";
import Select from "./Select";
import YearlyResults from "./YearlyResults";

/* ==================
A. HELPER FUNCTIONS
=================== */

// A1. Get number with commas using regex
const numberWithCommas = number => {
  if (number.length === 0) {
    return "0";
  } else {
    return number
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      .replace(/-(.*)/, "($1)");
  }
};

// A2. Get year from results
const prepareYears = array => {
  let newArr = [];
  array.forEach(result => {
    if (result.key !== "TTM") {
      newArr.push(result.key);
    }
  });
  return newArr;
};

// A3. Prepare datasets for Chart JS
const prepareDatasets = (FSLIResults, colorPos) => {
  let datasets = [];
  let possibleColors = [
    "#396AB1",
    "#DA7C30",
    "#3E9651",
    "#CC2529",
    "#535154",
    "#6B4C9A",
    "#948B3D"
  ];

  let possibleBackgroundColors = [
    "#afc5e5",
    "#f4d7c0",
    "#a4dab0",
    "#f0abad",
    "#a8a6a9",
    "#c4b5db",
    "#d9d3a2"
  ];

  let fsliCount = 0;
  FSLIResults.forEach(fsli => {
    let dataset = {};

    dataset.label = fsli.fsli;
    dataset.data = [];
    dataset.fill = false;

    // const randomPosition = randomize(possibleColors);
    // dataset.borderColor = possibleColors[fsliCount];
    dataset.borderColor = possibleColors[colorPos[fsliCount]];
    // possibleColors.splice(randomPosition, 1);

    // dataset.backgroundColor = possibleBackgroundColors[fsliCount];
    dataset.backgroundColor = possibleBackgroundColors[colorPos[fsliCount]];
    // possibleBackgroundColors.splice(randomPosition, 1);

    fsli.results.forEach(year => {
      if (year.key !== "TTM") {
        dataset.data.push(year.value);
      }
    });

    datasets.push(dataset);
    fsliCount++;
  });

  return datasets;
};

// A4. Prepare both labels and datasets for Chart JS
const prepareChartData = (FSLIResults, colorPos) => {
  // Prepare X-Axis (years)
  let labelsArr = prepareYears(FSLIResults[0].results);

  // Prepare datasets for each FSLI
  let datasetsArr = prepareDatasets(FSLIResults, colorPos);

  return {
    labels: labelsArr,
    datasets: datasetsArr
  };
};

// A5. Define options for Chart JS
const options = companyName => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: companyName
    },
    hover: {
      mode: "x-axis",
      intersect: true
    },
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function(tooltipItem, data) {
          // Get fsli label
          let fsli = data.datasets[tooltipItem.datasetIndex].label;
          // Get fsli value
          let value =
            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          // apply commas through regex
          value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          value = value.replace(/-(.*)/, "($1)");

          if (value.length === 0) {
            return fsli + ": nil";
          } else {
            return fsli + ": " + value;
          }
        }
      }
    },
    scales: {
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "$USD (in millions)",
            fontSize: 20
          },
          ticks: {
            beginAtZero: true,
            userCallback: function(value, index, values) {
              value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              value = value.replace(/-(.*)/, "($1)");
              return "$" + value;
            }
          }
        }
      ],
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Financial Year End",
            fontSize: 20
          }
        }
      ]
    }
  };
};

/* ==================
EXPORTED MODULE
=================== */

const FinancialStatementResults = props => {
  // if a API request error occured, don't display
  if (props.error === true) {
    return null;
  }

  // else, display
  else {
    return (
      <section className="company-fs">
        <div className="raw-results-container">
          {/* HEADER WITH RESULTS */}
          <div className="results-header">
            <h2 className="results-title">Results</h2>
            <h3 className="currency-explanation">(in millions of $USD)</h3>
          </div>

          {/* LIST OF ALL 3 FSLIS */}
          <div className="list-of-fsli">
            {props.chosenResults.map((item, i) => {
              return (
                <form className="single-fsli-container" key={i}>
                  <h3 className="fsli-title">{item.fsli}</h3>

                  {/* SELECT BAR FOR EACH FSLI FOR USER TO CHANGE */}
                  <Select
                    getUserFSLIChange={props.getUserFSLIChange}
                    item={item}
                    i={i}
                    availableFSLIs={props.availableFSLIs}
                  />

                  {/* YEARLY RESULTS FOR EACH FSLI IN REGULAR TABLE FORM */}
                  <YearlyResults
                    item={item}
                    numberWithCommas={numberWithCommas}
                  />
                </form>
              );
            })}
          </div>
        </div>

        {/* CHART JS WITH YEARLY RESULTS DISPLAYED TOGETHER IN ONE GRAPH */}
        <div className="chart-container">
          <Line
            data={prepareChartData(props.chosenResults, props.colorPos)}
            options={options(props.companyName)}
          />
        </div>
      </section>
    );
  }
};

export default FinancialStatementResults;
