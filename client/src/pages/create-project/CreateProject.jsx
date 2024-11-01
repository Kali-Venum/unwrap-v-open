import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import http from "../../services/api/http";
import { Step, Stepper, Typography } from "@material-tailwind/react";
import Step3 from "./Step3";

const CreateProject = () => {
  const params = useParams();

  const [curretStep, setCurrentStep] = useState(0);
  const [projectDetails, setProjectDetails] = useState(null);
  const [userData, setUserData] = useState({});
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempData, setTempData] = useState({
    modelImageURL : "",
    clothImageURL : ""
  }); // use to store steps data locally
  const { projectId } = params;

  

  const getCurrentStep = () => {
    switch (curretStep) {
      case 0:
        return (
          <Step1
            projectId={projectId}
            projectDetails={projectDetails}
            userData={userData}
            onNext={() => !isLastStep && setCurrentStep((cur) => cur + 1)}
            setProjectDetails={setProjectDetails}
            tempData={tempData}
            setTempData={setTempData}
          />
        );
      case 1:
        return (
          <Step2
            projectId={projectId}
            projectDetails={projectDetails}
            userData={userData}
            onNext={() => !isLastStep && setCurrentStep((cur) => cur + 1)}
            onPrevious={() => !isFirstStep && setCurrentStep((cur) => cur - 1)}
            tempData={tempData}
            setTempData={setTempData}
          />
        );
      case 2:
        return (
          <Step3
            projectId={projectId}
            projectDetails={projectDetails}
            userData={userData}
          />
        );
      default:
        break;
    }
  };

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    const response = await http.get(`/project/get/${projectId}`);
    if (response?.result?.data) {
      setProjectDetails(response.result.data);
      // setCurrentStep(response.result.data.step - 1);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUserData(loggedUser);
  }, []);

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  return (
    <div className=" w-full md:w-[80%] mx-auto">
      {isLoading ? (
        <div className="w-9 mx-auto h-9 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      ) : (
        <div className="md:p-4 lg:p-2 sm:px-[20px] p-[10px] rounded-lg">
          <h1 className="text-xl text-center font-bold text-gray-800 mb-4">
            {projectDetails?.projectName}
          </h1>
          <div className="relative">
            <Stepper
              activeLineClassName="bg-primary"
              activeStep={curretStep}
              isLastStep={(value) => setIsLastStep(value)}
              isFirstStep={(value) => setIsFirstStep(value)}
            >
              <Step
                activeClassName="ring-0 bg-primary text-white"
                completedClassName="bg-primary text-white"
              >
                1
                <div className="absolute -bottom-[2rem] w-max text-center">
                  <Typography
                    className="text-sm"
                    variant="h6"
                    color={curretStep === 0 ? "blue-gray" : "gray"}
                  >
                    Select Model
                  </Typography>
                </div>
              </Step>
              <Step
                activeClassName="ring-0 bg-primary text-white"
                completedClassName="bg-primary text-white"
              >
                2
                <div className="absolute -bottom-[2rem] w-max text-center">
                  <Typography
                    className="text-sm"
                    variant="h6"
                    color={curretStep === 1 ? "blue-gray" : "gray"}
                  >
                    Upload Garments
                  </Typography>
                </div>
              </Step>
              <Step
                activeClassName="ring-0 bg-primary text-white"
                completedClassName="bg-primary text-white"
              >
                3{" "}
                <div className="absolute -bottom-[2rem] w-max text-center">
                  <Typography
                    className="text-sm"
                    variant="h6"
                    color={curretStep === 2 ? "blue-gray" : "gray"}
                  >
                    Generate Images
                  </Typography>
                </div>
              </Step>
            </Stepper>
          </div>
          <div className="mt-10">{getCurrentStep()}</div>
          {/* <div className="mt-32 flex justify-between">
          <Button onClick={handleNext} disabled={isLastStep}>
            Next
          </Button>
        </div> */}
        </div>
      )}
    </div>
  );
};

export default CreateProject;
