function fetchWithCookie(endpoint: string) {
  const apiUrl = process.env.API_URL;

  // Fix url in case endpoint or api url slashing is wrong
  if (!apiUrl?.endsWith('/') && !endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }

  return fetch(apiUrl + endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}

export default fetchWithCookie;
