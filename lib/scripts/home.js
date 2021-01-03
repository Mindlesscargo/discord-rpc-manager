/* eslint-disable no-unused-vars */
function changeMax () {
  document.getElementById('partySize').setAttribute('max', document.getElementById('partyLimit').value)
}

function submitClicked (data) {
  const { ipcRenderer } = require('electron')

  const config = {}

  const { detail, state, imageKeyOne, imageAltOne, imageKeyTwo, imageAltTwo, partySize, partyLimit, timeCheckbox } = data.form
  const formdata = [detail.value, state.value, imageKeyOne.value, imageAltOne.value, imageKeyTwo.value, imageAltTwo.value, parseInt(partySize.value), parseInt(partyLimit.value), (timeCheckbox.checked ? new Date() : null)]
  const keys = ['details', 'state', 'largeImageKey', 'largeImageText', 'smallImageKey', 'smallImageText', 'partySize', 'partyMax', 'startTimestamp']

  for (let i = 0; i < keys.length; i++) {
    if (!formdata[i] || formdata[i].length < 2) {
      continue
    } else {
      config[keys[i]] = formdata[i]
    }
  }

  ipcRenderer.send('submit', config)
  updatePreview(config)
}

function updateRpc () {
  const { ipcRenderer } = require('electron')
  ipcRenderer.send('update')
  document.getElementById('disconnect').disabled = false
}

function disconnectRpc () {
  const { ipcRenderer } = require('electron')
  ipcRenderer.send('stop')
  document.getElementById('disconnect').disabled = true
}

function updatePreview (config) {
  document.getElementById('previewdetails').innerHTML = config.details || ''
  document.getElementById('previewstate').innerHTML = config.state || ''
  if (!config.partySize || !config.partyMax || !config.state) {
    document.getElementById('party').innerHTML = ''
  } else {
    console.log(false)
    document.getElementById('party').innerHTML = `(${config.partySize} of ${config.partyMax})`
  }
  document.getElementById('time').style.visibility = config.startTimestamp && config.state ? 'visible' : 'hidden'
}
