import { useCallback, useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import configuration from '~/configuration';
import { withUserProps } from '~/lib/props/with-user-props';

import Logo from '~/core/ui/Logo';
import If from '~/core/ui/If';
import Layout from '~/core/ui/Layout';

import { CompleteOnboardingStep } from '~/components/onboarding/CompleteOnboardingStep';

import OnboardingIllustration from '~/components/onboarding/OnboardingIllustration';
import { withTranslationProps } from '~/lib/props/with-translation-props';
import {
  Availability,
  AvailabilityFormData,
  UserProfessionalData,
  UserProfileData,
} from '~/core/session/types/user-data';
import { useUser } from 'reactfire';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { UserProfileInfoStep } from '~/components/onboarding/UserProfileInfoStep';
import { UserProfessionalInfoStep } from '~/components/onboarding/UserProfessionalInfoStep';
import AvailabilityPage from '../availability-page';
import classNames from 'classnames';

const appHome = configuration.paths.appHome;

const Onboarding = () => {
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [organizationFormData, setOrganizationFormData] = useState<string>();
  const [userProfileFormData, setUserProfileFormData] =
    useState<UserProfileData>();
  const [userProfessionalFormData, setUserProfessionalFormData] =
    useState<UserProfessionalData>();
  const [userAvailabilityData, setUserAvailabilityData] = useState<
    Availability | undefined
  >(undefined);

  const router = useRouter();

  const removeQueryParam = useCallback(
    (param: string) => {
      const { pathname, query } = router;
      const params = new URLSearchParams(query as any);
      params.delete(param);
      router.replace({ pathname, query: params.toString() }, undefined, {
        shallow: true,
      });
    },
    [router]
  );

  // prefetch application home route
  useEffect(() => {
    void router.prefetch(appHome);
  }, [router]);

  const onFirstStepSubmitted = useCallback(
    (userProfileData: UserProfileData) => {
      if (!user.data?.uid) {
        throw new Error(
          'attempted profile creation, but no user.uid found on first step submission'
        );
      }

      // since we dont use organizations, we just use the
      // users uid as the organizaiton data.
      setOrganizationFormData(user.data.uid);

      setUserProfileFormData({
        ...userProfileData,
      });

      setCurrentStep(1);
    },
    [user]
  );

  const onSecondStepSubmitted = useCallback(
    (userProfessionalData: UserProfessionalData) => {
      setUserProfessionalFormData({
        ...userProfessionalData,
      });
      setCurrentStep(2);
    },
    []
  );

  const onThirdStepSubmitted = useCallback(
    (availabilityData: AvailabilityFormData) => {
      setUserAvailabilityData({
        ...availabilityData.availability,
      });
      if (userProfileFormData) {
        setUserProfileFormData({
          ...userProfileFormData,
          timezone: availabilityData.timezone,
        });
      }
      setCurrentStep(3);
    },
    [userProfileFormData]
  );

  const onComplete = useCallback(() => {
    void router.push(appHome);
  }, [router]);

  return (
    <Layout>
      <Head>
        <title key="title">Onboarding</title>
      </Head>
      <div className={'flex h-screen flex-row'}>
        <div
          className={classNames('overflow-auto', {
            'w-[100%] md:w-[500%] lg:w-[50%] xl:w-[50%]': currentStep !== 2,
            'w-[100%] md:w-[500%] lg:w-[55%] xl:w-[65%]': currentStep === 2,
          })}
        >
          <div
            className={
              'px-[30px] py-[50px] sm:px-[50px] md:px-[50px] xl:px-[100px]'
            }
          >
            <div className="mb-[30px] flex flex-col gap-[10px]">
              <div className={'flex flex-grow justify-center'}>
                <Logo className="mr-auto w-[220px]" href={'/onboarding'} />
              </div>
              <If condition={currentStep !== 0 && currentStep !== 3}>
                <button
                  className="mr-auto flex"
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <ChevronLeftIcon className={'h-6'} /> Go back
                </button>
              </If>
              {/*<div className={'absolute top-24 hidden lg:flex'}>
                  <Logo href={'/onboarding'} />
                </div>*/}
            </div>
            {/* step 1 */}
            <If condition={currentStep === 0}>
              <UserProfileInfoStep
                userData={user.data}
                onSubmit={onFirstStepSubmitted}
                userProfileFormData={userProfileFormData}
              />
            </If>

            {/* step 2 */}
            <If condition={currentStep === 1}>
              <UserProfessionalInfoStep
                userProfessionalFormData={userProfessionalFormData}
                onSubmit={onSecondStepSubmitted}
              />
            </If>

            {/* step 3 */}
            <If condition={currentStep === 2}>
              <AvailabilityPage onSubmit={onThirdStepSubmitted} />
            </If>

            {/* step 4 */}
            <If
              condition={
                currentStep === 3 &&
                userProfileFormData &&
                userProfessionalFormData &&
                organizationFormData &&
                userAvailabilityData
              }
            >
              {userProfileFormData &&
                userProfessionalFormData &&
                userAvailabilityData &&
                organizationFormData && (
                  <CompleteOnboardingStep
                    data={{
                      ...userProfileFormData,
                      ...userProfessionalFormData,
                      organization: organizationFormData,
                      availability: JSON.stringify(userAvailabilityData),
                    }}
                    onComplete={onComplete}
                  />
                )}
            </If>
          </div>
        </div>
        <div
          className={
            'hidden w-[50%] items-center justify-center bg-gray-50 md:flex lg:flex xl:flex'
          }
        >
          <OnboardingIllustration className={'w-[550px]'} />
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { props } = await withUserProps(ctx);
  const user = props.session;

  if (!user) {
    return redirectToSignIn();
  }

  const isEmailVerified = user.emailVerified;
  const requireEmailVerification = configuration.auth.requireEmailVerification;

  if (requireEmailVerification && !isEmailVerified) {
    return redirectToSignIn();
  }

  const userData = await getUserData(user.uid);
  const translationProps = await withTranslationProps(ctx);

  // if we cannot find the user's Firestore record
  // the user should go to the onboarding flow
  // so that the record wil be created after the end of the flow
  if (!userData) {
    return {
      ...translationProps,
      props,
    };
  }

  const { getCurrentOrganization } = await import(
    '~/lib/server/organizations/get-current-organization'
  );

  const organization = await getCurrentOrganization(user.uid);
  const { onboarded } = user.customClaims;

  // there are two cases when we redirect the user to the onboarding
  // 1. if they have not been onboarded yet
  // 2. if they end up with 0 organizations (for example, if they get removed)
  //
  // NB: you should remove this if you want to
  // allow organization-less users within the application
  if (onboarded && organization) {
    return redirectToAppHome();
  }

  return {
    ...translationProps,
    props,
  };
}

function redirectToSignIn() {
  const paths = configuration.paths;

  const destination = [
    paths.signIn,
    `?returnUrl=${paths.onboarding}&signOut=true`,
  ].join('/');

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
}

function redirectToAppHome() {
  return {
    redirect: {
      destination: configuration.paths.appHome,
      permanent: false,
    },
  };
}

/**
 * @name getUserData
 * @description Fetch User Firestore data decorated with its ID field
 * @param userId
 */
async function getUserData(userId: string) {
  const { getUserRefById } = await import('~/lib/server/queries');

  const ref = await getUserRefById(userId);
  const data = ref.data();

  if (data) {
    return {
      ...data,
      id: ref.id,
    };
  }
}
