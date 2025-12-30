import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/firebase-admin-auth";
import { writeClient } from "@/sanity/lib/client";

// GET - Get reviews for a specific product
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get approved reviews
    const reviews = await writeClient.fetch(
      `*[_type == "review" && product._ref == $productId && status == "approved"] | order(createdAt desc) {
        _id,
        rating,
        title,
        content,
        helpful,
        isVerifiedPurchase,
        createdAt,
        user-> {
          _id,
          firstName,
          lastName,
          profileImage {
            asset-> {
              url
            }
          }
        }
      }`,
      { productId }
    );

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          fiveStars: 0,
          fourStars: 0,
          threeStars: 0,
          twoStars: 0,
          oneStar: 0,
        },
      });
    }

    // Calculate statistics
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce(
      (sum: number, review: { rating: number }) => sum + review.rating,
      0
    );
    const averageRating = totalRating / totalReviews;

    // Calculate rating distribution
    const ratingDistribution = {
      fiveStars: reviews.filter((r: { rating: number }) => r.rating === 5)
        .length,
      fourStars: reviews.filter((r: { rating: number }) => r.rating === 4)
        .length,
      threeStars: reviews.filter((r: { rating: number }) => r.rating === 3)
        .length,
      twoStars: reviews.filter((r: { rating: number }) => r.rating === 2)
        .length,
      oneStar: reviews.filter((r: { rating: number }) => r.rating === 1).length,
    };

    return NextResponse.json({
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      ratingDistribution,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, rating, title, content } = body;

    // Validate input
    if (!productId || !rating || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (title.length < 5 || title.length > 100) {
      return NextResponse.json(
        { error: "Title must be between 5 and 100 characters" },
        { status: 400 }
      );
    }

    if (content.length < 20 || content.length > 1000) {
      return NextResponse.json(
        { error: "Content must be between 20 and 1000 characters" },
        { status: 400 }
      );
    }

    // Get the user from Sanity
    const sanityUser = await writeClient.fetch(
      `*[_type == "user" && firebaseUid == $firebaseUid][0]{
        _id,
        firstName,
        lastName
      }`,
      { firebaseUid: userId }
    );

    if (!sanityUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has already reviewed this product
    const existingReview = await writeClient.fetch(
      `*[_type == "review" && user._ref == $userId && product._ref == $productId][0]`,
      { userId: sanityUser._id, productId }
    );

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Check if user has purchased this product
    const hasPurchased = await writeClient.fetch(
      `count(*[_type == "order" && user._ref == $userId && status == "delivered" && $productId in products[].product._ref]) > 0`,
      { userId: sanityUser._id, productId }
    );

    // Create the review using Sanity's API token
    const review = await writeClient.create({
      _type: "review",
      product: {
        _type: "reference",
        _ref: productId,
      },
      user: {
        _type: "reference",
        _ref: sanityUser._id,
      },
      rating,
      title,
      content,
      isVerifiedPurchase: hasPurchased,
      status: "pending",
      helpful: 0,
      helpfulBy: [],
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message:
        "Thank you for your review! It will be published after admin approval.",
      reviewId: review._id,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

// PATCH - Mark review as helpful
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Get the user from Sanity
    const sanityUser = await writeClient.fetch(
      `*[_type == "user" && firebaseUid == $firebaseUid][0]{
        _id
      }`,
      { firebaseUid: userId }
    );

    if (!sanityUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the review
    const review = await writeClient.fetch(
      `*[_type == "review" && _id == $reviewId][0]{
        _id,
        helpful,
        "helpfulByIds": helpfulBy[]._ref
      }`,
      { reviewId }
    );

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user has already marked this review as helpful
    const alreadyMarked = review.helpfulByIds?.includes(sanityUser._id);

    if (alreadyMarked) {
      // Remove the helpful mark
      await writeClient
        .patch(reviewId)
        .set({
          helpful: Math.max(0, review.helpful - 1),
        })
        .unset([`helpfulBy[_ref == "${sanityUser._id}"]`])
        .commit();

      return NextResponse.json({
        success: true,
        message: "Review unmarked as helpful",
      });
    } else {
      // Add the helpful mark
      await writeClient
        .patch(reviewId)
        .set({
          helpful: review.helpful + 1,
        })
        .setIfMissing({ helpfulBy: [] })
        .append("helpfulBy", [
          {
            _type: "reference",
            _ref: sanityUser._id,
          },
        ])
        .commit();

      return NextResponse.json({
        success: true,
        message: "Review marked as helpful",
      });
    }
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
