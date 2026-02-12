# Google Reviews Integration Setup Guide

This guide will help you integrate real Google Reviews from your Google Business Profile into your Sayma Manpower website.

## Prerequisites

1. A Google Business Profile (formerly Google My Business)
2. A Google Cloud account
3. Reviews on your Google Business Profile

---

## Step 1: Get Your Google Place ID

### Method 1: Using Google Place ID Finder
1. Go to: https://developers.google.com/maps/documentation/places/web-service/place-id
2. Search for "Sayma Manpower" or your business address in Oman
3. Copy the Place ID (starts with "ChIJ...")

### Method 2: Using Google Maps
1. Open Google Maps
2. Search for your business
3. Copy the URL
4. The Place ID is in the URL after "!1s" or "?cid="

**Example Place ID:** `ChIJN1t_tDeuEmsRUsoyG83frY4`

---

## Step 2: Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click "Create Project"
3. Name: "Sayma Manpower Website"
4. Click "Create"

---

## Step 3: Enable Places API

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Places API"
3. Click on "Places API"
4. Click "Enable"

---

## Step 4: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key (starts with "AIza...")
4. Click "Restrict Key" (recommended)

### Restrict Your API Key (Recommended):
1. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain: `https://yourdomain.com/*`
   - For development: `http://localhost:3000/*`

2. Under "API restrictions":
   - Select "Restrict key"
   - Select "Places API"

3. Click "Save"

---

## Step 5: Add Credentials to Your Website

1. Open your project folder
2. Create or edit `.env.local` file in the root directory
3. Add these lines:

```env
# Google Places API Configuration
GOOGLE_PLACES_API_KEY=your_api_key_here
GOOGLE_PLACE_ID=your_place_id_here

# Optional: For client-side access (only Place ID, never API key!)
NEXT_PUBLIC_GOOGLE_PLACE_ID=your_place_id_here
```

**Example:**
```env
GOOGLE_PLACES_API_KEY=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI
GOOGLE_PLACE_ID=ChIJN1t_tDeuEmsRUsoyG83frY4
NEXT_PUBLIC_GOOGLE_PLACE_ID=ChIJN1t_tDeuEmsRUsoyG83frY4
```

4. Save the file
5. Restart your development server: `npm run dev`

---

## Step 6: Verify Integration

1. Go to your website: `http://localhost:3000/reviews`
2. You should see:
   - Your Google Business rating
   - Recent Google reviews
   - "Write Google Review" button
   - Refresh button to reload reviews

---

## Important Notes

### Security
- ✅ **NEVER** commit `.env.local` to git
- ✅ API key is kept server-side only
- ✅ Only Place ID is exposed to client
- ✅ Restrict API key by domain

### API Limits
- Free tier: Up to 5 reviews per request
- Rate limit: 1 request per second
- For more reviews or higher limits, upgrade to paid plan

### Deployment (Vercel/Production)
1. Go to your hosting dashboard (e.g., Vercel)
2. Navigate to: Settings > Environment Variables
3. Add the same variables:
   - `GOOGLE_PLACES_API_KEY`
   - `GOOGLE_PLACE_ID`
   - `NEXT_PUBLIC_GOOGLE_PLACE_ID`
4. Redeploy your site

---

## Troubleshooting

### "Google API not configured" message
- Check that `.env.local` file exists in root directory
- Verify variable names are exactly as shown
- Restart your dev server after adding variables

### No reviews showing
- Verify your Place ID is correct
- Check that your business has reviews on Google
- Ensure Places API is enabled in Google Cloud
- Check API key restrictions

### API errors
- Verify API key is valid
- Check that billing is enabled in Google Cloud (required even for free tier)
- Ensure API key has Places API access
- Check domain restrictions if deployed

---

## Getting More Reviews

Encourage customers to leave Google reviews:

1. Share your Google review link:
   ```
   https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID
   ```

2. Use the "Write Google Review" button on your reviews page

3. Add QR codes in your office linking to the review page

---

## Cost Information

**Google Places API Pricing:**
- First $200/month: FREE (covers ~28,500 requests)
- After free tier: $0.017 per request
- Most small businesses stay within free tier

**Billing Setup Required:**
- Even for free tier, you must enable billing
- You won't be charged until you exceed $200/month
- You can set budget alerts

---

## Need Help?

- Google Cloud Support: https://cloud.google.com/support
- Places API Documentation: https://developers.google.com/maps/documentation/places/web-service
- Softgen Support: support@softgen.ai

---

## Alternative: Manual Reviews

If you prefer not to use the API:

1. Periodically copy reviews from Google
2. Update them in `src/lib/data.ts` in the `websiteReviews` array
3. The website will display these static reviews

This is free but requires manual updates.