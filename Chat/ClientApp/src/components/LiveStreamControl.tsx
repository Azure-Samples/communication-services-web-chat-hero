
import { DefaultButton ,Stack } from '@fluentui/react';
import React, { useReducer} from 'react';
import {liveStreamButton,tilesStackStyles,tilesStackTokens} from './styles/LiveStreamStyle';


export const START_LIVE_STREAM = 'START_LIVE_STREAM';
export const LISTEN_LIVE_STREAM = 'LISTEN_LIVE_STREAM';
export interface startLiveAction {
    type: typeof START_LIVE_STREAM;

}

export interface ListenLiveStreamAction {
    type: typeof LISTEN_LIVE_STREAM;
}

export type LiveStreamActionType = startLiveAction | ListenLiveStreamAction;
export interface LivestreamState {
    isLive: boolean;
    ingestUrl: string;
    amsUrl: string;
}

export const initLiveState: LivestreamState = {
    isLive: false,
    ingestUrl: "not yet defined",
    amsUrl: "//amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest"
};


export const LiveStreamReducer = (state: any, action: LiveStreamActionType) => {
    switch (action.type) {
        case START_LIVE_STREAM:
            console.log(`Strating liveStream`);
            return {
                ...state,
                isLive: true,
                ingestUrl: "new ingest url"
            };
        default:
            return state;
    }
};

export default (): JSX.Element => {
    
    const [LiveStreamState,dispatch] = useReducer(LiveStreamReducer,initLiveState);
    return (
        <div>
             
            <DefaultButton className={liveStreamButton} onClick={()=>dispatch({type:'START_LIVE_STREAM'})}>Start LiveStream</DefaultButton>
            {LiveStreamState.ingestUrl}

           
        </div>
        
    )
  };