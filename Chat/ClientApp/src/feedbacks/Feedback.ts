import { store } from "../core/store";
import { getLogs } from "./logger";
import { utils } from "../utils/utils";
import { v1 as createGUID } from 'uuid';

export type FeedbackType = {
    chatThreadId: string;
    type: string;
    logs: string[];
    comments: string;
    feedbackId: string;
};

export const uploadFeedback = async (feedback: FeedbackType): Promise<void> => {
    try {
        const serializedFeedback = JSON.stringify(feedback, null, 4);
        const logPromise = utils.uploadContentToBlobStorage(`logs-${feedback.feedbackId}.json`, serializedFeedback);
        await Promise.all([logPromise]);
    } catch (error) {
        console.log(error);
    }
};

export const createFeedback = (feedbackType: string, comment: string): FeedbackType => {
    const chatThreadId = store.getState().thread?.threadId ?? 'Not Found';
    return {
        logs: getLogs(),
        chatThreadId: chatThreadId,
        comments: comment,
        feedbackId: createGUID(),
        type: feedbackType
    };
};
