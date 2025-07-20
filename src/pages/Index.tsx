import { MadeWithDyad } from "@/components/made-with-dyad";
import GameBoard from "@/components/GameBoard"; // Import the GameBoard component
import React from "react"; // Import React

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <GameBoard />
      <MadeWithDyad />
    </div>
  );
};

export default Index;