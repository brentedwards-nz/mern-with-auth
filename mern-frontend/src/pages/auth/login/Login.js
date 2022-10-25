import { Grid, Paper, Avatar, TextField, Typography, Button, Link } from '@mui/material'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { validateLoginForm } from '../../../utils/validators';
import { login } from '../../../services/api';
import useLocalStorage from '../../../hooks/useLocalStorage';
import * as styles from '../../../styles/styles.module';

const Login = () => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState({ isHidden: true, errorMessage: "" })

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useLocalStorage('userDetails', {})

  useEffect(() => {
    if (userDetails?.isLoggedIn) {
      navigate("/protected")
    }
  }, [userDetails, navigate])

  useEffect(() => {
    setCanSubmit(
      validateLoginForm({ mail, password })
    );
  }, [mail, password, setCanSubmit])

  const handleEmailChange = (event) => {
    setMail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email: mail, password: password });
      if (response.error) {
        const errorMessage = response.exception?.response?.data.length
          ? response.exception?.response?.data
          : "Server failed to respond";
        setLoginError({ isHidden: false, errorMessage: errorMessage })
      } else {
        const email = response?.data?.userDetails?.email;
        const firstName = response?.data?.userDetails?.firstName;
        const secondName = response?.data?.userDetails?.secondName;
        const isLoggedIn = true;

        setLoginError({ isHidden: true, errorMessage: "" });
        setUserDetails({
          isLoggedIn: isLoggedIn,
          email: email,
          firstName: firstName,
          secondName: secondName
        });
      }
    } catch (err) {
      setLoginError({ isHidden: false, errorMessage: err.data })
    }
  }

  return (
    <Grid>
      <Paper elevation={10} style={styles.loginPage.paperStyle}>
        <Grid align="center">
          <Avatar style={styles.avatarStyle}><LockOutlinedIcon /></Avatar>
          <h2>Log In</h2>
        </Grid>
        <TextField
          variant="standard"
          label='Email'
          placeholder='Enter email'
          style={styles.textFieldStyle}
          fullWidth
          required
          InputLabelProps={{
            style: {
              color: "#117e6a",
            }
          }}
          onChange={handleEmailChange}
        />
        <TextField
          variant="standard"
          label='Password'
          placeholder='Enter password'
          style={styles.textFieldStyle}
          type='password'
          fullWidth
          required
          InputLabelProps={{
            style: {
              color: "#117e6a",
            }
          }}
          onChange={handlePasswordChange}
        />
        <Button
          type='submit'
          sx={{ color: '#117e6a' }}
          fullWidth
          onClick={handleLogin}
          disabled={!canSubmit}
        >
          Log In
        </Button>
        <Typography>
          <Link href="/reset" underline="hover" style={styles.linkStyle}>
            Forgot password?
          </Link>
        </Typography>
        <Typography>
          <Link href="/register" underline="hover" style={styles.linkStyle}>
            Register?
          </Link>
        </Typography>
        <Typography hidden={loginError.isHidden} style={styles.authError}>
          Error: {loginError.errorMessage}
        </Typography>
      </Paper >
    </Grid >
  )
};

export default Login;