// DataProvinces
const dataProvinces = {
    provinces: [
        {
            id: "string", // Example: "1"
            name: "string", // Example: "Province Name"
        },
    ],
};

// DataCities
const dataCities = {
    cities: [
        {
            id: "string", // Example: "1"
            name: "string", // Example: "City Name"
        },
    ],
};

// ParamHospital
const paramHospital = {
    type: 1, // Example: 1
    provinceid: "string", // Example: "1"
    cityid: "string", // Example: "1" or 1
};

// HospitalsList
const hospitalsList = {
    id: "string", // Example: "1"
    name: "string", // Example: "Hospital Name"
    address: null, // Example: "123 Hospital St" or null
    phone: null, // Example: "123-456-7890" or null
    bed_availability: 50, // Example: 50
    available_beds: [
        {
            available: 20, // Example: 20
            bed_class: "Standard", // Example: "Standard"
            room_name: "Room A", // Example: "Room A"
            info: "Near the window", // Example: "Near the window"
        },
    ], // Example: an array or null
    info: null, // Example: "General hospital"
    queue: 5, // Example: 5
};

// BedsList
const bedsList = {
    available: 20, // Example: 20
    bed_class: "Standard", // Example: "Standard"
    room_name: "Room A", // Example: "Room A"
    info: "Near the window", // Example: "Near the window"
};

// ResponseHopitalsList
const responseHospitalsList = {
    status: 200, // Example: 200
    hospitals: [
        {
            id: "string", // Example: "1"
            name: "string", // Example: "Hospital Name"
            address: null, // Example: "123 Hospital St" or null
            phone: null, // Example: "123-456-7890" or null
            bed_availability: 50, // Example: 50
            available_beds: [
                {
                    available: 20, // Example: 20
                    bed_class: "Standard", // Example: "Standard"
                    room_name: "Room A", // Example: "Room A"
                    info: "Near the window", // Example: "Near the window"
                },
            ], // Example: an array or null
            info: null, // Example: "General hospital"
            queue: 5, // Example: 5
        },
    ],
};

// BedDetail
const bedDetail = {
    time: "2025-04-06T14:00:00Z", // Example: "2025-04-06T14:00:00Z"
    stats: {
        title: "Bed Availability", // Example: "Bed Availability"
        bed_empty: 10, // Example: 10
        bed_available: 20, // Example: 20
        queue: 5, // Example: 5
    },
};

// ResponseBedDetail
const responseBedDetail = {
    status: 200, // Example: 200
    data: {
        id: "string", // Example: "1"
        name: "string", // Example: "Hospital Name"
        address: "123 Hospital St", // Example: "123 Hospital St"
        phone: null, // Example: "123-456-7890" or null
        bedDetail: [
            {
                time: "2025-04-06T14:00:00Z", // Example: "2025-04-06T14:00:00Z"
                stats: {
                    title: "Bed Availability", // Example: "Bed Availability"
                    bed_empty: 10, // Example: 10
                    bed_available: 20, // Example: 20
                    queue: 5, // Example: 5
                },
            },
        ], // Example: an array of BedDetail objects
    },
};

// ResponseHospitalMap
const responseHospitalMap = {
    status: 200, // Example: 200
    data: {
        id: "string", // Example: "1"
        address: "123 Hospital St", // Example: "123 Hospital St"
        name: "Hospital Name", // Example: "Hospital Name"
        lat: "37.7749", // Example: "37.7749"
        long: "-122.4194", // Example: "-122.4194"
        gmaps: "https://maps.google.com/?q=37.7749,-122.4194", // Example: "https://maps.google.com/?q=37.7749,-122.4194"
    },
};  