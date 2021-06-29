export const START_LIVE_STREAM = 'START_LIVE_STREAM';
export const LISTEN_LIVE_STREAM = 'LISTEN_LIVE_STREAM';
export interface startLiveAction {
    type: typeof START_LIVE_STREAM;

}

export interface ListenLiveStreamAction {
    type: typeof LISTEN_LIVE_STREAM;
}

export type LiveStreamActionType = startLiveAction | ListenLiveStreamAction;