const MySql = require("../db/database.js");
const Posts = require("../models/Posts.js");


class PostService {
  constructor(sql){
    this.sql = sql;
    this.posts = Posts
    this.mysql = MySql()
  }
  
  async getPosts(limit, offset){
    const result = await this.sql.query(`
      SELECT *
      FROM posts
      LIMIT ${limit}
      OFFSET ${offset}
    `);
    return result.rows;
  }
  
  async getPostById(id){
    const result = await this.mysql.query(`
      SELECT *
      FROM posts
      WHERE id = ${id}
    `);
    return result.rows[0];
  }
  
  async createPost(title, content, userId){
  }

  async updatePost(id, title, content){
  }

  async deletePost(id){
  }
}

module.exports = PostService;