import BasePage from "../base.page"

class Home extends BasePage {
  get title() {
    return "Δ Delta Reporter"
  }

  /**
   * Opens the page
   */
  open() {
    super.open("/")
  }
}

export default new Home()
