# Orders

## Overview
- pages/orders.vue implements the Orders table (Logistics patterns).
- Single right-side drawer uses components/orders/OrderSidebarBody.vue.

## Filtering
- Uses ModalFilterMenu overlay.
- Filters: Platform, Payment, Price (min/max), Date (from/to).
- Reset clears filters + resets pagination.

## Order Drawer
- Collapsible sections: ORDER DETAILS, ITEM(S), DELIVERY DETAILS.
- Tracking ID shows when available and can be copied.

## Validation (Joi)
- Validates Payment Status + Order Status with Joi.
- Validates on select change; errors pass via `:error` on FormSelect.
