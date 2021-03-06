import React from 'react'
import Passwords from './Passwords'
import Random from './Random'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const themeDic = {
  light: createMuiTheme({
    palette: {
      type: 'light'
    }
  }),
  dark: createMuiTheme({
    palette: {
      type: 'dark'
    }
  })
}

export default class App extends React.Component {
  state = {
    code: '',
    theme: 'light'
  }

  componentDidMount () {
    window.utools.onPluginEnter(({ code, type, payload }) => {
      let theme
      if (window.utools.isDarkColors()) {
        theme = 'dark'
        document.body.className = 'dark-mode'
      } else {
        theme = 'light'
        document.body.className = null
      }
      this.setState({ code, theme })
    })
    window.utools.onPluginOut(() => {
      this.setState({ code: '' })
    })
  }

  render () {
    const { code, theme } = this.state
    if (code === 'passwords') return <ThemeProvider theme={themeDic[theme]}><Passwords /></ThemeProvider>
    if (code === 'random') return <ThemeProvider theme={themeDic[theme]}><Random /></ThemeProvider>
    return false
  }
}
