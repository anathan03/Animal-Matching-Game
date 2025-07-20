import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from './Card';
import { useGameSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';

interface AnimalCard {
  id: string;
  animal: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const initialAnimals = [
  { name: 'Lion', image: 'https://i.postimg.cc/T1Br5mSh/cartoon-lion-roaring-on-white-600nw-2423745167.webp' },
  { name: 'Elephant', image: 'https://i.postimg.cc/rpFXPtnD/istockphoto-1178274331-612x612.jpg' },
  { name: 'Giraffe', image: 'https://i.postimg.cc/KYsVpp3W/hand-drawn-cartoon-giraffe-illustration-23-2150368576.avif' },
  { name: 'Zebra', image: 'https://i.postimg.cc/W4tYZmYw/cute-zebra-cartoon-on-white-background-free-vector.jpg' },
  { name: 'Monkey', image: 'https://i.postimg.cc/HWbZbkzR/cute-cartoon-monkey-swinging-branch-600nw-2550712827.webp' },
  { name: 'Tiger', image: 'https://i.postimg.cc/sgHw3QfQ/c-HJpdm-F0-ZS9sci9pb-WFn-ZXMvd2-Vic2l0-ZS8y-MDIy-LTA0-L2pv-Yj-Y4-Ni0y-Nzktdi5qc-Gc.webp' },
  { name: 'Panda', image: 'https://i.postimg.cc/7hqg3wYr/cute-panda-cartoon-isolated-on-600nw-2371081785.webp' },
  { name: 'Kangaroo', image: 'https://i.postimg.cc/TYwbfkK0/hand-painted-kangaroo-design-1152-91.avif' },
  { name: 'Penguin', image: 'https://i.postimg.cc/htVtBx1M/penguin-flat-vector-illustration-on-600nw-2459383763.webp' },
  { name: 'Bear', image: 'https://via.placeholder.com/150/FF338C/FFFFFF?text=Bear' },
  { name: 'Dolphin', image: 'https://i.postimg.cc/d3X3pWny/cute-dolphin-cartoon-jumping-on-600nw-2266715243.webp' },
  { name: 'Owl', image: 'https://i.postimg.cc/cJZHpt7X/owls-typically-have-round-faces-600nw-2456186377.webp' },
  { name: 'Fox', image: 'https://i.postimg.cc/kMZ5npFV/cute-fox-cartoon-illustration-61377289.webp' },
  { name: 'Wolf', image: 'https://via.placeholder.com/150/C0C0C0/000000?text=Wolf' },
  { name: 'Rabbit', image: 'https://via.placeholder.com/150/FFB6C1/000000?text=Rabbit' },
];

const GameBoard: React.FC = () => {
  const [cards, setCards] = useState<AnimalCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const lockBoard = useRef(false);
  const { playCorrect } = useGameSound();

  const initializeGame = useCallback(() => {
    const gameCards: AnimalCard[] = [];
    initialAnimals.forEach(animal => {
      gameCards.push({
        id: uuidv4(),
        animal: animal.name,
        image: animal.image,
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: uuidv4(),
        animal: animal.name,
        image: animal.image,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setScore(0);
    setGameWon(false);
    lockBoard.current = false;
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      lockBoard.current = true;
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);

      if (firstCard && secondCard && firstCard.animal === secondCard.animal) {
        // Match found
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatches(prevMatches => prevMatches + 1);
        setScore(prevScore => prevScore + 10); // Example score increment
        playCorrect();
        setFlippedCards([]);
        lockBoard.current = false;
      } else {
        // No match, flip back after 1 second
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          lockBoard.current = false;
        }, 1000);
      }
    }
  }, [flippedCards, cards, playCorrect]);

  useEffect(() => {
    if (matches > 0 && matches === initialAnimals.length) {
      setGameWon(true);
      showSuccess("You won! Congratulations!");
    }
  }, [matches]);

  const handleCardClick = (id: string) => {
    if (lockBoard.current) return;

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards(prevFlipped => [...prevFlipped, id]);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">Animal Memory Game</h1>
      <div className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-200">
        Score: {score} | Matches: {matches}/{initialAnimals.length}
      </div>
      {gameWon && (
        <div className="text-green-600 dark:text-green-400 text-3xl font-bold mb-6">
          You won!
        </div>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-6xl mx-auto">
        {cards.map(card => (
          <Card
            key={card.id}
            id={card.id}
            image={card.image}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={handleCardClick}
          />
        ))}
      </div>
      <Button onClick={initializeGame} className="mt-8 px-6 py-3 text-lg">
        Reset Game
      </Button>
    </div>
  );
};

export default GameBoard;