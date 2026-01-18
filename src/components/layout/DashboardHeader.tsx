import React, { useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { KPICard } from '../common/KPICard';
import { DashboardOverviewResponse, KPIMetric } from '../../types/dashboard.types';

interface DashboardHeaderProps {
  data?: DashboardOverviewResponse;
  loading?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ data, loading }) => {
  const kpiMetrics: KPIMetric[] = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        id: 'total-sales',
        label: 'Total Sales',
        value: `$${data.data.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: data.trends.revenueChange,
        changeType: data.trends.revenueChange > 0 ? 'positive' : data.trends.revenueChange < 0 ? 'negative' : 'neutral',
      },
      {
        id: 'total-transactions',
        label: 'Total Transactions',
        value: data.data.totalTransactions.toLocaleString(),
        change: data.trends.transactionsChange,
        changeType: data.trends.transactionsChange > 0 ? 'positive' : data.trends.transactionsChange < 0 ? 'negative' : 'neutral',
      },
      {
        id: 'average-order-value',
        label: 'Avg. Order Value',
        value: `$${data.data.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        changeType: 'neutral',
      },
      {
        id: 'successful-transactions',
        label: 'Successful Transactions',
        value: data.data.successfulTransactions.toLocaleString(),
        changeType: 'positive',
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <Box sx={{ py: 3, width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3, width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {kpiMetrics.map((metric) => (
          <KPICard key={metric.id} metric={metric} />
        ))}
      </Box>
    </Box>
  );
};
