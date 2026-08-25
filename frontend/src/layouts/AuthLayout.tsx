import { Card } from 'antd';
import { Outlet } from 'react-router-dom';

/**
 * 认证页布局组件
 * 居中的卡片式布局，用于登录/注册页
 */
interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo 和标题 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 32,
              marginBottom: 16,
              backdropFilter: 'blur(10px)',
            }}
          >
            R
          </div>
          <h1
            style={{
              color: '#fff',
              fontSize: 28,
              fontWeight: 600,
              margin: 0,
              marginBottom: 8,
            }}
          >
            智能简历匹配平台
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            AI 驱动的智能求职与招聘平台
          </p>
        </div>

        {/* 认证卡片 */}
        <Card
          style={{
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }}
          bodyStyle={{ padding: '32px' }}
        >
          {children || <Outlet />}
        </Card>

        {/* 底部版权 */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 14,
          }}
        >
          ©{new Date().getFullYear()} 智能简历匹配平台 版权所有
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
