import axios from "axios";

const handlePayment = async (plan) => {
  // Step 1: Create order
  const { data } = await axios.post("http://localhost:5000/api/payment/order", { plan });

  const { order } = data;

  // Step 2: Open Razorpay
  const options = {
    key: "rzp_test_xxxxxxxxx", // use your key_id
    amount: order.amount,
    currency: order.currency,
    name: "AutoAttend",
    description: `${plan} subscription`,
    order_id: order.id,
    handler: async function (response) {
      // Step 3: Verify payment
      const verifyRes = await axios.post("http://localhost:5000/api/payment/verify", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (verifyRes.data.success) {
        alert("✅ Payment successful!");
      } else {
        alert("❌ Payment verification failed!");
      }
    },
    theme: { color: "#3399cc" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
