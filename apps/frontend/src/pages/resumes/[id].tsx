import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  Timeline,
  Breadcrumb,
  Empty,
  Spin,
  Descriptions,
} from 'antd';
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  BookOutlined,
  ApartmentOutlined,
  StarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { getResumeDetail } from '@api/resume.api';
import { ParseStatus } from '@app-types/resume.types';
import type { Resume } from '@app-types/resume.types';

const { Title, Text } = Typography;

/**
 * 简历详情页（真实数据）
 * 从后端 API 获取简历详情，展示 AI 解析后的结构化数据
 */
const ResumeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResume = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getResumeDetail(Number(id));
      setResume(data);
    } catch {
      setResume(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Empty description="简历不存在" />
        <Button type="link" onClick={() => navigate('/resumes')}>
          返回简历列表
        </Button>
      </div>
    );
  }

  // 从 parsedData 提取 AI 解析的额外信息
  const parsed = resume.parsedData || {};
  const personalInfo = parsed.personalInfo || parsed.basicInfo || {};
  const name = personalInfo.name || resume.title || '未知';
  const email = personalInfo.email || '';
  const phone = personalInfo.phone || '';
  const location = personalInfo.location || personalInfo.city || '';
  const summary = parsed.summary || parsed.selfIntroduction || '';

  // 解析状态提示
  const isParsed = resume.parseStatus === ParseStatus.COMPLETED;

  return (
    <div>
      {/* 面包屑 */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigate('/')}>首页</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/resumes')}>我的简历</Breadcrumb.Item>
        <Breadcrumb.Item>简历详情</Breadcrumb.Item>
      </Breadcrumb>

      {resume.parseStatus !== ParseStatus.COMPLETED && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ textAlign: 'center', padding: 16 }}>
            {resume.parseStatus === ParseStatus.PROCESSING && (
              <Spin tip="简历正在解析中，请稍后刷新查看..." />
            )}
            {resume.parseStatus === ParseStatus.PENDING && (
              <Text type="secondary">简历解析排队中，请稍后刷新查看</Text>
            )}
            {resume.parseStatus === ParseStatus.FAILED && (
              <Text type="danger">简历解析失败，请重新上传或手动编辑</Text>
            )}
            <Button type="link" onClick={fetchResume} style={{ marginLeft: 16 }}>
              刷新
            </Button>
          </div>
        </Card>
      )}

      <Row gutter={24}>
        {/* 左侧主内容 */}
        <Col xs={24} lg={16}>
          {/* 基本信息卡片 */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Space align="start" size={24}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 32,
                    fontWeight: 600,
                  }}
                >
                  {name.charAt(0)}
                </div>
                <div>
                  <Title level={3} style={{ marginBottom: 4 }}>
                    {name}
                  </Title>
                  {resume.title && (
                    <div style={{ fontSize: 16, color: '#3b82f6', fontWeight: 500, marginBottom: 8 }}>
                      {resume.title}
                    </div>
                  )}
                  <Space size={16} wrap>
                    {email && (
                      <Text type="secondary">
                        <MailOutlined style={{ marginRight: 4 }} />
                        {email}
                      </Text>
                    )}
                    {phone && (
                      <Text type="secondary">
                        <PhoneOutlined style={{ marginRight: 4 }} />
                        {phone}
                      </Text>
                    )}
                    {location && (
                      <Text type="secondary">
                        <EnvironmentOutlined style={{ marginRight: 4 }} />
                        {location}
                      </Text>
                    )}
                  </Space>
                </div>
              </Space>
              <Space>
                <Button icon={<EditOutlined />}>编辑</Button>
              </Space>
            </div>
          </Card>

          {/* 个人简介 */}
          {summary && (
            <Card title="个人简介" style={{ marginBottom: 16 }}>
              <p style={{ marginBottom: 0, lineHeight: 1.8, color: '#4b5563' }}>{summary}</p>
            </Card>
          )}

          {/* 工作经历 */}
          <Card title={<Space><ApartmentOutlined />工作经历</Space>} style={{ marginBottom: 16 }}>
            {resume.workExperiences && resume.workExperiences.length > 0 ? (
              <Timeline
                items={resume.workExperiences.map((exp, index) => ({
                  color: index === 0 ? 'blue' : 'gray',
                  children: (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <Title level={5} style={{ margin: 0 }}>
                          {exp.position}
                        </Title>
                        <Text type="secondary">
                          <CalendarOutlined style={{ marginRight: 4 }} />
                          {exp.startDate || '?'} - {exp.isCurrent ? '至今' : exp.endDate || '?'}
                        </Text>
                      </div>
                      <div style={{ color: '#3b82f6', fontWeight: 500, marginBottom: 8 }}>
                        {exp.companyName}
                      </div>
                      {exp.description && (
                        <div style={{ color: '#6b7280', marginBottom: 8 }}>
                          {exp.description}
                        </div>
                      )}
                      {exp.skills && exp.skills.length > 0 && (
                        <Space size={[4, 4]} wrap>
                          {exp.skills.map((s) => (
                            <Tag key={s} style={{ margin: 0 }}>{s}</Tag>
                          ))}
                        </Space>
                      )}
                    </div>
                  ),
                }))}
              />
            ) : (
              <Empty description={isParsed ? '暂无工作经历' : '简历解析后自动填充'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          {/* 教育经历 */}
          <Card title={<Space><BookOutlined />教育经历</Space>} style={{ marginBottom: 16 }}>
            {resume.educations && resume.educations.length > 0 ? (
              resume.educations.map((edu, index) => (
                <div key={edu.id || index} style={{ marginBottom: index === resume.educations!.length - 1 ? 0 : 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Title level={5} style={{ margin: 0 }}>
                      {edu.schoolName}
                    </Title>
                    <Text type="secondary">
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      {edu.startDate || '?'} - {edu.endDate || '?'}
                    </Text>
                  </div>
                  <div style={{ color: '#3b82f6', fontWeight: 500, marginBottom: 8 }}>
                    {edu.major || ''} {edu.degree ? `· ${edu.degree}` : ''}
                  </div>
                  {edu.description && (
                    <div style={{ color: '#6b7280' }}>{edu.description}</div>
                  )}
                </div>
              ))
            ) : (
              <Empty description={isParsed ? '暂无教育经历' : '简历解析后自动填充'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          {/* 项目经历 */}
          <Card title={<Space><TrophyOutlined />项目经历</Space>} style={{ marginBottom: 16 }}>
            {resume.projects && resume.projects.length > 0 ? (
              resume.projects.map((project, index) => (
                <div key={project.id || index} style={{ marginBottom: index === resume.projects!.length - 1 ? 0 : 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Title level={5} style={{ margin: 0 }}>
                      {project.name}
                    </Title>
                    {project.role && <Tag color="blue">{project.role}</Tag>}
                  </div>
                  <div style={{ color: '#6b7280', marginBottom: 8 }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {project.startDate || '?'} - {project.endDate || '?'}
                  </div>
                  {project.description && (
                    <div style={{ color: '#4b5563', marginBottom: 8 }}>{project.description}</div>
                  )}
                  {project.techStack && project.techStack.length > 0 && (
                    <Space size={[4, 4]} wrap>
                      {project.techStack.map((t) => (
                        <Tag key={t} style={{ margin: 0 }}>{t}</Tag>
                      ))}
                    </Space>
                  )}
                </div>
              ))
            ) : (
              <Empty description={isParsed ? '暂无项目经历' : '简历解析后自动填充'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* 右侧侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 技能标签 */}
          <Card title={<Space><StarOutlined />技能标签</Space>} style={{ marginBottom: 16 }}>
            {resume.skills && resume.skills.length > 0 ? (
              <Space size={[8, 8]} wrap>
                {resume.skills.map((skill) => (
                  <Tag key={skill} color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                    {skill}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Empty description={isParsed ? '暂无技能标签' : '简历解析后自动填充'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          {/* 简历元信息 */}
          <Card title="简历信息" style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="文件名">
                {resume.fileName || '—'}
              </Descriptions.Item>
              <Descriptions.Item label="解析状态">
                {resume.parseStatus === 'completed' ? '✅ 解析完成' :
                 resume.parseStatus === 'processing' ? '⏳ 解析中' :
                 resume.parseStatus === 'pending' ? '⏸️ 待解析' :
                 resume.parseStatus === 'failed' ? '❌ 解析失败' : resume.parseStatus}
              </Descriptions.Item>
              {resume.parseConfidence != null && (
                <Descriptions.Item label="解析置信度">
                  {Math.round(resume.parseConfidence)}%
                </Descriptions.Item>
              )}
              <Descriptions.Item label="默认简历">
                {resume.isDefault ? '是' : '否'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResumeDetailPage;
