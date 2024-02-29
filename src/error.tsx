import { useNavigate } from "react-router-dom";
function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col gap-5 justify-center items-center text-white">
      <div className="text-2xl">Something went wrong</div>
      <button
        onClick={() => {
          navigate(`?exit=true`);
          window.location.reload();
        }}
        className="bg-white text-black text-xl p-2 rounded-md"
      >
        Exit
      </button>
    </div>
  );
}

export default ErrorPage;
