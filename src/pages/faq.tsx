import Head from 'next/head';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import classNames from 'classnames';
import { GetStaticPropsContext } from 'next';

import { withTranslationProps } from '~/lib/props/with-translation-props';
import configuration from '~/configuration';

import Layout from '~/core/ui/Layout';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import Heading from '~/core/ui/Heading';
import SubHeading from '~/core/ui/SubHeading';

import Footer from '~/components/Footer';
import SiteHeader from '../components/SiteHeader';
import IconButton from '~/core/ui/IconButton';

const DATA = [
  {
    question: `Is there a free version of the app?`,
    answer: `Yes, our Minimum Viable Product (MVP) offers a free tier with essential functionality for role-playing practice. You can start practicing without any charges.`,
  },
  {
    question: `How does the matching for role-playing work?`,
    answer: `After creating a detailed profile, our app's matching algorithm will suggest similar profiles based on your preferences and calendar availability. From the shortlist, you can select a role-playing partner. The scheduled session will then appear on your dashboard.`,
  },
  {
    question: `How do I launch a role-playing session?`,
    answer: `Once a role-playing session is scheduled, it will be displayed on your user dashboard. When the scheduled time arrives, you can launch a video call session directly from within the app to start practicing.`,
  },
  {
    question: `Can I cancel my account?`,
    answer: `Yes, you can cancel your account at any time. Navigate to your account settings to deactivate your account.`,
  },
  {
    question: `What payment methods will be accepted for the paid tiers?`,
    answer: `Upon the rollout of our paid tiers, we will accept all major credit cards and PayPal as payment methods.`,
  },
  {
    question: `Will I be able to upgrade or downgrade my plan?`,
    answer: `Once multiple pricing tiers are made available, you'll be able to upgrade or downgrade your subscription plan through your account settings.`,
  },
  {
    question: `Is this app specifically designed for agents?`,
    answer: `Absolutely, this app is created by agents for agents, with the aim to facilitate effortless role-playing practice. It is tailored to meet the unique training needs of agents.`,
  },
  {
    question: `Do you offer group or agency discounts?`,
    answer: `Group and agency discounts will be considered once we launch our paid tiers. Stay tuned for more information!`,
  },
];

const Faq = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: DATA.map((item) => {
      return {
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      };
    }),
  };

  return (
    <Layout>
      <Head>
        <title key="title">{`FAQ - ${configuration.site.siteName}`}</title>

        <script
          key={'ld:json'}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <SiteHeader />

      <Container>
        <div className={'flex flex-col space-y-8'}>
          <div className={'flex flex-col items-center'}>
            <Hero>FAQ</Hero>

            <SubHeading>Frequently Asked Questions</SubHeading>
          </div>

          <div
            className={
              'm-auto flex w-full max-w-xl items-center justify-center'
            }
          >
            <div className="flex w-full flex-col">
              {DATA.map((item, index) => {
                return <FaqItem key={index} item={item} />;
              })}
            </div>
          </div>
        </div>
      </Container>

      <Footer />
    </Layout>
  );
};

function FaqItem({
  item,
}: React.PropsWithChildren<{
  item: {
    question: string;
    answer: string;
  };
}>) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded((isExpanded) => !isExpanded);

  return (
    <div className={'border-b border-gray-100 px-2 py-4 dark:border-black-300'}>
      <div className={'flex justify-between'}>
        <Heading type={2}>
          <span
            onClick={toggle}
            className={
              'text-base font-semibold text-gray-700 hover:text-current' +
              ' cursor-pointer dark:text-gray-300' +
              ' dark:hover:text-white'
            }
          >
            {item.question}
          </span>
        </Heading>

        <div>
          <IconButton onClick={toggle}>
            {expanded ? (
              <MinusIcon className={'h-5'} />
            ) : (
              <PlusIcon className={'h-5'} />
            )}
          </IconButton>
        </div>
      </div>

      <div
        className={classNames(
          'flex flex-col space-y-2 py-1 text-sm text-gray-500 dark:text-gray-400',
          {
            hidden: !expanded,
          }
        )}
        dangerouslySetInnerHTML={{ __html: item.answer }}
      />
    </div>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const { props } = await withTranslationProps({ locale });

  return {
    props,
  };
}

export default Faq;
