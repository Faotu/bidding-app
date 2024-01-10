import Image from 'next/image';
import type { GetStaticPropsContext } from 'next';

import {
  UserGroupIcon,
  FireIcon,
  UserIcon,
  BuildingLibraryIcon,
  CubeIcon,
  PaintBrushIcon,
  DocumentIcon,
  ChevronRightIcon,
  CalendarIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

import { withTranslationProps } from '~/lib/props/with-translation-props';

import Layout from '~/core/ui/Layout';
import Container from '~/core/ui/Container';
import Footer from '~/components/Footer';
import SiteHeader from '~/components/SiteHeader';
import SubHeading from '~/core/ui/SubHeading';
import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';
import Hero from '~/core/ui/Hero';
import Divider from '~/core/ui/Divider';
import SlideUpTransition from '~/core/ui/SlideUpTransition';

const Index = () => {
  return (
    <Layout>
      <SiteHeader />

      <Container>
        <SlideUpTransition>
          <div
            className={
              'my-4 flex flex-col items-center md:flex-row lg:my-8' +
              ' mx-auto flex-1 justify-center'
            }
          >
            <div
              className={'flex w-full flex-1 flex-col items-center space-y-10'}
            >
              <Button variant={'flat'} size={'small'} round href="/blog">
                <span className={'flex items-center space-x-2 font-normal'}>
                  <span>Explore Role Play Tribe</span>

                  <ChevronRightIcon className={'h-3'} />
                </span>
              </Button>

              <HeroTitle>
                <span>
                  Learn to sell{' '}
                  <span className="bg-gradient-to-br from-primary-500 to-primary-400 to-primary-400 bg-clip-text leading-[1.2] text-transparent">
                    effortlessly
                  </span>
                </span>
                <span>
                  in any{' '}
                  <span className="bg-gradient-to-br from-primary-500 to-primary-400 to-primary-400 bg-clip-text leading-[1.2] text-transparent">
                    situation
                  </span>
                </span>
              </HeroTitle>

              <div
                className={
                  'text-center text-gray-500 dark:text-gray-400' +
                  ' flex max-w-lg flex-col space-y-1 font-heading md:w-full'
                }
              >
                <span>
                  Role play your sales presentation, objections and closing by
                  practicing with live professional partners.
                </span>
              </div>

              <div className={'flex items-center space-x-4'}>
                <Button round href={'/auth/sign-up'}>
                  <span className={'flex items-center space-x-2'}>
                    <span>Start Role Playing</span>
                    <ChevronRightIcon className={'h-3'} />
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative m-auto h-1/2 w-1/2">
            <div className="hero-image-shadow aspect-video rounded-2xl shadow-primary-500/40 dark:shadow-primary-500/30">
              <iframe
                className="absolute left-0 top-0 h-full w-full"
                src="https://www.youtube.com/embed/ZOhot0_9gE4"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </SlideUpTransition>
      </Container>

      <Divider classNames={''} />

      <Container>
        <div
          className={
            'flex flex-col items-center justify-center space-y-24 py-12'
          }
        >
          <div
            className={
              'flex max-w-3xl flex-col items-center space-y-4 text-center'
            }
          >
            <div className={'flex flex-col items-center space-y-2'}>
              <div>
                <FireIcon className={'h-6 text-primary-500'} />
              </div>

              <b className={'text-primary-500'}>Features</b>
            </div>

            <Hero>The best tool in the space</Hero>

            <SubHeading>
              Unbeatable Features and Benefits for Your SaaS Business
            </SubHeading>
          </div>

          <div>
            <div className={'grid gap-12 lg:grid-cols-3'}>
              <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <UserIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Role play any time</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Connect with role playing partners on-line, in real-time and
                  start role playing today.
                </div>
              </div>

              <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <CalendarDaysIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Powerful scheduling</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Schedule your role playing session through integrated calendar
                  and role play when convenient.
                </div>
              </div>

              <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <UserGroupIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Role playing partner scoring system</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Rate your role playing parners, so that others can see the
                  score.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Divider classNames="" />

      <Container>
        <div
          className={
            'flex flex-col items-center justify-center space-y-24 py-12'
          }
        >
          <div
            className={
              'flex max-w-3xl flex-col items-center space-y-4 text-center'
            }
          >
            <div className={'flex flex-col items-center space-y-2'}>
              <div>
                <FireIcon className={'h-6 text-primary-500'} />
              </div>

              <b className={'text-primary-500'}>Testimonials</b>
            </div>

            <Hero>See what other users are saying about the system</Hero>

            <SubHeading>
              Check out opinions of other prospecting agents and how this role
              playing platform has improved their game and added to their
              bottomline.
            </SubHeading>
          </div>

          <div>
            <div className={'grid gap-12 lg:grid-cols-3'}>
              <div
                className={'flex flex-col items-center space-y-3 text-center'}
              >
                <Image
                  src="/assets/images/avatars/avatar-lisa.jpg"
                  className="-mt-14 h-14 w-14 max-w-full rounded-full border-none object-cover object-top align-middle shadow-lg"
                  alt="Avatar"
                  width={800}
                  height={600}
                />
                <Heading type={3}>Lisa Kim</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  &quot;Role playing with the help of the Role Play Tribe added
                  ease to my daily sessions and nicely padded my bottom line,
                  cause now I can run my client conversations on
                  auto-pilot...&quot;
                </div>
              </div>

              <div
                className={'flex flex-col items-center space-y-3 text-center'}
              >
                <Image
                  src="/assets/images/avatars/avatar-jamie.jpg"
                  className="-mt-14 h-14 w-14 max-w-full rounded-full border-none object-cover object-top align-middle shadow-lg"
                  alt="Avatar"
                  width={800}
                  height={600}
                />
                <Heading type={3}>Jamie Purvis</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  &quot;The benefit of the Role Play Tribe is the ability to
                  understand language and being able to communicate with clients
                  at any moment without thinking...&quot;
                </div>
              </div>

              <div
                className={'flex flex-col items-center space-y-3 text-center'}
              >
                <Image
                  src="/assets/images/avatars/avatar-andrew.jpg"
                  className="-mt-14 h-14 w-14 max-w-full rounded-full border-none object-cover object-top align-middle shadow-lg"
                  alt="Avatar"
                  width={800}
                  height={600}
                />
                <Heading type={3}>Andrew Hendrey</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  &quot;...many salespeople don&apos;t have access to such a
                  focused and dedicated community of people who take their sales
                  success seriously; that&apos;s what this platform provides: a
                  community of people who are serious about improving their
                  skills and networking with like minded individuals...&quot;
                </div>
              </div>

              {/* <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <PaintBrushIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>UI Themes</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Customizable UI Themes to Match Your Brand and Style
                </div>
              </div> */}

              {/* <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <CubeIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>UI Components</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Pre-built UI Components to Speed Up Your Development
                </div>
              </div> */}

              {/* <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <DocumentIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Blog and Documentation</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Pre-built Blog and Documentation Pages to Help Your Users
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </Container>

      <Divider classNames="" />

      <Container>
        <div className={'py-12'}>
          <div
            className={
              'flex flex-col justify-between rounded-lg lg:flex-row' +
              ' space-y-4 bg-primary-50 px-8 py-10 dark:bg-primary-500/5' +
              ' lg:space-y-0'
            }
          >
            <div className={'flex flex-col justify-between space-y-2'}>
              <Heading type={3}>
                <p className={'text-gray-800 dark:text-white'}>
                  The role playing application you&apos;ve been waiting for.
                </p>
              </Heading>

              <Heading type={4}>
                <p className={'text-primary-500'}>Sign up for free, today.</p>
              </Heading>
            </div>

            <div className={'flex flex-col justify-end space-y-2'}>
              <div>
                <Button
                  className={'w-full lg:w-auto'}
                  size={'large'}
                  href={'/auth/sign-up'}
                >
                  Get Started
                </Button>
              </div>

              <div className="flex flex-col space-y-2 text-center">
                <span className={'text-xs'}>No credit-card required</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Divider classNames="" />

      <Footer />
    </Layout>
  );
};

export default Index;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const { props } = await withTranslationProps({ locale });

  return {
    props,
  };
}

function HeroTitle({ children }: React.PropsWithChildren) {
  return (
    <h1
      className={
        'text-center text-4xl text-black-500 dark:text-white md:text-5xl' +
        ' flex flex-col space-y-1 font-heading font-medium xl:text-7xl'
      }
    >
      {children}
    </h1>
  );
}

function FeatureIcon(props: React.PropsWithChildren) {
  return (
    <div className={'flex justify-center'}>
      <div
        className={'rounded-xl bg-primary-500/10 p-4 dark:bg-primary-500/10'}
      >
        {props.children}
      </div>
    </div>
  );
}
