import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { 
    TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
    Grid, Card, CardContent, Typography 
} from '@mui/material';
import { userApi } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [pageStatus, setPageStatus] = useState('LOADING');
    const user = useSelector(state => state.user);
    const [editFields, setEditFields] = useState({
        username: user.username,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        spotifyId: user.spotifyId,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [updateUser] = userApi.useUpdateUserMutation();
    const [openDialog, setOpenDialog] = useState(false); 
    const [deleteUser] = userApi.useDeleteUserMutation();
    const { data: listenerStats, error: listenerError } = userApi.useGetListenerStatsByIdQuery(user._id, {
        skip: user.role === "ARTIST",
    });
    
    const { data: artistStats, error: artistError } = userApi.useGetArtistStatsByIdQuery({ _id: user._id, spotifyId: user.spotifyId }, {
        skip: user.role === "LISTENER",
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role === 'LISTENER' && listenerStats !== undefined) {
            setPageStatus('SUCCESS');
        } else if (user.role === 'ARTIST' && artistStats !== undefined) {
            setPageStatus('SUCCESS');
        } else if (user.role === 'LISTENER' && listenerError) {
            setPageStatus('ERROR');
        } else if (user.role === 'ARTIST' && artistError) {
            setPageStatus('ERROR');
        }
    }, [user, listenerStats, artistStats, listenerError, artistError]);

    useEffect(() => {
        if (!user._id) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleEditChange = (e) => {
        setEditFields({ ...editFields, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const body = {
            username: editFields.username,
            password: editFields.password,
            firstName: editFields.firstName,
            lastName: editFields.lastName,
            spotifyId: editFields.spotifyId,
        };
        updateUser({ _id: user._id, body: body });
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Revert the edits
        setEditFields({
            username: user.username,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            spotifyId: user.spotifyId,
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        deleteUser(user._id);
        setOpenDialog(false);
        navigate('/');
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const renderEditField = (label, name, value) => (
        <TextField
            label={label}
            variant="outlined"
            name={name}
            value={value}
            onChange={handleEditChange}
            margin="normal"
            fullWidth
        />
    );

    const StatsCard = ({ title, stats }) => (
        <Card sx={{ minWidth: 275, marginBottom: 2 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                {Object.entries(stats).map(([key, value]) => (
                    <Typography variant="body2" key={key}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
                    </Typography>
                ))}
            </CardContent>
        </Card>
    );

    const PersonalInfo = () => {
        return (
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Personal Info
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Username: {user.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Password: {user.password} {/* Consider hiding or not displaying the password */}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                First Name: {user.firstName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Last Name: {user.lastName}
              </Typography>
              {user.role === "ARTIST" && (
                <Typography variant="body1" color="text.secondary">
                  Spotify Artist ID: {user.spotifyId}
                </Typography>
              )}
            </CardContent>
          </Card>
        );
      };

    const Success = () => (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom component="div">Profile Page</Typography>
                {user.role === 'LISTENER' && <StatsCard title="Listener Stats" stats={listenerStats} />}
                {user.role === 'ARTIST' && <StatsCard title="Artist Stats" stats={artistStats} />}
                {isEditing ? (
                    <>
                        {renderEditField("Username", "username", editFields.username)}
                        {renderEditField("Password", "password", editFields.password)}
                        {renderEditField("First Name", "firstName", editFields.firstName)}
                        {renderEditField("Last Name", "lastName", editFields.lastName)}
                        {user.role === "ARTIST" && renderEditField("Spotify Artist ID", "spotifyId", editFields.spotifyId)}
                        <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                        <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                    </>
                ) : (
                    <>
                        <PersonalInfo />
                        <Button variant="contained" onClick={() => setIsEditing(true)}>Edit</Button>
                        <Button variant="contained" color="error" onClick={handleOpenDialog}>Delete</Button>
    
                        <Dialog open={openDialog} onClose={handleCloseDialog}>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete your account? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                                <Button onClick={handleDelete} color="secondary">Delete</Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Grid>
        </Grid>
    );

    switch (pageStatus) {
        case 'LOADING':
            return <h1>Loading...</h1>;
        case 'SUCCESS':
            return <Success />;
        case 'ERROR':
            return <h1>Error</h1>;
        default:
            return <h1>Something went wrong</h1>;
    }
}