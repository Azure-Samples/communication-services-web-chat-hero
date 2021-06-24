export const SET_EVENT = 'SET_EVENT';
export const SET_ROOM_ID = 'SET_ROOM_ID';

export interface AcsEvent {
    id: string;
    chatSessionThreadId: string;
    chatSessionThreadModeratorId: string;
    rooms: AcsRoom[];
}

export interface AcsRoom {
    id: string;
    chatSessionThreadId: string;
    chatSessionThreadModeratorId: string;
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
