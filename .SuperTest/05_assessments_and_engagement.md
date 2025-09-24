# Test Case: Assessments, XP Progression, and Community Engagement

## User Story
As an engaged student, I want to take assessments, earn XP/badges, and participate in community discussions so that I feel motivated to continue learning on Mr ICT.

## Preconditions
- Student account with access to at least one course assessment and community discussion.
- Assessment question bank populated with various question types.
- Notifications service operational to deliver announcements and activity alerts.

## Test Steps
1. Navigate to the Assessments section and start a quiz linked to an enrolled course.
2. Complete questions including multiple choice, code evaluation, and free-response; submit and review grading feedback.
3. Verify that XP and badge awards appear in the post-assessment summary and on the dashboard progression overview.
4. Open the community lesson discussion and post a comment; reply to an existing comment and react with an emoji if available.
5. Check announcements page for new messages and confirm acknowledgment/dismissal persists across sessions.
6. Inspect notifications (email/in-app if configured) to ensure assessment completion and community activity generate relevant alerts.

## Acceptance Criteria
- Assessment attempts track start/end times, allow resume if interrupted, and prevent duplicate submissions beyond allowed retries.
- Grading results display correct/incorrect indicators, explanations, and overall score aligned with backend calculations.
- XP and badge issuance updates student progression APIs and surfaces in the dashboard and certificate gallery where applicable.
- Community discussions support CRUD with moderation safeguards; inappropriate content can be flagged by admins.
- Announcements and notifications respect user preferences and mark-as-read state synchronizes across devices.

## Notes
- Ensure analytics events are fired for assessment start/completion and community interactions to feed engagement dashboards.
- Validate rate limiting or anti-spam measures exist for comments and that error handling maintains UX continuity.
