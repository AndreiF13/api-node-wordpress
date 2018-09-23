import * as mysql from 'mysql';
import config from './config';

class db {

  public static createConnection(): mysql.Connection
  {
    let conn = mysql.createConnection({
      host: config.WORDPRESS_DB_HOST,
      port: config.WORDPRESS_DB_PORT,
      user: config.WORDPRESS_DB_USER,
      password: config.WORDPRESS_DB_PASSWORD,
      database: config.WORDPRESS_DB_NAME
    });
    conn.connect();

    return conn;
  }

  public static destroyConnection(conn: mysql.Connection): void
  {
    conn.destroy();
  }

}

export default db;