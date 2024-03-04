import IMask from 'imask'
import PluginMask from './plugin'

export default (options) => {
  return PluginMask(options, IMask)
}