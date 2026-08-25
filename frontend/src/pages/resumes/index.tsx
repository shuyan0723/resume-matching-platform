import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Upload,
  Tag,
  Modal,
  Empty,
  message,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadProps } from 'antd';
import {
  getResumeList,
  uploadResume,
  deleteResume,
  setDefaultResume,
} from '@api/resume.api';
import type { Resume, ParseStatus } from '@types/resume.types';

const { Title } = Typography;

/**
 * 我的简历页
 * 真实调用后端 API：列表 / 上传 / 删除 / 设默认
 */
const ResumeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return iso.substring(0, 10);
  };

  const parseStatusTag = (s: ParseStatus) => {
    switch (s) {
      case 'completed':
        return <Tag color="green" style={{ margin: 0 }}>已解析</Tag>;
      case 'processing':
        return <Tag color="processing" style={{ margin: 0 }}>解析中</Tag>;
      case 'failed':
        return <Tag color="red" style={{ margin: 0 }}>解析失败</Tag>;
      default:
        return <Tag color="orange" style={{ margin: 0 }}>待解析</Tag>;
    }
  };

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResumeList();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      // request 拦截器已经弹过错误
      setResumes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setUploading(true);
        await uploadResume(file as File);
        message.success(`${file.name} 上传成功，已进入 AI 解析队列`);
        setUploadVisible(false);
        await fetchList();
        onSuccess?.(file);
      } catch (err: any) {
        message.error(err?.message || `${file.name} 上传失败`);
        onError?.(err);
      } finally {
        setUploading(false);
      }
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB');
        return Upload.LIST_IGNORE;
      }
      const okExt = /\.(pdf|doc|docx)$/i.test(file.name);
      if (!okExt) {
        message.error('仅支持 PDF / DOC / DOCX 格式');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
  };

  const handleDelete = (resume: Resume) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除简历「${resume.title}」吗？将同时删除解析结果、关联经历与原文件，删除后无法恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteResume(resume.id);
          message.success('删除成功');
          await fetchList();
        } catch (_) {
          // 拦截器已提示
        }
      },
    });
  };

  const handleSetDefault = async (resume: Resume, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resume.isDefault === 1) return;
    try {
      await setDefaultResume(resume.id);
      message.success('已设为默认简历');
      await fetchList();
    } catch (_) {
      // 拦截器已提示
    }
  };

  const parsedCount = resumes.filter((r) => r.parseStatus === 'completed').length;

  return (
    <div>
      {/* 页面标题和操作 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          我的简历
        </Title>
        <Space>
          <Button icon={<UploadOutlined />} onClick={() => setUploadVisible(true)}>
            上传简历
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            新建简历
          </Button>
        </Space>
      </div>

      {/* 简历统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: '#3b82f6' }}>{resumes.length}</div>
              <div style={{ color: '#6b7280' }}>简历总数</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: '#10b981' }}>
                {parsedCount}
              </div>
              <div style={{ color: '#6b7280' }}>已解析</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: '#f59e0b' }}>
                {resumes.reduce((acc, r) => acc + (r.parseStatus === 'completed' ? 1 : 0), 0) * 3}
              </div>
              <div style={{ color: '#6b7280' }}>智能匹配机会</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 简历列表 */}
      {loading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin tip="加载中..." />
          </div>
        </Card>
      ) : resumes.length > 0 ? (
        <Row gutter={[16, 16]}>
          {resumes.map((resume) => (
            <Col xs={24} md={12} lg={8} key={resume.id}>
              <Card
                hoverable
                onClick={() => navigate(`/resumes/${resume.id}`)}
                actions={[
                  <EyeOutlined key="view" onClick={(e) => { e.stopPropagation(); navigate(`/resumes/${resume.id}`); }} />,
                  <EditOutlined key="edit" onClick={(e) => { e.stopPropagation(); navigate(`/resumes/${resume.id}`); }} />,
                  resume.isDefault === 1 ? (
                    <StarOutlined key="default" style={{ color: '#3b82f6' }} />
                  ) : (
                    <StarOutlined
                      key="set-default"
                      onClick={(e) => handleSetDefault(resume, e)}
                      title="设为默认"
                    />
                  ),
                  <DeleteOutlined
                    key="delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(resume); }}
                  />,
                ]}
              >
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3b82f6',
                        fontSize: 24,
                      }}
                    >
                      <FileTextOutlined />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        {resume.title}
                        {resume.isDefault === 1 && (
                          <Tag color="blue" style={{ marginLeft: 8 }}>默认</Tag>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>
                        {resume.fileName}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
                  <span>大小：{formatSize(resume.fileSize)}</span>
                  <span>{formatDate(resume.createdAt)}</span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {parseStatusTag(resume.parseStatus)}
                  {resume.parseStatus === 'completed' && resume.parseConfidence != null && (
                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                      置信度 {resume.parseConfidence}%
                    </span>
                  )}
                </div>
                {Array.isArray(resume.skills) && resume.skills.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {resume.skills.slice(0, 4).map((s, idx) => (
                      <Tag key={idx} style={{ margin: '2px 4px 2px 0' }}>{s}</Tag>
                    ))}
                    {resume.skills.length > 4 && (
                      <Tag style={{ margin: '2px 4px 2px 0' }}>+{resume.skills.length - 4}</Tag>
                    )}
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Empty
            description="暂无简历"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadVisible(true)}>
              上传第一份简历
            </Button>
          </Empty>
        </Card>
      )}

      {/* 上传简历弹窗 */}
      <Modal
        title="上传简历"
        open={uploadVisible}
        onCancel={() => !uploading && setUploadVisible(false)}
        footer={null}
        maskClosable={!uploading}
        destroyOnClose
      >
        <Spin spinning={uploading} tip="上传并投递至 AI 解析队列中...">
          <Upload.Dragger {...uploadProps} style={{ padding: 24 }}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: '#3b82f6' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持 PDF、Word 格式，单个文件不超过 10MB<br />
              <span style={{ color: '#6b7280' }}>
                上传完成后将自动进入 AI 解析队列，提取工作经历、教育经历、技能标签
              </span>
            </p>
          </Upload.Dragger>
        </Spin>
      </Modal>
    </div>
  );
};

export default ResumeListPage;
