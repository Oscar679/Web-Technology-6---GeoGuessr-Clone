
import LoginPage, { Logo, Username, Password, Footer, Title } from '@react-login-page/page8';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../components/ui/breadcrumb"

const css = {
    '--login-bg': 'transparent',
    '--login-color': '#fff',
    '--login-label': '#fff',
    '--login-tab': '#999',
    '--login-input': 'white',
    '--login-input-bg': 'rgb(var(--background))',
    '--login-input-placeholder': 'white',
    '--login-input-border': 'none',
    '--login-input-bg-hover': 'gray',
    '--login-btn': '#fff',
    '--login-btn-bg': '#4F46E5',
    '--login-btn-focus': 'none',
    '--login-btn-hover': '#1d1c1c',
    '--login-btn-active': '#4F46E5',
    '--login-footer': '#ffffff99',
    '--login-animation-start': '#1f1f1f',
    '--login-animation-end': '#1d1c1c',
};

const Demo = () => (
    <div>
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Log In</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <LoginPage style={{
            height: 690,
            ...css
        }}>
            <Logo hidden={true}>
                <Title hidden={true}></Title>
            </Logo>
            <Username panel='signup' visible={true} label="Username" />
            <Password panel="signup" visible={false} keyname="confirm-password" label="Confirm Password" />
            <Footer>
                Not a member? <a href="#">Sign up now</a>
            </Footer>
        </LoginPage>
    </div>
);

export default Demo;