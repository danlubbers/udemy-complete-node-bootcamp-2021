/* eslint-disable */
import axios from 'axios';
import { showAlerts } from 'alerts';

const stripe = Stripe(
  'pk_test_51IuNRgDnwabxwUC26ZJBr0u1jVACDlC255ZCXNkNoncI4f0WEnfFNZvu6dC3I7jovOOd36jxTahmXxbDb6ZPRP5w00JVfw6ojb'
);

export const bookTour = async (tourId) => {
  try {
    // 1. Get checkout session from API endpoint
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
