import { Input, Card, Tag, Button, Space, Typography, Row, Col } from 'antd';
import { SearchOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

/**
 * 首页/岗位推荐页
 * 展示搜索框和推荐岗位列表
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // 模拟推荐岗位数据
  const recommendedJobs = [
    {
      id: 1,
      title: '高级前端工程师',
      company: '科技有限公司',
      salary: '25k-40k',
      location: '北京',
      tags: ['React', 'TypeScript', 'Node.js'],
      matchRate: 95,
    },
    {
      id: 2,
      title: '全栈开发工程师',
      company: '互联网创业公司',
      salary: '20k-35k',
      location: '上海',
      tags: ['Vue', 'Python', 'MySQL'],
      matchRate: 88,
    },
    {
      id: 3,
      title: 'Java 后端工程师',
      company: '大型互联网公司',
      salary: '30k-50k',
      location: '深圳',
      tags: ['Java', 'Spring', '微服务'],
      matchRate: 82,
    },
    {
      id: 4,
      title: '数据分析师',
      company: '金融科技公司',
      salary: '18k-30k',
      location: '杭州',
      tags: ['Python', 'SQL', '数据分析'],
      matchRate: 76,
    },
  ];

  const handleSearch = (value: string) => {
    navigate(`/jobs?keyword=${encodeURIComponent(value)}`);
  };

  return (
    <div>
      {/* 搜索区域 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: 16,
          padding: '48px 32px',
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        <Title level={2} style={{ color: '#fff', marginBottom: 8 }}>
          找到最适合你的工作
        </Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: 32 }}>
          AI 智能匹配，让求职更高效
        </Paragraph>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Input.Search
            size="large"
            placeholder="搜索职位、公司或关键词"
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ borderRadius: 8 }}
          />
        </div>
      </div>

      {/* 热门推荐 */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <FireOutlined style={{ color: '#ef4444', fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>
            为你推荐
          </Title>
        </Space>
        <Button type="link" onClick={() => navigate('/jobs')}>
          查看更多 →
        </Button>
      </div>

      {/* 推荐岗位列表 */}
      <Row gutter={[16, 16]}>
        {recommendedJobs.map((job) => (
          <Col xs={24} md={12} lg={6} key={job.id}>
            <Card
              hoverable
              onClick={() => navigate(`/jobs/${job.id}`)}
              style={{ height: '100%' }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Tag
                    icon={<StarOutlined />}
                    color="gold"
                    style={{ margin: 0 }}
                  >
                    匹配度 {job.matchRate}%
                  </Tag>
                </div>
              </div>
              <Title level={5} style={{ marginBottom: 8 }}>
                {job.title}
              </Title>
              <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>
                {job.salary}
              </div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 12 }}>
                {job.company} · {job.location}
              </div>
              <Space size={[4, 8]} wrap>
                {job.tags.map((tag) => (
                  <Tag key={tag} style={{ margin: 0 }}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;
