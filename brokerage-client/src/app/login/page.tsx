'use client';
import {
  Box,
  Divider,
  Paper,
  Typography,
  styled,
  TextField,
  CircularProgress,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Bolt from '@mui/icons-material/Bolt';
import { getJwtToken } from '../../serverUtils/loginUser';
// import SignInWithGoogle from './components/SignInWithGoogle';
// import SignInWithEmailPassword from './components/SignInWithEmailPassword';

const SignInPaper = styled(Paper)(({ theme }) => ({
  width: 300,
  height: 350,
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
}));
export type LoginData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitButtonEnabled, setSubmitButtonEnabled] =
    useState<boolean>(true);
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setSubmitButtonEnabled(false);
      const loginData: LoginData = {
        email: email,
        password: password,
      };
      const formData = new FormData();
      formData.append('loginData', JSON.stringify(loginData));
      const response = await fetch('api/login', {
        method: 'POST',
        body: formData,
      });
      const user = await response.json();
      const jwtToken = user.jwt;
      document.cookie = `jwtToken=${jwtToken}; path=/;`;
      getJwtToken();

      router.push('/positions');
    } catch (error) {
      // ErrorHandlers.handleError(error);
      console.error(error);
    } finally {
      setSubmitButtonEnabled(true);
    }
  };

  return (
    <Box>
      <Grid display="flex" xs={12} justifyContent="center" alignItems="center">
        <Box textAlign="center">
          <Typography variant="h5" style={{ margin: 10 }}>
            Sign in to your account
          </Typography>

          <SignInPaper>
            <Box display="flex" flexDirection="column">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} mt={3}>
                  <Grid xs={12} md={6}>
                    <TextField
                      variant="standard"
                      id="email"
                      label="Email"
                      // placeholder="i.e. 2019 Audi Q7"
                      sx={{ minWidth: { xs: '80%', md: '50%' } }}
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      variant="standard"
                      id="password"
                      label="Password"
                      type="password"
                      // placeholder="i.e. 2019 Audi Q7"
                      sx={{ minWidth: { xs: '80%', md: '50%' } }}
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                  </Grid>
                </Grid>

                {/* <SignInWithEmailPassword /> */}
                <Divider style={{ margin: 15 }}></Divider>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    isSubmitButtonEnabled ? <Bolt /> : <CircularProgress />
                  }
                  fullWidth
                  sx={{ maxWidth: { xs: '80%', md: '30%' } }}
                  disabled={!isSubmitButtonEnabled}
                >
                  Submit
                </Button>
                {/* <SignInWithGoogle /> */}
              </form>
            </Box>
          </SignInPaper>
        </Box>
      </Grid>
    </Box>
  );
}
