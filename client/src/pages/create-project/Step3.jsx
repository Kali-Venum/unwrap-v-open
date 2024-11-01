import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Step3 = ({ projectId ,projectDetails, userData , tempData,}) => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(5);
 



  useEffect(() => {
    localStorage.removeItem("selectedModel");
    localStorage.removeItem("imagePreview");
    const interval = setInterval(() => {
      setCounter(counter - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    let setTimer;
    setTimer = setTimeout(() => {
      navigate("/project");
    }, 5000);

    return () => {
      clearTimeout(setTimer);
    };
  }, []);

  return (
    <div className="min-h-[300px] h-full w-full flex flex-col items-center justify-center">
      <span>
        <div className="w-14 mx-auto h-14 border-8 border-dashed rounded-full animate-spin border-primary"></div>
        <h6 className="mt-4">
          {!projectDetails?.aiGeneratedImages
            ? `Generating image data, please wait... ${counter}`
            : ""}
        </h6>
      </span>
    </div>
  );
};

export default Step3;

Step3.propTypes = {
  projectId: PropTypes.string,
  userData: PropTypes.object.isRequired,
  projectDetails: PropTypes.object.isRequired,
};
