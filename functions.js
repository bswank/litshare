// Some functions made available to our templates via our local variables (f.[function])

// Is the user a community admin
exports.isAdmin = (u, c) => {
  for (let i = 0; i < c.admin.length; i++) {
    if (c.admin[i].toString() == u._id) {
      return true;
    }
  }
};

// Is the user a member of a community
exports.isMember = (u, c) => {
  for (let i = 0; i < u.communities.length; i++) {
    if (u.communities[i].toString() == c._id) {
      return true;
    }
  }
};
