# API Integration Guide

## Environment Setup

The backend API URL is configured in the `.env` file:

```env
REACT_APP_BACKEND_URL=http://localhost:3000/api
```

## API Client

The centralized API client is located at `src/utils/apiClient.ts` and provides methods for all HTTP operations:

```typescript
import { apiClient } from '../utils/apiClient';

// GET request
const data = await apiClient.get('/endpoint');

// POST request
const result = await apiClient.post('/endpoint', { data });

// PUT request
await apiClient.put('/endpoint/:id', { data });

// DELETE request
await apiClient.delete('/endpoint/:id');

// PATCH request
await apiClient.patch('/endpoint/:id', { data });
```

## Dashboard Overview Endpoint

### Endpoint
```
GET /dashboard/overview
```

### Query Parameters
- `from` (optional): ISO 8601 datetime string (e.g., `2025-01-16T12:00:00Z`)
- `to` (optional): ISO 8601 datetime string (e.g., `2026-01-17T12:00:00Z`)

### Example Request
```typescript
// No filters
await apiClient.get('/dashboard/overview');

// With both filters
await apiClient.get('/dashboard/overview?from=2025-01-16T12:00:00Z&to=2026-01-17T12:00:00Z');

// With only start date
await apiClient.get('/dashboard/overview?from=2025-01-16T12:00:00Z');

// With only end date
await apiClient.get('/dashboard/overview?to=2026-01-17T12:00:00Z');
```

### Response Format
```typescript
interface DashboardOverviewResponse {
  data: {
    totalRevenue: number;
    totalTransactions: number;
    averageOrderValue: number;
    successfulTransactions: number;
    failedTransactions: number;
    refundedTransactions: number;
    pendingTransactions: number;
    flaggedTransactions: number;
  };
  trends: {
    revenueChange: number;
    transactionsChange: number;
  };
}
```

### Example Response
```json
{
  "data": {
    "totalRevenue": 16143645.44,
    "totalTransactions": 1953,
    "averageOrderValue": 8266.08,
    "successfulTransactions": 1719,
    "failedTransactions": 27,
    "refundedTransactions": 58,
    "pendingTransactions": 108,
    "flaggedTransactions": 41
  },
  "trends": {
    "revenueChange": -7.03,
    "transactionsChange": -35.9
  }
}
```

## KPI Mapping

The dashboard displays the following KPIs from the API response:

| KPI Display | API Field | Description |
|-------------|-----------|-------------|
| Total Sales | `data.totalRevenue` | Total revenue with trend from `trends.revenueChange` |
| Total Transactions | `data.totalTransactions` | Number of transactions with trend from `trends.transactionsChange` |
| Avg. Order Value | `data.averageOrderValue` | Average value per transaction |
| Successful Transactions | `data.successfulTransactions` | Count of successful transactions |

## Implementation Details

### DashboardOverview Component
Location: `src/pages/Dashboard/DashboardOverview.tsx`

- Fetches data on mount
- Handles filter changes from DateTimePicker
- Passes data to DashboardHeader component
- Shows loading state and error handling

### DashboardHeader Component
Location: `src/components/layout/DashboardHeader.tsx`

- Receives dashboard data as props
- Transforms API response to KPI format
- Shows loading spinner when fetching
- Falls back to mock data if no API data available

### Filter Handling

The DashboardFilters component outputs ISO 8601 formatted dates using MUI DateTimePicker with dayjs:

```typescript
const handleFilterChange = (filters: { startDate: string; endDate: string }) => {
  // filters.startDate: "2025-01-16T12:00:00.000Z"
  // filters.endDate: "2026-01-17T12:00:00.000Z"
  fetchDashboardData(filters.startDate, filters.endDate);
};
```

## Error Handling

The dashboard includes error handling for API failures:
- Network errors are caught and displayed in an Alert component
- Failed requests show user-friendly error messages
- Loading states prevent multiple simultaneous requests

## Future Endpoints

Additional endpoints to integrate:

- `/dashboard/sales-chart` - Sales over time data
- `/dashboard/category-distribution` - Category pie chart data
- `/dashboard/top-products` - Top performing products
- `/dashboard/recent-transactions` - Recent transaction feed
