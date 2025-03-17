export const EndScreen = ({
  handleTapGoToInitialScreen,
  handleTapGoToOtherWorks,
}: {
  handleTapGoToInitialScreen: () => void;
  handleTapGoToOtherWorks: () => void;
}) => {
  return (
    <div
      id="end-screen"
      className="bg-gray-900/90 absolute top-0 w-full h-full flex flex-col justify-center items-center select-none"
    >
      <div
        onClick={handleTapGoToInitialScreen}
        onKeyDown={() => {}}
        className="text-white text-2xl cursor-pointer"
      >
        もう一度最初から始める
      </div>
      <div
        onClick={handleTapGoToOtherWorks}
        onKeyDown={() => {}}
        className="text-white text-lg cursor-pointer"
      >
        他の作品を見る
      </div>
    </div>
  );
};
