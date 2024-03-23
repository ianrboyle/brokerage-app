import { NextRequest, NextResponse } from 'next/server';
import { getPositions } from '../../../serverUtils/getPositions';

export async function GET(request: NextRequest) {
  console.log('HELLO!!!');
  console.log(request);
  try {
    // const formData = await request.formData();
    // const jwt = formData.get('jwt') as string | null;
    // if (!jwt) {
    //   return NextResponse.json(
    //     { error: 'loginData is missing' },
    //     { status: 400 },
    //   );
    // }
    // console.log('JWT: ', jwt);
    const positions = await getPositions(
      'jwt,',
      process.env.POSITIONS_SERVICE_URL!,
    );
    console.log('Positions: ', positions);

    return NextResponse.json(positions, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'loginData is missing' },
      { status: 400 },
    );
  }
}
