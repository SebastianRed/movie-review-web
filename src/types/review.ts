export type ContentType = 'MOVIE' | 'SERIES';

export interface Review {
    id: number;
    userId: number;
    username: string;
    externalContentId: number;
    contentType: ContentType;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewRequest {
    externalContentId: number;
    contentType: ContentType;
    rating: number;
    comment: string;
}

export interface UpdateReviewRequest {
    rating: number;
    comment: string;
}

export interface ReviewsResponse {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}