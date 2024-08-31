/** @type {typeof import('./static.json')} */
const data = await fetch('/static.json').then((x) => x.json());

const version = data.version;
function init() {
  console.log('LinkTrack (go.prestonkwei.com)');
  console.log(data);
}
init();
function modal() {
  let insidep = document.querySelector('#redirect');
  insidep.style.display = 'none';
  let myModal = new bootstrap.Modal(document.querySelector('#staticBackdrop'), {
    keyboard: false,
  })
  myModal.show()
}
import firebaseConfig from './firebase.js'
firebase.initializeApp(firebaseConfig)

let database = firebase.database();
let linkid = new URLSearchParams(window.location.search).get('id')
let ip 
let created = false
fetch('https://api.ipify.org')
  .then(res => res.text())
  .then(data => {
    ip = data
})
async function updateCount(id, current) {
  database.ref(`/${id}/`).update({
    count: current += 1
  })
  let countId = self.crypto.randomUUID()
  let ts = Date.now()
  database.ref(`/${id}/counts/${ts}/`).update({
    id: countId,
    ts: ts,
    exact: new Date(),
    ip: ip
  })
}
console.log(linkid)
if (linkid == '' || linkid == null) {
  modal()
} else {
  database.ref(`/${linkid}/`).once('value').then(async (snapshot) => {
    console.log(snapshot.val())
    let data = snapshot.val()
    console.log(data.count)
    await updateCount(linkid, data.count)
    window.location.replace(data.target)
  })
}