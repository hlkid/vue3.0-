import activityRouter from "./activity.js"
import bannerRouter from "./banner.js"
import commentRouter from "./comment.js"
import informationRouter from "./information.js"
import liveRouter from "./live.js"
import themeRouter from "./theme.js"
import tidingsRouter from "./tidings";
import worksRouter from "./works.js"
import basicsRouter from "./basics.js"
import appreciativeRouter from "./appreciative.js"
import inheritanceRouter from "./inheritance.js"
import teacherMangeRouter from "./teacherMange.js"

export default [
  ...activityRouter,
  ...bannerRouter,
  ...commentRouter,
  ...informationRouter,
  ...liveRouter,
  ...themeRouter,
  ...tidingsRouter,
  ...worksRouter,
  ...basicsRouter,
  ...appreciativeRouter,
  ...inheritanceRouter,
  ...teacherMangeRouter,
]
