import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        // setVehiclePanel(true)
        // setPanelOpen(false)
    }

    return (
            <div>
                {
                    suggestions.map((elem, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleSuggestionClick(elem)}
                        className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 mt-6 justify-start'
                    >
                    <div className='bg-[#eee] h-12 w-12 flex items-center justify-center rounded-full text-xl'>
                    <i className="ri-map-pin-fill"></i>
                    </div>
                    <h4 className='font-medium'>{elem}</h4>
                    </div>
                    ))
                }
            </div>

    )
}

export default LocationSearchPanel