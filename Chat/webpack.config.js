// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = (env) => {
  const babelConfig = require('./.babelrc.js');
  const commonConfig = require('./common.webpack.config')(__dirname, env, babelConfig);
  return commonConfig;
};
