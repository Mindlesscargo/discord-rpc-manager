const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
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
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

global.settings = {
  cliendId: '453758255336914956'
}

global.config = {}

function createClient () {
  client = require('discord-rich-presence')(global.settings.cliendId)
}

ipcMain.on('submit', (event, args) => {
  global.config = args
})

ipcMain.on('update', () => {
  try {
    if (!client) createClient()
    client.updatePresence(global.config)
  } catch (err) {
    window.alert(err)
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

createClient()
