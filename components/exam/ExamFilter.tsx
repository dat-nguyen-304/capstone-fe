'use client';

import { subjectApi } from '@/api-client';
import { Subject } from '@/types';
import { Button, Input, Select, SelectItem, Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

interface ExamFilterProps {
    selectedSubject: number;
    setSelectedSubject: Dispatch<SetStateAction<number>>;
    setSelectedFilterSort: Dispatch<SetStateAction<number>>;
}

const ExamFilter: React.FC<ExamFilterProps> = ({ selectedSubject, setSelectedSubject, setSelectedFilterSort }) => {
    const { data } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });
    const skeletonArray: number[] = [1, 2, 3, 4, 5, 6, 7];
    return (
        <>
            <ul className="flex gap-1 mt-8 flex-wrap">
                <li>
                    <Button
                        onClick={() => setSelectedSubject(0)}
                        variant="light"
                        className={selectedSubject === 0 ? 'border-blue-500 bg-blue-100 text-blue-500' : ''}
                    >
                        Tất cả
                    </Button>
                </li>
                {data
                    ? data.map((subject: Subject) => (
                          <li key={subject.id}>
                              <Button
                                  onClick={() => setSelectedSubject(subject.id)}
                                  variant="light"
                                  className={
                                      selectedSubject === subject.id ? 'border-blue-500 bg-blue-100 text-blue-500' : ''
                                  }
                              >
                                  <Image src={subject.url} alt="" width={20} height={20} />
                                  <span>{subject.name}</span>
                              </Button>
                          </li>
                      ))
                    : skeletonArray.map(item => (
                          <Skeleton key={item} isLoaded={false} className="rounded-xl">
                              <li className="w-[160px] sm:w-[100px] h-[40px] rounded-xl px-2 py-2 sm:py-4 sm:px-4"></li>
                          </Skeleton>
                      ))}
            </ul>
            <div className="md:flex items-center gap-8 mt-4">
                <div className="flex flex-[1] gap-2 md:mt-0 mt-4">
                    <Input color="primary" variant="bordered" placeholder="Nhập từ khóa" className="flex-[1]" />
                    <Button color="primary" className="">
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
                        onChange={event => setSelectedFilterSort(Number(event?.target?.value))}
                    >
                        <SelectItem key={0} value={0}>
                            Tất cả
                        </SelectItem>
                        <SelectItem key={1} value={1}>
                            Mới nhất
                        </SelectItem>
                        <SelectItem key={2} value={2}>
                            Chưa làm
                        </SelectItem>
                        <SelectItem key={3} value={3}>
                            Đã làm
                        </SelectItem>
                    </Select>
                </div>
            </div>
        </>
    );
};

export default ExamFilter;
