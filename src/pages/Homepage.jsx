import { useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#EBEBEB] flex justify-center items-center flex-col gap-6 text-center px-4">
      <h1 className="font-bold text-6xl text-gray-700">
        Welcome To{' '}
        <span className="bg-linear-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
          NEXUS
        </span>
      </h1>

      <p className="text-gray-400 text-lg max-w-md">
        Web marketplace aimed to exchange products between University of Oran 1
        students.
      </p>

      <div className="flex gap-4 mt-2">
        <button
          onClick={() => navigate('/signin')}
          className="px-8 py-3 rounded-full text-white font-semibold bg-linear-to-r from-[#FF4760] to-[#FF4385] hover:opacity-90 transition-opacity duration-200 shadow-md"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-3 rounded-full font-semibold border-2 border-[#FF4760] text-[#FF4760] hover:opacity-70 transition-opacity duration-200"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
export default Homepage;
