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
      let updated = clickCount+1
      console.log('clickCount for ' + linkId + ': ' + updated);
      clickCountRef.set(clickCount += 1);
    } else {
      console.log('clickCount for ' + linkId + ' is not set.');
      clickCountRef.set(1);
    }
  }, function(error) {
    console.error('Error reading click count: ', error);
  });
}
let keyValue = null
let redirection = null
async function checkDb(path, key) {
  const snapshot = await firebase.database().ref(path).once('value');

  if (snapshot.exists()) {
    let data = snapshot.val()
    keyValue = data[key]
    redirection = keyValue
    console.log(keyValue)
    return keyValue
  } else {
    // ADD A MODAL HERE THAT ALSO RELOADS THE PAGE
    console.log('No data available at path:', path)
  }
}
console.log(keyValue)
async function track() {
  console.log('Tracking Sequence Initiated');
  if (linkid != null && linkid.length <= 35) {
    console.log('RegEx with LinkTrack Detected')
    if (linkid === 'VA6B640NP9') {
      database.ref('path/' + 'VA6B640NP9' + '/linkNickname').set('prestonkwei.com/links.html')
      updateClickCount('VA6B640NP9')   
      window.location.replace('https://prestonkwei.com/links.html')
    } else if (linkid === 'food') {
      database.ref('path/' + 'food' + '/linkNickname').set('prestonkwei.com/comingsoon.html')
      updateClickCount('VA6B640NP9')   
      window.location.replace('https://prestonkwei.com/links.html')
    } 
  } else if (linkid.length > 35) {
    // QR CODE SEQUENCE:
    let identifier = linkid//.slice(3)
    console.log('LinkID= ' + identifier)
    let db = await checkDb(identifier, 'redirectTo')
    console.log('https://' + db)
    window.location.replace('https://' + db)
  } else {
    database.ref('path/' + 'FALLBACK' + '/linkNickname').set('null');
    updateClickCount('FALLBACK')   
    // window.location.href = 'https://prestonkwei.com';
    
  }
}

track()

export {}