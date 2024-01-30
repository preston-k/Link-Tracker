/** @type {typeof import("./static.json")} */
const data = await fetch("/static.json").then(x=>x.json());

const version = data.version
function init() {
  console.log('LinkTrack (go.prestonkwei.com)')
  console.log(data)
}
init()
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
let linkid = new URLSearchParams(window.location.search).get('id'); 

function updateClickCount(linkId) {
  let clickCountRef = database.ref('path/' + linkId + '/clickCount');

  clickCountRef.once('value', function(snapshot) {
    let clickCount = snapshot.val();
    if (clickCount !== null) {
      console.log('clickCount for ' + linkId + ': ' + clickCount);
      clickCountRef.set(clickCount += 1);
    } else {
      console.log('clickCount for ' + linkId + ' is not set.');
      clickCountRef.set(1);
    }
  }, function(error) {
    console.error('Error reading click count: ', error);
  });
}
let keyvalue = null
let redirection = null
function checkDb(path, key) {
  firebase.database().ref(path).once('value').then((snapshot) => {
    if (snapshot.exists()) {
      let data = snapshot.val()
      keyValue = data[key]
      redirection = keyvalue
      console.log(keyValue)
    } else {
      console.log('No data available at path:', path)
    }
  }).catch((error) => {
    console.error(error);
  });
}

function track() {
  console.log('Tracking Sequence Initiated');
  if (linkid != null && linkid.length <= 35) {
    console.log('RegEx with LinkTrack Detected')
    if (linkid === 'VA6B640NP9') {
      database.ref('path/' + 'VA6B640NP9' + '/linkNickname').set('prestonkwei.com/links.html')
      updateClickCount('VA6B640NP9')   
      // window.location.replace('https://prestonkwei.com/links.html')
    } else if (linkid === 'food') {
      database.ref('path/' + 'food' + '/linkNickname').set('prestonkwei.com/comingsoon.html')
      updateClickCount('VA6B640NP9')   
      // window.location.replace('https://prestonkwei.com/links.html')
    } 
  } else if (linkid.length == 36) {
    // QR CODE SEQUENCE:

    console.log('36 Char RegEx Detected')
    console.log('LinkID= ' + linkid)
    checkDb(linkid, 'redirectTo')
    console.log(redirection)
    // window.location.replace('https://' + redirection)
  } else {
    database.ref('path/' + 'FALLBACK' + '/linkNickname').set('null');
    updateClickCount('FALLBACK')   
    // window.location.href = 'https://prestonkwei.com';
    
  }
}

track()

export {}