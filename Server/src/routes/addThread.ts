// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { addThread } from '../lib/chat/moderator';

const router = express.Router();

/**
 * route: /addThread/
 *
 * purpose: Add existing chat thread and moderator.
 *
 * @param threadId: id of the thread to be added
 * @param userId: id of the user to be set as the moderator
 * 
 * @returns The existing threadId as string
 *
 */

router.post('/', async function (req, res, next) {  
  res.send(await addThread(req.body.threadId, req.body.userId));  
});

export default router;
