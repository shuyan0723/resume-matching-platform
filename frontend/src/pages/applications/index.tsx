import { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Tabs,
  Tag,
  Row,
  Col,
  Empty,
  Timeline,
  Select,
  Input,
} from 'antd';
import {
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  HourglassOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * 投递记录页
 * 投递列表 + 状态标签
 */
const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // 模拟投递记录数据
  const applications = [
    {
      id: 1,
      jobTitle: '高级前端工程师',
      company: '字节跳动',
      salary: '30k-50k',
      location: '北京',
      status: 'interview',
      statusText: '面试中',
      applyTime: '2024-01-20 14:30',
      matchRate: 95,
      timeline: [
        { time: '2024-01-20 14:30', status: '投递成功', description: '简历已成功投递' },
        { time: '2024-01-21 10:00', status: '简历筛选通过', description: 'HR 已查看您的简历' },
        { time: '2024-01-22 16:00', status: '面试邀请', description: '已发送面试邀请，请查收邮件' },
      ],
    },
    {
      id: 2,
      jobTitle: '全栈开发工程师',
      company: '阿里巴巴',
      salary: '25k-45k',
      location: '杭州',
      status: 'pending',
      statusText: '待处理',
      applyTime: '2024-01-19 09:15',
      matchRate: 88,
      timeline: [
        { time: '2024-01-19 09:15', status: '投递成功', description: '简历已成功投递' },
      ],
    },
    {
      id: 3,
      jobTitle: 'Java 后端工程师',
      company: '腾讯',
      salary: '28k-48k',
      location: '深圳',
      status: 'rejected',
      statusText: '未通过',
      applyTime: '2024-01-15 11:00',
      matchRate: 72,
      timeline: [
        { time: '2024-01-15 11:00', status: '投递成功', description: '简历已成功投递' },
        { time: '2024-01-17 14:00', status: '简历筛选未通过', description: '很遗憾，您的简历未通过筛选' },
      ],
    },
    {
      id: 4,
      jobTitle: '前端架构师',
      company: '美团',
      salary: '40k-60k',
      location: '北京',
      status: 'accepted',
      statusText: '已录用',
      applyTime: '2024-01-10 08:30',
      matchRate: 92,
      timeline: [
        { time: '2024-01-10 08:30', status: '投递成功', description: '简历已成功投递' },
        { time: '2024-01-11 10:00', status: '简历筛选通过', description: 'HR 已查看您的简历' },
        { time: '2024-01-13 14:00', status: '技术面试', description: '技术面试已完成' },
        { time: '2024-01-16 10:00', status: 'HR 面试', description: 'HR 面试已完成' },
        { time: '2024-01-18 16:00', status: '录用通知', description: '恭喜您获得录用机会' },
      ],
    },
  ];

  // 根据状态筛选
  const filteredApplications = activeTab === 'all'
    ? applications
    : applications.filter((app) => app.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'interview':
        return 'blue';
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <HourglassOutlined />;
      case 'interview':
        return <ClockCircleOutlined />;
      case 'accepted':
        return <CheckCircleOutlined />;
      case 'rejected':
        return <CloseCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const tabItems: TabsProps['items'] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待处理' },
    { key: 'interview', label: '面试中' },
    { key: 'accepted', label: '已录用' },
    { key: 'rejected', label: '未通过' },
  ];

  return (
    <div>
      {/* 页面标题 */}
      <Title level={3} style={{ marginBottom: 24 }}>
        投递记录
      </Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{applications.length}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>总投递数</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#f59e0b' }}>
                {applications.filter((a) => a.status === 'pending').length}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>待处理</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#3b82f6' }}>
                {applications.filter((a) => a.status === 'interview').length}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>面试中</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#10b981' }}>
                {applications.filter((a) => a.status === 'accepted').length}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>已录用</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 筛选和搜索 */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
        <Row gutter={16}>
          <Col flex="auto">
            <Input.Search
              placeholder="搜索职位或公司"
              enterButton={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col>
            <Select defaultValue="all" style={{ width: 140 }}>
              <Option value="all">全部时间</Option>
              <Option value="week">最近一周</Option>
              <Option value="month">最近一月</Option>
              <Option value="quarter">最近三月</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Tab 切换 */}
      <Card bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ padding: '0 16px' }}
        />

        {/* 投递列表 */}
        <div style={{ padding: '0 16px 16px' }}>
          {filteredApplications.length > 0 ? (
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {filteredApplications.map((app) => (
                <Card
                  key={app.id}
                  hoverable
                  onClick={() => navigate(`/jobs/${app.id}`)}
                  bodyStyle={{ padding: 20 }}
                >
                  <Row align="top">
                    <Col flex="auto">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <Title level={5} style={{ margin: 0 }}>
                          {app.jobTitle}
                        </Title>
                        <Tag icon={getStatusIcon(app.status)} color={getStatusColor(app.status)}>
                          {app.statusText}
                        </Tag>
                        <Tag color="gold">匹配度 {app.matchRate}%</Tag>
                      </div>
                      <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>
                        {app.salary}
                      </div>
                      <div style={{ color: '#6b7280', marginBottom: 12 }}>
                        {app.company} · {app.location}
                      </div>
                      {/* 进度时间线 */}
                      <Timeline
                        size="small"
                        items={app.timeline.slice(-3).map((item) => ({
                          color: 'blue',
                          children: (
                            <div>
                              <Text strong>{item.status}</Text>
                              <div style={{ fontSize: 12, color: '#9ca3af' }}>{item.time}</div>
                            </div>
                          ),
                        }))}
                        style={{ marginBottom: 0 }}
                      />
                    </Col>
                    <Col>
                      <Space direction="vertical" size={8}>
                        <Button type="primary" icon={<EyeOutlined />}>
                          查看职位
                        </Button>
                        <div style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
                          投递于 {app.applyTime}
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          ) : (
            <div style={{ padding: '48px 0' }}>
              <Empty description="暂无投递记录" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ApplicationsPage;
