/* eslint-disable no-unused-vars */
function changeMax () {
  document.getElementById('partySize').setAttribute('max', document.getElementById('partyLimit').value)
}

function submitClicked (data) {
  const { ipcRenderer, ipcMain } = require('electron')

  const config = {}

  const { detail, state, imageKeyOne, imageAltOne, imageKeyTwo, imageAltTwo, partySize, partyLimit, timeCheckbox, buttonOneText, buttonOneUrl, buttonTwoText, buttonTwoUrl } = data.form

  const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  const regex = new RegExp(expression)

  const buttons = [{ label: buttonOneText.value, url: buttonOneUrl.value }, { label: buttonTwoText.value, url: buttonTwoUrl.value }]
  for (let i = 0; i < buttons.length; i++) {
    if (!buttons[i].label || !buttons[i].url || !buttons[i].url.match(regex)) {
      buttons.splice(i, 1)
      i--
    }
  }

  const formdata = [detail.value, state.value, imageKeyOne.value, imageAltOne.value, imageKeyTwo.value, imageAltTwo.value, parseInt(partySize.value), parseInt(partyLimit.value), (timeCheckbox.checked ? new Date() : null), buttons]
  const keys = ['details', 'state', 'largeImageKey', 'largeImageText', 'smallImageKey', 'smallImageText', 'partySize', 'partyMax', 'startTimestamp', 'buttons']

  for (let i = 0; i < keys.length; i++) {
    if (!formdata[i] || (typeof formdata[i] === 'string' && formdata[i].length < 2) || formdata[i].length < 1) {
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

window.addEventListener('load', () => {
  const { ipcRenderer } = require('electron')
  ipcRenderer.invoke('checkClient').then((response) => {
    if (response) document.getElementById('disconnect').disabled = false
  })
})
