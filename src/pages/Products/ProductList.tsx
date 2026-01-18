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
  IconButton,
  Tooltip,
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
import { ProductListItem, ProductListResponse } from '../../types/dashboard.types';
import { apiClient } from '../../utils/apiClient';
import { ProductDetailModal } from '../../components/common/ProductDetailModal';
import { exportToCSV } from '../../utils/csvExport';

const columnHelper = createColumnHelper<ProductListItem>();

export const ProductList: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = `/products?page=${page}&limit=${limit}`;
        if (debouncedSearch) {
          endpoint += `&search=${encodeURIComponent(debouncedSearch)}`;
        }
        
        const response = await apiClient.get<ProductListResponse>(endpoint);
        setData(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, debouncedSearch]);

  const handleRowClick = (productId: number) => {
    setSelectedProductId(productId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    exportToCSV(
      data,
      'products',
      [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Product Name' },
        { key: 'sku', header: 'SKU' },
        { key: 'category', header: 'Category' },
        { key: 'price', header: 'Price' },
        { key: 'stockQuantity', header: 'Stock' },
        { key: 'supplier.name' as any, header: 'Supplier' },
        { key: 'supplier.country' as any, header: 'Country' },
        { key: 'weight', header: 'Weight (kg)' },
        { key: 'dimensions', header: 'Dimensions' },
        { key: 'warrantyMonths', header: 'Warranty (months)' },
        { key: 'createdAt', header: 'Created' },
      ]
    );
  };

  const getStockColor = (quantity: number) => {
    if (quantity === 0) return 'error';
    if (quantity < 20) return 'warning';
    return 'success';
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Product Name',
        cell: (info) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {info.getValue()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              SKU: {info.row.original.sku}
            </Typography>
          </Box>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <Chip 
            label={info.getValue()} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        ),
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            ${parseFloat(info.getValue()).toFixed(2)}
          </Typography>
        ),
      }),
      columnHelper.accessor('stockQuantity', {
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue();
          return (
            <Chip
              label={stock.toLocaleString()}
              size="small"
              color={getStockColor(stock) as any}
              sx={{ fontWeight: 600, fontSize: '0.7rem', minWidth: 60 }}
            />
          );
        },
      }),
      columnHelper.accessor('supplier', {
        header: 'Supplier',
        cell: (info) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {info.getValue().name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {info.getValue().country}
            </Typography>
          </Box>
        ),
      }),
      columnHelper.accessor('weight', {
        header: 'Weight',
        cell: (info) => (
          <Typography variant="body2">
            {info.getValue()} kg
          </Typography>
        ),
      }),
      columnHelper.accessor('warrantyMonths', {
        header: 'Warranty',
        cell: (info) => (
          <Typography variant="body2">
            {info.getValue() ? `${info.getValue()} months` : 'N/A'}
          </Typography>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created',
        cell: (info) => (
          <Typography variant="body2" color="text.secondary">
            {new Date(info.getValue()).toLocaleDateString()}
          </Typography>
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
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Products
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your product inventory
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
                placeholder="Search products by name"
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
                            onClick={() => handleRowClick(row.original.id)}
                            sx={{
                              cursor: 'pointer',
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
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} products
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
                  No products available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <ProductDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        productId={selectedProductId}
      />
    </>
  );
};
