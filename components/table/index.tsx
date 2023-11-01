'use client';

import React, { useMemo, Key, Dispatch, SetStateAction } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    SortDescriptor
} from '@nextui-org/react';

interface AppProps {
    renderCell: (post: any, columnKey: Key) => string | number | JSX.Element;
    items: any[];
    headerColumns: {
        name: string;
        uid: string;
        sortable?: boolean;
    }[];
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    sortDescriptor: SortDescriptor;
    setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
}

const TableContent: React.FC<AppProps> = ({
    renderCell,
    headerColumns,
    items,
    page,
    setPage,
    sortDescriptor,
    setSortDescriptor
}) => {
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
                selectionMode="none"
                topContentPlacement="outside"
                sortDescriptor={sortDescriptor}
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
                <TableBody emptyContent={'Không tìm thấy kết quả'} items={items}>
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
                    page={page}
                    total={2}
                    variant="light"
                    onChange={setPage}
                />
            </div>
        </div>
    );
};

export default TableContent;
