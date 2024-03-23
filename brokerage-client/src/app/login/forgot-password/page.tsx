// 'use client';
// import {
//   TextField,
//   Button,
//   Alert,
//   Box,
//   Grid,
//   Typography,
//   Paper,
//   styled,
// } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { sendPasswordResetEmail } from 'firebase/auth';
// import Image from 'next/image';
// import { useState } from 'react';
// import { auth } from '@/lib/firebase-config';
// import { LujoError } from '@/models/lujoError';
// import { ErrorHandlers } from '@/utils/errorHandler';

// const SignInPaper = styled(Paper)(({ theme }) => ({
//   width: 300,
//   height: 150,
//   padding: theme.spacing(2),
//   ...theme.typography.body2,
//   textAlign: 'center',
// }));

// export default function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [displayUnrecognizedEmailError, setDisplayUnrecognizedEmailError] =
//     useState(false);
//   const [displayUnknownError, setDisplayUnknownError] = useState(false);
//   const router = useRouter();

//   const handleForm = async (event: { preventDefault: () => void }) => {
//     event.preventDefault();
//     setDisplayUnrecognizedEmailError(false);
//     setDisplayUnknownError(false);

//     try {
//       sendPasswordResetEmail(auth, email);
//     } catch (error) {
//       const lujoError = LujoError.create(
//         'Error attempting to send password reset email',
//         'forgot password page',
//         941,
//       ).withCause(error);

//       ErrorHandlers.handleError(lujoError);
//       setDisplayUnknownError(true);
//     }

//     router.push('/login');
//   };

//   return (
//     <Box>
//       <Grid display="flex" xs={12} justifyContent="center" alignItems="center">
//         <Box textAlign="center">
//           <Image
//             alt="app logo"
//             src="/AppIcon.png"
//             width={117 * 2}
//             height={47 * 2}
//           />
//           <Typography variant="h5" style={{ margin: 10 }}>
//             Sign in to your account
//           </Typography>
//           <SignInPaper>
//             <Box display="flex" flexDirection="column">
//               <form onSubmit={handleForm}>
//                 <TextField
//                   id="email"
//                   label="email"
//                   variant="outlined"
//                   style={{ marginBottom: 15, minWidth: 250 }}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   type="email"
//                   placeholder="example@mail.com"
//                 />
//                 <Button variant="contained" type="submit">
//                   Send Forgot Password Email
//                 </Button>

//                 <Box style={{ marginTop: 10 }}>
//                   <Alert
//                     severity="error"
//                     style={{
//                       display: displayUnrecognizedEmailError ? 'flex' : 'none',
//                     }}
//                   >
//                     Unrecognized Email
//                   </Alert>
//                   <Alert
//                     severity="error"
//                     style={{ display: displayUnknownError ? 'flex' : 'none' }}
//                   >
//                     An unknown error occurred. Please try again
//                   </Alert>
//                 </Box>
//               </form>
//             </Box>
//           </SignInPaper>
//         </Box>
//       </Grid>
//     </Box>
//   );
// }
