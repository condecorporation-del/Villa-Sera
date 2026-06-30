import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

// Serves guest guide HTML at /guest-guide. Route handler avoids static path + intl issues.
export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'guest-guide', 'index.html');
  const html = await readFile(filePath, 'utf-8');
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
