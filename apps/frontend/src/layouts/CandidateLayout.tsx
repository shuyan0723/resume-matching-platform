import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import {
  HomeOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  SendOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@store/user.store';
import type { MenuProps } from 'antd';

const { Header, Content, Footer } = Layout;

/**
 * 求职者端布局组件
 * 顶部导航栏 + 内容区域
 */
const CandidateLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useUserStore();

  // 导航菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => navigate('/'),
    },
    {
      key: '/jobs',
      icon: <ApartmentOutlined />,
      label: '职位推荐',
      onClick: () => navigate('/jobs'),
    },
    {
      key: '/resumes',
      icon: <FileTextOutlined />,
      label: '我的简历',
      onClick: () => navigate('/resumes'),
    },
    {
      key: '/applications',
      icon: <SendOutlined />,
      label: '投递记录',
      onClick: () => navigate('/applications'),
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
  ];

  // 用户下拉菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账号设置',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  // 根据当前路径选中菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/jobs')) return '/jobs';
    if (path.startsWith('/resumes')) return '/resumes';
    if (path.startsWith('/applications')) return '/applications';
    if (path.startsWith('/profile')) return '/profile';
    if (path === '/') return '/';
    return '/';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航栏 */}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo 区域 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            R
          </div>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
            智能简历匹配
          </span>
        </div>

        {/* 导航菜单 */}
        <Menu
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{
            flex: 1,
            justifyContent: 'center',
            borderBottom: 'none',
            minWidth: 500,
          }}
        />

        {/* 用户区域 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button type="primary" onClick={() => navigate('/jobs')}>
            找工作
          </Button>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                src={userInfo?.avatar || undefined}
                icon={!userInfo?.avatar && <UserOutlined />}
                style={{ backgroundColor: '#3b82f6' }}
              />
              <span style={{ color: '#374151' }}>
                {userInfo?.nickname || userInfo?.email || '用户'}
              </span>
              <DownOutlined style={{ fontSize: 12, color: '#9ca3af' }} />
            </Space>
          </Dropdown>
        </div>
      </Header>

      {/* 内容区域 */}
      <Content style={{ padding: '24px', background: '#f5f7fa' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            minHeight: 'calc(100vh - 180px)',
          }}
        >
          <Outlet />
        </div>
      </Content>

      {/* 页脚 */}
      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        智能简历匹配平台 ©{new Date().getFullYear()} 让求职更简单
      </Footer>
    </Layout>
  );
};

export default CandidateLayout;
