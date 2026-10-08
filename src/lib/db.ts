/**
 * In-memory runtime store (no external database).
 * Hydrates FAQ/categories from seed data on cold start.
 */
export {
  getStore,
  newId,
  withCategory,
  type CategoryRecord,
  type FaqRecord,
  type AnalyticsEventRecord,
  type ChangeLogRecord,
  type AdminCredentials,
} from "@/lib/store";
