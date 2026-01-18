import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ProductDetail } from '../../types/dashboard.types';
import { apiClient } from '../../utils/apiClient';

interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  productId: number | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  open,
  onClose,
  productId,
}) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId || !open) return;

      setLoading(true);
      setError(null);

      try {
        const data = await apiClient.get<ProductDetail>(`/products/${productId}`);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, open]);

  const getStockColor = (quantity: number) => {
    if (quantity <= 10) return 'error';
    if (quantity <= 50) return 'warning';
    return 'success';
  };

  const getStockStatus = (quantity: number) => {
    if (quantity <= 10) return 'Low Stock';
    if (quantity <= 50) return 'Medium Stock';
    return 'In Stock';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Product Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && product && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Product Name & SKU */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Product Name
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {product.sku}
              </Typography>
            </Box>

            <Divider />

            {/* Category & Price */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Category
                </Typography>
                <Chip label={product.category} size="small" color="primary" />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Price
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  ${parseFloat(product.price).toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Stock Status */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Stock Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={getStockStatus(product.stockQuantity)}
                  size="medium"
                  color={getStockColor(product.stockQuantity) as 'success' | 'warning' | 'error'}
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="body2" color="text.secondary">
                  ({product.stockQuantity} units available)
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Description */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2">
                {product.description}
              </Typography>
            </Box>

            <Divider />

            {/* Physical Details */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Weight
                </Typography>
                <Typography variant="body1">
                  {product.weight} kg
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Dimensions
                </Typography>
                <Typography variant="body1">
                  {product.dimensions}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Warranty */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Warranty
              </Typography>
              <Typography variant="body1">
                {product.warrantyMonths} months
              </Typography>
            </Box>

            <Divider />

            {/* Supplier Information */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
                Supplier Information
              </Typography>
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {product.supplier.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Country
                    </Typography>
                    <Typography variant="body2">
                      {product.supplier.country}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Contact Email
                    </Typography>
                    <Typography variant="body2">
                      {product.supplier.contactEmail}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body2">
                      {product.supplier.phone}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Reliability Score
                    </Typography>
                    <Typography variant="body2">
                      {(product.supplier.reliabilityScore * 100).toFixed(0)}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Avg. Delivery
                    </Typography>
                    <Typography variant="body2">
                      {product.supplier.averageDeliveryDays} days
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Payment Terms
                    </Typography>
                    <Typography variant="body2">
                      {product.supplier.paymentTerms}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Certification
                    </Typography>
                    <Typography variant="body2">
                      {product.supplier.certification || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Created At */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Created At
              </Typography>
              <Typography variant="body2">
                {new Date(product.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
