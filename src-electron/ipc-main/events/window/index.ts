import mainWindow from '../../../windows/main'
import { getPlatform } from '../../../constants/os'
const sendMessage = (type: string) => {
  if(mainWindow.target !== null) {
    mainWindow.target.webContents.send(type)
  }
}

const registerEvents = () => {
  if(mainWindow.target === null) {
    return
  }

  mainWindow.target.on('maximize', () => {
    sendMessage("maximize_main")
  })
  
  mainWindow.target.on('minimize', () => {
    sendMessage("minimize_main")
  })
  
  mainWindow.target.on('unmaximize', () => {
    sendMessage("restore_main")
  })

  mainWindow.target.on('focus', () => {
    sendMessage("focus_main")
  })

  mainWindow.target.on('blur', () => {
    sendMessage("blur_main")
  })

  mainWindow.target.on('close', () => {
    sendMessage("close_main")
  })

  mainWindow.target.on('ready-to-show', () => {
    if(mainWindow.target !== null) {
      mainWindow.target.webContents.send('ready_main', {
        platform: getPlatform(),
        isMaximized: mainWindow.target.isMaximized(),
        isFocused: mainWindow.target.isFocused()
      })
    }
  })
}

export default registerEvents