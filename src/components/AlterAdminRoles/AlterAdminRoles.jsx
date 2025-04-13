import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function AlterAdminRoles() {
  const [usersList, setUsersList] = useState([]);
  const [filters, setFilters] = useState({
    username: '',
    adminLevel: ''
  });
  const [editOpen, setEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editAdminLevel, setEditAdminLevel] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("/api/alterAdmin")
      .then((response) => {
        setUsersList(response.data);
      })
      .catch((err) => {
        console.error("GET /api/alterAdmin error:", err);
        showSnackbar('Failed to fetch users: ' + (err.response?.data?.error || err.message), 'error');
      });
  };

  const getRoleLabel = (adminLevel) => {
    switch(adminLevel) {
      case 1: return 'Admin';
      case 2: return 'Super Admin';
      default: return 'User';
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFilteredUsers = () => {
    return usersList.filter(user => {
      const matchesUsername = user.username.toLowerCase().includes(filters.username.toLowerCase());
      const matchesRole = filters.adminLevel === '' || 
        (filters.adminLevel === 'null' ? user.admin_level === null : 
         user.admin_level === parseInt(filters.adminLevel));
      return matchesUsername && matchesRole;
    });
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setEditAdminLevel(user.admin_level !== null ? user.admin_level.toString() : 'null');
    setEditOpen(true);
  };

  const handleSaveRole = () => {
    const payload = {
      userId: currentUser.username,  // Assuming username is the identifier
      admin_level: editAdminLevel === 'null' ? null : parseInt(editAdminLevel)
    };

    axios.put(`/api/alterAdmin/${currentUser.username}`, payload)
      .then(() => {
        fetchUsers();
        showSnackbar('Admin level updated successfully');
        setEditOpen(false);
      })
      .catch(err => {
        console.error('Error updating admin level:', err);
        showSnackbar('Failed to update admin level: ' + (err.response?.data?.error || err.message), 'error');
      });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleClearFilters = () => {
    setFilters({
      username: '',
      adminLevel: ''
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, borderBottom: '2px solid #3498db', pb: 1, mb: 5 }}>
        Alter Admin Levels
      </Typography>
  
      {/* Filter Controls */}
      <Paper sx={{ p: 4, mb: 10, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)', borderRadius: '3px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Filter by Username"
              value={filters.username}
              onChange={(e) => handleFilterChange('username', e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '3px',
                  backgroundColor: 'white',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Admin Level</InputLabel>
              <Select
                value={filters.adminLevel}
                onChange={(e) => handleFilterChange('adminLevel', e.target.value)}
                label="Filter by Admin Level"
                sx={{ borderRadius: '3px', backgroundColor: 'white' }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="null">User</MenuItem>
                <MenuItem value="1">Admin</MenuItem>
                <MenuItem value="2">Super Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClearFilters}
              sx={{
                bgcolor: '#3498db',
                '&:hover': { bgcolor: '#2980b9' },
                textTransform: 'none',
                borderRadius: '3px',
                px: 3,
                py: 1.9, 
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
  
      {/* Users Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#3498db' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: '600' }}>Username</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: '600' }}>Admin Level</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: '600' }}>Update Admin Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredUsers().map((user) => (
              <TableRow key={user.username} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{getRoleLabel(user.admin_level)}</TableCell>
                <TableCell align="right"
                        sx={{ paddingRight: '100px', width: '180px',}}>
                  <IconButton onClick={() => handleEditClick(user)} sx={{ color: '#3498db' }}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  
      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: '600', color: '#2c3e50' }}>
          Edit Admin Level
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Admin Level</InputLabel>
            <Select
              value={editAdminLevel}
              onChange={(e) => setEditAdminLevel(e.target.value)}
              label="Admin Level"
              sx={{ borderRadius: '5px' }}
            >
              <MenuItem value="null">User</MenuItem>
              <MenuItem value="1">Admin</MenuItem>
              <MenuItem value="2">Super Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ pt: 2 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: '#7f8c8d' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveRole}
            variant="contained"
            color="primary"
            sx={{
              bgcolor: '#3498db',
              '&:hover': { bgcolor: '#2980b9' },
              borderRadius: '5px',
              px: 3,
              textTransform: 'none',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
  
      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
  
}

export default AlterAdminRoles;