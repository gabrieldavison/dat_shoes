# Mr Flow Chart

A React-based interactive flowchart editor with Supabase authentication and persistence.

## Features

### ✨ Core Features
- **Interactive Flowchart Editor** - Create, edit, and connect nodes with ease
- **Rich Text Editing** - Nodes support HTML formatting using Quill editor
- **Node Metadata** - Add dates and country information to nodes
- **Visual Connections** - Animated edges between nodes with drag-and-drop connecting

### 🔐 Authentication & Security
- **Supabase Authentication** - Secure login system
- **Admin-Only Editing** - Only authenticated admins can modify the flowchart
- **View-Only Mode** - Non-admin users can view the flowchart but not edit it
- **Row Level Security** - Database-level security policies

### 💾 Persistence
- **Auto-Save** - Changes are automatically saved to the database
- **Real-Time Sync** - See updates from other admins in real-time
- **Cloud Storage** - All data stored securely in Supabase

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Supabase account (free tier works great!)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd mr_flow_chart
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   
   Follow the detailed instructions in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) to:
   - Create a Supabase project
   - Set up the database schema
   - Create an admin user
   - Configure environment variables

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173`

## Usage

### For Admins

1. **Login** - Use your admin credentials to sign in
2. **Edit Mode** - Once logged in, you'll see the full editor with:
   - ➕ Add Node button
   - 🗑️ Delete Node/Edge buttons
   - Auto-save indicator
3. **Creating Nodes** - Click "Add Node" to create a new node
4. **Editing Nodes** - Double-click any node to edit:
   - Year (historical date)
   - Country (optional)
   - Description (rich text with formatting)
5. **Connecting Nodes** - Drag from a node's handle to another node
6. **Moving Nodes** - Drag nodes to reposition them
7. **Deleting** - Select and click the delete button

### For Viewers

- View the flowchart without authentication
- Navigate and zoom the flowchart
- Read all node information
- Cannot make any changes

## Project Structure

```
mr_flow_chart/
├── src/
│   ├── components/
│   │   ├── Login.tsx          # Login component
│   │   └── Login.css          # Login styles
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client configuration
│   │   ├── AuthContext.tsx    # Authentication context & hooks
│   │   └── flowchartService.ts # Database operations
│   ├── App.tsx                # Main app component
│   ├── FlowChart.tsx          # Flowchart editor component
│   ├── CustomNode.tsx         # Custom node component
│   ├── types.ts               # TypeScript type definitions
│   └── vite-env.d.ts          # Vite environment types
├── supabase-schema.sql        # Database schema
├── .env.example               # Environment variables template
├── SUPABASE_SETUP.md          # Detailed setup guide
└── README.md                  # This file
```

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Flow Diagram:** ReactFlow 11
- **Rich Text Editor:** React Quill 2
- **Backend/Database:** Supabase
- **Authentication:** Supabase Auth
- **Build Tool:** Vite 5
- **Styling:** Custom CSS

## Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Database Schema

The application uses a single `flowcharts` table:

- `id` - TEXT (Primary Key) - Flowchart identifier
- `nodes` - JSONB - Array of node data
- `edges` - JSONB - Array of edge data
- `created_at` - TIMESTAMP - Creation time
- `updated_at` - TIMESTAMP - Last update time

Row Level Security (RLS) policies ensure:
- Everyone can read the flowchart
- Only admins can insert, update, or delete data

## Security Features

1. **Environment Variables** - Sensitive credentials stored in `.env` (not committed)
2. **Row Level Security** - Database-level access control
3. **Admin Metadata** - Admin status stored in user metadata
4. **JWT Validation** - Tokens validated on every request
5. **Client-Side Protection** - UI elements disabled for non-admins

## Customization

### Adding More Admin Users

1. Go to your Supabase Dashboard
2. Navigate to Authentication → Users
3. Create a new user
4. Edit the user and add to User Metadata:
   ```json
   {
     "is_admin": true
   }
   ```

### Changing the Flowchart

Edit the initial data in [`supabase-schema.sql`](./supabase-schema.sql) and re-run the SQL in your Supabase dashboard.

## Troubleshooting

See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for common issues and solutions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!

## Support

For issues and questions:
- Check the [Supabase Setup Guide](./SUPABASE_SETUP.md)
- Review the [Supabase Documentation](https://supabase.com/docs)
- Check the browser console for errors
- Review Supabase logs in your dashboard

## Future Enhancements

Potential features to add:
- [ ] Multiple flowcharts support
- [ ] Collaborative editing with presence indicators
- [ ] Export to PNG/SVG
- [ ] Undo/Redo functionality
- [ ] Node templates
- [ ] Search and filter nodes
- [ ] Version history
- [ ] Comments on nodes
- [ ] Custom color themes