# Express.js Social Media API

This project is a RESTful API for a social media application built using Express.js, a popular Node.js framework. The
API supports various features typical of a social media platform.

## Key Features:

1. **User Authentication**: The API supports user registration and login functionality. It uses JSON Web Tokens (JWT)
   for maintaining user sessions and securing endpoints.

2. **Post Management**: Users can create, read, update, and delete posts. Each post includes a title, content, and an
   image. The API validates incoming data for these operations.

3. **Image Upload**: The API supports image upload for posts. It validates the uploaded file to ensure it is an image
   and has the correct format.

4. **User Status**: Users can get and update their status. The status update functionality includes validation to ensure
   the status message is valid.

5. **Error Handling**: The API includes a global error handling middleware for handling and responding to errors
   throughout the application.

6. **CORS Support**: The API is configured to handle Cross-Origin Resource Sharing (CORS), allowing it to be accessed
   from different domains.

This project uses MongoDB as its database, with Mongoose as the ODM for data modeling. It also uses
the `express-validator` middleware for server-side validation, and the `dotenv` package for environment variable
management.

The project is organized with a clear separation of concerns following the MVC pattern. The `controllers` directory
contains the logic for handling requests and responses, the `models` directory contains the data models, and
the `routes` directory contains the route definitions.

This API provides a solid foundation for building a social media application and can be extended with more features like
comments, likes, and user relationships (followers/following).
