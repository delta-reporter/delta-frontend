import BasePage from "../base.page"

class Home extends BasePage {
  get title() {
    return "Δ | Projects"
  }

  /**
   * Opens the page
   */
  open() {
    super.open("/")
  }
}

export default new Home()
