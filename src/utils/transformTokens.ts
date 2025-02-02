import { Tokens, UserAuthResponsePayload } from '../types';

const transformTokens = (response: Tokens) => {
  console.log('response', response);

  return {
    access: {
      ...response.access,
      expires: new Date(response.access.expires),
    },
    refresh: {
      ...response.refresh,
      expires: new Date(response.refresh.expires),
    },
  };
};

export const transformAuthResponse = (response: UserAuthResponsePayload) => ({
  ...response,
  tokens: {
    ...transformTokens(response.tokens),
  },
});
