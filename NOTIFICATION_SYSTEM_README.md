# Real-Time Notification Popup System

## Overview

A beautiful, animated notification popup system that displays real-time notifications in the bottom-right corner of the application. Features include auto-dismiss, click navigation, progress bar, and smooth animations.

## Features

✨ **Beautiful UI**: Clean, modern design with smooth animations
🔔 **Real-time Updates**: Firebase Cloud Messaging integration
⏱️ **Auto-dismiss**: 5-second auto-dismiss with progress bar
🎯 **Click Navigation**: Clickable notifications that navigate to relevant pages
📱 **Responsive**: Works on all screen sizes
🎨 **Customizable**: Support for different notification types with badges
📦 **Queue Management**: Shows up to 3 notifications at once

## Installation

The system requires `framer-motion` which has been added to `package.json`. Install dependencies:

```bash
npm install
```

## Usage

### 1. Automatic Firebase Notifications

Notifications from Firebase Cloud Messaging are automatically displayed when the app is open. The system is already integrated in `firebase-foreground.tsx`.

### 2. Manual Notifications from Components

Use the `useNotificationPopup` hook in your React components:

```tsx
import { useNotificationPopup } from "@/hooks/use-notification-popup";

function MyComponent() {
  const { showNotification } = useNotificationPopup();

  const handleBooking = () => {
    // Show success notification
    showNotification({
      title: "Booking Confirmed",
      body: "Your service has been booked successfully",
      type: "BOOKING_CONFIRMED",
      clickAction: "/customer/bookings/123"
    });
  };

  return <button onClick={handleBooking}>Book Now</button>;
}
```

### 3. Global Notifications from Non-React Code

Use the `showGlobalNotification` function anywhere in your application:

```typescript
import { showGlobalNotification } from "@/hooks/use-notification-popup";

// In API responses, event handlers, etc.
async function handleApiResponse() {
  const response = await fetch("/api/booking");
  const data = await response.json();

  showGlobalNotification({
    title: "Success",
    body: "Your action was completed successfully",
    type: "SUCCESS",
    clickAction: "/dashboard"
  });
}
```

## Notification Types

The system supports any notification type. Common types include:

- `BOOKING_CONFIRMED` - New booking confirmed
- `BOOKING_CANCELLED` - Booking cancelled
- `BOOKING_COMPLETED` - Service completed
- `PAYMENT_RECEIVED` - Payment received
- `PAYMENT_PENDING` - Payment pending
- `MESSAGE` - New message
- `REVIEW` - New review received
- `TRIAL_STARTING` - Trial period starting
- `TRIAL_EXPIRING` - Trial period expiring
- `SUBSCRIPTION_RENEWED` - Subscription renewed

## Navigation

### Relative Paths (Internal Navigation)
```typescript
showNotification({
  title: "New Booking",
  body: "Click to view details",
  clickAction: "/customer/bookings/123" // Opens in same tab
});
```

### Absolute URLs (External Links)
```typescript
showNotification({
  title: "View Receipt",
  body: "Click to download your receipt",
  clickAction: "https://example.com/receipt.pdf" // Opens in new tab
});
```

## File Structure

```
src/
├── components/
│   └── common/
│       ├── notification-popup.tsx              # Individual popup component
│       ├── notification-popup-container.tsx    # Container & queue manager
│       └── firebase-foreground.tsx             # Firebase integration (updated)
├── hooks/
│   └── use-notification-popup.ts              # Hook for showing notifications
└── app/
    └── layout.tsx                              # Root layout with notification portal
```

## How It Works

1. **Container Component** (`notification-popup-container.tsx`)
   - Manages notification queue (max 3 at a time)
   - Handles auto-dismiss with 5-second timer
   - Provides global `window.showNotificationPopup` function

2. **Popup Component** (`notification-popup.tsx`)
   - Displays individual notification
   - Shows animated progress bar
   - Handles click events for navigation
   - Close button for manual dismiss

3. **Firebase Integration** (`firebase-foreground.tsx`)
   - Listens for FCM messages when app is open
   - Automatically shows popup notifications
   - Falls back to browser notifications if permission granted
   - Also shows quick toast notification

4. **React Integration** (`layout.tsx`)
   - Renders NotificationPopupContainer
   - Creates notification-root portal div
   - Available app-wide

## Customization

### Modify Auto-Dismiss Duration

In `notification-popup.tsx`, change the duration:

```typescript
const duration = 5000; // Change to 7000 for 7 seconds
```

### Modify Maximum Notifications

In `notification-popup-container.tsx`:

```typescript
const MAX_NOTIFICATIONS = 5; // Change from 3 to 5
```

### Change Position

In `notification-popup-container.tsx`, modify the container class:

```typescript
// Bottom-left
<div className="fixed bottom-4 left-4 z-[9999] flex flex-col items-start">

// Top-right
<div className="fixed top-4 right-4 z-[9999] flex flex-col items-end">
```

## Styling

The notifications use:
- **Tailwind CSS** for layout and styling
- **Framer Motion** for smooth animations
- **Lucide React** for icons
- **Blue theme** with hover states

Customize colors in `notification-popup.tsx` by modifying Tailwind classes:
- `bg-blue-100` / `text-blue-600` - Icon colors
- `bg-blue-50` / `text-blue-700` - Type badge
- `border-gray-200` - Border color

## Testing

Test the notification system by opening browser console and running:

```javascript
window.showNotificationPopup({
  title: "Test Notification",
  body: "This is a test notification",
  type: "TEST",
  clickAction: "/customer/bookings"
});
```

## Troubleshooting

**Notifications not showing?**
1. Check that `NotificationPopupContainer` is rendered in `layout.tsx`
2. Verify `notification-root` div exists
3. Check browser console for errors
4. Ensure framer-motion is installed

**Click navigation not working?**
1. Verify `clickAction` is a valid path
2. Check browser console for navigation errors
3. Ensure paths start with `/` for internal navigation

**Auto-dismiss not working?**
1. Check if notification is being hovered (pauses timer)
2. Verify state management in popup component
3. Check browser console for timer errors

## Backend Integration

To send notifications from the backend, include this data in your FCM payload:

```javascript
{
  notification: {
    title: "Booking Confirmed",
    body: "Your service has been booked successfully"
  },
  data: {
    type: "BOOKING_CONFIRMED",
    clickAction: "/customer/bookings/123",
    notificationId: "unique-id-123"
  }
}
```

See `firebase-foreground.tsx` for payload handling.

## Performance

- Only renders max 3 notifications at once
- Auto-removes after 5 seconds
- Uses React Portal for isolation
- Framer Motion for GPU-accelerated animations
- Minimal re-renders with proper memoization

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Dependencies

- framer-motion: ^12.18.0
- react: ^19.2.3
- lucide-react: ^0.555.0
- firebase: ^12.7.0

## Future Enhancements

Potential improvements:
- Sound notifications
- Notification preferences/settings
- Notification history
- Grouped notifications
- Rich content support (images, buttons)
- Custom themes per notification type
- Notification scheduling
