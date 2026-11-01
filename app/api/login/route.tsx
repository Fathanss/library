import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';


const registerSchema = z.object({
 email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
 password: z
   .string()
   .min(1, 'Password is required')
});


export async function POST(request: Request) {
 try {
   const body = await request.json();


   // Parse using Zod
   const result = registerSchema.safeParse(body);


   if (!result.success) {
     const errors: Record<string, string> = {};


     // Format Zod errors to match the frontend expectations
     result.error.issues.forEach((issue) => {
       const fieldName = issue.path[0] as string;
       // Only take the first error message for each field
       if (!errors[fieldName]) {
         errors[fieldName] = issue.message;
       }
     });


     return NextResponse.json({ success: false, errors }, { status: 400 });
   }

   if (body.email == 'admin@idev.com' && body.password == 'password') {
    // Simulated token for demonstration:
    const accessToken = "your_generated_or_supabase_access_token_here";

    // 2. Set the cookies so middleware.ts can read them
    const cookieStore = await cookies();
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax' as const,
    };

    cookieStore.set('sb-access-token', accessToken, cookieOptions);
    cookieStore.set('token', accessToken, cookieOptions);
     return NextResponse.json({ success: true, message: 'Login successful!' }, { status: 201 });
   }else {
     return NextResponse.json({ success: false, message: 'Email or password is wrong' }, { status: 400 });
   }

 } catch (error) {
   return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
 }
}

