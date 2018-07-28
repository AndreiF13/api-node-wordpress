//import * as path from 'path';
import * as express from 'express';
//import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
//import service from './service';
import * as mysql from 'mysql';

// Creates and configures an ExpressJS web server.
class app {

  // ref to Express instance
  public express: express.Application;

  // data provider
  private readonly conn: mysql.Connection;
  private readonly postbypagelimit: number;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();

    this.conn = mysql.createConnection({
      host: process.env.WORDPRESS_DB_HOST,
      user: process.env.WORDPRESS_DB_USER,
      password: process.env.WORDPRESS_DB_PASSWORD,
      database: process.env.WORDPRESS_DB_NAME
    });
    this.conn.connect();

    this.postbypagelimit = 10; // TODO: process.env.wp_postbypagelimit;
  }

  // Configure Express middleware.
  private middleware(): void {
    //this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {

    let router = express.Router();

    router.get('/ping', (req, res, next) => {
      res.json({
        message: 'PONG'
      });
    }).get('/blog/post/litany', (req, res, next) => {

      const sql = "SELECT DISTINCT p.post_date,p.post_title,p.post_name FROM wp_posts p WHERE p.post_type='post' AND p.post_status='publish' ORDER BY 1 DESC;";

      this.conn.query(sql, function (err, result) {
  
        if (err) {
          throw err;
        } 
  
        if (!result || result.length == 0) {
          console.warn('no posts found.');
        } 
  
        return res.json(result);
   
      });

    }).get('/blog/post/by-name/:name', (req, res, next) => {

      if (!req.params.name) {
        throw new Error("Missing expected parameter value for route: '/blog/post/by-name/:name'.");
      }

      let sql = `SELECT p.post_date,p.post_title,p.post_name,p.post_content FROM wp_posts p WHERE p.post_type='post' AND p.post_status='publish' AND p.post_name='${req.params.name}' LIMIT 1;`;

      this.conn.query(sql, function (err, result) {
  
        if (err) {
          throw err;
        } 
  
        if (!result || result.length == 0) {
          console.warn('no posts found.');
        } 
  
        return res.json(result);
   
      });

    }).get('/blog/post/by-page/limit', (req, res, next) => {

        return res.json(this.postbypagelimit);

    }).get('/blog/post/by-index/:index', (req, res, next) => {

      if (!req.params.index) {
        throw new Error("Missing expected parameter value for route: '/blog/post/by-index/:index'.");
      }

      let offset = parseInt(req.params.index) * this.postbypagelimit;

      let sql = `SELECT p.post_date,p.post_title,p.post_name,p.post_content FROM wp_posts p WHERE p.post_type='post' AND p.post_status='publish' ORDER BY 1 DESC LIMIT ${this.postbypagelimit} OFFSET ${offset};`

      this.conn.query(sql, function (err, result) {
  
        if (err) {
          throw err;
        } 
  
        if (!result || result.length == 0) {
          console.warn('no posts found.');
        } 
  
        return res.json(result);
   
      });

    }).get('/blog/post/count', (req, res, next) => {

      const sql = "SELECT COUNT(1) post_count FROM wp_posts WHERE post_type='post' AND post_status='publish'";

      this.conn.query(sql, function (err, result) {
  
        if (err) {
          throw err;
        } 
  
        if (!result || result.length == 0) {
          console.warn('no posts found.');
        } 
  
        return res.json(result);
   
      });

    })
    ;

    this.express.use('/', router);
  }

}

export default new app().express;
