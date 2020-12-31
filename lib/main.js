const { app, BrowserWindow } = require('electron')
const path = require('path')
const DiscordRPC = require('discord-rpc')

const rpc = new DiscordRPC.Client({
  transport: 'ipc'
})

function createWindow () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  window.loadFile(path.join(__dirname, '/views/index.html'))
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
