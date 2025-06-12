import React from 'react'
import HeaderBox from '@/components/HeaderBox';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import RightSidebar from '@/components/RightSidebar';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Home = async () => {
    const loggedIn = await getLoggedInUser();

  return (
    <section className='home'>
        <div className='home-content'>
            <header className='home-header'>
                <HeaderBox
                    type='greeting'
                    title='Welcome'
                    user={loggedIn?.name || 'Guest'}
                    subtext='Connect, track, transfer, secured and private.'
                    />
                <TotalBalanceBox
                    accounts={[]}
                    totalBanks={1}
                    totalCurrentBalance={9250.56}
                    />
            </header>

            RECENT TRANSACTIONS
        </div>
        <RightSidebar
            user={loggedIn}
            transactions={[]}
            banks={[{currentBalance:  9250.56}, {currentBalance: 5000}]}
            />
    </section>
  )
}

export default Home
