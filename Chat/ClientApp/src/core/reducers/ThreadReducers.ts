import { GUID_FOR_INITIAL_TOPIC_NAME } from '../../constants';
import { SET_THREAD_TOPIC_NAME, SET_THREAD_ID, ThreadActionTypes } from '../actions/ThreadAction';

export interface ThreadState {
  topic: string;
  threadId: string | undefined;
}

const initThreadState: ThreadState = {
  topic: GUID_FOR_INITIAL_TOPIC_NAME,
  threadId: undefined
};

export const ThreadReducer = (state = initThreadState, action: ThreadActionTypes) => {
  switch (action.type) {
    case SET_THREAD_TOPIC_NAME:
      return {
        ...state,
        topic: action.topicName
      };
    case SET_THREAD_ID:
      return {
        ...state,
        threadId: action.threadId
      };
    default:
      return state;
  }
};
