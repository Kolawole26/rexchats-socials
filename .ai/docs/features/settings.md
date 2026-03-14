# Settings

Route: /settings (pages/settings.vue).

## Role-based layout
- Vendor: Shows General, Logistics, FAQs tabs.
- Admin: Shows only the General section.

Role detection checks common keys (role, user_role, userRole, type, accountType, account_type). If no role is available, the UI defaults to the Vendor view.

## Logistics delivery price
In the Vendor -> Logistics tab, clicking Edit opens a right Sidebar titled "Delivery Price" with a single input and Cancel/Save actions.

## UI conventions
- Use global typography classes from assets/css/global.css (body-*, label, button) and semantic headings (h1-h5).
- Use CommonButton instead of raw button tags.
- Use BaseCustomIcon with SVGs in assets/icons.
