import { NextRequest, NextResponse } from 'next/server';
import { LoginData } from '../../login/page';
import { signIn } from '../../../serverUtils/loginUser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    console.log('LOGIN!');
    console.log(request);
    const payload = formData.get('loginData') as string | null;
    if (!payload) {
      return NextResponse.json(
        { error: 'loginData is missing' },
        { status: 400 },
      );
    }
    const loginPayload = JSON.parse(payload) as LoginData;

    const user = await signIn(loginPayload);

    return NextResponse.json(user, { status: 200 });
  } catch {}
}
