const BookSeatPage = () => {
    return (
        <div className="p-3">
            {/* Header */}
            <div className="bg-base-100 mb-5 flex p-3 gap-5 bordered shadow-md shadow-secondary rounded-lg">
                <div className="pr-4 border-r-2 border-base-300">
                    <h1 className="text-4xl">Movie Name</h1>
                </div>
                <div className="flex gap-3 overflow-x-hidden">
                    <button className="btn btn-outline btn-info">Proceed to Pay</button>
                    <button className="btn btn-outline btn-info">Proceed to Pay</button>
                    <button className="btn btn-outline btn-info">Proceed to Pay</button>
                    <button className="btn btn-outline btn-info">Proceed to Pay</button>
                </div>
            </div>

            {/* Seats */}
            <div className="flex flex-col items-center justify-center">
                <div className="w-7/12">
                    <div className="grid grid-cols-10 gap-2 w-full place-items-center">
                        {/* Seat */}
                        {[...Array(100)].map((_, index) => 
                            <div key={index} className=""><button className="btn btn-outline hover:bg-success btn-base-200 h-10 w-10"></button></div>
                        )}

                    </div>
                </div>
                    <div className="bg-secondary w-7/12 h-5 text-center mt-10">Screen</div>

            </div>

            {/* checkOut */}
            <div className="bg-base-200 bordered shadow-md shadow-secondary rounded-lg mt-16 mb-16">
                <div>
                    <h1 className="text-2xl p-3">CheckOut</h1>
                </div>

            </div>
        </div>
    );
}

export default BookSeatPage;