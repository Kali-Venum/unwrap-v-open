import "./App.css";
import { Route, Routes } from "react-router-dom";
import routes from "./routes/index";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "./constants/config";

const stripePromise = loadStripe(
  STRIPE_PUBLISHABLE_KEY
);

function App() {
  return (
    <>
      <Elements stripe={stripePromise}>
        <Routes>
          {routes.map((item, index) => {
            return (
              <Route key={index} path={item.path} element={item.element} />
            );
          })}
        </Routes>
      </Elements>
    </>
  );
}

export default App;
