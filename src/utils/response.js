// utils/response.js

const successResponse = (
  res,
  { statusCode = 200, message = "Success", data } = {}
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export { successResponse };

