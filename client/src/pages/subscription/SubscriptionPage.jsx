import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSubscriptionPlans,
  setSelectedSubscription,
} from "../../redux/reducers/subscription.slice";
import http from "../../services/api/http";
import { Button } from "@material-tailwind/react";

const SubscriptionPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    subscriptionPlans,
    isFetchingSubscriptionPlans,
    selectedSubcription,
  } = useSelector((state) => state.subscriptionReducer);

  useEffect(() => {
    dispatch(getSubscriptionPlans());
  }, []);

  const handleSubmitSub = async (data) => {
    dispatch(setSelectedSubscription(data));
    setIsLoading(true);
    try {
      const response = await http.post(
        "/stripe/subscribe/plan/session-checkout",
        {
          priceId: data.price.id,
        }
      );
      if (response.result?.data) {
        window.location.href = response.result.data.url;
      }
    } catch (error) {
      console.log("errr", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="pb-5 relative">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          {/* <span className="font-medium text-gray-400 tracking-widest">our price</span> */}
          <h2 className="md:text-4xl text-3xl font-medium tracking-tight mt-7">
            Price Plans
          </h2>
          <div className="w-10 mx-auto mt-5 bg-gradient-to-r from-cyan-500 to-blue-500 h-[2px]"></div>
          <p className="mt-6 text-xl/8 text-gray-600 dark:text-gray-400">
            Choose the plan that suits your needs best and enjoy the creative
            process of brainstorming the new project of yours.
          </p>
        </div>

        {isFetchingSubscriptionPlans ? (
          <div className="h-96 flex justify-center items-center">
            <div className="w-9 mx-auto h-9 border-4 border-dashed rounded-full animate-spin border-primary"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-10 2xl:px-20 mt-20">
            {subscriptionPlans?.data?.map((data, index) =>
              data.product.name !== "Medium" ? (
                <div
                  key={index}
                  className="flex flex-col border border-gray-300 rounded-xl overflow-hidden dark:border-gray-700 transform ransition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105"
                >
                  <div className="text-center pt-10">
                    <h5 className="text-xl font-semibold">
                      {data.product.name}
                    </h5>
                    <h2 className="text-5xl mt-8 mb-3 items-center align-middle">
                      <sup className="text-2xl align-middle">$</sup>
                      {data.price.amount / 100}
                      <sub className="text-xl">
                        /{data.price.interval.charAt(0)}
                      </sub>
                    </h2>
                    {/* <span>per user, per month</span> */}
                  </div>
                  <div className="w-4/5 mx-auto mt-6 border border-blue-gray-100"></div>
                  <div className="p-4">
                    <ul className="mb-10 text-center">
                      <li className="my-4">
                        <h5 className="font-medium dark:text-gray-300">
                          10k Visitors/mo
                        </h5>
                      </li>
                      <li>
                        <h5 className="font-medium dark:text-gray-300">
                          10 Funnels, 50 Pages
                        </h5>
                      </li>
                      <li className="my-4">
                        <h5 className="font-medium dark:text-gray-300">
                          Unlimited Transactions
                        </h5>
                      </li>
                      <li>
                        <h5 className="font-medium dark:text-gray-300">
                          Analytics
                        </h5>
                      </li>
                      <li className="my-4">
                        <h5 className="font-medium dark:text-gray-300">
                          lnstegrations
                        </h5>
                      </li>
                      <li className="my-4">
                        <h5 className="font-medium text-gray-500 line-through dark:text-gray-300">
                          Audience Date
                        </h5>
                      </li>
                      <li className="my-4">
                        <h5 className="font-medium text-gray-500 line-through dark:text-gray-300">
                          Premium templates
                        </h5>
                      </li>
                      <li className="my-4">
                        <h5 className="font-medium text-gray-500 line-through dark:text-gray-300">
                          White Labelling
                        </h5>
                      </li>
                    </ul>
                    <div className="flex justify-center">
                      <Button
                        loading={
                          selectedSubcription?.price.id === data.price.id &&
                          isLoading
                        }
                        onClick={() => handleSubmitSub(data)}
                        className="py-3 px-6 font-medium border rounded-md border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-500"
                      >
                        Get Plan
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className="relative z-20 transform ransition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105"
                >
                  <div className="absolute top-0 inset-x-0">
                    <div className="flex justify-center">
                      <span className="text-xs font-medium uppercase border border-gray-700 text-white bg-black px-5 py-2 rounded-md -mt-3">
                        most popular
                      </span>
                    </div>
                  </div>
                  <div className="group">
                    <div className="border rounded-xl border-gray-300 bg-white dark:border-gray-700 dark:bg-neutral-900">
                      <div className="text-center">
                        <div className="flex flex-col">
                          <div className="text-center pt-10">
                            <h5 className="text-xl font-semibold">
                              {data.product.name}
                            </h5>
                            <h2 className="text-5xl mt-8 mb-3 items-center align-middle">
                              <sup className="text-2xl align-middle">$</sup>
                              {data.price.amount / 100}
                              <sub className="text-xl">
                                /{data.price.interval.charAt(0)}
                              </sub>
                            </h2>
                            {/* <span>per user, per month</span> */}
                          </div>
                          <div className="w-4/5 mx-auto mt-6 border border-blue-gray-100"></div>
                          <div className="p-4">
                            <ul className="mb-10 text-center">
                              <li className="my-4">
                                <h5 className="font-medium dark:text-gray-300">
                                  10k Visitors/mo
                                </h5>
                              </li>
                              <li>
                                <h5 className="font-medium dark:text-gray-300">
                                  10 Funnels, 50 Pages
                                </h5>
                              </li>
                              <li className="my-4">
                                <h5 className="font-medium dark:text-gray-300">
                                  Unlimited Transactions
                                </h5>
                              </li>
                              <li>
                                <h5 className="font-medium dark:text-gray-300">
                                  Analytics
                                </h5>
                              </li>
                              <li className="my-4">
                                <h5 className="font-medium dark:text-gray-300">
                                  lnstegrations
                                </h5>
                              </li>
                              <li className="my-4">
                                <h5 className="font-medium dark:text-gray-300">
                                  Audience Date
                                </h5>
                              </li>
                              <li className="my-4">
                                <h5 className="font-medium dark:text-gray-300">
                                  Premium templates
                                </h5>
                              </li>
                              <li className="my-4">
                                <h5 className="font-medium text-gray-500 line-through dark:text-gray-300">
                                  White Labelling
                                </h5>
                              </li>
                            </ul>
                            <div className="flex justify-center">
                              <Button
                                loading={
                                  selectedSubcription?.price.id ===
                                    data.price.id && isLoading
                                }
                                onClick={() => handleSubmitSub(data)}
                                className="py-3 px-6 font-medium border rounded-md border-primary bg-primary text-white"
                              >
                                Get plan
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-neutral-300/30 rounded-xl dark:bg-neutral-700 h-full left-0 top-0 w-full translate-x-2 translate-y-2 -z-10"></div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
