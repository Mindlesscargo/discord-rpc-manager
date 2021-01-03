const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
require('v8-compile-cache')
let client

function createWindow () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  window.loadFile(path.join(__dirname, '/views/index.html'))
  window.resizable = false
  window.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  createWindow()
  createClient()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

global.settings = readConfig() || {}

global.config = {}

async function createClient () {
  if (!global.settings.clientId) {
    return idError()
  }
  client = require('discord-rich-presence')(global.settings.clientId)
}

ipcMain.on('submit', (event, args) => {
  global.config = args
})

ipcMain.on('update', () => {
  try {
    if (!global.settings.clientId) return idError()
    if (!client) createClient()
    client.updatePresence(global.config)
  } catch (err) {
    return console.log(err)
  }
})

ipcMain.on('stop', () => {
  if (client) {
    try {
      client.disconnect()
    } catch (err) {
      console.log(err)
    }
    client = null
  }
})

ipcMain.on('settingsUpdate', (event, args) => {
  global.settings.clientId = args
  writeConfig()
})

ipcMain.handle('settingsLoaded', (event, args) => {
  const result = readConfig()
  return result
})

ipcMain.handle('checkClient', (event, args) => {
  return client
})

function readConfig () {
  const config = fs.readFileSync('config.json')
  return JSON.parse(config)
}

function writeConfig () {
  fs.writeFileSync('config.json', JSON.stringify(global.settings))
}

function idError () {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Ok'],
    defaultId: 0,
    message: 'Error',
    detail: 'You must enter a client id in settings'
  })
  window.webContents.send('idError', '')
}
