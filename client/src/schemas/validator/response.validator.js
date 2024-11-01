import * as Yup from "yup";

export const ResponseValidator = async ({ code, message }) => {
  const validator = Yup.object().shape({
    code: Yup.number(),
    message: Yup.string(),
    result: Yup.object(),
  });
  try {
    return await validator.isValid({
      code: code,
      message: message,
    });
    // return validate
  } catch (err) {
    console.log(err);
  }
};

// export const ResponseValidator = async ({ result }) => {
//   const validator = Yup.object().shape({
//     result: Yup.object(),
//   });
//   try {
//     return await validator.isValid({
//       result,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
