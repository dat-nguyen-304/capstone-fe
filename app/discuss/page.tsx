'use client';
import Table from '@/components/table';
import { Key, useCallback } from 'react';
import { columns, posts, statusOptions } from '@/components/table/data';
import { Chip, ChipProps, User } from '@nextui-org/react';

interface TestProps {}

const statusColorMap: Record<string, ChipProps['color']> = {
    active: 'success',
    paused: 'danger',
    vacation: 'warning'
};

type Post = (typeof posts)[0];

const Test: React.FC<TestProps> = ({}) => {
    const renderCell = useCallback((post: Post, columnKey: Key) => {
        const cellValue = post[columnKey as keyof Post];

        switch (columnKey) {
            case 'author':
                return (
                    <User
                        avatarProps={{ radius: 'full', size: 'sm', src: 'https://i.pravatar.cc/150?img=4' }}
                        classNames={{
                            description: 'text-default-500'
                        }}
                        // description={post.author}
                        name={cellValue}
                    >
                        {post.author}
                    </User>
                );
            case 'status':
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={statusColorMap[post.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue}
                    </Chip>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="w-4/5 mx-auto my-8">
            <Table
                renderCell={renderCell}
                initialVisibleColumns={['id', 'author', 'title', 'status', 'createdAt']}
                columns={columns}
                statusOptions={statusOptions}
                posts={posts}
            />
        </div>
    );
};

export default Test;
