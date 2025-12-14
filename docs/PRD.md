# MechX - Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** December 2024
**Status:** V1 Release

---

## 1. Product Overview

### 1.1 Vision
MechX is a mobile marketplace platform connecting car owners seeking spare parts with verified sellers who can fulfill those requests. The platform streamlines the traditionally fragmented car parts market by providing a centralized, transparent, and efficient system for part discovery, price comparison, and transaction completion.

### 1.2 Target Market
- **Primary:** Albania (localized for Albanian Lek currency)
- **Users:** Car owners (buyers) and auto parts dealers/mechanics (sellers)

### 1.3 Core Value Proposition
- **For Buyers:** Easy part requests, multiple competitive offers, verified sellers with ratings
- **For Sellers:** Access to active demand, business visibility, reputation building

---

## 2. User Roles

### 2.1 Buyer
A user who needs car spare parts and creates requests for sellers to fulfill.

**Profile Fields:**
- Full name
- Email (unique)
- Phone number
- Profile photo

**Capabilities:**
- Create and manage part requests
- Receive and compare offers from multiple sellers
- Accept/reject offers
- Complete transactions
- Leave reviews for sellers
- Browse car listings
- Save favorite items
- Message sellers

### 2.2 Seller
A user who sells car spare parts and responds to buyer requests.

**Profile Fields:**
- Full name
- Email (unique)
- Phone number
- Profile photo
- Business name
- Business address
- Specialty (e.g., "Engine Parts", "BMW Specialist")
- Verification status
- Average rating (1-5)
- Total sales count

**Capabilities:**
- Browse active part requests
- Submit offers on requests
- Manage submitted offers
- Create car listings
- View sales statistics and revenue
- Receive reviews from buyers
- Message buyers

---

## 3. Feature Specifications

### 3.1 Authentication

#### 3.1.1 Registration
- Email/password registration
- User type selection (Buyer/Seller)
- Seller-specific fields (business name, address, specialty)
- Phone number required
- Welcome email sent on registration

#### 3.1.2 Login
- Email/password authentication
- Token-based session (Laravel Sanctum)
- Demo credentials pre-filled for testing

#### 3.1.3 Password Management
- Forgot password flow via email
- 6-digit verification code (60-minute expiry)
- Change password (requires current password)
- Account deletion (requires password confirmation)

---

### 3.2 Part Requests (Buyer Feature)

#### 3.2.1 Create Request
**Required Fields:**
| Field | Type | Description |
|-------|------|-------------|
| Part Name | String | Name of the part needed |
| Car Make | String | Vehicle manufacturer |
| Car Model | String | Vehicle model |
| Car Year | Year | Manufacturing year |

**Optional Fields:**
| Field | Type | Description |
|-------|------|-------------|
| Engine | String | Engine specification |
| Description | Text | Additional details |
| Condition Preference | Enum | new, used, any |
| Budget Min | Decimal | Minimum budget |
| Budget Max | Decimal | Maximum budget |
| Location | String | Pickup/delivery location |
| Urgency | Enum | flexible, standard, urgent |
| Offer Deadline | Date | Deadline for offers |
| Photos | Files | Multiple images (max 5MB each) |

#### 3.2.2 Request Status Flow
```
Active → Pending → Completed
         ↓
      Cancelled
```
- **Active:** Open for offers
- **Pending:** Offer accepted, awaiting completion
- **Completed:** Transaction finished
- **Cancelled:** Request withdrawn

#### 3.2.3 Request Management
- View all own requests
- Filter by status
- Edit active requests only
- Delete requests (only if no accepted offers)
- Upload/delete photos

---

### 3.3 Offers (Seller Feature)

#### 3.3.1 Submit Offer
**Required Fields:**
| Field | Type | Description |
|-------|------|-------------|
| Price | Decimal | Quoted price in L (Lek) |
| Part Condition | Enum | new, used, refurbished |
| Delivery Time | String | Estimated delivery timeframe |

**Optional Fields:**
| Field | Type | Description |
|-------|------|-------------|
| Notes | Text | Additional details |
| Photos | Files | Images of the part |

#### 3.3.2 Offer Constraints
- One offer per seller per request
- Cannot offer on own requests
- Cannot withdraw accepted offers

#### 3.3.3 Offer Status Flow
```
Pending → Accepted
    ↓
Rejected
    ↓
Withdrawn
```

#### 3.3.4 Offer Management
- View all submitted offers
- Update pending offers
- Withdraw pending offers
- Upload/delete photos

---

### 3.4 Car Listings

#### 3.4.1 Create Listing
**Required Fields:**
| Field | Type | Description |
|-------|------|-------------|
| Make | String | Vehicle manufacturer |
| Model | String | Vehicle model |
| Year | Year | Manufacturing year |
| Mileage | Integer | Odometer reading (km) |
| Price | Decimal | Asking price in L |
| Fuel Type | Enum | petrol, diesel, electric, hybrid |
| Transmission | Enum | automatic, manual |
| Location | String | Vehicle location |

**Optional Fields:**
| Field | Type | Description |
|-------|------|-------------|
| Description | Text | Vehicle details |
| Is Featured | Boolean | Promoted listing |
| Photos | Files | Multiple images |

#### 3.4.2 Listing Status
- **Active:** Visible to buyers
- **Sold:** Transaction completed
- **Expired:** Listing expired

---

### 3.5 Messaging System

#### 3.5.1 Conversations
- One conversation per unique context (part request or car listing)
- Two participants per conversation
- Last message timestamp tracking
- Unread message count per user

#### 3.5.2 Messages
- Text content
- Read status tracking
- Real-time updates via broadcasting
- Sender identification

#### 3.5.3 Context Types
- Part Request context
- Car Listing context

---

### 3.6 Reviews & Ratings

#### 3.6.1 Review Eligibility
- Offer must be accepted
- Request must be completed
- One review per offer (enforced by unique constraint)

#### 3.6.2 Review Fields
| Field | Type | Description |
|-------|------|-------------|
| Rating | Integer | 1-5 stars |
| Comment | Text | Optional feedback |

#### 3.6.3 Rating Calculation
- Seller's average rating auto-calculated from all reviews
- Displayed to 1 decimal place

---

### 3.7 Notifications

#### 3.7.1 Notification Types
| Type | Trigger |
|------|---------|
| offer | New offer received, offer accepted/rejected |
| message | New message in conversation |
| order | Transaction completed |
| system | General announcements |

#### 3.7.2 Notification Features
- Unread count badge
- Mark as read (individual/all)
- Delete notifications
- Push notifications via Expo

---

### 3.8 Search & Discovery

#### 3.8.1 Global Search
- Search across cars, parts, and sellers
- Minimum 2 characters to trigger search
- Debounced input (300ms)

#### 3.8.2 Search Filters
**Cars:** make, model, location
**Parts:** part name, car make, car model
**Sellers:** name, business name, specialty

#### 3.8.3 Saved Items
- Save cars and part requests
- Polymorphic relationship
- Toggle save/unsave

---

### 3.9 Dashboard

#### 3.9.1 Buyer Dashboard
| Metric | Description |
|--------|-------------|
| Total Requests | All-time request count |
| Active Requests | Currently open requests |
| Offers Received | Total offers on all requests |
| Pending Offers | Awaiting decision |
| Completed | Finished transactions |

**Widgets:**
- Recent requests (last 5)
- Featured cars
- Unread notifications

#### 3.9.2 Seller Dashboard
| Metric | Description |
|--------|-------------|
| New Requests | Active requests from buyers |
| Total Offers | All-time offers sent |
| Pending Offers | Awaiting buyer decision |
| Accepted Offers | Successful offers |
| Rating | Average review rating |
| Total Sales | Completed sales count |
| Revenue | Sum of accepted offer prices |

**Widgets:**
- Recent requests to browse (last 5)
- Recent offers (last 5)
- Unread notifications

---

## 4. API Endpoints

### 4.1 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register | Register new user |
| POST | /api/login | User login |
| POST | /api/logout | User logout |
| GET | /api/user | Get current user |
| PUT | /api/user | Update profile |
| POST | /api/user/photo | Upload profile photo |
| POST | /api/auth/forgot-password | Request reset code |
| POST | /api/auth/reset-password | Reset password |
| POST | /api/auth/change-password | Change password |
| DELETE | /api/auth/account | Delete account |

### 4.2 Part Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/part-requests | List user's requests |
| POST | /api/part-requests | Create request |
| GET | /api/part-requests/{id} | Get request details |
| PUT | /api/part-requests/{id} | Update request |
| DELETE | /api/part-requests/{id} | Delete request |
| POST | /api/part-requests/{id}/photos | Upload photo |
| POST | /api/part-requests/{id}/complete | Mark complete |
| GET | /api/browse-requests | Browse active requests (seller) |

### 4.3 Offers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/offers | Get offers on my requests |
| GET | /api/my-offers | Get my submitted offers |
| POST | /api/offers | Submit offer |
| GET | /api/offers/{id} | Get offer details |
| PUT | /api/offers/{id} | Update offer |
| DELETE | /api/offers/{id} | Withdraw offer |
| POST | /api/offers/{id}/accept | Accept offer |
| POST | /api/offers/{id}/reject | Reject offer |
| POST | /api/offers/{id}/photos | Upload photo |

### 4.4 Car Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cars | List all cars (public) |
| GET | /api/cars/{id} | Get car details |
| GET | /api/my-cars | Get my listings |
| POST | /api/cars | Create listing |
| PUT | /api/cars/{id} | Update listing |
| DELETE | /api/cars/{id} | Delete listing |
| POST | /api/cars/{id}/photos | Upload photo |
| POST | /api/cars/{id}/feature | Toggle featured |

### 4.5 Messaging
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/conversations | List conversations |
| POST | /api/conversations | Start conversation |
| GET | /api/conversations/{id}/messages | Get messages |
| POST | /api/conversations/{id}/messages | Send message |
| POST | /api/conversations/{id}/read | Mark as read |

### 4.6 Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notifications | List notifications |
| GET | /api/search | Global search |
| GET | /api/saved-items | List saved items |
| POST | /api/reviews | Submit review |
| GET | /api/dashboard/buyer | Buyer stats |
| GET | /api/dashboard/seller | Seller stats |

---

## 5. Data Models

### 5.1 Entity Relationship Diagram

```
Users (1) ----< (N) Part Requests
Users (1) ----< (N) Offers
Users (1) ----< (N) Car Listings
Users (1) ----< (N) Conversations (as participant)
Users (1) ----< (N) Messages
Users (1) ----< (N) Notifications
Users (1) ----< (N) Reviews (as reviewer)
Users (1) ----< (N) Reviews (as reviewed)
Users (1) ----< (N) Saved Items

Part Requests (1) ----< (N) Offers
Part Requests (1) ----< (N) Photos (media)

Offers (1) ----< (N) Photos (media)
Offers (1) ---- (1) Review

Car Listings (1) ----< (N) Photos (media)

Conversations (1) ----< (N) Messages
```

### 5.2 Key Tables
- users
- part_requests
- offers
- car_listings
- conversations
- messages
- notifications
- reviews
- saved_items
- media (Spatie MediaLibrary)

---

## 6. Technical Architecture

### 6.1 Backend Stack
- **Framework:** Laravel 11 (PHP 8.2+)
- **Authentication:** Laravel Sanctum
- **Database:** MySQL/PostgreSQL
- **File Storage:** Spatie MediaLibrary
- **Email:** Laravel Mail (SMTP)

### 6.2 Frontend Stack
- **Framework:** React Native (Expo)
- **State Management:** Zustand
- **Navigation:** React Navigation
- **HTTP Client:** Axios
- **UI Components:** Custom components

### 6.3 Media Processing
- **Library:** Spatie MediaLibrary
- **Conversions:**
  - thumb (400x300)
  - large (800x600)
- **Max Upload:** 5MB per file

### 6.4 Push Notifications
- **Provider:** Expo Push Notifications
- **Token Storage:** expo_push_token field on users

---

## 7. Non-Functional Requirements

### 7.1 Performance
- API response time < 500ms
- Image lazy loading
- Debounced search (300ms)

### 7.2 Security
- Token-based authentication
- Password hashing (bcrypt)
- Input validation on all endpoints
- File type/size validation
- HTTPS required

### 7.3 Scalability
- Stateless API design
- Database indexing on foreign keys
- Paginated responses

---

## 8. Future Considerations (Post-V1)

- In-app payments
- Real-time chat (WebSocket)
- Seller verification system
- Advanced search filters
- Price history tracking
- Multi-language support
- Delivery integration
- Warranty tracking
