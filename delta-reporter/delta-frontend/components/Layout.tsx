import * as React from 'react'
import Link from '@material-ui/core/Link';
import Head from 'next/head'
import Typography from '@material-ui/core/Typography';

type Props = {
  title?: string
}

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'This is the default title',
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/about">
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href="/users">
          <a>Users List</a>
        </Link>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <Typography> 
        <span>Powered up using NextJS + Serverless + Typescript + MaterialUI ❤️</span>
      </Typography>
    </footer>
  </div>
)

export default Layout
