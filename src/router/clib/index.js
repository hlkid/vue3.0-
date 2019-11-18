import seatRouter from "./seat.js" //座位管理
import integralRouter from "./integral.js" //积分管理
import spaceRouter from "./space.js" //空间管理
import deviceRouter from "./device.js"// 设备管理
import bookRouter from "./book.js" // 图书管理


export default [
  ...seatRouter,
  ...integralRouter,
  ...spaceRouter,
  ...deviceRouter,
  ...bookRouter,
]
