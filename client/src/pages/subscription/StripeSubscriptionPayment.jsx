import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import http from "../../services/api/http";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Typography,
} from "@material-tailwind/react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
const StripeSubscriptionPayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { planId } = useParams();
  const { selectedSubcription } = useSelector(
    (state) => state.subscriptionReducer
  );

  const createSubscription = async (data) => {
    const response = await http.post("/stripe/subscribe/plan", data);
    return response;
  };

  const handleSubmitSub = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      if (error) {
        console.log(error.message);
        return;
      }
      const loggedUser = JSON.parse(localStorage.getItem("user"));

      const { id } = paymentMethod;
      const response = await createSubscription({
        email: loggedUser.email,
        planID: planId,
        stripeToken: id,
      });

      if (response.error) {
        console.log(response.error);
        return;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="pt-14">
      <Card className="w-96 mx-auto mt-6">
        <CardHeader
          variant="gradient"
          className="mb-4 grid place-items-center bg-primary py-1"
        >
          <Typography variant="h3" color="white">
            {selectedSubcription?.product.name}
          </Typography>
          <Typography variant="h3" color="white">
            <h2 className="text-4xl mt-2 mb-3 items-center align-middle">
              <sup className="text-2xl align-middle">$</sup>
              {selectedSubcription.price.amount / 100}
              <sub className="text-xl">
                /{selectedSubcription.price.interval.charAt(0)}
              </sub>
            </h2>
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 border-b">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            fullWidth
            className="mt-5 bg-primary text-white"
            onClick={handleSubmitSub}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StripeSubscriptionPayment;
