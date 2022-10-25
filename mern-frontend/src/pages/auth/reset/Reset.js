import { useState, useEffect } from 'react';
import { Grid, Paper, Avatar, Typography, Link, TextField, Button } from '@mui/material'
import * as styles from '../../../styles/styles.module';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';

import { validateResetForm } from '../../../utils/validators'
import { reset } from '../../../services/api';

function Reset() {
  const [canSubmit, setCanSubmit] = useState(false);
  const [mail, setMail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [resetError, setResetError] = useState({ isHidden: true, errorMessage: "" })

  useEffect(() => {
    setCanSubmit(
      !isProcessed && !isProcessing && validateResetForm({ mail })
    );
  }, [mail, isProcessing, isProcessed, setCanSubmit])

  const handleReset = async (e) => {
    setIsProcessing(true);
    e.preventDefault();
    try {
      const response = await reset({ email: mail });
      if (response.error) {
        setResetError({ isHidden: false, errorMessage: response.exception?.message })
      } else {
        setIsProcessed(true);
        setResetError({ isHidden: true, errorMessage: "" });
      }
    } catch (err) {
      setResetError({ isHidden: false, errorMessage: err.data })
    }
    setIsProcessing(false);
  }

  return (
    <Grid>
      <Paper elevation={10} style={styles.resetPage.paperStyle}>
        <Grid align="center">
          <Avatar style={styles.avatarStyle}><LockResetOutlinedIcon /></Avatar>
          <h2>Reset Password</h2>
          <TextField
            variant="standard"
            label='Email'
            placeholder='Enter email'
            style={styles.textFieldStyle}
            fullWidth
            required
            disabled={isProcessing || isProcessed}
            InputLabelProps={{
              style: {
                color: "#117e6a",
              }
            }}
            onChange={e => setMail(e.target.value)}
          />
          <Button
            type='submit'
            sx={{ color: '#117e6a' }}
            fullWidth
            onClick={handleReset}
            disabled={!canSubmit}
          >
            Send Reset Email
          </Button>
          <Typography hidden={!isProcessed} style={styles.authMessage}>
            Please check your email for a reset link
          </Typography>
        </Grid>
        <Typography>
          <Link href="/login" underline="hover" style={styles.linkStyle}>
            Log in
          </Link>
        </Typography>
        <Typography hidden={resetError.isHidden} style={styles.authError}>
          Error: {resetError.errorMessage}
        </Typography>
      </Paper >
    </Grid >
  )
}

export default Reset