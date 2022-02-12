const {google} = require('googleapis');
require('dotenv').config();




// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.DEV_CALENDAR_ID;
const calendarId2 = process.env.CALENDAR_ID3;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});


const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET = '+05:00';

// Get date-time string for calender
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {

    try {

        console.log("Auth is " + auth);
        console.log("CalendarID is " + calendarId2);
        console.log("event is  " + event);
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId2,
            resource: event

            
        });

        
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        
        return 0;
    }
};

// let dateTime = dateTimeForCalander();

// // Event for Google Calendar
// let event = {
//     'summary': `This is the summary.`,
//     'description': `This is the description.`,
//     'start': {
//         'dateTime': dateTime['start'],
//         'timeZone': 'Asia/Kolkata'
//     },
//     'end': {
//         'dateTime': dateTime['end'],
//         'timeZone': 'Asia/Kolkata'
//     }
// };

// insertEvent(event)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Get all the events between two dates
const getEvents = async (dateTimeStart, dateTimeEnd) => {

    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Asia/Kolkata'
        });
    
        const items = response['data']['items'];
        items.map(res=>{
            if(res.creator.email.startsWith('osama')){
            // || res.creator.email.startsWith('faraz')
            // || res.creator.email.startsWith('zmk')){
                console.log('id',res.id);
                console.log('creator',res.creator);
                console.log('summary', res.summary);
                console.log('date', res.start);
                console.log('\n');

                

                let event = {
                        'summary': res.summary,
                        'description': res.description,
                        // 'dateTime': res.start.dateTime,
                        // 'timeZone': res.start.timeZone,
                        // 'endDateTime': res.end.dateTime,
                        // 'endtimeZone': res.end.timeZone

                        'start': {
                            'dateTime': res.start.dateTime,
                            // 'timeZone': res.start.timeZone
                        },
                        'end': {
                            'dateTime': res.end.dateTime,
                            // 'timeZone': res.end.timeZone
                        }
                    };
                
                insertEvent(event)
                .then((res) => {
                    console.log("Response is " + res);
                })
                .catch((err) => {
                    console.log("Error is " + err);
                });
            }
            
            // mysql.insert('afafaf').va
        })
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};

let start = '2021-10-03T00:00:00.000Z';
let end = '2022-10-09T00:00:00.000Z';

getEvents(start, end);

// Delete an event from eventID
// const deleteEvent = async (eventId) => {

//     try {
//         let response = await calendar.events.delete({
//             auth: auth,
//             calendarId: calendarId,
//             eventId: eventId
//         });

//         if (response.data === '') {
//             return 1;
//         } else {
//             return 0;
//         }
//     } catch (error) {
//         console.log(`Error at deleteEvent --> ${error}`);
//         return 0;
//     }
// };

// let eventId = 'hkkdmeseuhhpagc862rfg6nvq4';

// deleteEvent(eventId)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });