import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

export const handleFileSelection = (e: any, setExcelFile: Function) => {
    let fileType = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
        if (selectedFile && fileType.includes(selectedFile?.type)) {
            let reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload = (e: any) => {
                setExcelFile(e.target.result);
            };
        } else {
            toast.error('Vui lòng chỉ chọn file excel');
            setExcelFile(null);
        }
    } else {
        console.log('Please select your file');
    }
};

export const handleFileSubmitSelection = (
    excelFile: ArrayBuffer | null,
    setExcelFile: Function,
    fileInputRef: React.RefObject<HTMLInputElement>,
    topicsData: any,
    setQuestions: any
) => {
    if (excelFile !== null) {
        const workbook = XLSX.read(excelFile, { type: 'buffer' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers: any = data[0];
        const requiredHeaders = ['statement', 'explanation', 'A', 'B', 'C', 'D', 'topic', 'correctAnswer', 'level'];
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
            toast.error('File không đúng yêu cầu');
        } else {
            const statementIndex = headers.indexOf('statement');
            const explanationIndex = headers.indexOf('explanation');
            const answerIndices = ['A', 'B', 'C', 'D'];
            const topicIndex = headers.indexOf('topic');
            const correctAnswerIndex = headers.indexOf('correctAnswer');
            const levelIndex = headers.indexOf('level');
            const imageUrlIndex = headers.indexOf('imageUrl');

            const questions = data.slice(1).map((row: any) => {
                const statement = row[statementIndex];
                const explanation = row[explanationIndex];
                const answerList = answerIndices.map(answer => String(row[headers.indexOf(answer)]));
                const topicName = row[topicIndex];
                const correctAnswer = row[correctAnswerIndex];
                const level = row[levelIndex];
                const imageUrl =
                    imageUrlIndex !== -1
                        ? row[imageUrlIndex] !== undefined
                            ? (String(row[imageUrlIndex])?.startsWith('http://') ||
                                  String(row[imageUrlIndex])?.startsWith('https://')) &&
                              String(row[imageUrlIndex]).length > 8
                                ? row[imageUrlIndex]
                                : null
                            : null
                        : null;

                const matchedTopic = topicsData?.data?.find((topic: any) => String(topic.name).includes(topicName));
                if (matchedTopic) {
                    const topicId = matchedTopic.id;

                    return {
                        statement,
                        explanation,
                        answerList,
                        topicId,
                        correctAnswer,
                        level,
                        imageUrl
                    };
                } else {
                    return null;
                }
            });
            const validQuestions = questions.filter((question: any) => question !== null);
            if (validQuestions?.length > 0) {
                setQuestions((prevQuestions: any) => [...prevQuestions, ...validQuestions]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setExcelFile(null);
            } else {
                toast.error('File bài tập của bạn không phù hợp với môn hiện tại vui lòng chọn file khác');
            }
        }
    } else {
        toast.error('Vui lòng chọn file trước khi thêm câu hỏi');
    }
};
