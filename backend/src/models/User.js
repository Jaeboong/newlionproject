const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      validate: {
        len: [4, 20]
      }
    },
    pwd: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 20]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
    // 향후 다른 모델과 관계를 설정할 수 있음
    // 예: User.hasMany(models.Directory, { foreignKey: 'userId', as: 'directories' });
  };

  return User;
}; 