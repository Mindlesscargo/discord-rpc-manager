/* eslint-disable no-unused-vars */
function saveClient () {
  console.log('test')
  const { ipcRenderer } = require('electron')
  const clientId = document.getElementById('clientinput').value
  ipcRenderer.send('settingsUpdate', clientId)
}
