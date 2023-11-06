import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .email('Địa chỉ email không hợp lệ')
        .required('Vui lòng nhập email')
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Hệ thống hiện chỉ hỗ trợ email @gmail.com'),
    fullName: yup
        .string()
        .trim()
        .min(3, 'Họ và tên phải bao gồm ít nhất 3 kí tự')
        .required('Vui lòng nhập họ và tên')
        .matches(/^[\p{L}\s]+$/u, 'Tên đầy đủ chỉ được chứa chữ cái và khoảng trắng'),
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

export const changePasswordSchema = yup.object().shape({
    oldPassword: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải bao gồm ít nhất 6 kí tự')
        .matches(/^\S*$/, 'Mật khẩu không được chứa khoảng trắng'),
    newPassword: yup
        .string()
        .notOneOf([yup.ref('oldPassword'), undefined], 'Mật khẩu mới phải khác mật khẩu cũ')
        .required('Vui lòng xác nhận mật khẩu'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), undefined], 'Mật khẩu mới không khớp')
        .required('Vui lòng xác nhận mật khẩu')
});

export const resetPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải bao gồm ít nhất 6 kí tự')
        .matches(/^\S*$/, 'Mật khẩu không được chứa khoảng trắng'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), undefined], 'Mật khẩu mới không khớp')
        .required('Vui lòng xác nhận mật khẩu')
});

export const forgotPasswordEmailSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .email('Địa chỉ email không hợp lệ')
        .required('Vui lòng nhập email')
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Hệ thống hiện chỉ hỗ trợ email @gmail.com')
});
