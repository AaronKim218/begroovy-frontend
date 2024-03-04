import { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/use-redux';
// import { TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {
    TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, Card, CardContent, Typography
} from '@mui/material';
import { userApi } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { User, UserCreation } from '../main.types';

export default function Profile() {
    const [pageStatus, setPageStatus] = useState('LOADING');
    const userState = useAppSelector(state => state.user);
    const [editFields, setEditFields] = useState({
        username: userState.user!.username,
        password: userState.user!.password,
        firstName: userState.user!.firstName,
        lastName: userState.user!.lastName,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [updateUser] = userApi.useUpdateUserMutation();
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteUser] = userApi.useDeleteUserMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userState.user!._id) {
            navigate('/login');
        } else {
            setPageStatus('SUCCESS');
        }
    }, [userState, navigate]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFields({ ...editFields, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const body: UserCreation = {
            username: editFields.username,
            password: editFields.password,
            firstName: editFields.firstName,
            lastName: editFields.lastName,
        };
        updateUser({ _id: userState.user!._id, body: body });
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Revert the edits
        setEditFields({
            username: userState.user!.username,
            password: userState.user!.password,
            firstName: userState.user!.firstName,
            lastName: userState.user!.lastName,
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        deleteUser(userState.user!._id);
        setOpenDialog(false);
        navigate('/');
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const renderEditField = (label: string, name: string, value: string) => (
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

    const PersonalInfo = () => {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Personal Info
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Username: {userState.user!.username}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Password: {userState.user!.password} {/* Consider hiding or not displaying the password */}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        First Name: {userState.user!.firstName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Last Name: {userState.user!.lastName}
                    </Typography>
                </CardContent>
            </Card>
        );
    };

    const Success = () => (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom component="div">Profile Page</Typography>
                {isEditing ? (
                    <>
                        {renderEditField("Username", "username", editFields.username)}
                        {renderEditField("Password", "password", editFields.password)}
                        {renderEditField("First Name", "firstName", editFields.firstName)}
                        {renderEditField("Last Name", "lastName", editFields.lastName)}
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