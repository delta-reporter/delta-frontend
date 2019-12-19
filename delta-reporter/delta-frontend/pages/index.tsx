import * as React from 'react'
import Layout from '../components/Layout'
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { NextPage } from 'next'
import Typography from '@material-ui/core/Typography';

const IndexPage: NextPage = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Typography variant="h1" component="h2">
       Δ Delta Reporter
      </Typography>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
      <Button variant="contained" color="primary">
      Button Example
      </Button>
    </Layout>
  )
}

export default IndexPage
