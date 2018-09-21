import React, { Component } from "react";
import axios from "axios";
import _ from "underscore";
import firebase from "./firebase";
import scrollToElement from "scroll-to-element";
import swal from "sweetalert2";
import "./App.css";
import Search from "./components/homepage/Search";
import Results from "./components/results/Results";
import Load from "./components/homepage/Load";
import Intro from "./components/homepage/Intro";
import Copyright from "./components/homepage/Copyright";
import LoadingScreen from "react-loading-screen";

// reference to firebase root
const dbRef = firebase.database().ref();

class App extends Component {
  /* =====================
  STATES
  ====================== */
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
      savedInput: "",
      loading: false
    };
  }

  /* =====================
  RENDER
  ====================== */

  render() {
    return (
      <div className="App">
        <header className="home-page">
          <div className="home-page-container">
            {/* APP TITLE AND DESCRIPTION */}
            <Intro />

            {/* SEARCH BAR */}
            <Search
              getValue={this.getValue}
              handleSubmit={this.handleSubmit}
              value={this.state.value}
              companies={this.state.companies}
              getUserInput={this.getUserInput}
            />

            {/* LOAD BAR */}
            <Load getDataFromFirebase={this.getDataFromFirebase} getSavedInput={this.getSavedInput} />
          </div>

          {/* COPYRIGHT */}
          <Copyright />
        </header>

        {/* LOADING SCREEN */}
        <LoadingScreen
          loading={this.state.loading}
          bgColor="rgba(0,0,0,0.5)"
          spinnerColor="#edac53"
          textColor="#676767"
        >
          <div />
        </LoadingScreen>

        {/* RESULTS PAGE (Only display if no API error occured) */}
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

  /* =====================
  A. FIREBASE METHODS
  ====================== */

  /* A1. RETRIEVE DATA FROM FIREBASE WHEN USER SUBMITS KEY */
  getDataFromFirebase = event => {
    event.preventDefault();

    // assign the key the user inputed into the load bar to this variable
    let key = this.state.savedInput;

    // reset a few states
    this.setState({
      chosenFSLIsArr: [],
      searchDone: false,
      loading: true
    });

    // retrieve data from firebase
    dbRef
      .child("/saves/" + key)
      .once("value")
      .then(snapshot => {
        // set data from firebase to the App's states
        this.setState({
          userInput: snapshot.val().ticker,
          defaultFSLIs: ["Revenue", "Cost of revenue", "Net income"],
          profileResult: snapshot.val().profile,
          chosenFSLIs: snapshot.val().fslis,
          chosenFSLIsArr: snapshot.val().fslisArr,
          fsResults: JSON.parse(snapshot.val().allResults),
          availableFSLIs: snapshot.val().availableFSLIs,
          randomColorPositions: this.getRandom3UniqueNumbers(7),
          searchDone: true,
          loading: false
        });

        // Scroll to results page
        scrollToElement(".results", { ease: "inSine", duration: 500 });
      })
      .catch(error => {
        swal({
          type: "question",
          title: "Invalid Key",
          text: `You seem to have submitted the wrong key. Please make sure you've included all the characters. Keys begin with "-LL...."`
        });

        this.setState({
          loading: false
        });
      });

    // Reset load bar input bar
    event.target.reset();
  };

  /* A2. LISTEN FOR USER INPUT (KEY) IN LOADING BAR */
  getSavedInput = e => {
    this.setState({
      savedInput: e.target.value
    });
  };

  /* A3. SAVE CURRENT RESULTS TO FIREBASE */
  saveToFirebase = () => {
    let PostKey = dbRef.child("saves").push().key;

    // if user is saving the same snapshot
    if (this.state.saved === true) {
      PostKey = this.state.currentKey;
    }

    // prepare data for to be stored in firebase
    let postData = {
      allResults: JSON.stringify(this.state.fsResults),
      ticker: this.state.userInput,
      fslis: this.state.chosenFSLIs,
      fslisArr: this.state.chosenFSLIsArr,
      profile: this.state.profileResult,
      availableFSLIs: this.state.availableFSLIs
    };

    // store info to firebase
    let updates = {};
    updates["/saves/" + PostKey] = postData;
    dbRef.update(updates);

    // update App's current states
    this.setState({
      saved: true,
      currentKey: PostKey
    });

    // show user alert to indicate that firebase save was successful
    swal({
      type: "success",
      title: "SAVED!",
      html: `Use the following key to access this exact snapshot again:<br><br><strong>${PostKey}</strong>`
    });
  };

  /* =====================
  B. SEARCH BAR METHODS
  ====================== */

  /* B1. SET STATE OF USER INPUT */
  getUserInput = input => {
    this.setState({
      userInput: input.trim().toUpperCase()
    });
  };

  /* B2. GET USER INPUT FROM SEARCH BAR */
  getValue = input => {
    this.setState({
      value: input
    });
  };

  /* B3. EVENT HANDLER FOR WHEN USER SUBMITS THEIR SEARCH */
  handleSubmit = event => {
    event.preventDefault();
    this.getUserInput(this.state.value);
    event.target.reset();

    // set default states
    this.setState({
      value: "",
      randomColorPositions: this.getRandom3UniqueNumbers(7),
      defaultFSLIs: ["Revenue", "Cost of revenue", "Net income"],
      profileResult: {},
      chosenFSLIsArr: [],
      saved: false,
      loading: true,
      searchDone: false
    });

    // Prepare API CALLS
    this.getData(this.state.userInput);
  };

  /* =====================
  C. API CALL METHODS
  ====================== */

  /* C1. FUNCTION TO SET UP THE API CALLS AND MANAGE THEIR PROMISES */
  getData = ticker => {
    if (ticker.length === 0) {
      this.setState({
        loading: false
      });

      swal({
        type: "error",
        title: "No Input",
        text: "No input detected. Please submit a company ticker."
      });
      return;
    }

    this.setState({ searchDone: false, error: false });

    // store promises of API calls for profile and FS (both IS and BS)
    let profilePromise = this.getProfile(ticker);
    let isPromise = this.getFinancialStatements(ticker, "financials/income-statement/");
    let bsPromise = this.getFinancialStatements(ticker, "financials/balance-sheet-statement/");

    // wait for all 3 promises to be done before manipulating results
    Promise.all([profilePromise, isPromise, bsPromise])
      .then(res => {
        // set this to indicate that the search call has been completed
        this.setState({ searchDone: true, loading: false });

        // scroll to results
        scrollToElement(".results", { ease: "inSine", duration: 500 });

        // res[0] contains profile data, res[1] contains I/S data, res[2] contains B/S data
        this.storeProfileData(res[0]);
        this.storeFSData(res[1], "is");
        this.storeFSData(res[2], "bs");
      })
      .catch(error => {
        // scroll to results
        scrollToElement(".results", { ease: "inSine", duration: 500 });

        // if error 404 or page unreachable because company is not available on FMP
        if (error.response || error.request) {
          this.setState({ error: true, searchDone: true, loading: false });

          // alert to tell user that company data could not be found on FMP
          swal({
            type: "error",
            title: "Sorry!",
            text: "Data could not be retrieved for this company. Please search for another one."
          });
        }
        // else it's an unavailable FSLI error, which is okay, we will display the FS results as "No FS Found" and still display profile information
        else {
          this.setState({ searchDone: true });
        }
      });
  };

  /* C2. API CALL TO GET COMPANY GENERAL PROFILE INFORMATION */
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

  /* C3. API CALL TO GET FS DATA (EITHER BS OR IS) */
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

  /* =====================
  D. API RESULTS STORING/HANDLING METHODS
  ====================== */

  /* D1. STORE COMPANY PROFILE INFORMATION FROM API CALL */
  storeProfileData = res => {
    // Response data is in text. Remove <pre> tags to get proper format of JSON object. Parse into JSON for easier use.
    let jsonRes = JSON.parse(res.data.replace(/<pre>/g, ""))[this.state.userInput];

    jsonRes.ticker = this.state.userInput;

    this.setState({
      profileResult: jsonRes
    });
  };

  /* D2. STORE COMPANY FS INFORMATION FROM API CALL */
  storeFSData = (res, fsType) => {
    // Response data is in text. Remove <pre> tags to get proper format of JSON object. Parse into JSON for easier use.
    let jsonRes = JSON.parse(res.data.replace(/<pre>/g, ""));

    // create copy of this.state.fsResults and this.state.availableFSLIs
    let fsCopy = Object.assign({}, this.state.fsResults);
    let fsliCopy = Object.assign({}, this.state.availableFSLIs);

    // update the proper property depending on type of fs (I/s or B/S)
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

    // conditional for the first run (as the default FSLIS are I/S's items)
    if (fsType === "is") {
      let tempArr = [];

      // use underscore intersection to find similarities between default and available FSLIs
      let intersect = _.intersection(this.state.availableFSLIs[fsType], this.state.defaultFSLIs);

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
          let difference = _.difference(this.state.availableFSLIs[fsType], this.state.defaultFSLIs);
          tempArr.push(difference[n]);
          n++;
        }
      }

      this.setState({
        chosenFSLIs: tempArr
      });

      // prepare the arrays of objects for the results page
      this.prepareChosenFSLIsArr(fsType);
    }
  };

  /* D3. PREPARE THE CHOSEN FSLIS ARRAY FOR DISPLAY IN RESULTS AND FOR CHART JS */
  prepareChosenFSLIsArr = fsType => {
    let tempArr = [];
    let type = fsType;

    // loop through the array of chosen fslis strings in order to prepare the actual array of objects with the data
    for (let i = 0; i < this.state.chosenFSLIs.length; i++) {
      let currentIndex = this.state.chosenFSLIs[i];

      // conditional for when user changes fsli in options menu
      if (fsType === "is-fslis" || fsType === "bs-fslis") {
        for (let fsliType in this.state.availableFSLIs) {
          if (this.state.availableFSLIs[fsliType].indexOf(currentIndex) !== -1) {
            type = fsliType;
          }
        }
      }

      // make the object with the chosen fsli data
      let tempMap = Object.entries(this.state.fsResults[type][this.state.userInput][this.state.chosenFSLIs[i]]).map(
        ([key, value]) => ({
          key,
          value
        })
      );

      // Push object to clean array
      tempArr.push({
        fsli: this.state.chosenFSLIs[i],
        results: tempMap
      });
    }

    // Save cleaned up array of objects in state
    this.setState({
      chosenFSLIsArr: tempArr
    });
  };

  /* =====================
  E. RESULTS PAGE HANDLING METHODS
  ====================== */

  /* E1. LISTEN FOR ANY USER CHANGES IN THE SELECT TAGS FOR ANY OF THE 3 FSLIS */
  getUserFSLIChange = (event, index) => {
    let tempArr = this.state.chosenFSLIs;

    // change name of FSLI at the specific index in chosen FSLI state
    tempArr[index] = event.target.value;
    this.setState({ chosenFSLIs: tempArr, saved: false });

    // get optGroup value (either is or bs), need this for prepareChosenFSLIArr method
    let fsType = event.target.selectedOptions[0].parentNode.className;

    // re-update the ChosenFSLIsArr so page will update itself
    this.prepareChosenFSLIsArr(fsType);
  };

  /* =====================
  F. MISC METHODS
  ====================== */

  /* F1. FUNCTION TO RANDOMIZE 3 UNIQUE NUMBERS FOR GRAPH COLORS */
  getRandom3UniqueNumbers = number => {
    let arr = [];
    while (arr.length < 3) {
      let randomNumber = Math.floor(Math.random() * number);

      // make sure each numbers are unique
      if (arr.indexOf(randomNumber) === -1) {
        arr.push(randomNumber);
      }
    }
    return arr;
  };

  /* =====================
  COMPONENTDIDMOUNT
  ====================== */

  /* 1ST API CALL (IEX TRADING): GET LIST OF ALL COMPANY NAMES AND TICKER NUMBERS SO THAT USER CAN SEARCH THROUGH THEM*/
  componentDidMount() {
    // window.scrollTo(0, 1);
    axios.get("https://api.iextrading.com/1.0/ref-data/symbols").then(({ data }) => {
      let temporaryArr = [];
      // use regex to get rid of funds or other companies that don't necessarily have FS. namely, these include tickers that have "." or "-"
      let regex = RegExp("[.-=]");
      data.forEach(company => {
        if (company.name.length > 0 && regex.test(company.symbol) === false) {
          temporaryArr.push({
            ticker: company.symbol,
            name: company.name
          });
        }
      });

      // set list of available companies in state
      this.setState({
        companies: temporaryArr
      });
    });
  }
}

export default App;
