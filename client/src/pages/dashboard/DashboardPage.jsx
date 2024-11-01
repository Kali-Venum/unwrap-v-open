import { RiFileSearchFill } from "react-icons/ri";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProjectsCount } from "../../redux/reducers/dashboard.slice";
import { useNavigate } from "react-router-dom";
import { GiFilmProjector } from "react-icons/gi";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardData, isFetchingDashboardData } = useSelector(
    (state) => state.dashboardReducer
  );

  useEffect(() => {
    dispatch(getProjectsCount());
  }, []);

  return (
    <div className="ml-2">
      {isFetchingDashboardData ? (
        <div className="h-96 flex justify-center items-center">
          <div className="w-9 mx-auto h-9 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        </div>
      ) : (
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card
            className="border border-blue-gray-100 shadow-sm cursor-pointer"
            onClick={() => {
              navigate("/project");
            }}
          >
            <CardHeader
              variant="gradient"
              floated={false}
              shadow={false}
              className="absolute grid h-12 w-12 place-items-center"
            >
              <GiFilmProjector className="text-3xl text-button-primary" />
            </CardHeader>
            <CardBody className="p-4 text-right">
              <Typography
                variant="small"
                className="font-normal text-blue-gray-600"
              >
                Total Projects
              </Typography>
              <Typography variant="h4" color="blue-gray">
                {dashboardData?.totalProjects}
              </Typography>
            </CardBody>
          </Card>
          {/* <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            variant="gradient"
            floated={false}
            shadow={false}
            className="absolute grid h-12 w-12 place-items-center"
          >
            <RiFileSearchFill className="text-3xl text-button-primary" />
          </CardHeader>
          <CardBody className="p-4 text-right">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              Total Visitors
            </Typography>
            <Typography variant="h4" color="blue-gray">
              20000
            </Typography>
          </CardBody>
        </Card> */}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
