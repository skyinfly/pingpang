# Chat Threads, Message Center, and Mini Program Prep Design

**Goal:** Upgrade chat into a thread-oriented experience, add actionable filtering in the message center, and prepare the uni-app project for WeChat Mini Program builds.

**Scope**
- Add a lightweight chat thread view keyed by `matchId`
- Add message center category filters and read-state synchronization
- Add mini program environment and build preparation

**Design**
- **Chat threads:** We will treat each match chat as one thread. The backend will compute thread summaries from persisted `Message` rows joined with `Match` metadata, instead of introducing a heavier participant model right now. This keeps the MVP data model simple while still giving us thread list, latest message, unread count, and thread-level read semantics.
- **Message center:** The page will gain `All`, `System`, `Chat`, and `Invite` filters. `All` shows the current mixed feed, `Chat` switches to thread summaries, and `System` / `Invite` keep using filtered message items. Opening a chat thread will mark that thread as read and refresh summary counts.
- **Read synchronization:** The chat page will call a thread-level read endpoint when it loads and invalidate the relevant Vue Query keys so the message center stays in sync when the user returns.
- **Mini program preparation:** The app will move API base URL selection behind environment-aware helpers. We will add `dev:mp-weixin` and `build:mp-weixin` scripts, a minimal `mp-weixin` manifest block, and a simulator-safe API URL fallback so the project can be built and opened in WeChat DevTools.

**API additions**
- `GET /chat-threads?userId=...`
- `POST /chat-threads/read`
- Existing `/messages` endpoints remain in place for raw feed items and thread message details

**Testing**
- Extend API e2e coverage for thread listing and thread-level read behavior
- Add mobile tests for message center filter behavior, chat-page read synchronization, and environment-aware request URL resolution

**Out of scope**
- WebSocket/realtime delivery
- Dedicated participant/receipt tables
- WeChat login, payment, or submission setup
