FROM node:10.16.3

# 代表生产环境
ENV PROJECT_ENV production
ENV NODE_ENV production

COPY package*.json /app/

WORKDIR /app

# 切换到app目录
WORKDIR /app

# 安装依赖
RUN npm install --registry=https://registry.npm.taobao.org

# 把所有源代码拷贝到/app
COPY . /app

# 打包构建
RUN npm run build