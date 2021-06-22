import { loadTheme, initializeIcons } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import ChatScreen from './containers/ChatScreen';
import CallingConfigurationScreen from './containers/CallingConfigurationScreen';
import EndScreen from './components/EndScreen';
import RemovedFromThreadScreen from './components/RemovedFromThreadScreen';
import HomeScreen from './containers/HomeScreen';

import { reducer } from './core/reducers/index';
import { getBuildTime, getCallId, getChatSDKVersion, getEventId, getThreadId } from './utils/utils';
import { v1 as createGUID } from 'uuid';

import GroupCall from './containers/GroupCall';
import ConfigurationScreen from './containers/ConfigurationScreen';

console.info(`Azure Communication Services chat sample using @azure/communication-chat : ${getChatSDKVersion()}`);
console.info(`Build Date : ${getBuildTime()}`);

loadTheme({});
initializeIcons();

const store = createStore(reducer, applyMiddleware(thunk));

export default (): JSX.Element => {
  const [page, setPage] = useState('home');
  const [groupId, setGroupId] = useState('');
  const [screenWidth, setScreenWidth] = useState(0);
  const [localVideoStream, setLocalVideoStream] = useState(undefined);

  useEffect(() => {
    const setWindowWidth = (): void => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      setScreenWidth(width);
    };
    setWindowWidth();
    window.addEventListener('resize', setWindowWidth);
    return (): void => window.removeEventListener('resize', setWindowWidth);
  }, []);

  const getComponent = () => {

    if (getEventId() && page === 'home') {
      setPage('chatConfiguration');
    }

    if (getCallId() && page === 'home') {
      setPage('callConfiguration');
    }

    if (page === 'home') {
      return <HomeScreen />;
    } else if (page === 'chatConfiguration') {
      return <ConfigurationScreen joinChatHandler={() => setPage('chat')} />;
    } else if (page === 'callConfiguration') {
      getGroupId();
      return <CallingConfigurationScreen
        localVideoStream={localVideoStream}
        setLocalVideoStream={setLocalVideoStream}
        groupId={groupId}
        startCallHandler={(): void => { window.history.pushState({}, document.title, window.location.href + '&groupId=' + getGroupId()); setPage('call'); }}
      />;
    } else if (page === 'chat') {
      return (
        <ChatScreen
          removedFromThreadHandler={() => setPage('chat')}
          leaveChatHandler={() => setPage('end')}
        />
      );
    } else if (page === 'call') {
      return (
        <GroupCall
          endCallHandler={(): void => setPage('endCall')}
          groupId={getGroupId()}
          screenWidth={screenWidth}
          localVideoStream={localVideoStream}
          setLocalVideoStream={setLocalVideoStream}
        />
      )
    }
    else if (page === 'end') {
      return (
        <EndScreen
          rejoinHandler={() => {
            window.location.href = window.location.href;
          }}
          homeHandler={() => (window.location.href = window.location.origin)}
        />
      );
    } else if (page === 'removedFromThread') {
      return <RemovedFromThreadScreen homeHandler={() => (window.location.href = window.location.origin)} />;
    }
  };

  const getGroupIdFromUrl = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('groupId');
  };

  const getGroupId = (): string => {
    if (groupId) return groupId;
    const uriGid = getGroupIdFromUrl();
    const gid = uriGid == null || uriGid === '' ? createGUID() : uriGid;
    setGroupId(gid);
    return gid;
  };
  return <Provider store={store}>{getComponent()}</Provider>;
};
