// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { getSentiment } from '../lib/openai/sentiment';

const router = express.Router();

/**
 * route: /getSentiment/
 *
 * purpose: Get sentiment for a message
 *
 * @returns The sentiment of the message
 *
 */

router.post('/', async function (req, res, next) {
  res.send(await getSentiment(req.body));
});

export default router;
