'use client';

import { QuestionType } from '@/types';
import { Accordion, AccordionItem, Button, Chip, Radio, RadioGroup, useDisclosure } from '@nextui-org/react';
import HTMLReactParser from 'html-react-parser';
import AddQuestionModal from './AddQuestionModal';
import { useState } from 'react';

interface TestEditItemProps {
    index: number;
    questions: QuestionType | any;
    onEdit: (index: number, editedQuestion: any) => void;
    subjectId: number;
}
const getSubjectNameById = (id: number): string => {
    if (id == 1) {
        return 'MATHEMATICS';
    } else if (id == 2) {
        return 'PHYSICS';
    } else if (id == 3) {
        return 'CHEMISTRY';
    } else if (id == 4) {
        return 'ENGLISH';
    } else if (id == 5) {
        return 'BIOLOGY';
    } else if (id == 6) {
        return 'HISTORY';
    } else if (id == 7) {
        return 'GEOGRAPHY';
    } else {
        return '';
    }
};
const TestEditItem: React.FC<TestEditItemProps> = ({ questions, subjectId, index, onEdit }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editIndex, setEditIndex] = useState<number | undefined>();
    const [editQuestion, setEditQuestion] = useState<any | null>(null);
    const handleAddQuestion = (question: any) => {};
    const handleEditOpen = (index: number) => {
        setEditIndex(index);
        setEditQuestion(questions);
        onOpen(); // Open the modal
    };
    return (
        <li className="mt-4">
            <span className="font-semibold text-sm">
                <div className="flex items-center gap-4">
                    <Chip color="primary" variant="flat" size="md">
                        Câu {index + 1}
                    </Chip>
                    <Button color="warning" size="sm" onClick={() => handleEditOpen(index)}>
                        Chỉnh sửa
                    </Button>
                </div>
                <span>{HTMLReactParser(questions?.statement)}</span>
            </span>
            <AddQuestionModal
                isOpen={isOpen}
                onClose={onClose}
                onAddQuestion={handleAddQuestion}
                subject={getSubjectNameById(subjectId)}
                editIndex={editIndex}
                editQuestion={editQuestion}
                onEditQuestion={onEdit}
            />
            {questions?.answerList?.map((answerList: any, index: number) => (
                <RadioGroup key={index} value={questions?.correctAnswer} className="mt-2">
                    <Radio
                        size="sm"
                        value={String.fromCharCode(65 + index)}
                        className={`ml-2 ${
                            String.fromCharCode(65 + index) === questions?.correctAnswer
                                ? 'bg-green-100 rounded-md'
                                : ''
                        }`}
                    >
                        <div className="ml-2" suppressContentEditableWarning={true}>
                            <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                            <span className="inline-block">{HTMLReactParser(answerList)}</span>
                        </div>
                    </Radio>
                </RadioGroup>
            ))}
            <div className="mt-4 mb-8">
                <Accordion isCompact variant="bordered">
                    <AccordionItem key="1" aria-label="Accordion 1" title="Xem lời giải" className="text-sm">
                        <>{HTMLReactParser(questions?.explanation)}</>
                    </AccordionItem>
                </Accordion>
            </div>
        </li>
    );
};

export default TestEditItem;
