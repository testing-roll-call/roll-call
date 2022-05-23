class User {
  constructor(id, role, email, password) {
    this.id = id;
    this.role = role;
    this.email = email;
    this.password = password;
  }
}

module.exports = { User };
