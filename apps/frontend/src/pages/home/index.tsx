import { useState, useEffect, useCallback } from 'react';
import { Input, Card, Tag, Button, Space, Typography, Row, Col, Spin, Empty } from 'antd';
import { SearchOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getJobList } from '@api/job.api';
import type { Job } from '@app-types/job.types';

const { Title, Paragraph } = Typography;

/**
 * 首页/岗位推荐页
 * 展示搜索框和推荐岗位列表（真实数据）
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getJobList({ pageSize: 8 });
      setJobs(res.list || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (value: string) => {
    navigate(`/jobs?keyword=${encodeURIComponent(value)}`);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (min != null && max != null) return `${min}k-${max}k`;
    if (min != null) return `${min}k+`;
    if (max != null) return `≤${max}k`;
    return '面议';
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
            热门职位
          </Title>
        </Space>
        <Button type="link" onClick={() => navigate('/jobs')}>
          查看更多 →
        </Button>
      </div>

      {/* 推荐岗位列表 */}
      <Spin spinning={loading}>
        {jobs.length > 0 ? (
          <Row gutter={[16, 16]}>
            {jobs.map((job) => (
              <Col xs={24} md={12} lg={6} key={job.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  style={{ height: '100%' }}
                  bodyStyle={{ padding: 20 }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {job.urgent ? (
                        <Tag icon={<StarOutlined />} color="gold" style={{ margin: 0 }}>
                          急聘
                        </Tag>
                      ) : (
                        <Tag style={{ margin: 0 }}>{job.department || '全职'}</Tag>
                      )}
                    </div>
                  </div>
                  <Title level={5} style={{ marginBottom: 8 }}>
                    {job.title}
                  </Title>
                  <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 12 }}>
                    {job.company?.name || '未知公司'} · {job.location || '不限'}
                  </div>
                  <Space size={[4, 8]} wrap>
                    {(job.requiredSkills || []).slice(0, 3).map((tag) => (
                      <Tag key={tag} style={{ margin: 0 }}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="暂无在招职位" style={{ padding: 48 }} />
        )}
      </Spin>
    </div>
  );
};

export default HomePage;
