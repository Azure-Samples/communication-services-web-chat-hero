// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as express from 'express';
import { getTranslation } from '../lib/openai/translation';

const router = express.Router();

/**
 * route: /getTranslation/
 *
 * purpose: Get translation of a message to requested language
 *
 * @returns The translated message
 *
 */

router.post('/', async function (req, res, next) {
  res.send(await getTranslation(req.body));
});

export default router;
