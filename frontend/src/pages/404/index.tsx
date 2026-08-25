import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@store/user.store';
import { UserRole } from '@types/user.types';

/**
 * 404 页面
 * 页面未找到时显示
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useUserStore();

  // 根据登录状态和角色决定返回首页的路径
  const getHomePath = () => {
    if (!isLoggedIn) {
      return '/login';
    }
    if (userInfo?.role === UserRole.EMPLOYER) {
      return '/employer/jobs';
    }
    return '/';
  };

  const getHomeText = () => {
    if (!isLoggedIn) {
      return '去登录';
    }
    if (userInfo?.role === UserRole.EMPLOYER) {
      return '返回企业首页';
    }
    return '返回首页';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button onClick={() => navigate(-1)}>
              返回上一页
            </Button>
            <Button type="primary" onClick={() => navigate(getHomePath())}>
              {getHomeText()}
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default NotFoundPage;
