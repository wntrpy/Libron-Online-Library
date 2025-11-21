# Book Borrowing System

A full-stack web application for managing book borrowing in a library, built with Django REST Framework and React.

## Features

- User authentication (Members, Librarians, Admins)
- Book management
- Borrow/return functionality
- User role-based access control
- Responsive web interface

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- SQLite (included with Python)

## Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-borrow-system/backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (admin)**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin account.

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://127.0.0.1:8000/`

## Frontend Setup

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
