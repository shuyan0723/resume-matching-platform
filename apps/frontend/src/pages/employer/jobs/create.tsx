import {
  Card,
  Button,
  Space,
  Typography,
  Form,
  Input,
  Select,
  Row,
  Col,
  InputNumber,
  Radio,
  Breadcrumb,
  message,
  Steps,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 企业端 - 创建职位页
 * 职位发布表单
 */
const EmployerJobCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const stepItems = [
    { title: '基本信息' },
    { title: '职位描述' },
    { title: '其他设置' },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('发布职位:', values);
      // TODO: 调用发布职位接口
      message.success('职位发布成功');
      navigate('/employer/jobs');
    } catch {
      // 表单验证失败
    }
  };

  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields();
      console.log('保存草稿:', values);
      // TODO: 调用保存草稿接口
      message.success('草稿保存成功');
    } catch {
      // 表单验证失败
    }
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      {/* 面包屑 */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigate('/employer/jobs')}>职位管理</Breadcrumb.Item>
        <Breadcrumb.Item>发布新职位</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        {/* 返回按钮和标题 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ padding: 0 }}
          />
          <Title level={3} style={{ margin: 0 }}>
            发布新职位
          </Title>
        </div>

        {/* 步骤条 */}
        <Steps current={currentStep} items={stepItems} style={{ marginBottom: 32 }} />

        {/* 表单 */}
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            salaryMin: 20,
            salaryMax: 35,
            experience: '3-5年',
            education: '本科',
            employmentType: 'fulltime',
            status: 'active',
          }}
          style={{ maxWidth: 800, margin: '0 auto' }}
        >
          {/* 步骤1: 基本信息 */}
          {currentStep === 0 && (
            <>
              <Row gutter={16}>
                <Col xs={24} sm={16}>
                  <Form.Item
                    label="职位名称"
                    name="title"
                    rules={[{ required: true, message: '请输入职位名称' }]}
                  >
                    <Input placeholder="如：高级前端工程师" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="所属部门"
                    name="department"
                    rules={[{ required: true, message: '请输入所属部门' }]}
                  >
                    <Input placeholder="如：技术部" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="薪资范围（K/月）" required>
                    <Input.Group compact style={{ display: 'flex' }}>
                      <Form.Item
                        name="salaryMin"
                        noStyle
                        rules={[{ required: true, message: '请输入最低薪资' }]}
                      >
                        <InputNumber min={1} max={200} style={{ width: '50%' }} placeholder="最低" />
                      </Form.Item>
                      <span style={{ padding: '0 8px', display: 'flex', alignItems: 'center' }}>-</span>
                      <Form.Item
                        name="salaryMax"
                        noStyle
                        rules={[{ required: true, message: '请输入最高薪资' }]}
                      >
                        <InputNumber min={1} max={200} style={{ width: '50%' }} placeholder="最高" />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="工作地点"
                    name="location"
                    rules={[{ required: true, message: '请选择工作地点' }]}
                  >
                    <Select size="large" placeholder="选择城市">
                      <Option value="北京">北京</Option>
                      <Option value="上海">上海</Option>
                      <Option value="深圳">深圳</Option>
                      <Option value="杭州">杭州</Option>
                      <Option value="广州">广州</Option>
                      <Option value="成都">成都</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="工作经验"
                    name="experience"
                    rules={[{ required: true, message: '请选择工作经验' }]}
                  >
                    <Select size="large">
                      <Option value="不限">不限</Option>
                      <Option value="应届">应届毕业生</Option>
                      <Option value="1年以内">1年以内</Option>
                      <Option value="1-3年">1-3年</Option>
                      <Option value="3-5年">3-5年</Option>
                      <Option value="5-10年">5-10年</Option>
                      <Option value="10年以上">10年以上</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="学历要求"
                    name="education"
                    rules={[{ required: true, message: '请选择学历要求' }]}
                  >
                    <Select size="large">
                      <Option value="不限">不限</Option>
                      <Option value="大专">大专</Option>
                      <Option value="本科">本科</Option>
                      <Option value="硕士">硕士</Option>
                      <Option value="博士">博士</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="招聘人数"
                    name="headcount"
                    rules={[{ required: true, message: '请输入招聘人数' }]}
                  >
                    <InputNumber min={1} max={100} size="large" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="职位标签">
                <Select
                  mode="tags"
                  size="large"
                  placeholder="输入后按回车添加标签"
                  style={{ width: '100%' }}
                  name="tags"
                />
              </Form.Item>

              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <Button type="primary" size="large" onClick={next}>
                  下一步
                </Button>
              </div>
            </>
          )}

          {/* 步骤2: 职位描述 */}
          {currentStep === 1 && (
            <>
              <Form.Item
                label="岗位职责"
                name="responsibilities"
                rules={[{ required: true, message: '请输入岗位职责' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="请输入岗位职责，每条一行"
                />
              </Form.Item>

              <Form.Item
                label="任职要求"
                name="requirements"
                rules={[{ required: true, message: '请输入任职要求' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="请输入任职要求，每条一行"
                />
              </Form.Item>

              <Form.Item label="福利待遇" name="benefits">
                <Select
                  mode="tags"
                  size="large"
                  placeholder="输入后按回车添加福利待遇"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <Button size="large" onClick={prev}>
                  上一步
                </Button>
                <Button type="primary" size="large" onClick={next}>
                  下一步
                </Button>
              </div>
            </>
          )}

          {/* 步骤3: 其他设置 */}
          {currentStep === 2 && (
            <>
              <Form.Item
                label="用工类型"
                name="employmentType"
                rules={[{ required: true, message: '请选择用工类型' }]}
              >
                <Radio.Group>
                  <Radio value="fulltime">全职</Radio>
                  <Radio value="parttime">兼职</Radio>
                  <Radio value="intern">实习</Radio>
                  <Radio value="contract">合同工</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="发布状态"
                name="status"
                rules={[{ required: true, message: '请选择发布状态' }]}
              >
                <Radio.Group>
                  <Radio value="active">立即发布</Radio>
                  <Radio value="paused">保存为草稿</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="截止日期" name="deadline">
                <Input type="date" size="large" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label="面试官（可选）" name="interviewers">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="选择面试官"
                  style={{ width: '100%' }}
                >
                  <Option value="1">张三（技术总监）</Option>
                  <Option value="2">李四（HR经理）</Option>
                  <Option value="3">王五（架构师）</Option>
                </Select>
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <Button size="large" onClick={prev}>
                  上一步</Button>
                <Space>
                  <Button size="large" icon={<SaveOutlined />} onClick={handleSaveDraft}>
                    保存草稿
                  </Button>
                  <Button type="primary" size="large" onClick={handleSubmit}>
                    发布职位
                  </Button>
                </Space>
              </div>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default EmployerJobCreatePage;
