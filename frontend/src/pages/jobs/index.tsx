import { useState } from 'react';
import {
  Input,
  Card,
  Tag,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Select,
  Slider,
  Radio,
  Empty,
} from 'antd';
import { SearchOutlined, StarOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * 职位列表页
 * 筛选条件 + 职位卡片列表
 */
const JobListPage: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  // 模拟职位列表数据
  const jobs = [
    {
      id: 1,
      title: '高级前端工程师',
      company: '科技有限公司',
      salary: '25k-40k',
      location: '北京',
      experience: '3-5年',
      education: '本科',
      tags: ['React', 'TypeScript', 'Node.js'],
      matchRate: 95,
    },
    {
      id: 2,
      title: '全栈开发工程师',
      company: '互联网创业公司',
      salary: '20k-35k',
      location: '上海',
      experience: '3-5年',
      education: '本科',
      tags: ['Vue', 'Python', 'MySQL'],
      matchRate: 88,
    },
    {
      id: 3,
      title: 'Java 后端工程师',
      company: '大型互联网公司',
      salary: '30k-50k',
      location: '深圳',
      experience: '5-10年',
      education: '本科',
      tags: ['Java', 'Spring', '微服务'],
      matchRate: 82,
    },
    {
      id: 4,
      title: '数据分析师',
      company: '金融科技公司',
      salary: '18k-30k',
      location: '杭州',
      experience: '1-3年',
      education: '本科',
      tags: ['Python', 'SQL', '数据分析'],
      matchRate: 76,
    },
    {
      id: 5,
      title: '产品经理',
      company: '互联网巨头',
      salary: '25k-45k',
      location: '北京',
      experience: '3-5年',
      education: '本科',
      tags: ['产品设计', '用户研究', '数据分析'],
      matchRate: 70,
    },
    {
      id: 6,
      title: 'UI/UX 设计师',
      company: '设计工作室',
      salary: '15k-25k',
      location: '广州',
      experience: '1-3年',
      education: '本科',
      tags: ['Figma', 'Sketch', '交互设计'],
      matchRate: 65,
    },
  ];

  const handleSearch = () => {
    // TODO: 调用搜索接口
    console.log('搜索关键词:', keyword);
  };

  return (
    <div>
      {/* 页面标题 */}
      <Title level={3} style={{ marginBottom: 24 }}>
        职位列表
      </Title>

      <Row gutter={24}>
        {/* 左侧筛选区 */}
        <Col xs={24} md={6}>
          <Card title={<Space><FilterOutlined />筛选条件</Space>}>
            {/* 工作地点 */}
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                工作地点
              </Text>
              <Select
                mode="multiple"
                placeholder="选择城市"
                style={{ width: '100%' }}
                size="middle"
              >
                <Option value="beijing">北京</Option>
                <Option value="shanghai">上海</Option>
                <Option value="shenzhen">深圳</Option>
                <Option value="hangzhou">杭州</Option>
                <Option value="guangzhou">广州</Option>
              </Select>
            </div>

            {/* 薪资范围 */}
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                薪资范围
              </Text>
              <Slider
                range
                min={5}
                max={100}
                defaultValue={[10, 50]}
                tooltip={{ formatter: (value) => `${value}k` }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: 12 }}>
                <span>5k</span>
                <span>100k+</span>
              </div>
            </div>

            {/* 工作经验 */}
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                工作经验
              </Text>
              <Radio.Group>
                <Radio value="不限">不限</Radio>
                <Radio value="fresh">应届</Radio>
                <Radio value="1-3">1-3年</Radio>
                <Radio value="3-5">3-5年</Radio>
                <Radio value="5+">5年以上</Radio>
              </Radio.Group>
            </div>

            {/* 学历要求 */}
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                学历要求
              </Text>
              <Radio.Group>
                <Radio value="不限">不限</Radio>
                <Radio value="大专">大专</Radio>
                <Radio value="本科">本科</Radio>
                <Radio value="硕士">硕士</Radio>
                <Radio value="博士">博士</Radio>
              </Radio.Group>
            </div>

            {/* 重置按钮 */}
            <Button block>重置筛选</Button>
          </Card>
        </Col>

        {/* 右侧职位列表 */}
        <Col xs={24} md={18}>
          {/* 搜索栏 */}
          <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
            <Row gutter={16}>
              <Col flex="auto">
                <Input.Search
                  size="large"
                  placeholder="搜索职位、公司或关键词"
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Col>
              <Col>
                <Select defaultValue="match" style={{ width: 140 }} size="large">
                  <Option value="match">匹配度优先</Option>
                  <Option value="latest">最新发布</Option>
                  <Option value="salary">薪资最高</Option>
                </Select>
              </Col>
            </Row>
          </Card>

          {/* 职位列表 */}
          {jobs.length > 0 ? (
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  hoverable
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  bodyStyle={{ padding: 20 }}
                >
                  <Row align="middle">
                    <Col flex="auto">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <Title level={5} style={{ margin: 0 }}>
                          {job.title}
                        </Title>
                        <Tag
                          icon={<StarOutlined />}
                          color="gold"
                          style={{ margin: 0 }}
                        >
                          匹配度 {job.matchRate}%
                        </Tag>
                      </div>
                      <div style={{ color: '#ef4444', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                        {job.salary}
                      </div>
                      <div style={{ color: '#6b7280', marginBottom: 12 }}>
                        {job.company} · {job.location} · {job.experience} · {job.education}
                      </div>
                      <Space size={[4, 8]} wrap>
                        {job.tags.map((tag) => (
                          <Tag key={tag} style={{ margin: 0 }}>
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </Col>
                    <Col>
                      <Button type="primary" size="large">
                        立即投递
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          ) : (
            <Card>
              <Empty description="暂无符合条件的职位" />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default JobListPage;
