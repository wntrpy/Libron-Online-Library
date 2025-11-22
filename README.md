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

- Python 3.8–3.12 (any recent version should work)
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
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Windows (cmd)
   python -m venv venv
   .\venv\Scripts\activate.bat

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Upgrade pip, wheel, and setuptools** (important for installing packages like Pillow)

   ```bash
   pip install --upgrade pip wheel setuptools
   ```

3. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   # If you have issues with Pillow, try:
   pip install Pillow
   ```

   > **Note:** If you encounter errors installing Pillow on Windows, install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/). On Linux, ensure you have Python development headers (`sudo apt-get install python3-dev`).

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

### Common Installation Issues

#### Pillow Installation Issues

- **Windows:** Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) if you see compilation errors.
- **Linux:** Run `sudo apt-get install python3-dev python3-setuptools` before installing requirements.
- **General:** Always upgrade pip, wheel, and setuptools first: `pip install --upgrade pip wheel setuptools`.
- If Pillow fails, install it separately: `pip install Pillow`.

#### Python Version Issues

- This project works with Python 3.8–3.12. If you have a different version, ensure your virtual environment uses the correct Python executable.
- Check your Python version with `python --version`.

#### Database Issues

- If you have database problems:
  1.  Delete the `db.sqlite3` file and run migrations again
  2.  Make sure you've run `python manage.py migrate`

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

> **Tip:** Never commit your `.env` file or secret keys to version control.

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
