module.exports = {
  database: 'mean_relational_test',
  username: '',
  password: '',
  params: {
    dialect: 'sqlite',
    storage: 'mean_relational_test.sqlite',
    logging: false,
    define: {
      underscored: true,
    },
  },
  jwtSecret: 'Mean-relational-test',
  jwtSession: { session: false },
};
