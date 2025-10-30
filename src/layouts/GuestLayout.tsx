import { TopBar } from '@/components/Topbar';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const GuestLayout = () => {
  return (
    <Layout>
      <Content className='flex flex-col !min-h-screen'>
        <TopBar />
        <div className='flex flex-1 px-5'>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export {
  GuestLayout
};