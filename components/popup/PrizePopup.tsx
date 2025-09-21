// components/PrizePopup.tsx

import React from "react";
import Image from "next/image";

type Prize = {
  id: number;
  name: string;
  image: string;
};

interface PrizePopupProps {
  winner: Prize;
  onClose: () => void;
}

const PrizePopup: React.FC<PrizePopupProps> = ({ winner, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-[#ff6666] mb-4">
          Congratulations!
        </h2>
        <p className="text-lg text-gray-800 mb-4">You won: {winner.name}</p>
        <Image
          src={winner.image}
          alt={winner.name}
          width={200}
          height={200}
          className="mx-auto object-contain"
        />
        <button
          onClick={onClose}
          className="mt-6 bg-[#ff6666] text-white px-4 py-2 rounded-full font-bold uppercase tracking-wide hover:bg-[#ff8080] transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PrizePopup;
