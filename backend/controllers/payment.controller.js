//import stripe from "../config/stripe.js";

//export async function createCheckoutSession(req, res) {
//    const { garageId, price, description } = req.body;

//    try {
//        const session = await stripe.checkout.sessions.create({
//            payment_method_types: ["card"],
//            mode: "payment",
//            line_items: [
//                {
//                    price_data: {
//                        currency: "eur",
//                        product_data: {
//                            name: description || "Location de garage"
//                        },
//                        unit_amount: price * 100 // Stripe utilise les centimes
//                    },
//                    quantity: 1
//                }
//            ],
//            success_url: "http://localhost:3000/success",
//            cancel_url: "http://localhost:3000/cancel"
//        });
//
//        res.json({ url: session.url });
//    } catch (err) {
//        console.error(err);
//        res.status(500).json({ message: "Erreur Stripe" });
//    }
//}

