import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Radio,
  message,
  Space,
  Steps,
} from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '@store/user.store';
import { UserRole } from '@types/user.types';

const { Title, Text } = Typography;

/**
 * 注册页
 * 邮箱密码 + 角色选择
 */
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading } = useUserStore();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const stepItems = [
    { title: '选择身份' },
    { title: '填写信息' },
    { title: '完成注册' },
  ];

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        // 第一步：选择角色
        const { role } = await form.validateFields(['role']);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        // 第二步：填写信息
        await form.validateFields(['email', 'password', 'confirmPassword', 'nickname']);
        setCurrentStep(2);
      }
    } catch {
      // 验证失败
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await register(values.email, values.password, values.nickname, values.role);
      message.success('注册成功');
      // 根据角色跳转
      if (values.role === UserRole.EMPLOYER) {
        navigate('/employer/jobs', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      message.error(error.message || '注册失败，请稍后重试');
    }
  };

  return (
    <div>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
        创建账号
      </Title>
      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
        加入智能简历匹配平台，开启新的旅程
      </Text>

      {/* 步骤条 */}
      <Steps current={currentStep} size="small" items={stepItems} style={{ marginBottom: 24 }} />

      <Form
        form={form}
        name="register"
        size="large"
        initialValues={{ role: UserRole.CANDIDATE }}
      >
        {/* 步骤1: 选择身份 */}
        {currentStep === 0 && (
          <>
            <Form.Item
              name="role"
              rules={[{ required: true, message: '请选择您的身份' }]}
            >
              <Radio.Group style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  <Radio.Button value={UserRole.CANDIDATE} style={{ width: '100%', height: 'auto', padding: '20px 24px', borderRadius: 8 }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>我是求职者</div>
                      <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 'normal' }}>
                        寻找工作机会，上传简历，智能匹配职位
                      </div>
                    </div>
                  </Radio.Button>
                  <Radio.Button value={UserRole.EMPLOYER} style={{ width: '100%', height: 'auto', padding: '20px 24px', borderRadius: 8 }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>我是招聘方</div>
                      <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 'normal' }}>
                        发布招聘职位，筛选人才，高效管理候选人
                      </div>
                    </div>
                  </Radio.Button>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                block
                onClick={handleNext}
                style={{ height: 44, fontSize: 16 }}
              >
                下一步
              </Button>
            </Form.Item>
          </>
        )}

        {/* 步骤2: 填写信息 */}
        {currentStep === 1 && (
          <>
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
              name="nickname"
              rules={[
                { required: true, message: '请输入昵称' },
                { min: 2, max: 20, message: '昵称长度为2-20个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                placeholder="昵称"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, max: 20, message: '密码长度为6-20个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="确认密码"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%' }} direction="vertical">
                <Button
                  block
                  onClick={handlePrev}
                  style={{ height: 44 }}
                >
                  上一步
                </Button>
                <Button
                  type="primary"
                  block
                  onClick={handleNext}
                  style={{ height: 44, fontSize: 16 }}
                >
                  下一步
                </Button>
              </Space>
            </Form.Item>
          </>
        )}

        {/* 步骤3: 完成注册 */}
        {currentStep === 2 && (
          <>
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 36,
                  marginBottom: 16,
                }}
              >
                ✓
              </div>
              <Title level={4} style={{ marginBottom: 8 }}>
                信息确认
              </Title>
              <Text type="secondary">
                请确认以下信息，完成注册
              </Text>
            </div>

            <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 24 }}>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">身份：</Text>
                <Text>
                  {form.getFieldValue('role') === UserRole.EMPLOYER ? '招聘方' : '求职者'}
                </Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">邮箱：</Text>
                <Text>{form.getFieldValue('email')}</Text>
              </div>
              <div>
                <Text type="secondary">昵称：</Text>
                <Text>{form.getFieldValue('nickname')}</Text>
              </div>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%' }} direction="vertical">
                <Button
                  block
                  onClick={handlePrev}
                  style={{ height: 44 }}
                >
                  返回修改
                </Button>
                <Button
                  type="primary"
                  block
                  onClick={handleSubmit}
                  loading={loading}
                  style={{ height: 44, fontSize: 16 }}
                >
                  完成注册
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Text type="secondary">
          已有账号？
          <Link to="/login" style={{ marginLeft: 4 }}>
            立即登录
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default RegisterPage;
