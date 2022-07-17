# DemoTicket
面試作業
後端使用 .net6 搭配 mysql，做了一個具有JWT身分驗證，RestFul API，並且掛載Swagger，還包含Exception Middleware，反射依賴注入服務
前端，則是用 [VBen](https://vvbin.cn/doc-next/) 後台框架，搭配 vue3

需求
Please design a ticket tracking system. This system allows QA to report a bug and RD can mark a bug as resolved.
A. Phase I Requirement:
- There are two types of user: QA and RD.
- Only QA can create a bug, edit a bug and delete a bug.
- Only RD can resolve a bug.
- Summary field and Description filed are required of a bug when QA is creating a bug.
B. Phase II Requirement:
- Adding new field Severity and Priority to a ticket.
- Adding new type of user “PM” that can create new ticket type “Feature Request”. And only RD can mark it as resolved.
- Adding new ticket type “Test Case” that only QA can create and resolve. It’s read-only for other type of users.

建置順序:
後端:
1. TDemo\DemoTicket\Demo.API\SQL\DemoDataSeed.sql -> 建立DB Schema
2. 設定appsetting，連線字串及JWT設定

前端:
1. 設定.env.development 的VITE_GLOB_API_URL api 路由
2. npm install all
3. npm run dev


畫面展示:

![Swag](https://user-images.githubusercontent.com/57789269/179384716-8cfe1eb5-7895-4216-bcd4-1db0e8d3f728.png)

![Demo](https://user-images.githubusercontent.com/57789269/179384719-86699367-9b31-4046-85ac-8f2b09bc8e7c.png)



