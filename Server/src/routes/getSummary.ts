// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { getSummary } from '../lib/openai/summarization';

const router = express.Router();

/**
 * route: /getSummary/
 *
 * purpose: Get summary for a list of messages
 *
 * @returns The summary for a list of messages
 *
 */

router.post('/', async function (req, res, next) {
  res.send(await getSummary(req.body));
});

export default router;
