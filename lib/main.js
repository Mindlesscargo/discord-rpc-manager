const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

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

const client = require('discord-rich-presence')(global.settings.cliendId)

ipcMain.on('submit', (event, args) => {
  global.config = args
})

// eslint-disable-next-line no-unused-vars
ipcMain.on('update', () => {
  client.updatePresence(global.config)
})
