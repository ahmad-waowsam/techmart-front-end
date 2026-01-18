import React, { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Typography,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface DashboardFiltersProps {
  onFilterChange?: (filters: { startDate: string; endDate: string; threshold: number; salesDate: string }) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ onFilterChange }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [salesDate, setSalesDate] = useState<Dayjs | null>(dayjs());
  const [threshold, setThreshold] = useState<number>(20);

  const handleToggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handleApplyFilters = () => {
    if (onFilterChange) {
      // Convert to ISO 8601 format
      onFilterChange({
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : '',
        threshold: threshold,
        salesDate: salesDate ? salesDate.format('YYYY-MM-DDTHH:mm:ss') : '',
      });
    }
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSalesDate(dayjs());
    setThreshold(20);
    if (onFilterChange) {
      onFilterChange({
        startDate: '',
        endDate: '',
        threshold: 20,
        salesDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      });
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        mb: 3,
      }}
    >
      {/* Filter Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: 'background.paper',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onClick={handleToggleFilters}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          {(startDate || endDate || salesDate) && (
            <Box
              sx={{
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Active
            </Box>
          )}
        </Box>
        <IconButton size="small">
          {filtersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Filter Content */}
      <Collapse in={filtersOpen}>
        <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                },
                gap: 2,
                mb: 2,
              }}
            >
              {/* Start Date */}
              <DateTimePicker
                label="Start Date & Time"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />

              {/* End Date */}
              <DateTimePicker
                label="End Date & Time"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          {/* Sales Date and Low Stock Threshold in Same Row */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                },
                gap: 2,
              }}
            >
              {/* Sales Date for Hourly Sales */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Sales Date (Hourly Visualization)"
                  value={salesDate}
                  onChange={(newValue) => setSalesDate(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      helperText: 'Select date for hourly sales chart',
                    },
                  }}
                />
              </LocalizationProvider>

              {/* Low Stock Threshold */}
              <TextField
                label="Low Stock Threshold"
                type="number"
                value={threshold}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 0 && value <= 100) {
                    setThreshold(value);
                  } else if (e.target.value === '') {
                    setThreshold(0);
                  }
                }}
                size="small"
                fullWidth
                inputProps={{
                  min: 0,
                  max: 100,
                }}
                helperText="Set inventory threshold (0-100)"
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              disabled={!startDate && !endDate && !salesDate}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleApplyFilters}
              sx={{
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                '&:hover': {
                  bgcolor: 'secondary.dark',
                },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};
