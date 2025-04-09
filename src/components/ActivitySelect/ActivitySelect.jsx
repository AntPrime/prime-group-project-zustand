import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';


const ActivitySelect = ({ activities, selectedActivities, onChange }) => {
 return (
   <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
     <InputLabel>Activity</InputLabel>
     <Select
       value={selectedActivities[0] || ""}  // Bind the selected activity here
       onChange={(e) => onChange([e.target.value])}  // Update selectedActivities when an activity is selected
       label="Activity"
     >
       {activities.map((activity) => (
         <MenuItem key={activity.id} value={activity.id}>
           {activity.activity}  {/* Make sure this matches the field name in your activity object */}
         </MenuItem>
       ))}
     </Select>
   </FormControl>
 );
};


export default ActivitySelect;
