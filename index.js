import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';



const app = express();
const PORT = 9000;
const mongoURI = `mongodb+srv://mdshaiadul:vXorG5jxgJlqGOSh@shaiadulstors.qvpid5t.mongodb.net/basic_db?retryWrites=true&w=majority`;

// Middleware
app.use(bodyParser.json());
// Connect to MongoDB 
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


// -----------------------
// Root Routes
// -----------------------
app.get('/', (req, res) => {
  res.send('<h1 style="font-size: 36px; text-align: left; margin: 15px">Hey Dev, Welcome to Social_Complex API Server!</h1> </br> <h2 style="font-size: 24px; text-align: left; margin: 15px">Please use the following routes to access the API:<span style="font-size: 30px; text-align: left; color: red; margin-left: 5px;">https://crimson-anemone-vest.cyclic.app/api/v1/</span></h2>  ');
});
// ----------------------
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);







// -----------------------
// Swagger Setup
// -----------------------
const option = {
  swaggerDefinition: {
   openapi: '3.0.0',
   info: {
     title: 'Social_Complex API',
     version: '1.0.0',
     description: 'Social_Complex API Information Documentation ',
     contact: {
       name: 'Shaiadul Bashar',
       email: 'mdshaiadul@gmail.com',
      },
    },
   servers: [
     {
       url: 'http://localhost:9000',
       description: 'Development server',
     },
     {
        url: 'https://crimson-anemone-vest.cyclic.app/api/v1/',
        description: 'Production server',
     }
   ],
  },
  apis: ['./routes/*.js'],
};

const space = swaggerJSDoc(option);

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(space));
  