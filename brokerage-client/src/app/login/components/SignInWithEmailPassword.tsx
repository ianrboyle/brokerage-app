// 'use client';
// import { TextField, Button, Alert, Box, Link } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import signIn from '../utils/signIn';

// export default function SignInWithEmailPassword() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [displayEmailOrPasswordError, setDisplayEmailOrPasswordError] =
//     useState(false);
//   const [displayUnknownError, setDisplayUnknownError] = useState(false);
//   const router = useRouter();

//   const handleForm = async (event: { preventDefault: () => void }) => {
//     event.preventDefault();
//     setDisplayEmailOrPasswordError(false);
//     setDisplayUnknownError(false);

//     const { result, error } = await signIn(email, password);

//     if (error) {
//       if (
//         (error as any)?.code === 'auth/wrong-password' ||
//         (error as any)?.code === 'auth/user-not-found'
//       ) {
//         setDisplayEmailOrPasswordError(true);
//       } else {
//         setDisplayUnknownError(true);
//       }

//       return;
//     }

//     if (!result) {
//       setDisplayUnknownError(true);
//       return;
//     }

//     fetch('/api/login', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${await result.user.getIdToken()}`,
//       },
//     }).then((response) => {
//       if (response.status === 200) {
//         router.push('/protected');
//       }
//     });
//   };

//   return (
//     <>
//       <form onSubmit={handleForm}>
//         <TextField
//           id="email"
//           label="email"
//           variant="outlined"
//           style={{ marginBottom: 15, minWidth: 250 }}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           type="email"
//           placeholder="example@mail.com"
//         />
//         <TextField
//           id="password"
//           label="password"
//           variant="outlined"
//           style={{ marginBottom: 5, minWidth: 250 }}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           type="password"
//         />
//         <Box textAlign={'start'} sx={{ ml: 1, mb: 2 }}>
//           <Link
//             component="button"
//             variant="body2"
//             onClick={(e) => {
//               e.preventDefault();
//               router.push('/login/forgot-password');
//             }}
//             underline="none"
//             type="button"
//           >
//             Forgot password?
//           </Link>
//         </Box>
//         <Button variant="contained" type="submit">
//           Sign in
//         </Button>

//         <Box style={{ marginTop: 10 }}>
//           <Alert
//             severity="error"
//             style={{ display: displayEmailOrPasswordError ? 'flex' : 'none' }}
//           >
//             Wrong email or password
//           </Alert>
//           <Alert
//             severity="error"
//             style={{ display: displayUnknownError ? 'flex' : 'none' }}
//           >
//             An unknown error occurred. Please try again
//           </Alert>
//         </Box>
//       </form>
//     </>
//   );
// }
