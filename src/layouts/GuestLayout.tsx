import { TopBar } from '@/components/Topbar';
import { Layout } from 'antd';

const { Content } = Layout;

const GuestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <Content className='flex flex-col !min-h-screen'>
        <TopBar />
        <div className='flex flex-1 px-5'>{children}</div>
      </Content>
    </Layout>
  );
};

export { 
  GuestLayout
};