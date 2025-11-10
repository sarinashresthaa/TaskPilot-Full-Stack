# Task Management System API

A comprehensive **Role-Based Task Management System** built for college project requirements. This system supports three user roles (Admin, Project Manager, Team Member) with complete CRUD operations, authentication, and project collaboration features.

## 🌟 Features

### 👑 Admin Capabilities
- ✅ Create, update, and delete user accounts
- ✅ Assign roles to users (admin, project_manager, team_member)  
- ✅ View all projects and users in the system
- ✅ Access system statistics and activity logs
- ✅ Complete audit trail with activity logging

### 🏗️ Project Manager Capabilities  
- ✅ Create, edit, and delete projects
- ✅ Assign team members to projects
- ✅ Create and assign tasks to team members
- ✅ Manage task priorities, deadlines, and status
- ✅ View project dashboards and progress reports
- ✅ Comment on tasks and receive notifications

### 👥 Team Member Capabilities
- ✅ View assigned projects and tasks
- ✅ Update task status (todo/in-progress/done/cancelled)
- ✅ Comment on tasks and collaborate with team
- ✅ View project dashboards and progress reports
- ✅ Receive system notifications

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Test the API**
   ```bash
   curl http://localhost:8800/health
   ```

5. **Create Admin User**
   ```bash
   curl -X POST http://localhost:8800/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@company.com", 
       "password": "admin123456",
       "name": "System Administrator",
       "role": "admin"
     }'
   ```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [**API_DOCUMENTATION.md**](./API_DOCUMENTATION.md) | Complete API reference with examples |
| [**API_QUICK_REFERENCE.md**](./API_QUICK_REFERENCE.md) | Quick reference for developers |
| [**SETUP_GUIDE.md**](./SETUP_GUIDE.md) | Detailed setup and deployment guide |
| [**Task_Management_API.postman_collection.json**](./Task_Management_API.postman_collection.json) | Postman collection for testing |

## 🎯 API Endpoints Summary

### 🔐 Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login  
- `GET /me` - Get current user
- `PUT /profile` - Update profile
- `POST /logout` - Logout

### 👑 Admin (`/api/admin`) - Admin Only
- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PATCH /users/:id/role` - Assign role
- `GET /activity-logs` - Get activity logs
- `GET /system-stats` - Get system statistics

### 🏗️ Projects (`/api/projects`) 
- `POST /` - Create project (PM/Admin)
- `GET /` - Get user projects
- `GET /:id` - Get project details  
- `POST /:id/members` - Add team member (PM/Admin)

### 📋 Tasks (`/api/tasks`)
- `POST /` - Create task (PM/Admin)
- `GET /project/:projectId` - Get project tasks
- `GET /my-tasks` - Get user's assigned tasks
- `PATCH /:taskId/status` - Update task status
- `POST /:taskId/comments` - Add task comment

### 🔔 Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `PATCH /:id/read` - Mark notification as read

## 🏗️ Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests
- **Logging**: Morgan for HTTP request logging
- **Environment**: dotenv for configuration

## 📊 Database Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  role: String (admin|project_manager|team_member),
  phone: String,
  department: String,
  isActive: Boolean,
  lastLogin: Date,
  createdBy: ObjectId (ref: User)
}
```

### Project Model
```javascript
{
  title: String (required),
  description: String (required),
  category: String (research|development|infrastructure|marketing|other),
  status: String (active|completed|on-hold|cancelled),
  manager: ObjectId (ref: User),
  teamMembers: [ObjectId] (ref: User),
  startDate: Date,
  endDate: Date (required),
  progress: Number (0-100),
  createdBy: ObjectId (ref: User)
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String (required),
  project: ObjectId (ref: Project),
  assignedTo: [ObjectId] (ref: User),
  assignedBy: ObjectId (ref: User),
  status: String (todo|in-progress|done|cancelled),
  priority: String (low|medium|high|urgent),
  category: String (development|testing|documentation|design|deployment|other),
  subCategory: String (frontend|backend|database|api|ui/ux|unit-test|integration-test|other),
  deadline: Date (required),
  estimatedEffort: Number,
  actualEffort: Number,
  dependencies: [ObjectId] (ref: Task),
  comments: [{ user: ObjectId, text: String, createdAt: Date }]
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions per user role  
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Request validation middleware
- **CORS Protection**: Configurable cross-origin resource sharing
- **Error Handling**: Centralized error handling with proper HTTP codes
- **Activity Logging**: Complete audit trail of user actions

## 🧪 Testing

### Automated Tests
```bash
# Run API tests
node test-api.js

# Run role-based access control tests  
node test-role-based-api.js
```

### Manual Testing
1. Import Postman collection: `Task_Management_API.postman_collection.json`
2. Set environment variables:
   - `baseUrl`: `http://localhost:8800`
   - `authToken`: (auto-set after login)
3. Run collection tests

### Test User Accounts
```javascript
// Admin User (auto-created first)
{
  "username": "admin",
  "password": "admin123456",
  "role": "admin"
}

// Test Project Manager (create via admin)
{
  "username": "pm_test", 
  "password": "password123",
  "role": "project_manager"
}

// Test Team Member (create via admin)
{
  "username": "team_test",
  "password": "password123", 
  "role": "team_member"
}
```

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production with PM2
```bash
pm2 start server.js --name "task-management-api"
pm2 startup
pm2 save
```

### Environment Variables
```env
NODE_ENV=production
PORT=8800
MONGODB_URI=mongodb://localhost:27017/task_management_db
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:3000
```

## 📈 System Statistics

The API provides comprehensive system statistics for admins:
- **User Statistics**: Total users, active users, role distribution
- **Project Statistics**: Total projects, active vs completed projects
- **Task Statistics**: Total tasks, completion rate, overdue tasks  
- **Recent Activity**: Latest user actions and system events

## 🎓 College Project Features

### Academic Requirements Covered
- ✅ **User Authentication**: Secure login system
- ✅ **Role-Based Access**: 3 distinct user roles with different permissions
- ✅ **CRUD Operations**: Complete Create, Read, Update, Delete functionality  
- ✅ **Database Design**: Well-structured relational data models
- ✅ **API Design**: RESTful API with proper HTTP methods
- ✅ **Security**: Authentication, authorization, and input validation
- ✅ **Documentation**: Comprehensive API documentation
- ✅ **Testing**: Automated and manual testing procedures

### Demo Workflow
1. **Admin Demo**: Create users, assign roles, view system statistics
2. **Project Manager Demo**: Create projects, assign tasks, manage team members
3. **Team Member Demo**: View assigned tasks, update status, add comments
4. **Collaboration Demo**: Show real-time task updates and notifications

### Extension Possibilities
- Email notifications
- Real-time updates with Socket.IO
- File attachments for tasks
- Time tracking and reporting
- Gantt chart integration
- Mobile app integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)  
5. Create Pull Request

## 📝 License

This project is created for educational purposes as part of a college project.

## 📞 Support

For questions or issues:
1. Check the [Setup Guide](./SETUP_GUIDE.md)
2. Review [API Documentation](./API_DOCUMENTATION.md)
3. Test with provided Postman collection
4. Check troubleshooting section in setup guide

---

## 🎉 Project Status

✅ **Complete** - Ready for college project submission and demonstration

**Total Features**: 25+ API endpoints, 3 user roles, complete CRUD operations  
**Documentation**: 100% complete with examples  
**Testing**: Automated test suites included  
**Security**: Production-ready authentication and authorization  

*Perfect for 7th semester college project requirements!* 🎓