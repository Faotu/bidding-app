import Head from 'next/head';
import { GetStaticPropsContext } from 'next';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import configuration from '~/configuration';
import SiteHeader from '~/components/SiteHeader';

import Layout from '~/core/ui/Layout';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <>
      <Layout>
        <Head>
          <title key="title">
            {`Privacy Policy - ${configuration.site.siteName}`}
          </title>
        </Head>

        <SiteHeader />

        <Container>
          <h1 className="text-black mb-8 text-center font-heading text-4xl font-medium dark:text-white md:text-5xl xl:text-7xl">
            Privacy Policy for Role Play Tribe
          </h1>

          <div className="text-black space-y-4 text-lg dark:text-white">
            <span className="text-sm text-gray-500">
              Last Updated: 08/24/2023
            </span>

            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p>
              Welcome to Role Play Tribe. This Privacy Policy governs your use
              of the website located at{' '}
              <Link href="/" className="text-blue-500 underline">
                Role Play Tribe
              </Link>{' '}
              operated by Role Play Tribe (&quot;us&quot;, &quot;we&quot;, &quot;our&quot;). We are committed
              to protecting your personal information and your right to privacy.
            </p>

            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when you
              register on the Website, express an interest in obtaining
              information about us or our products and services, or otherwise
              contact us.
            </p>

            <h2 className="text-2xl font-semibold">
              How We Use Your Information
            </h2>
            <p>
              We use the information we collect or receive to facilitate account
              creation and logon process, to send administrative information to
              you, and for other Business Purposes.
            </p>

            <h2 className="text-2xl font-semibold">
              Will Your Information Be Shared With Anyone?
            </h2>
            <p>
              We only share information with your consent, to comply with laws,
              to protect your rights, or to fulfill business obligations.
            </p>

            <h2 className="text-2xl font-semibold">
              How Long Do We Keep Your Information?
            </h2>
            <p>
              We will only keep your personal information for as long as it is
              necessary for the purposes set out in this privacy notice.
            </p>

            <h2 className="text-2xl font-semibold">
              How Do We Keep Your Information Safe?
            </h2>
            <p>
              We have implemented appropriate technical and organizational
              security measures designed to protect the security of any personal
              information we process.
            </p>

            <h2 className="text-2xl font-semibold">
              Do We Collect Information From Minors?
            </h2>
            <p>
              We do not knowingly collect data from or market to children under
              18 years of age.
            </p>

            <h2 className="text-2xl font-semibold">Privacy Rights</h2>
            <p>
              You have rights under various international privacy laws to access
              and correct your personal data and to request deletion of your
              personal data.
            </p>

            <h2 className="text-2xl font-semibold">
              Changes to This Privacy Policy
            </h2>
            <p>
              We may update this privacy notice from time to time. The updated
              version will be indicated by an updated &quot;Last Updated&quot; date and
              will be effective as soon as it is accessible.
            </p>

            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have questions or comments about this notice, you may
              contact us at info@roleplaytribe.com.
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

export default PrivacyPolicy;
