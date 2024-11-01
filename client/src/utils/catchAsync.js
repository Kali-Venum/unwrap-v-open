/**
 *
 * @param {Function} fn
 * @returns {Response | Error}
 */
const catchAsync =
  (fn) =>
  (...rest) =>
    fn(...rest).catch((error) =>
      error.response ? error.response.data : error
    );

export default catchAsync;
