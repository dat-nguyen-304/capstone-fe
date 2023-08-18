import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
    username: yup.string().required('Vui lòng nhập Tên đăng nhập').min(4, 'Tên đăng nhập phải bao gồm ít nhất 4 kí tự'),
    name: yup.string().required('Vui lòng nhập Họ và tên'),
    password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải bao gồm ít nhất 6 kí tự'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), undefined], 'Mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu')
});
