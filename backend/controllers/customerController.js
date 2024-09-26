const customer = require("../models/customerModel");
const Restaurant = require("../models/restaurantModel")
const Product = require('../models/productModel');
module.exports.profileDetailsCustomer = async function(req, res) {
    try {
        const user = await customer.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Render the profile details form and pass user data
        // res.render("profileDetailsCustomer", { user }); // Adjust the template name as needed
        res.send("into the Profile Details Page");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving user details");
    }
};  


module.exports.updateDetailsCustomer = async function(req, res) {
    try {
        const {address, contact } = req.body;

        // Validate input
        if (!address || !contact) {
            return res.status(400).send("Please fill in all the fields.");
        }
        console.log("into customer contorler")
        console.log(req.userId);
        
        // Find the user and update their profile details
        const updatedUser = await customer.findByIdAndUpdate(
            req.userId,
            { address, contact },
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).send("User not found.");
        }

        // Redirect to the customer dashboard after updating
        res.redirect(303,"/customer/dashboard");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating user profile");
    }
};


module.exports.getTopRestaurant = async function(req, res){
    try {
        // Fetch the top 8 restaurants sorted by rating (or any other criteria)
        const restaurants = await Restaurant.find({})
        .sort({ rating: -1 }) // Sort by rating (descending)
        .limit(8)
        .select('hotelName rating `photos` address.fullAddress knownFor'); // Only fetch necessary fields
        
        console.log(restaurants);
        return res.status(200).json(restaurants);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return res.status(500).json({ message: 'Server Error' });
    }
}


module.exports.listMenu = async function(req, res) {
    try {
        const restaurantId = req.params.restaurantId;  // Get the restaurant ID from the URL params

        // Find the restaurant by ID and populate the 'menu' field with the referenced products
        const restaurant = await Restaurant.findById(restaurantId).populate('menu');
        
        if (!restaurant) {
            return res.status(404).send("Restaurant not found.");
        }

        // Return the populated menu
        res.status(200).json(restaurant.menu);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching menu.");
    }
};

const Customer = require('../models/customerModel'); // Ensure this path is correct
module.exports.addToCart = async function(req, res) {
    try {
        const { productId, quantity } = req.body; // Get product ID and quantity from the request body

        // Validate input
        if (!productId || !quantity) {
            return res.status(400).send("Please provide product ID and quantity.");
        }

        // Find the customer by ID
        const customer = await Customer.findById(req.userId);
        if (!customer) {
            return res.status(404).send("Customer not found.");
        }

        // Ensure cart is initialized
        if (!customer.cart) {
            customer.cart = []; // Initialize cart as an empty array if undefined
        }

        // Check if the product already exists in the cart
        const existingCartItem = customer.cart.find(item => item.product.toString() === productId);

        if (existingCartItem) {
            // Update quantity if the product is already in the cart
            existingCartItem.quantity += quantity;
        } else {
            // Add new product to the cart
            customer.cart.push({ product: productId, quantity });
        }

        // Save the updated customer document
        await customer.save();
        res.status(200).json(customer.cart); // Return updated cart items
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding item to cart.");
    }
};


// controllers/customerController.js


// Get cart items
module.exports.getCart = async function(req, res) {
    try {
        // Find the customer by userId and populate the cart with product details
        const customer = await Customer.findById(req.userId).populate({
            path: 'cart.product', // Assuming `cart` holds references to products
            model: 'Product' // Reference the Product model
        });

        if (!customer) {
            return res.status(404).send("Customer not found.");
        }

        // If customer has a cart, send the populated cart details
        res.status(200).json(customer.cart);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching cart.");
    }
};

// Update cart item quantity
module.exports.updateCartQuantity = async function(req, res) {
    try {
        const { itemId } = req.params; // Get item ID from the URL parameters
        const { quantity } = req.body; // Get new quantity from request body

        const customer = await Customer.findById(req.userId);
        if (!customer) {
            return res.status(404).send("Customer not found.");
        }

        // Find the item in the cart and update its quantity
        const cartItem = customer.cart.find(item => item._id.toString() === itemId);
        if (!cartItem) {
            return res.status(404).send("Cart item not found.");
        }

        cartItem.quantity = quantity; // Update the quantity
        await customer.save();
        res.status(200).json(customer.cart); // Return updated cart items
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating cart quantity.");
    }
};

// Handle checkout
module.exports.checkout = async function(req, res) {
    try {
        const customer = await Customer.findById(req.userId).populate('cart.product');
        if (!customer) {
            return res.status(404).send("Customer not found.");
        }

        // Implement checkout logic, e.g., create an order, deduct wallet balance, etc.

        // Optionally clear the cart after checkout
        customer.cart = []; 
        await customer.save();

        res.status(200).send("Checkout successful.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error during checkout.");
    }
};


const adminID='66f50593a65bcef6719b2644'
/// controllers/customerController.js
const Order = require('../models/orderModel');

// module.exports.checkout = async function(req, res) {
//     try {
//         const customer = await Customer.findById(req.userId).populate('cart.product');
//         const admin=await Customer.findById(adminID)

//         if(!admin){
//             return res.status(404).send("Admin Inactive, try again later");
//         }

       
//         if (!customer) {
//             return res.status(404).send("Customer not found.");
//         }
          
//         // const restaurant=await Restaurant.find(product._id : customer.cart[0].product._id);
//         const productIds = await Product.findById(customer.cart[0].product._id );
//         // Find restaurants that have these products in their menu
//         const restaurant = await Restaurant.findOne({
//             menu: { $in: productIds }
//         }); // Populate menu if you want to include product details
//         console.log(restaurant)
    
//         const totalAmount = customer.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
               
//         // Check if the customer has enough wallet balance
//         if (customer.wallet < totalAmount) {
//             return res.status(400).send("Insufficient wallet balance for this order.");
//         }
//         console.log(admin.wallet.balance)
//         console.log(restaurant.wallet.balance)
//         console.log(totalAmount)
//         const adminAmount=0.1*totalAmount;
//         admin.wallet.balance+=adminAmount;
         
//         const restaurantAmount=totalAmount-adminAmount;
//         restaurant.wallet.balance+=restaurantAmount;
//         // // Create the order
//         const order = new Order({
//             customer: customer._id,
//             restaurant: restaurant, // Assuming all items are from the same restaurant
//             items: customer.cart.map(item => ({
//                 product: item.product._id,
//                 quantity: item.quantity
//             })),
//             totalAmount: totalAmount,
//             status: 'pending' // Order status set to pending
//         });

//         await order.save();

//         // Deduct the total amount from the customer's wallet
//         customer.wallet -= totalAmount;
//         customer.cart = []; // Clear the cart after successful checkout
//         await customer.save();

//         res.status(201).json({ message: "Order placed successfully!", order });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error during checkout.");
//     }
// };

module.exports.checkout = async function(req, res) {
    try {
        const customer = await Customer.findById(req.userId).populate('cart.product');
        const admin = await Customer.findById(adminID);

        if (!admin) {
            return res.status(404).send("Admin Inactive, try again later");
        }

        if (!customer) {
            return res.status(404).send("Customer not found.");
        }

        if (customer.cart.length === 0) {
            return res.status(400).send("Cart is empty. Please add items to the cart before checking out.");
        }

        const productIds = await Product.findById(customer.cart[0].product._id);

        const restaurant = await Restaurant.findOne({
            menu: { $in: productIds }
        });

        if (!restaurant) {
            return res.status(404).send("Restaurant not found.");
        }

        console.log("Restaurant found: ", restaurant);

        const totalAmount = customer.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

        if (customer.wallet.balance < totalAmount) {  // Access wallet.balance, not wallet
            return res.status(400).send("Insufficient wallet balance for this order.");
        }

        console.log(`Admin balance: ${admin.wallet.balance}`);
        console.log(`Restaurant balance: ${restaurant.wallet.balance}`);
        console.log(`Total Amount: ${totalAmount}`);

        const adminAmount = 0.1 * totalAmount;
        admin.wallet.balance += adminAmount;

        const restaurantAmount = totalAmount - adminAmount;
        restaurant.wallet.balance += restaurantAmount;

        const order = new Order({
            customer: customer._id,
            restaurant: restaurant._id, // Ensure restaurant ID is saved correctly
            items: customer.cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            totalAmount: totalAmount,
            status: 'pending' // Order status set to pending
        });

        await order.save();

        // Deduct the total amount from the customer's wallet
        customer.wallet.balance -= totalAmount;  // Access wallet.balance, not wallet
        customer.cart = []; // Clear cart after checkout

        // Save all entities
        await admin.save();
        await restaurant.save();
        await customer.save();

        res.status(201).json({ message: "Order placed successfully!", order });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error during checkout.");
    }
};

module.exports.getOrders = async function(req, res) {
    try {
        const userId = req.userId; // Assuming req.userId is set by your authentication middleware

        // Find orders for the user and populate relevant fields
        const orders = await Order.find({ customer: userId })
            .populate('restaurant', 'email') // Get restaurant email
            .populate('items.product'); // Populate the product details

        // Check if orders exist
        if (!orders || orders.length === 0) {
            return res.status(200).json([]); // Return an empty array if no orders found
        }

        // Format the response
        const formattedOrders = orders.map(order => {
            // Ensure restaurant data is available
            if (!order.restaurant) {
                return {
                    restaurantId: null,
                    restaurantEmail: 'N/A',
                    items: order.items,
                    totalAmount: order.totalAmount,
                    status: order.status,
                    createdAt: order.createdAt
                };
            }

            return {
                restaurantId: order.restaurant._id,
                restaurantEmail: order.restaurant.email,
                items: order.items,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt
            };
        });

        res.status(200).json(formattedOrders);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching orders.");
    }
};
