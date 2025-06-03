// pkce.js
function base64URLEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generatePKCE() {
  // 1. Generar code_verifier aleatorio
  const array = new Uint8Array(64); // Genera un code_verifier más largo y seguro
  window.crypto.getRandomValues(array);
  const code_verifier = base64URLEncode(array);

  // 2. Generar SHA-256 hash del code_verifier
  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  // 3. Pasar el hash a base64 URL seguro → code_challenge
  const code_challenge = base64URLEncode(digest);

  return { code_verifier, code_challenge };
}
