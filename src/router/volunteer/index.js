import  groupRouter  from './group.js'
import volunteerRouter  from './volunteer.js'
import recruitmentRouter  from './recruitment.js'
export default [
  ...groupRouter,
  ...volunteerRouter,
  ...recruitmentRouter
]
