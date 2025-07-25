import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import RightSidebar from '@/components/RightSidebar';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getAccounts, getAccount } from '@/lib/actions/bank.actions';
import RecentTransactions from '@/components/RecentTransactions';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();

  if (!loggedIn || !loggedIn.$id) {
    return <div>Please log in to view your accounts</div>; // Graceful fallback
  }

  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return <div>No accounts available</div>;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting'
            title='Welcome'
            user={loggedIn?.firstName || 'Guest'}
            subtext='Connect, track, transfer, secured and private.'
          />
          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <div className='hidden md:flex'>
        <RightSidebar
          user={loggedIn}
          transactions={account?.transactions}
          banks={accountsData?.slice(0, 2)}
        />
      </div>
    </section>
  );
};

export default Home;
