/**
 * @fileoverview Display controller for handling view rendering
 * @module controllers/display.js
 *
 * Provides controller functions for rendering application views,
 * including the main index page and error pages.
 */

/**
 * Renders the main index/home page
 * @function indexDisplay
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export const indexDisplay = (req, res) => {
  res.render("index");
};

/**
 * Renders the admin page
 * @function adminDisplay
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export const adminDisplay = (req, res) => {
  res.render("admin");
};

/**
 * Renders the 404 Not Found error page
 * @function display404
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export const display404 = (req, res) => {
  res.status(404).render("404");
};

/**
 * Renders the 500 Internal Server Error page
 * @function display500
 * @param {Error} error - The error that occurred
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export const display500 = (error, req, res, next) => {
  console.log(error);
  res.status(500).render("500");
};
