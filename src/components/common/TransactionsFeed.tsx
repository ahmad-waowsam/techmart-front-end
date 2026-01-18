import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import { mockTransactions } from '../../utils/mockData';
import { Transaction } from '../../types/dashboard.types';

const StatusIcon: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
  const icons = {
    completed: <CheckCircleIcon sx={{ color: 'success.main' }} />,
    pending: <PendingIcon sx={{ color: 'warning.main' }} />,
    failed: <ErrorIcon sx={{ color: 'error.main' }} />,
  };
  return icons[status];
};

const getRiskColor = (risk: Transaction['riskLevel']) => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
  };
  return colors[risk] as 'success' | 'warning' | 'error';
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const TransactionsFeed: React.FC = () => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Recent Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Latest customer activity
          </Typography>
        </Box>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {mockTransactions.map((transaction, index) => (
            <React.Fragment key={transaction.id}>
              <ListItem
                sx={{
                  px: 0,
                  py: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText',
                    mr: 2,
                  }}
                >
                  {transaction.customerName.charAt(0)}
                </Avatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {transaction.customerName}
                      </Typography>
                      <StatusIcon status={transaction.status} />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {transaction.productName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={transaction.riskLevel.toUpperCase()}
                          size="small"
                          color={getRiskColor(transaction.riskLevel)}
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {transaction.paymentMethod}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    ${transaction.amount.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(transaction.timestamp)}
                  </Typography>
                </Box>
              </ListItem>
              {index < mockTransactions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
