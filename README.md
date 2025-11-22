# Book Borrowing System

A full-stack web application for managing book borrowing in a library, built with Django REST Framework and React.

## Features

- User authentication (Members, Librarians, Admins)
- Book management with cover images
- Borrow/return functionality
- User role-based access control
- Responsive web interface
- Book search and filtering

## Prerequisites

- Python 3.8+
- Node.js 16+ and npm 8+ (or yarn)
- SQLite (included with Python)
- Git (for version control)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd book-borrow-system
```

### 2. Backend Setup

1. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install system dependencies (for Pillow)**
   ```bash
   # Windows
   # Install Python and pip, then install build tools from Microsoft Visual C++ Build Tools
   
   # Ubuntu/Debian
   sudo apt-get install python3-dev python3-setuptools
   
   # macOS (using Homebrew)
   brew install python3
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory with:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   ```

5. **Run database migrations**
   ```bash
   cd backend
   python manage.py migrate
   ```

6. **Create a superuser (admin)**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin account.

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://127.0.0.1:8000/`

### 3. Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will be available at `http://localhost:5173`

## Project Structure

```
book-borrow-system/
├── backend/               # Django backend
│   ├── accounts/          # Authentication app
│   ├── api/               # API endpoints
│   ├── book/              # Book management
│   ├── borrow/            # Borrow/return logic
│   ├── members/           # Member profiles
│   ├── librarians/        # Librarian features
│   ├── admins/            # Admin features
│   ├── manage.py          # Django management script
│   └── requirements.txt   # Python dependencies
└── frontend/              # React frontend
    ├── public/            # Static files
    ├── src/               # Source code
    │   ├── components/    # Reusable components
    │   └── pages/         # Page components
    └── package.json       # Node.js dependencies
```

## Troubleshooting

### Pillow Installation Issues
If you encounter issues installing Pillow:
1. Ensure you have Python development headers installed
2. On Windows, install the Microsoft C++ Build Tools
3. Try installing with: `pip install --upgrade pip wheel setuptools` before installing requirements

### Database Issues
If you have database problems:
1. Delete the `db.sqlite3` file and run migrations again
2. Make sure you've run `python manage.py migrate`

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Project Structure

```
book-borrow-system/
├── backend/               # Django backend
│   ├── accounts/          # Authentication app
│   ├── api/               # API endpoints
│   ├── book/              # Book management
│   ├── borrow/            # Borrow/return logic
│   ├── members/           # Member profiles
│   ├── librarians/        # Librarian features
│   └── admins/            # Admin features
└── frontend/              # React frontend
    ├── public/            # Static files
    └── src/               # Source code
        ├── components/    # Reusable components
        └── pages/         # Page components
```

## Available Scripts

- **Backend**
  - `python manage.py runserver` - Start the development server
  - `python manage.py makemigrations` - Create new database migrations
  - `python manage.py migrate` - Apply database migrations

- **Frontend**
  - `npm run dev` - Start the development server
  - `npm run build` - Build for production
  - `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- [Django](https://www.djangoproject.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
