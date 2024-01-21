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

function init() {
  
}
let startId = self.crypto.randomUUID()
console.log('sesid='+startId)
document.getElementById('seshidhtml').innerHTML = 'Session ID: ' + startId + /* Static info here to be shown at the footer --> */' · LinkTrack · Version 1.0.0 BETA'

document.getElementById('target').addEventListener('input', function() {
  let urlPattern = /(https?:\/\/)?([(A-z|0-9)]+\.)+([?:A-z]+)$/g
  let errorMsg = document.getElementById('error');
  
  if (this.value && !urlPattern.test(this.value)) {
      errorMsg.innerHTML = 'Must be a valid URL';
  } else {
      errorMsg.innerHTML = '';
  }
});


let urlInput = document.querySelector('#target');

let urlPattern = /(https?:\/\/)?([(A-z|0-9)]+\.)+([?:A-z]+)$/g
urlInput.addEventListener("input", () => {
  if (urlPattern.test(urlInput.value)) {
    console.log('QR CODE')
    generateQR()
  } else {
    console.log('NO QR CODE MADE')
  }
});
let urlid = 'https://go.prestonkwei.com/?id=' + startId 
function generateQR() {
  let qrImageUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(urlid)}&chs=160x160&chld=L|0`;
  document.getElementById('qrdiv').innerHTML = `<img id='htmlqr' src='${qrImageUrl}' alt='QR Code'>`;
  document.getElementById('uuidlinkdiv').innerHTML = `<p>You can also share this URL: <a target='blank_' href='${urlid}'>${urlid}</a>.</p>`;
}
