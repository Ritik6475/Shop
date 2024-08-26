import mongoose from "mongoose";
import passport from "passport";



import bcrypt from "bcryptjs";  
  

//import plm from "passport-local-mongoose"

// mongoose.connect("mongodb://127.0.0.1:27017/SAREE")
// MONGODB_URI=mongodb+srv://rathodritik259:1Q2w3e4r5t@cluster123.hmrpy.mongodb.net/SAREE
// const mongoUri = process.env.MONGODB_URI;

const MONGODB_URI = 'mongodb+srv://rathodritik259:1Q2w3e4r5t@cluster123.hmrpy.mongodb.net/SAREE';
   




// product

const ProductSchema = new mongoose.Schema({
  id: Number,
  brandname: { type: String, required: true },
  productname: { type: String, required: true },
  image: { type: String, required: true },
  imagetwo: { type: String },
  imagethree: { type: String },
  imagefour: { type: String },
  imagefive: { type: String },
  imagesix: { type: String },
  imageseven: { type: String },
  imageeight: { type: String },
  category: { type: String, required: true },
  description: String,
  feedback: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    content: String,
    image: String
  }],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    value: Number
  }],
  averageRating: { type: Number, default: 0 },
  new_price: { type: Number, required: true },
  old_price: { type: Number },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true, required: true},
  material: { type: String, required: true },
  colors: [String],
  sizes: [String],
  specifications: [{
    key: String,
    value: String
  }],
});


const Product = mongoose.model('Product', ProductSchema);




const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true, unique: true, trim: true },
  contact: { type: Number, required: true, trim: true },
  otp: { type: String },
  otpExpiresAt: { type: Date },

  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  password: { type: String, required: true },
  deliveryAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  cart: [],
  allOrders: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    price: Number,
    quantity: Number,
    image: String,
    size: String,
    color: String,  
    deliveryAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    status: { type: String, enum: ['pending', 'completed', 'cancelled', 'returned'], default: 'pending' },
    date: { type: Date, default: Date.now },
    statusChangeDate: { type: Date, default: Date.now }, // New field
    returnRequested: { type: Boolean, default: false }
  }],
  bundleOrders: [{
    products: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String,
      price: Number,
      image: String,
      quantity: Number,
      size: String,
      color: String
    }],
    totalAmount: Number,
    status: { type: String, enum: ['pending', 'completed', 'cancelled', 'returned'], default: 'pending' },
    date: { type: Date, default: Date.now },
    statusChangeDate: { type: Date, default: Date.now }, // New field
    returnRequested: { type: Boolean, default: false },
    deliveryAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  }]
});


//product

    // make password hashed for security
  
// make password hashed for security

  //userSchema.plugin(passportLocalMongoose);  
  const User = mongoose.model('User', userSchema);

  const adminSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    couponCode: String // New field for coupon code
  });
  
  const Admin = mongoose.model('Admin', adminSchema);
  

  const ticketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId }, // Use ObjectId if referring to allOrders or bundleOrders
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'solved', 'resolved'], default: 'pending' }, // Added 'resolved'
    adminResponse: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  });    



  const Ticket = mongoose.model('Ticket', ticketSchema);
  


  const newsletterSubscriberSchema = new mongoose.Schema({
  
    whatsappNumber: { type: String, required: true },
  dateSubscribed: { type: Date, default: Date.now },
  addedToGroup: { type: String, enum: ['yes', 'no'], default: 'no' } // Added field for tracking group status

  });
  
  const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
  export { Admin, User, Product, NewsletterSubscriber, Ticket };
