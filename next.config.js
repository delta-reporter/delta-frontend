const withCSS = require("@zeit/next-css")

module.exports = withCSS({
    target: 'serverless',
    env: {
      deltaCore: process.env.DELTA_CORE_URL,
      publicDeltaCore: process.env.PUBLIC_DELTA_CORE_URL,
      publicDeltaWebsockets: process.env.PUBLIC_DELTA_WEBSOCKETS_URL,
    },
  })
