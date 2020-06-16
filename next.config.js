const withCSS = require("@zeit/next-css")

module.exports = withCSS({
    target: 'serverless',
    env: {
      deltaCore: process.env.DELTA_CORE_URL, // getting these env vars from docker-compose
    },
  })
