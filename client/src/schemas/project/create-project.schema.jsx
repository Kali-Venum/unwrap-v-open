import * as Yup from "yup";

export const createAProject = Yup.object().shape({
  projectName: Yup.string().required("Please enter a project name."),
});
