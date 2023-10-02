import { Form } from 'antd';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import styles from '@/app/auth/page.module.css';

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = ({}) => {
    return (
        <Form action="#" className={styles.signInForm}>
            <h2 className={styles.title}>Đăng nhập</h2>
            <div className={styles.inputField}>
                <i>
                    <AiOutlineUser />
                </i>
                <input type="text" placeholder="Email" />
            </div>
            <div className={styles.inputField}>
                <i>
                    <AiOutlineLock />
                </i>
                <input type="password" placeholder="Mật khẩu" />
            </div>
            <Form.Item>
                <button type="submit" className={`${styles.btn} ${styles.solid}`}>
                    Đăng nhập
                </button>
            </Form.Item>
            <p className={styles.socialText}>Hoặc đăng nhập với</p>
            <div className={styles.socialMedia}>
                <a href="#" className={styles.socialIcon}>
                    <i className="fab fa-google">
                        <FcGoogle />
                    </i>
                </a>
            </div>
        </Form>
    );
};

export default LoginForm;
