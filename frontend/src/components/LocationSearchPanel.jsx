import React from 'react'

const LocationSearchPanel = (props) => {

    const locations=[
        "24A Near Gauranga cafe karampura new Delhi-110015",
        "24B Near Kumar's cafe karampura new Delhi-110015",
        "24C Near Gaur's cafe karampura new Delhi-110015",
        "24D Near Sharma's cafe karampura new Delhi-110015",
    ]

  return (
    <div>
        {/* this is just a sample data */}
        
        {
            locations.map(function(elem,idx){
                return <div key={idx} onClick={()=>{
                    props.setVehiclePanel(true);
                    props.setPanelOpen(false);
                }} className='flex gap-4  border-2 p-3 border-grey-50 active:border-black rounded-xl my-2 items-center justify-start'>
                            <h2 className='bg-[#eee] h-7 w-7 flex items-center justify-center rounded-full'><i className="ri-map-pin-fill"></i></h2>
                            <h4 className='font-medium'>{elem}</h4>
                        </div>
            })
        }
        
        <div className='flex gap-4  border-2 p-3 border-grey-50 active:border-black rounded-xl my-2 items-center justify-start'>
            <h2 className='bg-[#eee] h-7 w-7 flex items-center justify-center rounded-full'><i className="ri-map-pin-fill"></i></h2>
            <h4 className='font-medium'>S.B.M Senior Secondary School, Sivaji Marg, New Delhi-110015</h4>
        </div>

        <div className='flex gap-4 border-2 p-3 border-grey-50 active:border-black rounded-xl my-2 items-center justify-start'>
            <h2 className='bg-[#eee] h-7 w-7 flex items-center justify-center rounded-full'><i className="ri-map-pin-fill"></i></h2>
            <h4 className='font-medium'>S.B.M Senior Secondary School, Sivaji Marg, New Delhi-110015</h4>
        </div>

        <div className='flex gap-4 border-2 p-3 border-grey-50 active:border-black rounded-xl my-2 items-center justify-start'>
            <h2 className='bg-[#eee] h-7 w-7 flex items-center justify-center rounded-full'><i className="ri-map-pin-fill"></i></h2>
            <h4 className='font-medium'>S.B.M Senior Secondary School, Sivaji Marg, New Delhi-110015</h4>
        </div>

        <div className='flex gap-4 border-2 p-3 border-grey-50 active:border-black rounded-xl my-2 items-center justify-start'>
            <h2 className='bg-[#eee] h-7 w-7 flex items-center justify-center rounded-full'><i className="ri-map-pin-fill"></i></h2>
            <h4 className='font-medium'>S.B.M Senior Secondary School, Sivaji Marg, New Delhi-110015</h4>
        </div>
    </div>
  )
}

export default LocationSearchPanel