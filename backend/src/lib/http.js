// Bọc controller async để lỗi tự chuyển sang error handler
exports.wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.httpErr = (status, message) => Object.assign(new Error(message), { status });
