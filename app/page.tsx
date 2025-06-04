import HeaderBox from '../components/HeaderBox';

export default function Home() {
  return (
    <main>
      <HeaderBox
        type="greeting"
        title="Welcome"
        subtext="Access and manage your account."
        user="John"
      />
    </main>
  );
}