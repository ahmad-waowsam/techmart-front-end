import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  Chip,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { apiClient } from '../../utils/apiClient';
import { LowStockInventoryResponse } from '../../types/dashboard.types';
import { exportToCSV } from '../../utils/csvExport';

interface LowStockInventoryProps {
  threshold?: number;
}

export const LowStockInventory: React.FC<LowStockInventoryProps> = ({ threshold = 20 }) => {
  const [data, setData] = useState<LowStockInventoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchLowStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<LowStockInventoryResponse>(
          `/inventory/low-stock?page=${page}&limit=${pageSize}&threshold=${threshold}`
        );
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch low stock data');
        console.error('Error fetching low stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockData();
  }, [page, threshold]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRefresh = () => {
    setPage(1); // Reset to page 1 to trigger re-fetch
  };

  const handleExport = () => {
    if (data?.products) {
      exportToCSV(
        data.products,
        'low-stock-inventory',
        [
          { key: 'id', header: 'Product ID' },
          { key: 'name', header: 'Product Name' },
          { key: 'sku', header: 'SKU' },
          { key: 'category', header: 'Category' },
          { key: 'stockQuantity', header: 'Stock Quantity' },
          { key: 'price', header: 'Price' },
          { key: 'supplier.name' as any, header: 'Supplier' },
          { key: 'supplier.contactEmail' as any, header: 'Supplier Email' },
          { key: 'supplier.phone' as any, header: 'Supplier Phone' },
        ]
      );
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Low Stock Inventory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data ? `${data.total} products below threshold` : 'Products needing restocking'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Export to CSV">
              <IconButton onClick={handleExport} size="small" disabled={!data?.products || data.products.length === 0 || loading}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={loading} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && data && (
          <>
            <List sx={{ p: 0 }}>
              {data.products.map((product, index) => (
                <ListItem
                  key={product.id}
                  sx={{
                    px: 0,
                    py: 2,
                    borderBottom: index !== data.products.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <WarningIcon color="error" fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {product.name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        SKU: {product.sku} • {product.category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Supplier: {product.supplier.name}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                      <Chip
                        label={`Stock: ${product.stockQuantity}`}
                        size="small"
                        color="error"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ${parseFloat(product.price).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>

            {data.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={data.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </>
        )}

        {!loading && !data && !error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No low stock products found
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
