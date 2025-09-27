import {NextResponse} from "next/server";

export async function POST(){
    const data = {
        videos: [
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        ]
    };
    return NextResponse.json(data);

}