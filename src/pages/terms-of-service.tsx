import Head from 'next/head';
import { GetStaticPropsContext } from 'next';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import configuration from '~/configuration';
import SiteHeader from '~/components/SiteHeader';

import Layout from '~/core/ui/Layout';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';
import Link from 'next/link';

const TermsOfService = () => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">
            {`Terms Of Service - ${configuration.site.siteName}`}
          </title>
        </Head>

        <SiteHeader />

        <Container>
          <h1 className="text-black mb-8 text-center font-heading text-4xl font-medium dark:text-white md:text-5xl xl:text-7xl">
            Terms of Service for Role Play Tribe
          </h1>

          <div className="text-black space-y-4 text-lg dark:text-white">
            <span className="text-sm text-gray-500">
              Last Updated: 08/24/2023
            </span>

            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p>
              Welcome to Role Play Tribe. These Terms of Service (&quot;Terms&quot;)
              govern your use of the website operated by Role Play Tribe (&quot;us&quot;,
              &quot;we&quot;, &quot;our&quot;). Please read these Terms carefully.
            </p>

            <h2 className="text-2xl font-semibold">Privacy Policy</h2>
            <p>
              Your use of our website is also governed by our Privacy Policy.
              Please read our Privacy Policy at{' '}
              <Link href="/privacy-policy" className="text-blue-500 underline">
                Privacy Policy
              </Link>
              .
            </p>

            <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
            <p>
              By accessing our website, you confirm that you are at least 18
              years of age and agree to abide by these Terms.
            </p>

            <h2 className="text-2xl font-semibold">Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account and password.
            </p>

            <h2 className="text-2xl font-semibold">Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the
              Website immediately, under our sole discretion, for conduct that
              we believe violates these Terms or is harmful to other users of
              the Website, us, or third parties, or for any other reason.
            </p>

            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Role Play Tribe
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or
              revenues, whether incurred directly or indirectly, or any loss of
              data, use, goodwill, or other intangible losses.
            </p>

            <h2 className="text-2xl font-semibold">Governing Law</h2>
            <p>
              These Terms shall be governed by and defined following the laws of
              Canada. Role Play Tribe and yourself irrevocably consent that the
              courts of Canada have exclusive jurisdiction to resolve any
              dispute that may arise out of or in connection with these Terms.
            </p>

            <h2 className="text-2xl font-semibold">Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will
              always post the most current version of these Terms at{' '}
              <Link href="/terms-of-service" className="text-blue-500 underline">
                Terms of Service
              </Link>
              . By continuing to use the Website after the changes become
              effective, you agree to be bound by the revised Terms.
            </p>

            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              info@roleplaytribe.com.
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

export default TermsOfService;
