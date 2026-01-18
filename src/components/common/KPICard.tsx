import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { KPIMetric } from '../../types/dashboard.types';

interface KPICardProps {
  metric: KPIMetric;
}

export const KPICard: React.FC<KPICardProps> = ({ metric }) => {
  const getChangeColor = () => {
    if (metric.changeType === 'positive') return 'success';
    if (metric.changeType === 'negative') return 'error';
    return 'default';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s',
        minWidth: 0,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          gutterBottom
          sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {metric.label}
        </Typography>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ fontWeight: 700, my: 1 }}
        >
          {metric.value}
        </Typography>
        {metric.change !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              icon={
                metric.changeType === 'positive' ? (
                  <TrendingUpIcon fontSize="small" />
                ) : (
                  <TrendingDownIcon fontSize="small" />
                )
              }
              label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
              size="small"
              color={getChangeColor()}
              sx={{ 
                height: 24,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
