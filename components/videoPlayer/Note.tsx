'use client';

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Drawer } from 'antd';
import { Button } from '@nextui-org/react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface NoteProps {
    currentTime: string;
}

const Note: React.FC<NoteProps> = ({ currentTime }) => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    return (
        <div className="mt-4">
            <Button onClick={showDrawer}>
                <AiOutlinePlus /> Thêm ghi chú tại {currentTime}
            </Button>
            <Drawer
                title={`Thêm ghi chú tại ${currentTime}`}
                placement="right"
                width={500}
                open={open}
                onClose={() => setOpen(false)}
            >
                <ReactQuill theme="snow" />
                <div className="mt-4 gap-4 flex justify-end ">
                    <Button size="sm">Hủy bỏ</Button>
                    <Button size="sm" color="primary">
                        Lưu
                    </Button>
                </div>
            </Drawer>
        </div>
    );
};

export default Note;