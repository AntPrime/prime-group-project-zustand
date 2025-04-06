import React from 'react';
import { Select, MenuItem, Typography } from '@mui/material';

function ActivitySelect({ activities, newEvent, setNewEvent }) {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Select Activity
      </Typography>
      <Select
        fullWidth
        value={newEvent.activities_id || ''}
        onChange={(e) => setNewEvent({ ...newEvent, activities_id: e.target.value })}
        displayEmpty
        sx={{
          backgroundColor: '#F2F4F5',
          mb: 2,
          borderRadius: '8px',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px solid #b0b0b0',
          },
        }}
      >
        <MenuItem value="">Select Activity</MenuItem>
        {activities.map((activity) => (
          <MenuItem key={activity.id} value={activity.id}>
            {activity.activity}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

export default ActivitySelect;



