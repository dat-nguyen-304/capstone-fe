'use client';

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Drawer } from 'antd';
import { Button } from '@nextui-org/react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import NoteItem from './NoteItem';
import { useQuery } from '@tanstack/react-query';
import { studentNoteApi } from '@/api-client/student-note-api';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface NoteProps {
    currentTime: string;
    videoId: number;
}

const Note: React.FC<NoteProps> = ({ currentTime, videoId }) => {
    const [open, setOpen] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [editNoteData, setEditNoteData] = useState(null);
    const [editNoteId, setEditNoteId] = useState(null);
    const [editNoteDuration, setEditNoteDuration] = useState(null);
    const showDrawer = (editData: any) => {
        setNoteContent(editData?.note);
        setEditNoteData(editData);
        setEditNoteId(editData?.id);
        setEditNoteDuration(editData?.duration);
        setOpen(true);
    };

    const { data, isLoading, refetch } = useQuery<any>({
        queryKey: ['video-detail-notes', { videoId }],
        queryFn: () => studentNoteApi.getVideoNote(videoId)
    });
    const handleSaveNote = async () => {
        try {
            if (editNoteData && editNoteId) {
                // If editing an existing note

                const response = await studentNoteApi.editVideoNote({
                    id: editNoteId,
                    note: noteContent
                    // Add any other necessary payload properties
                });
                if (response) {
                    setNoteContent('');
                    setEditNoteData(null);
                    setEditNoteDuration(null);
                    setEditNoteId(null);
                    refetch();
                }
            } else {
                const [minutes, seconds] = currentTime.split(':');
                const formattedDuration = `00:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
                const response = await studentNoteApi.createVideoNote({
                    videoId: videoId,
                    note: noteContent,
                    duration: formattedDuration
                    // Add any other necessary payload properties
                });

                if (response) {
                    refetch();
                    setNoteContent('');
                }
            }
        } catch (error) {
            console.error('Error saving note:', error);
        }

        setOpen(false); // Close the drawer after saving
    };
    // console.log(editNoteData);

    return (
        <div className="mt-4">
            {data?.length != 5 ? (
                <Button onClick={showDrawer} className="text-xs sm:text-sm">
                    <AiOutlinePlus /> Thêm ghi chú tại {currentTime}
                </Button>
            ) : null}
            <Drawer
                title={
                    editNoteDuration ? `Chỉnh sử ghi chú tại ${editNoteDuration}` : `Thêm ghi chú tại ${currentTime}`
                }
                placement="right"
                width={500}
                open={open}
                onClose={() => setOpen(false)}
            >
                <ReactQuill theme="snow" value={noteContent} onChange={content => setNoteContent(content)} />
                <div className="mt-4 gap-4 flex justify-end ">
                    <Button size="sm" onClick={() => setOpen(false)}>
                        Hủy bỏ
                    </Button>
                    <Button size="sm" color="primary" onClick={handleSaveNote}>
                        Lưu
                    </Button>
                </div>
            </Drawer>
            <ul>
                {data?.length
                    ? data?.map((note: any, index: number) => (
                          <NoteItem
                              key={index}
                              time={currentTime}
                              noteData={note}
                              onEditNote={() => showDrawer(note)}
                              refetch={refetch}
                          />
                      ))
                    : null}

                {/* <NoteItem time={currentTime} />
                <NoteItem time={currentTime} />
                <NoteItem time={currentTime} />
                <NoteItem time={currentTime} />
                <NoteItem time={currentTime} />
                <NoteItem time={currentTime} /> */}
            </ul>
        </div>
    );
};

export default Note;
