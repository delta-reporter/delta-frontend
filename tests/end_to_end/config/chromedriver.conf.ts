import { baseConfig as config } from "./base.conf"
const DeltaService = require("@delta-reporter/wdio-delta-reporter-service")

config.services.push("chromedriver")
config.services.push([
  new DeltaService({
    host: process.env.CORE_URL,
    project: "Delta Reporter",
    testType: "End to End",
  }),
])

config.specs = ["./test/specs/webdriver/**/*.ts"]
config.baseUrl = process.env.BASE_URL

export { config }
