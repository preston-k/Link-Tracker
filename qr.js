const firebaseConfig = {
  apiKey: "AIzaSyCv6apHJVxUphcDWr2ga5ip4Mk1v72nB4s",
  authDomain: "link-track-2a944.firebaseapp.com",
  databaseURL: "https://link-track-2a944-default-rtdb.firebaseio.com",
  projectId: "link-track-2a944",
  storageBucket: "link-track-2a944.appspot.com",
  messagingSenderId: "1067163047529",
  appId: "1:1067163047529:web:79f3892f00e8e5e95974f8"
};
firebase.initializeApp(firebaseConfig);

let database = firebase.database();

function updateDb(userPath, userKey, userValue) {
  let updateObject = {};
  updateObject[userKey] = userValue;
  firebase.database().ref(userPath).update(updateObject);
}

function addDb(path, key, value) {
  let updates = {};
  updates[key] = value;
  firebase.database().ref(path).update(updates);
}

let startId = self.crypto.randomUUID();
console.log('sesid=' + startId);
document.getElementById('seshidhtml').innerHTML = 'Session ID: ' + startId + ' · LinkTrack · Version 1.3.5';

let urlPattern = /^(https?:\/\/)?([A-Za-z0-9]+\.)+[A-Za-z]{2,}$/;
document.getElementById('target').addEventListener('input', function() {
  let errorMsg = document.getElementById('error');
  
  if (this.value && !urlPattern.test(this.value)) {
    errorMsg.innerHTML = 'Must be a valid URL';
  } else {
    errorMsg.innerHTML = '';
    generateQR();
  }
});
let createIp = null; 

function getUserIP() {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.ipify.org?format=json', false);
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

let curTime = Date()
let urlid = 'https://go.prestonkwei.com/?id=' + startId;
function generateQR() {
  getUserIP()
  let value = document.querySelector('#target').value
  console.log(value)
  updateDb(startId, 'redirectTo', value)
  addDb(startId, 'timestamp', curTime)
  addDb(startId, 'createIp', createIp)
  let qrImageUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(urlid)}&chs=160x160&chld=L|0`;
  document.getElementById('qrdiv').innerHTML = `<img id='htmlqr' src='${qrImageUrl}' alt='QR Code'>`;
  document.getElementById('uuidlinkdiv').innerHTML = `<p>You can also share this URL: <a target='blank_' href='${urlid}'>${urlid}</a>.</p>`;
}
