import { addMockUser } from "../services/user/UserController";


export const MockUsers = () => {

    addMockUser({
        "profile": {
            "gallery": [],
            "name": "testsub",
            "about": "testsub  testsub  testsub  testsub  testsub",
            "gender": "M",
            "age": 20,
            "country": "United States",
            "phone": "(999) 999-9999",
            "zipcode": "61107",
            "state": "Il",
            "city": "Rockford",
            "speed": 18,
            "time": 1,
            "weight": "123",
            "location": {
                "type": "Point",
                "coordinates": [
                    42.29086730202833,
                    -89.01821606100764
                ]
            }
        },
        "email": "testsub@gmail.com",
        "username": "testsub",
        "password": "XXXXXXXXX",
        "role": "subscriber",
        "acceptTerms": true,
    });

    addMockUser({
        "profile": {
            "gallery": [],
            "name": "testsub2",
            "about": "testsub2  testsub2  testsub2  testsub2  testsub2",
            "gender": "M",
            "age": 18,
            "country": "United States",
            "phone": "(999) 999-9999",
            "zipcode": "11106",
            "state": "NY",
            "city": "Astoria",
            "speed": 30,
            "time": 7,
            "weight": "123",
            "location": {
                "type": "Point",
                "coordinates": [
                    40.76662615282667,
                    -73.92929443983178
                ]
            }
        },
        "email": "testsub2@gmail.com",
        "username": "testsub2",
        "password": "KULBCVs78gKgu9wT",
        "role": "subscriber",
        "acceptTerms": true,
    });

    addMockUser({
        "profile": {
            "gallery": [],
            "name": "testsub3",
            "about": "testsub3  testsub3  testsub3  testsub3  testsub3",
            "gender": "M",
            "age": 55,
            "country": "United States",
            "phone": "(999) 999-9999",
            "zipcode": "61066",
            "state": "Il",
            "city": "Chicago",
            "speed": 15,
            "time": 10,
            "weight": "123",
            "location": {
                "type": "Point",
                "coordinates": [
                    11111,
                    -11111
                ]
            }
        },
        "email": "testsub3@gmail.com",
        "username": "testsub3",
        "password": "KULBCVs78gKgu9wT",
        "role": "subscriber",
        "acceptTerms": true,
    });
}
