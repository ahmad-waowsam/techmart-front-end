import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { apiClient } from '../../utils/apiClient';

interface HourlySalesData {
  hour: string;
  revenue: number;
  transactions: number;
  averageOrderValue: number;
}

interface HourlySalesResponse {
  data: HourlySalesData[];
  totalRevenue: number;
  totalTransactions: number;
  period: {
    start: string;
    end: string;
    date: string;
  };
}

interface SalesChartProps {
  salesDate?: string;
}

export const SalesChart: React.FC<SalesChartProps> = ({ salesDate }) => {
  const [data, setData] = useState<HourlySalesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHourlySalesData = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = salesDate 
          ? `/analytics/hourly-sales?date=${salesDate}`
          : '/analytics/hourly-sales';
        
        const response = await apiClient.get<HourlySalesResponse>(endpoint);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sales data');
        console.error('Error fetching hourly sales data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHourlySalesData();
  }, [salesDate]);
  return (
    <Card sx={{ minWidth: 0, overflow: 'hidden' }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Sales Performance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hourly sales visualization
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                stroke="#999"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#999"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  });
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#FFD700"
                strokeWidth={3}
                fill="url(#salesGradient)"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="body2" color="text.secondary">
              No sales data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
