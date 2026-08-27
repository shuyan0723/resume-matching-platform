import { useState, useEffect, useCallback } from 'react';
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
  Spin,
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  HourglassOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TabsProps } from 'antd';
import { getMyApplications, AppStatus } from '@api/application.api';
import type { ApplicationItem } from '@api/application.api';

const { Title, Text } = Typography;

// 状态 → 中文显示 + 颜色 + 图标
const statusConfig: Record<
  string,
  { text: string; color: string; icon: React.ReactNode }
> = {
  [AppStatus.APPLIED]: { text: '已投递', color: 'orange', icon: <HourglassOutlined /> },
  [AppStatus.VIEWED]: { text: '已查看', color: 'cyan', icon: <EyeOutlined /> },
  [AppStatus.SHORTLISTED]: { text: '已筛选', color: 'blue', icon: <ClockCircleOutlined /> },
  [AppStatus.INTERVIEW]: { text: '面试中', color: 'blue', icon: <ClockCircleOutlined /> },
  [AppStatus.OFFER]: { text: '已录用', color: 'green', icon: <CheckCircleOutlined /> },
  [AppStatus.REJECTED]: { text: '未通过', color: 'red', icon: <CloseCircleOutlined /> },
  [AppStatus.HIRED]: { text: '已入职', color: 'green', icon: <CheckCircleOutlined /> },
};

const formatSalary = (min: number | null, max: number | null) => {
  if (min != null && max != null) return `${min}k-${max}k`;
  if (min != null) return `${min}k+`;
  if (max != null) return `≤${max}k`;
  return '面议';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/**
 * 投递记录页（真实数据）
 */
const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // 根据状态筛选
  const filteredApplications =
    activeTab === 'all'
      ? applications
      : applications.filter((app) => app.status === activeTab);

  const tabItems: TabsProps['items'] = [
    { key: 'all', label: `全部 (${applications.length})` },
    { key: AppStatus.APPLIED, label: `已投递 (${applications.filter((a) => a.status === AppStatus.APPLIED).length})` },
    { key: AppStatus.INTERVIEW, label: `面试中 (${applications.filter((a) => a.status === AppStatus.INTERVIEW).length})` },
    { key: AppStatus.OFFER, label: `已录用 (${applications.filter((a) => a.status === AppStatus.OFFER).length})` },
    { key: AppStatus.REJECTED, label: `未通过 (${applications.filter((a) => a.status === AppStatus.REJECTED).length})` },
  ];

  return (
    <div>
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
                {applications.filter((a) => a.status === AppStatus.APPLIED).length}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>待处理</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#3b82f6' }}>
                {applications.filter((a) => a.status === AppStatus.INTERVIEW).length}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>面试中</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#10b981' }}>
                {applications.filter((a) => a.status === AppStatus.OFFER).length}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>已录用</div>
            </div>
          </Card>
        </Col>
      </Row>

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
          <Spin spinning={loading}>
            {filteredApplications.length > 0 ? (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {filteredApplications.map((app) => {
                  const cfg = statusConfig[app.status] || statusConfig[AppStatus.APPLIED];
                  const job = app.job;
                  return (
                    <Card
                      key={app.id}
                      hoverable
                      onClick={() => navigate(`/jobs/${app.jobId}`)}
                      bodyStyle={{ padding: 20 }}
                    >
                      <Row align="top">
                        <Col flex="auto">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <Title level={5} style={{ margin: 0 }}>
                              {job?.title || '未知职位'}
                            </Title>
                            <Tag icon={cfg.icon} color={cfg.color}>
                              {cfg.text}
                            </Tag>
                            {app.matchScore != null && (
                              <Tag color="gold">匹配度 {Math.round(Number(app.matchScore))}%</Tag>
                            )}
                          </div>
                          <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>
                            {job ? formatSalary(job.salaryMin, job.salaryMax) : '面议'}
                          </div>
                          <div style={{ color: '#6b7280', marginBottom: 12 }}>
                            {job?.company?.name || '未知公司'} · {job?.location || '不限'}
                          </div>
                          {/* 简化时间线 */}
                          <Timeline
                            size="small"
                            items={[
                              {
                                color: 'blue',
                                children: (
                                  <div>
                                    <Text strong>投递成功</Text>
                                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                                      {formatDate(app.appliedAt)}
                                    </div>
                                  </div>
                                ),
                              },
                              ...(app.status !== AppStatus.APPLIED
                                ? [{
                                    color: cfg.color as string,
                                    children: (
                                      <div>
                                        <Text strong>{cfg.text}</Text>
                                      </div>
                                    ),
                                  }]
                                : []),
                            ]}
                            style={{ marginBottom: 0 }}
                          />
                        </Col>
                        <Col>
                          <Space direction="vertical" size={8}>
                            <Button type="primary" icon={<EyeOutlined />}>
                              查看职位
                            </Button>
                            <div style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
                              投递于 {formatDate(app.appliedAt)}
                            </div>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              </Space>
            ) : (
              <div style={{ padding: '48px 0' }}>
                <Empty description={loading ? '加载中...' : '暂无投递记录'} />
              </div>
            )}
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationsPage;
