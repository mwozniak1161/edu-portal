import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test direct server-to-server communication (Next.js backend to NestJS backend)
    const res = await fetch('http://localhost:3000', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Note: Server-to-server requests don't include browser credentials by default
      // You'd need to handle auth differently for server-to-server communication
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `NestJS API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.text();
    return NextResponse.json({
      message: 'Successfully connected to NestJS backend',
      status: res.status,
      data: data
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to connect to NestJS backend: ${error.message}` },
      { status: 500 }
    );
  }
}