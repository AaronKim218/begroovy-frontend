import { Button, TextField, Link, Grid, Paper, Typography, Container } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authApi } from '../api/api';
import { setUser } from '../store/userSlice';
import { useDispatch } from 'react-redux';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login] = authApi.useLoginMutation();
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('username: ' + username);
        console.log('password: ' + password);
        login({ username, password })
            .unwrap()
            .then((data) => {
                console.log(data);
                dispatch(setUser(data));
                navigate('/posts');
            })

        navigate('/posts');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} style={{ padding: 16 }}>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            {/* Add other links if necessary */}
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Don't have an account? Register here"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}