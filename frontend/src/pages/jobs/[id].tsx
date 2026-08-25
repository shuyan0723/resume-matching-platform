import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Tag,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Descriptions,
  Progress,
  Avatar,
  Breadcrumb,
} from 'antd';
import {
  StarOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  BankOutlined,
  TeamOutlined,
  SendOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

/**
 * 职位详情页
 * 展示岗位信息、公司信息、匹配度和投递按钮
 */
const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 模拟职位详情数据
  const job = {
    id,
    title: '高级前端工程师',
    salary: '25k-40k',
    location: '北京',
    experience: '3-5年',
    education: '本科',
    tags: ['React', 'TypeScript', 'Node.js', '前端架构'],
    description: `岗位职责：
1. 负责公司核心产品的前端开发工作，参与技术方案设计与评审；
2. 优化前端性能，提升用户体验，确保产品在各种设备上的流畅运行；
3. 参与前端工程化建设，推动团队技术进步；
4. 与产品、设计、后端团队紧密协作，确保项目高质量交付。

任职要求：
1. 本科及以上学历，3年以上前端开发经验；
2. 精通 React/Vue 等主流前端框架，深入理解其原理；
3. 熟练掌握 TypeScript，有大型项目经验优先；
4. 熟悉 Node.js，有后端开发经验者优先；
5. 具备良好的沟通能力和团队协作精神。`,
    benefits: ['六险一金', '弹性工作', '年终奖金', '带薪年假', '定期团建', '技术分享'],
    matchRate: 95,
    matchDetails: [
      { label: '技能匹配', value: 98 },
      { label: '经验匹配', value: 90 },
      { label: '学历匹配', value: 100 },
      { label: '薪资匹配', value: 92 },
    ],
    company: {
      name: '科技有限公司',
      logo: '',
      industry: '互联网/IT',
      size: '500-1000人',
      address: '北京市海淀区中关村',
      description: '我们是一家专注于人工智能和大数据领域的科技公司，致力于用技术改变世界。',
    },
  };

  return (
    <div>
      {/* 面包屑 */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigate('/')}>首页</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/jobs')}>职位列表</Breadcrumb.Item>
        <Breadcrumb.Item>职位详情</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        {/* 左侧主内容 */}
        <Col xs={24} lg={16}>
          {/* 职位头部信息 */}
          <Card style={{ marginBottom: 16 }}>
            <Space align="start" size={16} style={{ width: '100%' }}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ padding: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <Title level={3} style={{ margin: 0 }}>
                    {job.title}
                  </Title>
                  <Tag
                    icon={<StarOutlined />}
                    color="gold"
                    style={{ fontSize: 14, padding: '2px 8px' }}
                  >
                    匹配度 {job.matchRate}%
                  </Tag>
                </div>
                <div style={{ color: '#ef4444', fontWeight: 600, fontSize: 24, marginBottom: 12 }}>
                  {job.salary}
                </div>
                <Space size={16} wrap style={{ marginBottom: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280' }}>
                    <EnvironmentOutlined /> {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280' }}>
                    <ClockCircleOutlined /> {job.experience}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280' }}>
                    <BankOutlined /> {job.education}
                  </span>
                </Space>
                <Space size={[4, 8]} wrap>
                  {job.tags.map((tag) => (
                    <Tag key={tag} style={{ margin: 0 }}>
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            </Space>

            <Divider />

            {/* 操作按钮 */}
            <Space size={12}>
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={() => {
                  // TODO: 投递简历
                  console.log('投递职位:', id);
                }}
              >
                立即投递
              </Button>
              <Button size="large" icon={<HeartOutlined />}>
                收藏
              </Button>
              <Button size="large" icon={<ShareAltOutlined />}>
                分享
              </Button>
            </Space>
          </Card>

          {/* 职位描述 */}
          <Card title="职位描述" style={{ marginBottom: 16 }}>
            <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
              {job.description}
            </Paragraph>
          </Card>

          {/* 公司介绍 */}
          <Card title="公司介绍">
            <Space align="start" size={16}>
              <Avatar size={64} style={{ backgroundColor: '#3b82f6', fontSize: 24 }}>
                {job.company.name.charAt(0)}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ marginBottom: 8 }}>
                  {job.company.name}
                </Title>
                <Space size={16} style={{ marginBottom: 12 }}>
                  <Text type="secondary">
                    <TeamOutlined style={{ marginRight: 4 }} />
                    {job.company.size}
                  </Text>
                  <Text type="secondary">{job.company.industry}</Text>
                </Space>
                <Paragraph style={{ marginBottom: 0 }}>
                  {job.company.description}
                </Paragraph>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 右侧侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 匹配度分析 */}
          <Card title="AI 匹配度分析" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Progress
                type="circle"
                percent={job.matchRate}
                size={120}
                strokeColor={{ '0%': '#10b981', '100%': '#3b82f6' }}
                format={(percent) => `${percent}%`}
              />
              <div style={{ marginTop: 8, color: '#6b7280' }}>
                综合匹配度
              </div>
            </div>
            <Descriptions column={1} size="small">
              {job.matchDetails.map((item) => (
                <Descriptions.Item key={item.label} label={item.label}>
                  <Progress percent={item.value} size="small" />
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>

          {/* 公司信息卡片 */}
          <Card title="公司信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="公司名称">
                {job.company.name}
              </Descriptions.Item>
              <Descriptions.Item label="公司规模">
                {job.company.size}
              </Descriptions.Item>
              <Descriptions.Item label="所属行业">
                {job.company.industry}
              </Descriptions.Item>
              <Descriptions.Item label="公司地址">
                {job.company.address}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JobDetailPage;
