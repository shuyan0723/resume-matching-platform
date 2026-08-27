import { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Divider, message, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUserStore } from '@store/user.store';

const { Title, Text } = Typography;

/**
 * 登录页
 * 邮箱密码登录 + 注册链接
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useUserStore();
  const [form] = Form.useForm();

  // 获取登录后要跳转的页面
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (values: { email: string; password: string; remember: boolean }) => {
    try {
      await login(values.email, values.password);
      message.success('登录成功');
      // 根据角色跳转不同页面
      // TODO: 根据用户角色判断跳转目标
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查邮箱和密码');
    }
  };

  return (
    <div>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
        欢迎回来
      </Title>
      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}>
        登录您的账号，开启智能求职之旅
      </Text>

      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        size="large"
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
            placeholder="邮箱地址"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度不能少于6位' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a href="#forgot">忘记密码？</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ height: 44, fontSize: 16 }}
          >
            登录
          </Button>
        </Form.Item>
      </Form>

      <Divider plain style={{ color: '#9ca3af', fontSize: 13 }}>
        其他登录方式
      </Divider>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
        <Button
          shape="circle"
          size="large"
          icon={<UserOutlined />}
          onClick={() => message.info('微信登录开发中')}
        />
        <Button
          shape="circle"
          size="large"
          icon={<UserOutlined />}
          onClick={() => message.info('手机登录开发中')}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary">
          还没有账号？
          <Link to="/register" style={{ marginLeft: 4 }}>
            立即注册
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default LoginPage;
