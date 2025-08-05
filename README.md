# 🌾 Agricultural Land Marketplace

A comprehensive platform for buying, selling, and leasing agricultural land, specifically designed for farmers and agricultural professionals.

## ✨ Features

### 🚜 For Farmers
- **Land Listings**: Upload, edit, and manage agricultural land listings
- **Detailed Specifications**: Soil type, crop suitability, water sources, infrastructure details
- **Document Management**: Upload land documents, soil reports, and surveys
- **Inquiry Management**: Receive and respond to buyer inquiries
- **Profile Verification**: Build trust with verified farmer profiles

### 🌱 For Buyers
- **Advanced Search**: Filter by location, size, price, crop suitability, soil type
- **Map Integration**: Visualize land locations with interactive maps
- **Saved Listings**: Save and organize favorite properties
- **Direct Communication**: Secure messaging with land owners
- **Detailed Information**: Access comprehensive land and farmer details

### 👨‍💼 For Admins
- **Approval Workflow**: Review and approve land listings
- **User Management**: Manage farmer verification and user accounts
- **Analytics Dashboard**: Track platform usage and performance
- **Content Moderation**: Ensure quality listings and user safety

### 🔒 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth**: Quick registration with Google accounts
- **Email Verification**: Verified email addresses for all users
- **Password Security**: Strong password requirements and reset functionality

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0**: Modern UI library with latest features
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Router**: Client-side routing
- **Formik & Yup**: Form handling and validation
- **React Icons**: Comprehensive icon library
- **Leaflet/Google Maps**: Interactive map integration
- **Axios**: HTTP client for API communication

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Cloudinary**: Image and document storage
- **Nodemailer**: Email functionality
- **bcryptjs**: Password hashing

### Security & Performance
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request limiting
- **Express Validator**: Input validation
- **Multer**: File upload handling

## 📁 Project Structure

```
agricultural-land-marketplace/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── styles/                  # CSS and styling
│   │   ├── utils/                   # Utility functions
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # Entry point
│   ├── package.json
│   ├── tailwind.config.js           # Tailwind configuration
│   └── postcss.config.js            # PostCSS configuration
├── server/                          # Node.js backend
│   ├── config/                      # Configuration files
│   ├── controllers/                 # Route controllers
│   │   ├── authController.js        # Authentication logic
│   │   ├── landController.js        # Land management logic
│   │   └── userController.js        # User management logic
│   ├── middleware/                  # Custom middleware
│   │   ├── auth.js                  # Authentication middleware
│   │   ├── admin.js                 # Admin authorization
│   │   ├── upload.js                # File upload middleware
│   │   └── validation.js            # Input validation
│   ├── models/                      # Database models
│   │   ├── Property.js              # Agricultural land model
│   │   ├── User.js                  # User model
│   │   └── Inquiry.js               # Inquiry model
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── landRoutes.js            # Land management routes
│   │   └── userRoutes.js            # User management routes
│   ├── utils/                       # Utility functions
│   │   ├── db.js                    # Database connection
│   │   └── email.js                 # Email services
│   ├── server.js                    # Main server file
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agricultural-land-marketplace
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Variables**

   **Server (.env)**
   ```bash
   # Copy example and configure
   cd server
   cp .env.example .env
   ```
   
   Configure the following variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Strong secret for JWT tokens
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `CLOUDINARY_*`: Cloudinary credentials for image storage
   - `EMAIL_*`: Email service configuration

   **Client (.env)**
   ```bash
   # Copy example and configure
   cd client
   cp .env.example .env
   ```
   
   Configure the following variables:
   - `REACT_APP_API_URL`: Backend API URL
   - `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key

### 🏃‍♂️ Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start the frontend development server**
   ```bash
   cd client
   npm start
   # Client runs on http://localhost:3000
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs

## 📱 Design Principles

### Farmer-Friendly UI
- **Large Touch Targets**: Minimum 44px for mobile accessibility
- **Clear Typography**: High contrast, readable fonts
- **Simple Navigation**: Intuitive menu structure
- **Mobile-First**: Optimized for smartphone usage
- **Low-Bandwidth**: Optimized images and efficient loading

### Agricultural Focus
- **Crop-Specific Filters**: Search by suitable crops
- **Soil Information**: Detailed soil type and quality data
- **Water Resources**: Comprehensive water source details
- **Infrastructure**: Electricity, road access, storage facilities
- **Legal Documentation**: Title verification and survey numbers

## 🔐 Security Features

- **Password Hashing**: bcrypt with configurable rounds
- **JWT Tokens**: Secure authentication with refresh tokens
- **Input Validation**: Comprehensive server-side validation
- **Rate Limiting**: Protection against abuse and attacks
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: HTTP security headers
- **File Upload Security**: Type and size restrictions

## 📊 API Documentation

The API follows RESTful conventions with comprehensive error handling and validation.

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/refresh` - Refresh tokens
- `POST /api/auth/forgot-password` - Password reset request

### Land Management Endpoints
- `GET /api/lands` - List all approved lands
- `GET /api/lands/search` - Advanced search with filters
- `POST /api/lands` - Create new land listing
- `GET /api/lands/:id` - Get land details
- `PUT /api/lands/my/:id` - Update own land listing

### Admin Endpoints
- `GET /api/lands/admin/pending` - Get pending approvals
- `POST /api/lands/admin/:id/approve` - Approve land listing
- `POST /api/lands/admin/:id/reject` - Reject land listing

Full API documentation available at `/api/docs` when server is running.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Designed specifically for the agricultural community
- Built with modern web technologies for scalability
- Optimized for rural internet conditions
- Focused on farmer accessibility and ease of use

---

**Built with ❤️ for farmers and agricultural professionals**