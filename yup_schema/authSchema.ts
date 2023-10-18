import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
    email: yup.string().trim().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập email'),
    fullName: yup.string().trim().min(3, 'Họ và tên phải bao gồm ít nhất 3 kí tự').required('Vui lòng nhập họ và tên'),
    password: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải bao gồm ít nhất 6 kí tự')
        .matches(/^\S*$/, 'Mật khẩu không được chứa khoảng trắng'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), undefined], 'Mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu')
});

export const loginSchema = yup.object().shape({
    email: yup.string().trim().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập email'),
    password: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải bao gồm ít nhất 6 kí tự')
        .matches(/^\S*$/, 'Mật khẩu không được chứa khoảng trắng')
});
