import Link from 'next/link';

const Header = () => {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
    </div>
  );
};

export default Header;
