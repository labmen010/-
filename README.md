# 无人机巡检 Web 系统

## 已完成内容

- 后端已接入 MySQL，并支持自动建表与初始化数据。
- 登录页已接入后端账号认证接口。
- 任务管理页已实现：查询、分页、新增、编辑、删除、启停、导出 CSV。
- 航线规划页已实现：表单校验、保存到数据库、读取历史草稿。
- 图像检测页已实现：调用检测接口并将检测记录落库展示。

## 默认账号

- 用户名：admin
- 密码：admin123

## 1. 准备 MySQL

先创建数据库：

CREATE DATABASE uav_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

默认后端配置：

- MYSQL_HOST=127.0.0.1
- MYSQL_PORT=3306
- MYSQL_USER=root
- MYSQL_PASSWORD=123456
- MYSQL_DB=uav_system

如需自定义，可通过环境变量覆盖。

## 2. 安装依赖

在项目根目录执行：

pip install -r requirements.txt

## 3. 启动后端

在项目根目录执行：

uvicorn website.backend.text:app --host 127.0.0.1 --port 8000 --reload

## 4. 打开页面

- 首页：website/index/index.html
- 登录页：website/login/login.html
- 任务管理：website/task-center/index.html
- 图像检测：website/task-center/object_detection.html
- 航线规划：website/route-plan/index.html

## 说明

- 启动时会自动建表：users、tasks、route_drafts、detection_records。
- 图像检测依赖本地模型权重，默认路径是项目根目录的 best.pt。
