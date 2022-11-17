const promisify = (fn, thisArg = module.exports) => {
  return (...rest) => {
    return new Promise((resolve, reject) => {
      fn.call(thisArg, ...rest, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
};
exports.promisify = promisify;

// let query = promisify(db.query)
// query("select * from a", {}).then(res = xxx)

// [1, 3]
// [1,2,3,4,5].slice(...[1, 3]),

// let throttle = (arg, timeout) => {
//   let flag = false;
//   return () => {
//     if (flag === false) {
//       arg();
//       flag = true;
//       setTimeout(() => {
//         flag = false;
//       }, timeout);
//     }
//   };
// };
