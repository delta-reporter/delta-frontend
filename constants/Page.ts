import { IEnum } from "."

/**
 * Page constants
 * @author tree
 */
export class Page implements IEnum<Page> {
  /**
   * For values() array
   */
  private static _values = new Array<Page>()

  public static readonly TOP = new Page(
    1,
    "Homepage",
    "List of services and endpoints",
    "/"
  )
  public static readonly PROJECTS = new Page(
    3,
    "Projects",
    "Select a project to view last launches and test runs",
    "/projects"
  )
  public static readonly LAUNCHES = new Page(
    2,
    "Launches",
    "Select a launch to view all the tests",
    "/launches"
  )
  public static readonly TEST_RUNS = new Page(
    2,
    "Test Runs",
    "Select a set of tests you want to view in detail",
    "/testruns"
  )

  public static readonly TESTS = new Page(
    2,
    "Tests",
    "Here are the tests for selected run",
    "/tests"
  )

  public static readonly ERROR = new Page(
    2,
    "Ooops, something went wrong....",
    "There is an error here, we are sorry for that!",
    "/error"
  )

  public static readonly ABOUT = new Page(
    2,
    "About Us",
    "Info about creators of this tool",
    "/about"
  )
  /**
   * constructor
   * @param number page id
   * @param pageTitle page title
   * @param pageDescription page description
   * @param relativeUrl relative url
   */
  private constructor(
    public readonly id: number,
    public readonly pageTitle: string,
    public readonly pageDescription: string,
    public readonly relativeUrl: string
  ) {
    Page._values.push(this)
  }

  /**
   * Instance array
   */
  static get values(): Page[] {
    return this._values
  }

  /**
   * @inheritdoc
   */
  equals = (target: Page): boolean => this.id === target.id

  /**
   * @inheritdoc
   */
  toString = (): string =>
    `${this.id}, ${this.pageTitle}, ${this.pageDescription}`
}
