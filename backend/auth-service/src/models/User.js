const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');  // ✅ IMPORT INSTANCE

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: { 
      len: [3, 50],
      notNull: { msg: 'Username is required' }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { 
      isEmail: { msg: 'Valid email required' },
      notNull: { msg: 'Email is required' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { 
      len: [6, 255],
      notNull: { msg: 'Password is required' }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'Users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
