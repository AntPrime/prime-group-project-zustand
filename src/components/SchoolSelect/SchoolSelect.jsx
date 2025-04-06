import { Select, MenuItem, Typography, Checkbox, ListItemText } from '@mui/material';

const SchoolSelect = ({ schools, selectedSchools, onChange }) => (
  <>
    <Typography variant="h6" sx={{ mb: 1 }}>Schools</Typography>
    <Select
      multiple
      fullWidth
      displayEmpty
      value={selectedSchools}
      onChange={(e) => onChange(e.target.value)}
      renderValue={(selected) => {
        if (selected.length === 0) {
          return <span style={{ color: '#aaa' }}>Select schools</span>;
        }
        const selectedNames = schools
          .filter(school => selected.includes(school.id))
          .map(school => school.name);
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
      {schools.map((school) => (
        <MenuItem key={school.id} value={school.id}>
          <Checkbox checked={selectedSchools.includes(school.id)} />
          <ListItemText primary={school.name} />
        </MenuItem>
      ))}
    </Select>
  </>
);

export default SchoolSelect;
