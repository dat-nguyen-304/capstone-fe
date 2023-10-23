'use client';
import Table from '@/components/table';
import { User } from '@nextui-org/react';
import Link from 'next/link';
import { Key, useCallback } from 'react';

interface TransactionsProps {}

const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN KHÓA HỌC', uid: 'name', sortable: true },
    { name: 'MÔN HỌC', uid: 'subject', sortable: true },
    { name: 'GIÁO VIÊN', uid: 'teacher', sortable: true },
    { name: 'THÀNH TIỀN', uid: 'price' },
    { name: 'NGÀY', uid: 'date', sortable: true }
];

const transactions = [
    {
        id: 1,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 2,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 3,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 4,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 5,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    },
    {
        id: 6,
        name: 'Khóa học lấy gốc',
        subject: 'Toán',
        teacher: 'Nguyễn Văn An',
        price: 500000,
        date: '12/12/2023 08:02:02'
    }
];

type Transaction = (typeof transactions)[0];

const Transactions: React.FC<TransactionsProps> = ({}) => {
    const renderCell = useCallback((transaction: Transaction, columnKey: Key) => {
        const cellValue = transaction[columnKey as keyof Transaction];

        switch (columnKey) {
            case 'name':
                return <Link href={`/courses/${1}`}>{cellValue}</Link>;
            case 'teacher':
                return (
                    <User
                        avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        name={cellValue}
                    >
                        {transaction.teacher}
                    </User>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="w-4/5 mx-auto my-8">
            <Table
                renderCell={renderCell}
                initialVisibleColumns={['id', 'name', 'subject', 'date']}
                columns={columns}
                posts={transactions}
            />
        </div>
    );
};

export default Transactions;
