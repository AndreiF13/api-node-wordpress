class config {

  public static get WORDPRESS_DB_HOST() {
    return process.env.WORDPRESS_DB_HOST;
  }

  public static get WORDPRESS_DB_PORT() {
    return parseInt(process.env.WORDPRESS_DB_PORT || '3306');
  }

  public static get WORDPRESS_DB_USER() {
    return process.env.WORDPRESS_DB_USER;
  }

  public static get WORDPRESS_DB_PASSWORD() {
    return process.env.WORDPRESS_DB_PASSWORD;
  }

  public static get WORDPRESS_DB_NAME() {
    return process.env.WORDPRESS_DB_NAME;
  }

  public static get WORDPRESS_LIMIT_POSTBYPAGE() {
    return parseInt(process.env.WORDPRESS_LIMIT_POSTBYPAGE);
  }

  public static get X_API_KEY() {
    return process.env.X_API_KEY;
  }

}

export default config;