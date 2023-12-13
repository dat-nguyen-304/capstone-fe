'use client';

import { studentNoteApi } from '@/api-client/student-note-api';
import { useCustomModal } from '@/hooks';
import { Card, Chip } from '@nextui-org/react';
import HTMLReactParser from 'html-react-parser';
import { BiSolidPencil } from 'react-icons/bi';
import { BsTrash3 } from 'react-icons/bs';

interface NoteItemProps {
    time: string;
    noteData: any;
    onEditNote: () => void;
    refetch?: any;
    handleButtonClick: any;
}
const convertTimeToSeconds = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};
const NoteItem: React.FC<NoteItemProps> = ({ time, noteData, onEditNote, refetch, handleButtonClick }) => {
    const { onOpen, onWarning, onDanger, onClose, onLoading, onSuccess } = useCustomModal();

    const handleDeleteNote = async (id: number) => {
        try {
            // Call the delete API and pass the noteId
            const res = await studentNoteApi.deleteVideoNote(id);

            // Optionally, refetch data after deletion
            if (res) {
                onSuccess({
                    title: 'Xóa thành công',
                    content: 'Note đã được xóa thành công'
                });
                refetch();
            }
        } catch (error) {
            onDanger({
                title: 'Có lỗi xảy ra',
                content: 'Hệ thống gặp trục trặc, thử lại sau ít phút'
            });
            console.error('Error changing user status', error);
        }
    };
    const onApproveOpen = (id: number) => {
        onWarning({
            title: 'Xác nhận xóa',
            content: 'Note sẽ bị xóa sau khi được duyệt. Bạn chắc chứ?',
            activeFn: () => handleDeleteNote(id)
        });
        onOpen();
    };

    return (
        <li className="mt-8">
            <Card className="p-2">
                <div className="flex justify-between items-center">
                    <Chip
                        size="sm"
                        className="text-xs sm:text-sm cursor-pointer"
                        onClick={() => handleButtonClick(convertTimeToSeconds(noteData?.duration))}
                        color="primary"
                        variant="solid"
                    >
                        {noteData?.duration}
                    </Chip>
                    <div className="flex items-center text-lg gap-5">
                        <div
                            className="flex justify-center items-center p-2 my-1 rounded-full bg-yellow-50 cursor-pointer"
                            onClick={onEditNote}
                        >
                            <BiSolidPencil className="text-yellow-500 text-sm sm:text-base" />
                        </div>
                        <div
                            className="flex justify-center items-center p-2 my-1 rounded-full bg-red-50 cursor-pointer"
                            onClick={() => onApproveOpen(noteData?.id)}
                        >
                            <BsTrash3 className="text-red-700 text-sm sm:text-base" />
                        </div>
                    </div>
                </div>
                <div className="p-2">
                    <span className="text-xs sm:text-sm">{HTMLReactParser(String(noteData?.note || 'Video hay'))}</span>
                </div>
            </Card>
        </li>
    );
};

export default NoteItem;
