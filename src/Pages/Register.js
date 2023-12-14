import { Container, Paper, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userApi } from '../api/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

export default function Register() {
    const [role, setRole] = useState('LISTENER');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [spotifyArtistId, setSpotifyArtistId] = useState('');
    const [createUser] = userApi.useCreateUserMutation();
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // Implement registration logic here
        console.log({ username, password, firstName, lastName, role, spotifyArtistId });
        if (role === 'LISTENER') {
            createUser({ username, password, firstName, lastName, role })
                .unwrap()
                .then((data) => {
                    console.log(data);
                    dispatch(setUser(data));
                    navigate('/posts');
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            createUser({ username, password, firstName, lastName, role, spotifyArtistId })
                .unwrap()
                .then((data) => {
                    console.log(data);
                    dispatch(setUser(data));
                    navigate('/posts');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} style={{ padding: 16, marginTop: 8 }}>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl component="fieldset" style={{ marginTop: 8 }}>
                        <FormLabel component="legend">User Type</FormLabel>
                        <RadioGroup
                            row
                            aria-label="user type"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <FormControlLabel value="LISTENER" control={<Radio />} label="Listener" />
                            <FormControlLabel value="ARTIST" control={<Radio />} label="Artist" />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="firstName"
                        label="First Name"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="lastName"
                        label="Last Name"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    {role === 'ARTIST' && (
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="spotifyArtistId"
                            label="Spotify Artist ID"
                            id="spotifyArtistId"
                            value={spotifyArtistId}
                            onChange={(e) => setSpotifyArtistId(e.target.value)}
                        />
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ margin: '8px 0' }}
                    >
                        Register
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}