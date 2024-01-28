/** @type {typeof import("./static.json")} */
const data = await fetch("/static.json").then(x=>x.json());

let version = data.version
// ENCRYPTION START
let passPhrase = data.key;
//
function encrypt(dataToEncrypt) {
  const passphrase = passPhrase;
  const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, passphrase).toString();
  return encrypted;
  console.log(encrypted)
}
function decrypt(apiKeyEncrypted) {
  const passphrase = passPhrase;
  const bytes = CryptoJS.AES.decrypt(apiKeyEncrypted, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

let aKey = decrypt('U2FsdGVkX19AdMXYimq+xA3o8rvbXSm0KRXPglcaP1l66JO9ZSqyA02jbxuLPnIC72iX+aEKCcOrjCKy018oOg==')
let aDomain = decrypt('U2FsdGVkX18pdCfYp6uooED7HgOJDJAw/KJ4yoO+4ts1iqHcTeVeTOiQo1TuadUADY1ikrUXVLOf2tXdqObJZQ==')
let dbUrl = decrypt('U2FsdGVkX1/e9GtMh+DAc8oTFCnLjwdBLo/YMWbzEay05BZ8Qf5S0Cd42YleAQIvgHepeFLyofQQa5QJ8kN9r1N0s5f0ynIJNnn0ggiCajs=')
let pId = decrypt('U2FsdGVkX1+JHmLCS3aCe6kbrFeYrz5LuhHwMYs7IKxgHhforG4Sa+lDZMqNFxNx')
let sBucket = decrypt('U2FsdGVkX1+ATuzFjMt6/VCzsvlfkNWmrIev3yQ29VouWODW2h2DtKy2eOFxzJKE')
let mSId = decrypt('U2FsdGVkX19D3zs5skhCkqR9sTNqs96ta0XiajXzfR0=')
let aId = decrypt('U2FsdGVkX1+DgFNMG9/Nk7we/5XcSQU1JAoyhj4eoQc=')
// ENCRYPTION END
const firebaseConfig = {
  apiKey: aKey,
  authDomain: aDomain,
  databaseURL: dbUrl,
  projectId: pId,
  storageBucket: sBucket,
  messagingSenderId: mSId,
  appId: aId
}
firebase.initializeApp(firebaseConfig);

let database = firebase.database();

function addDb(path, key, value) {
  let updates = {};
  updates[key] = value;
  firebase.database().ref(path).update(updates);
}

let startId = self.crypto.randomUUID();
console.log('sesid=' + startId);
document.getElementById('seshidhtml').innerHTML = 'Session ID: ' + startId + ' · LinkTrack · Version ' + version;

let urlPattern = /^(https?:\/\/)?([A-Za-z0-9]+\.)+[A-Za-z]{2,}$/;
document.getElementById('target').addEventListener('input', function() {
  let errorMsg = document.getElementById('error');
  
  if (this.value && !urlPattern.test(this.value)) {
    errorMsg.innerHTML = 'Must be a valid URL';
  } else if (value == null) {
    console.log('Blank')
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
function init() {
  console.log('LinkTrack (go.prestonkwei.com)')
  console.log(data)
  console.log('userIp: '+ createIp)
}
init()
let curTime = Date()
let urlid = 'https://go.prestonkwei.com/?id=' + startId;
function generateQR() {
  getUserIP()
  let value = document.querySelector('#target').value
  console.log(value)
  addDb(startId, 'redirectTo', value)
  addDb(startId, 'timestamp', curTime)
  addDb(startId, 'createIp', createIp)
  let qrImageUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(urlid)}&chs=160x160&chld=L|0`;
  document.getElementById('qrdiv').innerHTML = `<img id='htmlqr' src='${qrImageUrl}' alt='QR Code'>`;
  document.getElementById('uuidlinkdiv').innerHTML = `<p>You can also share this URL: <a target='blank_' href='${urlid}'>${urlid}</a>.</p>`;
}

export {}

//ENCRYPTED API: U2FsdGVkX19AdMXYimq+xA3o8rvbXSm0KRXPglcaP1l66JO9ZSqyA02jbxuLPnIC72iX+aEKCcOrjCKy018oOg==