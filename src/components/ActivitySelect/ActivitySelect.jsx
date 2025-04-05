// ActivitySelect.js (new component for multi-select)
import React from 'react';
import { Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

function ActivitySelect({ activities, selectedActivities, handleActivityChange }) {
  return (
    <Select
      multiple
      value={selectedActivities}
      onChange={handleActivityChange}
      renderValue={(selected) => {
        const selectedNames = activities
          .filter(activity => selected.includes(activity.id))
          .map(activity => activity.activity);
        return selectedNames.join(', ') || 'No activities selected';
      }}
      sx={{
        backgroundColor: '#F2F4F5',
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { border: 'none' },
          '&:hover fieldset': { border: 'none' },
          '&.Mui-focused fieldset': { border: '2px solid #b0b0b0' },
        },
        '& .MuiCheckbox-root': {
          color: '#081C32', // Dark blue checkmarks
        },
        '& .Mui-checked': {
          color: '#081C32', // Dark blue checked state
        },
      }}
    >
      {activities.map((activity) => (
        <MenuItem key={activity.id} value={activity.id}>
          <Checkbox checked={selectedActivities.includes(activity.id)} />
          <ListItemText primary={activity.activity} />
        </MenuItem>
      ))}
    </Select>
  );
}

export default ActivitySelect;
