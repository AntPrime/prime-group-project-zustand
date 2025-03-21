import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function HomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const [activities, setActivities] = useState([...'Activities'])

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant="h5" component="div">
        Name of Event: Softball Game
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}> DATE: - TIME OF EVENT:  - CATEGORY: {activities}</Typography>
        <Typography variant="h7" component="div">
         SCHOOLS Home vs Away
        </Typography>
        <Typography variant="h7" component="div">
         LOCATION
        </Typography>
        <Typography variant="body2">
        <br />
        DETAILS:
        {" a benevolent smile"}
      </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Producer</Button>
        <Button size="small">Camera</Button>
        <Button size="small">Play-by-play</Button>
      </CardActions>
    </React.Fragment>
  );
  return (
    <>
      <h2>LMR STUDENT HOME PAGE</h2>
      <input placeholder='Search Event'/>  
      <div>
        <button>Date</button>
        <button>Location</button>
        <select>
        <option value="">Category</option>
        </select>
        <select>
        <option value="">School</option>
        </select>
        <button>Search</button>
        <button>Clear All</button>
      </div>
      <h4>Filter Applied: DATE Maarch 2025 - SCHOOL Elk River - EVENT Show all Events </h4>
      <div className='eventCard'>
      <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>

      <h5></h5>
      <p>Your ID is: {user.id}</p>
      <button onClick={logOut}>
        Log Out
      </button>
      </div>
    </>
  );
}


export default HomePage;
