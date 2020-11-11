import Home from "src/wdio/home.page"

import logger from "@wdio/logger"
const log = logger("test-basic")

declare var browser: any

describe("Main Delta Reporter", () => {
  it("Should open the main page", () => {
    Home.open()
    log.debug("check the title") // just to demonstrate logging in spec file
    browser.checkDocument()
    expect(browser).toHaveTitle(Home.title)
  })

  it("Should open a launches page", () => {
    Home.open()
    log.debug("check the launches by project") // just to demonstrate logging in spec file
    $("p=Delta Reporter").click()
    browser.checkDocument()
  })

  it("Should open a tests page", () => {
    Home.open()
    log.debug("check tests from a test run") // just to demonstrate logging in spec file
    $("p=Delta Reporter").click()
    $("span=End to End").waitForClickable({ timeout: 3000 });
    $("span=End to End").click()
    browser.checkDocument()
  })

  it("Should open a failed tests page", () => {
    Home.open()
    log.debug("check tests from a test run") // just to demonstrate logging in spec file
    $("p=Delta Reporter").click()
    $("span=End to End").waitForClickable({ timeout: 3000 });
    $("span=End to End").click()
    $("span=failed").waitForClickable({ timeout: 3000 });
    $("span=failed").click()
    browser.checkDocument()
  })

  it("Should open a test detail page", () => {
    Home.open()
    log.debug("check tests from a test run") // just to demonstrate logging in spec file
    $("p=Delta Reporter").click()
    $("span=End to End").waitForClickable({ timeout: 3000 });
    $("span=End to End").click()
    $("p=Main Delta Reporter").waitForClickable({ timeout: 3000 })
    $("p=Main Delta Reporter").click()
    $("p=Should open the main page").waitForClickable({ timeout: 3000 })
    $("p=Should open the main page").click()
    browser.checkDocument()
  })

  it("Should open a test history page", () => {
    Home.open()
    log.debug("check tests from a test run") // just to demonstrate logging in spec file
    $("p=Delta Reporter").click()
    $("span=End to End").waitForClickable({ timeout: 3000 });
    $("span=End to End").click()
    $("p=Main Delta Reporter").waitForClickable({ timeout: 3000 })
    $("p=Main Delta Reporter").click()
    $("p=Should open the main page").waitForClickable({ timeout: 3000 })
    $("p=Should open the main page").click()
    $("li=Test History").waitForClickable({ timeout: 3000 })
    $("li=Test History").click()
    browser.checkDocument()
  })
})
