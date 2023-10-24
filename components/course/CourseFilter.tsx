import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { AiFillStar } from 'react-icons/ai';
import { CiFilter } from 'react-icons/ci';
import { BiCoin, BiCoinStack, BiSearch } from 'react-icons/bi';
import { FaUsersLine } from 'react-icons/fa6';
import FilterDrawer from './FilterDrawer';
import { useState } from 'react';

interface CourseFilterProps {}

const CourseFilter: React.FC<CourseFilterProps> = () => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const showDrawer = () => {
        setOpenDrawer(true);
    };

    const onClose = () => {
        setOpenDrawer(false);
    };
    return (
        <div className="md:flex items-center gap-8 flex-wrap">
            <div>
                <Button startContent={<CiFilter size={18} />} color="primary" onClick={showDrawer}>
                    <span>Bộ Lọc (5)</span>
                </Button>
                <FilterDrawer onClose={onClose} open={openDrawer} />
            </div>
            <div className="flex flex-[1] gap-2 md:mt-0 mt-4">
                <Input color="primary" variant="bordered" placeholder="Nhập từ khóa" className="flex-[1]" />
                <Button color="primary" className="">
                    Tìm kiếm
                </Button>
            </div>
            <div className="w-[212px] md:mt-0 mt-4">
                <Select size="sm" label="Sắp xếp theo" color="primary" variant="bordered" defaultSelectedKeys={['0']}>
                    <SelectItem key={0} value={0} startContent={<BiSearch className="text-yellow-500" />}>
                        Mặc định
                    </SelectItem>
                    <SelectItem key={1} value={1} startContent={<AiFillStar className="text-yellow-500" />}>
                        Đánh giá cao nhất
                    </SelectItem>
                    <SelectItem key={2} value={2} startContent={<BiCoinStack className="text-yellow-500" />}>
                        Giá mua cao nhất
                    </SelectItem>
                    <SelectItem key={3} value={3} startContent={<BiCoin className="text-yellow-500" />}>
                        Giá mua thấp nhất
                    </SelectItem>
                    <SelectItem key={4} value={4} startContent={<FaUsersLine className="text-yellow-500" />}>
                        Nhiều đánh giá nhất
                    </SelectItem>
                </Select>
            </div>
        </div>
    );
};

export default CourseFilter;
