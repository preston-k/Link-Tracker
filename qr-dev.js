/** @type {typeof import('./static.json')} */
const data = await fetch('/static.json').then((x) => x.json())

let version = data.version
import firebaseConfig from './firebase.js'
firebase.initializeApp(firebaseConfig)

let database = firebase.database()
let startId = self.crypto.randomUUID()
// console.log('sesid=' + startId)
document.getElementById('seshidhtml').innerHTML = 'Session ID: ' + startId + ' · LinkTrack · Version ' + version
document.querySelector('#qrform').addEventListener('submit', (event) => {
  event.preventDefault()
})
let ip 
fetch('https://api.ipify.org')
  .then(res => res.text())
  .then(data => {
    ip = data
})

async function set(target) {
  console.log(target)
  database.ref(`/${startId}/`).update({
    target: target,
    ts: new Date(),
    createIp: ip,
    count: 0,
    id: startId,
    pw: false
  })
  document.querySelector('#pwhint').style.display = 'block'
  document.querySelector('#pw').style.display = 'block'
  let qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://go.prestonkwei.com/?id=${startId}`)}`
  document.getElementById('qrdiv').innerHTML = `<img id='htmlqr' src='${qrImageUrl}' alt='QR Code'>`
  document.getElementById('uuidlinkdiv').innerHTML = `<p>You can also share this URL: <a target='blank_' href='https://go.prestonkwei.com/?id=${startId}'>https://go.prestonkwei.com/?id=${startId}</a></p>`
}
document.querySelector('#target').addEventListener('change', () => {
  let target = document.querySelector('#target').value
  try {
    new URL(target)
    set(target)
  } catch (_) {
      document.querySelector('#error').innerHTML = 'Must be a valid URL'
  }
})

document.querySelector('#pw').addEventListener('change', async () => {
  let pw = document.querySelector('#pw').value
  console.log(pw)
  let hashed
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))
  hashed = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  console.log({pw: true,
    pass: hashed})
  database.ref(`/${startId}/`).update({
    pw: true,
    pass: hashed
  })
})