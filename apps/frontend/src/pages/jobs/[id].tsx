import { useState, useEffect, useCallback } from 'react';
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
  Spin,
  Empty,
  message,
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
import { getJobDetail } from '@api/job.api';
import { getResumeList, getMatchDetail } from '@api/resume.api';
import { applyJob } from '@api/application.api';
import type { Job } from '@app-types/job.types';

const { Title, Paragraph, Text } = Typography;

const formatSalary = (min: number | null, max: number | null) => {
  if (min != null && max != null) return `${min}k-${max}k`;
  if (min != null) return `${min}k+`;
  if (max != null) return `≤${max}k`;
  return '面议';
};

const educationText: Record<string, string> = {
  high_school: '高中',
  college: '大专',
  bachelor: '本科',
  master: '硕士',
  phd: '博士',
};

/**
 * 职位详情页（真实数据）
 */
const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState<any>(null);
  const [applying, setApplying] = useState(false);

  const fetchJob = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getJobDetail(Number(id));
      setJob(data);
    } catch {
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMatch = useCallback(async () => {
    if (!id) return;
    try {
      const resumes = await getResumeList();
      const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];
      if (!defaultResume) return;
      const detail = await getMatchDetail({
        resumeId: defaultResume.id,
        jobId: Number(id),
      });
      setMatchData(detail);
    } catch {
      // 没有简历或匹配失败，不显示匹配度
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
    fetchMatch();
  }, [fetchJob, fetchMatch]);

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      const resumes = await getResumeList();
      const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];
      if (!defaultResume) {
        message.warning('请先上传简历后再投递');
        navigate('/resumes');
        return;
      }
      await applyJob({
        jobId: job.id,
        resumeId: defaultResume.id,
        companyId: job.companyId,
      });
      message.success('投递成功！');
    } catch (err: any) {
      message.error(err?.message || '投递失败，请稍后重试');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Empty description="职位不存在或已下线" />
        <Button type="link" onClick={() => navigate('/jobs')}>
          返回职位列表
        </Button>
      </div>
    );
  }

  const company = job.company;

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
                  {job.urgent ? (
                    <Tag icon={<StarOutlined />} color="gold" style={{ fontSize: 14, padding: '2px 8px' }}>
                      急聘
                    </Tag>
                  ) : null}
                </div>
                <div style={{ color: '#ef4444', fontWeight: 600, fontSize: 24, marginBottom: 12 }}>
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
                <Space size={16} wrap style={{ marginBottom: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280' }}>
                    <EnvironmentOutlined /> {job.location || '不限'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280' }}>
                    <ClockCircleOutlined /> {job.experienceMin ? `${job.experienceMin}年以上` : '经验不限'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280' }}>
                    <BankOutlined /> {job.educationRequirement ? educationText[job.educationRequirement] || job.educationRequirement : '学历不限'}
                  </span>
                </Space>
                <Space size={[4, 8]} wrap>
                  {(job.requiredSkills || []).map((tag) => (
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
                loading={applying}
                onClick={handleApply}
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
              {job.description || '暂无描述'}
            </Paragraph>
          </Card>

          {/* 公司介绍 */}
          {company && (
            <Card title="公司介绍">
              <Space align="start" size={16}>
                <Avatar size={64} style={{ backgroundColor: '#3b82f6', fontSize: 24 }}>
                  {company.name?.charAt(0) || '?'}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ marginBottom: 8 }}>
                    {company.name}
                  </Title>
                  <Space size={16} style={{ marginBottom: 12 }}>
                    {company.size && (
                      <Text type="secondary">
                        <TeamOutlined style={{ marginRight: 4 }} />
                        {company.size}
                      </Text>
                    )}
                    {company.industry && <Text type="secondary">{company.industry}</Text>}
                  </Space>
                </div>
              </Space>
            </Card>
          )}
        </Col>

        {/* 右侧侧边栏 */}
        <Col xs={24} lg={8}>
          {/* AI 匹配度分析 */}
          {matchData && (
            <Card title="AI 匹配度分析" style={{ marginBottom: 16 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Progress
                  type="circle"
                  percent={Math.round(matchData.overallScore || 0)}
                  size={120}
                  strokeColor={{ '0%': '#10b981', '100%': '#3b82f6' }}
                  format={(percent) => `${percent}%`}
                />
                <div style={{ marginTop: 8, color: '#6b7280' }}>
                  综合匹配度
                </div>
              </div>
              <Descriptions column={1} size="small">
                {matchData.details && (
                  <>
                    <Descriptions.Item label="技能匹配">
                      <Progress percent={Math.round(matchData.details.skillMatch || 0)} size="small" />
                    </Descriptions.Item>
                    <Descriptions.Item label="经验匹配">
                      <Progress percent={Math.round(matchData.details.experienceMatch || 0)} size="small" />
                    </Descriptions.Item>
                    <Descriptions.Item label="学历匹配">
                      <Progress percent={Math.round(matchData.details.educationMatch || 0)} size="small" />
                    </Descriptions.Item>
                    <Descriptions.Item label="薪资匹配">
                      <Progress percent={Math.round(matchData.details.salaryMatch || 0)} size="small" />
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
              {matchData.reason && (
                <div style={{ marginTop: 16, color: '#4b5563', fontSize: 13, lineHeight: 1.6 }}>
                  {matchData.reason}
                </div>
              )}
            </Card>
          )}

          {/* 公司信息卡片 */}
          {company && (
            <Card title="公司信息">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="公司名称">
                  {company.name}
                </Descriptions.Item>
                {company.size && (
                  <Descriptions.Item label="公司规模">
                    {company.size}
                  </Descriptions.Item>
                )}
                {company.industry && (
                  <Descriptions.Item label="所属行业">
                    {company.industry}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default JobDetailPage;
