import * as express from 'express';
import * as bodyParser from 'body-parser';
import config from './config';
import db from './db';

// Creates and configures an ExpressJS web server.
class app {

  // ref to Express instance
  public express: express.Application;
 
  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {

    let router = express.Router();

    router.get('/v2/ping', (req, res, next) => {

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      res.json({
        message: 'PONG'
      });

    }).get('/v1/blog/postlitany', (req, res, next) => { // deprecated

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      const sql = "SELECT DISTINCT p.post_date,p.post_title,p.post_name FROM wp_posts p WHERE p.post_type='post' AND p.post_status='publish' ORDER BY 1 DESC;";

      let conn = db.createConnection();
      conn.query(sql, function (err, result) {

        setTimeout(() => db.destroyConnection(conn), 0);

        if (err) {
          throw err;
        } 
    
        if (!result || result.length == 0) {
          console.warn('no result.');
        }

        return res.json(result);

      });

    }).get('/v2/blog/post/litany', (req, res, next) => {

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      const sql = "SELECT DISTINCT p.post_date,p.post_title,p.post_name FROM wp_posts p WHERE p.post_type='post' AND p.post_status='publish' ORDER BY 1 DESC;";

      let conn = db.createConnection();
      conn.query(sql, function (err, result) {

        setTimeout(() => db.destroyConnection(conn), 0);

        if (err) {
          throw err;
        } 
    
        if (!result || result.length == 0) {
          console.warn('no result.');
        }

        return res.json(result);

      });

    }).get('/v1/blog/postbyname/:name', (req, res, next) => { // deprecated

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      let sql = `SELECT p.post_date,p.post_title,p.post_name,p.post_content FROM wp_posts p WHERE p.post_type='post' AND p.post_status='publish' AND p.post_name='${req.params.name}' LIMIT 1;`;

      let conn = db.createConnection();
      conn.query(sql, function (err, result) {

        setTimeout(() => db.destroyConnection(conn), 0);

        if (err) {
          throw err;
        } 
    
        if (!result || result.length == 0) {
          console.warn('no result.');
        }
            
        return res.json(result[0]);

      });

    }).get('/v2/blog/post/by-name/:name', (req, res, next) => { // deprecated

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      if (!req.params.name) {
        throw new Error("Missing expected parameter value for route: '/blog/post/by-name/:name'.");
      }

      let sql = `SELECT p.post_date,p.post_title,p.post_name,p.post_content FROM wp_posts p WHERE p.post_type='post' AND p.post_status='publish' AND p.post_name='${req.params.name}' LIMIT 1;`;

      let conn = db.createConnection();
      conn.query(sql, function (err, result) {

        setTimeout(() => db.destroyConnection(conn), 0);

        if (err) {
          throw err;
        } 
    
        if (!result || result.length == 0) {
          console.warn('no result.');
        }
            
        return res.json(result[0]);

      });

    }).get('/v1/blog/postbypagelimit', (req, res, next) => {

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      let postbypagelimit = config.WORDPRESS_LIMIT_POSTBYPAGE;
      return res.json(postbypagelimit);

    }).get('/v2/blog/post/by-page/limit', (req, res, next) => {

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      let postbypagelimit = config.WORDPRESS_LIMIT_POSTBYPAGE;
      return res.json(postbypagelimit);
      
    }).get('/v1/blog/postbypagenumber', (req, res, next) => { // deprecated

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      let postbypagelimit = parseInt(req.query.postbypagelimit);
      let offset = parseInt(req.query.pagenumber) * postbypagelimit;

      let sql = `SELECT p.post_date,p.post_title,p.post_name,p.post_content FROM wp_posts p WHERE p.post_type='post' AND p.post_status='publish' ORDER BY 1 DESC LIMIT ${postbypagelimit} OFFSET ${offset};`

      let conn = db.createConnection();
      conn.query(sql, function (err, result) {

        setTimeout(() => db.destroyConnection(conn), 0);

        if (err) {
          throw err;
        } 
    
        if (!result || result.length == 0) {
          console.warn('no result.');
        }

        return res.json(result);
   
      });

    }).get('/v2/blog/post/by-index/:index', (req, res, next) => {

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      if (!req.params.index) {
        throw new Error("Missing expected parameter value for route: '/blog/post/by-index/:index'.");
      }

      let postbypagelimit = config.WORDPRESS_LIMIT_POSTBYPAGE;
      let offset = parseInt(req.params.index) * postbypagelimit;

      let sql = `SELECT p.post_date,p.post_title,p.post_name,p.post_content FROM wp_posts p WHERE p.post_type='post' AND p.post_status='publish' ORDER BY 1 DESC LIMIT ${postbypagelimit} OFFSET ${offset};`

      let conn = db.createConnection();
      conn.query(sql, function (err, result) {

        setTimeout(() => db.destroyConnection(conn), 0);

        if (err) {
          throw err;
        } 
    
        if (!result || result.length == 0) {
          console.warn('no result.');
        }

        return res.json(result);
   
      });
      
    }).get('/v1/blog/postcount', (req, res, next) => { // deprecated

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      const sql = "SELECT COUNT(1) post_count FROM wp_posts WHERE post_type='post' AND post_status='publish'";

      let conn = db.createConnection();
      conn.query(sql, function (err, result) {
  
        setTimeout(() => db.destroyConnection(conn), 0);

        if (err) {
          throw err;
        } 
    
        if (!result || result.length == 0) {
          console.warn('no result.');
        }

        return res.json(result[0].post_count);
   
      });

    }).get('/v2/blog/post/count', (req, res, next) => {

      if (req.headers['x-api-key'] !== config.X_API_KEY) {
        res.statusCode = 403; // unauthorized
        res.end();
        return;
      }

      const sql = "SELECT COUNT(1) post_count FROM wp_posts WHERE post_type='post' AND post_status='publish'";

      let conn = db.createConnection();
      conn.query(sql, function (err, result) {
  
        setTimeout(() => db.destroyConnection(conn), 0);

        if (err) {
          throw err;
        } 
    
        if (!result || result.length == 0) {
          console.warn('no result.');
        }

        return res.json(result[0]);
   
      });

    })
    ;

    this.express.use('/', router);
  }

}

export default new app().express;
