/**
 * A simple utility to simulate generating, decoding, and verifying a JSON Web Token.
 * This is for demonstration purposes in a mock environment without a real backend.
 */

// Base64 encode utility for browser
const b64EncodeUnicode = (str) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
  }));
};

// Base64 decode utility for browser
const b64DecodeUnicode = (str) => {
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
};

/**
 * Simulate generating a JWT token.
 * @param {Object} payload The user data to embed.
 * @returns {string} The simulated JWT token.
 */
export const generateMockToken = (payload) => {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = b64EncodeUnicode(JSON.stringify(header));
  
  // Add expiration time (e.g., 1 hour from now)
  const payloadWithExp = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  };
  const encodedPayload = b64EncodeUnicode(JSON.stringify(payloadWithExp));
  
  // Mock signature
  const signature = b64EncodeUnicode("mock-signature-do-not-use-in-prod");
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Parse and decode a JWT token.
 * @param {string} token 
 * @returns {Object|null} The decoded payload or null if invalid.
 */
export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(b64DecodeUnicode(parts[1]));
    return payload;
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
};

/**
 * Check if the token is valid and not expired.
 * @param {string} token 
 * @returns {boolean}
 */
export const isTokenValid = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp > currentTime;
};
