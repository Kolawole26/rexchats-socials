# Profile

Route: /profile (pages/profile.vue).

## Role-based view
- Admin: Shows basic account info and settings.
- Vendor: Shows business information, account status pill, and description with edit action.

Role detection follows the same approach as pages/settings.vue (reads common role keys and defaults to vendor when not admin).

## Side drawers
- Description drawer: right Sidebar with custom header and a componentized body (components/profile/DescriptionSidebarBody.vue). Footer actions remain visible at the bottom.
- Change password drawer: right Sidebar with custom header and a componentized body (components/profile/ChangePasswordSidebarBody.vue). Footer actions remain visible at the bottom.

## Validation
Both drawers use Joi field validation (real-time) following the form-validation skill.

## Status pills
Use the shared CommonStatus component (components/common/status.vue) for account status styling.

## Header notifications
Notifications are handled in components/partials/TheHeader.vue via a popup overlay panel toggled by the bell icon.
