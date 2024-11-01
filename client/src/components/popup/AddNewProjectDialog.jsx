import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createANewProject } from "../../redux/reducers/project.slice";
import { createAProject } from "../../schemas/project/create-project.schema";

export function AddNewProjectDialog({ isOpen, handleOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleReset,
  } = useFormik({
    initialValues: {
      projectName: "",
    },
    validationSchema: createAProject,
    validateOnBlur: false,
    onSubmit: async (values) => {
      dispatch(createANewProject({ values, dispatch, handleOpen, navigate }));
    },
  });

  return (
    <>
      <Dialog
        id="addProject"
        size="xs"
        open={isOpen}
        handler={() => {
          handleOpen();
          handleReset();
        }}
        className="bg-transparent shadow-none"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Typography
                  className="text-center"
                  variant="h4"
                  color="blue-gray"
                >
                  Add new project
                </Typography>
                <div className="hover:bg-[#D3D3D3] rounded-full ]">
                  <IoClose
                    onClick={handleOpen}
                    className="text-gray-9000 m-1 text-xl cursor-pointer"
                  />
                </div>
              </div>
              <Typography className="-mb-1" variant="h6">
                Enter the project name
              </Typography>
              <Input
                label="Project Name"
                size="lg"
                type="text"
                name="projectName"
                id="projectName"
                value={values.projectName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Typography variant="small" color="red">
                {errors.projectName && touched.projectName
                  ? errors.projectName
                  : ""}{" "}
              </Typography>{" "}
            </CardBody>
            <CardFooter className="pt-0">
              <Button className="bg-button-primary" type="submit" variant="filled" fullWidth>
                Create Project
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Dialog>
    </>
  );
}

AddNewProjectDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
};
