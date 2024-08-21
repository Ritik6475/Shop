
//Necessary imports
//////////////////////////////////////////////////////////////


import path from "path";
import mongoose  from "mongoose";  
import express from "express";
const app = express();
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from "passport";
import multer from "multer";
import { fileURLToPath } from 'url';
dotenv.config();

import {User,Admin,Product,NewsletterSubscriber,Ticket} from "./Databasefolder/Databasemodels.js";

import helmet from 'helmet';
import passportLocalMongoose from 'passport-local-mongoose';
const PORT = process.env.PORT || 2000 ;

app.use(bodyParser.json({ limit: '80mb' }));
app.use(bodyParser.urlencoded({ limit: '80mb', extended: true }));


app.use(helmet());
app.use(cors());
app.use(express.json());

///////miidlewares

// mongoose.connect("mongodb://127.0.0.1:27017/SAREE")

mongoose.connect("mongodb+srv://rathodritik259:1Q2w3e4r5t@cluster123.hmrpy.mongodb.net/SAREE")

// const MONGODB_URI = 'mongodb+srv://rathodritik259:1Q2w3e4r5t@cluster123.hmrpy.mongodb.net/SAREE';
   

let isLoggedIn = false;






/////////middlewares

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.listen(PORT, () =>{

    console.log('app is running on ' + PORT);

});

//name,email,password,number,cart,all order

app.get('/',(req,res)=>{
    res.send("Made via router");
})

// login and signup
//////////////////////////////////////////////////////////////////////////////////

app.post('/newsletterSubscribe', async (req, res) => {
    const { whatsappNumber } = req.body;
    try {
      const newSubscriber = new NewsletterSubscriber({ whatsappNumber });
      await newSubscriber.save();
      res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      res.status(500).json({ message: 'Error subscribing to newsletter' });
    }
  });
  


  // GET route to fetch all subscribers
  app.get('/getNewsletterSubscribers', async (req, res) => {
    try {
      const subscribers = await NewsletterSubscriber.find();
      res.json({ subscribers });
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      res.status(500).json({ message: 'Error fetching newsletter subscribers' });
    }
  });
  


  app.post('/Signup', async (req, res) => {
    const { fullname, contact, email, password, deliveryAddress } = req.body;
  
    try {
      const userExist = await User.findOne({ $or: [{ email }, { contact }] });
  
      if (userExist) {
        return res.status(400).json({ message: 'User already exists with this email or mobile number' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        fullname,
        contact,
        email,
        password: hashedPassword,
        deliveryAddress
      });
  
      await newUser.save();
  
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } catch (error) {
      console.error('Signup failed:', error.message);
      res.status(500).json({ message: 'Signup failed. Please try again later.' });
    }
  });
  
// Login route

app.post('/login', async (req, res) => {
  const { mobileNumber, password } = req.body;
  console.log('Mobile Number:', mobileNumber);
  console.log('Password:', password);

  try {
    const user = await User.findOne({ contact: mobileNumber });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Stored Hashed Password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match status:', isMatch);

    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log('Login processing successful');
    res.json({ token, username: user.fullname, userId: user._id });
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ message: 'Login failed. Please try again later.' });
  }
});



    ///////////////////////////////////////////////////////////


    
    function isLoggedInMiddleware(req, res, next) {
        if (isLoggedIn || req.isAuthenticated()) {
          isLoggedIn = true; // Set isLoggedIn to true if user is authenticated
          return next();
        }
        res.redirect("/login"); // If not authenticated, redirect to the login page
      }
      
   
    //// File uploading
    
    

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './uploads/images/');
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
      });
      
      const upload = multer({ storage });
            
      
    app.post("/upload",isLoggedInMiddleware, upload.single('product'), (req, res) => {
        res.json({
            success: 1,
            image_url: `http://localhost:2450/images/${req.file.filename}`
            
        })
    })
    
    
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

      
    
  const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
  
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
    };



    
    app.post('/addproduct', upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'imagetwo', maxCount: 1 },
      { name: 'imagethree', maxCount: 1 },
      { name: 'imagefour', maxCount: 1 },
      { name: 'imagefive', maxCount: 1 },
      { name: 'imagesix', maxCount: 1 },
      { name: 'imageseven', maxCount: 1 },
      { name: 'imageeight', maxCount: 1 }
  ]), async (req, res) => {
      try {
          const { id, brandname, productname, category, description, new_price, old_price, material, available } = req.body;
  
          // Extract uploaded image file paths
          const images = {
              image: req.files['image'] ? `/uploads/images/${req.files['image'][0].filename}` : null,
              imagetwo: req.files['imagetwo'] ? `/uploads/images/${req.files['imagetwo'][0].filename}` : null,
              imagethree: req.files['imagethree'] ? `/uploads/images/${req.files['imagethree'][0].filename}` : null,
              imagefour: req.files['imagefour'] ? `/uploads/images/${req.files['imagefour'][0].filename}` : null,
              imagefive: req.files['imagefive'] ? `/uploads/images/${req.files['imagefive'][0].filename}` : null,
              imagesix: req.files['imagesix'] ? `/uploads/images/${req.files['imagesix'][0].filename}` : null,
              imageseven: req.files['imageseven'] ? `/uploads/images/${req.files['imageseven'][0].filename}` : null,
              imageeight: req.files['imageeight'] ? `/uploads/images/${req.files['imageeight'][0].filename}` : null,
          };
  
          const sizes = [];
          const colors = [];
          const specifications = [];
  
          for (let key in req.body) {
              if (key.startsWith('sizes_')) {
                  sizes.push(req.body[key]);
              }
              if (key.startsWith('color_')) {
                  colors.push(req.body[key]);
              }
              if (key.startsWith('specifications_')) {
                  const specKey = key.split('_')[1];
                  const specValue = req.body[key];
                  specifications.push({ key: specKey, value: specValue });
              }
          }
  
          const newProduct = new Product({
              id,
              brandname,
              productname,
              ...images, // Spread images object to include all image fields
              category,
              description,
              new_price,
              old_price,
              material,
              available: available === 'true',
              colors,
              sizes,
              specifications
          });
  
          await newProduct.save();
  
          console.log('Product added');
          res.status(201).json({ message: 'Product added successfully', product: newProduct });
      } catch (error) {
          console.error('Error adding product:', error);
          res.status(500).json({ message: 'Error adding product', error });
      }
  });  
      
    //id,Brandname,productname,images,oprice,nprice,category,Available,color

    app.get('/products', async (req, res) => {
   
        try {
          const products = await Product.find();
          res.status(200).json(products);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching products', error });
        }
      });

// Update a product
// Update a product// Update a product

app.put('/updateproducts/:id', async (req, res) => {
    try {
        const { id } = req.params; // This will be the product's id
        const updatedProduct = await Product.findOneAndUpdate({ id: parseInt(id) }, req.body, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
});


// Delete a product
// Delete a product
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});


      app.post('/products/category', async (req, res) => {
        const { category } = req.body;
        const products = await Product.find({ category });


        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }
    
        try {
            const products = await Product.find({ category });
            res.json(products);
        } 
        catch (error) {
            console.error('Error fetching products by category:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

//necessary apis ends
////////////////////////////////////////////////////
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  


  app.post('/cart', async (req, res) => {
    const { userId, product, size, color, deliveryAddress } = req.body;

    if (!userId || !product || !size || !color) {
        return res.status(400).json({ error: 'UserId, product, size, and color are required' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the product (with the same size and color) already exists in the cart
        const productExistsInCart = user.cart.some(cartItem => 
            cartItem._id.toString() === product._id.toString() &&
            cartItem.size === size &&
            cartItem.color === color
        );

        if (productExistsInCart) {
            return res.status(400).json({ error: 'Product already exists in the cart' });
        }

        // Add product to the cart if it doesn't exist
        const cartItem = {
            ...product,
            size,
            color,
            deliveryAddress
        };

        user.cart.push(cartItem);

        await user.save();

        res.status(200).json({ message: 'Product added to cart' });

    } catch (error) {
        console.log('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/logout', (req, res) => {
  // For JWT-based authentication, the server doesn't need to do much here
  // Just inform the client to remove the token
  res.json({ message: 'Logout successful' });
});


// Backend

app.post('/getCartData', async (req, res) => {
  const { userId } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Your logic to fetch cart data
    res.json({ cart: user.cart });
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Main apis


app.post('/getCartCount', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'UserId is required. Please log in.' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ cartCount: user.cart.length });
  } catch (error) {
    console.log('Error fetching cart count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

import Razorpay from 'razorpay';
const razorpay = new Razorpay({
    key_id: 'rzp_test_PDH8JokGIvkPbl',
    key_secret: 'dxw5jWYgTu6mXE8E3cVDxUM6'
});


app.get('/allOrders', async (req, res) => {
    try {
        const allOrders = await User.find().select('allOrders').populate('allOrders.productId');
        res.status(200).json(allOrders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/orders', async (req, res) => {
    const { userId } = req.body;
    try {
        console.log(`Fetching orders for userId: ${userId}`);
        
        const user = await User.findById(userId).populate('allOrders.productId');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // console.log('Fetched orders:', user.allOrders);

        res.status(200).json(user.allOrders);
    } catch (error) {

        
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/updateOrderStatus', async (req, res) => {
  const { userId, orderId, status } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = user.allOrders.id(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.statusChangeDate = new Date(); // Update status change date
    await user.save();

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/createOrder', async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: amount * 100, // Amount in smallest currency unit
            currency: 'INR',
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

 

app.get('/getAllOrders', async (req, res) => {
    try {
      // Find all users and select necessary fields
      const users = await User.find().select('fullname deliveryAddress allOrders email contact');
  
      // Flatten and format orders data
      const allOrders = users.flatMap(user => 
        user.allOrders.map(order => ({
          ...order.toObject(),
          userName: user.fullname,
          useremail: user.email,
          usernumber: user.contact,
         

          deliveryAddress: user.deliveryAddress, // Include deliveryAddress information
          userId: user._id
        }))
      );
  
      res.status(200).json({ allOrders });
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
app.post('/getUserOrders', async (req, res) => {
    const { userId } = req.body
    try {
        const user = await User.findById(userId).select('allOrders').populate('allOrders.productId', 'productname image');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ allOrders: user.allOrders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




app.post('/getUserDetails', async (req, res) => {
  try {
      const { userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Server error' });
  }
});



app.post('/cancelReturnRequest', async (req, res) => {
  const { userId, orderId, productId } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId, userId });

    if (order) {
      order.returnRequested = false;
      await order.save();
      return res.status(200).json({ message: 'Return request cancelled successfully' });
    }

    const bundleOrder = await BundleOrder.findOne({ _id: orderId, userId });

    if (bundleOrder) {
      const product = bundleOrder.products.find(product => product.productId === productId);
      if (product) {
        product.returnRequested = false;
        await bundleOrder.save();
        return res.status(200).json({ message: 'Return request cancelled successfully' });
      }
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    console.error('Error cancelling return request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// // Fetch All Orders for Admin
// app.get('/getAllOrders', async (req, res) => {
//     try {
//         const users = await User.find().select('allOrders bundleOrders fullname').populate('allOrders.productId bundleOrders.products.productId', 'productName image');
//         const allOrders = users.flatMap(user => {
//             const singleOrders = user.allOrders.map(order => ({
//                 ...order.toObject(),
//                 userName: user.fullname,
//                 userId: user._id
//             }));
//             const bundleOrders = user.bundleOrders.map(order => ({
//                 ...order.toObject(),
//                 userId: user._id
//             }));
//             return [...singleOrders, ...bundleOrders];
//         });
//         res.status(200).json({ allOrders });
//     } catch (error) {
//         console.error('Error fetching all orders:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });



app.post('/removeFromCart', async (req, res) => {
    const { userId, productId } = req.body; // Changed cartItemId to productId

    if (!userId || !productId) {
        return res.status(400).json({ error: 'UserId and productId are required' });
    }   

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the index of the cart item with the given productId
        const index = user.cart.findIndex(item => item._id.toString() === productId);

        if (index === -1) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        // Remove the item from the cart array
        user.cart.splice(index, 1);

        // Save the updated user document
        await user.save();

        // Return the updated cart data
        res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/requestReturn', async (req, res) => {
    const { orderId } = req.body;
  
    try {
      const user = await User.findOneAndUpdate(
        { 'allOrders._id': orderId },
        { $set: { 'allOrders.$.returnRequested': true } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
  
      // Optionally, handle bundle orders similarly if needed
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error requesting return:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });
  

const updateQuantity = async (productId, quantityChange) => {
  const updatedCart = cart.map(product => {
    if (product._id === productId) {
      const updatedQuantity = Math.max(product.quantity + quantityChange, 1);
      return { ...product, quantity: updatedQuantity };
    }
    return product;
  }); 

  setCart(updatedCart);
  calculateTotals(updatedCart);

  try {
    const product = updatedCart.find(p => p._id === productId);
    await axios.post('/api/updateCartQuantity', { userId, productId, quantity: product.quantity });
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};


// API to fetch bundle orders for a user

app.post('/updateCartQuantity', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cartItem = user.cart.find(item => item._id.equals(productId));
    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cartItem.quantity = quantity;

    await user.save();

    res.status(200).json({ message: 'Cart quantity updated', cart: user.cart });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/getUserBundleOrders', async (req, res) => {

    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bundleOrders = user.bundleOrders;
        res.status(200).json({ bundleOrders });
    } catch (error) {
        console.error('Error fetching bundle orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// API to update bundle order status

// Add the correct delivery address fields in the saveOrder endpoint

app.post('/saveOrder', async (req, res) => {
  const { userId, productId, amount, size, deliveryAddress, color ,quantity} = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = {
      productId,
      productName: product.productname,
      price: amount,

      quantity,
      size,
      date: new Date(),
      color,
      image: product.image,
      deliveryAddress,
      status: 'pending'
    };

    user.allOrders.push(order);
    await user.save();

    res.status(200).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error('Error saving order:', error.message);
    res.status(500).json({ message: 'Error saving order' });
  }
});



app.post('/saveBundleOrder', async (req, res) => {
  const { userId, products, totalAmount, deliveryAddress } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bundleOrder = {
      products,
      totalAmount,
      status: 'pending',
      date: new Date(),

      deliveryAddress
    };

    user.bundleOrders.push(bundleOrder);
    await user.save();

    res.status(200).json({ message: 'Bundle order saved successfully', bundleOrderId: bundleOrder._id });
  } catch (error) {
    console.error('Error saving bundle order:', error.message);
    res.status(500).json({ message: 'Error saving bundle order' });
  }
});



// /updateBundleOrderStatus endpoint


app.post('/updateBundleOrderStatus', async (req, res) => {
  const { userId, bundleOrderId, status } = req.body;  // Removed deliveryAddress from destructuring

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bundleOrder = user.bundleOrders.id(bundleOrderId);
    if (!bundleOrder) {
      return res.status(404).json({ message: 'Bundle order not found' });
    }

    bundleOrder.status = status;
    bundleOrder.statusChangeDate = new Date(); // Update status change date
    await user.save();

    res.status(200).json({ message: 'Bundle order status updated successfully' });
  } catch (error) {
    console.error('Error updating bundle order status:', error.message);
    res.status(500).json({ message: 'Error updating bundle order status' });
  }
});



app.get('/getAllBundleOrders', async (req, res) => {
    try {
      // Find users with at least one bundle order
      const users = await User.find({ "bundleOrders.0": { "$exists": true } });
  
      // Flatten and format bundle orders data
      const allBundleOrders = users.flatMap(user =>
        user.bundleOrders.map(order => ({
          ...order.toObject(),
          userId: user._id,
          userName: user.fullname,
          useremail: user.email,
          usernumber: user.contact,
          
          deliveryAddress: user.deliveryAddress // Include deliveryAddress information
        }))
      );
  
      res.status(200).json({ bundleOrders: allBundleOrders });
    } catch (error) {
      console.error('Error fetching all bundle orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  



app.post('/buynow', async (req, res) => {
    const { userId, productId, amount } = req.body;

    if (!userId || !productId || !amount) {
        return res.status(400).json({ error: 'Payment amount, user ID, or product ID is missing.' });
    }

    try {
        // Convert productId to ObjectId
        const productObjectId = mongoose.Types.ObjectId(productId);

        const product = await Product.findById(productObjectId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Create a new order
        const newOrder = new Order({
            userId,
            productId: productObjectId,
            amount
        });

        // Save the order to the database
        await newOrder.save();

        res.status(201).json({ message: 'Order successfully placed.' });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
app.post('/submitFeedback', upload.single('image'), async (req, res) => {
    const { orderId, rating, feedback } = req.body;

    const image = req.file ? `/uploads/images/${req.file.filename}` : null;
      
    try {
      if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
      }

      // Find the user and order
      const user = await User.findOne({ 'allOrders._id': orderId });
  
      if (!user) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      let productToUpdate;
      user.allOrders.forEach(order => {
        if (order._id.toString() === orderId) {
          productToUpdate = order.productId;
        }
      });
  
      if (!productToUpdate) {
        return res.status(404).json({ message: 'Product not found in order' });
      }
  
      // Find the Product document and update ratings and feedback
      const product = await Product.findById(productToUpdate);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Add new rating and feedback with user name
      const userName = user.fullname; // Assuming 'fullname' is the user's name
      product.ratings.push({ user: user._id, name: userName, value: rating });
      product.feedback.push({ user: user._id, name: userName, content: feedback, image });
  
      // Calculate average rating
      const totalRatings = product.ratings.length;
      const sumRatings = product.ratings.reduce((acc, curr) => acc + curr.value, 0);
      product.averageRating = sumRatings / totalRatings;
  
      // Save updated product
      await product.save();
  
      res.status(200).json({ message: 'Feedback submitted successfully', product });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({ message: 'Error submitting feedback', error });
    }
});


app.post('/updateDeliveryAddress', async (req, res) => {
    const { userId, deliveryAddress } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.deliveryAddress = deliveryAddress;
      await user.save();
  
      res.status(200).json({ message: 'Delivery address updated successfully' });
    } catch (error) {
      console.error('Error updating delivery address:', error);
      res.status(500).json({ message: 'Failed to update delivery address' });
    }
  });

    
  // Get delivery address API

app.post('/getDeliveryAddress', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }
  
    
    try {
        const user = await User.findById(userId).select('deliveryAddress');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ deliveryAddress: user.deliveryAddress });
    } catch (error) {
        console.error('Error fetching delivery address:', error);
        res.status(500).json({ message: 'Failed to fetch delivery address' });
    }
});


// Update delivery address API
app.post('/updateDeliveryAddress', async (req, res) => {
    const { userId, deliveryAddress } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }
 
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.deliveryAddress = deliveryAddress;
        await user.save();

        res.status(200).json({ message: 'Delivery address updated successfully' });
    } catch (error) {
        console.error('Error updating delivery address:', error);
        res.status(500).json({ message: 'Failed to update delivery address' });
    }
});



app.post('/search', async (req, res) => {
    const { query } = req.body;
    try {
      // Check if query is numeric
      const isNumeric = !isNaN(parseFloat(query)) && isFinite(query);
      const regex = new RegExp(query, 'i');
      
      // Build search criteria
      const searchCriteria = {
        $or: [
          { brandname: regex },
          { productname: regex },
          { color: regex }
        ]
      };
  
      // Add numeric search criteria if query is a number
      if (isNumeric) {
        searchCriteria.$or.push({ new_price: parseFloat(query) });
      }
  
      const products = await Product.find(searchCriteria);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ message: 'Failed to fetch search results' });
    }
  });
  
  app.post('/products/details', async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});

app.get('/getAllTickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('userId');
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Failed to fetch all tickets:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});





app.post('/createTicket', async (req, res) => {
  try {
    const { userId, orderId, subject, description } = req.body;
    const existingTicket = await Ticket.findOne({ userId, orderId, status: { $ne: 'resolved' } });
    if (existingTicket) {
      return res.status(400).json({ message: 'There is already an unresolved ticket for this order.' });
    }
    const ticket = new Ticket({ userId, orderId, subject, description });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Failed to create ticket:', error);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
});

// /updateTicket API

app.post('/updateTicket', async (req, res) => {
  const { orderId, status, adminResponse } = req.body;

  console.log('Received update for order ID:', orderId);
  console.log('Status:', status);
  console.log('Admin Response:', adminResponse);

  if (!orderId) {
    return res.status(400).send({ error: 'Order ID is required' });
  }

  try {
    const updatedTicket = await Ticket.findOneAndUpdate(
      { orderId },
      { status, adminResponse },
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      return res.status(404).send({ error: 'Ticket not found' });
    }

    console.log('Updated Ticket:', updatedTicket);
    res.status(200).send({ message: 'Ticket updated successfully', ticket: updatedTicket });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).send({ error: 'Failed to update ticket' });
  }
});
// /getUserTickets API


app.post('/getUserTickets', async (req, res) => {
  try {
    const { userId } = req.body;
    const tickets = await Ticket.find({ userId });
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});


app.post('/couponcode', async (req, res) => {
  try {
    const { couponCode } = req.body;
    const admin = await admin.findOne(); // Adjust as necessary to find the specific admin

    if (admin) {
      admin.couponCode = couponCode;
      await admin.save();
      res.status(200).json({ message: 'Coupon code saved successfully' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error saving coupon code', error });
  }
});


app.get('/filters', async (req, res) => {
  try {
    // Fetch distinct values for category, brandname, colors, and sizes
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brandname');
    const colors = await Product.distinct('colors');
    const sizes = await Product.distinct('sizes');

    // Fetch price range
    const prices = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$new_price" },
          maxPrice: { $max: "$new_price" }
        }
      }
    ]);

    // Calculate discount ranges
    const discounts = await Product.aggregate([
      {
        $project: {
          discountPercentage: {
            $cond: { 
              if: { $eq: ['$old_price', null] }, 
              then: 0, 
              else: { $multiply: [{ $divide: [{ $subtract: ["$old_price", "$new_price"] }, "$old_price"] }, 100] }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          maxDiscount: { $max: "$discountPercentage" }
        }
      }
    ]);

    // Define discount ranges based on max discount
    const maxDiscount = discounts.length > 0 ? Math.ceil(discounts[0].maxDiscount / 10) * 10 : 0;
    const discountRanges = [];
    for (let i = 10; i <= maxDiscount; i += 10) {
      discountRanges.push(`${i}% and above`);
    }

    res.json({
      categories,
      brands,
      prices: prices.length > 0 ? prices[0] : { minPrice: 0, maxPrice: 0 },
      colors,
      sizes,
      discountRanges
    });
  } catch (error) {
    console.error('Error fetching filter data:', error);
    res.status(500).json({ message: 'Error fetching filter data' });
  }
});


const OTP_LENGTH = 6;
const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

app.post('/send-otp', async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    const user = await User.findOne({ contact: mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to the user's record
    user.otp = otp;
    user.otpExpiresAt = Date.now() + OTP_EXPIRY_TIME; // Set OTP expiration time
    await user.save();

    // Send OTP via SMS (mock implementation)
    console.log(`Sending OTP ${otp} to mobile number ${mobileNumber}`);
    // Use an SMS service API here to send the OTP to the user's phone number.

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Failed to send OTP:', error.message);
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
});


app.post('/verify-otp', async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    const user = await User.findOne({ contact: mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is correct and not expired
    if (user.otp !== otp || Date.now() > user.otpExpiresAt) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Failed to verify OTP:', error.message);
    res.status(500).json({ message: 'OTP verification failed. Please try again later.' });
  }
});



app.post('/reset-password', async (req, res) => {
  const { mobileNumber, newPassword } = req.body;

  try {
    const user = await User.findOne({ contact: mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's password (hashed)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Failed to reset password:', error.message);
    res.status(500).json({ message: 'Password reset failed. Please try again later.' });
  }
});
