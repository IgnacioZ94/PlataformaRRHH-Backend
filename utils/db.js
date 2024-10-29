import sql from 'mssql';

const config = {
  user: 'sa',
  password: 'ifts16',
  server: 'localhost',
  database: 'employeems',
  options: {
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to SQL Server');
});

export default pool;