import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  Divider,
  Paper,
  Chip,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DiscountIcon from '@mui/icons-material/Discount';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { transactionSchema, TransactionFormData, TransactionPayload } from '../../schemas/transaction.schema';
import { apiClient } from '../../utils/apiClient';
import { ProductDetail } from '../../types/dashboard.types';

const paymentMethods = [
  { value: 'credit_card', label: '💳 Credit Card' },
  { value: 'google_pay', label: '🔵 Google Pay' },
  { value: 'apple_pay', label: '🍎 Apple Pay' },
  { value: 'bank_transfer', label: '🏦 Bank Transfer' },
  { value: 'paypal', label: '💙 PayPal' },
];

const discountOptions = [0, 5, 10, 15];
const shippingOptions = [
  { value: 0, label: '🆓 Free Shipping' },
  { value: 10, label: '📦 Standard - $10' },
  { value: 20, label: '⚡ Express - $20' },
  { value: 30, label: '🚀 Overnight - $30' },
];

export const CreateTransaction: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<TransactionPayload | null>(null);
  const [ipAddress, setIpAddress] = useState<string>('');
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      customerId: 0,
      productId: 0,
      quantity: 1,
      unitPrice: 0,
      paymentMethod: 'credit_card',
      discountApplied: 0,
      shippingCost: 10,
    },
  });

  // Get IP Address
  useEffect(() => {
    // In production, you would fetch this from an API
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch(() => setIpAddress('127.0.0.1'));
  }, []);

  // Watch productId to fetch product details
  const productId = watch('productId');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId || productId === 0) {
        setProduct(null);
        setValue('unitPrice', 0);
        return;
      }

      setLoadingProduct(true);
      setProductError(null);

      try {
        const data = await apiClient.get<ProductDetail>(`/products/${productId}`);
        setProduct(data);
        setValue('unitPrice', parseFloat(data.price));
        clearErrors('productId');
      } catch (err) {
        console.error('Error fetching product details:', err);
        setProductError('Failed to load product details');
        setProduct(null);
        setValue('unitPrice', 0);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProductDetails();
  }, [productId, setValue, clearErrors]);

  // Watch form values for calculations
  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');
  const discountApplied = watch('discountApplied');
  const shippingCost = watch('shippingCost');

  // Calculate totals
  const subtotal = quantity * unitPrice;
  const discountAmount = (subtotal * discountApplied) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * 0.12; // 12% tax
  const totalAmount = taxableAmount + taxAmount + shippingCost;

  const onSubmit = async (data: TransactionFormData) => {
    // Validate stock quantity
    if (product && data.quantity > product.stockQuantity) {
      setError('quantity', {
        type: 'manual',
        message: `Only ${product.stockQuantity} units available in stock`,
      });
      return;
    }

    const sessionId = uuidv4();
    const userAgent = navigator.userAgent;

    const payload = {
      customerId: data.customerId,
      productId: data.productId,
      quantity: data.quantity,
      unitPrice: parseFloat(data.unitPrice.toFixed(2)),
      status: 'completed',
      paymentMethod: data.paymentMethod,
      ipAddress,
      userAgent,
      sessionId,
      discountApplied: parseFloat(discountAmount.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      shippingCost: data.shippingCost,
    };

    setSubmitting(true);
    setSubmitError(null);

    try {
      await apiClient.post('/transactions', payload);
      setSubmittedData(payload as any);
      console.log('Transaction created successfully:', payload);
    } catch (err) {
      console.error('Error creating transaction:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to create transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Create New Transaction
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Fill in the details below to create a new transaction
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        {/* Form Section */}
        <Box>
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Transaction Details Section */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Transaction Details
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                      <Controller
                        name="customerId"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Customer ID"
                            type="number"
                            fullWidth
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            error={!!errors.customerId}
                            helperText={errors.customerId?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="productId"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Product ID"
                            type="number"
                            fullWidth
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            error={!!errors.productId || !!productError}
                            helperText={errors.productId?.message || productError}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <InventoryIcon color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: loadingProduct ? (
                                <InputAdornment position="end">
                                  <CircularProgress size={20} />
                                </InputAdornment>
                              ) : undefined,
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  <Divider />

                  {/* Pricing Information */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Pricing & Quantity
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                      <Controller
                        name="quantity"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Quantity"
                            type="number"
                            fullWidth
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              field.onChange(value);
                              if (product && value > product.stockQuantity) {
                                setError('quantity', {
                                  type: 'manual',
                                  message: `Only ${product.stockQuantity} units available`,
                                });
                              } else {
                                clearErrors('quantity');
                              }
                            }}
                            error={!!errors.quantity}
                            helperText={errors.quantity?.message}
                          />
                        )}
                      />
                      <Controller
                        name="unitPrice"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Unit Price"
                            type="number"
                            fullWidth
                            disabled
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoneyIcon fontSize="small" />
                                </InputAdornment>
                              ),
                              readOnly: true,
                            }}
                            helperText={product ? `${product.name} - ${product.sku}` : 'Select a product to see price'}
                          />
                        )}
                      />
                    </Box>
                  </Box>

                  <Divider />

                  {/* Payment & Shipping */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PaymentIcon sx={{ mr: 1, color: 'info.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Payment & Shipping
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Payment Method"
                            fullWidth
                            error={!!errors.paymentMethod}
                            helperText={errors.paymentMethod?.message as string | undefined}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PaymentIcon fontSize="small" color="action" />
                                </InputAdornment>
                              ),
                            }}
                          >
                            {paymentMethods.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />

                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                        <Controller
                          name="discountApplied"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              label="Discount"
                              fullWidth
                              error={!!errors.discountApplied}
                              helperText={errors.discountApplied?.message}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <DiscountIcon fontSize="small" color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            >
                              {discountOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option === 0 ? 'No Discount' : `${option}% Off`}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                        <Controller
                          name="shippingCost"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              label="Shipping Option"
                              fullWidth
                              error={!!errors.shippingCost}
                              helperText={errors.shippingCost?.message}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LocalShippingIcon fontSize="small" color="action" />
                                  </InputAdornment>
                                ),
                              }}
                            >
                              {shippingOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Stock Display */}
                  {product && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: product.stockQuantity <= 10 ? 'error.light' : 'success.light',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Available Stock:
                      </Typography>
                      <Chip
                        label={`${product.stockQuantity} units`}
                        color={product.stockQuantity <= 10 ? 'error' : 'success'}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={submitting || loadingProduct}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    {submitting ? 'Creating...' : 'Create Transaction'}
                  </Button>
                </Box>
              </form>

              {/* Success Message */}
              {submittedData && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  Transaction created successfully!
                </Alert>
              )}

              {/* Error Message */}
              {submitError && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {submitError}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Order Summary Section */}
        <Box>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              position: 'sticky',
              top: 80,
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Order Summary
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Chip
                label="Pending"
                color="warning"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal:</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>

              {discountApplied > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">
                    Discount ({discountApplied}%):
                  </Typography>
                  <Typography sx={{ fontWeight: 500, color: 'success.main' }}>
                    -${discountAmount.toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tax (12%):</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  ${taxAmount.toFixed(2)}
                </Typography>
              </Box>

              {shippingCost > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Shipping:</Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    ${shippingCost.toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  color: 'white',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ${totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                💡 Transaction status will be set to "Pending" automatically
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};
