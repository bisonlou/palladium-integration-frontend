# Palladium Integration Frontend - AI Coding Guidelines

This is a React-based enterprise management system for EPRC (Economic Policy Research Centre) with Material-UI components. Built on Create React App with Express.js production server.

## Architecture Overview

**Dual Development Setup:**
- Development: `npm run dev` (React dev server on port 3000)  
- Production: `npm start` (Express server serving built files)
- API Backend: Environment variable `REACT_APP_HOST` for backend URL

**Route Structure:**
- `/` - Landing page with login/register tabs
- `/portal` - Main dashboard with card-based navigation to modules

**Modal-Based Navigation:**
All major features (Payroll, Stationery, Projects) open as full-screen Material-UI `Popover` components anchored to fixed positions, not separate routes.

## Component Patterns

**Higher-Order Component (HOC) Styling:**
```javascript
// Standard pattern - components wrapped with withStyles()
import { withStyles } from '@material-ui/core';
import ComponentStyles from './componentStyles';

const Component = ({ classes, ...props }) => { /* JSX */ };
export default withStyles(ComponentStyles)(Component);
```

**Inline Styling with makeStyles():**
```javascript
// Alternative pattern for simpler components
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    card: { minWidth: 50, width: 300, margin: 10 }
});
```

**State Management Pattern:**
- Complex forms use detailed state objects with `id: 0` indicating "add mode" vs "edit mode"
- Error/success states follow `{ isError: false, message: '' }` pattern
- Loading states control button/spinner display in forms

## Key Conventions

**File Organization:**
- Styles in separate files: `componentStyles.js` or `componentListStyles.js`
- Main component logic in `index.js`
- Form components as `Add[Feature]Form.js`
- List components as `[Feature]List.js`

**Authentication & Session:**
- JWT tokens stored in localStorage via `utils/saveSessionInfo()`
- Authorization headers: `Bearer ${getSessionInfo('token')}`
- User email format enforced: `email@eprcug.org`

**API Communication:**
```javascript
// Standard fetch pattern
fetch(`${BASE_URL}/endpoint`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
})
.then(response => response.json())
.then(data => {
    if (data['success'] === true) {
        // Handle success
    } else {
        setError({ isError: true, message: data['description'] });
    }
});
```

## Material-UI Specific Patterns

**Table Implementation:**
- Uses custom `EnhancedTableHead` and `EnhancedTableToolbar` components
- Selection state management with checkbox arrays
- Sorting via `getComparator` and `stableSort` utilities
- Pagination with configurable rows per page (5, 10, 25)

**Date Handling:**
- `@material-ui/pickers` with `DateFnsUtils`
- Custom utilities: `formatDate()` for display, `dateToString()` for API submission
- Date format: DD-MM-YY for API, formatted strings for display

**Popover Positioning:**
Fixed anchor positions for consistent modal placement:
```javascript
anchorPosition={{ top: 100, left: 600 }} // Forms
anchorPosition={{ top: 100, left: 300 }} // Lists
```

## Development Workflow

**Environment Setup:**
- Backend API URL via `process.env.REACT_APP_HOST`
- No environment switching logic - relies on build-time configuration
- Express server serves pre-built React app in production

**Component Development:**
1. Create main component with state management
2. Extract form components for add/edit operations  
3. Implement table with enhanced headers/toolbars
4. Add error/success message handling via `Alert` component
5. Wrap with appropriate styling HOC

**Excel Integration:**
Uses `react-excel-renderer` for bulk uploads in Stationery module. File processing extracts data starting from row index 1 (skipping headers).

## Critical Integration Points

- **Authentication Flow:** Landing → Login/Register → Portal dashboard
- **Module Navigation:** IconCard clicks open feature-specific Popovers
- **Session Management:** Token-based with localStorage persistence
- **Error Boundaries:** Consistent error object patterns across all API calls
- **Responsive Design:** Material-UI Grid system with xs={} breakpoints

## Notable Quirks

- `server.js` has a typo: should be `'index.html'` not `index.js`
- Mixed styling approaches (withStyles vs makeStyles) across components
- Email validation assumes `@eprcug.org` domain suffix
- Tab navigation uses controlled components with numeric indices
- Complex nested state objects for forms requiring careful mutation handling