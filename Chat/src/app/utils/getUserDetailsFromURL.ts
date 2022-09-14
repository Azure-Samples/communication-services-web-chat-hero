// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type UserDetails = {
  userId: string;
  token: string;
  displayName: string;
};

/**
 *
 * The user details of an existing participant are extracted from the url
 * using URLsearchparams.
 *
 * @returns The current userId, accessToken and display name as an object
 *
 */
export const getUserDetailsFromURL = (): UserDetails | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  const token = urlParams.get('token');
  const displayName = urlParams.get('displayName') ?? '';

  if (!userId || !token) {
    return null;
  }

  return {
    userId,
    token,
    displayName
  };
};
