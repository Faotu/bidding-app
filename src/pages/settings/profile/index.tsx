import { useCallback, useContext } from 'react';
import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import { useUser } from 'reactfire';

import FirebaseStorageProvider from '~/core/firebase/components/FirebaseStorageProvider';

import { withAppProps } from '~/lib/props/with-app-props';
import { UserSessionContext } from '~/core/contexts/user-session';

import UpdateProfileForm from '~/components/profile/UpdateProfileForm';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';
import SettingsPageContainer from '~/components/settings/SettingsPageContainer';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';
import SettingsTile from '~/components/settings/SettingsTile';
import Head from 'next/head';
import UpdateBasicForm from '~/components/profile/UpdateBasicInfoForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/core/ui/Tabs';
import UpdateProfessionalDataForm from '~/components/profile/UpdateProfessionDataForm';
import { ProfileInfo } from '~/core/session/types/user-data';

type ProfileData = Partial<ProfileInfo>;

const Profile = () => {
  const { userSession, setUserSession } = useContext(UserSessionContext);
  const { data: user } = useUser();

  const onUpdate = useCallback(
    (data: ProfileData) => {
      const authData = userSession?.auth;
      const userData = userSession?.data;
      const { displayName, photoURL, ...rest } = data;
      if (authData) {
        setUserSession({
          auth: {
            ...authData,
            displayName: displayName ?? authData.displayName,
            photoURL: photoURL ?? authData.photoURL,
          },
          data: userData,
        });
      }

      if (userData) {
        setUserSession({
          auth: authData,
          data: {
            ...userData,
            ...rest,
          },
        });
      }
    },
    [setUserSession, userSession]
  );

  if (!user) {
    return null;
  }

  return (
    <SettingsPageContainer title={'Settings'}>
      <Head>
        <title key={'title'}>My Details</title>
      </Head>

      <ProfileSettingsTabs />

      <SettingsContentContainer>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="professional">
              Professional Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <SettingsTile
              heading={<Trans i18nKey={'profile:generalTab'} />}
              subHeading={<Trans i18nKey={'profile:generalTabSubheading'} />}
            >
              <FirebaseStorageProvider>
                <UpdateBasicForm user={user} onUpdate={onUpdate} />
              </FirebaseStorageProvider>
            </SettingsTile>
          </TabsContent>

          <TabsContent value="profile">
            <SettingsTile
              heading={<Trans i18nKey={'profile:generalTab'} />}
              subHeading={<Trans i18nKey={'profile:generalTabSubheading'} />}
            >
              <FirebaseStorageProvider>
                <UpdateProfileForm
                  profile={userSession?.data}
                  onUpdate={() => {}}
                />
              </FirebaseStorageProvider>
            </SettingsTile>
          </TabsContent>
          <TabsContent value="professional">
            <SettingsTile
              heading={<Trans i18nKey={'profile:generalTab'} />}
              subHeading={<Trans i18nKey={'profile:generalTabSubheading'} />}
            >
              <FirebaseStorageProvider>
                <UpdateProfessionalDataForm
                  profile={{
                    yearsOfIndustryExperience:
                      userSession?.data?.yearsOfIndustryExperience,
                    transactionsLastTwelveMonths:
                      userSession?.data?.transactionsLastTwelveMonths,
                    brokerageName: userSession?.data?.brokerageName,
                  }}
                  onUpdate={() => {}}
                />
              </FirebaseStorageProvider>
            </SettingsTile>
          </TabsContent>
        </Tabs>
      </SettingsContentContainer>
    </SettingsPageContainer>
  );
};

export default Profile;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
