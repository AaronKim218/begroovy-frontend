import { useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Button } from '@mui/material';
import { userApi } from '../api/api';

export default function Profile() {
    const user = useSelector(state => state.user);
    const [editFields, setEditFields] = useState({
        username: user.username,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        spotifyArtistId: user.spotifyArtistId,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [updateUser] = userApi.useUpdateUserMutation();

    const handleEditChange = (e) => {
        setEditFields({ ...editFields, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const body = {
            username: editFields.username,
            password: editFields.password,
            firstName: editFields.firstName,
            lastName: editFields.lastName,
            spotifyArtistId: editFields.spotifyArtistId,
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
            spotifyArtistId: user.spotifyArtistId,
        });
        setIsEditing(false);
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

    return (
        <div>
            <h1>Profile Page</h1>
            {isEditing ? (
                <>
                    {renderEditField("Username", "username", editFields.username)}
                    {renderEditField("Password", "password", editFields.password)}
                    {renderEditField("First Name", "firstName", editFields.firstName)}
                    {renderEditField("Last Name", "lastName", editFields.lastName)}
                    {user.role === "ARTIST" && renderEditField("Spotify Artist ID", "spotifyArtistId", editFields.spotifyArtistId)}
                    <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                    <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                </>
            ) : (
                <>
                    <p>Username: {user.username}</p>
                    <p>Password: {user.password}</p>
                    <p>First Name: {user.firstName}</p>
                    <p>Last Name: {user.lastName}</p>
                    {user.role === "ARTIST" && <p>Spotify Artist ID: {user.spotifyArtistId}</p>}
                    <Button variant="contained" onClick={() => setIsEditing(true)}>Edit</Button>
                </>
            )}
        </div>
    );
}