import React, { useRef, useState, ReactNode, CSSProperties } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useRouter } from 'next/router';
import { useFetchEvent } from '~/lib/players/hooks/use-fetch-event';
import Button from '~/core/ui/Button';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';

interface LogPayload {
  muted?: boolean;
  isOpen?: boolean;
  unreadCount?: number;
  [key: string]: any;
}

interface Participant {
  id?: string;
  name?: string;
  [key: string]: any;
}

interface ApiObject {
  executeCommand: (command: string, ...args: any[]) => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
}

const JitsiMeet: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { status, data } = useFetchEvent(id as string);
  const apiRef = useRef<ApiObject | null>(null);
  const [knockingParticipants, updateKnockingParticipants] = useState<
    Participant[]
  >([]);

  const handleChatUpdates = (payload: LogPayload) => {
    if (payload.isOpen || !payload.unreadCount) {
      return;
    }
    apiRef.current?.executeCommand('toggleChat');
  };

  const handleKnockingParticipant = (payload: LogPayload) => {
    const participant = payload?.participant;
    if (participant) {
      updateKnockingParticipants((participants) => [
        ...participants,
        participant,
      ]);
    }
  };

  const resolveKnockingParticipants = (
    condition: (participant: Participant) => boolean
  ) => {
    knockingParticipants.forEach((participant) => {
      if (participant.id) {
        apiRef.current?.executeCommand(
          'answerKnockingParticipant',
          participant.id,
          condition(participant)
        );
        updateKnockingParticipants((participants) =>
          participants.filter((item) => item.id !== participant.id)
        );
      }
    });
  };

  const handleIFrameStyling = (
    iframeRef: HTMLDivElement,
    styles: CSSProperties
  ) => {
    if (iframeRef && iframeRef?.style) {
      Object.assign(iframeRef.style, styles);
    }
  };

  const handleJitsiIFrameRef1 = (iframeRef: HTMLDivElement) =>
    handleIFrameStyling(iframeRef, {
      border: '10px solid #3d3d3d',
      background: '#3d3d3d',
      height: '540px',
      marginBottom: '20px',
    });

  const handleApiReady = (apiObj: ApiObject) => {
    apiRef.current = apiObj;
    apiObj.on('knockingParticipant', handleKnockingParticipant);
    apiObj.on('chatUpdated', handleChatUpdates);
  };

  const handleReadyToClose = () => {
    alert('Ready to close...');
  };

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-4xl">Loading...</h1>
      </div>
    );
  }

  if (status === 'error' || !id || (status === 'success' && !data)) {
    return (
      <div className="flex h-screen flex-col items-center">
        <h1 className="mb-8 mt-40 text-2xl text-gray-500">
          An error occured fetching meeting information
        </h1>
        <Button variant="outline" color="primary" onClick={() => router.back()}>
          <ArrowLeftCircleIcon className="mr-1 h-5 w-5" />
          Go back
        </Button>
      </div>
    );
  }

  const renderButtons = (): ReactNode => (
    <div style={{ margin: '15px 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          type="button"
          title="Click to execute toggle raise hand command"
          style={{
            border: 0,
            borderRadius: '6px',
            fontSize: '14px',
            background: '#f8ae1a',
            color: '#040404',
            padding: '12px 46px',
            margin: '2px 2px',
          }}
          onClick={() => apiRef.current?.executeCommand('toggleRaiseHand')}
        >
          Raise hand
        </button>
        <button
          type="button"
          title="Click to approve/reject knocking participant"
          style={{
            border: 0,
            borderRadius: '6px',
            fontSize: '14px',
            background: '#0056E0',
            color: 'white',
            padding: '12px 46px',
            margin: '2px 2px',
          }}
          onClick={() =>
            resolveKnockingParticipants(({ name }) => !name?.includes('test'))
          }
        >
          Resolve lobby
        </button>
      </div>
    </div>
  );

  const renderSpinner = () => {
    return (
      <div
        style={{
          fontFamily: 'sans-serif',
          textAlign: 'center',
        }}
      >
        Loading..
      </div>
    );
  };

  return (
    <>
      <h2 className="my-10 text-center text-2xl font-semibold leading-6 text-gray-900">
        {data.title}
      </h2>
      <JitsiMeeting
        roomName={data.id}
        spinner={renderSpinner}
        configOverwrite={{
          subject: data.title,
          hideConferenceSubject: false,
        }}
        onApiReady={(externalApi: any) => handleApiReady(externalApi)}
        onReadyToClose={handleReadyToClose}
        getIFrameRef={handleJitsiIFrameRef1}
      />
      {renderButtons()}
    </>
  );
};

export default JitsiMeet;
