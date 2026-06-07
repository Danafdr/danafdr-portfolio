import { NextResponse } from 'next/server';

export async function POST() {
  // With stateless JWTs on the client, logout just means telling the client it succeeded 
  // so the client can clear localStorage.
  return NextResponse.json({ message: 'Logged out' });
}
