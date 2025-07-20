import useSound from 'use-sound';

export const useGameSound = () => {
  const [playCorrect] = useSound('/sounds/correct.mp3'); // Placeholder for correct sound

  return { playCorrect };
};