import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
    email: yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập email'),
    name: yup.string().required('Vui lòng nhập họ và tên'),
    password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải bao gồm ít nhất 6 kí tự'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), undefined], 'Mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu')
});
