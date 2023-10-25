'use client';

import React, { useState, useCallback, useMemo, Key, ChangeEvent } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Selection,
    SortDescriptor
} from '@nextui-org/react';
import TopContent from './TopContent';

interface AppProps {
    renderCell: (post: any, columnKey: Key) => string | number | JSX.Element;
    initialVisibleColumns: string[];
    columns: {
        name: string;
        uid: string;
        sortable?: boolean;
    }[];
    statusOptions?: {
        name: string;
        uid: string;
    }[];
    items: any[];
}

const App: React.FC<AppProps> = ({ renderCell, initialVisibleColumns, columns, statusOptions, items }) => {
    const [filterValue, setFilterValue] = useState('');
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialVisibleColumns));
    const [statusFilter, setStatusFilter] = useState<Selection>('all');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [page, setPage] = useState(1);

    const pages = Math.ceil(items.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter(column => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const itemsOnPage = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return items.slice(start, end);
    }, [page, items, rowsPerPage]);

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

    const classNames = useMemo(
        () => ({
            wrapper: ['max-h-[382px]', 'max-w-3xl'],
            th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider', 'text-xs', 'sm:text-sm'],
            td: [
                // changing the rows border radius
                // first
                'group-data-[first=true]:first:before:rounded-none',
                'group-data-[first=true]:last:before:rounded-none',
                // middle
                'group-data-[middle=true]:before:rounded-none',
                // last
                'group-data-[last=true]:first:before:rounded-none',
                'group-data-[last=true]:last:before:rounded-none',
                'text-xs',
                'sm:text-sm'
            ]
        }),
        []
    );

    return (
        <div className="w-full overflow-x-scroll overflow-y-hidden">
            <TopContent
                filterValue={filterValue}
                statusFilter={statusFilter}
                columns={columns}
                visibleColumns={visibleColumns}
                onSearchChange={onSearchChange}
                onRowsPerPageChange={onRowsPerPageChange}
                postsLength={items.length}
                setFilterValue={setFilterValue}
                setStatusFilter={setStatusFilter}
                setVisibleColumns={setVisibleColumns}
            />
            <Table
                isCompact
                removeWrapper
                aria-label="Example table with custom cells, pagination and sorting"
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
                <TableBody emptyContent={'Không tìm thấy kết quả'} items={itemsOnPage}>
                    {item => (
                        <TableRow key={item.id} className="border-b-1 border-gray-200">
                            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
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
            </div>
        </div>
    );
};

export default App;
