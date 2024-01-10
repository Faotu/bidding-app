import { LayoutStyle } from '~/core/layout-style';
import { GoogleAuthProvider } from 'firebase/auth';

const configuration = {
  site: {
    name: 'Role Play Tribe',
    description: 'Learn Role Play',
    themeColor: '#ffffff',
    themeColorDark: '#0a0a0a',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL as string,
    siteName: 'Role Play Tribe',
    twitterHandle: '',
    githubHandle: '',
    language: 'en',
    convertKitFormId: '3795924',
    locale: process.env.DEFAULT_LOCALE,
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  auth: {
    // Enable MFA. You must upgrade to GCP Identity Platform to use it.
    // see: https://cloud.google.com/identity-platform/docs/product-comparison
    enableMultiFactorAuth: false,
    // When enabled, users will be required to verify their email address
    // before being able to access the app
    requireEmailVerification:
      process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === 'true',
    // NB: Enable the providers below in the Firebase Console
    // in your production project
    providers: {
      emailPassword: true,
      phoneNumber: false,
      emailLink: false,
      oAuth: [GoogleAuthProvider],
    },
  },
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
  emulatorHost: process.env.NEXT_PUBLIC_EMULATOR_HOST,
  emulator: process.env.NEXT_PUBLIC_EMULATOR === 'true',
  production: process.env.NODE_ENV === 'production',
  enableThemeSwitcher: true,
  paths: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    emailLinkSignIn: '/auth/link',
    onboarding: `/onboarding`,
    appHome: '/dashboard',
    players: '/players',
    meetings: '/meetings',
    groups: '/groups',
    settings: {
      profile: '/settings/profile',
      authentication: '/settings/profile/authentication',
      email: '/settings/profile/email',
      password: '/settings/profile/password',
    },
    api: {
      checkout: `/api/stripe/checkout`,
      billingPortal: `/api/stripe/portal`,
    },
    searchIndex: `/public/search-index`,
  },
  navigation: {
    style: LayoutStyle.Sidebar,
  },
  appCheckSiteKey: process.env.NEXT_PUBLIC_APPCHECK_KEY,
  email: {
    host: '',
    port: 587,
    user: '',
    password: '',
    senderAddress: 'MakerKit Team <info@makerkit.dev>',
  },
  emailEtherealTestAccount: {
    email: process.env.ETHEREAL_EMAIL,
    password: process.env.ETHEREAL_PASSWORD,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  stripe: {
    products: [
      {
        name: 'Silver',
        recommended: true,
        description:
          'Start improving your skills and getting more deals for free today!',
        badge: `Improve your sales conversions`,
        features: [
          'Unlimited one-on-one role playing',
          'AI based role play partner matching',
          'Simplified session scheduling',
          'Video call integration',
        ],
        plans: [
          {
            name: '',
            price: 'Free',
            stripePriceId: '',
            trialPeriodDays: 0,
            label: `Free`,
            href: `/contact`,
          },
        ],
      },
      {
        name: 'Gold',
        badge: `Coming Soon`,
        description: 'Elevate skill level of your entire group',
        features: [
          'Everything in the Silver tier',
          'Access to private groups',
          'Moderated role playing',
          'Objection handling games',
        ],
        plans: [
          {
            name: 'Monthly',
            price: '$16',
            stripePriceId: 'price_1MsdGdAv2rXH0Nro5r83FxXw',
            trialPeriodDays: 0,
          },
          {
            name: 'Yearly',
            price: '$149',
            stripePriceId: 'price_1MsdGdAv2rXH0NrooNwQstbl',
            trialPeriodDays: 0,
          },
        ],
      },
      {
        name: 'Platinum',
        description: 'Collaborate with top rated agents and more',
        badge: `Coming soon`,
        features: [
          'Everything in the Gold tier',
          'Role play with top 2% agents',
          'Private referral network',
          'Weekly group coaching and mindset clinic',
        ],
        plans: [
          {
            name: 'Monthly',
            price: '$35',
            stripePriceId: 'price_1MsdKhAv2rXH0Nro6AcCd2OJ',
            trialPeriodDays: 0,
          },
          {
            name: 'Yearly',
            price: '$299',
            stripePriceId: 'price_1MsdKhAv2rXH0NroTz2cBr00',
            trialPeriodDays: 0,
          },
        ],
      },
    ],
  },
};

export default configuration;
