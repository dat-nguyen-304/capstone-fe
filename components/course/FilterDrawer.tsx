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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface FilterDrawerProps {
    onClose: () => void;
    open: boolean;
    setFilter: Dispatch<SetStateAction<{ type: string; value: any[] }>>;
    onFilterQuantity: Dispatch<SetStateAction<number>>;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ onClose, open, setFilter, onFilterQuantity }) => {
    const [filterRating, setFilterRating] = useState<number>(0);
    const [filterSubject, setFilterSubject] = useState<string[]>([]);
    const [filterLevel, setFilterLevel] = useState<string[]>([]);
    const [filterPriceStart, setFilterPriceStart] = useState<number>(0);
    const [filterPriceEnd, setFilterPriceEnd] = useState<number>(5000000);
    const [filterChange, setFilterChange] = useState<string>('');

    useEffect(() => {
        let quantity = 1;
        if (filterRating) quantity++;
        if (filterSubject.length) quantity++;
        if (filterLevel.length) quantity++;
        onFilterQuantity(quantity);
    }, [filterRating, filterSubject, filterLevel]);

    const onSearch = () => {
        if (filterChange == 'RATE') {
            console.log(filterRating);
            setFilter({ type: filterChange, value: [filterRating] });
        } else if (filterChange == 'SUBJECT') {
            console.log(filterSubject);
            setFilter({ type: filterChange, value: filterSubject });
        } else if (filterChange == 'LEVEL') {
            console.log(filterLevel);
            setFilter({ type: filterChange, value: filterLevel });
        } else if (filterChange == 'PRICE') {
            setFilter({ type: filterChange, value: [filterPriceStart, filterPriceEnd] });
        } else {
            setFilter({ type: '', value: [] });
        }
        onClose();
    };

    console.log({ filterPriceStart });

    return (
        <Drawer title="Bộ lọc" placement="right" onClose={onClose} open={open} className="relative">
            <Accordion isCompact>
                <AccordionItem
                    startContent={<AiFillStar className="text-yellow-500" size={20} />}
                    key="1"
                    aria-label="Đánh giá"
                    title="Đánh giá"
                    subtitle={`>= ${filterRating} sao`}
                >
                    <RatingFilter setFilterRating={setFilterRating} setFilterChange={setFilterChange} />
                </AccordionItem>
                <AccordionItem
                    key="2"
                    aria-label="Môn học"
                    startContent={<BsBookFill className="text-blue-400" size={20} />}
                    title="Môn học"
                    subtitle={`Đã chọn ${filterSubject.length} môn học`}
                >
                    <SubjectFilter setFilterSubject={setFilterSubject} setFilterChange={setFilterChange} />
                </AccordionItem>
                <AccordionItem
                    key="3"
                    aria-label="Trình độ"
                    startContent={<SiLevelsdotfyi className="text-green-400" size={20} />}
                    subtitle={`Đã chọn ${filterLevel.length} mức độ`}
                    title="Trình độ"
                >
                    <LevelFilter setFilterLevel={setFilterLevel} setFilterChange={setFilterChange} />
                </AccordionItem>
                <AccordionItem
                    key="4"
                    aria-label="Mức giá"
                    title="Mức giá"
                    startContent={<FaCoins className="text-orange-400" size={20} />}
                    subtitle={`${filterPriceStart.toLocaleString('vi-VN')}  - ${filterPriceEnd.toLocaleString(
                        'vi-VN'
                    )}`}
                >
                    <PriceFilter
                        filterPriceStart={filterPriceStart}
                        filterPriceEnd={filterPriceEnd}
                        setFilterPriceStart={setFilterPriceStart}
                        setFilterPriceEnd={setFilterPriceEnd}
                        setFilterChange={setFilterChange}
                    />
                </AccordionItem>
            </Accordion>
            <div className="absolute bottom-4">
                <Button color="primary" onClick={onSearch}>
                    Tìm kiếm
                </Button>
                <Button color="danger" variant="bordered" className="ml-4">
                    Xóa bộ lọc
                </Button>
            </div>
        </Drawer>
    );
};

export default FilterDrawer;
