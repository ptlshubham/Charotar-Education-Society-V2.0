export function isLikelyJwtToken(token: string | null | undefined): boolean {
  if (!token) {
    return false;
  }

  const trimmed = token.trim();
  if (!trimmed) {
    return false;
  }

  // Lenient check: just ensure it has 3 parts separated by dots
  const parts = trimmed.split('.');
  return parts.length === 3;
}

export interface JwtPayloadLike {
  id?: string;
  userId?: string;
  [key: string]: any;
}

export function decodeJwtPayload(token: string | null | undefined): JwtPayloadLike | null {
  if (!isLikelyJwtToken(token)) {
    return null;
  }

  try {
    const payloadPart = String(token).split('.')[1] || '';
    const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
    const decodedJson = typeof atob === 'function' ? atob(paddedPayload) : '';
    return decodedJson ? JSON.parse(decodedJson) as JwtPayloadLike : null;
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token: string | null | undefined): string {
  const payload = decodeJwtPayload(token);
  return String(payload?.id || payload?.userId || '').trim();
}

export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload['exp']) return false;

  const expiryTime = payload['exp'] * 1000;
  const currentTime = Date.now();
  
  return currentTime > (expiryTime - 10000);
}

// ============================================================================
// Enterprise centralized token extraction utilities
// Use these methods to extract data directly from the JWT instead of localStorage
// ============================================================================

export function getUserTypeFromToken(token: string | null | undefined): string | null {
  const payload = decodeJwtPayload(token);
  if (payload) {
    let type = payload['userType'] || payload['role'] || payload['type'] || '';
    if (typeof type === 'object' && type !== null) {
      type = type['name'] || type['roleName'] || type['type'] || '';
    }
    if (type) {
      return type.toString().toLowerCase();
    }
  }
  return null;
}

export function getCompanyIdFromToken(token: string | null | undefined): string | null {
  const payload = decodeJwtPayload(token);
  return payload?.['companyId'] || null;
}

export function getEmailFromToken(token: string | null | undefined): string | null {
  const payload = decodeJwtPayload(token);
  return payload?.['email'] || null;
}

export function getRolesFromToken(token: string | null | undefined): string[] {
  const payload = decodeJwtPayload(token);
  const roles = payload?.['roles'] || payload?.['role'] || [];
  return Array.isArray(roles) ? roles : [roles];
}
