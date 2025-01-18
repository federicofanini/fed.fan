"use client";

import { CheckoutSession } from "@/app/api/creem/checkout/route";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const Pay = () => {
  const router = useRouter();

  const fetchCheckoutSessionUrl = async () => {
    const { data } = await axios.get("/api/creem/checkout");
    if (data.success) {
      const checkoutSession = data.checkout as CheckoutSession;
      router.push(checkoutSession.checkout_url);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={fetchCheckoutSessionUrl}>Checkout</Button>
    </div>
  );
};

export default Pay;

// This URL is used for redirecting after a successful checkout session.
// It includes query parameters for checkout_id, order_id, customer_id, product_id, and signature.
// Example: http://localhost:3000/dashboard/business
// ?checkout_id=ch_55dJSX9yDxIarjc6eUx655
// &order_id=ord_5lHhSB3Jw3vVpowGq9flPk
// &customer_id=cust_ABGFKoBpZyichzhj0B1bb
// &product_id=prod_7iEgop41OX7hWWmoITtI9b
// &signature=c11660c9a13f9692a7403f614b7880ff15df4e8a94825c063e7c09d661c08ba5
