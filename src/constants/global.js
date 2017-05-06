/**
 * @description 全局常量
 * @author yq
 * @date 2017/5/6 上午9:36
 */
const globalConstants = {};
if (process.env.NODE_ENV === 'production') {
  Object.defineProperties(globalConstants, {
    API_URL: {
      value: 'http://production-path',
      writable: false
    }
  });
} else if (process.env.NODE_ENV === 'test') {
  Object.defineProperties(globalConstants, {
    API_URL: {
      value: 'http://test-path',
      writable: false
    }
  });
} else {
  Object.defineProperties(globalConstants, {
    API_URL: {
      value: 'http://localhost:3000',
      writable: false
    }
  });
}

export default globalConstants;
