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
let ip, location, locdata
let created = false
async function loc(ip) {
  try {
    const response = await fetch(`https://ipwho.is/${ip}`)
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Failed to get location')
    }
    location = JSON.stringify(data)
    locdata = data
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

      email.set(
        'html',
        `
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style='font-family: system-ui, sans-serif; background-color: #63D471; margin: 0; padding: 20px;'>
  <table width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color: #63D471; padding: 20px;'>
    <tr>
      <td align='center'>
        <table width='600' cellspacing='0' cellpadding='20' border='0' style='background-color: white; border-radius: 8px;'>
          <tr>
            <td style='font-size: 14px; line-height: 1;'>
              <p style='font-weight: 800;'>Your link has just been clicked!</p>
              <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                <tr>
                  <td>
                    <p><span style='font-weight: 800;'>Target:</span> ${data.target}</p>
                    <p><span style='font-weight: 800;'>Timestamp:</span> ${new Date()}</p>
                    <p><span style='font-weight: 800;'>IP Address:</span> ${ip}</p>
                  </td>
                </tr>
                <tr>
                  <td valign='top' style='width: 50%;'>
                    <p><span style='font-weight: 800;'>Type:</span> ${locdata.type}</p>
                    <p><span style='font-weight: 800;'>Continent:</span> ${locdata.continent}</p>
                    <p><span style='font-weight: 800;'>Continent Code:</span> ${locdata.continent_code}</p>
                    <p><span style='font-weight: 800;'>Country:</span> ${locdata.country}</p>
                    <p><span style='font-weight: 800;'>Country Code:</span> ${locdata.country_code}</p>
                    <p><span style='font-weight: 800;'>Region:</span> ${locdata.region}</p>
                    <p><span style='font-weight: 800;'>Region Code:</span> ${locdata.region_code}</p>
                    <p><span style='font-weight: 800;'>City:</span> ${locdata.city}</p>
                    <p><span style='font-weight: 800;'>Postal:</span> ${locdata.postal}</p>
                    <p><span style='font-weight: 800;'>Latitude:</span> ${locdata.latitude}</p>
                    <p><span style='font-weight: 800;'>Longitude:</span> ${locdata.longitude}</p>
                    <p><span style='font-weight: 800;'>Is EU:</span> ${locdata.is_eu}</p>
                    <p><span style='font-weight: 800;'>Calling Code:</span> +${locdata.calling_code}</p>
                    <p><span style='font-weight: 800;'>Capital:</span> ${locdata.capital}</p>
                  </td>
                  <td valign='top' style='width: 50%;'>
                    <p><span style='font-weight: 800;'>ASN:</span> ${locdata.connection.asn}</p>
                    <p><span style='font-weight: 800;'>Organization:</span> ${locdata.connection.org}</p>
                    <p><span style='font-weight: 800;'>ISP:</span> ${locdata.connection.isp}</p>
                    <p><span style='font-weight: 800;'>Domain:</span> ${locdata.connection.domain}</p>
                    <p><span style='font-weight: 800;'>Timezone ID:</span> ${locdata.timezone.id}</p>
                    <p><span style='font-weight: 800;'>Timezone Abbreviation:</span> ${locdata.timezone.abbr}</p>
                    <p><span style='font-weight: 800;'>Is DST:</span> ${locdata.timezone.is_dst}</p>
                    <p><span style='font-weight: 800;'>Offset:</span> ${locdata.timezone.offset}</p>
                    <p><span style='font-weight: 800;'>UTC:</span> ${locdata.timezone.utc}</p>
                    <p><span style='font-weight: 800;'>Current Time:</span> ${locdata.timezone.current_time}</p>
                    <p><span style='font-weight: 800;'>Borders:</span> ${locdata.borders}</p>
                    <p><span style='font-weight: 800;'>Flag Emoji:</span> ${locdata.flag.emoji}</p>
                    <p><span style='font-weight: 800;'>Flag Emoji Unicode:</span> ${locdata.flag.emoji_unicode}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style='font-size: 14px; line-height: 1; border: 1px solid black; border-left: 0 solid black; border-right: 0 solid black; margin: 0 10px;'>
              <p><span style='font-weight: 800;'>past:</span> ${data.count} / <span style='font-weight: 800;'>new:</span> ${data.count + 1}</p>
              <p>Aa -><a href='https://go.prestonkwei.com/?id=${linkid}'>/go.prestonkwei.com/?id=${linkid}</a></p>
            </td>
          </tr>
          <tr>
            <td style='font-family: system-ui, sans-serif; font-size: 10px; text-align: center;'>
              <hr>
              <p>Made with ❤️ by <a href='https://prestonkwei.com'>Preston Kwei</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `
      )
      await fetch('https://emailserver.prestonkwei.com/email', {
        method: 'post',
        body: email,
      }).catch(() => {})
      // NOTHING ELSE BELOW
      window.location.replace(data.target)
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
      modal()
    })
}
