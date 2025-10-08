import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/utils/auth";

// DELETE endpoint to remove posts with empty slugs or titles
export const POST = async (req) => {
    try {
        // Find posts with empty slugs or titles
        const invalidPosts = await prisma.post.findMany({
            where: {
                OR: [
                    { slug: "" },
                    { title: "" },
                ],
            },
        });

        if (invalidPosts.length === 0) {
            return new NextResponse(
                JSON.stringify({
                    message: "No invalid posts found",
                    deletedCount: 0
                }),
                { status: 200 }
            );
        }

        // Delete invalid posts
        const deletedPosts = await prisma.post.deleteMany({
            where: {
                OR: [
                    { slug: "" },
                    { title: "" },
                ],
            },
        });

        return new NextResponse(
            JSON.stringify({
                message: "Invalid posts deleted successfully",
                deletedCount: deletedPosts.count,
                invalidPosts: invalidPosts
            }),
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!", error: err.message }),
            { status: 500 }
        );
    }
};
