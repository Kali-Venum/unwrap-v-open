import { useRef, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import JSZip from "jszip";
import { IoCloseCircle } from "react-icons/io5";
import http from "../../services/api/http";

const Step2 = ({
  projectId,
  userData,
  projectDetails,
  onNext,
  onPrevious,
  tempData,
  setTempData,
}) => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // Image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }

    inputFile.current.value = null;
    return false;
  };

  const uploadDataOnAWS = async () => {
    if (!selectedFile) return;

    try {
      // Check if selected file is a zip file
      if (selectedFile.type === "application/zip") {
        const zip = new JSZip();
        const zipData = await zip.loadAsync(selectedFile);
        const fileNames = Object.keys(zipData.files);

        const imageUploadPromises = fileNames.map(async (fileName) => {
          const fileData = await zipData.files[fileName].async("blob");
          const formData = new FormData();
          formData.append("image", fileData, fileName);
          formData.append(
            "path",
            `${userData.firstName}${userData.lastName}-${userData._id}/${projectDetails.projectName}-${projectId}/productImage/`
          );
          const response = await http.post("/image/upload", formData);
          return response?.result?.data?.Location;
        });

        const imageUrls = await Promise.all(imageUploadPromises);
        const modelImageURL = tempData.modelImageURL || "";

        // Update database with image URLs
        const updateData = await http.patch("/project/update", {
          projectId,
          modelImagePath: modelImageURL,
          productImagePath: imageUrls,
        });

        if (updateData?.result) {
          console.log("Data updated successfully");
        }
      } else {
        // Handle single image file upload
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append(
          "path",
          `${userData.firstName}${userData.lastName}-${userData._id}/${projectDetails.projectName}-${projectId}/productImage/ `
        );

        const response = await http.post("/image/upload", formData);

        if (response?.result) {
          const image = response.result.data.Location;
          const modelImageURL = tempData.modelImageURL || "";

          // Update database with image URL
          const updateData = await http.patch("/project/update", {
            projectId,
            modelImagePath: modelImageURL,
            productImagePath: image,
          });

          if (updateData?.result) {
            console.log("Data updated successfully");
          }
        }
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const onNextClick = async () => {
    await uploadDataOnAWS();
    onNext();
  };

  const convertToImgURL = (file) => {
    if (file) {
      return URL.createObjectURL(file);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-between mt-12">
        <div className="flex items-center justify-between gap-4 w-[100%] lg:w-[80%] ">
          <div className="md:w-52 md:h-80 ">
            {tempData?.modelImageURL && (
              <img
                src={
                  typeof tempData?.modelImageURL === "object"
                    ? convertToImgURL(tempData?.modelImageURL)
                    : tempData?.modelImageURL
                }
                alt="Preview"
                className="md:w-40 sm:w-36 sm:min-h-64 md:h-80 mx-auto rounded-md object-contain"
              />
            )}
            <Typography
              as="caption"
              variant="small"
              className="mt-2 text-center font-medium"
            >
              Model Image
            </Typography>
          </div>
          {!imagePreview && (
            <Button
              onClick={() => {
                inputFile.current.value = null;
                inputFile.current.click();
              }}
              className="mr-4 md:px-4 md:py-2 sm:px-3 sm:py-1 md:text-[14px] sm:text-[12px] mt-4 rounded-lg text-sm font-semibold bg-button-primary"
            >
              Upload Garment
            </Button>
          )}
          <div className="mt-2 ">
            {imagePreview && selectedFile?.type !== "application/zip" ? (
              <div className="relative ">
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="md:w-40 sm:w-36 sm:min-h-64 md:h-80 mx-auto rounded-md object-contain"
                  />

                  <Typography
                    as="caption"
                    variant="small"
                    className="mt-2 text-center font-medium"
                  >
                    Garment Image
                  </Typography>
                </>
                <IoCloseCircle
                  onClick={() => {
                    setImagePreview("");
                    setSelectedFile({
                      file: null,
                    });
                  }}
                  className="text-2xl rounded-full absolute bg-white cursor-pointer top-2 -right-2"
                />
              </div>
            ) : (
              selectedFile?.type === "application/zip" && (
                <div className="relative ">
                  <>
                    <img
                      src="/static/zip-svg-img.svg"
                      alt="Preview"
                      className="md:w-40 sm:w-36 sm:min-h-64 md:h-80 mx-auto rounded-md object-contain"
                    />

                    <Typography
                      as="caption"
                      variant="small"
                      className="mt-2 text-center font-medium"
                    >
                      Garment Image
                    </Typography>
                  </>
                  <IoCloseCircle
                    onClick={() => {
                      setImagePreview("");
                      setSelectedFile({
                        file: null,
                      });
                    }}
                    className="text-2xl rounded-full absolute bg-white cursor-pointer top-2 -right-2"
                  />
                </div>
              )
            )}
          </div>
        </div>

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
      </div>
      <div className="text-end mt-8 flex justify-between">
        <Button
          type="button"
          onClick={onPrevious}
          className="text-[#fff] py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          style={{
            backgroundImage: "linear-gradient(90deg, #4FACFE, #00F2FE)",
          }}
        >
          Previous
        </Button>
        <Button
          disabled={!selectedFile}
          type="button"
          onClick={onNextClick}
          className="text-[#fff] py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          style={{
            backgroundImage: "linear-gradient(90deg, #4FACFE, #00F2FE)",
          }}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Step2;

Step2.propTypes = {
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  projectId: PropTypes.string,
  userData: PropTypes.object.isRequired,
  projectDetails: PropTypes.object.isRequired,
};
