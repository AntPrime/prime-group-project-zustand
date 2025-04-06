import { Select, MenuItem, Typography, Checkbox, ListItemText } from '@mui/material';

const ActivitySelect = ({ activities, selectedActivities, onChange }) => (
  <>
    <Typography variant="h6" sx={{ mb: 1 }}>Activities</Typography>
    <Select
      multiple
      fullWidth
      displayEmpty
      value={selectedActivities}
      onChange={(e) => onChange(e.target.value)}
      renderValue={(selected) => {
        if (selected.length === 0) {
          return <span style={{ color: '#aaa' }}>Select activities</span>;
        }
        const selectedNames = activities
          .filter(activity => selected.includes(activity.id))
          .map(activity => activity.activity);
        return selectedNames.join(', ');
      }}
      sx={{
        backgroundColor: '#F2F4F5',
        mb: 2,
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { border: 'none' },
          '&:hover fieldset': { border: 'none' },
          '&.Mui-focused fieldset': { border: '2px solid #b0b0b0' },
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
  </>
);

export default ActivitySelect;



