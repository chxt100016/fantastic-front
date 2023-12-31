import { createRouter,createWebHashHistory} from "vue-router";



const project = () => import("../page/Project")
const hello = () => import("../page/HelloWorld")
const projectGroup = () => import("../page/ProjectGroup")
const missionGroup = () => import("../page/MissionGroup")
const mindMap = () => import("../page/MindMap")
const frame = () => import("../page/Frame")
const overview = () => import("../page/Overview")
const fileSystem = () => import("../page/FileSystem")
const spring = () => import("../page/spring/Spring.vue")

const springboot = () => import("../page/spring/Springboot.vue")
const dashboard = () => import("../page/Dashboard")



const routes = [
  { path: '/', redirect: "/project-group" },
  { path: '/project/:id', component: project },
  { path: '/hello', component: hello },
  { path: '/project-group', component: projectGroup },
  { path: '/mission-group', component: missionGroup },
  { path: '/mind-map', component: mindMap },
  { path: '/frame/:type', component: frame },
  { path: '/overview', component: overview },
  { path: '/fileSystem', component: fileSystem },
  { path: '/spring', component: spring},
  { path: '/springboot', component: springboot},
  { path: '/dashboard', component: dashboard},
]

export const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})
