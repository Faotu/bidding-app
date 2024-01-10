import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Trans, useTranslation } from 'next-i18next';

import { withAppProps } from '~/lib/props/with-app-props';
import { useUserSession } from '~/core/hooks/use-user-session';

import Alert from '~/core/ui/Alert';

import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';
import SettingsPageContainer from '~/components/settings/SettingsPageContainer';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';
import SettingsTile from '~/components/settings/SettingsTile';
import AvailabilityPage from '../../availability-page';
import React from 'react';
import { useApiRequest } from '~/core/hooks/use-api';
import useSWRMutation from 'swr/mutation';
import toast from 'react-hot-toast';
import {
  Availability,
  AvailabilityFormData,
} from '~/core/session/types/user-data';
import { Timezone } from '~/core/session/types/role-play-tribe';

const ProfileAvailabilitySettings = () => {
  const { t } = useTranslation('profile');
  const userSession = useUserSession();
  const user = userSession?.auth;
  const userData = userSession?.data;
  const availabilityData = userData?.availability
    ? userData?.availability
    : null;

  const { trigger } = useUpdateAvailabilityRequest();

  if (!user) {
    return null;
  }

  // const canUpdateAvailability = user.providerData.find(
  //   (item) => item.providerId === EmailAuthProvider.PROVIDER_ID
  // );

  const updateAvailability = async (data: AvailabilityFormData) => {
    data.availability;
    const saveDataAsync = trigger({
      availability: data.availability,
      timezone: data.timezone as Timezone,
    });

    await toast.promise(saveDataAsync, {
      success: t('updateAvailabilitySuccess'),
      error: t('updateAvailabilityError'),
      loading: t('updateAvailabilityLoading'),
    });

    const container = document.querySelector("[data-name='body-scroll-view']");
    if (container) {
      const targetX = 0; // Target scroll position on the horizontal axis (left)
      const targetY = 0; // Target scroll position on the vertical axis (top)

      const startX = container.scrollLeft; // Current scroll position on the horizontal axis
      const startY = container.scrollTop; // Current scroll position on the vertical axis

      const duration = 200; // Animation duration in milliseconds
      let startTime: any = null;

      function animateScroll(timestamp: any) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const easeProgress = Math.min(progress / duration, 1); // Ease in-out progress

        // Calculate the new scroll position based on the easing function
        const newX = startX + (targetX - startX) * easeProgress;
        const newY = startY + (targetY - startY) * easeProgress;

        if (container) {
          container.scroll(newX, newY);
        }

        if (progress < duration) {
          // Continue the animation
          requestAnimationFrame(animateScroll);
        }
      }

      // Start the animation
      requestAnimationFrame(animateScroll);
    }
  };

  const handleSubmit = (formData?: AvailabilityFormData) => {
    if (formData) {
      updateAvailability(formData);
    }
  };

  return (
    <SettingsPageContainer title={'Settings'}>
      <Head>
        <title key={'title'}>Update Availability</title>
      </Head>

      <ProfileSettingsTabs />

      <SettingsContentContainer>
        <SettingsTile
          heading={<Trans i18nKey={'profile:availabilityTab'} />}
          subHeading={<Trans i18nKey={'profile:availabilityTabSubheading'} />}
        >
          {/*<If
            condition={canUpdateAvailability}
            fallback={<WarnCannotUpdateAvailabilityAlert />}
          >
            <AvailabilityPage
              updateMode={true}
              data={availabilityData}
              onSubmit={handleSubmit}
            />
          </If>*/}
          <AvailabilityPage
            updateMode={true}
            data={{
              // set default to device timezone
              timezone:
                userData?.timezone ||
                (Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone),
              availability: availabilityData || ({} as Availability),
            }}
            onSubmit={handleSubmit}
          />
        </SettingsTile>
      </SettingsContentContainer>
    </SettingsPageContainer>
  );
};

function WarnCannotUpdateAvailabilityAlert() {
  return (
    <Alert type={'warn'}>
      <Trans i18nKey={'profile:cannotUpdateAvailability'} />
    </Alert>
  );
}

export default ProfileAvailabilitySettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}

function useUpdateAvailabilityRequest() {
  const fetcher = useApiRequest<
    void,
    { availability: string; timezone: Timezone }
  >();

  return useSWRMutation(
    '/api/user/update-availability',
    (
      path,
      { arg: body }: { arg: { availability: Availability; timezone: Timezone } }
    ) => {
      return fetcher({
        path,
        body: {
          availability: JSON.stringify(body.availability),
          timezone: body.timezone,
        },
      });
    }
  );
}
