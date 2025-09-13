import { NextRequest, NextResponse } from 'next/server';
import { addToWaitlist, getWaitlistCount } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const id = await addToWaitlist(email);
    const count = await getWaitlistCount();

    return NextResponse.json({
      success: true,
      id,
      count,
      message: 'Successfully added to waitlist!'
    });
  } catch (error: any) {
    if (error.message === 'Email already exists in waitlist') {
      return NextResponse.json(
        { error: 'Email already exists in waitlist' },
        { status: 409 }
      );
    }

    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await getWaitlistCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Get waitlist count error:', error);
    return NextResponse.json(
      { error: 'Failed to get waitlist count' },
      { status: 500 }
    );
  }
}
