// app/api/auth/login/route.js
// Legacy redirect — forwards to the new toolost-namespaced login route.

import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL('/api/auth/toolost/login', request.url);
  return NextResponse.redirect(url, 307);
}
