import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { getAllModels } from "../../redux/reducers/project.slice";
import { Button, Option, Select } from "@material-tailwind/react";
import { IoCheckmark, IoCloseCircle } from "react-icons/io5";
// import http from "../../services/api/http";

const Step1 = ({
  onNext,
  userData,
  projectDetails,
  setProjectDetails,
  tempData,
  setTempData,
}) => {
  const params = useParams();
  const dispatch = useDispatch();
  const inputFile = useRef(null);

  const { models } = useSelector((state) => state.projectReducer);

  // const [modelGender, setModelGender] = useState("all");
  // const [modelRace, setModelRace] = useState("all");
  // const [selectedModel, setSelectedModel] = useState("");

  //Collect the data of this step into this state
  const [formData, setFormData] = useState({
    selectedModel: "",
    selectedFile: null,
    imagePreview: "",
    modelGender: "all",
    modelRace: "all",
  });

  const { projectId } = params;

  // const [selectedFile, setSelectedFile] = useState({
  //   file: null,
  // });
  // const [imagePreview, setImagePreview] = useState("");

  const handleFileChange = async (e) => {
    // const file = e.target.files[0];
    // setSelectedFile((prevState) => ({
    //   ...prevState,
    //   file: file,
    // }));

    // // Image preview
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setImagePreview(reader.result);
    //   };
    //   reader.readAsDataURL(file);
    // } else {
    //   setImagePreview("");
    // }
    // setSelectedModel("");
    const file = e.target.files[0];
    const imagePreview = URL.createObjectURL(file);
    setFormData((prevData) => ({
      ...prevData,
      selectedFile: file,
      imagePreview: imagePreview,
      selectedModel: "", // Clear selected model when a new file is selected
    }));
    localStorage.setItem("imagePreview", imagePreview);
    localStorage.removeItem("selectedModel");
  };

  useEffect(() => {
    const savedImage = localStorage.getItem("imagePreview");
    const savedModel = localStorage.getItem("selectedModel");
    if (savedImage) {
      setFormData((prevData) => ({
        ...prevData,
        selectedFile: savedImage,
        imagePreview: savedImage,
        selectedModel: "", // Clear selected model when a new file is selected
      }));
    } else if (savedModel) {
      setFormData((prevData) => ({
        ...prevData,
        selectedFile: "",
        imagePreview: "", // Clear selected image when a new model is selected
        selectedModel: savedModel,
      }));
    } else {
      setFormData({
        selectedModel: "",
        selectedFile: null,
        imagePreview: "",
        modelGender: "all",
        modelRace: "all",
      });
      localStorage.removeItem("selectedModel");
      localStorage.removeItem("imagePreview");
    }

  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData); // You can do something with the collected data here
  };

  const onNextClick = async () => {
    // will store in state locally
    // console.log("formData",formData);
    let updatedModelImageURL = "";
    if (formData.selectedFile) {
      updatedModelImageURL = formData.selectedFile;
    } else {
      updatedModelImageURL = formData.selectedModel;
    }
    setTempData({
      ...tempData,
      modelImageURL: updatedModelImageURL,
    });
    onNext();
    // if (selectedFile.file !== null) {
    //   const formData = new FormData();
    //   formData.append("image", selectedFile.file);
    //   formData.append(
    //     "path",
    //     `${userData.firstName}${userData.lastName}-${userData._id}/${projectDetails.projectName}-${projectId}/modelImage/`
    //   );
    //   try {
    //     const response = await http.post("/image/upload", formData);
    //     if (response?.result) {
    //       image = response.result.data.Location;
    //     }
    //   } catch (error) {
    //     console.log("errr", error);
    //   }
    // } else {
    //   const findSelected = models.find((d) => d._id === selectedModel);
    //   if (findSelected.modelImage) {
    //     image = findSelected.modelImage;
    //   }
    // }
    // if (image) {
    //   const updateData = await http.patch("/project/update", {
    //     projectId,
    //     path: image,
    //   });
    //   if (updateData?.result) {
    //     onNext();
    //     setProjectDetails(updateData?.result?.data);
    //   }
    // }
  };

  const modelsImageFetchHandler = () => {
    const data = {
      modelGender: formData.modelGender,
      modelRace: formData.modelRace,
    };

    dispatch(getAllModels(data));
  };

  useEffect(() => {
    modelsImageFetchHandler();
  }, [formData.modelGender, formData.modelRace]);

  useEffect(() => {
    const data = {
      modelGender: formData.modelGender,
      modelRace: formData.modelRace,
    };
    dispatch(getAllModels(data));
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center my-4">
          <input
            ref={inputFile}
            id="file"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file"
            className=" text-white hidden py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Choose File
          </label>
          {formData.imagePreview && (
            <div className="relative my-5 w-50 max-h-60 ">
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="ml-4 max-h-full  rounded-md object-cover"
              />
              <IoCloseCircle
                onClick={() => {
                  setFormData((prevData) => ({
                    ...prevData,
                    imagePreview: "",
                    selectedFile: null,
                  }));
                }}
                className="text-2xl rounded-full absolute bg-white cursor-pointer -top-2 -right-2"
              />
            </div>
          )}
          {!formData.imagePreview && (
            <Button
              disabled={formData.selectedModel}
              onClick={() => {
                inputFile.current.value = null;
                inputFile.current.click();
              }}
              className="mr-4 my-5 px-4 py-2 rounded-lgtext-sm font-semibold bg-button-primary"
            >
              Upload your Model
            </Button>
          )}
        </div>
        <h1 className=" mt-5 text-xl font-semibold text-[#555555]">
          Or you can choose model from our store
        </h1>
        <div
          className={`${
            formData.selectedFile ? "bg-gray-500 opacity-60" : ""
          } mt-5 border border-[#999999] p-4 rounded-lg`}
        >
          <div className="flex justify-evenly sm:flex-col">
            <Select
              disabled={!!formData.selectedFile}
              name="model"
              onChange={(value) =>
                setFormData((prevData) => ({ ...prevData, modelGender: value }))
              }
              label="Choose gender"
              value={formData.modelGender}
            >
              <Option value="all">All</Option>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>

            <div className="mt-4">
              <Select
                disabled={!!formData.selectedFile}
                name="model"
                onChange={(value) =>
                  setFormData((prevData) => ({ ...prevData, modelRace: value }))
                }
                label="Choose skin tone"
                value={formData.modelRace}
              >
                <Option value="all">All</Option>
                <Option value="white">White</Option>
                <Option value="brown">Brown</Option>
                <Option value="dark">Dark</Option>
              </Select>
            </div>
          </div>
          <div
            className={`modelImagesSection mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-[580px] overflow-x-auto pe-2`}
          >
            {models?.map((item) => (
              <div
                className="relative"
                onClick={() => {
                  if (!formData.selectedFile) {
                    setFormData((prevData) => ({
                      ...prevData,
                      selectedModel:
                        prevData.selectedModel === item.modelImage
                          ? ""
                          : item.modelImage,
                    }));
                    localStorage.setItem("selectedModel", item.modelImage);
                    localStorage.removeItem("imagePreview");
                  }
                }}
                key={item._id}
              >
                {formData.selectedModel === item.modelImage && (
                  <div className="absolute rounded-lg bg-blue-700 text-white">
                    <IoCheckmark />
                  </div>
                )}
                <img src={item.modelImage} alt="" style={{ width: 150 }} />
              </div>
            ))}
          </div>
          {/* <div className="mt-5">
              <div className="flex overflow-hidden gap-5 overflow-x-auto p-3">
                {models?.map((item) => (
                  <img
                    src={item.modelImage}
                    key={item._id}
                    alt=""
                    style={{ width: 150 }}
                  />
                ))}
              </div>
            </div> */}
        </div>
        <div className="text-end mt-8">
          <Button
            type="button"
            disabled={!(formData.selectedFile || formData.selectedModel)}
            onClick={onNextClick}
            className="text-[#fff] py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            style={{
              backgroundImage: "linear-gradient(90deg, #4FACFE, #00F2FE)",
            }}
          >
            Next
          </Button>
        </div>
      </form>
    </>
  );
};

Step1.propTypes = {
  onNext: PropTypes.func,
  userData: PropTypes.object.isRequired,
  setProjectDetails: PropTypes.func,
};

export default Step1;
