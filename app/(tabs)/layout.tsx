import TabBar from '@/components/TabBar';

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full'>
      {children}
      <TabBar />
    </div>
  );
}
