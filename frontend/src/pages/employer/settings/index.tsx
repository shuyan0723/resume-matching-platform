import { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Form,
  Input,
  Select,
  Upload,
  Tabs,
  Row,
  Col,
  Switch,
  message,
  Avatar,
  Divider,
  InputNumber,
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  SettingOutlined,
  SafetyOutlined,
  BellOutlined,
  TeamOutlined,
  BankOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useUserStore } from '@store/user.store';
import type { TabsProps, UploadProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 企业端 - 企业设置页
 * 企业信息、账号安全、通知设置等
 */
const EmployerSettingsPage: React.FC = () => {
  const { userInfo } = useUserStore();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('company');

  // 模拟企业数据
  const companyInfo = {
    name: '科技有限公司',
    logo: '',
    industry: '互联网/IT',
    size: '500-1000人',
    type: '民营公司',
    address: '北京市海淀区中关村大街1号',
    website: 'https://www.example.com',
    description: '我们是一家专注于人工智能和大数据领域的科技公司，致力于用技术改变世界。公司成立于2018年，目前拥有500+员工，业务覆盖全国主要城市。',
    contactName: 'HR 王经理',
    contactPhone: '010-88888888',
    contactEmail: 'hr@example.com',
    // 认证信息
    verified: true,
    verifyStatus: '已认证',
  };

  const logoUploadProps: UploadProps = {
    name: 'logo',
    action: '/api/company/logo',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件');
        return false;
      }
      return true;
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success('Logo 上传成功');
      }
    },
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('保存设置:', values);
      // TODO: 调用保存接口
      message.success('保存成功');
    } catch {
      // 表单验证失败
    }
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'company',
      label: (
        <Space>
          <BankOutlined />
          企业信息
        </Space>
      ),
    },
    {
      key: 'team',
      label: (
        <Space>
          <TeamOutlined />
          团队成员
        </Space>
      ),
    },
    {
      key: 'notification',
      label: (
        <Space>
          <BellOutlined />
          通知设置
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
  ];

  return (
    <div>
      {/* 页面标题 */}
      <Title level={3} style={{ marginBottom: 24 }}>
        企业设置
      </Title>

      <Row gutter={24}>
        {/* 左侧企业信息概览 */}
        <Col xs={24} md={6}>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Upload.Dragger {...logoUploadProps} style={{ border: 'none', background: 'transparent', padding: 0 }}>
                <Avatar
                  size={80}
                  src={companyInfo.logo || undefined}
                  icon={!companyInfo.logo && <BankOutlined />}
                  style={{
                    backgroundColor: '#10b981',
                    fontSize: 36,
                    cursor: 'pointer',
                  }}
                  shape="square"
                />
                <div style={{ marginTop: 8, color: '#6b7280', fontSize: 12 }}>
                  <UploadOutlined /> 点击更换 Logo
                </div>
              </Upload.Dragger>
            </div>
            <Title level={5} style={{ textAlign: 'center', marginBottom: 4 }}>
              {companyInfo.name}
            </Title>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {companyInfo.verified ? (
                <span style={{ color: '#10b981', fontSize: 13 }}>
                  ✓ 已认证企业
                </span>
              ) : (
                <span style={{ color: '#f59e0b', fontSize: 13 }}>
                  待认证
                </span>
              )}
            </div>
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
              {companyInfo.industry} · {companyInfo.size}
            </div>
          </Card>

          {/* 快捷操作 */}
          <Card title="快捷操作" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block type="primary">
                企业认证
              </Button>
              <Button block>
                升级套餐
              </Button>
              <Button block>
                联系客服
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 右侧设置内容 */}
        <Col xs={24} md={18}>
          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
            />

            <div style={{ padding: '16px 0' }}>
              {/* 企业信息 */}
              {activeTab === 'company' && (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={companyInfo}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="企业名称"
                        name="name"
                        rules={[{ required: true, message: '请输入企业名称' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="所属行业"
                        name="industry"
                        rules={[{ required: true, message: '请选择所属行业' }]}
                      >
                        <Select>
                          <Option value="互联网/IT">互联网/IT</Option>
                          <Option value="金融">金融</Option>
                          <Option value="教育">教育</Option>
                          <Option value="医疗健康">医疗健康</Option>
                          <Option value="电商">电商</Option>
                          <Option value="其他">其他</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="公司规模"
                        name="size"
                      >
                        <Select>
                          <Option value="0-20人">0-20人</Option>
                          <Option value="20-99人">20-99人</Option>
                          <Option value="100-499人">100-499人</Option>
                          <Option value="500-999人">500-999人</Option>
                          <Option value="1000人以上">1000人以上</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="公司类型"
                        name="type"
                      >
                        <Select>
                          <Option value="民营公司">民营公司</Option>
                          <Option value="国企">国企</Option>
                          <Option value="外企">外企</Option>
                          <Option value="合资">合资</Option>
                          <Option value="上市公司">上市公司</Option>
                          <Option value="创业公司">创业公司</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="公司网站"
                        name="website"
                      >
                        <Input placeholder="https://" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="公司地址"
                    name="address"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="公司简介"
                    name="description"
                  >
                    <TextArea rows={4} placeholder="请输入公司简介..." />
                  </Form.Item>

                  <Divider />

                  <Title level={5}>联系方式</Title>
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="联系人"
                        name="contactName"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="联系电话"
                        name="contactPhone"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="联系邮箱"
                        name="contactEmail"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <Button type="primary" icon={<SaveOutlined />} size="large" onClick={handleSave}>
                      保存设置
                    </Button>
                  </div>
                </Form>
              )}

              {/* 团队成员 */}
              {activeTab === 'team' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text strong>团队成员管理</Text>
                    <Button type="primary">邀请成员</Button>
                  </div>
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '48px 0' }}>
                    <TeamOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                    <div>团队成员管理功能开发中...</div>
                  </div>
                </div>
              )}

              {/* 通知设置 */}
              {activeTab === 'notification' && (
                <div>
                  <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 12 }}>
                      投递通知
                    </Text>
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                          <div>
                            <div>新简历投递通知</div>
                            <div style={{ fontSize: 12, color: '#9ca3af' }}>有新的简历投递时发送通知</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                          <div>
                            <div>高匹配度简历提醒</div>
                            <div style={{ fontSize: 12, color: '#9ca3af' }}>匹配度超过 90% 的简历特别提醒</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 12 }}>
                      面试通知
                    </Text>
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                          <div>
                            <div>面试安排提醒</div>
                            <div style={{ fontSize: 12, color: '#9ca3af' }}>面试开始前发送提醒</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                          <div>
                            <div>候选人回复通知</div>
                            <div style={{ fontSize: 12, color: '#9ca3af' }}>候选人确认或拒绝面试时通知</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 12 }}>
                      通知方式
                    </Text>
                    <Row gutter={16}>
                      <Col xs={24} sm={8}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                          <span>邮件通知</span>
                          <Switch defaultChecked />
                        </div>
                      </Col>
                      <Col xs={24} sm={8}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                          <span>短信通知</span>
                          <Switch />
                        </div>
                      </Col>
                      <Col xs={24} sm={8}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                          <span>站内消息</span>
                          <Switch defaultChecked />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                      保存设置
                    </Button>
                  </div>
                </div>
              )}

              {/* 账号安全 */}
              {activeTab === 'security' && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>账号密码</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>定期修改密码可以提高账号安全性</div>
                      </div>
                      <Button>修改密码</Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>绑定手机</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>
                          已绑定：{userInfo?.email || '138****8888'}
                        </div>
                      </div>
                      <Button>更换手机</Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>绑定邮箱</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>
                          已绑定：{userInfo?.email || 'user@example.com'}
                        </div>
                      </div>
                      <Button>更换邮箱</Button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>注销账号</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>注销后所有数据将被清除，无法恢复</div>
                      </div>
                      <Button danger>注销账号</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployerSettingsPage;
