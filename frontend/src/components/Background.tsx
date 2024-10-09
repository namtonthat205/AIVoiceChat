import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center">
      <DotLottieReact
        src="./background.json" // Replace with the correct path to your file
        loop
        autoplay
        style={{ width: '100%', height: '100%' , padding : 0}}
      />
    </div>
  );
};

export default BackgroundAnimation;
