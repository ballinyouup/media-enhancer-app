import {NextResponse} from "next/server";

export async function POST(){

    const data = {
        images: [
            "https://picsum.photos/800/600?random=1",
            "https://picsum.photos/800/600?random=2",
            "https://picsum.photos/800/600?random=3"
        ]
    }
    return NextResponse.json(data);

}