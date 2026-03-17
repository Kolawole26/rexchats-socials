---
name: confirmation-modal
description: Global confirmation modal via forwarder + useConfirmationModal().
---

# Confirmation Modal Skill

Use this skill when you need a confirmation dialog.

## Rules

- Use ModalConfirmation (components/modal/confirmation.vue).
- Mount ModalConfirmationForwarder (components/modal/confirmationForwarder.vue) once in the app shell.
- Trigger dialogs via useConfirmationModal() (composables/confirmation.js).
- Typography: use heading tags + body-* / label / button from assets/css/global.css.
- Buttons: use CommonButton (no raw button tags).

## Usage

- In any component: const { open } = useConfirmationModal()
- Call open({ title, informationText, icon, actionButtonText, cancelButtonText, actionButtonClass, onConfirm })

Example:

open({
  title: 'You are about to log out',
  informationText: 'Your current session will be closed. To access the platform again, you''ll need to log in.',
  icon: 'logout',
  iconWrapperClass: 'text-danger-300 bg-transparent',
  actionButtonText: 'Log out',
  cancelButtonText: 'Cancel',
  actionButtonClass: 'bg-danger-300 hover:bg-danger-400',
  onConfirm: () => handleLogout()
})

## Files

- components/modal/confirmation.vue
- components/modal/confirmationForwarder.vue
- composables/confirmation.js
