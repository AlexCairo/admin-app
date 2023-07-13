import "../components/Pagination.css";

const Pagination = ({totalProducts, productsPerPage, setCurrentPage, currentPage}) => {
    let pages = [];
    
    for(let i = 1; i <= Math.ceil(totalProducts/productsPerPage); i++){
        pages.push(i);
    }
    
    return (
        <div className="pagination flex flex-wrap justify-center mt-4">
            {
                pages.map((page, index)=>{
                    return <button className={`bg-[#131422] w-10 h-10 font-semibold text-base my-[10px] rounded-md cursor-pointer duration-500 ease-in-out bg-transparent border border-[#131422] text-[#131422] ${page === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(page)} key={index}>{page}</button>
                })
            }
        </div>
    )
}

export default Pagination;