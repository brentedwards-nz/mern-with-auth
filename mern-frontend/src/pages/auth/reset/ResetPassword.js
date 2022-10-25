import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Grid, Paper, Avatar, Typography, Link, TextField, Button } from '@mui/material'
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';

import { validateResetPasswordForm } from '../../../utils/validators';
import { verifyresettoken, resetpassword } from '../../../services/api';
import * as styles from '../../../styles/styles.module';

const ResetPassword = () => {
  const { token } = useParams();

  const [verifyingToken, setVerifyingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState({ isHidden: true, errorMessage: "" })

  useEffect(() => {
    setCanSubmit(
      validateResetPasswordForm({ password, confirmPassword })
    );
  }, [password, confirmPassword, setCanSubmit])

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await verifyresettoken({ token: token });
        if (response.error) {
          setResetPasswordError({ isHidden: false, errorMessage: response.exception?.response?.data })
        } else {
          console.log("Token was valid")
          setTokenValid(true);
          setResetPasswordError({ isHidden: true, errorMessage: "" });
        }
      } catch (err) {
        setResetPasswordError({ isHidden: false, errorMessage: err.data })
      }
      setVerifyingToken(false);
    }
    verifyToken();
  }, [token])

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await resetpassword({ token: token, password: password });
      if (response.error) {
        setResetPasswordError({ isHidden: false, errorMessage: response.exception?.response?.data })
      } else {
        setResetPasswordError({ isHidden: true, errorMessage: "" });
      }
    } catch (err) {
      setResetPasswordError({ isHidden: false, errorMessage: err.data })
    }
  }

  return (
    <Grid>
      <Paper elevation={10} style={{ ...styles.paperStyle, height: '40vh' }}>
        <Grid align="center">
          <Avatar style={styles.avatarStyle}><LockResetOutlinedIcon /></Avatar>
          <h2>Reset Password</h2>
        </Grid>
        <Typography
          sx={{ display: verifyingToken ? 'block' : 'none' }}
        >
          Verifying token...
        </Typography>
        <TextField
          variant="standard"
          label='New Password'
          placeholder='Enter new password'
          style={styles.textFieldStyle}
          type='password'
          fullWidth
          required
          disabled={verifyingToken || !tokenValid}
          InputLabelProps={{
            style: {
              color: "#117e6a",
            }
          }}
          onChange={handlePasswordChange}
        />
        <TextField
          variant="standard"
          label='Confirm Password'
          placeholder='Confirm password'
          style={styles.textFieldStyle}
          type='password'
          fullWidth
          required
          disabled={verifyingToken || !tokenValid}
          InputLabelProps={{
            style: {
              color: "#117e6a",
            }
          }}
          onChange={handleConfirmPasswordChange}
        />
        <Button
          type='submit'
          sx={{ color: '#117e6a', display: tokenValid ? 'block' : 'none' }}
          fullWidth
          onClick={handleResetPassword}
          disabled={!canSubmit}
        >
          Reset
        </Button>
        <Typography>
          <Link href="/login" underline="hover" style={styles.linkStyle}>
            Login?
          </Link>
        </Typography>
        <Typography hidden={resetPasswordError.isHidden} style={styles.authError}>
          Error: {resetPasswordError.errorMessage}
        </Typography>
      </Paper >
    </Grid >
  )
};

export default ResetPassword;