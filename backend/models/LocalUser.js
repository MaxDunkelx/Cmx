// Simplified User model for local JSON database
let users = [];

export default {
  findOne(query) {
    const user = users.find(u => {
      for (const key in query) {
        if (u[key] !== query[key]) return false;
      }
      return true;
    });
    return Promise.resolve(user || null);
  },

  findById(id) {
    return Promise.resolve(users.find(u => u._id === id) || null);
  },

  create(data) {
    const newUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    return Promise.resolve(newUser);
  },

  find(query = {}) {
    return Promise.resolve(users.filter(u => {
      for (const key in query) {
        if (u[key] !== query[key]) return false;
      }
      return true;
    }));
  }
};

// Export the array for direct access if needed
 GUID{ users };

