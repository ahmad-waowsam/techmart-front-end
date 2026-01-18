# E-Commerce Dashboard - Frontend

A comprehensive React-based dashboard application for managing e-commerce operations with fraud detection capabilities.

## Features

- **Dashboard Overview**: Real-time KPI metrics, sales charts, and performance analytics
- **Fraud Detection**: Fraud alert monitoring with score calculation and risk categorization
- **Product Management**: Product listing, search, pagination, and detailed product views
- **Transaction Management**: Transaction listing, creation form with stock validation
- **Inventory Management**: Low stock alerts and inventory monitoring
- **CSV Export**: Export data from all tables to CSV format
- **Responsive Design**: Mobile-friendly with collapsible sidebar

## Tech Stack

- **React** 19.2.3
- **TypeScript** 4.9.5
- **Material-UI (MUI)** v7.3.7
- **TanStack Table** v8.21.3
- **Recharts** v3.6.0
- **React Hook Form** v7+ with Zod validation
- **Day.js** for date manipulation

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Backend API running on `http://localhost:3000/api`

## Installation

1. Navigate to the project directory:
```bash
cd "Front-end"
```

2. Install dependencies:
```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_BACKEND_URL=http://localhost:3000/api
```

## Running the Application

### Development Mode

Start the development server on default port (3000):
```bash
npm start
```

Or specify a custom port:
```bash
PORT=3100 npm start
```

The application will open at `http://localhost:3100`

### Production Build

Build the application for production:
```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Project Structure

```
dashboard-app/
├── public/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   │   ├── DashboardFilters.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── LowStockInventory.tsx
│   │   │   └── ProductDetailModal.tsx
│   │   ├── charts/           # Chart components
│   │   │   ├── ProductDistributionChart.tsx
│   │   │   ├── SalesChart.tsx
│   │   │   └── TopCategoriesChart.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   └── tables/           # Table components
│   │       └── TopProductsTable.tsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── DashboardOverview.tsx
│   │   ├── Analytics/
│   │   │   └── Analytics.tsx
│   │   ├── Products/
│   │   │   └── ProductList.tsx
│   │   └── Transaction/
│   │       ├── CreateTransaction.tsx
│   │       └── TransactionList.tsx
│   ├── types/
│   │   └── dashboard.types.ts
│   ├── utils/
│   │   ├── apiClient.ts      # API client wrapper
│   │   └── csvExport.ts      # CSV export utility
│   ├── App.tsx
│   └── index.tsx
├── .env
├── package.json
```

## API Endpoints

The application connects to the following backend endpoints:

### Dashboard
- `GET /dashboard/overview?startDate={date}&endDate={date}&salesDate={date}`
- `GET /dashboard/sales?startDate={date}&endDate={date}`

### Products
- `GET /products?page={page}&limit={limit}&search={query}`
- `GET /products/{id}`
- `GET /products/best-performing?limit={limit}`

### Transactions
- `GET /transactions?page={page}&limit={limit}&search={query}`
- `POST /transactions`
- `POST /transactions/calculate-fraud-scores`

### Inventory
- `GET /inventory/low-stock?page={page}&limit={limit}&threshold={threshold}`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Key Features Breakdown

### Dashboard Overview
- 4 KPI cards with trends (Total Sales, Total Transactions, Avg Order Value, Successful Transactions)
- Sales chart with hourly breakdown
- Top products table with click-to-view details
- Product distribution pie chart
- Top categories bar chart
- Low stock inventory alerts

### Fraud Alerts
- 4 Fraud KPIs (Failed, Refunded, Pending, Flagged Transactions)
- Date range filters
- Calculate fraud scores button
- Risk categorization bar chart (Safe, Low-Risk, Medium-Risk, High-Risk, Fraudulent)

### Product Management
- Paginated product listing (10 per page)
- Search with 400ms debounce
- Product detail modal with supplier information
- CSV export functionality
- Color-coded stock levels

### Transaction Management
- Create transaction form with:
  - Product lookup and auto-fill
  - Stock validation
  - Real-time price calculation
  - Payment method selection
- Transaction listing with search and pagination
- CSV export functionality
- Color-coded status chips

### CSV Export
- Available on all tables
- Handles nested objects
- Auto-generates filenames with current date
- Proper CSV escaping

## Date Formatting

The application uses ISO 8601 date formats:
- **With timezone**: `YYYY-MM-DDTHH:mm:ss.SSSZ` (for startDate/endDate)
- **Without timezone**: `YYYY-MM-DDTHH:mm:ss` (for salesDate)

## Styling

The application uses Material-UI's theming system with:
- Responsive breakpoints
- Custom color schemes
- Consistent spacing
- Mobile-first design approach

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use
If port 3000 or 3100 is already in use:
```bash
PORT=3200 npm start
```

### API Connection Issues
Ensure the backend API is running and the `REACT_APP_BACKEND_URL` in `.env` is correct.

### Module Not Found
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

1. **Hot Reload**: Changes to source files automatically reload the browser
2. **TypeScript**: Enable strict mode for better type safety
3. **Component Structure**: Keep components small and focused
4. **API Client**: Use the centralized `apiClient.ts` for all API calls
5. **Error Handling**: All API calls include error handling and loading states

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is proprietary and confidential.
- Configure MUI theming
- Establish folder structure

### 🔄 Phase 2: Layout & Navigation (Next)
- Implement dashboard layout
- Add tabbed navigation
- Create routing structure

### 📋 Phase 3: Tables & Data Display
- Integrate TanStack Table
- Add sorting, filtering, pagination
- Create reusable table components

### 📊 Phase 4: Charts & Visualizations
- Implement chart components
- Add interactive dashboards

### 🔌 Phase 5: API Integration
- Set up TanStack Query
- Create API service layer
- Implement data fetching hooks

### ✅ Phase 6: Forms & Validation
- Build form components
- Integrate Zod validation

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
