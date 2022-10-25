import { Grid, Paper, Avatar, TextField, Typography, Button, Link } from '@mui/material'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import HowToRegIcon from '@mui/icons-material/HowToReg';

import { validateRegisterForm } from '../../../utils/validators';
import { register } from '../../../services/api';
import useLocalStorage from '../../../hooks/useLocalStorage';
import * as styles from '../../../styles/styles.module';

const Register = () => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [registerError, setRegisterError] = useState({ isHidden: true, errorMessage: "" })
  const [userDetails, setUserDetails] = useLocalStorage('userDetails', {})

  const navigate = useNavigate();
  useEffect(() => {
    if (userDetails?.isLoggedIn) {
      navigate("/protected")
    }
  }, [userDetails, navigate])

  useEffect(() => {
    setCanSubmit(
      validateRegisterForm({ mail, password, confirmPassword, firstName, secondName })
    );
  }, [mail, password, confirmPassword, firstName, secondName, setCanSubmit])

  const handleEmailChange = (event) => {
    setMail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ email: mail, password: password, firstName: firstName, secondName: secondName });
      if (response.error) {
        const errorMessage = response.exception?.response?.data.length
          ? response.exception?.response?.data
          : "Server failed to respond";
        setRegisterError({ isHidden: false, errorMessage: errorMessage })
        setUserDetails({ isLoggedIn: false });
      } else {
        setRegisterError({ isHidden: true, errorMessage: "" });
        setUserDetails({
          isLoggedIn: true,
          email: mail,
          firstName: firstName,
          secondName: secondName
        });
      }
    } catch (err) {
      setRegisterError({ isHidden: false, errorMessage: err.data })
      setUserDetails({ isLoggedIn: false });
    }
  }

  return (
    <Grid>
      <Paper elevation={10} style={styles.registerPage.paperStyle}>
        <Grid align="center">
          <Avatar style={styles.avatarStyle}><HowToRegIcon /></Avatar>
          <h2>Register</h2>
        </Grid>
        <TextField
          variant="standard"
          label='First Name'
          placeholder='Enter first name'
          style={styles.textFieldStyle}
          fullWidth
          required
          InputLabelProps={{
            style: {
              color: "#117e6a",
            }
          }}
          onChange={e => setFirstName(e.target.value)}
        />
        <TextField
          variant="standard"
          label='Second Name'
          placeholder='Enter second name'
          style={styles.textFieldStyle}
          fullWidth
          required
          InputLabelProps={{
            style: {
              color: "#117e6a",
            }
          }}
          onChange={e => setSecondName(e.target.value)}
        />
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
        <TextField
          variant="standard"
          label='Confirm Password'
          placeholder='Confirm password'
          style={styles.textFieldStyle}
          type='password'
          fullWidth
          required
          InputLabelProps={{
            style: {
              color: "#117e6a",
            }
          }}
          onChange={handleConfirmPasswordChange}
        />
        <Button
          type='submit'
          sx={{ color: '#117e6a' }}
          fullWidth
          onClick={handleRegister}
          disabled={!canSubmit}
        >
          Register
        </Button>
        <Typography>
          <Link href="/login" underline="hover" style={styles.linkStyle}>
            Already Registered?
          </Link>
        </Typography>
        <Typography hidden={registerError.isHidden} style={styles.authError}>
          Error: {registerError.errorMessage}
        </Typography>
      </Paper >
    </Grid >
  )
};

export default Register;