import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, Typography, Alert, CircularProgress, Button, Card, CardContent } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KPICard } from '../../components/common/KPICard';
import { KPIMetric, DashboardOverviewResponse } from '../../types/dashboard.types';
import { apiClient } from '../../utils/apiClient';
import { DashboardFilters } from '../../components/common/DashboardFilters';

interface FraudScoresResponse {
  processed: number;
  updated: number;
  verdictBreakdown: {
    safe: number;
    'low-risk': number;
    'medium-risk': number;
    'high-risk': number;
    fraudulent: number;
  };
}

export const Analytics: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardOverviewResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fraudScores, setFraudScores] = useState<FraudScoresResponse | null>(null);
  const [calculatingScores, setCalculatingScores] = useState(false);
  const [scoresError, setScoresError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : 'Failed to fetch fraud data');
      console.error('Error fetching fraud data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFilterChange = (newFilters: { startDate: string; endDate: string; threshold: number; salesDate: string }) => {
    fetchDashboardData(
      newFilters.startDate || undefined,
      newFilters.endDate || undefined
    );
  };

  const handleCalculateFraudScores = async () => {
    setCalculatingScores(true);
    setScoresError(null);

    try {
      const response = await apiClient.post<FraudScoresResponse>('/transactions/calculate-fraud-scores', {});
      setFraudScores(response);
    } catch (err) {
      setScoresError(err instanceof Error ? err.message : 'Failed to calculate fraud scores');
      console.error('Error calculating fraud scores:', err);
    } finally {
      setCalculatingScores(false);
    }
  };

  const chartData = useMemo(() => {
    if (!fraudScores) return [];

    return [
      { name: 'Safe', value: fraudScores.verdictBreakdown.safe, color: '#4caf50' },
      { name: 'Low Risk', value: fraudScores.verdictBreakdown['low-risk'], color: '#8bc34a' },
      { name: 'Medium Risk', value: fraudScores.verdictBreakdown['medium-risk'], color: '#ff9800' },
      { name: 'High Risk', value: fraudScores.verdictBreakdown['high-risk'], color: '#ff5722' },
      { name: 'Fraudulent', value: fraudScores.verdictBreakdown.fraudulent, color: '#f44336' },
    ];
  }, [fraudScores]);

  const fraudKPIMetrics: KPIMetric[] = useMemo(() => {
    if (!dashboardData) {
      return [
        {
          id: 'failed-transactions',
          label: 'Failed Transactions',
          value: '0',
          changeType: 'neutral',
        },
        {
          id: 'refunded-transactions',
          label: 'Refunded Transactions',
          value: '0',
          changeType: 'neutral',
        },
        {
          id: 'pending-transactions',
          label: 'Pending Transactions',
          value: '0',
          changeType: 'neutral',
        },
        {
          id: 'flagged-transactions',
          label: 'Flagged Transactions',
          value: '0',
          changeType: 'neutral',
        },
      ];
    }

    return [
      {
        id: 'failed-transactions',
        label: 'Failed Transactions',
        value: dashboardData.data.failedTransactions.toLocaleString(),
        changeType: 'negative',
      },
      {
        id: 'refunded-transactions',
        label: 'Refunded Transactions',
        value: dashboardData.data.refundedTransactions.toLocaleString(),
        changeType: 'negative',
      },
      {
        id: 'pending-transactions',
        label: 'Pending Transactions',
        value: dashboardData.data.pendingTransactions.toLocaleString(),
        changeType: 'neutral',
      },
      {
        id: 'flagged-transactions',
        label: 'Flagged Transactions',
        value: dashboardData.data.flaggedTransactions.toLocaleString(),
        changeType: 'negative',
      },
    ];
  }, [dashboardData]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 }, width: '100%', overflow: 'hidden' }}>
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Fraud Alerts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Monitor and manage fraudulent activities and suspicious transactions.
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <DashboardFilters onFilterChange={handleFilterChange} />
      </Box>

      {/* KPI Metrics */}
      <Box sx={{ px: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
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
              mb: 4,
            }}
          >
            {fraudKPIMetrics.map((metric) => (
              <KPICard key={metric.id} metric={metric} />
            ))}
          </Box>
        )}
      </Box>

      {/* Placeholder for future content */}
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Fraud Score Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calculate and analyze fraud scores for all transactions
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={calculatingScores ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                onClick={handleCalculateFraudScores}
                disabled={calculatingScores}
                sx={{ minWidth: 200 }}
              >
                {calculatingScores ? 'Calculating...' : 'Calculate Fraud Scores'}
              </Button>
            </Box>

            {scoresError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {scoresError}
              </Alert>
            )}

            {fraudScores && (
              <Box>
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Processed:</strong> {fraudScores.processed.toLocaleString()} transactions | 
                    <strong> Updated:</strong> {fraudScores.updated.toLocaleString()} records
                  </Typography>
                </Box>

                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: 8,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value) => [(value as number).toLocaleString(), 'Transactions']}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {!fraudScores && !calculatingScores && (
              <Box sx={{ p: 4, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Click "Calculate Fraud Scores" to analyze all transactions
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
