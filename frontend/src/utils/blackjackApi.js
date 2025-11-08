import api from './api';

export const startBlackjackRound = async ({ betAmount, clientSeed }) => {
  const response = await api.post('/games/blackjack/start', {
    betAmount,
    clientSeed
  });
  return response.data?.data;
};

export const sendBlackjackAction = async ({ roundId, action }) => {
  const response = await api.post('/games/blackjack/action', {
    roundId,
    action
  });
  return response.data?.data;
};

export const settleBlackjackRound = async ({ roundId }) => {
  const response = await api.post('/games/blackjack/settle', {
    roundId
  });
  return response.data?.data;
};

export const fetchBlackjackRoundState = async ({ roundId }) => {
  const response = await api.get(`/games/blackjack/state/${roundId}`);
  return response.data?.data;
};


