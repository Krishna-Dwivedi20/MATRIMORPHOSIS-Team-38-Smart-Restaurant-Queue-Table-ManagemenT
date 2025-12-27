# Database Setup Instructions

The "Failed to fetch tables" error occurs because the database needs to be initialized.

## Quick Setup

1. **Install MySQL** (if not already installed)
   - Download from https://dev.mysql.com/downloads/mysql/

2. **Create the database and tables**
   - Open MySQL command line or MySQL Workbench
   - Run the SQL script: `database.sql`
   
   **Option A - Using MySQL CLI:**
   ```bash
   mysql -u root -p < database.sql
   ```
   
   **Option B - Using MySQL Workbench:**
   - Open the `database.sql` file
   - Execute the script

3. **Update .env file** (if needed)
   - File: `BACKEND/.env`
   - Update credentials to match your MySQL setup:
     - `DB_HOST=localhost`
     - `DB_USER=root`
     - `DB_PASS=your_password` (if you have a password)
     - `DB_NAME=restaurant_db`

4. **Restart the BACKEND server**
   - The application should automatically reload
   - Check if tables are now loading

## Database Schema

- **users**: Stores user information (customers, managers, admins)
- **tables_reservations**: Stores table information and status
- **queue**: Stores customer queue information
