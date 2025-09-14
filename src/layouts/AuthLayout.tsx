import { Layout } from 'antd';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/Topbar';

const { Content } = Layout;

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <Layout className='!min-h-screen'> // Commenting the Layout and using the custom div due to some flickering issue
    <div className="flex min-h-screen">
      <Sidebar />
      <Layout>
        <TopBar />
        <Content className="p-6">{children}</Content>
      </Layout>
    </div>
    // </Layout>
  );
};

export { 
  AuthLayout
};