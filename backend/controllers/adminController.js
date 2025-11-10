 
// Administrative controller for user management and system monitoring
// Provides core functionality for the task management system
const User = require('../models/User');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');


exports.getAllUsers = async (req, res) => {
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';
    
    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .populate('createdBy', 'username name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'username name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { username, email, password, name, role, phone, department, assignedProjects } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    const user = new User({
      username,
      email,
      password,
      name,
      role: role || 'team_member',
      phone,
      department,
      createdBy: req.user._id
    });

    await user.save();

    // Auto-assign ProjectMember associations based on role
    let projectMemberships = [];

    if (role === 'project_manager' && assignedProjects && assignedProjects.length > 0) {
      // Assign as manager to specified projects
      for (const projectId of assignedProjects) {
        const project = await Project.findById(projectId);
        if (project) {
          // Update project manager
          project.manager = user._id;
          await project.save();

          // Create ProjectMember entry as manager
          const projectMember = new ProjectMember({
            project: projectId,
            user: user._id,
            role: 'manager'
          });
          await projectMember.save();
          projectMemberships.push(projectMember);
        }
      }
    } else if (role === 'team_member' && assignedProjects && assignedProjects.length > 0) {
      // Assign as member to specified projects
      for (const projectId of assignedProjects) {
        const project = await Project.findById(projectId);
        if (project) {
          // Add to project team members
          if (!project.teamMembers.includes(user._id)) {
            project.teamMembers.push(user._id);
            await project.save();
          }

          // Create ProjectMember entry as member
          const projectMember = new ProjectMember({
            project: projectId,
            user: user._id,
            role: 'member'
          });
          await projectMember.save();
          projectMemberships.push(projectMember);
        }
      }
    }

    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'user_created',
      targetType: 'User',
      targetId: user._id,
      description: `Admin created user: ${user.username} with role: ${user.role}${projectMemberships.length > 0 ? ` and assigned to ${projectMemberships.length} project(s)` : ''}`,
      metadata: {
        createdRole: user.role,
        assignedProjects: assignedProjects || [],
        projectMemberships: projectMemberships.length
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON(),
      projectMemberships: projectMemberships.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { username, email, name, role, phone, department, isActive } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldData = { 
      username: user.username, 
      role: user.role, 
      isActive: user.isActive 
    };


    if (username) user.username = username;
    if (email) user.email = email;
    if (name) user.name = name;
    if (role) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (department !== undefined) user.department = department;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();


    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'user_updated',
      targetType: 'User',
      targetId: user._id,
      description: `Admin updated user: ${user.username}`,
      metadata: { 
        oldData, 
        newData: { 
          username: user.username, 
          role: user.role, 
          isActive: user.isActive 
        }
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const activeProjects = await Project.find({ 
      manager: userId, 
      status: 'active' 
    });

    if (activeProjects.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete user. They are managing ${activeProjects.length} active project(s). Please reassign or complete these projects first.`,
        activeProjects: activeProjects.map(p => ({ id: p._id, title: p.title }))
      });
    }

    await User.findByIdAndDelete(userId);


    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'user_deleted',
      targetType: 'User',
      targetId: userId,
      description: `Admin deleted user: ${user.username}`,
      metadata: { deletedUser: user.toJSON() },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.assignRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['admin', 'project_manager', 'team_member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();


    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'role_changed',
      targetType: 'User',
      targetId: user._id,
      description: `Admin changed role for ${user.username} from ${oldRole} to ${role}`,
      metadata: { oldRole, newRole: role },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: `Role updated to ${role} successfully`,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: user.getPermissions()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getActivityLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const action = req.query.action || '';
    const userId = req.query.userId || '';
    
    const query = {};
    
    if (action) {
      query.action = action;
    }
    
    if (userId) {
      query.user = userId;
    }

    const logs = await ActivityLog.find(query)
      .populate('user', 'username name role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ActivityLog.countDocuments(query);

    res.json({
      logs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalLogs: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .select('_id title status description')
      .populate('manager', 'name username')
      .sort({ createdAt: -1 });

    res.json({
      projects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const managerCount = await User.countDocuments({ role: 'project_manager' });
    const memberCount = await User.countDocuments({ role: 'team_member' });

    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'done' });
    const overdueTasks = await Task.countDocuments({
      deadline: { $lt: new Date() },
      status: { $nin: ['done', 'cancelled'] }
    });

    const recentActivity = await ActivityLog.find()
      .populate('user', 'username name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        roles: {
          admin: adminCount,
          project_manager: managerCount,
          team_member: memberCount
        }
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};