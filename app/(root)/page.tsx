import React from 'react'
import HeaderBox from '@/components/HeaderBox';

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
            </header>
        </div>
    </section>
  )
}

export default Home
