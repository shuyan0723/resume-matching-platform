import { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Table,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Avatar,
  Progress,
  Modal,
  message,
  Badge,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  EyeOutlined,
  StarOutlined,
  DownloadOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * 企业端 - 候选人库
 * 展示所有候选人信息，支持筛选和搜索
 */
const EmployerCandidatesPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

  // 模拟候选人数据
  const candidates = [
    {
      id: 1,
      name: '张三',
      avatar: '',
      title: '高级前端工程师',
      email: 'zhangsan@example.com',
      phone: '138****8888',
      location: '北京',
      experience: '5年',
      education: '本科',
      currentCompany: '字节跳动',
      expectedSalary: '30k-50k',
      matchRate: 95,
      skills: ['React', 'TypeScript', 'Node.js', 'Vue'],
      status: 'active',
      statusText: '积极求职',
      lastActive: '1小时前',
      applyCount: 3,
    },
    {
      id: 2,
      name: '李四',
      avatar: '',
      title: '前端开发工程师',
      email: 'lisi@example.com',
      phone: '139****9999',
      location: '上海',
      experience: '3年',
      education: '本科',
      currentCompany: '阿里巴巴',
      expectedSalary: '20k-35k',
      matchRate: 88,
      skills: ['Vue', 'JavaScript', 'CSS', 'Webpack'],
      status: 'passive',
      statusText: '观望机会',
      lastActive: '3天前',
      applyCount: 1,
    },
    {
      id: 3,
      name: '王五',
      avatar: '',
      title: '前端架构师',
      email: 'wangwu@example.com',
      phone: '137****7777',
      location: '深圳',
      experience: '8年',
      education: '硕士',
      currentCompany: '腾讯',
      expectedSalary: '40k-60k',
      matchRate: 92,
      skills: ['React', 'TypeScript', 'Webpack', 'Node.js', '微前端'],
      status: 'active',
      statusText: '积极求职',
      lastActive: '2小时前',
      applyCount: 2,
    },
    {
      id: 4,
      name: '赵六',
      avatar: '',
      title: '初级前端工程师',
      email: 'zhaoliu@example.com',
      phone: '136****6666',
      location: '杭州',
      experience: '1年',
      education: '大专',
      currentCompany: '创业公司',
      expectedSalary: '10k-15k',
      matchRate: 65,
      skills: ['HTML', 'CSS', 'JavaScript'],
      status: 'active',
      statusText: '积极求职',
      lastActive: '5小时前',
      applyCount: 5,
    },
    {
      id: 5,
      name: '钱七',
      avatar: '',
      title: '全栈工程师',
      email: 'qianqi@example.com',
      phone: '135****5555',
      location: '广州',
      experience: '6年',
      education: '本科',
      currentCompany: '美团',
      expectedSalary: '25k-40k',
      matchRate: 85,
      skills: ['React', 'Node.js', 'MongoDB', 'Docker'],
      status: 'passive',
      statusText: '观望机会',
      lastActive: '1周前',
      applyCount: 0,
    },
    {
      id: 6,
      name: '孙八',
      avatar: '',
      title: 'Java 后端工程师',
      email: 'sunba@example.com',
      phone: '134****4444',
      location: '北京',
      experience: '4年',
      education: '本科',
      currentCompany: '京东',
      expectedSalary: '25k-35k',
      matchRate: 78,
      skills: ['Java', 'Spring', 'MySQL', 'Redis'],
      status: 'active',
      statusText: '积极求职',
      lastActive: '30分钟前',
      applyCount: 2,
    },
  ];

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(keyword.toLowerCase()) ||
      c.title.toLowerCase().includes(keyword.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(keyword.toLowerCase())),
  );

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'green' : 'orange';
  };

  const handleViewResume = (id: number) => {
    // TODO: 查看简历详情
    console.log('查看简历:', id);
  };

  const handleSendMessage = (candidate: typeof candidates[0]) => {
    Modal.confirm({
      title: '发送面试邀请',
      content: `确定向 ${candidate.name} 发送面试邀请吗？`,
      okText: '发送',
      cancelText: '取消',
      onOk() {
        message.success('邀请已发送');
      },
    });
  };

  const columns: ColumnsType<typeof candidates[0]> = [
    {
      title: '候选人信息',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.avatar || undefined}
            icon={!record.avatar && <UserOutlined />}
            style={{ backgroundColor: '#3b82f6' }}
            size={40}
          />
          <div>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>{text}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{record.title}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '匹配度',
      dataIndex: 'matchRate',
      key: 'matchRate',
      width: 150,
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            percent={value}
            size="small"
            style={{ width: 70 }}
            strokeColor={value >= 90 ? '#10b981' : value >= 70 ? '#f59e0b' : '#ef4444'}
          />
          <span style={{ fontWeight: 600 }}>{value}%</span>
        </div>
      ),
      sorter: (a, b) => a.matchRate - b.matchRate,
    },
    {
      title: '工作经验',
      dataIndex: 'experience',
      key: 'experience',
      width: 100,
    },
    {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
      width: 80,
    },
    {
      title: '当前公司',
      dataIndex: 'currentCompany',
      key: 'currentCompany',
      width: 120,
    },
    {
      title: '期望薪资',
      dataIndex: 'expectedSalary',
      key: 'expectedSalary',
      width: 100,
      render: (text) => <span style={{ color: '#ef4444', fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '技能标签',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: string[]) => (
        <Space size={[4, 4]} wrap>
          {skills.slice(0, 3).map((skill) => (
            <Tag key={skill} style={{ margin: 0, fontSize: 12 }}>
              {skill}
            </Tag>
          ))}
          {skills.length > 3 && (
            <Tag style={{ margin: 0, fontSize: 12 }}>+{skills.length - 3}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <div>
          <Tag color={getStatusColor(record.status)}>{record.statusText}</Tag>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{record.lastActive}</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewResume(record.id)}
          >
            简历
          </Button>
          <Button
            type="link"
            size="small"
            icon={<MessageOutlined />}
            onClick={() => handleSendMessage(record)}
          >
            邀约
          </Button>
          <Button
            type="link"
            size="small"
            icon={<StarOutlined />}
          >
            收藏
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedCandidates,
    onChange: (newSelectedKeys: React.Key[]) => {
      setSelectedCandidates(newSelectedKeys as number[]);
    },
  };

  return (
    <div>
      {/* 页面标题 */}
      <Title level={3} style={{ marginBottom: 24 }}>
        候选人库
      </Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{candidates.length}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>总候选人数</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#10b981' }}>
                {candidates.filter((c) => c.status === 'active').length}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>积极求职</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#3b82f6' }}>
                {candidates.filter((c) => c.matchRate >= 90).length}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>高匹配度</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Badge count={5} size="small" offset={[4, 0]}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#f59e0b' }}>
                  {candidates.filter((c) => c.applyCount > 0).length}
                </div>
              </Badge>
              <div style={{ color: '#6b7280', fontSize: 13 }}>新投递</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
        <Row gutter={16}>
          <Col flex="auto">
            <Input.Search
              placeholder="搜索姓名、职位、技能"
              enterButton={<SearchOutlined />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col>
            <Select defaultValue="all" style={{ width: 140 }} size="large">
              <Option value="all">全部状态</Option>
              <Option value="active">积极求职</Option>
              <Option value="passive">观望机会</Option>
            </Select>
          </Col>
          <Col>
            <Select defaultValue="match" style={{ width: 140 }} size="large">
              <Option value="match">匹配度</Option>
              <Option value="experience">工作经验</Option>
              <Option value="active">最近活跃</Option>
            </Select>
          </Col>
          <Col>
            <Button icon={<FilterOutlined />} size="large">
              高级筛选
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 批量操作 */}
      {selectedCandidates.length > 0 && (
        <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '12px 16px' }}>
          <Space>
            <span>已选择 {selectedCandidates.length} 位候选人</span>
            <Button size="small" icon={<DownloadOutlined />}>
              批量导出
            </Button>
            <Button size="small" icon={<MessageOutlined />}>
              批量邀约
            </Button>
            <Button size="small" danger>
              批量删除
            </Button>
          </Space>
        </Card>
      )}

      {/* 候选人列表 */}
      <Card bodyStyle={{ padding: 0 }}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredCandidates}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredCandidates.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 位候选人`,
          }}
        />
      </Card>
    </div>
  );
};

export default EmployerCandidatesPage;
