import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Row,
  Col,
  Tabs,
  Table,
  Avatar,
  Breadcrumb,
  Descriptions,
  Progress,
  Badge,
  Input,
  Select,
  Modal,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  StarOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  MessageOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import type { TabsProps, ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

/**
 * 企业端 - 职位详情页 + 候选人列表
 */
const EmployerJobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('candidates');

  // 模拟职位数据
  const job = {
    id,
    title: '高级前端工程师',
    department: '技术部',
    salary: '25k-40k',
    location: '北京',
    experience: '3-5年',
    education: '本科',
    status: 'active',
    statusText: '招聘中',
    headcount: 3,
    employmentType: '全职',
    publishTime: '2024-01-10',
    deadline: '2024-03-31',
    tags: ['React', 'TypeScript', 'Node.js'],
    description: `岗位职责：
1. 负责公司核心产品的前端开发工作；
2. 优化前端性能，提升用户体验；
3. 参与前端工程化建设。

任职要求：
1. 本科及以上学历，3年以上前端开发经验；
2. 精通 React 等主流前端框架；
3. 熟练掌握 TypeScript。`,
    stats: {
      total: 48,
      pending: 20,
      interviewing: 12,
      hired: 2,
      rejected: 14,
    },
  };

  // 模拟候选人数据
  const candidates = [
    {
      id: 1,
      name: '张三',
      avatar: '',
      title: '高级前端工程师',
      email: 'zhangsan@example.com',
      phone: '138****8888',
      matchRate: 95,
      status: 'interviewing',
      statusText: '面试中',
      applyTime: '2024-01-20 14:30',
      experience: '5年',
      education: '本科',
      skills: ['React', 'TypeScript', 'Node.js', 'Vue'],
    },
    {
      id: 2,
      name: '李四',
      avatar: '',
      title: '前端开发工程师',
      email: 'lisi@example.com',
      phone: '139****9999',
      matchRate: 88,
      status: 'pending',
      statusText: '待筛选',
      applyTime: '2024-01-21 10:15',
      experience: '3年',
      education: '本科',
      skills: ['Vue', 'JavaScript', 'CSS'],
    },
    {
      id: 3,
      name: '王五',
      avatar: '',
      title: '前端架构师',
      email: 'wangwu@example.com',
      phone: '137****7777',
      matchRate: 92,
      status: 'interviewing',
      statusText: '面试中',
      applyTime: '2024-01-19 16:00',
      experience: '8年',
      education: '硕士',
      skills: ['React', 'TypeScript', 'Webpack', 'Node.js'],
    },
    {
      id: 4,
      name: '赵六',
      avatar: '',
      title: '初级前端工程师',
      email: 'zhaoliu@example.com',
      phone: '136****6666',
      matchRate: 65,
      status: 'rejected',
      statusText: '已拒绝',
      applyTime: '2024-01-18 09:00',
      experience: '1年',
      education: '大专',
      skills: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 5,
      name: '钱七',
      avatar: '',
      title: '全栈工程师',
      email: 'qianqi@example.com',
      phone: '135****5555',
      matchRate: 85,
      status: 'hired',
      statusText: '已录用',
      applyTime: '2024-01-12 11:30',
      experience: '6年',
      education: '本科',
      skills: ['React', 'Node.js', 'MongoDB', 'Docker'],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'interviewing':
        return 'blue';
      case 'hired':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const handleStatusChange = (candidateId: number, newStatus: string) => {
    // TODO: 调用更新状态接口
    message.success(`状态已更新为：${newStatus}`);
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'candidates',
      label: `候选人 (${job.stats.total})`,
    },
    {
      key: 'details',
      label: '职位详情',
    },
    {
      key: 'analytics',
      label: '数据分析',
    },
  ];

  const columns: ColumnsType<typeof candidates[0]> = [
    {
      title: '候选人',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.avatar || undefined}
            icon={!record.avatar && <UserOutlined />}
            style={{ backgroundColor: '#3b82f6' }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{record.title}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '匹配度',
      dataIndex: 'matchRate',
      key: 'matchRate',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            percent={value}
            size="small"
            style={{ width: 80 }}
            strokeColor={value >= 90 ? '#10b981' : value >= 70 ? '#f59e0b' : '#ef4444'}
          />
          <span style={{ fontWeight: 600 }}>{value}%</span>
        </div>
      ),
      sorter: (a, b) => a.matchRate - b.matchRate,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)} icon={<StarOutlined />}>
          {record.statusText}
        </Tag>
      ),
      filters: [
        { text: '待筛选', value: 'pending' },
        { text: '面试中', value: 'interviewing' },
        { text: '已录用', value: 'hired' },
        { text: '已拒绝', value: 'rejected' },
      ],
    },
    {
      title: '工作经验',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
    },
    {
      title: '投递时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => console.log('查看简历:', record.id)}
          >
            简历
          </Button>
          <Button
            type="link"
            size="small"
            icon={<MessageOutlined />}
            onClick={() => handleStatusChange(record.id, 'interviewing')}
          >
            邀面试
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => handleStatusChange(record.id, 'rejected')}
          >
            拒绝
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 面包屑 */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigate('/employer/jobs')}>职位管理</Breadcrumb.Item>
        <Breadcrumb.Item>职位详情</Breadcrumb.Item>
      </Breadcrumb>

      {/* 职位信息头部 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Space align="start" size={16}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ padding: 0 }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Title level={3} style={{ margin: 0 }}>
                  {job.title}
                </Title>
                <Tag color={job.status === 'active' ? 'green' : 'orange'}>
                  {job.statusText}
                </Tag>
                <Badge count={`招聘 ${job.headcount} 人`} style={{ backgroundColor: '#3b82f6' }} />
              </div>
              <div style={{ color: '#ef4444', fontWeight: 600, fontSize: 20, marginBottom: 8 }}>
                {job.salary}
              </div>
              <Space size={16} wrap>
                <Text type="secondary">{job.department}</Text>
                <Text type="secondary">{job.location}</Text>
                <Text type="secondary">{job.experience}</Text>
                <Text type="secondary">{job.education}</Text>
                <Text type="secondary">{job.employmentType}</Text>
              </Space>
              <div style={{ marginTop: 12 }}>
                <Space size={[4, 8]} wrap>
                  {job.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              </div>
            </div>
          </Space>
          <Space>
            <Button icon={<EditOutlined />} size="large">
              编辑职位
            </Button>
            <Button type="primary" size="large" icon={<DownloadOutlined />}>
              导出简历
            </Button>
          </Space>
        </div>

        <div style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={4}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 600 }}>{job.stats.total}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>总投递</div>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#f59e0b' }}>{job.stats.pending}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>待筛选</div>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#3b82f6' }}>{job.stats.interviewing}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>面试中</div>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#10b981' }}>{job.stats.hired}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>已录用</div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* 内容区 */}
      <Card bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ padding: '0 16px' }}
        />

        {/* 候选人列表 */}
        {activeTab === 'candidates' && (
          <div style={{ padding: '0 16px 16px' }}>
            {/* 筛选栏 */}
            <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
              <Input.Search
                placeholder="搜索候选人姓名、技能"
                enterButton={<SearchOutlined />}
                style={{ width: 300 }}
                allowClear
              />
              <Select defaultValue="all" style={{ width: 140 }}>
                <Option value="all">全部状态</Option>
                <Option value="pending">待筛选</Option>
                <Option value="interviewing">面试中</Option>
                <Option value="hired">已录用</Option>
                <Option value="rejected">已拒绝</Option>
              </Select>
              <Select defaultValue="match" style={{ width: 140 }}>
                <Option value="match">匹配度排序</Option>
                <Option value="time">投递时间</Option>
              </Select>
            </div>

            <Table
              columns={columns}
              dataSource={candidates}
              rowKey="id"
              pagination={{
                total: candidates.length,
                pageSize: 10,
                showTotal: (total) => `共 ${total} 位候选人`,
              }}
            />
          </div>
        )}

        {/* 职位详情 */}
        {activeTab === 'details' && (
          <div style={{ padding: '16px' }}>
            <Row gutter={24}>
              <Col xs={24} md={16}>
                <Card title="职位描述" style={{ marginBottom: 16 }}>
                  <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                    {job.description}
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card title="职位信息">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="所属部门">{job.department}</Descriptions.Item>
                    <Descriptions.Item label="工作地点">{job.location}</Descriptions.Item>
                    <Descriptions.Item label="工作经验">{job.experience}</Descriptions.Item>
                    <Descriptions.Item label="学历要求">{job.education}</Descriptions.Item>
                    <Descriptions.Item label="用工类型">{job.employmentType}</Descriptions.Item>
                    <Descriptions.Item label="招聘人数">{job.headcount} 人</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{job.publishTime}</Descriptions.Item>
                    <Descriptions.Item label="截止日期">{job.deadline}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* 数据分析 */}
        {activeTab === 'analytics' && (
          <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af' }}>
            <ClockCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <div>数据分析功能开发中...</div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmployerJobDetailPage;
