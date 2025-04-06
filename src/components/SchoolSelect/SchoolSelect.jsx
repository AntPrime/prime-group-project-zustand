import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const SchoolSelect = ({ schools, selectedSchools, onChange }) => {
  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel>School</InputLabel>
      <Select
        value={selectedSchools[0] || ""}  // Bind the selected school here
        onChange={(e) => onChange([e.target.value])}  // Update selectedSchools when a school is selected
        label="School"
      >
        {schools.map((school) => (
          <MenuItem key={school.id} value={school.id}>
            {school.name}  {/* Make sure this matches the field name in your school object */}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SchoolSelect;

