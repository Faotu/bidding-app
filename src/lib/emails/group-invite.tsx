import { render } from '@react-email/render';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Preview } from '@react-email/preview';
import { Body } from '@react-email/body';
import { Section } from '@react-email/section';
import { Column } from '@react-email/column';
import { Text } from '@react-email/text';

import EmailNavbar from '~/components/emails/EmailNavbar';
import CallToActionButton from '~/components/emails/CallToActionButton';

interface Props {
  groupName: string;
  inviter: Maybe<string>;
  invitedUserEmail: string;
  link: string;
  productName: string;
}

export default function renderGroupInviteEmail(props: Props) {
  const title = `You have been invited to join ${props.groupName} group`;

  return render(
    <Html>
      <Head>
        <title>{title}</title>
      </Head>
      <Preview>{title}</Preview>

      <Body style={{ width: '500px', margin: '0 auto', font: 'helvetica' }}>
        <EmailNavbar />

        <Section style={{ width: '100%' }}>
          <Column>
            <Text>Hi,</Text>

            <Text>
              {props.inviter} has invited you to join{' '}
              {props.groupName} group on {props.productName} to collaborate with them.
            </Text>

            <Text>
              Use the button below to join the group and start collaborating:
            </Text>
          </Column>
        </Section>

        <Section>
          <Column align="center">
            <CallToActionButton href={props.link}>
              Join {props.groupName}
            </CallToActionButton>
          </Column>
        </Section>

        <Section>
          <Column>
            <Text>Welcome aboard,</Text>
            <Text>The {props.productName} Team</Text>
          </Column>
        </Section>
      </Body>
    </Html>
  );
}
