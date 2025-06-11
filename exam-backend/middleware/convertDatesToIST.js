import moment from 'moment-timezone';

const convertDatesToIST = (obj) => {
  for (const key in obj) {
    if (obj[key] instanceof Date) {
      obj[key] = moment(obj[key]).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      convertDatesToIST(obj[key]); // Recursive for nested objects
    }
  }
  return obj;
};

const convertDatesMiddleware = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    convertDatesToIST(data);
    return originalJson.call(this, data);
  };

  next();
};

export default convertDatesMiddleware;