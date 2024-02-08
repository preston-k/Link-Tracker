

/** @type {typeof import("./static.json")} */
const data = await fetch("/static.json").then((x) => x.json());

const version = data.version;
function init() {
  console.log("LinkTrack (go.prestonkwei.com)");
  console.log(data);
}
init();
function modal() {
  let insidep = document.getElementById("redirect");
  insidep.style.display = "none";
  let myModal = new bootstrap.Modal(document.getElementById("staticBackdrop"), {
    keyboard: false,
  })
  myModal.show()
}
let block = ['bonzi.link', '17ebook.com', 'aladel.net', 'bpwhamburgorchardpark.org', 'clicnews.com', 'dfwdiesel.net', 'divineenterprises.net', 'fantasticfilms.ru', 'gardensrestaurantandcatering.com', 'ginedis.com', 'gncr.org', 'hdvideoforums.org', 'hihanin.com', 'kingfamilyphotoalbum.com', 'likaraoke.com', 'mactep.org', 'magic4you.nu', 'marbling.pe.kr', 'nacjalneg.info', 'pronline.ru', 'purplehoodie.com', 'qsng.cn', 'seksburada.net', 'sportsmansclub.net', 'stock888.cn', 'tathli.com', 'teamclouds.com', 'texaswhitetailfever.com', 'wadefamilytree.org', 'xnescat.info', 'yt118.com']

const firebaseConfig = {
  apiKey: "AIzaSyCv6apHJVxUphcDWr2ga5ip4Mk1v72nB4s",
  authDomain: "link-track-2a944.firebaseapp.com",
  databaseURL: "https://link-track-2a944-default-rtdb.firebaseio.com",
  projectId: "link-track-2a944",
  storageBucket: "link-track-2a944.appspot.com",
  messagingSenderId: "1067163047529",
  appId: "1:1067163047529:web:79f3892f00e8e5e95974f8",
};
firebase.initializeApp(firebaseConfig);

let database = firebase.database();
let linkid = new URLSearchParams(window.location.search).get("id");

function updateClickCount(linkId) {
  let clickCountRef = database.ref("path/" + linkId + "/clickCount");

  clickCountRef.once(
    "value",
    function (snapshot) {
      let clickCount = snapshot.val();
      if (clickCount !== null) {
        let updated = clickCount + 1;
        console.log("clickCount for " + linkId + ": " + updated);
        clickCountRef.set((clickCount += 1));
      } else {
        console.log("clickCount for " + linkId + " is not set.");
        clickCountRef.set(1);
      }
    },
    function (error) {
      console.error("Error reading click count: ", error);
    }
  );
}
let dbPath = "";
let keyValue = null;
let redirection = null;
let pathValid = false;
async function checkDb(path, key) {
  const snapshot = await firebase.database().ref(path).once("value");

  if (snapshot.exists()) {
    let data = snapshot.val();
    keyValue = data[key];
    redirection = keyValue;
    console.log(keyValue);
    return keyValue;
  } else {
    modal();
    dbPath = path;
    let pathValid = false;
    console.log("No data available at path:", dbPath);
  }
}
function redirect() {
  window.confirm('You may have clicked on a malicious link! Are you sure you want to go here?\n\nThis link will redirect you to: '+db)
}
console.log(dbPath);
async function track() {
  console.log("Tracking Sequence Initiated");
  if (linkid != null) {
    // modal()
    if (linkid.length <= 35) {
      console.log("RegEx with LinkTrack Detected");
      if (linkid === "VA6B640NP9") {
        database
          .ref("path/" + "VA6B640NP9" + "/linkNickname")
          .set("prestonkwei.com/links.html");
        updateClickCount("VA6B640NP9");
        window.location.replace("https://prestonkwei.com/links.html");
      } else if (linkid === "food") {
        database
          .ref("path/" + "food" + "/linkNickname")
          .set("prestonkwei.com/comingsoon.html");
        updateClickCount("VA6B640NP9");
        window.location.replace("https://prestonkwei.com/links.html");
      } else {
        // if it is under 35 chars and not any of these links
        modal();
      }
    } else if (linkid.length > 35) {
      // QR CODE SEQUENCE:
      let identifier = linkid; //.slice(3)
      let db = await checkDb(identifier, "redirectTo");
      if ((dbPath = null)) {
        modal();
      } else {
        console.log("https://" + db);
        if (db.startsWith('https://') == true) {
          db = db.slice(8)
          if (block.some(x => db.includes(x))) {
            alert('You may have clicked on a malicious link! Are you sure you want to go here?\n\nThis link will redirect you to: '+db+'\n\nIf you do not want to proceed, reload this page.')
            window.location.replace("https://" + db);
          } else {
            window.location.replace("https://" + db);
          }
        } else if (db.startsWith('http://') == true) {
          db = db.slice(7)
          if (block.some(x => db.includes(x))) {
            alert('You may have clicked on a malicious link! Are you sure you want to go here?\n\nThis link will redirect you to: '+db+'\n\nIf you do not want to proceed, reload this page.')
            window.location.replace("https://" + db);
          } else {
            window.location.replace("https://" + db);
          }
        } else {
          if (block.some(x => db.includes(x))) {
            alert('You may have clicked on a malicious link! Are you sure you want to go here?\n\nThis link will redirect you to: '+db+'\n\nIf you do not want to proceed, reload this page.')
            window.location.replace("https://" + db);
          } else {
            window.location.replace("https://" + db);
          }
        }
      }
    } else {
      database.ref("path/" + "FALLBACK" + "/linkNickname").set("null");
      updateClickCount("FALLBACK");
      // window.location.href = 'https://prestonkwei.com';
    }
  } else {
    modal();
    console.log("Null or Not Found");
  }
}

track();

export {};
