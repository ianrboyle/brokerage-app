import { LoginData } from '../app/login/page';

export async function signIn(loginData: LoginData) {
  let result = null,
    error = null;
  try {
    console.log(loginData);
    result = await fetch(`${process.env.AUTH_SERVICE_URL!}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    if (result.status !== 201) {
      throw new Error(`Failed to sign in: ${result.status}`);
    }

    // If response status is 201 Created, extract JWT from response headers and save it in a cookie
    const jwtCookie = result.headers.get('set-cookie');
    const jwt = jwtCookie?.split(';')[0].split('=')[1]; // Extract JWT from cookie

    // Save JWT token in a cookie

    const data = { jwt };

    return data;
  } catch (e) {
    error = e;
    console.error(error);
    return { result: null, error };
  }
}

export function getJwtToken() {
  const cookies = document.cookie.split('; ');
  const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwtToken='));
  return jwtCookie ? jwtCookie.split('=')[1] : null;
}
