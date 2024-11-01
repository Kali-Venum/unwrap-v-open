import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";

// Pages
import LoginPage from "../pages/auth/LoginPage";
import RegistrationPage from "../pages/auth/RegistrationPage";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import CreateProject from "../pages/create-project/CreateProject";
import DashboardPage from "../pages/dashboard/DashboardPage";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProjectPage from "../pages/projects/ProjectPage";
import ShowProject from "../pages/showIndProImg/ShowProject";
import StripeSubscriptionPayment from "../pages/subscription/StripeSubscriptionPayment";
import SubscriptionPage from "../pages/subscription/SubscriptionPage";

// Layout functions.
const AuthLayoutFunc = (comp) => {
  return <AuthLayout>{comp}</AuthLayout>;
};

const UserLayoutFunc = (comp) => {
  return <UserLayout>{comp}</UserLayout>;
};

const routes = [
  {
    path: "*",
    element: <NotFoundPage />,
    type: "unprotected",
  },
  {
    path: "/login",
    element: AuthLayoutFunc(<LoginPage />),
    type: "unprotected",
  },
  {
    path: "/register",
    element: AuthLayoutFunc(<RegistrationPage />),
    type: "unprotected",
  },
  {
    path: "/verify-email",
    element: AuthLayoutFunc(<VerifyEmail />),
    type: "unprotected",
  },
  {
    path: "/forget-password",
    element: AuthLayoutFunc(<ResetPassword />),
    type: "unprotected",
  },
  {
    path: "/dashboard",
    element: UserLayoutFunc(<DashboardPage />),
    type: "protected",
  },
  {
    path: "/profile",
    element: UserLayoutFunc(<ProfilePage />),
    type: "protected",
  },
  {
    path: "/project",
    element: UserLayoutFunc(<ProjectPage />),
    type: "protected",
  },
  {
    path: "/project/:projectName/:projectId",
    element: UserLayoutFunc(<ShowProject />),
    type: "protected",
  },
  {
    path: "/project/:projectId",
    element: UserLayoutFunc(<CreateProject />),
    type: "protected",
  },
  {
    path: "/subscription",
    element: UserLayoutFunc(<SubscriptionPage />),
    type: "protected",
  },
  // {
  //   path: "/subscription/stripe/:planId",
  //   element: UserLayoutFunc(<StripeSubscriptionPayment />),
  //   type: "protected",
  // },
];

export default routes;

// {
//   path: "*",
//   element: <PageNotFound />,
//   type: "unprotected",
// },
