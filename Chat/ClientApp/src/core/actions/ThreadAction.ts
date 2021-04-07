export const SET_THREAD_TOPIC_NAME = 'SET_THREAD_TOPIC_NAME';
export const SET_THREAD_ID = 'SET_THREAD_ID';

export interface SetThreadTopicNameAction {
  type: typeof SET_THREAD_TOPIC_NAME;
  topicName: string;
}

export interface SetThreadIdAction {
  type: typeof SET_THREAD_ID;
  threadId: string;
}

export const setThreadTopicName = (topicName: string): SetThreadTopicNameAction => ({
  type: SET_THREAD_TOPIC_NAME,
  topicName
});

export const setThreadId = (threadId: string): SetThreadIdAction => ({
  type: SET_THREAD_ID,
  threadId
});

export type ThreadActionTypes = SetThreadTopicNameAction | SetThreadIdAction;
