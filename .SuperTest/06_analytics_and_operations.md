# Test Case: Analytics Backfill and Operations Monitoring

## User Story
As an operations engineer, I want to monitor Celery tasks, run analytics backfill jobs, and export engagement data so that schools receive accurate reports and the platform remains healthy.

## Preconditions
- Docker Compose stack running with Flower dashboard exposed on port 5555.
- Analytics events ingested for several days to populate summaries.
- Admin account with permissions to access analytics endpoints.

## Test Steps
1. Log in to the admin console and open the analytics dashboard to review daily engagement metrics.
2. Append `?format=csv` to the summary endpoint request and download the CSV export; validate headers and data integrity.
3. From the backend container shell, run `python manage.py backfill_analytics --days 7` and monitor console output for success messages.
4. Observe Flower at `http://localhost:5555` to ensure Celery workers and scheduled tasks are green during and after the backfill.
5. Trigger a synthetic failure (e.g., stop Redis container) and confirm health checks at `/health/` report degraded status while Flower reflects worker issues.
6. Restore services, rerun the health check, and ensure alerts clear; verify new analytics events continue to appear in dashboards after recovery.

## Acceptance Criteria
- Analytics summary page loads within acceptable performance budgets and reflects the latest aggregates post-backfill.
- CSV export downloads successfully and contains data matching the on-screen metrics for the selected window.
- Backfill command completes without errors, logging processed days and updating aggregates in the database.
- Flower accurately displays worker status, scheduled tasks, and task history, including the backfill job run.
- Health checks change to failure when dependencies are down and revert to success once restored, without requiring manual cache clears.

## Notes
- Capture request IDs associated with analytics API calls to trace through logs if discrepancies arise.
- Document any anomalies observed during dependency outages to refine future runbooks.
