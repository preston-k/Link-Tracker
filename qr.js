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
document.getElementById('seshidhtml').innerHTML = 'Session ID: ' + startId

document.getElementById('target').addEventListener('input', function() {
  var urlPattern = /^(https?:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  var errorMsg = document.getElementById('error');
  
  if (this.value && !urlPattern.test(this.value)) {
      errorMsg.innerHTML = 'Must be a valid URL';
  } else {
      errorMsg.innerHTML = '';
  }
});


let urlInput = document.querySelector('#target');

let urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
urlInput.addEventListener("input", () => {
  if (urlPattern.test(urlInput)) {
    console.log('QR CODE')
    generateQR()
  } else {
    console.log('NO QR CODE MADE')
  }
});

function generateQR() {
  let qrImageUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(urlInput.value)}&chs=160x160&chld=L|0`;
  document.getElementById('qrdiv').innerHTML = `<img src="${qrImageUrl}" alt="QR Code">`;
}
