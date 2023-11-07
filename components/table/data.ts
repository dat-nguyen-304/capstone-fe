const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'TIÊU ĐỀ', uid: 'title', sortable: true },
    { name: 'TƯƠNG TÁC', uid: 'react' },
    { name: 'TRẠNG THÁI', uid: 'status', sortable: true },
    { name: 'TÁC GIẢ', uid: 'author', sortable: true }
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
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 2,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 3,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 4,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 5,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    },
    {
        id: 6,
        author: 'Tony Reichert',
        subject: 'Toán',
        title: 'Management',
        react: '29',
        createdAt: '23/12/2023 19:19:19'
    }
];

export { columns, posts, statusOptions };
