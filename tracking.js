/** @type {typeof import('./static.json')} */
const data = await fetch('/static.json').then((x) => x.json())

const version = data.version
function init() {
  console.log('LinkTrack (go.prestonkwei.com)')
  console.log(data)
}
init()
function modal() {
  let insidep = document.querySelector('#redirect')
  insidep.style.display = 'none'
  let myModal = new bootstrap.Modal(document.querySelector('#staticBackdrop'), {
    keyboard: false,
  })
  myModal.show()
}
import firebaseConfig from './firebase.js'
firebase.initializeApp(firebaseConfig)
function error() {
  console.log('Error')
}
let database = firebase.database()
let linkid = new URLSearchParams(window.location.search).get('id')
let ip, location
let created = false
async function loc(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json()
    location = data
    if (data.status === 'fail') {
      throw new Error(data.message || 'Failed to get location')
    }
    return data
  } catch (error) {
    console.error('Error looking up IP:', error)
    throw error
  }
}

await fetch('https://api.ipify.org')
  .then((res) => res.text())
  .then(async (data) => {
    ip = data
    console.log(ip)
    await loc(ip)
  })
async function updateCount(id, current) {
  database.ref(`/${id}/`).update({
    count: (current += 1),
  })
  let countId = self.crypto.randomUUID()
  let ts = Date.now()
  database.ref(`/${id}/counts/${ts}/`).update({
    id: countId,
    ts: ts,
    exact: new Date(),
    ip: ip,
  })
}
console.log(linkid)
if (linkid == '' || linkid == null) {
  modal()
} else {
  database
    .ref(`/${linkid}/`)
    .once('value')
    .then(async (snapshot) => {
      console.log(snapshot.val())
      let data = snapshot.val()
      console.log(data.count)

      await updateCount(linkid, data.count)
      const email = new FormData()
      email.set('sendto', 'prestonkwei@gmail.com')
      email.set('from', 'linktrack-noreply@e.prestonkwei.com')
      email.set('subject', 'Your link has been clicked!')
      email.set('content', `Hi!\n\nLink Target: ${data.target}\n\nts: ${new Date()}\n\nip: ${ip}\n\nloc info:${location}\n\n-----\ncurrent: ${data.count} / new: ${data.count + 1}\n\nhttps://go.prestonkwei.com/?id=${linkid}`)
      await fetch('https://emailserver.prestonkwei.com/email', {
        method: 'post',
        body: email,
      }).catch(() => {})
      window.location.replace(data.target)
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
      modal()
    })
}
