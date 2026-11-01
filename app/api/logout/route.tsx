import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete or expire the authentication cookies
    cookieStore.delete('token');
    cookieStore.delete('sb-access-token');

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}