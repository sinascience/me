import { NextRequest } from 'next/server';

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  return adminPassword === password;
}

export function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return verifyAdminPassword(token);
}

export function createAuthHeader(password: string): string {
  return `Bearer ${password}`;
}