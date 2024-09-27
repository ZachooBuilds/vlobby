import { query } from "./_generated/server";

export const getDashboardSummary = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = identity.orgId;

    // Fetch data from various sources
    const openHandoverNotes = await ctx.db
      .query("handoverNotes")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.eq(q.field("isClosed"), false))
      .collect();

    // Fetch data from various sources
    const scheduledAnnouncements = await ctx.db
      .query("announcements")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.eq(q.field("scheduledSend"), true))
      .filter((q) => q.gt(q.field("dateTime"), new Date().toISOString()))
      .collect();

    const pendingFeedPosts = await ctx.db
      .query("feedPosts")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.neq(q.field("status"), "approved"))
      .collect();

    const pendingBookings = await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    const valetRequests = await ctx.db
      .query("requests")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.neq(q.field("status"), "completed"))
      .collect();

    const activeIssues = await ctx.db
      .query("issues")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.neq(q.field("status"), "complete"))
      .collect();

    const accessibleUnits = await ctx.db
      .query("spaces")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.eq(q.field("accessibilityEnabled"), true))
      .collect();

    const activeWorkOrders = await ctx.db
      .query("workOrders")
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .filter((q) => q.neq(q.field("status"), "resolved"))
      .collect();

    return [
      {
        tag: "pending_announcements",
        value: scheduledAnnouncements.length.toString(),
      },
      {
        tag: "pending_feed_posts",
        value: pendingFeedPosts.length.toString(),
      },
      {
        tag: "open_handover_notes",
        value: openHandoverNotes.length.toString(),
      },
      {
        tag: "pending_bookings",
        value: pendingBookings.length.toString(),
      },
      {
        tag: "active_valet_requests",
        value: valetRequests.length.toString(),
      },
      {
        tag: "active_issues",
        value: activeIssues.length.toString(),
      },
      {
        tag: "accessible_units",
        value: accessibleUnits.length.toString(),
      },
      {
        tag: "active_work_orders",
        value: activeWorkOrders.length.toString(),
      },
    ];
  },
});
