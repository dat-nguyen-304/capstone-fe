'use client';
import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import { Drawer } from 'antd';
import { AiFillStar } from 'react-icons/ai';
import { BsBookFill } from 'react-icons/bs';
import { SiLevelsdotfyi } from 'react-icons/si';
import { FaCoins } from 'react-icons/fa';
import RatingFilter from './filter-item/RatingFilter';
import SubjectFilter from './filter-item/SubjectFilter';
import LevelFilter from './filter-item/LevelFilter';
import PriceFilter from './filter-item/PriceFilter';

interface FilterDrawerProps {
    onClose: () => void;
    open: boolean;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ onClose, open }) => {
    return (
        <Drawer title="Bộ lọc" placement="right" onClose={onClose} open={open} className="relative">
            <Accordion isCompact>
                <AccordionItem
                    startContent={<AiFillStar className="text-yellow-500" size={20} />}
                    key="1"
                    aria-label="Đánh giá"
                    title="Đánh giá"
                    subtitle=">= 3 sao"
                >
                    <RatingFilter />
                </AccordionItem>
                <AccordionItem
                    key="2"
                    aria-label="Môn học"
                    startContent={<BsBookFill className="text-blue-400" size={20} />}
                    title="Môn học"
                    subtitle="Đã chọn 3 môn học"
                >
                    <SubjectFilter />
                </AccordionItem>
                <AccordionItem
                    key="3"
                    aria-label="Trình độ"
                    startContent={<SiLevelsdotfyi className="text-green-400" size={20} />}
                    subtitle="Cơ bản, Trung bình, Nâng cao"
                    title="Trình độ"
                >
                    <LevelFilter />
                </AccordionItem>
                <AccordionItem
                    key="4"
                    aria-label="Mức giá"
                    title="Mức giá"
                    startContent={<FaCoins className="text-orange-400" size={20} />}
                    subtitle="0.5 triệu - 5 triệu"
                >
                    <PriceFilter />
                </AccordionItem>
            </Accordion>
            <div className="absolute bottom-4">
                <Button color="primary">Tìm kiếm</Button>
                <Button color="danger" variant="bordered" className="ml-4">
                    Xóa bộ lọc
                </Button>
            </div>
        </Drawer>
    );
};

export default FilterDrawer;
