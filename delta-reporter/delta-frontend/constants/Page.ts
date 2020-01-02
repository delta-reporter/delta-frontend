import { Color } from "@material-ui/core"
import { blue, orange, pink, red, teal } from "@material-ui/core/colors"
import { SvgIconProps } from "@material-ui/core/SvgIcon"
import { Home, Info, Save, Whatshot } from "@material-ui/icons"
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
    "Services",
    "Services status",
    "Δ | Services",
    "List of services and endpoints",
    "/",
    Home,
    pink
  )
  public static readonly REDUX = new Page(
    2,
    "Launches",
    "Check latest launches",
    "Δ | Launches",
    "Latest launches",
    "/redux",
    Save,
    blue
  )
  public static readonly REDUX_SAGAA = new Page(
    3,
    "Projects",
    "Add, Update or Remove projects",
    "Δ | Projects",
    "Here you can create, update or remove a project",
    "/redux-saga",
    Whatshot,
    teal
  )
  public static readonly ABOUT = new Page(
    10,
    "Reports",
    "Global charts and stats",
    "Δ | Reports",
    "Global information and resumes to keep the eye on",
    "/about",
    Info,
    orange
  )
  public static readonly ERROR = new Page(
    99,
    "Error",
    "Error",
    "Δ | sample",
    "Error.",
    "/error",
    Info,
    red
  )

  /**
   * constructor
   * @param number page id
   * @param pageTitle page title
   * @param pageDescription page description
   * @param title seo title
   * @param metaDescription seo meta description
   * @param relativeUrl relative url
   * @param icon page icon
   * @param iconColor page icon color
   */
  private constructor(
    public readonly id: number,
    public readonly pageTitle: string,
    public readonly pageDescription: string,
    public readonly title: string,
    public readonly metaDescription: string,
    public readonly relativeUrl: string,
    public readonly icon: React.ComponentType<SvgIconProps>,
    public readonly iconColor: Color
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
