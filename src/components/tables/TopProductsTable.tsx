import React, { useMemo, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { BestPerformingProduct } from '../../types/dashboard.types';
import { apiClient } from '../../utils/apiClient';
import { ProductDetailModal } from '../common/ProductDetailModal';
import { exportToCSV } from '../../utils/csvExport';

const columnHelper = createColumnHelper<BestPerformingProduct>();

export const TopProductsTable: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<BestPerformingProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (productId: number) => {
    setSelectedProductId(productId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
  };

  const handleExport = () => {
    exportToCSV(
      data,
      'top-products',
      [
        { key: 'productName', header: 'Product Name' },
        { key: 'category', header: 'Category' },
        { key: 'sku', header: 'SKU' },
        { key: 'totalSales', header: 'Sales' },
        { key: 'totalRevenue', header: 'Revenue' },
        { key: 'averageOrderValue', header: 'Avg Order Value' },
        { key: 'currentStock', header: 'Stock' },
      ]
    );
  };

  useEffect(() => {
    const fetchBestPerformingProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<BestPerformingProduct[]>(
          '/products/best-performing?limit=17'
        );
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching best performing products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestPerformingProducts();
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor('productName', {
        header: 'Product Name',
        cell: (info) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {info.getValue()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {info.row.original.category} • {info.row.original.sku}
            </Typography>
          </Box>
        ),
      }),
      columnHelper.accessor('totalSales', {
        header: 'Sales',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {info.getValue().toLocaleString()}
          </Typography>
        ),
      }),
      columnHelper.accessor('totalRevenue', {
        header: 'Revenue',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            ${info.getValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        ),
      }),
      columnHelper.accessor('averageOrderValue', {
        header: 'Avg. Order Value',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            ${info.getValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        ),
      }),
      columnHelper.accessor('currentStock', {
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue();
          const getStockColor = () => {
            if (stock === 0) return 'error';
            if (stock < 20) return 'warning';
            return 'success';
          };
          return (
            <Chip
              label={stock.toLocaleString()}
              size="small"
              color={getStockColor() as any}
              sx={{ fontWeight: 600, fontSize: '0.7rem', minWidth: 60 }}
            />
          );
        },
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
      <Card sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Top Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Best performing products
              </Typography>
            </Box>
            <Tooltip title="Export to CSV">
              <IconButton onClick={handleExport} disabled={data.length === 0} color="primary">
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
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
            <Box sx={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <TableContainer>
                <Table size="small" sx={{ minWidth: 650 }}>
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
                      onClick={() => handleRowClick(row.original.productId)}
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
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body2" color="text.secondary">
                No products available
              </Typography>
            </Box>
          )}

      <ProductDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        productId={selectedProductId}
      />
        </CardContent>
      </Card>
    </>
  );
};
