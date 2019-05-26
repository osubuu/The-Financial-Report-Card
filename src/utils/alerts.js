import swal from "sweetalert2";

const Utils = {
  wrongSnapshotKey: () => {
    return swal({
      type: "question",
      title: "Invalid Key",
      text: `You seem to have submitted the wrong key. Please make sure you've included all the characters. Keys begin with "-LL...."`
    });
  },
  snapshotKeyCreated: (key) => {
    console.log(key);
    return swal({
      type: "success",
      title: "SAVED!",
      html: `Use the following key to access this exact snapshot again:<br><br><strong>${key}</strong>`
    });
  },
  noTickerSubmitted: () => {
    return swal({
      type: "error",
      title: "No Input",
      text: "No input detected. Please submit a company ticker."
    });
  },
  dataNotFound: () => {
    // data could not be found on FMP
    return swal({
      type: "error",
      title: "Sorry!",
      text: "Data could not be retrieved for this company. Please search for another one."
    });
  }
}

export default Utils;