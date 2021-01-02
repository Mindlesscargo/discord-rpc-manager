/* eslint-disable no-unused-vars */
function changeMax () {
  document.getElementById('partySize').setAttribute('max', document.getElementById('partyLimit').value)
}

function submitClicked (data) {
  const { ipcRenderer } = require('electron')

  let config = {}

  const { detail, state, imageKeyOne, imageAltOne, partySize, partyLimit, timeCheckbox } = data.form
  const formdata = [detail.value, state.value, imageKeyOne.value, imageAltOne.value, parseInt(partySize.value), parseInt(partyLimit.value)]
  const keys = ['details', 'state', 'largeImageKey', 'largeImageAlt', 'partySize', 'partyMax']

  if (timeCheckbox.checked) {
    const startTime = new Date()
    config = { startTime }
  }

  for (let i = 0; i < keys.length; i++) {
    if (!formdata[i] || formdata[i].length < 2) {
      continue
    } else {
      config[keys[i]] = formdata[i]
    }
  }

  ipcRenderer.send('submit', config)
}

function updateRpc () {
  const { ipcRenderer } = require('electron')
  ipcRenderer.send('update')
}

function disconnectRpc () {
  const { ipcRenderer } = require('electron')
  ipcRenderer.send('stop')
}
