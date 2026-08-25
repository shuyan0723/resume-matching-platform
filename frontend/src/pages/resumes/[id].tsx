import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Descriptions,
  Tag,
  Divider,
  Timeline,
  Breadcrumb,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DownloadOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  BookOutlined,
  ApartmentOutlined,
  StarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * 简历详情页
 * 结构化展示简历内容 + 编辑功能
 */
const ResumeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 模拟简历详情数据
  const resume = {
    id,
    name: '张三',
    title: '高级前端工程师',
    avatar: '',
    email: 'zhangsan@example.com',
    phone: '138****8888',
    location: '北京市海淀区',
    birthday: '1995-06-15',
    gender: '男',
    summary: '5年前端开发经验，精通 React 生态体系，熟悉前端工程化和性能优化。具备良好的团队协作能力和问题解决能力，对新技术保持热情。',
    skills: [
      { name: 'React', level: '精通' },
      { name: 'TypeScript', level: '精通' },
      { name: 'Vue', level: '熟练' },
      { name: 'Node.js', level: '熟练' },
      { name: 'Webpack/Vite', level: '熟练' },
      { name: 'CSS/Sass/Less', level: '精通' },
    ],
    education: [
      {
        school: '北京大学',
        major: '计算机科学与技术',
        degree: '本科',
        startDate: '2013-09',
        endDate: '2017-06',
        description: 'GPA: 3.8/4.0，获得国家奖学金，优秀毕业生',
      },
    ],
    experience: [
      {
        company: '字节跳动',
        position: '高级前端工程师',
        startDate: '2021-03',
        endDate: '至今',
        description: '负责抖音电商前端架构设计与核心功能开发',
        highlights: [
          '主导电商首页重构，页面加载速度提升 40%',
          '搭建前端监控系统，线上问题发现率提升 60%',
          '带领 5 人小组完成多个重点项目交付',
        ],
      },
      {
        company: '阿里巴巴',
        position: '前端工程师',
        startDate: '2019-07',
        endDate: '2021-02',
        description: '负责淘宝商家后台系统开发',
        highlights: [
          '参与商家数据看板开发，日活用户超 100 万',
          '优化复杂表单性能，渲染速度提升 50%',
          '沉淀通用组件库，提升团队开发效率 30%',
        ],
      },
      {
        company: '美团',
        position: '前端开发实习生',
        startDate: '2017-07',
        endDate: '2019-06',
        description: '参与外卖商家端 H5 页面开发',
        highlights: [
          '独立完成 20+ 个业务页面开发',
          '参与移动端性能优化专项',
        ],
      },
    ],
    projects: [
      {
        name: '电商直播系统',
        role: '前端负责人',
        startDate: '2022-01',
        endDate: '2022-12',
        description: '从零搭建电商直播前端系统，支持千万级并发',
        highlights: ['直播延迟低于 1s', '支持 1000 万+ 同时在线', '获公司年度技术创新奖'],
      },
    ],
    certifications: [
      'AWS 认证解决方案架构师',
      '前端工程化专家认证',
    ],
    languages: ['中文（母语）', '英语（流利）'],
  };

  const getSkillColor = (level: string) => {
    switch (level) {
      case '精通':
        return 'red';
      case '熟练':
        return 'blue';
      case '了解':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div>
      {/* 面包屑 */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigate('/')}>首页</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/resumes')}>我的简历</Breadcrumb.Item>
        <Breadcrumb.Item>简历详情</Breadcrumb.Item>
      </Breadcrumb>

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
                  {resume.name.charAt(0)}
                </div>
                <div>
                  <Title level={3} style={{ marginBottom: 4 }}>
                    {resume.name}
                  </Title>
                  <div style={{ fontSize: 16, color: '#3b82f6', fontWeight: 500, marginBottom: 8 }}>
                    {resume.title}
                  </div>
                  <Space size={16} wrap>
                    <Text type="secondary">
                      <MailOutlined style={{ marginRight: 4 }} />
                      {resume.email}
                    </Text>
                    <Text type="secondary">
                      <PhoneOutlined style={{ marginRight: 4 }} />
                      {resume.phone}
                    </Text>
                    <Text type="secondary">
                      <EnvironmentOutlined style={{ marginRight: 4 }} />
                      {resume.location}
                    </Text>
                  </Space>
                </div>
              </Space>
              <Space>
                <Button icon={<EditOutlined />}>编辑</Button>
                <Button icon={<DownloadOutlined />}>下载</Button>
              </Space>
            </div>
          </Card>

          {/* 个人简介 */}
          <Card title="个人简介" style={{ marginBottom: 16 }}>
            <p style={{ marginBottom: 0, lineHeight: 1.8, color: '#4b5563' }}>{resume.summary}</p>
          </Card>

          {/* 工作经历 */}
          <Card title={<Space><ApartmentOutlined />工作经历</Space>} style={{ marginBottom: 16 }}>
            <Timeline
              items={resume.experience.map((exp, index) => ({
                color: index === 0 ? 'blue' : 'gray',
                children: (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Title level={5} style={{ margin: 0 }}>
                        {exp.position}
                      </Title>
                      <Text type="secondary">
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {exp.startDate} - {exp.endDate}
                      </Text>
                    </div>
                    <div style={{ color: '#3b82f6', fontWeight: 500, marginBottom: 8 }}>
                      {exp.company}
                    </div>
                    <div style={{ color: '#6b7280', marginBottom: 8 }}>
                      {exp.description}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 20, color: '#4b5563' }}>
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                ),
              }))}
            />
          </Card>

          {/* 教育经历 */}
          <Card title={<Space><BookOutlined />教育经历</Space>} style={{ marginBottom: 16 }}>
            {resume.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: index === resume.education.length - 1 ? 0 : 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {edu.school}
                  </Title>
                  <Text type="secondary">
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {edu.startDate} - {edu.endDate}
                  </Text>
                </div>
                <div style={{ color: '#3b82f6', fontWeight: 500, marginBottom: 8 }}>
                  {edu.major} · {edu.degree}
                </div>
                <div style={{ color: '#6b7280' }}>{edu.description}</div>
              </div>
            ))}
          </Card>

          {/* 项目经历 */}
          <Card title={<Space><TrophyOutlined />项目经历</Space>} style={{ marginBottom: 16 }}>
            {resume.projects.map((project, index) => (
              <div key={index} style={{ marginBottom: index === resume.projects.length - 1 ? 0 : 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {project.name}
                  </Title>
                  <Tag color="blue">{project.role}</Tag>
                </div>
                <div style={{ color: '#6b7280', marginBottom: 8 }}>
                  <CalendarOutlined style={{ marginRight: 4 }} />
                  {project.startDate} - {project.endDate}
                </div>
                <div style={{ color: '#4b5563', marginBottom: 8 }}>{project.description}</div>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#4b5563' }}>
                  {project.highlights.map((highlight, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Card>
        </Col>

        {/* 右侧侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 技能标签 */}
          <Card title={<Space><StarOutlined />技能标签</Space>} style={{ marginBottom: 16 }}>
            <Space size={[8, 8]} wrap>
              {resume.skills.map((skill) => (
                <Tag key={skill.name} color={getSkillColor(skill.level)} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {skill.name} · {skill.level}
                </Tag>
              ))}
            </Space>
          </Card>

          {/* 证书 */}
          <Card title="证书资质" style={{ marginBottom: 16 }}>
            {resume.certifications.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {resume.certifications.map((cert, index) => (
                  <li key={index} style={{ marginBottom: 8, color: '#4b5563' }}>{cert}</li>
                ))}
              </ul>
            ) : (
              <Empty description="暂无证书" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          {/* 语言能力 */}
          <Card title="语言能力">
            {resume.languages.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {resume.languages.map((lang, index) => (
                  <li key={index} style={{ marginBottom: 8, color: '#4b5563' }}>{lang}</li>
                ))}
              </ul>
            ) : (
              <Empty description="暂无语言信息" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResumeDetailPage;
