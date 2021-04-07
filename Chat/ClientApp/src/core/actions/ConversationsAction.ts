import { ChatMessageReadReceipt } from '@azure/communication-chat';

export const SET_RECEIPTS = 'SET_RECEIPTS';

export interface SetReceiptsAction {
  type: typeof SET_RECEIPTS;
  receipts: ChatMessageReadReceipt[];
}

export const setReceipts = (receipts: ChatMessageReadReceipt[]): SetReceiptsAction => ({
  type: SET_RECEIPTS,
  receipts
});

export type ConversationsActionTypes = SetReceiptsAction;
