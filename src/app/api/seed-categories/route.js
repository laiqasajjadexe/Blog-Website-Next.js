import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// POST endpoint to seed categories
export const POST = async (req) => {
    try {
        const categories = [
            {
                slug: "style",
                title: "Style",
                img: "/style.png",
            },
            {
                slug: "fashion",
                title: "Fashion",
                img: "/fashion.png",
            },
            {
                slug: "food",
                title: "Food",
                img: "/food.png",
            },
            {
                slug: "travel",
                title: "Travel",
                img: "/travel.png",
            },
            {
                slug: "culture",
                title: "Culture",
                img: "/culture.png",
            },
            {
                slug: "coding",
                title: "Coding",
                img: "/coding.png",
            },
        ];

        // Check if categories already exist
        const existingCategories = await prisma.category.findMany();

        if (existingCategories.length > 0) {
            return new NextResponse(
                JSON.stringify({
                    message: "Categories already exist",
                    count: existingCategories.length,
                    categories: existingCategories
                }),
                { status: 200 }
            );
        }

        // Create categories
        const createdCategories = await Promise.all(
            categories.map((category) =>
                prisma.category.create({
                    data: category,
                })
            )
        );

        return new NextResponse(
            JSON.stringify({
                message: "Categories created successfully",
                count: createdCategories.length,
                categories: createdCategories
            }),
            { status: 201 }
        );
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!", error: err.message }),
            { status: 500 }
        );
    }
};

// GET endpoint to check existing categories
export const GET = async (req) => {
    try {
        const categories = await prisma.category.findMany();

        return new NextResponse(
            JSON.stringify({
                count: categories.length,
                categories: categories
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
