import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card } from "@material-tailwind/react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { IoCheckmarkCircle } from "react-icons/io5";
import http from "../../services/api/http";

const ShowProject = () => {
  const { projectName, projectId } = useParams();
  const [allImages, setAllImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleImageSelection = (index) => {
    if (selectedImages.includes(index)) {
      setSelectedImages(selectedImages.filter((i) => i !== index));
    } else {
      setSelectedImages([...selectedImages, index]);
    }
  };

  const handleDownloadAll = () => {
    if (selectedImages.length > 0) {
      return;
    }
    if (allImages.length === 0) {
      return;
    }

    const downloadName = window.prompt(
      "Enter the file name:",
      "all_images.zip"
    );
    if (!downloadName) {
      // User cancelled or provided empty input, return early
      return;
    }
    const zip = new JSZip();

    allImages.forEach((img, index) => {
      fetch(img)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(`image_${index + 1}.jpg`, blob);

          if (index === allImages.length - 1) {
            zip.generateAsync({ type: "blob" }).then((content) => {
              const blobUrl = URL.createObjectURL(content);

              const anchor = document.createElement("a");
              anchor.href = blobUrl;

              anchor.setAttribute("download", "all_images.zip");

              anchor.click();

              URL.revokeObjectURL(blobUrl);
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    });
  };

  const handleDownloadSelected = () => {
    if (selectedImages.length === 0) {
      return;
    }
    if (allImages.length === 0) {
      return;
    }
    const zip = new JSZip();
    const promises = [];

    selectedImages.forEach((index) => {
      const img = allImages[index];
      const promise = fetch(img)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(`image_${index}.jpg`, blob);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
      promises.push(promise);
    });

    // Wait for all image fetch requests to complete
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        const fileName = window.prompt(
          "Enter file name:",
          "selected_images.zip"
        );
        if (fileName) {
          saveAs(content, fileName);
        }
      });
    });
  };
  const handleShowImg = async (projectId) => {
    try {
      setIsLoading(true);
      const response = await http.get(`/project/get/${projectId}`);
      if (response) {
        setAllImages(response?.result?.data?.finalImages);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleShowImg(projectId);
  }, []);

  return (
    <div className="mb-2 h-[70vh]">
      <h1 className="text-center text-2xl mb-5 text-gray-800 font-semibold p-1">
        {projectName}
      </h1>
      <Card className="p-5 h-[90%] w-full overflow-hidden overflow-y-auto flex items-center justify-center">
        {allImages?.length > 0 ? (
          <div className="grid h-full lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 ">
            {allImages.length > 0 && !isLoading
              ? allImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      className={`sm:h-64 h-48 w-48 sm:w-full rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50 cursor-pointer ${
                        selectedImages.includes(index) ? "opacity-80" : ""
                      }`}
                      src={img}
                      alt={`Image ${index + 1}`}
                      onClick={() => toggleImageSelection(index)}
                    />
                    {selectedImages.includes(index) && (
                      <h2
                        onClick={() => toggleImageSelection(index)}
                        className="absolute inset-0 flex justify-start p-1 text-center text-base-color z-50"
                      >
                        <IoCheckmarkCircle size={23} />
                      </h2>
                    )}
                  </div>
                ))
              : null}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            {isLoading ? (
              <div className="w-9 h-9 border-4 border-dashed rounded-full animate-spin border-primary"></div>
            ) : (
              <div className="text-center text-gray-800 font-semibold p-1">
                NO GENERATED IMAGES
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-center mt-7 mb-2">
        <div className="flex items-center gap-4">
          <Button
            disabled={!selectedImages.length}
            onClick={handleDownloadSelected}
            className="bg-primary"
          >
            Download
          </Button>
          <Button
            disabled={selectedImages.length || !allImages.length}
            onClick={handleDownloadAll}
          >
            Download All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShowProject;
