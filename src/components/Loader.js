import "../components/Loader.css"

const Loader = () => {
    return(
    <div className="loader bg-gray-800 p-5 rounded-full flex space-x-3 w-[7.6rem] absolute bottom-2/4 right-[45%]">
        <div className="w-5 h-5 bg-white rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-white rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-white rounded-full animate-bounce"></div>
    </div>
    );
}
export default Loader;