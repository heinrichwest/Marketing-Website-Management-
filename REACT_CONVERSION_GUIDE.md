# Next.js to React Conversion Guide

## Overview
This guide outlines the complete conversion of the Marketing Website Management System from Next.js to a standard React application using Vite.

## What Has Been Done

### 1. Core Configuration Files Created
- ✅ `vite.config.ts` - Vite configuration with path aliases
- ✅ `index.html` - Entry HTML file for Vite
- ✅ `src/main.tsx` - React application entry point
- ✅ `src/App.tsx` - Main App component with React Router
- ✅ `package.json` - Updated with React/Vite dependencies

### 2. Required Changes for Full Conversion

Due to the extensive nature of this project (50+ files), here's what needs to be done:

## Step-by-Step Conversion Process

### Step 1: Install New Dependencies
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install new dependencies
npm install
```

### Step 2: File Structure Reorganization

**Current Structure (Next.js):**
```
app/
├── (auth)/
├── admin/
├── developer/
├── coordinator/
├── client/
└── globals.css
```

**New Structure (React):**
```
src/
├── pages/           # All page components
├── components/      # Reusable components (already exists)
├── context/         # Context providers (already exists)
├── lib/             # Utilities (already exists)
├── types/           # TypeScript types (already exists)
├── App.tsx          # Main app with routes
└── main.tsx         # Entry point
```

### Step 3: Convert All Page Files

#### Required Replacements in ALL Page Files:

**1. Remove "use client" directive**
```tsx
// REMOVE THIS LINE from all files
"use client"
```

**2. Replace Next.js imports**
```tsx
// OLD (Next.js)
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

// NEW (React Router)
import { useNavigate, Link } from "react-router-dom"
// For images, use regular <img> tags
```

**3. Update router usage**
```tsx
// OLD
const router = useRouter()
router.push("/dashboard")

// NEW
const navigate = useNavigate()
navigate("/dashboard")
```

**4. Update Link components**
```tsx
// OLD
<Link href="/dashboard">Dashboard</Link>

// NEW
<Link to="/dashboard">Dashboard</Link>
```

### Step 4: Convert Each Page File

#### Files to Convert:

1. **src/pages/HomePage.tsx** (from app/page.tsx)
2. **src/pages/LoginPage.tsx** (from app/login/page.tsx)
3. **src/pages/RegisterPage.tsx** (from app/register/page.tsx)
4. **src/pages/DashboardPage.tsx** (from app/dashboard/page.tsx)
5. **src/pages/admin/DashboardPage.tsx** (from app/admin/dashboard/page.tsx)
6. **src/pages/admin/NewProjectPage.tsx** (from app/admin/projects/new/page.tsx)
7. **src/pages/developer/DashboardPage.tsx** (from app/developer/dashboard/page.tsx)
8. **src/pages/developer/TicketsPage.tsx** (from app/developer/tickets/page.tsx)
9. **src/pages/coordinator/DashboardPage.tsx** (from app/coordinator/dashboard/page.tsx)
10. **src/pages/client/DashboardPage.tsx** (from app/client/dashboard/page.tsx)
11. **src/pages/SwitchRolePage.tsx** (from app/switch-role/page.tsx)

### Step 5: Update Context Files

#### auth-context.tsx
```tsx
// Change from:
import { useRouter } from "next/navigation"

// To:
import { useNavigate } from "react-router-dom"

// And update usage:
const navigate = useNavigate()
navigate("/login")
```

### Step 6: Update Component Files

All components using Next.js Link or router need updates:

- `components/navbar.tsx`
- `components/footer.tsx`
- `components/role-switcher.tsx`
- Any other components using Next.js features

### Step 7: Update Theme Provider

The `next-themes` package needs to be replaced with a custom React solution or `usehooks-ts`:

```tsx
// Create custom theme provider or install:
npm install usehooks-ts

// Update components/theme-provider.tsx accordingly
```

### Step 8: Move and Update CSS

```bash
# Move globals.css
mv app/globals.css src/
# Update imports in main.tsx
```

## Automated Conversion Script

Here's a Node.js script to help automate some conversions:

```javascript
// convert-to-react.js
const fs = require('fs');
const path = require('path');

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove "use client"
  content = content.replace(/^"use client"\s*\n/m, '');

  // Replace Next.js imports
  content = content.replace(
    /import \{ useRouter \} from "next\/navigation"/g,
    'import { useNavigate } from "react-router-dom"'
  );

  content = content.replace(
    /import Link from "next\/link"/g,
    'import { Link } from "react-router-dom"'
  );

  // Replace router usage
  content = content.replace(/const router = useRouter\(\)/g, 'const navigate = useNavigate()');
  content = content.replace(/router\.push\(/g, 'navigate(');

  // Replace Link href with to
  content = content.replace(/href="/g, 'to="');
  content = content.replace(/href=/g, 'to=');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Converted: ${filePath}`);
}

// Run on all .tsx files
// convertFile('path/to/file.tsx');
```

## Manual Steps Required

### 1. Create Page Wrapper Components

Each page from `app/*/page.tsx` needs to be moved to `src/pages/` and wrapped properly:

```tsx
// Example: src/pages/LoginPage.tsx
import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
// ... rest of imports

export default function LoginPage() {
  const navigate = useNavigate()

  // Rest of component code (converted from app/login/page.tsx)

  return (
    <>
      <Navbar />
      {/* Page content */}
      <Footer />
    </>
  )
}
```

### 2. Update AuthContext

The AuthContext needs to use React Router's `useNavigate`:

```tsx
// context/auth-context.tsx
import { useNavigate } from 'react-router-dom'

// In the AuthProvider component:
const AuthContextComponent = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  // ... rest of context logic
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContextComponent>{children}</AuthContextComponent>
}
```

### 3. Update Image Components

Replace Next.js Image components:

```tsx
// OLD
<Image src="/logo.png" alt="Logo" width={200} height={50} />

// NEW
<img src="/logo.png" alt="Logo" width="200" height="50" />
```

### 4. Environment Variables

```bash
# Create .env file
cp .env.example .env

# Update variable names from NEXT_PUBLIC_ to VITE_
VITE_API_URL=...
```

Access in code:
```tsx
// OLD
process.env.NEXT_PUBLIC_API_URL

// NEW
import.meta.env.VITE_API_URL
```

## Files That Need Conversion

### Priority 1: Core Pages (Critical)
- [ ] app/page.tsx → src/pages/HomePage.tsx
- [ ] app/login/page.tsx → src/pages/LoginPage.tsx
- [ ] app/register/page.tsx → src/pages/RegisterPage.tsx
- [ ] app/dashboard/page.tsx → src/pages/DashboardPage.tsx

### Priority 2: Role-Specific Dashboards
- [ ] app/admin/dashboard/page.tsx → src/pages/admin/DashboardPage.tsx
- [ ] app/developer/dashboard/page.tsx → src/pages/developer/DashboardPage.tsx
- [ ] app/coordinator/dashboard/page.tsx → src/pages/coordinator/DashboardPage.tsx
- [ ] app/client/dashboard/page.tsx → src/pages/client/DashboardPage.tsx

### Priority 3: Additional Pages
- [ ] app/admin/projects/new/page.tsx → src/pages/admin/NewProjectPage.tsx
- [ ] app/developer/tickets/page.tsx → src/pages/developer/TicketsPage.tsx
- [ ] app/switch-role/page.tsx → src/pages/SwitchRolePage.tsx

### Priority 4: Components
- [ ] components/navbar.tsx - Update Link and router
- [ ] components/footer.tsx - Update Link
- [ ] components/role-switcher.tsx - Update Link and router
- [ ] components/theme-provider.tsx - Replace next-themes

### Priority 5: Context
- [ ] context/auth-context.tsx - Update router

## Testing Checklist

After conversion, test:

- [ ] Homepage loads correctly
- [ ] Navigation works (all routes)
- [ ] Login functionality
- [ ] Registration functionality
- [ ] Protected routes redirect to login
- [ ] Role-based routing works
- [ ] Role switching works
- [ ] All forms submit correctly
- [ ] Theme switching works
- [ ] Mobile responsiveness
- [ ] Browser console has no errors

## Build and Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Deploy (example for Netlify)
# Build command: npm run build
# Publish directory: dist
```

## Key Differences: Next.js vs React

| Feature | Next.js | React (Vite) |
|---------|---------|--------------|
| Routing | File-based (app/) | React Router (manual) |
| Links | `<Link href>` | `<Link to>` |
| Router Hook | `useRouter()` | `useNavigate()` |
| Images | `<Image>` component | Standard `<img>` |
| Environment | `NEXT_PUBLIC_` | `VITE_` |
| Client Components | "use client" | Default behavior |
| API Routes | app/api/ | Separate backend needed |

## Potential Issues and Solutions

### Issue 1: "use client" errors
**Solution**: Remove all "use client" directives

### Issue 2: Module not found errors
**Solution**: Check path aliases in vite.config.ts

### Issue 3: CSS not loading
**Solution**: Ensure globals.css is imported in main.tsx

### Issue 4: Router not working
**Solution**: Ensure BrowserRouter wraps the App component

### Issue 5: Environment variables undefined
**Solution**: Rename NEXT_PUBLIC_ to VITE_ and restart dev server

## Next Steps

1. Run the automated conversion script on all page files
2. Manually review and test each converted page
3. Update component imports
4. Test all functionality
5. Deploy to hosting platform

## Notes

- This is a **one-way conversion** - once complete, you cannot easily go back to Next.js
- Server-Side Rendering (SSR) features will be lost
- API routes must be moved to a separate backend
- Static optimization from Next.js is replaced by Vite's build optimization
- Consider using React Query for data fetching that was previously handled by Next.js

## Support

For issues during conversion:
1. Check Vite documentation: https://vitejs.dev/
2. Check React Router documentation: https://reactrouter.com/
3. Review this guide thoroughly
4. Test incrementally after each major change

---

**Conversion Status**: Configuration Complete - Manual Page Conversion Required
**Estimated Time**: 4-6 hours for full manual conversion
**Complexity**: High - Requires careful attention to routing and state management
