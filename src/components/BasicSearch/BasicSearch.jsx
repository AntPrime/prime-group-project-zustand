import {
    Box,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
  } from '@mui/material';
  import SearchIcon from '@mui/icons-material/Search';
  import { useState } from 'react';
  
  function BasicSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOne, setFilterOne] = useState('');
    const [filterTwo, setFilterTwo] = useState('');
  
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          p: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
        }}
      >
        {/* Search Input */}
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: 'white', minWidth: 240, flexGrow: 1 }}
        />
  
        {/* Filter 1 */}
        <FormControl sx={{ minWidth: 180, backgroundColor: 'white' }} fullWidth>
          <InputLabel>Filter One</InputLabel>
          <Select
            value={filterOne}
            onChange={(e) => setFilterOne(e.target.value)}
            label="Filter One"
          >
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
          </Select>
        </FormControl>
  
        {/* Filter 2 */}
        <FormControl sx={{ minWidth: 180, backgroundColor: 'white' }} fullWidth>
          <InputLabel>Filter Two</InputLabel>
          <Select
            value={filterTwo}
            onChange={(e) => setFilterTwo(e.target.value)}
            label="Filter Two"
          >
            <MenuItem value="optionA">Option A</MenuItem>
            <MenuItem value="optionB">Option B</MenuItem>
          </Select>
        </FormControl>
  
        {/* Search Button */}
        <Button variant="contained" color="primary">
          Search
        </Button>
  
        {/* Clear Button */}
        <Button variant="outlined" onClick={() => {
          setSearchQuery('');
          setFilterOne('');
          setFilterTwo('');
        }}>
          Clear
        </Button>
      </Box>
    );
  }
  
  export default BasicSearch;
  