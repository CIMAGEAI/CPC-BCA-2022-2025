 

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { BACKEND_URL } from "../utils/utils";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBuyCourseData = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/v1/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        if (error?.response?.status === 400) {
          setError("You have already purchased this course");
          navigate("/purchases");
        } else {
          setError(error?.response?.data?.errors);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBuyCourseData();
  }, [courseId]);

  const finalAmount = course.price
    ? course.price - (course.price * (course.discount || 0)) / 100
    : 0;

  const handlePurchase = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (finalAmount <= 0) {
      // Free course logic (no Stripe)
      try {
        const paymentInfo = {
          email: user?.user?.email,
          userId: user.user._id,
          courseId: courseId,
          paymentId: null,
          amount: 0,
          finalAmount: 0,
          status: "free",
          discountPrice: course?.discount || 0,
        };

        await axios.post(`${BACKEND_URL}/api/v1/order`, paymentInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        toast.success("Course Enrolled for Free");
        navigate("/purchases");
      } catch (err) {
        toast.error("Error enrolling in free course");
        console.error(err);
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!stripe || !elements) {
      console.log("Stripe or Element not found");
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Cardelement not found");
      setLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Stripe PaymentMethod Error: ", error);
      setLoading(false);
      setCardError(error.message);
      return;
    }

    if (!clientSecret) {
      console.log("No client secret found");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
        courseId: courseId,
        paymentId: paymentIntent?.id,
        amount: paymentIntent?.amount,
        finalAmount: paymentIntent?.amount || 0,
        status: paymentIntent?.status || "succeeded",
        discountPrice: course?.discount || 0,
      };

      await axios
        .post(`${BACKEND_URL}/api/v1/order`, paymentInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

      toast.success("Payment Successful");
      navigate("/purchases");
    }

    setLoading(false);
  };

  return (
    <div className="bg-pink-400 min-h-screen flex items-center justify-center">
      <>
        {error ? (
          <div className="flex justify-center items-center h-screen">
            <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
              <p className="text-lg font-semibold">{error}</p>
              <Link
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
                to={"/purchases"}
              >
                Purchases
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row my-40 container mx-auto">
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-bold underline">Order Details</h1>

              <div className="mt-4 space-y-4 text-xl">
                <p>
                  <strong>Course name:</strong> {course.title}
                </p>
                <p>
                  <strong>Total Price:</strong> ₹{course.price}
                </p>
                <p>
                  <strong>Discount:</strong> {course.discount || 0}%
                </p>
                <p>
                  <strong>Payable amount:</strong> ₹{finalAmount.toFixed(2)}
                </p>
              </div>

              <br />

              <a
  href="https://cimagecollege.com/contact-us/"
  target="_blank"
  rel="noopener noreferrer"
>
  <div className="text-xl text-amber-700 cursor-pointer hover:underline hover:bg-emerald-300 p-3 rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-x-110">
    👉 If problem in purchasing paid books 🤔?
  </div>
</a>

               
            </div>

            
            

            <div className="w-full md:w-1/2 flex justify-center items-center">
              <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Process your Payment!
                </h2>

                {finalAmount > 0 ? (
                  <form onSubmit={handlePurchase}>
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                              color: "#aab7c4",
                            },
                          },
                          invalid: {
                            color: "#9e2146",
                          },
                        },
                      }}
                    />

                    <button
                      type="submit"
                      disabled={!stripe || loading}
                      className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                    >
                      {loading
                        ? "Processing..."
                        : `Pay ₹${finalAmount.toFixed(2)}`}
                    </button>

                    {cardError && (
                      <p className="text-red-500 font-semibold text-xs mt-2">
                        {cardError}
                      </p>
                    )}
                  </form>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
                  >
                    {loading ? "Processing..." : "Enroll for Free"}
                  </button>
                )}

                <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3">
                  Other Payment Methods
                </button>

                <div className="mt-4 text-center text-sm text-gray-700">
                  Your payment is going to:{" "}
                  <strong className="text-red-600">
                    Cimage College Patna ₹{finalAmount.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default Buy;
