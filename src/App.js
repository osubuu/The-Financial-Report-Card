import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Search from "./Search";
import Results from "./Results";
import _ from "underscore";
import firebase from "./firebase";
import scrollToElement from "scroll-to-element";
import swal from "sweetalert2";

const dbRef = firebase.database().ref();

class App extends Component {
  constructor() {
    super();
    this.state = {
      companies: [],
      fsResults: {
        is: {},
        bs: {}
      },
      profileResult: {},
      searchDone: false,
      availableFSLIs: {
        is: [],
        bs: []
      },
      defaultFSLIs: ["Revenue", "Cost of revenue", "Net income"],
      chosenFSLIs: [],
      chosenFSLIsArr: [],
      userInput: "",
      value: "",
      error: false,
      randomColorPositions: [],
      saved: false,
      currentKey: "",
      savedInput: ""
    };
  }

  render() {
    return (
      <div className="App">
        <header className="home-page">
          <div className="home-page-container">
            {/* Title */}
            <h1 className="app-name">The Financial Report Card</h1>
            <h3 className="app-description">
              Need a quick look to the past? Make a search below and get back a
              financial snapshot of a US company's most recent years.
            </h3>

            {/* Search Bar */}
            <Search
              getValue={this.getValue}
              handleSubmit={this.handleSubmit}
              value={this.state.value}
              companies={this.state.companies}
              getUserInput={this.getUserInput}
            />

            {/* Load Bar */}
            <div className="loading-container">
              <h3 className="loading-description">
                Want to load an already existing snapshot?
                <br />
                Enter your key below.
              </h3>
              <form
                action=""
                className="loading-form"
                onSubmit={this.getDataFromFirebase}
              >
                <input
                  className="load-field"
                  onChange={this.getSavedInput}
                  type="text"
                />
                <button className="load-button" type="submit">
                  <i className="fas fa-arrow-circle-right" />
                </button>
              </form>
            </div>
          </div>

          <h6 className="copyright">
            &#169; 2018 Khoi Pham ---{" "}
            <a className="portfolio-link" href="http://www.khoipham.net">
              khoipham.net
            </a>
          </h6>
        </header>

        {this.state.searchDone === true && this.state.error === false ? (
          <Results
            chosenResults={this.state.chosenFSLIsArr}
            profileResult={this.state.profileResult}
            searchDone={this.state.searchDone}
            userInput={this.state.userInput}
            error={this.state.error}
            colorPos={this.state.randomColorPositions}
            availableFSLIs={this.state.availableFSLIs}
            getUserFSLIChange={this.getUserFSLIChange}
            saveToFirebase={this.saveToFirebase}
          />
        ) : null}
      </div>
    );
  }

  getDataFromFirebase = event => {
    console.log("hello");
    event.preventDefault();
    let key = this.state.savedInput;
    console.log(this.state.savedInput);

    this.setState({
      chosenFSLIsArr: [],
      searchDone: false
    });

    dbRef
      .child("/saves/" + key)
      .once("value")
      .then(snapshot => {
        console.log(snapshot.val());

        this.setState({
          userInput: snapshot.val().ticker,
          defaultFSLIs: ["Revenue", "Cost of revenue", "Net income"],
          profileResult: snapshot.val().profile,
          chosenFSLIs: snapshot.val().fslis,
          chosenFSLIsArr: snapshot.val().fslisArr,
          fsResults: JSON.parse(snapshot.val().allResults),
          availableFSLIs: snapshot.val().availableFSLIs,
          randomColorPositions: this.getRandom3UniqueNumbers(7),
          searchDone: true
        });

        scrollToElement(".results", { ease: "inSine", duration: 500 });
      });

    event.target.reset();
  };

  // listen for input in saved field
  getSavedInput = e => {
    this.setState({
      savedInput: e.target.value
    });
  };

  // listen for user changing fsli
  getUserFSLIChange = (event, index) => {
    let tempArr = this.state.chosenFSLIs;

    // change name of FSLI at the specific index in chosen FSLI state
    tempArr[index] = event.target.value;
    this.setState({ chosenFSLIs: tempArr, saved: false });

    // get optGroup value (either is or bs), need this for prepareChosenFSLIArr method
    let fsType = event.target.selectedOptions[0].parentNode.className;

    this.prepareChosenFSLIsArr(fsType);
  };

  // Function to randomize three unique numbers for graph colors
  getRandom3UniqueNumbers = number => {
    let arr = [];
    while (arr.length < 3) {
      let randomNumber = Math.floor(Math.random() * number);
      if (arr.indexOf(randomNumber) === -1) {
        arr.push(randomNumber);
      }
    }
    return arr;
  };

  // API call to get company profile information
  getProfile = ticker => {
    let url = `https://financialmodelingprep.com/api/company/profile/${ticker}`;
    return axios({
      method: "GET",
      url: "https://proxy.hackeryou.com",
      dataResponse: "jsonp",
      params: {
        reqUrl: url
      }
    });
  };

  // API Call to get the FS DATA
  getFinancialStatements = (ticker, fs) => {
    let baseURL = "https://financialmodelingprep.com/api/";
    let companyTicker = ticker;
    let finalURL = `${baseURL}${fs}${companyTicker}`;

    // AXIOS CALL TO GET FS DATA
    return axios({
      method: "GET",
      url: "https://proxy.hackeryou.com",
      dataResponse: "jsonp",
      params: {
        reqUrl: finalURL
      }
    });
  };

  saveToFirebase = () => {
    let PostKey = dbRef.child("saves").push().key;
    console.log(PostKey);

    if (this.state.saved === true) {
      PostKey = this.state.currentKey;
    }

    let postData = {
      allResults: JSON.stringify(this.state.fsResults),
      ticker: this.state.userInput,
      fslis: this.state.chosenFSLIs,
      fslisArr: this.state.chosenFSLIsArr,
      profile: this.state.profileResult,
      availableFSLIs: this.state.availableFSLIs
    };

    // Write the new post's data simultaneously in the posts list and the user's post list.
    let updates = {};
    // updates["/saves/" + PostKey] = postData;
    updates["/saves/" + PostKey] = postData;

    console.log(updates);

    dbRef.update(updates);

    this.setState({
      saved: true,
      currentKey: PostKey
    });
    // swal(
    //   "Saved!",
    //   `Use the following key to access this exact snapshot again:\n\n${PostKey}`,
    //   "success"
    // );

    swal({
      type: "success",
      title: "SAVED!",
      // text: `Use the following key to access this exact snapshot again:\n\n${PostKey}`,
      html: `Use the following key to access this exact snapshot again:<br><br><strong>${PostKey}</strong>`
    });
  };

  // Get user input in search bar
  getUserInput = input => {
    this.setState({
      userInput: input
    });
  };

  // Get value and user input from Search component
  getValue = input => {
    this.setState({
      value: input
    });
  };

  storeProfileData = res => {
    let jsonRes = JSON.parse(res.data.replace(/<pre>/g, ""))[
      this.state.userInput
    ];

    this.setState({
      profileResult: jsonRes
    });
  };

  prepareChosenFSLIsArr = fsType => {
    let tempArr = [];
    let type = fsType;

    for (let i = 0; i < this.state.chosenFSLIs.length; i++) {
      let currentIndex = this.state.chosenFSLIs[i];

      // conditional for when user changes item in options menu
      if (fsType === "is-fslis" || fsType === "bs-fslis") {
        for (let fsliType in this.state.availableFSLIs) {
          if (
            this.state.availableFSLIs[fsliType].indexOf(currentIndex) !== -1
          ) {
            type = fsliType;
          }
        }
      }

      // make the object with the chosen fsli data
      let tempMap = Object.entries(
        this.state.fsResults[type][this.state.userInput][
          this.state.chosenFSLIs[i]
        ]
      ).map(([key, value]) => ({
        key,
        value
      }));

      // Push object to clean array
      tempArr.push({
        fsli: this.state.chosenFSLIs[i],
        results: tempMap
      });
    }

    // Save cleaned up objects in array
    this.setState({
      chosenFSLIsArr: tempArr
    });
  };

  storeFSData = (res, fsType) => {
    // Response data is in text. Remove <pre> tags to get proper format of JSON object. Parse into JSON for easier use.
    let jsonRes = JSON.parse(res.data.replace(/<pre>/g, ""));

    // create copy of this.state.fsResults and this.state.availableFSLIs
    let fsCopy = Object.assign({}, this.state.fsResults);
    let fsliCopy = Object.assign({}, this.state.availableFSLIs);

    if (fsType === "bs") {
      fsCopy.bs = jsonRes;
      fsliCopy.bs = Object.keys(jsonRes[this.state.userInput]);
    } else if (fsType === "is") {
      fsCopy.is = jsonRes;
      fsliCopy.is = Object.keys(jsonRes[this.state.userInput]);
    }

    this.setState({
      fsResults: fsCopy,
      availableFSLIs: fsliCopy
    });

    if (fsType === "is") {
      let tempArr = [];

      // use underscore intersection to find similarities between default and available FSLIs
      let intersect = _.intersection(
        this.state.availableFSLIs[fsType],
        this.state.defaultFSLIs
      );

      // if all 3 default fslis are found in the I/S FSLIs
      if (intersect.length === this.state.defaultFSLIs.length) {
        tempArr = this.state.defaultFSLIs;
      }

      // if default fslis are only 0,1,2 compared to the I/S FSLIs
      else if (intersect.length < this.state.defaultFSLIs.length) {
        tempArr = intersect;
        let n = 0;

        // add FSLIs that are not in the intersect yet from the difference array
        while (tempArr.length < this.state.defaultFSLIs.length) {
          // array of available FSLIs that are not in the default ones yet
          let difference = _.difference(
            this.state.availableFSLIs[fsType],
            this.state.defaultFSLIs
          );
          tempArr.push(difference[n]);
          n++;
        }
      }

      this.setState({
        chosenFSLIs: tempArr
      });

      this.prepareChosenFSLIsArr(fsType);
    }
  };

  getData(ticker) {
    // this.setState({ chosenFSLIsArr: [], searchDone: false, error: false });
    this.setState({ searchDone: false, error: false });

    // store promises of API calls for profile and FS (both IS and BS)
    let profilePromise = this.getProfile(ticker);
    let isPromise = this.getFinancialStatements(
      ticker,
      "financials/income-statement/"
    );
    let bsPromise = this.getFinancialStatements(
      ticker,
      "financials/balance-sheet-statement/"
    );

    // wait for both promises to be done before manipulating results
    Promise.all([profilePromise, isPromise, bsPromise])
      .then(res => {
        // set this to indicate that the search call has been completed
        this.setState({ searchDone: true });

        scrollToElement(".results", { ease: "inSine", duration: 500 });

        // res[0] contains profile data, res[1] contains FS data
        this.storeProfileData(res[0]);
        this.storeFSData(res[1], "is");
        this.storeFSData(res[2], "bs");

        console.log("Default FSLIs");
        console.log(this.state.defaultFSLIs);
        console.log("Chosen");
        console.log(this.state.chosenFSLIs);
        console.log("Chosen FSLIs Arr:");
        console.log(this.state.chosenFSLIsArr);
        console.log("FS RESULTS:");
        console.log(this.state.fsResults);
        console.log("AVAILABLE FSLIS:");
        console.log(this.state.availableFSLIs);
      })
      .catch(error => {
        console.log(error);

        scrollToElement(".results", { ease: "inSine", duration: 500 });

        // if error 404 or page unreachable because company is not available on FMP
        if (error.response || error.request) {
          this.setState({ error: true, searchDone: true });
          swal({
            type: "error",
            title: "Sorry!",
            text:
              "Data could not be retrieved for this company. Please search for another one."
          });
        }
        // else it's an unavailable FSLI error
        else {
          this.setState({ searchDone: true });
        }
      });
  }

  // Send call to second API when user submits form
  handleSubmit = event => {
    event.preventDefault();
    event.target.reset();

    // this.getData(this.state.userInput);

    this.setState({
      value: "",
      randomColorPositions: this.getRandom3UniqueNumbers(7),
      defaultFSLIs: ["Revenue", "Cost of revenue", "Net income"],
      // chosenFSLIs: [],
      chosenFSLIsArr: [],
      saved: false
    });

    this.getData(this.state.userInput);
  };

  /* GET LIST OF ALL COMPANY NAMES AND TICKER NUMBERS */
  componentDidMount() {
    axios
      .get("https://api.iextrading.com/1.0/ref-data/symbols")
      .then(({ data }) => {
        let temporaryArr = [];
        // use regex to get rid of funds or other companies that don't necessarily have FS. namely, these include tickers that have "." or "-"
        let regex = RegExp("[.-=]");
        data.forEach(company => {
          if (company.name.length > 0 && regex.test(company.symbol) === false) {
            // company.symbol.includes("-") === false
            temporaryArr.push({
              ticker: company.symbol,
              name: company.name
            });
          }
        });

        this.setState({
          companies: temporaryArr
        });
      });
  }
}

export default App;
