'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

// for auto reloading in dev env
// require('electron-reload')(__dirname)

const path = require('path')
const url = require('url')

// Main window
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      // nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // use index.html as main page
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // invoke dev tools
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'develop') {
    mainWindow.webContents.openDevTools()
  }

  // window is closed
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}


//  app is ready
app.on('ready', createWindow)

// all windows are closed
app.on('window-all-closed', function () {
  // macOSのとき以外はアプリケーションを終了させます
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// application is activated. [Mac] The dock icon is clicked.
app.on('activate', function () {
  // when we dont have main window, create it.
  if (mainWindow === null) {
    createWindow()
  }
})
