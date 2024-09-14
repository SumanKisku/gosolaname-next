import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Revalidate the path
    revalidatePath('/dashboard', 'page');

    // Return a success response
    return NextResponse.json({ message: 'Revalidated' });
  } catch (error: unknown) {
    // Check if error is an instance of Error
    if (error instanceof Error) {
      // Handle the error with message and stack
      return NextResponse.json({ message: 'Not able to revalidate', error: error.message }, { status: 500 });
    } else {
      // Handle unexpected error types
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
