import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { TransactionListItem, TransactionListResponse } from '../../types/dashboard.types';
import { apiClient } from '../../utils/apiClient';
import { exportToCSV } from '../../utils/csvExport';

const columnHelper = createColumnHelper<TransactionListItem>();

export const TransactionList: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TransactionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const limit = 10;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = `/transactions?page=${page}&limit=${limit}`;
        if (debouncedSearch) {
          endpoint += `&search=${encodeURIComponent(debouncedSearch)}`;
        }
        
        const response = await apiClient.get<TransactionListResponse>(endpoint);
        setData(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, debouncedSearch]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    exportToCSV(
      data,
      'transactions',
      [
        { key: 'id', header: 'Transaction ID' },
        { key: 'customer.firstName' as any, header: 'Customer First Name' },
        { key: 'customer.lastName' as any, header: 'Customer Last Name' },
        { key: 'customer.email' as any, header: 'Customer Email' },
        { key: 'product.name' as any, header: 'Product Name' },
        { key: 'product.category' as any, header: 'Category' },
        { key: 'quantity', header: 'Quantity' },
        { key: 'unitPrice', header: 'Unit Price' },
        { key: 'totalAmount', header: 'Total Amount' },
        { key: 'status', header: 'Status' },
        { key: 'paymentMethod', header: 'Payment Method' },
        { key: 'timestamp', header: 'Date' },
        { key: 'discountApplied', header: 'Discount' },
        { key: 'taxAmount', header: 'Tax' },
        { key: 'shippingCost', header: 'Shipping' },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      credit_card: '💳 Credit Card',
      google_pay: '🔵 Google Pay',
      apple_pay: '🍎 Apple Pay',
      bank_transfer: '🏦 Bank Transfer',
      paypal: '💙 PayPal',
    };
    return labels[method] || method;
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
            #{info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor('customer', {
        header: 'Customer',
        cell: (info) => {
          const customer = info.getValue();
          return (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {customer.firstName} {customer.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {customer.email}
              </Typography>
            </Box>
          );
        },
      }),
      columnHelper.accessor('product', {
        header: 'Product',
        cell: (info) => {
          const product = info.getValue();
          return (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {product.category}
              </Typography>
            </Box>
          );
        },
      }),
      columnHelper.accessor('quantity', {
        header: 'Qty',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor('totalAmount', {
        header: 'Total',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            ${parseFloat(info.getValue()).toFixed(2)}
          </Typography>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <Chip
            label={info.getValue().toUpperCase()}
            size="small"
            color={getStatusColor(info.getValue()) as any}
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        ),
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Payment',
        cell: (info) => (
          <Typography variant="body2">
            {getPaymentMethodLabel(info.getValue())}
          </Typography>
        ),
      }),
      columnHelper.accessor('timestamp', {
        header: 'Date',
        cell: (info) => (
          <Box>
            <Typography variant="body2">
              {new Date(info.getValue()).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(info.getValue()).toLocaleTimeString()}
            </Typography>
          </Box>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage all transactions
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
          disabled={data.length === 0}
        >
          Export CSV
        </Button>
      </Box>

      <Card sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: 3 }}>
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search transactions by customer or product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
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
          ) : data.length > 0 ? (
            <>
              <Box sx={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                <TableContainer>
                  <Table size="small" sx={{ minWidth: 1000 }}>
                    <TableHead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableCell
                              key={header.id}
                              onClick={header.column.getToggleSortingHandler()}
                              sx={{
                                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                userSelect: 'none',
                                fontWeight: 600,
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableHead>
                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Pagination */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} transactions
                </Typography>
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Stack>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body2" color="text.secondary">
                No transactions available
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
