import { loadTheme, initializeIcons } from '@fluentui/react';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import ChatScreen from './containers/ChatScreen';
import ConfigurationScreen from './containers/ConfigurationScreen';
import EndScreen from './components/EndScreen';
import RemovedFromThreadScreen from './components/RemovedFromThreadScreen';
import HomeScreen from './containers/HomeScreen';
import Room from './containers/Room';

import { reducer } from './core/reducers/index';
import { getBuildTime, getChatSDKVersion, getThreadId } from './utils/utils';

console.info(`Azure Communication Services chat sample using @azure/communication-chat : ${getChatSDKVersion()}`);
console.info(`Build Date : ${getBuildTime()}`);

loadTheme({});
initializeIcons();

const store = createStore(reducer, applyMiddleware(thunk));

export default (): JSX.Element => {
  const [state, setState] = useState({ page: 'home', roomTitle: '' });

  const getComponent = () => {
    if (state.page === 'home') {
      return <HomeScreen />;
    } else if (state.page === 'configuration') {
      return <ConfigurationScreen joinChatHandler={() => setState({ ...state, page: 'chat' })} />;
    } else if (state.page === 'chat') {
      return (
        <ChatScreen
          removedFromThreadHandler={() => setState({ ...state, page: 'removedFromThread' })}
          leaveChatHandler={() => setState({ ...state, page: 'end' })}
          enterRoomHandler={(title: string) => setState({page: 'room', roomTitle: title})
          }
        />
      );
    } else if (state.page === 'room') {
      return (<Room roomTitle={state.roomTitle} backToChatScreenHander={() => { setState({...state, page: 'chat'})}}/>);
    } else if (state.page === 'end') {
      return (
        <EndScreen
          rejoinHandler={() => {
            window.location.href = window.location.href;
          }}
          homeHandler={() => (window.location.href = window.location.origin)}
        />
      );
    } else if (state.page === 'removedFromThread') {
      return <RemovedFromThreadScreen homeHandler={() => (window.location.href = window.location.origin)} />;
    }
  };

  if (getThreadId() && state.page === 'home') {
    setState({ ...state, page: 'configuration' });
  }

  return <Provider store={store}>{getComponent()}</Provider>;
};
