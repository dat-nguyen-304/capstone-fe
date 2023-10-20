'use client';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Selection } from '@nextui-org/react';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { columns, statusOptions } from './data';
import { capitalize } from './utils';

interface TopContentProps {
    filterValue: string;
    statusFilter: Selection;
    visibleColumns: Selection;
    onSearchChange: (value?: string) => void;
    onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    postsLength: number;
    hasSearchFilter: boolean;
    setFilterValue: Dispatch<SetStateAction<string>>;
    setStatusFilter: Dispatch<SetStateAction<Selection>>;
    setVisibleColumns: Dispatch<SetStateAction<Selection>>;
}

const TopContent: React.FC<TopContentProps> = ({
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    postsLength,
    hasSearchFilter,
    setFilterValue,
    setStatusFilter,
    setVisibleColumns
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    classNames={{
                        base: 'w-full sm:max-w-[44%]',
                        inputWrapper: 'border-1'
                    }}
                    placeholder="Tìm kiếm..."
                    size="sm"
                    startContent={<BsSearch className="text-default-300" />}
                    value={filterValue}
                    variant="bordered"
                    onClear={() => setFilterValue('')}
                    onValueChange={onSearchChange}
                />
                <div className="flex gap-3">
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Button endContent={<BsChevronDown className="text-small" />} size="sm" variant="flat">
                                Trạng thái
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={statusFilter}
                            selectionMode="multiple"
                            onSelectionChange={setStatusFilter}
                        >
                            {statusOptions.map(status => (
                                <DropdownItem key={status.uid} className="capitalize">
                                    {capitalize(status.name)}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Button endContent={<BsChevronDown className="text-small" />} size="sm" variant="flat">
                                Cột
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={setVisibleColumns}
                        >
                            {columns.map(column => (
                                <DropdownItem key={column.uid} className="capitalize">
                                    {capitalize(column.name)}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">Tìm thấy {postsLength} kết quả</span>
                <label className="flex items-center text-default-400 text-small">
                    Số kết quả mỗi trang:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default TopContent;
