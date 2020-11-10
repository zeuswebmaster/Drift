
const {app, BrowserWindow, ipcMain} = require('electron')

const path = require('path');
const url = require('url');

const Server = require('electron-rpc/server');
const server = new Server();

let mainWindow;
let win = [];


function createMainWindow () {

  mainWindow = new BrowserWindow({width: 768, height: 1024, minWidth: 600, autoHideMenuBar: false})


  mainWindow.loadFile('./src/app/index.html')


  server.configure(mainWindow.webContents);//kate

  server.on("change_position", (err, body) => {//kate
      console.log(err);                           //kate
      console.log(body);                        //kate
  })


  mainWindow.on('closed', function () {

    mainWindow = null
  })
}

app.on('ready', createMainWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createMainWindow()
  }
})

function createWindow(htmlPath, options = {}) {
  let newWin = new BrowserWindow(Object.assign(
    {
      show: false,
      autoHideMenuBar: true,
    },
    options,
  ));

  newWin.once('ready-to-show', () => {
    newWin.show();
  });

  newWin.loadURL(url.format({
    pathname: path.join(__dirname, htmlPath),
    protocol: 'file',
    slashes: true,

  }));

  newWin.on('closed', () => {
    newWin = null;
  });

  return newWin;
}

ipcMain.on('SHOW_MACHINE', () => {
  

  win.push(createWindow('./src/childwin/machine/index.html', {

    width: 768,
    height: 1024,
    autoHideMenuBar: true,

  }));
  
});

