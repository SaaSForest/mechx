# MechX - Manual Test Cases

**Version:** 1.0
**Last Updated:** December 2024
**Status:** V1 Release Testing

---

## Test Environment Setup

### Prerequisites
- [ ] Backend server running (`php artisan serve`)
- [ ] Database seeded with test data (`php artisan migrate:fresh --seed`)
- [ ] Mobile app running on simulator/device
- [ ] SMTP configured for email testing

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Buyer | demo@mechx.app | password123 |
| Seller | seller@mechx.app | password123 |

---

## 1. Authentication

### 1.1 Registration

#### TC-AUTH-001: Buyer Registration
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app, tap "Create Account" | Registration screen displays |
| 2 | Select "Buyer" user type | Buyer registration form shows |
| 3 | Enter valid full name, email, phone, password | Fields accept input |
| 4 | Tap "Create Account" | Account created, welcome email sent |
| 5 | Check email inbox | Welcome email received with buyer-specific content |

#### TC-AUTH-002: Seller Registration
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app, tap "Create Account" | Registration screen displays |
| 2 | Select "Seller" user type | Seller registration form shows with additional fields |
| 3 | Enter all required fields including business name, address, specialty | Fields accept input |
| 4 | Tap "Create Account" | Account created, welcome email sent |
| 5 | Check email inbox | Welcome email received with seller-specific content |

#### TC-AUTH-003: Registration Validation
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Try registering with empty fields | Validation errors shown |
| 2 | Enter invalid email format | "Please enter a valid email" error |
| 3 | Enter password less than 8 characters | Password validation error |
| 4 | Enter mismatched confirm password | Passwords don't match error |
| 5 | Try registering with existing email | "Email already taken" error |

### 1.2 Login

#### TC-AUTH-004: Successful Login
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app, reach login screen | Login form displays with demo credentials pre-filled |
| 2 | Tap "Sign In" with demo credentials | Loading indicator shows |
| 3 | Wait for response | Redirected to dashboard |
| 4 | Verify user data loaded | Profile info, notifications visible |

#### TC-AUTH-005: Login Validation
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Clear email field, tap Sign In | "Email is required" error |
| 2 | Enter invalid email, tap Sign In | "Invalid email" error |
| 3 | Enter wrong password | "Invalid credentials" API error banner |
| 4 | Enter non-existent email | Appropriate error message |

### 1.3 Password Reset

#### TC-AUTH-006: Forgot Password Flow
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap "Forgot password?" on login | Forgot password screen displays |
| 2 | Enter registered email | Field accepts input |
| 3 | Tap "Send Reset Code" | Loading indicator, then success message |
| 4 | Check email inbox | Password reset email with 6-digit code received |
| 5 | "Continue" button appears | Navigates to reset password screen |

#### TC-AUTH-007: Reset Password with Code
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | On reset screen, enter 6-digit code from email | Code field accepts input |
| 2 | Enter new password (min 8 chars) | Password field validates |
| 3 | Confirm new password | Matches validation passes |
| 4 | Tap "Reset Password" | Success message, redirect to login |
| 5 | Login with new password | Successfully authenticated |

#### TC-AUTH-008: Reset Password Validation
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter wrong 6-digit code | "Invalid or expired code" error |
| 2 | Enter expired code (after 60 min) | "Code has expired" error |
| 3 | Enter mismatched passwords | Validation error shown |

### 1.4 Change Password

#### TC-AUTH-009: Change Password (Authenticated)
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login, go to Profile > Settings | Settings screen displays |
| 2 | Tap "Change Password" | Change password form shows |
| 3 | Enter current password, new password, confirm | Fields accept input |
| 4 | Tap "Update Password" | Success message |
| 5 | Logout, login with new password | Successfully authenticated |

### 1.5 Account Deletion

#### TC-AUTH-010: Delete Account
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Profile > Settings | Settings options visible |
| 2 | Tap "Delete Account" | Confirmation dialog with password prompt |
| 3 | Enter current password, confirm | Account deleted |
| 4 | Try to login with deleted account | "Invalid credentials" error |

---

## 2. Buyer Flows

### 2.1 Dashboard

#### TC-BUY-001: Buyer Dashboard Display
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as buyer | Dashboard screen displays |
| 2 | Verify metrics visible | Total requests, active requests, offers received, pending, completed counts |
| 3 | Verify recent requests widget | Last 5 requests shown |
| 4 | Verify featured cars widget | Featured car listings displayed |
| 5 | Verify notification badge | Unread count shown if any |

### 2.2 Part Requests

#### TC-BUY-002: Create Part Request
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap "Create Request" or FAB button | Request form opens |
| 2 | Enter required fields: part name, make, model, year | Fields accept input |
| 3 | Add optional fields: engine, description, condition, budget | Fields accept input |
| 4 | Set urgency level (flexible/standard/urgent) | Selection saved |
| 5 | Add photos (up to 5, max 5MB each) | Photos preview shown |
| 6 | Tap "Submit Request" | Request created, redirects to request list |
| 7 | Verify request in "My Requests" | New request appears with "Active" status |

#### TC-BUY-003: Edit Part Request
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to My Requests, select active request | Request details display |
| 2 | Tap "Edit" button | Edit form opens with current data |
| 3 | Modify fields | Changes saved locally |
| 4 | Tap "Save Changes" | Request updated |
| 5 | Verify changes persisted | Updated data shows on refresh |

#### TC-BUY-004: Delete Part Request
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select active request with no accepted offers | Request details display |
| 2 | Tap "Delete" button | Confirmation dialog shows |
| 3 | Confirm deletion | Request removed from list |
| 4 | Verify deletion | Request no longer appears |

#### TC-BUY-005: Delete Request Blocked
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select request with accepted offer | Request details display |
| 2 | Attempt to delete | Error: Cannot delete with accepted offer |

#### TC-BUY-006: Request Photo Management
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open request edit screen | Current photos displayed |
| 2 | Tap "Add Photo" | Image picker opens |
| 3 | Select image | Upload progress, then thumbnail shown |
| 4 | Tap delete on existing photo | Photo removed |
| 5 | Save changes | Photo changes persisted |

### 2.3 Viewing & Managing Offers

#### TC-BUY-007: View Offers on Request
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open request with offers | Offers tab/section visible |
| 2 | View offer cards | Each shows: seller info, price, condition, delivery time, rating |
| 3 | Tap offer for details | Full offer details display with seller profile |

#### TC-BUY-008: Accept Offer
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View offer on active request | Accept/Reject buttons visible |
| 2 | Tap "Accept Offer" | Confirmation dialog shows |
| 3 | Confirm acceptance | Offer status: Accepted, request status: Pending |
| 4 | Other offers on same request | Automatically rejected |
| 5 | Seller receives notification | Notification sent to seller |

#### TC-BUY-009: Reject Offer
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View pending offer | Reject button visible |
| 2 | Tap "Reject Offer" | Confirmation dialog |
| 3 | Confirm rejection | Offer status: Rejected |
| 4 | Seller receives notification | Notification sent |

#### TC-BUY-010: Complete Request
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open request with accepted offer (Pending status) | Complete button visible |
| 2 | Tap "Mark Complete" | Confirmation dialog |
| 3 | Confirm | Request status: Completed |
| 4 | Review prompt appears | Option to leave review for seller |

### 2.4 Reviews

#### TC-BUY-011: Submit Seller Review
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Complete a transaction | Review option appears |
| 2 | Tap to leave review | Review form with 1-5 star rating |
| 3 | Select star rating | Rating highlighted |
| 4 | Enter optional comment | Comment field accepts text |
| 5 | Submit review | Review saved, seller's rating updated |

#### TC-BUY-012: Review Constraints
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Try to review before completion | Review option not available |
| 2 | Try to submit second review | Error: Already reviewed |

---

## 3. Seller Flows

### 3.1 Seller Dashboard

#### TC-SELL-001: Seller Dashboard Display
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as seller | Seller dashboard displays |
| 2 | Verify metrics | New requests, total offers, pending, accepted, rating, sales, revenue |
| 3 | Verify recent requests widget | Active requests to browse |
| 4 | Verify recent offers widget | Last 5 submitted offers |

### 3.2 Browsing Requests

#### TC-SELL-002: Browse Active Requests
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to "Browse Requests" | List of active buyer requests |
| 2 | View request cards | Part name, car info, budget range, urgency visible |
| 3 | Tap request for details | Full request details with photos |
| 4 | Filter by criteria | Filtered results display |

### 3.3 Submitting Offers

#### TC-SELL-003: Submit Offer on Request
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open active request | "Make Offer" button visible |
| 2 | Tap "Make Offer" | Offer form opens |
| 3 | Enter price (in Lek) | Price field accepts decimal |
| 4 | Select condition (new/used/refurbished) | Condition selected |
| 5 | Enter delivery time | Delivery time field accepts text |
| 6 | Add optional notes | Notes field accepts text |
| 7 | Add photos of part | Photos uploaded |
| 8 | Tap "Submit Offer" | Offer created with Pending status |
| 9 | Verify in "My Offers" | New offer appears |

#### TC-SELL-004: One Offer Per Request Constraint
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Submit offer on request | Offer created |
| 2 | Return to same request | "Make Offer" button replaced with "View My Offer" |
| 3 | Attempt second offer | Not allowed - already submitted |

#### TC-SELL-005: Cannot Offer on Own Request
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create request as buyer (if hybrid account exists) | Request created |
| 2 | Switch to seller mode | |
| 3 | Find own request | "Make Offer" button not visible or disabled |

### 3.4 Managing Offers

#### TC-SELL-006: Update Pending Offer
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to My Offers, select pending offer | Offer details display |
| 2 | Tap "Edit" | Edit form with current data |
| 3 | Modify price, notes, photos | Changes saved locally |
| 4 | Tap "Update Offer" | Offer updated |

#### TC-SELL-007: Withdraw Offer
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select pending offer | Withdraw option visible |
| 2 | Tap "Withdraw Offer" | Confirmation dialog |
| 3 | Confirm | Offer status: Withdrawn |

#### TC-SELL-008: Cannot Withdraw Accepted Offer
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Select accepted offer | No withdraw option |
| 2 | Verify offer is locked | Cannot modify accepted offer |

### 3.5 Car Listings

#### TC-SELL-009: Create Car Listing
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to "My Listings" or car section | Add listing button visible |
| 2 | Tap "Add Listing" | Listing form opens |
| 3 | Enter required: make, model, year, mileage, price | Fields validated |
| 4 | Select fuel type, transmission | Dropdown selections |
| 5 | Enter location | Location field accepts text |
| 6 | Add description | Description saved |
| 7 | Add photos (2-5 recommended) | Photos uploaded with preview |
| 8 | Tap "Create Listing" | Listing created with Active status |

#### TC-SELL-010: Manage Car Listing
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View own listing | Edit/Delete options visible |
| 2 | Edit listing details | Changes saved |
| 3 | Toggle featured status | Featured badge added/removed |
| 4 | Mark as sold | Status changes to Sold |
| 5 | Delete listing | Listing removed |

---

## 4. Messaging

### 4.1 Conversations

#### TC-MSG-001: Start Conversation from Part Request
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Buyer views offer on their request | "Message Seller" button visible |
| 2 | Tap to message | Conversation screen opens |
| 3 | Context shows part request reference | Request info displayed |

#### TC-MSG-002: Start Conversation from Car Listing
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Buyer views car listing | "Contact Seller" button visible |
| 2 | Tap to message | Conversation screen opens |
| 3 | Context shows car listing reference | Car info displayed |

#### TC-MSG-003: View Conversation List
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Messages tab | List of conversations |
| 2 | Each shows: participant, last message, timestamp, unread count | All info visible |
| 3 | Conversations sorted by recent activity | Most recent first |

### 4.2 Messages

#### TC-MSG-004: Send and Receive Messages
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open conversation | Message history displays |
| 2 | Type message in input | Text entered |
| 3 | Tap send | Message appears in conversation |
| 4 | Other user opens conversation | Message visible |
| 5 | Other user replies | Reply appears (may need refresh) |

#### TC-MSG-005: Message Read Status
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Send message | Message shows as sent |
| 2 | Recipient opens conversation | Read status updated |
| 3 | Unread count decreases | Badge count updates |

#### TC-MSG-006: Mark Conversation as Read
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View conversation with unread messages | Unread indicator visible |
| 2 | View messages | Automatically marked as read |
| 3 | Return to conversation list | Unread count cleared |

---

## 5. Notifications

### 5.1 Notification Display

#### TC-NOT-001: View Notifications
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap notification bell/icon | Notifications list displays |
| 2 | View notification cards | Type, message, timestamp shown |
| 3 | Unread notifications highlighted | Visual distinction |

#### TC-NOT-002: Notification Badge
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Receive new notification | Badge count increments |
| 2 | Open notifications | Badge visible |
| 3 | Mark as read | Badge count decrements |

### 5.2 Notification Types

#### TC-NOT-003: Offer Notifications
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Seller submits offer on buyer's request | Buyer receives "offer" notification |
| 2 | Buyer accepts offer | Seller receives acceptance notification |
| 3 | Buyer rejects offer | Seller receives rejection notification |

#### TC-NOT-004: Message Notifications
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User sends message | Recipient receives "message" notification |
| 2 | Tap notification | Opens relevant conversation |

### 5.3 Notification Management

#### TC-NOT-005: Mark Notifications as Read
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View unread notification | Mark as read option |
| 2 | Tap to mark as read | Notification styling changes |
| 3 | Use "Mark All Read" | All notifications marked read |

#### TC-NOT-006: Delete Notification
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Swipe or tap delete on notification | Confirmation if needed |
| 2 | Confirm deletion | Notification removed |

---

## 6. Search & Discovery

### 6.1 Global Search

#### TC-SRCH-001: Search Cars
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to search screen | Search input visible |
| 2 | Enter car make (e.g., "BMW") | Results filter as you type (debounced 300ms) |
| 3 | View results | Cars matching make display |
| 4 | Search by model, location | Relevant results returned |

#### TC-SRCH-002: Search Parts
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Search for part name (e.g., "brake") | Part requests matching returned |
| 2 | Search by car make/model | Relevant requests shown |

#### TC-SRCH-003: Search Sellers
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Search seller name or business | Matching sellers returned |
| 2 | Search by specialty | Specialty-matched sellers shown |
| 3 | View seller card | Name, business, rating, verification visible |

#### TC-SRCH-004: Filtered Search
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Use type filter (cars/parts/sellers) | Results limited to selected type |
| 2 | Minimum 2 characters required | No search for single character |

### 6.2 Saved Items

#### TC-SRCH-005: Save/Unsave Items
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View car listing | Save/heart button visible |
| 2 | Tap to save | Item added to saved items |
| 3 | Verify in Saved Items list | Item appears |
| 4 | Tap again to unsave | Item removed from saved |

#### TC-SRCH-006: View Saved Items
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Saved Items screen | List of saved cars and requests |
| 2 | Tap item | Opens item details |
| 3 | Empty state if no saved | Appropriate message shown |

---

## 7. Media & Photos

### 7.1 Photo Upload

#### TC-MED-001: Upload Photo to Request
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create/edit part request | Add photo option |
| 2 | Tap add photo | Image picker (camera/gallery) |
| 3 | Select image under 5MB | Upload progress shown |
| 4 | Upload complete | Thumbnail displayed |
| 5 | Upload over 5MB | Error: File too large |

#### TC-MED-002: Upload Photo to Car Listing
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create/edit car listing | Photo upload section |
| 2 | Add multiple photos | All uploads successful |
| 3 | Photos display in gallery | Thumbnails visible |

#### TC-MED-003: Photo Conversions
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Upload photo | Original saved |
| 2 | View in list (thumbnail) | 400x300 conversion displayed |
| 3 | View in detail/gallery | 800x600 conversion displayed |

### 7.2 Profile Photo

#### TC-MED-004: Upload Profile Photo
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Profile | Current photo or placeholder |
| 2 | Tap photo/edit button | Image picker opens |
| 3 | Select image | Upload and update |
| 4 | Verify across app | New photo shown everywhere |

---

## 8. Edge Cases & Error Handling

### 8.1 Network Errors

#### TC-ERR-001: Offline Mode
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Disable network connection | App shows offline indicator |
| 2 | Attempt API call | Appropriate error message |
| 3 | Restore connection | App recovers, data refreshes |

#### TC-ERR-002: Slow Network
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Throttle network | Loading indicators show |
| 2 | Wait for timeout | Timeout error handled gracefully |
| 3 | Retry option available | User can retry action |

### 8.2 Session Management

#### TC-ERR-003: Token Expiration
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Wait for token to expire | Next API call fails auth |
| 2 | Handle 401 response | User redirected to login |
| 3 | Re-login | New session established |

#### TC-ERR-004: Concurrent Sessions
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login on device A | Session active |
| 2 | Login on device B | Both sessions may work (depends on config) |
| 3 | Logout from one device | Other device may still work |

### 8.3 Validation Edge Cases

#### TC-ERR-005: Special Characters in Input
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter special chars in text fields | Properly escaped/handled |
| 2 | HTML/script in input | Sanitized, no XSS |
| 3 | Unicode characters | Displayed correctly |

#### TC-ERR-006: Boundary Values
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter max length text | Accepted or truncated appropriately |
| 2 | Enter 0 for numeric fields | Validation error if not allowed |
| 3 | Enter negative numbers | Rejected for prices, mileage |

### 8.4 Data Consistency

#### TC-ERR-007: Concurrent Modifications
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Two users accept same offer | Only one succeeds, other gets error |
| 2 | Edit while another deletes | Appropriate error handling |

#### TC-ERR-008: Deleted Resource Access
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Bookmark/save item URL | Item accessible |
| 2 | Owner deletes item | Bookmarked link shows 404/deleted message |

---

## 9. Performance & UX

### 9.1 Response Times

#### TC-PERF-001: API Response Time
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Perform various API calls | Response under 500ms |
| 2 | Search with results | Debounced, quick response |
| 3 | Image upload | Progress indicator, reasonable time |

### 9.2 Pagination

#### TC-PERF-002: List Pagination
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View long list (requests, cars) | First page loads quickly |
| 2 | Scroll to bottom | Next page loads automatically |
| 3 | Continue scrolling | All pages load correctly |

### 9.3 Image Loading

#### TC-PERF-003: Lazy Loading Images
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open screen with images | Placeholders show first |
| 2 | Images load progressively | No UI freeze |
| 3 | Scroll quickly | Images load on scroll |

---

## 10. Cross-Platform Testing

### 10.1 iOS Testing

#### TC-PLAT-001: iOS Specific
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Test keyboard avoiding | Forms scroll properly |
| 2 | Test safe areas | Content not under notch |
| 3 | Test haptic feedback | Appropriate vibrations |

### 10.2 Android Testing

#### TC-PLAT-002: Android Specific
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Test back button behavior | Navigates correctly |
| 2 | Test different screen sizes | Layout adapts |
| 3 | Test permissions | Camera, storage permissions requested |

---

## Test Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Developer | | | |
| Product Owner | | | |

---

## Notes

- All tests should be run on both iOS and Android
- Test with both fresh install and upgrade scenarios
- Document any bugs found with screenshots and reproduction steps
- Re-test fixed bugs before sign-off
