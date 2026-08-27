import { Layout, Menu, Avatar, Dropdown, Space, Button } from 'antd';
import {
  ApartmentOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@store/user.store';
import type { MenuProps } from 'antd';

const { Header, Sider, Content, Footer } = Layout;

/**
 * 企业端布局组件
 * 顶部导航栏 + 左侧侧边栏 + 内容区域
 */
const EmployerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useUserStore();

  // 侧边栏菜单项
  const siderMenuItems: MenuProps['items'] = [
    {
      key: '/employer/jobs',
      icon: <ApartmentOutlined />,
      label: '职位管理',
      onClick: () => navigate('/employer/jobs'),
    },
    {
      key: '/employer/candidates',
      icon: <TeamOutlined />,
      label: '候选人管理',
      onClick: () => navigate('/employer/candidates'),
    },
    {
      key: '/employer/statistics',
      icon: <BarChartOutlined />,
      label: '数据统计',
      disabled: true,
    },
    {
      key: '/employer/settings',
      icon: <SettingOutlined />,
      label: '企业设置',
      onClick: () => navigate('/employer/settings'),
    },
  ];

  // 用户下拉菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '企业设置',
      onClick: () => navigate('/employer/settings'),
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

  // 根据当前路径选中侧边栏菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/employer/jobs')) return '/employer/jobs';
    if (path.startsWith('/employer/candidates')) return '/employer/candidates';
    if (path.startsWith('/employer/settings')) return '/employer/settings';
    return '/employer/jobs';
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
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            E
          </div>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
            企业招聘管理
          </span>
        </div>

        {/* 右侧操作区 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/employer/jobs/create')}
          >
            发布职位
          </Button>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                src={userInfo?.avatar || undefined}
                icon={!userInfo?.avatar && <UserOutlined />}
                style={{ backgroundColor: '#10b981' }}
              />
              <span style={{ color: '#374151' }}>
                {userInfo?.nickname || userInfo?.email || '企业用户'}
              </span>
              <DownOutlined style={{ fontSize: 12, color: '#9ca3af' }} />
            </Space>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {/* 左侧侧边栏 */}
        <Sider
          width={220}
          style={{
            background: '#fff',
            borderRight: '1px solid #e5e7eb',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={siderMenuItems}
            style={{
              height: '100%',
              borderRight: 'none',
              paddingTop: 16,
            }}
          />
        </Sider>

        {/* 内容区域 */}
        <Layout style={{ background: '#f5f7fa' }}>
          <Content style={{ padding: '24px', minHeight: 'calc(100vh - 130px)' }}>
            <div
              style={{
                maxWidth: 1200,
                margin: '0 auto',
              }}
            >
              <Outlet />
            </div>
          </Content>

          {/* 页脚 */}
          <Footer style={{ textAlign: 'center', background: '#fff' }}>
            智能简历匹配平台 · 企业版 ©{new Date().getFullYear()} 让招聘更高效
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default EmployerLayout;
