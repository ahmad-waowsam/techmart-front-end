import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { TabValue } from '../../types/dashboard.types';
import { Sidebar } from './Sidebar';
import { DashboardOverview } from '../../pages/Dashboard/DashboardOverview';
import { Analytics } from '../../pages/Analytics/Analytics';
import { CreateTransaction, TransactionList } from '../../pages/Transaction';
import { ProductList } from '../../pages/Products';

export const DashboardLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabValue>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleTabChange = (newValue: string) => {
    setCurrentTab(newValue as TabValue);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top App Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: 'primary.main',
          borderBottom: 1,
          borderColor: 'divider',
          borderRadius: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: 3 }}>
          <Toolbar sx={{ px: { xs: 0 } }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleToggleSidebar}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: 0.5,
                mr: 4,
              }}
            >
              Techmart
            </Typography>

            {/* Action Icons */}
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={handleTabChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        mobileOpen={mobileDrawerOpen}
        onMobileClose={handleMobileDrawerClose}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          width: { xs: '100%', sm: 'auto' },
          overflow: 'hidden',
        }}
      >
        {currentTab === 'overview' && <DashboardOverview />}
        {currentTab === 'analytics' && <Analytics />}
        {currentTab === 'orders' && <CreateTransaction />}
        {currentTab === 'transactions' && <TransactionList />}
        {currentTab === 'products' && <ProductList />}
      </Box>
    </Box>
  );
};
