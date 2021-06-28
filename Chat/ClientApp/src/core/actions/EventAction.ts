export const SET_EVENT = 'SET_EVENT';
export const SET_ROOM_ID = 'SET_ROOM_ID';

export interface AcsEvent {
  id: string;
  chatSession: AcsChatSession;
  rooms: Record<string, AcsRoom>;
}

export interface AcsChatSession {
  threadId: string;
  threadModeratorId: string;
}

export interface AcsRoom {
  id: string;
  title: string;
  chatSession: AcsChatSession;
  callingSessionId: string;
}

export interface SetEventAction {
  type: typeof SET_EVENT;
  event: AcsEvent;
}

export interface SetRoomIdAction {
  type: typeof SET_ROOM_ID;
  roomId: string | undefined;
}

export const setEvent = (event: AcsEvent): SetEventAction => ({
  type: SET_EVENT,
  event
});

export const setRoomId = (roomId: string | undefined): SetRoomIdAction => ({
  type: SET_ROOM_ID,
  roomId
});

export type EventActionTypes = SetEventAction | SetRoomIdAction;
