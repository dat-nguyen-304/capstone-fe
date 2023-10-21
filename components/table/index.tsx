'use client';

import React, { useState, useCallback, useMemo, Key, ChangeEvent } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    User
} from '@nextui-org/react';
import TopContent from './TopContent';
import Link from 'next/link';

// const INITIAL_VISIBLE_COLUMNS = ['id', 'author', 'title', 'status', 'createdAt'];

interface AppProps {
    renderCell: (post: any, columnKey: Key) => string | number | JSX.Element;
    initialVisibleColumns: string[];
    columns: {
        name: string;
        uid: string;
        sortable?: boolean;
    }[];
    statusOptions: {
        name: string;
        uid: string;
    }[];
    posts: any[];
}

const App: React.FC<AppProps> = ({ renderCell, initialVisibleColumns, columns, statusOptions, posts }) => {
    const [filterValue, setFilterValue] = useState('');
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialVisibleColumns));
    const [statusFilter, setStatusFilter] = useState<Selection>('all');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [page, setPage] = useState(1);

    type commonType = (typeof posts)[0];

    const pages = Math.ceil(posts.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredPosts = [...posts];

        if (hasSearchFilter) {
            filteredPosts = filteredPosts.filter(post => post.title.toLowerCase().includes(filterValue.toLowerCase()));
        }
        if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
            filteredPosts = filteredPosts.filter(Post => Array.from(statusFilter).includes(Post.status));
        }

        return filteredPosts;
    }, [posts, filterValue, statusFilter]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a: commonType, b: commonType) => {
            const first = a[sortDescriptor.column as keyof commonType] as number;
            const second = b[sortDescriptor.column as keyof commonType] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);

    const topContent = useMemo(() => {
        return (
            <TopContent
                filterValue={filterValue}
                statusFilter={statusFilter}
                visibleColumns={visibleColumns}
                onSearchChange={onSearchChange}
                onRowsPerPageChange={onRowsPerPageChange}
                postsLength={posts.length}
                hasSearchFilter={hasSearchFilter}
                setFilterValue={setFilterValue}
                setStatusFilter={setStatusFilter}
                setVisibleColumns={setVisibleColumns}
            />
        );
    }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, posts.length, hasSearchFilter]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: 'bg-foreground text-background'
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                {/* <span className="text-small text-default-400">
                    {selectedKeys === 'all' ? 'All items selected' : `${selectedKeys.size} of ${items.length} selected`}
                </span> */}
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = useMemo(
        () => ({
            wrapper: ['max-h-[382px]', 'max-w-3xl'],
            th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
            td: [
                // changing the rows border radius
                // first
                'group-data-[first=true]:first:before:rounded-none',
                'group-data-[first=true]:last:before:rounded-none',
                // middle
                'group-data-[middle=true]:before:rounded-none',
                // last
                'group-data-[last=true]:first:before:rounded-none',
                'group-data-[last=true]:last:before:rounded-none'
            ]
        }),
        []
    );

    return (
        <Table
            isCompact
            removeWrapper
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            checkboxesProps={{
                classNames: {
                    wrapper: 'after:bg-foreground after:text-background text-background'
                }
            }}
            classNames={classNames}
            selectedKeys={selectedKeys}
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {column => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === 'actions' ? 'center' : 'start'}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={'Không tìm thấy kết quả'} items={sortedItems}>
                {item => (
                    <TableRow
                        as={Link}
                        key={item.id}
                        className="cursor-pointer border-b-1 border-black"
                        href={`/discuss/${item.id}`}
                    >
                        {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default App;
