'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-pink-600 hover:text-white hover:bg-pink-600 border border-pink-500/30 px-4 py-1.5 rounded-lg transition duration-200 cursor-pointer font-bold uppercase tracking-wider text-xs"
    >
      Sign Out
    </button>
  );
}
