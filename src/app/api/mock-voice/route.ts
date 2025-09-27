// https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3

import {NextResponse} from "next/server";

export async function POST(){

    const data = {
        images: [
            "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3",
            "https://lh3.googleusercontent.com/gg-dl/AJfQ9KSerTjsbvcpEHvDa3eptOnOX8twtpzgmX5Km8XPWAQdFjapB0zNZ7RGtesr_KPMGxVfZhisMSZE7A-wfdkrWaDMaNu0zjmU5_nx87ngoF4CoIRC9jssFUcDumk-zJY2b6FHK7ZISvVg8gCeKIsOOkw9GWYm5X832TV245zrLYjdqxCw=s1024"
        ]
    }
    return NextResponse.json(data);

}