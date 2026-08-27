import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@store/user.store';
import { UserRole } from '@app-types/user.types';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

/**
 * 角色守卫组件
 * 检查用户是否具有指定角色，不满足则跳转到对应页面或显示无权限
 */
interface RequireRoleProps {
  children: React.ReactNode;
  /** 允许访问的角色列表 */
  roles: UserRole[];
}

const RequireRole: React.FC<RequireRoleProps> = ({ children, roles }) => {
  const { userInfo, isLoggedIn } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  // 未登录的情况由 RequireAuth 处理，这里只处理已登录但角色不符的情况
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 检查用户角色
  if (!userInfo || !roles.includes(userInfo.role)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问该页面"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              返回首页
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireRole;
