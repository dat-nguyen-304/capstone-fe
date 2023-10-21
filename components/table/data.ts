const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÁC GIẢ', uid: 'author', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'TIÊU ĐỀ', uid: 'title', sortable: true },
    { name: 'NGÀY TẠO', uid: 'createdAt', sortable: true },
    { name: 'TƯƠNG TÁC', uid: 'react' },
    { name: 'TRẠNG THÁI', uid: 'status', sortable: true }
];

const statusOptions = [
    { name: 'Active', uid: 'active' },
    { name: 'Paused', uid: 'paused' },
    { name: 'Vacation', uid: 'vacation' }
];

const posts = [
    {
        id: 1,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Ngẫng mặt hận đời',
        createdAt: '20/10/2023',
        react: '29',
        status: 'paused'
    },
    {
        id: 2,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        createdAt: '20/10/2023',
        react: '29',
        status: 'paused'
    },
    {
        id: 3,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        createdAt: '20/10/2023',
        react: '29',
        status: 'paused'
    },
    {
        id: 4,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        createdAt: '20/10/2023',
        react: '29',
        status: 'paused'
    },
    {
        id: 5,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        createdAt: '20/10/2023',
        react: '29',
        status: 'paused'
    },
    {
        id: 6,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        createdAt: '20/10/2023',
        react: '29',
        status: 'paused'
    }
];

export { columns, posts, statusOptions };
