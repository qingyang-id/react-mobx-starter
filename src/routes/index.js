/**
 * @description 路由入口 todo暂时未调通，后期再尝试
 * @author yq
 * @date 2017/5/6 下午2:16
 */
import Login from '../components/Login';
import Home from '../components/Home';
import List from '../components/page/List';
import Detail from '../components/page/Detail';

/*  Note: Instead of using JSX, we recommend using react-router
 PlainRoute objects to build route definitions.   */

const routeConfig = [{
  path: '/',
  component: Home,
  routes: [
    {
      path: '/page',
      component: List,
      routes: [{
        path: '/page/:id',
        component: Detail
      }]
    },
    {
      path: '/login',
      component: Login
    }
  ]
}];

export default routeConfig;
