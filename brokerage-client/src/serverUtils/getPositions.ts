import { setCookie } from 'nookies';
import { cookies } from 'next/headers';
export async function getPositions(jwtToken: string, url: string) {
  // const jwtToken = getJwtToken();
  if (!jwtToken) {
    throw new Error('JWT token not found in cookie');
  }
  setCookie(null, 'Authentication', jwtToken, {
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    path: '/', // adjust the path as needed
  });

  const cookieStore = cookies();
  console.log('COOKEI STORE', cookieStore.getAll());

  let result = null,
    error = null;
  try {
    console.log('Positions url: ', process.env.POSITIONS_SERVICE_URL);
    result = await fetch(`${url!}/positions/sectors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!result.ok) {
      throw new Error(`Failed to fetch positions: ${result.statusText}`);
    }

    const data = await result.json();
    return { result: data, error: null };
  } catch (e) {
    error = e;
    return { result: null, error: error };
  }
}
