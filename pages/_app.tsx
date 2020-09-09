import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/styles"
import withRedux from "next-redux-wrapper"
import App from "next/app"
import React from "react"
import io from 'socket.io-client'
import { Provider } from "react-redux"
import { MuiTheme } from "../components/MuiTheme"
import { configureStore } from "../store/configureStore"

type Props = {
  Component: React.Component
  store: any
}

/**
 * @see https://github.com/mui-org/material-ui/blob/master/examples/nextjs-with-typescript/pages/_app.tsx
 */
class MyApp extends App<Props> {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return { pageProps: pageProps }
  }

  state = {
    socket: null,
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
    // connect to Websockets server and listen for events
    const socket = io("http://localhost:8080")
    this.setState({ socket })
  }

  // close socket connection
  componentWillUnmount() {
    this.state.socket.close()
  }

  render() {
    const { store, Component, pageProps } = this.props

    return (
      <Provider store={store}>
        <ThemeProvider theme={MuiTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} socket={this.state.socket} />
        </ThemeProvider>
      </Provider>
    )
  }
}

export default withRedux(configureStore())(MyApp)
