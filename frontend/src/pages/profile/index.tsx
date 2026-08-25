import { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Select,
  Avatar,
  Upload,
  Divider,
  message,
  Tabs,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UploadOutlined,
  EditOutlined,
  SettingOutlined,
  SafetyOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useUserStore } from '@store/user.store';
import type { TabsProps, UploadProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * 个人中心页
 * 基本信息 + 求职意向
 */
const ProfilePage: React.FC = () => {
  const { userInfo } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  // 模拟用户数据
  const profile = {
    nickname: userInfo?.nickname || '张三',
    email: userInfo?.email || 'zhangsan@example.com',
    phone: '138****8888',
    avatar: userInfo?.avatar || '',
    gender: '男',
    birthday: '1995-06-15',
    location: '北京市海淀区',
    // 求职意向
    expectedPosition: '高级前端工程师',
    expectedCity: '北京',
    expectedSalary: '30k-50k',
    currentStatus: '在职-考虑机会',
    workYears: '5-10年',
  };

  const avatarProps: UploadProps = {
    name: 'avatar',
    action: '/api/user/avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB');
        return false;
      }
      return true;
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success('头像上传成功');
      }
    },
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('保存信息:', values);
      // TODO: 调用保存接口
      message.success('保存成功');
      setEditing(false);
    } catch {
      // 表单验证失败
    }
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'basic',
      label: (
        <Space>
          <UserOutlined />
          基本信息
        </Space>
      ),
    },
    {
      key: 'intention',
      label: (
        <Space>
          <SettingOutlined />
          求职意向
        </Space>
      ),
    },
    {
      key: 'security',
      label: (
        <Space>
          <SafetyOutlined />
          账号安全
        </Space>
      ),
    },
    {
      key: 'notifications',
      label: (
        <Space>
          <BellOutlined />
          消息通知
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 页面标题 */}
      <Title level={3} style={{ marginBottom: 24 }}>
        个人中心
      </Title>

      <Row gutter={24}>
        {/* 左侧用户信息卡片 */}
        <Col xs={24} md={8}>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Upload.Dragger {...avatarProps} style={{ border: 'none', background: 'transparent', padding: 0 }}>
                <Avatar
                  size={96}
                  src={profile.avatar || undefined}
                  icon={!profile.avatar && <UserOutlined />}
                  style={{
                    backgroundColor: '#3b82f6',
                    fontSize: 40,
                    cursor: 'pointer',
                  }}
                />
                <div style={{ marginTop: 8, color: '#6b7280', fontSize: 12 }}>
                  <UploadOutlined /> 点击更换头像
                </div>
              </Upload.Dragger>
            </div>
            <Title level={5} style={{ textAlign: 'center', marginBottom: 4 }}>
              {profile.nickname}
            </Title>
            <div style={{ textAlign: 'center', color: '#6b7280', marginBottom: 16 }}>
              {profile.expectedPosition}
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4b5563' }}>
                <MailOutlined style={{ color: '#9ca3af' }} />
                <span>{profile.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4b5563' }}>
                <PhoneOutlined style={{ color: '#9ca3af' }} />
                <span>{profile.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4b5563' }}>
                <EnvironmentOutlined style={{ color: '#9ca3af' }} />
                <span>{profile.location}</span>
              </div>
            </Space>
          </Card>

          {/* 快捷入口 */}
          <Card title="快捷入口">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block onClick={() => window.location.href = '/resumes'}>
                我的简历
              </Button>
              <Button block onClick={() => window.location.href = '/applications'}>
                投递记录
              </Button>
              <Button block onClick={() => window.location.href = '/jobs'}>
                职位推荐
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 右侧内容区 */}
        <Col xs={24} md={16}>
          <Card>
            <Tabs items={tabItems} defaultActiveKey="basic" />

            {/* 基本信息 */}
            <div style={{ padding: '16px 0' }}>
              <Form
                form={form}
                layout="vertical"
                initialValues={profile}
                disabled={!editing}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="昵称"
                      name="nickname"
                      rules={[{ required: true, message: '请输入昵称' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="性别" name="gender">
                      <Select>
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="邮箱" name="email">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="手机号" name="phone">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="出生日期" name="birthday">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="所在城市" name="location">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Title level={5}>求职意向</Title>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="期望职位"
                      name="expectedPosition"
                      rules={[{ required: true, message: '请输入期望职位' }]}
                    >
                      <Input placeholder="如：高级前端工程师" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="期望城市"
                      name="expectedCity"
                      rules={[{ required: true, message: '请选择期望城市' }]}
                    >
                      <Select>
                        <Option value="北京">北京</Option>
                        <Option value="上海">上海</Option>
                        <Option value="深圳">深圳</Option>
                        <Option value="杭州">杭州</Option>
                        <Option value="广州">广州</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="期望薪资"
                      name="expectedSalary"
                    >
                      <Select>
                        <Option value="10k以下">10k以下</Option>
                        <Option value="10k-20k">10k-20k</Option>
                        <Option value="20k-30k">20k-30k</Option>
                        <Option value="30k-50k">30k-50k</Option>
                        <Option value="50k以上">50k以上</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="当前状态"
                      name="currentStatus"
                    >
                      <Select>
                        <Option value="在职-考虑机会">在职-考虑机会</Option>
                        <Option value="在职-暂不考虑">在职-暂不考虑</Option>
                        <Option value="离职-正在找工作">离职-正在找工作</Option>
                        <Option value="应届毕业生">应届毕业生</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="工作年限" name="workYears">
                      <Select>
                        <Option value="应届">应届</Option>
                        <Option value="1年以内">1年以内</Option>
                        <Option value="1-3年">1-3年</Option>
                        <Option value="3-5年">3-5年</Option>
                        <Option value="5-10年">5-10年</Option>
                        <Option value="10年以上">10年以上</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* 操作按钮 */}
                <div style={{ marginTop: 24, textAlign: 'right' }}>
                  {editing ? (
                    <Space>
                      <Button onClick={() => setEditing(false)}>取消</Button>
                      <Button type="primary" onClick={handleSave}>
                        保存
                      </Button>
                    </Space>
                  ) : (
                    <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>
                      编辑资料
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
