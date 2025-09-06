# VibeCoding DevTools 浏览器插件

一个强大的开发者工具浏览器插件，用于监听网络请求和控制台输出。

## 功能特性

### 🌐 网络请求监听
- 实时捕获所有HTTP/HTTPS请求
- 显示请求方法、URL、状态码
- 查看请求头和响应头详情
- 支持过滤和搜索功能

### 🖥️ 控制台输出监听
- 捕获所有控制台输出 (log, error, warn, info, debug)
- 显示消息级别、内容、来源和时间
- 监听未捕获的错误和Promise异常
- 支持实时更新和历史记录

### 🛠️ 开发者友好
- 集成到Chrome DevTools面板
- 现代化UI界面，支持深色模式
- 数据可清空，支持导出功能
- 高性能，不影响页面加载速度

## 开发和构建

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建插件
```bash
npm run build
```

### 打包发布
```bash
npm run zip
```

## 使用方法

1. 构建或下载插件包
2. 在Chrome浏览器中打开 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择插件的`dist`目录
6. 打开任意网页，按F12打开开发者工具
7. 在DevTools中找到"VibeCoding DevTools"面板

## 面板功能

### 网络请求面板
- **请求列表**: 显示所有网络请求的概览
- **请求详情**: 点击任意请求查看详细信息
- **状态过滤**: 根据HTTP状态码过滤请求
- **清空数据**: 清除所有记录的请求

### 控制台面板  
- **消息列表**: 显示所有控制台输出
- **级别过滤**: 根据消息级别过滤输出
- **来源追踪**: 显示消息的来源文件和行号
- **实时更新**: 自动显示新的控制台输出

## 技术架构

- **框架**: WXT (Web Extension Tools)
- **UI**: React + TypeScript
- **构建**: Vite + SWC
- **权限**: webRequest, devtools, activeTab, tabs

## 权限说明

插件需要以下权限：
- `webRequest`: 监听网络请求
- `devtools`: 创建开发者工具面板
- `activeTab`: 访问当前标签页
- `tabs`: 标签页管理
- `storage`: 数据存储
- `host_permissions`: 访问所有网站

## 隐私保护

- 所有数据仅在本地处理，不会上传到服务器
- 插件不会修改或影响网页内容
- 捕获的数据可随时清空

## 开发贡献

欢迎提交Issues和Pull Requests来改进这个插件！

## 许可证

MIT License
