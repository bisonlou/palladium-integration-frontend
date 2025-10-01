import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

// 3rd party libraries
import {
    Paper, Grid, withStyles, Snackbar, Button,
    Typography, CircularProgress, FormControl,
    InputLabel, Input, InputAdornment, IconButton
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// custom components
import NavBar from '../NavBar';

// util
import { BASE_URL } from '../../utils';

// styles
import { LandingStyles } from '../../layout/landing/landingStyles';

const ResetPassword = ({ classes }) => {
    const location = useLocation();
    const history = useHistory();
    
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [error, setError] = useState({
        'isError': false,
        'message': ''
    });
    const [success, setSuccess] = useState({
        'isSuccess': false,
        'message': ''
    });

    useEffect(() => {
        // Extract token from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            setTokenValid(true);
        } else {
            setError({
                'isError': true,
                'message': 'Invalid password reset link. Please request a new password reset.'
            });
        }
        setValidating(false);
    }, [location]);

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'Password must contain at least one number';
        }
        return null;
    };

    const handlePasswordChange = event => {
        const { value } = event.target;
        setNewPassword(value);
    };

    const handleConfirmPasswordChange = event => {
        const { value } = event.target;
        setConfirmPassword(value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const handleResetPassword = () => {
        // Validate password
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError({
                'isError': true,
                'message': passwordError
            });
            return;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setError({
                'isError': true,
                'message': 'Passwords do not match'
            });
            return;
        }

        setLoading(true);

        const data = {
            'token': token,
            'new_password': newPassword
        };

        fetch(`${BASE_URL}/reset-password`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data['success'] === true) {
                    setSuccess({
                        'isSuccess': true,
                        'message': data['description'] || 'Password has been successfully reset'
                    });
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        history.push('/');
                    }, 3000);
                } else {
                    setError({
                        'isError': true,
                        'message': data['description'] || 'Failed to reset password. The link may have expired.'
                    });
                }
            })
            .catch(error => {
                setLoading(false);
                setError({
                    'isError': true,
                    'message': 'Unable to connect to the server. Please try again later.'
                });
            });
    };

    const handleSnackBarClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setError({
            'isError': false,
            'message': ''
        });

        setSuccess({
            'isSuccess': false,
            'message': ''
        });
    };

    const handleBackToLogin = () => {
        history.push('/');
    };

    if (validating) {
        return (
            <div>
                <NavBar />
                <Grid container className={classes.root} justify="center" alignItems="center">
                    <CircularProgress />
                </Grid>
            </div>
        );
    }

    return (
        <div>
            <NavBar />

            <Snackbar
                open={error.isError}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackBarClose}
                    severity="error"
                >
                    {error.message}
                </MuiAlert>
            </Snackbar>

            <Snackbar
                open={success.isSuccess}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackBarClose}
                    severity="success"
                >
                    {success.message}
                </MuiAlert>
            </Snackbar>

            <Grid container className={classes.root}>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <Paper square style={{ padding: 20 }}>
                        <Typography variant="h5" component="h1" gutterBottom align="center">
                            Reset Password
                        </Typography>
                        
                        {!tokenValid ? (
                            <div>
                                <Typography variant="body1" color="error" align="center" paragraph>
                                    This password reset link is invalid or has expired.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleBackToLogin}
                                    className={classes.button}
                                >
                                    Back to Login
                                </Button>
                            </div>
                        ) : (
                            <Grid container justify="center" spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl className={classes.textField}>
                                        <InputLabel htmlFor="new-password">New Password</InputLabel>
                                        <Input
                                            id="new-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={handlePasswordChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl className={classes.textField}>
                                        <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                                        <Input
                                            id="confirm-password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowConfirmPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" color="textSecondary">
                                        Password must be at least 8 characters and contain uppercase, lowercase, and numeric characters.
                                    </Typography>
                                </Grid>

                                <Grid item xs={8}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleResetPassword}
                                        disabled={loading || !newPassword || !confirmPassword}
                                        className={classes.button}
                                    >
                                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Reset Password'}
                                    </Button>
                                </Grid>

                                <Grid item xs={8}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        fullWidth
                                        onClick={handleBackToLogin}
                                        className={classes.button}
                                    >
                                        Back to Login
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={4}></Grid>
            </Grid>
        </div>
    );
};

export default withStyles(LandingStyles)(ResetPassword);