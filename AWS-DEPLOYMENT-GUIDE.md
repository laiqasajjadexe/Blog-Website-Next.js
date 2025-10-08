# AWS Deployment Guide for Next.js Blog

## Overview
Your blog is now configured to work seamlessly on any domain. All hardcoded `localhost:3000` URLs have been removed from the codebase.

---

## How URL Configuration Works

### Server-Side Components (Featured, CardList, CategoryList, SinglePage)
These components use a **fallback chain** for fetching data:

```javascript
const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
```

**Priority:**
1. `NEXT_PUBLIC_URL` (if set)
2. `NEXTAUTH_URL` (fallback)
3. `http://localhost:3000` (development fallback)

### Client-Side Components (Comments, Write Page)
These use **relative URLs** like `/api/comments` which automatically work on any domain.

---

## For AWS Deployment: `http://next-blog-site.duckdns.org:3000`

### Step 1: Update Environment Variables on AWS

Add/update these in your AWS environment:

```bash
# Required for NextAuth OAuth redirects
NEXTAUTH_URL=http://next-blog-site.duckdns.org:3000

# Optional: Set this for clarity (or leave it out, NEXTAUTH_URL will be used as fallback)
NEXT_PUBLIC_URL=http://next-blog-site.duckdns.org:3000

# Keep all your existing variables
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
NEXTAUTH_SECRET=your_nextauth_secret
DATABASE_URL=your_mongodb_connection_string
```

### Step 2: Update Google OAuth Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   http://next-blog-site.duckdns.org:3000/api/auth/callback/google
   ```

### Step 3: Update GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Select your OAuth App
3. Update **Authorization callback URL**:
   ```
   http://next-blog-site.duckdns.org:3000/api/auth/callback/github
   ```

---

## Testing Checklist

After deploying to AWS, verify:

- [ ] Homepage loads with posts
- [ ] Can navigate to single post pages
- [ ] Category filtering works
- [ ] Comments load on post pages
- [ ] Can sign in with Google
- [ ] Can sign in with GitHub
- [ ] Can write and publish new posts
- [ ] Newly published posts are accessible

---

## Common Issues & Solutions

### Issue: "Post Not Found" after publishing
**Cause:** Server is fetching from the wrong URL  
**Solution:** Ensure `NEXTAUTH_URL` or `NEXT_PUBLIC_URL` is set correctly on AWS

### Issue: OAuth login fails
**Cause:** Redirect URIs not updated in Google/GitHub  
**Solution:** Add your AWS domain to OAuth provider settings

### Issue: 500 errors in browser console
**Cause:** MongoDB connection issues or stale cache  
**Solution:** 
- Verify `DATABASE_URL` is correct
- Hard refresh browser (Ctrl+Shift+R)
- Check MongoDB Atlas network access allows your AWS IP

---

## Notes

- **No code changes needed** when switching domains
- All API routes use relative paths
- Server components automatically adapt to environment variables
- MongoDB connection string stays the same (works from anywhere)

---

## Local Development

For local development, your current `.env` works perfectly:

```bash
NEXTAUTH_URL=http://localhost:3000
# NEXT_PUBLIC_URL can be empty or unset
```

The app automatically falls back to `localhost:3000` when these are not set.

---

## Summary

✅ **Removed all hardcoded URLs** from source code  
✅ **Smart fallback chain** uses environment variables  
✅ **Works on any domain** without code changes  
✅ **Just update .env** and OAuth providers for deployment  

Your blog is now deployment-ready! 🚀
