# Supabase Setup Guide for Mr Flow Chart

This guide will help you set up Supabase authentication and database for the flowchart application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed
3. This project cloned locally

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details:
   - Name: `mr-flow-chart` (or any name you prefer)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the "Settings" icon (gear icon) in the left sidebar
2. Click on "API" under Project Settings
3. You'll see two important values:
   - **Project URL** (something like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
4. Copy these values - you'll need them in the next step

## Step 3: Configure Environment Variables

1. In your project root directory, create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase project dashboard, click on the "SQL Editor" icon in the left sidebar
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL
6. You should see a success message

This will create:
- The `flowcharts` table
- Row Level Security (RLS) policies
- Initial flowchart data

## Step 5: Create an Admin User

1. In your Supabase project dashboard, click on "Authentication" in the left sidebar
2. Click on "Users"
3. Click "Add user" → "Create new user"
4. Enter:
   - Email: Your admin email address
   - Password: Choose a secure password
   - Click "Create user"

5. **Important: Set admin privileges**
   - After creating the user, click on the user in the list
   - Scroll down to "User metadata"
   - Click "Edit" 
   - Add this JSON to the user metadata:
     ```json
     {
       "is_admin": true
     }
     ```
   - Click "Save"

## Step 6: Install Dependencies and Run the App

1. Install the dependencies (if you haven't already):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown (usually http://localhost:5173)

## Step 7: Test the Application

### Testing Login and Admin Features

1. **Login as Admin:**
   - You should see the login screen
   - Enter the admin email and password you created in Step 5
   - Click "Sign In"
   - You should now see the flowchart editor with edit capabilities

2. **Test Admin Features:**
   - You should see "Flow Chart Editor" at the top
   - The toolbar should show "Add Node", "Delete Node", and "Delete Edge" buttons
   - You should be able to:
     - Add new nodes
     - Delete nodes
     - Create connections between nodes
     - Double-click nodes to edit them
     - Drag nodes to reposition them
   - Changes should auto-save (you'll see "✓ Saved" status)

3. **Test View-Only Mode:**
   - Click "Logout" button
   - The flowchart should still be visible but in read-only mode
   - You should NOT see the editing toolbar
   - You should see "👁️ View Only" badge
   - Nodes should not be draggable or editable

### Testing Persistence

1. Login as admin
2. Make some changes to the flowchart (add/edit/delete nodes)
3. Wait for the "✓ Saved" indicator
4. Refresh the page
5. Login again
6. Your changes should persist

## Troubleshooting

### "Missing Supabase environment variables" Error

- Make sure your `.env` file exists in the project root
- Verify that you've set both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after creating/modifying the `.env` file

### Can't Login / "Invalid credentials" Error

- Verify the email and password are correct
- Check that the user was created successfully in Supabase Dashboard → Authentication → Users
- Ensure email confirmation is disabled or the user's email is confirmed

### Can Edit Without Admin Privileges

- Check that the user has `"is_admin": true` in their user metadata
- Try logging out and back in
- Check the browser console for any authentication errors

### Changes Not Saving

- Check the browser console for errors
- Verify the SQL schema was executed correctly
- Check that Row Level Security (RLS) policies are enabled on the `flowcharts` table
- Ensure the admin user has the correct metadata set

### Database Errors

- Go to Supabase Dashboard → Database
- Check the "Tables" section to verify the `flowcharts` table exists
- Go to "Policies" to verify RLS policies are active

## Security Notes

1. **Never commit your `.env` file** - It's already in `.gitignore`
2. The anon key is safe to expose in client-side code - it's designed for that
3. Admin privileges are controlled by user metadata in Supabase
4. Row Level Security (RLS) ensures only admins can modify data
5. All users can view the flowchart, but only admins can edit

## Additional Supabase Features You Can Add

- Email verification on signup
- Password reset functionality
- User roles and permissions management
- Real-time collaboration (multiple admins editing simultaneously)
- Audit logs for tracking changes
- Multiple flowcharts with different access controls

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the Supabase logs: Dashboard → Logs → API
3. Review this setup guide again
4. Check the Supabase documentation: https://supabase.com/docs