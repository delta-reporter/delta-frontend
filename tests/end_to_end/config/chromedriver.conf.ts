import { baseConfig as config } from "./base.conf"
const DeltaService = require("@delta-reporter/wdio-delta-reporter-service")
let path = require("path")
let VisualRegressionCompare = require("wdio-novus-visual-regression-service/compare")

function getScreenshotName(basePath) {
  return function(context) {
    let type = context.type
    let testName = context.test.title
    let browserVersion = parseInt(context.browser.version, 10)
    let browserName = context.browser.name
    let browserViewport = context.meta.viewport
    let browserWidth = browserViewport.width
    let browserHeight = browserViewport.height

    return path.join(
      basePath,
      `${testName}_${type}_${browserName}_v${browserVersion}_${browserWidth}x${browserHeight}.png`
    )
  }
}

config.services.push("chromedriver")
config.services.push([
  new DeltaService({
    host: process.env.CORE_URL,
    project: "Delta Reporter",
    testType: "End to End",
  }),
])
config.services.push([
  "novus-visual-regression",
  {
    compare: new VisualRegressionCompare.LocalCompare({
      referenceName: getScreenshotName(
        path.join(process.cwd(), "screenshots/reference")
      ),
      screenshotName: getScreenshotName(
        path.join(process.cwd(), "screenshots/screen")
      ),
      diffName: getScreenshotName(path.join(process.cwd(), "screenshots/diff")),
      misMatchTolerance: 0.01,
    }),
    viewportChangePause: 300,
    viewports: [
      { width: 320, height: 480 },
      { width: 480, height: 320 },
      { width: 1024, height: 768 },
    ],
    orientations: ["landscape", "portrait"],
  },
])

config.specs = ["./test/specs/webdriver/**/*.ts"]
config.baseUrl = process.env.BASE_URL

export { config }
