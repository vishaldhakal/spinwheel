import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Gift, Frown, X, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SpinWheel from "./SpinWheel";
import { SubmissionResponse, GiftItem } from "./types";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

interface SubmissionResultProps {
  submissionResponse: SubmissionResponse;
  giftList: GiftItem[];
}

const SubmissionResult: React.FC<SubmissionResultProps> = ({
  submissionResponse,
  giftList,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<GiftItem | null>(null);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleSpin = () => {
    if (!isSpinning && submissionResponse && !hasSpun) {
      setIsSpinning(true);
      setWinner(null);

      const winningIndex = giftList.findIndex(
        (gift) => gift.id === submissionResponse.gift?.id
      );
      const prizeAngle = 360 / giftList.length;
      const fullRotations = Math.floor(Math.random() * 5 + 5) * 360;

      const targetRotation =
        fullRotations + (360 - winningIndex * prizeAngle - prizeAngle / 2);

      setRotation(targetRotation);

      // Set isSpinning to false after 5 seconds (spinning animation duration)
      setTimeout(() => {
        setIsSpinning(false);
        setWinner(submissionResponse.gift || null);
        setHasSpun(true);

        // Show popup and confetti after an additional 3 seconds
        setTimeout(() => {
          setShowPopup(true);

          if (
            submissionResponse.gift &&
            submissionResponse.gift.name !== "Better Luck"
          ) {
            setShowConfetti(true);
            toast({
              title: "Congratulations!",
              description: `You've won a ${submissionResponse.gift.name}!`,
            });
          } else {
            toast({
              title: "Better luck next time!",
              description: "Unfortunately, you didn't win a prize this time.",
            });
          }
        }, 1000);
      }, 5000);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className="text-center p-8 rounded-lg shadow-xl w-full max-w-4xl">
      {showConfetti && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9999 }}
        >
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
            initialVelocityY={10}
            className="z-50"
            confettiSource={{
              x: windowDimensions.width / 2,
              y: 0,
              w: 0,
              h: 0,
            }}
          />
        </div>
      )}
      <h2 className="text-4xl font-bold mb-8 text-[#fff]">Spin the Wheel!</h2>
      <div className="relative">
        <SpinWheel
          rotation={rotation}
          winner={winner}
          hasSpun={hasSpun}
          giftList={giftList}
          isSpinning={isSpinning}
        />
      </div>
      {!hasSpun && (
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="mt-6 bg-[#ff6666] text-white px-8 py-3 rounded-full text-xl font-bold uppercase tracking-wide hover:bg-[#ff8080] transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? (
            <span className="inline-flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Spinning...
            </span>
          ) : (
            <>
              <Gift className="inline-block mr-2" />
              Spin the Wheel
            </>
          )}
        </button>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative animate-fade-in-up">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
              {winner && winner.name !== "Better Luck" ? (
                <>
                  <Gift className="mr-2" size={24} />
                  Congratulations!
                </>
              ) : (
                <>
                  <Frown className="mr-2" size={24} />
                  Thank you for participating!
                </>
              )}
            </h3>
            {winner && winner.name !== "Better Luck" ? (
              <>
                <p className="text-xl mb-4">You've won a {winner.name}!</p>
                {/* imei number */}
                <p className="text-xl mb-4">
                  Your IMEI number is {submissionResponse.imei}
                </p>
                <Image
                  src={winner.image}
                  alt={winner.name}
                  width={150}
                  height={150}
                  className="mx-auto object-contain"
                />
              </>
            ) : (
              <>
                <p className="text-xl mb-4 text-[#ff6666]">
                  Unfortunately, you didn't win a prize this time. Try again
                  next time!
                </p>
                <Image
                  src={winner?.image || ""}
                  alt={winner?.name || ""}
                  width={150}
                  height={150}
                  className="mx-auto object-contain"
                />
              </>
            )}
            <p className="text-2xl font-bold mt-6 mb-8 text-[#ff8c00]">
              Happy New Year 2082!
            </p>
            <button
              onClick={goToHome}
              className="w-full bg-[#ff6666] text-white px-6 py-2 rounded-full text-lg font-bold uppercase tracking-wide hover:bg-[#ff8080] transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Home className="mr-2" size={20} />
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionResult;
