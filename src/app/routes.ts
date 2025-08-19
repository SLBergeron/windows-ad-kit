export const CUSTOMER_ROUTES = {
  HOME: '/',
  GET_STARTED: '/get-started',
  MY_CAMPAIGNS: '/my-campaigns',
  MY_APPOINTMENTS: '/my-appointments', 
  MY_LEADS: '/my-leads',
  BILLING: '/billing',
  HELP: '/help'
} as const;

// Admin routes (for internal use)
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  ALL_CUSTOMERS: '/admin/customers',
  PERFORMANCE: '/admin/performance'
} as const;

// API routes (clear naming)
export const API_ROUTES = {
  BUY_KIT: '/api/buy-kit',
  START_CAMPAIGN: '/api/start-campaign',
  GET_APPOINTMENTS: '/api/get-appointments',
  UPDATE_BUDGET: '/api/update-budget'
} as const;
