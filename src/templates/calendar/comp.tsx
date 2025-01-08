import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { EventInput } from '@fullcalendar/core/index.js'


const DEF_EVENTS: EventInput[] = [
    {
        id: '1',
        title: 'Meetinggggggggg ',
        start: new Date(),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000), 
        borderColor: 'green',
        extendedProps: {
            status: 'done',
            username: 'John Doe',
            username1: 'Atharva'
        }
    },
    {
        id: '2',
        title: 'Birthday Party',
        start: new Date(Date.now() + 2 * 60 * 60 * 1000),
        editable: true,
        extendedProps: {
            status: 'Ongoing',
            username: 'Kamal',
        }
    },
    {
        id: '3',
        title: 'Review',
        start: new Date(Date.now() + 3 * 60 * 60 * 1000),
        editable: true,
        extendedProps: {
            status: 'Ongoing',
            username: 'Kamal',
        }
    }
]

// a custom render function
function renderEventContent(eventInfo: any) {

    return (
        <div className='p-1 w-full'>
            <div className='bg-white hover:bg-gray-100 border-[1px] border-gray-200 rounded-md p-2'>
                <div className=' flex flex-row gap-2'>
                    <div className='w-1 h-12 bg-emerald-500'>

                        <line x1="0" y1="10" x2="250" y2="10" />

                    </div>
                    <div className="w-full flex flex-col gap-2">

                        <i className="font-bold not-italic text-ellipsis overflow-hidden text-nowrap">{eventInfo.event.title}</i>

                        <div className='flex flex-row'>

                            <div>
                                10:30 PM
                                {/* {eventInfo.event.start} */}
                            </div>
                            -
                            <div>
                                11:30 PM
                                {/* {eventInfo.event.end} */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row pt-3 items-center justify-between w-full'>

                    <div className='italic text-gray-600  text-ellipsis overflow-hidden text-nowrap'>{eventInfo.event.extendedProps.username} {',' + eventInfo.event.extendedProps.username1} +2</div>
                    <div className='flex items-center justify-center w-fit'>

                        <button className="text-gray-700 background-transparent underline font-bold uppercase  pl-5 text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                        >
                            Join
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

const Calendar = () => {

    return (
        <div>

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridWeek"
                events={DEF_EVENTS}
                eventContent={renderEventContent}
                
                // slotLabelFormat={
                //     {
                //         weekday: 'short',
                //         day: 'numeric',
                //     }
                // }
            />
        </div>
    )
}




export default Calendar