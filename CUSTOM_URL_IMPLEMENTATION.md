# Custom URL Implementation for PayLink

## Analysis of Current PayLink Creation Logic

### Current Flow
1. **User Input**: User fills form with recipient wallet address, amount (SOL), and optional message
2. **Validation**: 
   - Recipient: Validates Solana address format (32-44 chars, base58)
   - Amount: Checks if > 0
3. **API Processing**: 
   - Generates UUID v4 for link ID
   - Stores link in Supabase database
4. **Redirect**: User redirected to `/link/[uuid]`

### Strengths ✅
- ✅ Proper validation for recipient address format
- ✅ Good error handling with user-friendly messages
- ✅ UUID ensures uniqueness
- ✅ Clean separation of concerns (frontend/backend)
- ✅ Proper TypeScript typing

### Potential Issues Found 🔍
1. **No custom URL option** - Only UUIDs are used (e.g., `/link/550e8400-e29b-41d4-a716-446655440000`)
2. **No amount format validation** - Could accept invalid decimal formats
3. **No rate limiting** - Could be abused for spam

## Custom URL Feature Implementation

### What Was Added

#### 1. Database Schema Update
- Added `slug` column to `links` table (optional, unique)
- Created index for faster slug lookups
- Migration file: `src/lib/db_migration_add_slug.sql`

#### 2. API Updates

**POST `/api/links`** (`src/app/api/links/route.ts`):
- Accepts optional `customSlug` parameter
- Validates slug format: 3-50 chars, alphanumeric + hyphens/underscores only
- Checks for slug uniqueness before creating link
- Returns both `id` (UUID) and `slug` (if provided)

**GET `/api/links/[id]`** (`src/app/api/links/[id]/route.ts`):
- Intelligently detects if `id` is UUID or slug
- Looks up by slug first (if not UUID format)
- Falls back to UUID lookup if slug not found
- Returns link data with both `id` and `slug` fields

**POST `/api/links/[id]/pay`** (`src/app/api/links/[id]/pay/route.ts`):
- Updated to handle both UUID and slug identifiers
- Uses appropriate field for database update

#### 3. Frontend Updates

**Create Link Form** (`src/app/create-link/page.tsx`):
- Added custom URL input field with visual prefix (`paylink.app/link/`)
- Real-time validation with helpful error messages
- Optional field - users can leave empty for random UUID
- Form validation includes slug format check

### How It Works

1. **Creating a Link with Custom URL**:
   ```
   User enters: "my-payment-link"
   Result: paylink.app/link/my-payment-link
   ```

2. **Creating a Link without Custom URL**:
   ```
   User leaves field empty
   Result: paylink.app/link/550e8400-e29b-41d4-a716-446655440000
   ```

3. **Accessing Links**:
   - Both custom slugs and UUIDs work
   - System automatically detects which type is used
   - Backward compatible with existing UUID links

### Validation Rules

**Custom Slug Requirements**:
- Length: 3-50 characters
- Characters: Letters (a-z, A-Z), numbers (0-9), hyphens (-), underscores (_)
- Must be unique across all links
- Case-insensitive (stored as lowercase)

**Examples**:
- ✅ Valid: `my-payment-link`, `invoice_123`, `payme2024`
- ❌ Invalid: `ab` (too short), `my link` (spaces), `my@link` (special chars)

## Setup Instructions

### Step 1: Run Database Migration

1. Go to your Supabase project
2. Open SQL Editor
3. Run the migration script:
   ```sql
   -- Copy contents from src/lib/db_migration_add_slug.sql
   ALTER TABLE links ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
   CREATE INDEX IF NOT EXISTS idx_link_slug ON links(slug);
   ```

### Step 2: Test the Feature

1. Go to `/create-link`
2. Fill in recipient, amount, and message
3. Optionally enter a custom URL (e.g., `my-test-link`)
4. Create the link
5. You'll be redirected to `/link/my-test-link` (or UUID if no custom URL)

## Benefits

1. **User-Friendly URLs**: Instead of random UUIDs, users can create memorable links
2. **Better Sharing**: Custom URLs are easier to remember and share
3. **Branding**: Users can create branded payment links
4. **Backward Compatible**: Existing UUID links continue to work
5. **Flexible**: Users can still use random UUIDs if they prefer

## Technical Notes

- Slugs are stored in lowercase for consistency
- UUID generation still happens for all links (used as primary key)
- Slug is optional - links can exist with only UUID
- Both identifiers can be used to access the same link
- Database has unique constraint on slug to prevent duplicates

