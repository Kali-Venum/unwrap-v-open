import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjectsOfAUser } from "../../redux/reducers/project.slice";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import ReactPaginate from "react-paginate";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { AddNewProjectDialog } from "../../components/popup/AddNewProjectDialog";
import { IoAddCircleSharp, IoClose, IoTrash } from "react-icons/io5";
import { Link } from "react-router-dom";
import http from "../../services/api/http";
import { toast } from "react-toastify";
import JSZip from "jszip";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const [showPopUp, setShowPopUp] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const {
    isFetchingProjects,
    projects,
    totalDataCount,
    pageNumber,
    dataPerPage,
  } = useSelector((state) => state.projectReducer);

  const handlePopUp = () => {
    setShowPopUp((pre) => !pre);
  };
  useEffect(() => {
    localStorage.removeItem("selectedModel");
    localStorage.removeItem("imagePreview");
    console.log(projects, "projects");
  });
  const deleteProject = async () => {
    try {
      const response = await http.delete(
        `/project/delete/${selectedProject?._id}`
      );
      if (response.serverResponse?.code === 200) {
        toast.success("Project deleted successfully");
        dispatch(
          getAllProjectsOfAUser({ pageNumber: pageNumber, dataPerPage: 8 })
        );
        setShowDeletePopup((pre) => !pre);
      }
    } catch (error) {
      toast.error("Facing some issue");
    }
  };

  const handleDeletePopUp = () => {
    setShowDeletePopup((pre) => !pre);
  };

  const handlePageClick = (page) => {
    dispatch(
      getAllProjectsOfAUser({ pageNumber: page.selected + 1, dataPerPage: 8 })
    );
  };

  // // will be dynamic once API done
  // const images = [
  //   "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
  //   "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
  //   "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
  //   "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
  //   "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
  //   "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
  // ];

  const handleDownloadAll = async (projectId) => {
    try {
      const response = await http.get(`/project/get/${projectId}`);
      if (response) {
        setAllImages(response?.result?.data?.finalImages);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (allImages.length > 0) {
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
    }
  }, [allImages]);

  useEffect(() => {
    dispatch(getAllProjectsOfAUser({ pageNumber: 1, dataPerPage: 8 }));
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-col z-0 ">
        <section className="is-hero-bar">
          <div className="flex flex-col md:flex-row items-center justify-end space-y-6 md:space-y-0">
            <div className="flex justify-end items-center ">
              <Button
                className="flex items-center gap-2 bg-button-primary"
                onClick={handlePopUp}
              >
                <IoAddCircleSharp className="text-lg" />
                <span className="align-middle leading-normal text-md">
                  Add New
                </span>
              </Button>
            </div>
          </div>
        </section>
        {projects.length && !isFetchingProjects ? (
          <>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <Card
                  className="shadow-md hover:shadow-lg pb-4 justify-between"
                  key={project._id}
                  color="transparent"
                  shadow={false}
                >
                  <Link
                    to={`${
                      project.userAddedImages === true
                        ? `/project/${project?.projectName}/${project?._id}`
                        : `/project/${project?._id}`
                    }`}
                  >
                    <CardHeader
                      floated={false}
                      color="gray"
                      className="mx-0 mt-0 mb-2 h-64 xl:h-40 rounded-b-none bg-base-color"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80"
                        alt={project.projectName}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                  </Link>
                  <CardBody className="py-0 px-2">
                    <Typography
                      variant="h5"
                      color="blue-gray"
                      className="mt-1 mb-2"
                    >
                      {project.projectName}
                    </Typography>
                  </CardBody>
                  <CardFooter className="mt-4 flex items-center justify-between py-0 px-2 w-full">
                    <Button
                      className="border-button-primary text-button-primary"
                      variant="outlined"
                      size="sm"
                      onClick={() => {
                        handleDownloadAll(project._id);
                      }}
                    >
                      Download All
                    </Button>
                    <IoTrash
                      onClick={() => {
                        setSelectedProject(project);
                        setShowDeletePopup(true);
                      }}
                      className="text-xl text-red-500 cursor-pointer me-2"
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className=" mt-6 flex justify-center items-center mb-3">
              <ReactPaginate
                containerClassName="flex justify-center items-center text-xl"
                breakLabel="..."
                nextLabel={<GrFormNext />}
                previousLabel={<GrFormPrevious />}
                forcePage={pageNumber - 1}
                onPageChange={handlePageClick}
                pageRangeDisplayed={1}
                pageCount={Math.ceil(totalDataCount / dataPerPage)}
                renderOnZeroPageCount={null}
                pageClassName={"mx-2"}
                activeClassName="text-white text-center font-bold bg-primary px-3 py-1 gap-3 rounded-full"
              />
            </div>
          </>
        ) : (
          <div className="h-96 flex justify-center items-center">
            {isFetchingProjects ? (
              <div className="w-9 mx-auto h-9 border-4 border-dashed rounded-full animate-spin border-primary"></div>
            ) : (
              <h3>No projects found</h3>
            )}
          </div>
        )}
      </div>
      <AddNewProjectDialog isOpen={showPopUp} handleOpen={handlePopUp} />
      <Dialog open={showDeletePopup} handler={handleDeletePopUp}>
        <DialogHeader className="flex justify-between">
          <div>Delete Project </div>
          <div className="hover:bg-[#D3D3D3] rounded-full ]">
            <IoClose
              onClick={handleDeletePopUp}
              className="text-gray-9000 m-1 text-xl cursor-pointer"
            />
          </div>
        </DialogHeader>
        <DialogBody>
          Are you sure you want to delete {selectedProject?.projectName} ?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outlined"
            color="red"
            onClick={handleDeletePopUp}
            className="mr-1"
          >
            <span>No</span>
          </Button>
          <Button
            variant="outlined"
            className="border-primary text-primary"
            onClick={deleteProject}
          >
            <span>Yes</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ProjectPage;
