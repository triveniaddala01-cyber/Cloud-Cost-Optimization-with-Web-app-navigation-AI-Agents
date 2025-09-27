import React from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const routes = [
    { name: 'Dashboard', path: '/' },
    { name: 'AI Automation', path: '/automation' },
    { name: 'AI Agents', path: '/ai-agents' },
    { name: 'Recommendations', path: '/recommendations' },
    { name: 'Startup Tools', path: '/startup-tools' },
    { name: 'Savings Analytics', path: '/savings' },
    { name: 'Advanced Analytics', path: '/analytics' },
    { name: 'Optimization', path: '/optimization' },
    { name: 'Forecasting', path: '/forecasting' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <Box
      sx={{
        width: 200,
        backgroundColor: '#f5f5f5',
        height: '100%',
        borderRight: '1px solid #e0e0e0',
        paddingTop: 2
      }}
    >
      <List>
        {routes.map((route) => (
          <ListItem 
            component={Link} 
            to={route.path}
            key={route.path}
            selected={pathname === route.path}
            sx={{ 
              borderLeft: pathname === route.path ? '3px solid #4285F4' : 'none',
              textDecoration: 'none',
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: pathname === route.path ? '#4285F4' : 'transparent',
                  border: pathname === route.path ? 'none' : '1px solid #bdbdbd'
                }} 
              />
            </ListItemIcon>
            <ListItemText primary={route.name} primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;