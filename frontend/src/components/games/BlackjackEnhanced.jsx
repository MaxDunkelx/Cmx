import { useCallback } from 'react';
import BlackjackExperience from './blackjack/BlackjackExperience';
import { useAuth } from '../../context/AuthContext';

export default function BlackjackEnhanced() {
  const { user, setUser } = useAuth();

  const handleBalanceChange = useCallback(
    (nextBalance) => {
      if (typeof nextBalance !== 'number' || !setUser) return;
      setUser((prevUser) => ({
        ...prevUser,
        balance: nextBalance
      }));
    },
    [setUser]
  );

  const initialBalance =
    typeof user?.balance === 'number' && Number.isFinite(user.balance)
      ? user.balance
      : undefined;

  return (
    <BlackjackExperience
      onBalanceChange={handleBalanceChange}
      initialBalance={initialBalance}
    />
  );
}
