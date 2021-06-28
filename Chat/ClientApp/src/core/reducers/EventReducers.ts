import { SET_EVENT, SET_ROOM_ID, EventActionTypes, AcsEvent } from '../actions/EventAction';

export interface EventState {
  event: AcsEvent | undefined;
  roomId: string | undefined;
}

const initThreadState: EventState = {
  event: undefined,
  roomId: undefined
};

export const EventReducer = (state = initThreadState, action: EventActionTypes) => {
  switch (action.type) {
    case SET_EVENT:
      console.log(`setting event: ${action.event.id}`);
      return {
        ...state,
        event: action.event
      };
    case SET_ROOM_ID:
      console.log(`setting room: ${action.roomId}`);
      return {
        ...state,
        roomId: action.roomId
      };
    default:
      return state;
  }
};
