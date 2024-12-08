import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer'; 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


function App() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('customer');

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const handlePage = (page) => {
    setActive(page); 
    setMenu(false);
  };

  return (
    
    <div className="App">
       <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleMenu} 
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              Personal Trainer
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer
        anchor="left"
        open={menu}
        onClose={toggleMenu}
      >
        <List>
          <ListItem button onClick={() => handlePage('customer')}>
            <ListItemText primary="Customer List" />
          </ListItem>
          <ListItem button onClick={() => handlePage('training')}>
            <ListItemText primary="Training List" />
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: '20px' }}>
        <Box sx={{ flex: 1, padding: '10px' }}>
          {active === 'customer' && <CustomerList />}
          {active === 'training' && <TrainingList />}
        </Box>
      </Box>
    </div>
  );
}
export default App;
