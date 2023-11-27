import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { AiFillStar } from 'react-icons/ai';
import { CiFilter } from 'react-icons/ci';
import { BiCoin, BiCoinStack, BiSearch } from 'react-icons/bi';
import { FaUsersLine } from 'react-icons/fa6';
import FilterDrawer from './FilterDrawer';
import { Dispatch, SetStateAction, useState } from 'react';

interface CourseFilterProps {
    onSearch: (searchTerm: string) => void;
    setSortType: Dispatch<SetStateAction<number>>;
    setFilter: Dispatch<SetStateAction<{ type: string; value: any[] }>>;
}

const CourseFilter: React.FC<CourseFilterProps> = ({ onSearch, setSortType, setFilter }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const showDrawer = () => {
        setOpenDrawer(true);
    };

    const onClose = () => {
        setOpenDrawer(false);
    };
    const handleSearch = () => {
        onSearch(searchTerm);
        setSearchTerm('');
    };
    return (
        <div className="md:flex items-center gap-8 flex-wrap">
            <div>
                <Button startContent={<CiFilter size={18} />} color="primary" onClick={showDrawer}>
                    <span>Bộ Lọc (5)</span>
                </Button>
                <FilterDrawer onClose={onClose} open={openDrawer} setFilter={setFilter} />
            </div>
            <div className="flex flex-[1] gap-2 md:mt-0 mt-4">
                <Input
                    color="primary"
                    variant="bordered"
                    placeholder="Nhập từ khóa"
                    className="flex-[1]"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Button color="primary" className="" onClick={handleSearch}>
                    Tìm kiếm
                </Button>
            </div>
            <div className="w-[212px] md:mt-0 mt-4">
                <Select
                    size="sm"
                    label="Sắp xếp theo"
                    color="primary"
                    variant="bordered"
                    defaultSelectedKeys={['0']}
                    onChange={event => setSortType(Number(event?.target?.value))}
                >
                    <SelectItem key={0} value={0} startContent={<BiSearch className="text-yellow-500" />}>
                        Mặc định
                    </SelectItem>
                    {/* <SelectItem key={1} value={1} startContent={<AiFillStar className="text-yellow-500" />}>
                        Đánh giá cao nhất
                    </SelectItem> */}
                    <SelectItem key={1} value={2} startContent={<BiCoinStack className="text-yellow-500" />}>
                        Giá mua cao nhất
                    </SelectItem>
                    <SelectItem key={2} value={2} startContent={<BiCoin className="text-yellow-500" />}>
                        Giá mua thấp nhất
                    </SelectItem>
                    {/* <SelectItem key={4} value={4} startContent={<FaUsersLine className="text-yellow-500" />}>
                        Nhiều đánh giá nhất
                    </SelectItem> */}
                </Select>
            </div>
        </div>
    );
};

export default CourseFilter;
