import Head from 'next/head';
import { GetStaticPropsContext } from 'next';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import configuration from '~/configuration';
import SiteHeader from '~/components/SiteHeader';

import Layout from '~/core/ui/Layout';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';

const CookiePolicy = () => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">
            {`Cookie Policy - ${configuration.site.siteName}`}
          </title>
        </Head>

        <SiteHeader />

        <Container>
          <h1 className="text-black mb-8 text-center font-heading text-4xl font-medium dark:text-white md:text-5xl xl:text-7xl">
            Cookie Policy for Role Play Tribe
          </h1>

          <div className="text-black space-y-4 text-lg dark:text-white">
            <span className="text-sm text-gray-500">
              Last Updated: 08/24/2023
            </span>

            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p>
              Welcome to Role Play Tribe. This Cookie Policy explains how we use
              cookies and similar technologies to recognize you when you visit
              our website, operated by Role Play Tribe (&quotus&quot, &quotwe&quot, &quotour&quot). It
              explains what these technologies are and why we use them.
            </p>

            <h2 className="text-2xl font-semibold">What Are Cookies?</h2>
            <p>
              Cookies are small files stored on your device (computer or mobile
              device). They are used to enable certain features on our website
              and to remember your preferences for future visits.
            </p>

            <h2 className="text-2xl font-semibold">How We Use Cookies</h2>
            <p>
              We use cookies to understand site usage and to improve the content
              and offerings on our site. For example, we may use cookies to
              personalize your experience on our website (e.g., to recognize you
              by name when you return to our site).
            </p>

            <h2 className="text-2xl font-semibold">Types of Cookies We Use</h2>
            <p>
              We use both first-party and third-party cookies on our website.
              First-party cookies are mostly necessary for the website to
              function the right way, and they do not collect any of your
              personally identifiable data.
            </p>

            <h2 className="text-2xl font-semibold">Managing Cookies</h2>
            <p>
              You have the right to accept or reject cookies. You can exercise
              your cookie rights by setting your preferences in your web
              browser. Please note that if you choose to reject cookies, doing
              so may impair some of our website’s functionality.
            </p>

            <h2 className="text-2xl font-semibold">
              Changes to This Cookie Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. We will always
              post the most current version on this page.
            </p>

            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Cookie
              Policy, you may contact us at info@roleplaytribe.com.
            </p>
          </div>
        </Container>

        <Footer />
      </Layout>
    </>
  );
};

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const { props } = await withTranslationProps({ locale });

  return {
    props,
  };
}

export default CookiePolicy;
