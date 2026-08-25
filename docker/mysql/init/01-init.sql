-- 初始化数据库脚本
-- MySQL 8.0

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS resume_match DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE resume_match;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE COMMENT '邮箱',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  nickname VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  avatar VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  role ENUM('candidate', 'employer', 'admin') NOT NULL DEFAULT 'candidate' COMMENT '用户角色',
  phone VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active' COMMENT '状态',
  email_verified_at TIMESTAMP NULL DEFAULT NULL COMMENT '邮箱验证时间',
  last_login_at TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 企业信息表
CREATE TABLE IF NOT EXISTS companies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL COMMENT '关联用户ID',
  name VARCHAR(200) NOT NULL COMMENT '公司名称',
  logo VARCHAR(500) DEFAULT NULL COMMENT '公司Logo',
  industry VARCHAR(100) DEFAULT NULL COMMENT '所属行业',
  size VARCHAR(50) DEFAULT NULL COMMENT '公司规模',
  website VARCHAR(255) DEFAULT NULL COMMENT '官网',
  description TEXT COMMENT '公司简介',
  address VARCHAR(500) DEFAULT NULL COMMENT '公司地址',
  verified TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否认证',
  verified_at TIMESTAMP NULL DEFAULT NULL COMMENT '认证时间',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_name (name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='企业信息表';

-- 求职者信息表
CREATE TABLE IF NOT EXISTS candidates (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL COMMENT '关联用户ID',
  name VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
  gender ENUM('male', 'female', 'other') DEFAULT NULL COMMENT '性别',
  birth_date DATE DEFAULT NULL COMMENT '出生日期',
  location VARCHAR(100) DEFAULT NULL COMMENT '所在城市',
  expected_position VARCHAR(100) DEFAULT NULL COMMENT '期望职位',
  expected_salary_min INT DEFAULT NULL COMMENT '期望薪资下限（K）',
  expected_salary_max INT DEFAULT NULL COMMENT '期望薪资上限（K）',
  expected_city VARCHAR(100) DEFAULT NULL COMMENT '期望城市',
  job_status ENUM('looking', 'considering', 'not_looking') DEFAULT 'looking' COMMENT '求职状态',
  work_years DECIMAL(3,1) DEFAULT 0 COMMENT '工作年限',
  highest_education ENUM('high_school', 'college', 'bachelor', 'master', 'phd') DEFAULT NULL COMMENT '最高学历',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_expected_position (expected_position),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='求职者信息表';

-- 简历表
CREATE TABLE IF NOT EXISTS resumes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT UNSIGNED NOT NULL COMMENT '求职者ID',
  title VARCHAR(200) NOT NULL COMMENT '简历标题',
  file_name VARCHAR(255) DEFAULT NULL COMMENT '原始文件名',
  file_path VARCHAR(500) DEFAULT NULL COMMENT '文件存储路径',
  file_size INT DEFAULT NULL COMMENT '文件大小（字节）',
  file_type VARCHAR(20) DEFAULT NULL COMMENT '文件类型',
  parse_status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending' COMMENT '解析状态',
  parse_confidence DECIMAL(5,2) DEFAULT NULL COMMENT '解析置信度',
  is_default TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认简历',
  parsed_data JSON DEFAULT NULL COMMENT '解析后的结构化数据',
  skills JSON DEFAULT NULL COMMENT '技能标签数组',
  resume_vector TEXT DEFAULT NULL COMMENT '简历向量（用于匹配）',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_candidate_id (candidate_id),
  INDEX idx_parse_status (parse_status),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='简历表';

-- 工作经历表
CREATE TABLE IF NOT EXISTS work_experiences (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  resume_id INT UNSIGNED NOT NULL COMMENT '简历ID',
  company_name VARCHAR(200) NOT NULL COMMENT '公司名称',
  position VARCHAR(100) NOT NULL COMMENT '职位',
  start_date DATE DEFAULT NULL COMMENT '开始时间',
  end_date DATE DEFAULT NULL COMMENT '结束时间',
  is_current TINYINT(1) DEFAULT 0 COMMENT '是否在职',
  description TEXT COMMENT '工作描述',
  skills JSON DEFAULT NULL COMMENT '使用的技能',
  sort_order INT DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_resume_id (resume_id),
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工作经历表';

-- 教育经历表
CREATE TABLE IF NOT EXISTS educations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  resume_id INT UNSIGNED NOT NULL COMMENT '简历ID',
  school_name VARCHAR(200) NOT NULL COMMENT '学校名称',
  degree VARCHAR(50) DEFAULT NULL COMMENT '学位',
  major VARCHAR(100) DEFAULT NULL COMMENT '专业',
  start_date DATE DEFAULT NULL COMMENT '开始时间',
  end_date DATE DEFAULT NULL COMMENT '结束时间',
  description TEXT COMMENT '描述',
  gpa DECIMAL(3,2) DEFAULT NULL COMMENT 'GPA',
  sort_order INT DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_resume_id (resume_id),
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教育经历表';

-- 项目经历表
CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  resume_id INT UNSIGNED NOT NULL COMMENT '简历ID',
  name VARCHAR(200) NOT NULL COMMENT '项目名称',
  role VARCHAR(100) DEFAULT NULL COMMENT '担任角色',
  start_date DATE DEFAULT NULL COMMENT '开始时间',
  end_date DATE DEFAULT NULL COMMENT '结束时间',
  description TEXT COMMENT '项目描述',
  tech_stack JSON DEFAULT NULL COMMENT '技术栈',
  sort_order INT DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_resume_id (resume_id),
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目经历表';

-- 职位表
CREATE TABLE IF NOT EXISTS jobs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id INT UNSIGNED NOT NULL COMMENT '公司ID',
  title VARCHAR(200) NOT NULL COMMENT '职位名称',
  department VARCHAR(100) DEFAULT NULL COMMENT '所属部门',
  location VARCHAR(100) DEFAULT NULL COMMENT '工作地点',
  salary_min INT DEFAULT NULL COMMENT '薪资下限（K）',
  salary_max INT DEFAULT NULL COMMENT '薪资上限（K）',
  experience_min DECIMAL(3,1) DEFAULT NULL COMMENT '经验要求下限（年）',
  experience_max DECIMAL(3,1) DEFAULT NULL COMMENT '经验要求上限（年）',
  education_requirement ENUM('high_school', 'college', 'bachelor', 'master', 'phd') DEFAULT NULL COMMENT '学历要求',
  job_type ENUM('full_time', 'part_time', 'internship', 'remote') DEFAULT 'full_time' COMMENT '工作类型',
  description TEXT COMMENT '职位描述（JD）',
  requirements JSON DEFAULT NULL COMMENT '提取的结构化要求',
  required_skills JSON DEFAULT NULL COMMENT '必备技能',
  preferred_skills JSON DEFAULT NULL COMMENT '加分技能',
  job_vector TEXT DEFAULT NULL COMMENT '职位向量（用于匹配）',
  status ENUM('draft', 'open', 'paused', 'closed') NOT NULL DEFAULT 'draft' COMMENT '职位状态',
  view_count INT UNSIGNED DEFAULT 0 COMMENT '浏览次数',
  application_count INT UNSIGNED DEFAULT 0 COMMENT '投递数量',
  urgent TINYINT(1) DEFAULT 0 COMMENT '是否急招',
  published_at TIMESTAMP NULL DEFAULT NULL COMMENT '发布时间',
  closed_at TIMESTAMP NULL DEFAULT NULL COMMENT '关闭时间',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_company_id (company_id),
  INDEX idx_status (status),
  INDEX idx_title (title),
  INDEX idx_location (location),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='职位表';

-- 投递记录表
CREATE TABLE IF NOT EXISTS applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id INT UNSIGNED NOT NULL COMMENT '职位ID',
  resume_id INT UNSIGNED NOT NULL COMMENT '简历ID',
  candidate_id INT UNSIGNED NOT NULL COMMENT '求职者ID',
  company_id INT UNSIGNED NOT NULL COMMENT '公司ID',
  match_score DECIMAL(5,2) DEFAULT NULL COMMENT '匹配度评分',
  match_detail JSON DEFAULT NULL COMMENT '匹配详情',
  status ENUM('applied', 'viewed', 'shortlisted', 'interview', 'offer', 'rejected', 'hired') NOT NULL DEFAULT 'applied' COMMENT '投递状态',
  candidate_note VARCHAR(500) DEFAULT NULL COMMENT '求职者附言',
  employer_note TEXT COMMENT '招聘方备注',
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投递时间',
  viewed_at TIMESTAMP NULL DEFAULT NULL COMMENT '查看时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_job_resume (job_id, resume_id),
  INDEX idx_candidate_id (candidate_id),
  INDEX idx_company_id (company_id),
  INDEX idx_status (status),
  INDEX idx_match_score (match_score),
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='投递记录表';

-- 面试邀约表
CREATE TABLE IF NOT EXISTS interviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED NOT NULL COMMENT '投递记录ID',
  job_id INT UNSIGNED NOT NULL COMMENT '职位ID',
  candidate_id INT UNSIGNED NOT NULL COMMENT '求职者ID',
  company_id INT UNSIGNED NOT NULL COMMENT '公司ID',
  interview_type ENUM('phone', 'video', 'onsite') NOT NULL COMMENT '面试类型',
  interview_round INT DEFAULT 1 COMMENT '面试轮次',
  scheduled_at DATETIME NOT NULL COMMENT '面试时间',
  duration INT DEFAULT 60 COMMENT '面试时长（分钟）',
  location VARCHAR(500) DEFAULT NULL COMMENT '面试地点/链接',
  interviewer VARCHAR(100) DEFAULT NULL COMMENT '面试官',
  candidate_status ENUM('pending', 'accepted', 'declined', 'completed', 'no_show') DEFAULT 'pending' COMMENT '求职者状态',
  employer_note TEXT COMMENT '招聘方备注',
  feedback TEXT COMMENT '面试反馈',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_application_id (application_id),
  INDEX idx_candidate_id (candidate_id),
  INDEX idx_company_id (company_id),
  INDEX idx_scheduled_at (scheduled_at),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='面试邀约表';

SET FOREIGN_KEY_CHECKS = 1;
