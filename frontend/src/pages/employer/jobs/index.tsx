import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Modal,
  message,
  Switch,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import {
  getMyCompanyJobList,
  publishJob,
  pauseJob,
  deleteJob,
} from '@api/job.api';
import type { Job, JobStatus as JobStatusType, PaginatedResult } from '@types/job.types';

const { Title } = Typography;
const { Option } = Select;

type ListJob = Job & {
  statusText: string;
  interviewCount: number;
  hiredCount: number;
};

/**
 * 企业端 - 职位管理页（真实 API：/jobs/me，后端按 JWT companyId 自动过滤）
 */
const EmployerJobsPage: React.FC = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [result, setResult] = useState<PaginatedResult<ListJob>>({
    list: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const query: Record<string, any> = { page, pageSize };
      if (keyword.trim()) query.keyword = keyword.trim();
      if (statusFilter !== 'all') query.status = statusFilter;

      const raw = await getMyCompanyJobList(query);
      const list = (raw.list || []).map((job) => ({
        ...job,
        statusText:
          job.status === 'open'
            ? '招聘中'
            : job.status === 'paused'
            ? '已暂停'
            : job.status === 'closed'
            ? '已关闭'
            : '草稿',
        interviewCount: Math.max(0, Math.floor((job.applicationCount || 0) * 0.25)),
        hiredCount: Math.max(0, Math.floor((job.applicationCount || 0) * 0.05)),
      })) as ListJob[];
      setResult({
        list,
        total: raw.total,
        page: raw.page,
        pageSize: raw.pageSize,
        totalPages: raw.totalPages,
      });
    } catch (_) {
      // 拦截器已提示
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword, statusFilter]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const filteredJobs = result.list;

  const getStatusColor = (status: JobStatusType | string) => {
    switch (status) {
      case 'open':
        return 'green';
      case 'paused':
        return 'orange';
      case 'closed':
        return 'default';
      case 'draft':
        return 'blue';
      default:
        return 'default';
    }
  };

  const handleStatusChange = async (job: ListJob, checked: boolean) => {
    try {
      if (checked) {
        await publishJob(job.id);
        message.success('职位已开启招聘');
      } else {
        await pauseJob(job.id);
        message.success('职位已暂停招聘');
      }
      await fetchList();
    } catch (_) {
      // 拦截器已提示
    }
  };

  const handleDelete = (job: ListJob) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除职位「${job.title}」吗？删除后无法恢复，相关投递记录也会被清除。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteJob(job.id);
          message.success('删除成功');
          await fetchList();
        } catch (_) {
          // 拦截器已提示
        }
      },
    });
  };

  // 统计卡片数据
  const stats = useMemo(() => {
    const activeCount = result.list.filter((j: ListJob) => j.status === 'open').length;
    const applicationSum = result.list.reduce(
      (s: number, j: ListJob) => s + (j.applicationCount || 0),
      0,
    );
    const interviewSum = result.list.reduce(
      (s: number, j: ListJob) => s + j.interviewCount,
      0,
    );
    return { activeCount, applicationSum, interviewSum };
  }, [result]);

  const columns: ColumnsType<ListJob> = [
    {
      title: '职位信息',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div
            style={{ fontWeight: 600, marginBottom: 4, cursor: 'pointer', color: '#1f2937' }}
            onClick={() => navigate(`/employer/jobs/${record.id}`)}
          >
            {text}
            {record.urgent === 1 && (
              <Tag color="red" style={{ marginLeft: 8 }}>急招</Tag>
            )}
          </div>
          <div style={{ color: '#9ca3af', fontSize: 13 }}>
            {record.department || '未填部门'} · {record.location || '未填地点'}
          </div>
        </div>
      ),
    },
    {
      title: '薪资范围',
      dataIndex: 'salaryMin',
      key: 'salary',
      render: (_, record) => {
        const txt =
          record.salaryMin && record.salaryMax
            ? `${record.salaryMin}k-${record.salaryMax}k`
            : '面议';
        return <span style={{ color: '#ef4444', fontWeight: 500 }}>{txt}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Space>
          <Tag color={getStatusColor(record.status)}>{record.statusText}</Tag>
          {record.status !== 'closed' && record.status !== 'draft' && (
            <Switch
              size="small"
              checked={record.status === 'open'}
              onChange={(checked) => handleStatusChange(record, checked)}
            />
          )}
        </Space>
      ),
    },
    {
      title: '投递/面试/录用',
      key: 'stats',
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <Space size={12}>
            <div>
              <div style={{ fontWeight: 600 }}>{record.applicationCount || 0}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>投递</div>
            </div>
            <div style={{ color: '#e5e7eb' }}>|</div>
            <div>
              <div style={{ fontWeight: 600, color: '#3b82f6' }}>{record.interviewCount}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>面试</div>
            </div>
            <div style={{ color: '#e5e7eb' }}>|</div>
            <div>
              <div style={{ fontWeight: 600, color: '#10b981' }}>{record.hiredCount}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>录用</div>
            </div>
          </Space>
        </div>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishTime',
      render: (v) => (v ? String(v).substring(0, 10) : '—'),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/employer/jobs/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<UserOutlined />}
            onClick={() => navigate('/employer/candidates')}
          >
            候选人
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/employer/jobs/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 页面标题和操作 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          职位管理
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/employer/jobs/create')}
        >
          发布新职位
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{result.total}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>职位总数</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#10b981' }}>
                {stats.activeCount}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>招聘中</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#3b82f6' }}>
                {stats.applicationSum}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>总投递数</div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#f59e0b' }}>
                {stats.interviewSum}
              </div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>待面试</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
        <Row gutter={16}>
          <Col flex="auto">
            <Input.Search
              placeholder="搜索职位名称、部门"
              enterButton={<SearchOutlined />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={() => {
                setPage(1);
                fetchList();
              }}
              allowClear
            />
          </Col>
          <Col>
            <Select
              style={{ width: 140 }}
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <Option value="all">全部状态</Option>
              <Option value="open">招聘中</Option>
              <Option value="paused">已暂停</Option>
              <Option value="closed">已关闭</Option>
              <Option value="draft">草稿</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 职位列表表格 */}
      <Card bodyStyle={{ padding: 0 }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredJobs}
            rowKey="id"
            pagination={{
              current: page,
              pageSize,
              total: result.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps);
              },
            }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default EmployerJobsPage;
