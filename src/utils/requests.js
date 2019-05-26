import axios from "axios";

const Utils = {
  // GET LIST OF ALL COMPANY NAMES AND TICKER NUMBERS SO THAT USER CAN SEARCH THROUGH THEM
  getAllCompanies: () => {
    return axios.get("https://api.iextrading.com/1.0/ref-data/symbols");
  },
  // GET COMPANY GENERAL PROFILE INFORMATION
  getProfile: ticker => {
    let url = `https://financialmodelingprep.com/api/company/profile/${ticker}`;
    return axios({
      method: "GET",
      url: "https://proxy.hackeryou.com",
      dataResponse: "jsonp",
      params: {
        reqUrl: url
      }
    });
  },
  // GET FS DATA (EITHER BS OR FS)
  getFinancialStatements: (ticker, fs) => {
    const url = `https://financialmodelingprep.com/api/${fs}${ticker}`;
    return axios({
      method: "GET",
      url: "https://proxy.hackeryou.com",
      dataResponse: "jsonp",
      params: {
        reqUrl: url
      }
    });
  }
}

export default Utils;