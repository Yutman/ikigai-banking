import React from 'react'
import HeaderBox from '@/components/HeaderBox';
import TotalBalanceBox from '@/components/TotalBalanceBox';

const Home = () => {
    const loggedIn = {firstName: 'Muchiri'};

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
                    accounts={[]}
                    totalBanks={1}
                    totalCurrentBalance={9250.56}
                    />
            </header>
        </div>
    </section>
  )
}

export default Home
