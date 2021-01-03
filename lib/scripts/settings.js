/* eslint-disable no-unused-vars */
function saveClient () {
  const { ipcRenderer } = require('electron')
  const clientId = document.getElementById('clientinput').value
  ipcRenderer.send('settingsUpdate', clientId)
}

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  ipcRenderer.invoke('settingsLoaded').then(({ clientId }) => {
    document.getElementById('clientinput').value = clientId
  })
})
