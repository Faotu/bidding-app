import { Trans } from 'next-i18next';
import Head from 'next/head';
import useGroupData from '~/lib/groups/hooks/use-group-data';
import SettingsContentContainer from '../../settings/SettingsContentContainer';
import SettingsTile from '../../settings/SettingsTile';
import GroupSettingsTabs from '../GroupSettingsTabs';
import UpdateGroupForm from '../UpdateGroupForm';

const GroupsSettingsPageContainer: React.FC<{ id: string }> = ({ id }) => {
  const { settings, groupId } = useGroupData(id);
  return (
    <div
      className={`flex flex-col space-y-4 md:space-y-0 lg:mt-8 lg:flex-row lg:space-x-16 xl:space-x-24`}
    >
      <Head>
        <title key="title">Group Settings</title>
      </Head>
      <GroupSettingsTabs groupId={groupId} />
      <SettingsContentContainer>
        <SettingsTile
          heading={<Trans i18nKey={'group:generalTabLabel'} />}
          subHeading={<Trans i18nKey={'group:generalTabLabelSubheading'} />}
        >
          {groupId && settings ? (
            <UpdateGroupForm groupId={groupId} settings={settings} />
          ) : (
            <p>Group not found!</p>
          )}
        </SettingsTile>
      </SettingsContentContainer>
    </div>
  );
};

export default GroupsSettingsPageContainer;
