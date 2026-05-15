import AnalyticsService from '../services/AnalyticsService.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * ANALYTICS CONTROLLER
 * 
 * Provides high-level business intelligence endpoints.
 */

export const getAnalytics = catchAsync(async (req, res, next) => {
  const { range: timeframe } = req.query;
  
  // We delegate the heavy calculation logic to the service layer 
  // to keep our controllers purely focused on HTTP handling.
  const analytics = await AnalyticsService.getBusinessOverview(req.user.id, timeframe);

  res.json({
    success: true,
    data: { analytics }
  });
});
