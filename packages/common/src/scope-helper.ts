/**
 * Check if a given scope exists in a list of scopes.
 *
 * @param {string} requestedScope - The scope that was requested by the user.
 * @param {string} scopes - The scopes that are available to the user.
 * @return {boolean} True if the requested scope is available to the user.
 */
export function scopesMatch(requestedScope: string, scopes?: string): boolean {
  if (!scopes) return false;

  return scopes.split(' ').some((scope) => scopeMatches(requestedScope, scope));
}

/**
 * Check if a given scope matches a scope.
 *
 * @param {string} requestedScope - The scope that was requested by the user.
 * @param {string} scope - The scopes that are available to the user.
 * @return {boolean} True if the requested scope is available to the user.
 */
function scopeMatches(requestedScope: string, scope: string): boolean {
  const reqScopeParts = requestedScope.split(':');
  const scopeParts = scope.split(':');

  console.log('reqScopeParts ', reqScopeParts);
  console.log('scopeParts ', scopeParts);

  const reqScopeName = reqScopeParts[1] ?? reqScopeParts[0];
  const scopeName = scopeParts[1] ?? scopeParts[0];

  if (reqScopeName !== scopeName) return false;
  if (reqScopeParts.length === 1 && scopeParts.length === 1) return true;

  const reqScopeValues = reqScopeParts[0].split('');
  const scopeValues = scopeParts[0].split('');

  return reqScopeValues.every((v) => scopeValues.includes(v));
}
