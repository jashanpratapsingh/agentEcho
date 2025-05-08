import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AuthenticatedUser } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data', 'users');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const userData: AuthenticatedUser = await req.json();
    const filePath = path.join(DATA_DIR, `${userData.telegram.id}.json`);

    await fs.promises.writeFile(
      filePath,
      JSON.stringify({ ...userData, updatedAt: new Date().toISOString() }, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Storage error:', error);
    return NextResponse.json({ error: 'Failed to store user data' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      // Return all users if no ID is provided
      const files = await fs.promises.readdir(DATA_DIR);
      const users: AuthenticatedUser[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(DATA_DIR, file);
          const data = await fs.promises.readFile(filePath, 'utf-8');
          users.push(JSON.parse(data));
        }
      }

      return NextResponse.json(users);
    }

    const filePath = path.join(DATA_DIR, `${id}.json`);
    const data = await fs.promises.readFile(filePath, 'utf-8');
    
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Storage error:', error);
    return NextResponse.json({ error: 'Failed to retrieve user data' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Storage error:', error);
    return NextResponse.json({ error: 'Failed to delete user data' }, { status: 500 });
  }
} 