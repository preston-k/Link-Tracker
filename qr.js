/** @type {typeof import("./static.json")} */
const data = await fetch("/static.json").then((x) => x.json());

let version = data.version;
import firebaseConfig from './firebase.js'
firebase.initializeApp(firebaseConfig);

let database = firebase.database();

function addDb(path, key, value) {
  let updates = {};
  updates[key] = value;
  firebase.database().ref(path).update(updates);
}

let startId = self.crypto.randomUUID();
console.log("sesid=" + startId);
document.getElementById("seshidhtml").innerHTML =
  "Session ID: " + startId + " · LinkTrack · Version " + version;

let urlPattern =
  /^(https?:\/\/)?([A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)+([A-Za-z0-9\-_~:/?#[\]@!$&'()*+,;=%])$/;

document.getElementById("target").addEventListener("input", function () {
  let errorMsg = document.getElementById("error");

  if (this.value && !urlPattern.test(this.value)) {
    errorMsg.innerHTML = "Must be a valid URL";
    // } else if (value == null) {
    //   console.log('Blank')
  } else {
      errorMsg.innerHTML = "";
      generateQR();
  }
});
let createIp = null;

function getUserIP() {
  var request = new XMLHttpRequest();
  request.open("GET", "https://api.ipify.org?format=json", false);
  try {
    request.send();
    if (request.status === 200) {
      createIp = JSON.parse(request.responseText).ip;
    } else {
      createIp = null;
    }
  } catch (e) {
    createIp = null;
  }
}
function init() {
  console.log("LinkTrack (go.prestonkwei.com)");
  console.log(data);
  console.log("userIp: " + createIp);
}
init();
let curTime = Date();
let urlid = "https://go.prestonkwei.com/?id=" + startId;
function generateQR() {
  getUserIP();
  let value = document.querySelector("#target").value;
  console.log(value);
  addDb(startId, "redirectTo", value);
  addDb(startId, "timestamp", curTime);
  addDb(startId, "createIp", createIp);
  let qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(urlid)}`
  document.getElementById("qrdiv").innerHTML = `<img id='htmlqr' src='${qrImageUrl}' alt='QR Code'>`;
  document.getElementById("uuidlinkdiv").innerHTML = `<p>You can also share this URL: <a target='blank_' href='${urlid}'>${urlid}</a></p>`;
}

export {};

//ENCRYPTED API: U2FsdGVkX19AdMXYimq+xA3o8rvbXSm0KRXPglcaP1l66JO9ZSqyA02jbxuLPnIC72iX+aEKCcOrjCKy018oOg==
