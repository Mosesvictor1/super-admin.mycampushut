# CampusHut content, releases, and ads modules

## Scope
Add three complete, navigable admin pages: News, Mobile App Version Control, and Ads Manager. Connect each page to the endpoints in the supplied OpenAPI document, preserving the CampusHut dashboard look and existing React/Vite structure.

## Implementation
- Create a shared client for the documented staging API, including JSON and multipart requests, response/error handling, and typed news/version operations.
- Replace the local-only News & Blog screen with API-backed article search, create, edit, and delete. Respect the API's narrower edit payload and retain a visible demo-data fallback when requests fail.
- Build release controls for Android/iOS, using the documented version checks and create/update calls. The API does not document a release-history list, so show platform check results and locally seeded examples when necessary rather than inventing a read endpoint.
- Build Ads Manager with campaign/advertiser lists, campaign analytics and actions, advertiser management, placements, and priorities. Normalize the API's loosely specified responses and identify local sample content when the service is unavailable.
- Add sidebar entries and routes for all three pages. Record the API-client boundary in `AGENTS.md` and keep the task checklist current.

## Technical details
The documented base URL is `https://staging.mycampushut.com/campusHutNews`; allow an optional Vite environment override. The specification has no authentication scheme and several campaign/version response schemas are generic objects, so requests use only documented fields and UI parsing remains defensive. Live API persistence depends on browser access and the staging service's CORS availability.

## Verification
Check type/build diagnostics, exercise navigation and the main forms against the running preview, inspect current observability logs, and confirm fallback states are clearly distinguished from live API data.
