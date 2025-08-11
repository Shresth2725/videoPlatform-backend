// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const asyncHandler = (requestHandler) => async (req, res, next) => {
  Promise.resolve(requestHandler(req, res)).catch((err) => next(err));
};

export { asyncHandler };
