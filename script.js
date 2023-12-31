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

function track() {
  console.log('Tracking Sequence Initiated');
  if (linkid === 'VA6B640NP9') {
    database.ref('path/' + 'VA6B640NP9' + '/linkNickname').set('prestonkwei.com/links.html');
    updateClickCount('VA6B640NP9')   
    window.location.replace('https://prestonkwei.com/links.html')
  } else {
    window.location.href = 'https://prestonkwei.com';
  }
}
