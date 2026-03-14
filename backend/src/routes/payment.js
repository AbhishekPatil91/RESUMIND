import express from 'express';
import Stripe from 'stripe';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    name: 'Pro',
    price: 9.99,
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    name: 'Enterprise',
    price: 29.99,
  }
};

// POST /api/payment/create-checkout
router.post('/create-checkout', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    const stripe = getStripe();
    const planData = PLANS[plan];
    if (!planData) return res.status(400).json({ message: 'Invalid plan' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: req.user.email,
      line_items: [{ price: planData.priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      metadata: { userId: req.user._id.toString(), plan },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/payment/webhook - Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, plan } = session.metadata;
    await User.findByIdAndUpdate(userId, {
      plan,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
    });
  }

  res.json({ received: true });
});

export default router;
