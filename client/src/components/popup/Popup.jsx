import React from "react";
import SubmitButton from "../buttons/SubmitButton";
import { IoClose } from "react-icons/io5";
import { useFormik } from "formik";
import { createAProject } from "../../schemas/project/create-project.schema";
import { useDispatch } from "react-redux";
import { createANewProject } from "../../redux/reducers/project.slice";
import { useNavigate, useLocation } from "react-router-dom";

export function Popup({ handlePopUp }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        projectName: "",
      },
      validationSchema: createAProject,
      onSubmit: async (values, action) => {
        dispatch(createANewProject({ values, dispatch, handlePopUp, navigate }));
      },
    });

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div className="bg-white-color shadow-lg rounded-lg w-80 md:w-96">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Enter the project name
          </h1>
          <div className="hover:bg-[#D3D3D3] rounded-full ]">
            <IoClose onClick={handlePopUp} className="text-gray-400 m-1  cursor-pointer" />
          </div>
        </div>
        <hr className="border-base-color" />
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="projectName"
                id="projectName"
                value={values.projectName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Project Name"
                className="w-full rounded-md  outline-none  border-b-[1px]  px-3 py-2"
              />
              {touched.projectName && errors.projectName && (
                <div className="text-red-500 text-sm mt-1">{errors.projectName}</div>
              )}
            </div>
            <div className="flex justify-center">
              <SubmitButton buttonText="Create Project" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
