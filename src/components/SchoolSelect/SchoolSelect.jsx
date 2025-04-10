import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';


const SchoolSelect = ({ schools, selectedSchools, onChange }) => {
 return (
   <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
     <InputLabel>School</InputLabel>
     <Select
       value={selectedSchools[0] || ""} 
       onChange={(e) => onChange([e.target.value])} 
       label="School"
     >
       {schools.map((school) => (
         <MenuItem key={school.id} value={school.id}>
           {school.name}
         </MenuItem>
       ))}
     </Select>
   </FormControl>
 );
};


export default SchoolSelect;
