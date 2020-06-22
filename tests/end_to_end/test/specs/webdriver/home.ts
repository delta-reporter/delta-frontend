import Home from "src/wdio/home.page"

import logger from "@wdio/logger"
const log = logger("test-basic")

describe("Main Delta Reporter", () => {
  it("Should open the main page", () => {
    Home.open()
    log.debug("check the title") // just to demonstrate logging in spec file
    expect(browser).toHaveTitle(Home.title)
  })
})
