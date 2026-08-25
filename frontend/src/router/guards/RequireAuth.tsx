import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@store/user.store';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';

/**
 * 登录守卫组件
 * 检查用户是否已登录，未登录则跳转到登录页
 */
interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isLoggedIn, token, fetchUserInfo } = useUserStore();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 如果有 token 但没有用户信息，尝试获取用户信息
    if (token && !isLoggedIn) {
      fetchUserInfo().finally(() => {
        setChecking(false);
      });
    } else {
      setChecking(false);
    }
  }, [token, isLoggedIn, fetchUserInfo]);

  if (checking) {
    // 正在检查登录状态，显示加载中
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!isLoggedIn) {
    // 未登录，跳转到登录页，并记录当前路径
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已登录，渲染子组件
  return <>{children}</>;
};

export default RequireAuth;
