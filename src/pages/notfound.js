import { initPage } from '../core/shell.js'
import { renderIcons } from '../components/icons.js'

const init = async () => { await initPage(); renderIcons() }
init()
