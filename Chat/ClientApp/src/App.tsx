import { loadTheme, initializeIcons } from '@fluentui/react';
import React, { useState } from 'react';
import { Provider } from 'react-redux';

import ChatScreen from './containers/ChatScreen';
import ConfigurationScreen from './containers/ConfigurationScreen';
import EndScreen from './components/EndScreen';
import RemovedFromThreadScreen from './components/RemovedFromThreadScreen';
import HomeScreen from './containers/HomeScreen';
import { getBuildTime, getChatSDKVersion, getThreadId } from './utils/utils';
import { store } from './core/store';
import { initLogger } from './feedbacks/logger';

console.info(`Azure Communication Services chat sample using @azure/communication-chat : ${getChatSDKVersion()}`);
console.info(`Build Date : ${getBuildTime()}`);

loadTheme({});
initializeIcons();
initLogger();

export default (): JSX.Element => {
  const [page, setPage] = useState('home');

  const getComponent = () => {
    if (page === 'home') {
      return <HomeScreen />;
    } else if (page === 'configuration') {
      return <ConfigurationScreen joinChatHandler={() => setPage('chat')} />;
    } else if (page === 'chat') {
      return (
        <ChatScreen
          removedFromThreadHandler={() => setPage('removedFromThread')}
          leaveChatHandler={() => setPage('end')}
        />
      );
    } else if (page === 'end') {
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

  if (getThreadId() && page === 'home') {
    setPage('configuration');
  }

  return <Provider store={store}>{getComponent()}</Provider>;
};
