# Staff Panel Skeleton Components

This directory contains content-based skeleton loading components for the staff panel. These skeletons provide visual feedback to users while data is being fetched, improving the overall user experience.

## Available Skeletons

### 1. **StaffDashboardSkeleton**
Used for the main dashboard page showing stats cards, upcoming bookings, and quick actions.

**Features:**
- Header section skeleton
- 4 stats cards with icon and text placeholders
- Upcoming bookings list skeleton (3 items)
- Quick stats and actions skeleton

**Used in:** `staff-dashboard.tsx`

### 2. **StaffBookingsSkeleton**
Used for the bookings list page with tabs for different booking statuses.

**Features:**
- Header section skeleton
- Tab navigation skeleton (4 tabs)
- 5 booking card skeletons with:
  - Status badges and date/time placeholders
  - Service and customer info placeholders
  - Location placeholder

**Used in:** `staff-bookings.tsx`

### 3. **StaffApplicationsSkeleton**
Used for the staff applications page showing applied businesses.

**Features:**
- Header section skeleton
- Tab navigation skeleton (4 tabs with counts)
- 3 application card skeletons with:
  - Business name and status badge
  - Category and contact info
  - Action buttons

**Used in:** `staff-applications.tsx`

### 4. **StaffBusinessesSkeleton**
Used for the business browser page where staff can apply to new businesses.

**Features:**
- Header section skeleton
- Search bar skeleton
- 6 business card skeletons in a grid layout with:
  - Business name and status
  - Address and service count
  - Services preview
  - Apply button

**Used in:** `staff-business-browser.tsx`

### 5. **StaffEarningsSkeleton**
Used for the earnings page showing payment history.

**Features:**
- Header section skeleton
- 2 stats cards (Total Earned, Pending Payments)
- Filter dropdown skeleton
- Table skeleton with:
  - Table header (7 columns)
  - 5 table rows with all columns

**Used in:** `staff-earnings.tsx`

### 6. **StaffProfileSkeleton**
Used for the staff profile page.

**Features:**
- Header section skeleton
- 4 stats cards (Total Bookings, Completed, Rating, Earnings)
- Profile card with avatar and contact info
- Associated businesses section (2 cards)
- Reviews section (3 review cards)
- Quick actions (2 action buttons)

**Used in:** `staff-profile.tsx`

### 7. **StaffBookingDetailSkeleton**
Used for the individual booking detail page.

**Features:**
- Back button skeleton
- 5-step progress stepper
- Booking details card with:
  - Service name and business
  - Date, time, and price
  - Customer information
  - Service location
- Status actions card

**Used in:** `bookings/[bookingId]/page.tsx`

## Usage

Import the skeleton component from the index file:

```tsx
import { StaffDashboardSkeleton } from "@/components/staff/skeletons";

// In your component
if (isLoading) {
  return <StaffDashboardSkeleton />;
}
```

## Design Principles

1. **Content-Aware**: Each skeleton matches the actual content structure of its page
2. **Consistent Styling**: Uses `bg-gray-200` with `animate-pulse` for all placeholders
3. **Realistic Proportions**: Placeholder sizes match expected content sizes
4. **Smooth Transitions**: Skeletons appear instantly and smoothly transition to real content
5. **Accessibility**: Maintains proper layout structure during loading

## Customization

To modify skeleton styling:

1. **Color**: Change `bg-gray-200` to any gray shade
2. **Animation**: Adjust `animate-pulse` duration or use custom animation
3. **Size**: Modify width/height classes to match your content
4. **Layout**: Adjust grid columns and spacing as needed

## Benefits

- **Improved UX**: Users see something loading instead of blank screens
- **Perceived Performance**: App feels faster with immediate visual feedback
- **Reduced Layout Shift**: Skeletons maintain layout structure
- **Professional Appearance**: Polished loading states instead of spinners
