export const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json({
        status_code: statusCode,
        data: data,
    });
};
  