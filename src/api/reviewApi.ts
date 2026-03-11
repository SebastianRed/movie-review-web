import { apiClient } from "./axiosConfig";
import type {
    Review,
    CreateReviewRequest,
    UpdateReviewRequest,
    ReviewsResponse,
    ContentType,
} from "../types/review";
import { ENDPOINTS } from "../utils/constants";

export const reviewApi = {
    getReviewsByContent: async (
        externalContentId: number,
        contentType: ContentType,
    ): Promise<ReviewsResponse> => {
        const { data } = await apiClient.get<ReviewsResponse>(
            ENDPOINTS.REVIEWS.BY_CONTENT,
            {
                params: { externalContentId, contentType },
            },
        );
        return data;
    },

    createReview: async (reviewData: CreateReviewRequest): Promise<Review> => {
        const { data } = await apiClient.post<Review>(
            ENDPOINTS.REVIEWS.BASE,
            reviewData,
        );
        return data;
    },

    updateReview: async (
        reviewApiId: number,
        reviewData: UpdateReviewRequest,
    ): Promise<Review> => {
        const { data } = await apiClient.put<Review>(
            `${ENDPOINTS.REVIEWS.BASE}/${reviewApiId}`,
            reviewData,
        );
        return data;
    },

    deleteReview: async (reviewId: number): Promise<void> => {
        await apiClient.delete(`${ENDPOINTS.REVIEWS.BASE}/${reviewId}`);
    },

    getMyReviews: async (): Promise<Review[]> => {
        const { data } = await apiClient.get<Review[]>(
            ENDPOINTS.REVIEWS.MY_REVIEWS,
        );
        return data;
    },
};
