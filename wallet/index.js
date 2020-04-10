export default [
    {
        path: '/wallet', //创建活动
        controller: () => import('./home/Controller'),
        credentials: "include",
        defaultname:'营销钱包',
    },
]