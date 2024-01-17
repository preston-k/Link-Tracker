function generateQR(url) {
  let qrImageUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(url)}&chs=160x160&chld=L|0`;
  document.getElementById('qrdiv').innerHTML = `<img src="${qrImageUrl}" alt="QR Code">`;
}
