
此demo集成header是否有导航两种情况，router.js有具体说明

开发：
1.复制拷贝除了node_modules外的其它文件至新项目文件夹
2.修改package.json内的name
3.配置host 127.0.0.1 vue-demo-web.jd.com

测试nginx配置：

预发&生产nginx配置：


注意：
1.整体目录结构不建议再新增文件夹
2.src目录结构也不建议再新增文件夹（assets、components、router、store、views、App.vue、main.js），涉及到的js模块添加到 assets/js下
3.新增页面最外层div必须有相应calss:首页(page)、drawer(page-drawer)、dialog(page-dialog)