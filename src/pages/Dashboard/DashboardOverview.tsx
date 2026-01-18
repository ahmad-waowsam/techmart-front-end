import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Alert } from '@mui/material';
import { SalesChart } from '../../components/charts/SalesChart';
import { CategoryPieChart } from '../../components/charts/CategoryPieChart';
import { TopProductsTable } from '../../components/tables/TopProductsTable';
import { LowStockInventory } from '../../components/common/LowStockInventory';
import { DashboardFilters } from '../../components/common/DashboardFilters';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { apiClient } from '../../utils/apiClient';
import { DashboardOverviewResponse } from '../../types/dashboard.types';

export const DashboardOverview: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardOverviewResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string; threshold: number; salesDate?: string }>({
    threshold: 20,
  });

  const fetchDashboardData = async (fromDate?: string, toDate?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);
      
      const queryString = params.toString();
      const endpoint = queryString ? `/dashboard/overview?${queryString}` : '/dashboard/overview';
      
      const response = await apiClient.get<DashboardOverviewResponse>(endpoint);
      setDashboardData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFilterChange = (newFilters: { startDate: string; endDate: string; threshold: number; salesDate: string }) => {
    setFilters({
      startDate: newFilters.startDate || undefined,
      endDate: newFilters.endDate || undefined,
      threshold: newFilters.threshold,
      salesDate: newFilters.salesDate || undefined,
    });
    
    fetchDashboardData(
      newFilters.startDate || undefined,
      newFilters.endDate || undefined
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 }, width: '100%', overflow: 'hidden' }}>
      {/* Dashboard Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Techmart Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Welcome back! Here's what's happening with your store today.
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* KPI Header */}
      <DashboardHeader data={dashboardData} loading={loading} />

      {/* Filters */}
      <DashboardFilters onFilterChange={handleFilterChange} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Charts Row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr',
              lg: '1fr 1fr',
            },
            gap: 3,
          }}
        >
          <Box>
            <SalesChart salesDate={filters.salesDate} />
          </Box>
          <Box>
            <CategoryPieChart 
              startDate={filters.startDate} 
              endDate={filters.endDate} 
            />
          </Box>
        </Box>

        {/* Two Column Layout - Stacks on mobile */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr',
              lg: '1fr 1fr',
            },
            gap: 3,
          }}
        >
          {/* Top Products Table */}
          <Box>
            <TopProductsTable />
          </Box>

          {/* Low Stock Inventory */}
          <Box>
            <LowStockInventory threshold={filters.threshold} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
