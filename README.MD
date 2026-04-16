# SDCPP.WEBUI

一个基于纯 HTML5、CSS 和 JavaScript 的 `sd-server` 前端界面，用于连接 `stable-diffusion.cpp` 的服务端接口，并在浏览器中完成配置、出图、任务轮询、相册记录与本地保存。

本项目面向本地或局域网部署场景设计，不依赖前端框架，也不要求额外打包流程。打开页面后即可配置 API 地址，并通过统一界面访问 `OpenAI API`、`Stable Diffusion WebUI API` 和 `sdcpp API` 三套接口族。

## 简介

`SDCPP.WEBUI` 是为 `stable-diffusion.cpp/examples/server` 提供的独立 WebUI。它参考上游 `server api.md` 中定义的接口能力，并结合本仓库的实现，提供以下目标：

- 用单页应用形式统一访问 `/v1/*`、`/sdapi/v1/*`、`/sdcpp/v1/*`
- 保存客户端配置与生成参数，减少重复输入
- 支持浏览器端本地相册、任务轮询和图片写入 `imgs` 目录
- 提供多语言、主题、昼夜模式与分享卡导出
- 以纯静态文件形式部署，便于本地使用和二次修改

## 功能

- `API 地址管理`
  支持在页面中设置并持久化 `sd-server API URL`，并检查服务连通性。

- `三套 API 统一访问`
  支持以下接口族：
  - `OpenAI API`：`/v1/images/generations`、`/v1/images/edits`、`/v1/models`
  - `Stable Diffusion WebUI API`：`/sdapi/v1/txt2img`、`/sdapi/v1/img2img` 及发现接口
  - `sdcpp API`：`/sdcpp/v1/capabilities`、`/sdcpp/v1/img_gen`、`/sdcpp/v1/jobs/{id}`、`/sdcpp/v1/jobs/{id}/cancel`、`/sdcpp/v1/vid_gen`

- `能力发现与表单联动`
  连接成功后可自动获取采样器、调度器、模型信息与能力摘要，并同步到前端下拉选项。

- `参数持久化`
  生成参数会写入 `localStorage`，除非用户主动修改或重置，否则会继续沿用上一次设置。

- `随机种子前端控制`
  支持在界面中选择 `随机化` 或 `固定` 种子。随机模式下由前端生成具体种子值，不再向后端传递 `-1`。

- `滑块与数值输入`
  对常用参数提供滑块加数值框组合输入，包括分辨率、步数、CFG、去噪强度、批量数量等。

- `图片保存`
  当浏览器支持 File System Access API 且用户授权后，可直接把生成结果写入与页面同层级的 `imgs` 文件夹，并同时写出对应参数 `json`。

- `相册模式`
  结果缩略图、提示词与生成参数可保存到 `localStorage`，支持浏览、筛选、回看与导出历史。

- `任务轮询`
  对 `sdcpp` 异步任务提供自动轮询、手动轮询与取消接口操作。

- `分享卡导出`
  可将最新结果或相册条目导出为模型分享卡，便于展示提示词、模型、分辨率、采样器和种子等信息。

- `多语言`
  支持：
  - 简体中文
  - 繁體中文
  - English
  - 日本語
  - 한국어

  默认按客户端语言自动判定，不在支持范围内时回退为英文，同时支持手动覆盖并持久化。

- `主题与时段模式`
  支持浅蓝、浅紫、浅黄、浅绿、浅青、浅红六种主题配色，以及白天、黄昏/黎明、黑夜、纯黑四种显示模式，也支持按客户端时间自动切换。

## API 参考

本项目主要依据 `stable-diffusion.cpp` 上游服务端 API 文档实现前端交互：

- 上游 API 文档：
  https://github.com/leejet/stable-diffusion.cpp/blob/master/examples/server/api.md

根据该文档，`examples/server` 当前暴露三套 API 家族：

- `OpenAI API`，位于 `/v1/...`
- `Stable Diffusion WebUI API`，位于 `/sdapi/v1/...`
- `sdcpp API`，位于 `/sdcpp/v1/...`

同时，上游文档还说明：

- `sdcpp API` 是原生 API 面
- `sd_cpp_extra_args` 的请求结构与原生 `sdcpp API` schema 对齐
- `OpenAI API` 与 `sdapi` 可通过 `prompt` 中嵌入 `<sd_cpp_extra_args>...</sd_cpp_extra_args>` 扩展原生参数
- `sdcpp API` 不需要 `sd_cpp_extra_args`，因为其请求体本身就是原生 schema

本项目当前前端已覆盖和对接的主要接口如下：

1. `GET /v1/models`
2. `POST /v1/images/generations`
3. `POST /v1/images/edits`
4. `GET /sdapi/v1/loras`
5. `GET /sdapi/v1/samplers`
6. `GET /sdapi/v1/schedulers`
7. `GET /sdapi/v1/sd-models`
8. `GET /sdapi/v1/options`
9. `POST /sdapi/v1/txt2img`
10. `POST /sdapi/v1/img2img`
11. `GET /sdcpp/v1/capabilities`
12. `POST /sdcpp/v1/img_gen`
13. `GET /sdcpp/v1/jobs/{id}`
14. `POST /sdcpp/v1/jobs/{id}/cancel`
15. `POST /sdcpp/v1/vid_gen`

说明：

- 根据上游文档，`POST /sdcpp/v1/vid_gen` 当前已暴露，但可能返回 `501 Not Implemented`
- 实际可用字段与服务端构建版本、模型能力和上游更新有关，应以运行中的 `sd-server` 返回结果为准

## 项目结构

当前仓库的主要文件如下：

- [index.html](./index.html)
  前端页面主体结构

- [app.css](./app.css)
  页面样式、主题、响应式布局和组件外观

- [app.js](./app.js)
  业务逻辑、API 调用、任务轮询、表单状态、相册和分享卡实现

- [i18n.js](./i18n.js)
  多语言文案资源

- [serve-local.ps1](./serve-local.ps1)
  本地快速启动静态服务脚本

- `imgs/`
  生成图片与参数文件的目标目录

## 使用方式

### 1. 准备后端

先确保你已经启动 `stable-diffusion.cpp` 的服务端，并知道其监听地址，例如：

```text
http://127.0.0.1:1234
```

### 2. 启动本前端

推荐使用本地静态服务器打开，而不是直接双击 `index.html`。这样更稳定，也更容易配合浏览器权限和本地资源访问。

Windows PowerShell 下可直接运行：

```powershell
.\serve-local.ps1
```

该脚本默认会在 `8000` 端口启动：

```text
http://127.0.0.1:8000/index.html
```

你也可以自定义端口：

```powershell
.\serve-local.ps1 9000
```

如果你不使用 PowerShell，也可以在项目目录中执行：

```bash
python -m http.server 8000
```

### 3. 页面中完成初始化

打开页面后：

1. 点击右上角齿轮按钮
2. 填入 `sd-server API URL`
3. 点击 `Check Connection`
4. 根据需要配置语言、主题、显示模式
5. 如需本地保存图片，点击 `Bind imgs Folder` 并选择当前项目下的 `imgs` 目录

### 4. 开始使用

你可以按需使用以下区域：

- `OpenAI API`
  适合与 OpenAI 风格图像接口兼容的客户端习惯

- `Stable Diffusion WebUI API`
  适合 WebUI 风格的 `txt2img` / `img2img` 交互

- `sdcpp API`
  适合访问原生能力、异步任务和完整原生参数结构

- `Discovery`
  用于拉取模型、采样器、调度器和选项

- `Jobs`
  用于轮询和取消 `sdcpp` 异步任务

- `Gallery`
  用于查看本地相册索引与历史参数记录

## 部署方式

本项目是纯静态前端，部署方式非常简单，常见场景如下。

### 本地单机部署

适合个人开发、模型调试和局域网访问：

```powershell
.\serve-local.ps1
```

或：

```bash
python -m http.server 8000
```

### 局域网静态托管

你可以把本仓库文件放到任意静态 Web 服务器目录下，例如：

- Nginx
- Apache
- Caddy
- IIS
- 任意支持静态文件服务的开发服务器

只需确保浏览器能够访问本页面，且页面可以访问你的 `sd-server API URL`。

### 反向代理部署

如果前端和后端不在同源环境，建议通过反向代理统一域名或端口前缀，减少跨域问题。例如：

- 前端静态文件由 `https://your-host/webui/` 提供
- 后端 API 由 `https://your-host/api/` 或同源根路径转发

部署时请注意：

- 浏览器跨域策略
- 本地目录写入权限是否可用
- HTTPS 与局域网访问的兼容性

## 隐私声明

本项目尽量采用“本地优先”的方式处理数据，但仍需明确以下边界：

1. 页面配置、主题、语言、相册索引和参数历史会保存在浏览器 `localStorage` 中。
2. 当你主动提交请求时，提示词、负面提示词、图像、参数和其他表单内容会发送到你填写的 `sd-server API URL`。
3. 本项目不会额外把你的数据主动上传到其他第三方服务；但你连接的后端服务如何处理数据，取决于该服务的部署环境和实现方式。
4. 当你绑定 `imgs` 目录后，浏览器会在获得授权的前提下，将生成图片和对应参数文件写入本地文件系统。
5. 相册视图中的缩略图和生成参数记录可能保留在本地浏览器存储中，除非你手动清除。

如果你在共享设备、远程环境或公共服务器上使用本项目，建议定期清理浏览器站点数据与本地历史记录。

## 关联项目

本项目基于以下上游项目接口设计与使用场景构建：

- `stable-diffusion.cpp`
  https://github.com/leejet/stable-diffusion.cpp/

上游项目是一个基于纯 C/C++ 的扩散模型推理实现，支持多种模型、后端和平台，并在 `examples/server` 中提供服务端能力。

## 参考链接

- 上游服务端 API 文档：
  https://github.com/leejet/stable-diffusion.cpp/blob/master/examples/server/api.md

- 上游主项目：
  https://github.com/leejet/stable-diffusion.cpp/

## 许可与说明

本仓库当前 README 主要描述本前端项目的用途与使用方式。关于上游模型支持、构建方法、许可证与服务端实现细节，请以 `stable-diffusion.cpp` 官方仓库说明为准。
