import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { apiClient } from '../../utils/apiClient';
import { CategoryCount } from '../../types/dashboard.types';

const COLORS = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FFD700', // Gold
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#8BC34A', // Light Green
  '#FF5722', // Deep Orange
  '#9E9E9E', // Grey
];

interface CategoryPieChartProps {
  startDate?: string;
  endDate?: string;
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ startDate, endDate }) => {
  const [data, setData] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (startDate) params.append('from', startDate);
        if (endDate) params.append('to', endDate);
        
        const queryString = params.toString();
        const endpoint = queryString ? `/products/completed-by-category?${queryString}` : '/products/completed-by-category';
        
        const response = await apiClient.get<CategoryCount[]>(endpoint);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category data');
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [startDate, endDate]);

  const chartData = data.map((item) => ({
    name: item.category,
    value: item.count,
  }));
  return (
    <Card sx={{ minWidth: 0, overflow: 'hidden' }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            No of Sales by Category
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Product category distribution
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              No category data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
