import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const drawerWidth = 240;
const collapsedWidth = 65;

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'analytics', label: 'Fraud Alerts', icon: <BarChartIcon /> },
    { id: 'orders', label: 'Create Transaction', icon: <AddCircleIcon /> },
    { id: 'transactions', label: 'Transactions', icon: <ReceiptLongIcon /> },
    { id: 'products', label: 'Products', icon: <InventoryIcon /> },
  ];

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
    if (isMobile) {
      onMobileClose();
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', py: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <Tooltip title={isCollapsed && !isMobile ? item.label : ''} placement="right">
              <ListItemButton
                selected={currentTab === item.id}
                onClick={() => handleItemClick(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                  px: isCollapsed && !isMobile ? 1 : 2,
                  '&.Mui-selected': {
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'secondary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: currentTab === item.id ? 'inherit' : 'text.secondary',
                    minWidth: isCollapsed && !isMobile ? 'unset' : 40,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(!isCollapsed || isMobile) && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            top: '64px',
            height: 'calc(100vh - 64px)',
            borderRadius: 0,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: isCollapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          transition: 'width 0.3s',
          '& .MuiDrawer-paper': {
            width: isCollapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            top: '64px',
            height: 'calc(100vh - 64px)',
            transition: 'width 0.3s',
            overflowX: 'hidden',
            borderRadius: 0,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
