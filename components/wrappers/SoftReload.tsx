import { NextPage, NextPageContext } from 'next';
import React, { useState, PropsWithChildren, ComponentType } from 'react';

export interface SoftReloadProps {
  /**
   * Reloads the page's initialProps without causing a real browser "hard" reload.
   */
  softReload(): void;
}

type OmitSoftReloadProps<T> = Omit<T, keyof SoftReloadProps>;
type SoftReloadablePageInitialProps<TProps> = OmitSoftReloadProps<TProps> & { context: NextPageContext };
export type NextPageWithInitialProps<P, IP = P> = NextPage<P, IP> & Required<Pick<NextPage<P, IP>, 'getInitialProps'>>;

/**
 * Removes never-used context values to reduce bloat. Context values may come from server but then
 * be used client-side because they are saved in initial props.
 */
function minifyContext(context: NextPageContext): NextPageContext {
  return { ...context, req: undefined, res: undefined };
}

const withSoftReload = <TProps extends SoftReloadProps>(
  Page: NextPageWithInitialProps<TProps, OmitSoftReloadProps<TProps>>
): NextPage<SoftReloadablePageInitialProps<TProps>> => {
  async function getInitialProps(ctx: NextPageContext): Promise<SoftReloadablePageInitialProps<TProps>> {
    return { context: minifyContext(ctx), ...(await Page.getInitialProps(ctx)) };
  }
  const omitContextFromProps = ({
    context,
    ...props
  }: SoftReloadablePageInitialProps<TProps>): OmitSoftReloadProps<TProps> => props as any;
  const NewPage: NextPageWithInitialProps<SoftReloadablePageInitialProps<TProps>> = props => {
    // set inner page initial props to wrapper initial props minus context
    const [initialProps, setInitialProps] = useState(omitContextFromProps(props));
    async function softReload() {
      setInitialProps({ children: null, ...(await Page.getInitialProps(props.context)) });
    }
    return (
      <Page
        {...(({ ...initialProps, softReload } as Omit<TProps, keyof SoftReloadProps> & SoftReloadProps) as TProps)}
      />
    );
  };
  NewPage.getInitialProps = getInitialProps;
  NewPage.displayName = `withSoftReload(${Page.displayName})`;
  return NewPage;
};

export default withSoftReload;
