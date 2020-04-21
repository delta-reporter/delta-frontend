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

  public static readonly TOP = new Page(3, "", "", "/")

  public static readonly PROJECTS = new Page(
    2,
    "Projects",
    "Select a project to view latest test runs",
    "/"
  )

  public static readonly TESTS = new Page(3, "TESTS", "", "")

  public static readonly ERROR = new Page(
    4,
    "Ooops, something went wrong....",
    "There is an error here, we are sorry for that!",
    "/error"
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
