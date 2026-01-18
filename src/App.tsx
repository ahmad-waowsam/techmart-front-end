import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { DashboardLayout } from './components/layout/DashboardLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardLayout />
    </ThemeProvider>
  );
}

export default App;
