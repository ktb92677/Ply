/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1v1_1ply_1enrollment_post_requestBody_content_application_1json_schema } from '../models/paths_1v1_1ply_1enrollment_post_requestBody_content_application_1json_schema';
import type { paths_1v1_1ply_1location_post_requestBody_content_application_1json_schema } from '../models/paths_1v1_1ply_1location_post_requestBody_content_application_1json_schema';
import type { paths_1v1_1ply_1practice_post_requestBody_content_application_1json_schema } from '../models/paths_1v1_1ply_1practice_post_requestBody_content_application_1json_schema';
import type { paths_1v1_1ply_1provider_post_requestBody_content_application_1json_schema } from '../models/paths_1v1_1ply_1provider_post_requestBody_content_application_1json_schema';
import type { paths_1v1_1ply_1task_1_taskId_post_requestBody_content_application_1json_schema } from '../models/paths_1v1_1ply_1task_1_taskId_post_requestBody_content_application_1json_schema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Create a practice
     * @param requestBody
     * @returns any Practice created
     * @throws ApiError
     */
    public static postV1PlyPractice(
        requestBody: {
            practiceId?: string;
            name?: string;
            ein?: string;
            owner_name?: string;
        },
    ): CancelablePromise<{
        practiceId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/practice',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List practices
     * @returns any List of activities
     * @throws ApiError
     */
    public static getV1PlyPracticeList(): CancelablePromise<{
        practices?: Array<paths_1v1_1ply_1practice_post_requestBody_content_application_1json_schema>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/practice/list',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Read a practice
     * @param practiceId
     * @returns paths_1v1_1ply_1practice_post_requestBody_content_application_1json_schema read practice
     * @throws ApiError
     */
    public static getV1PlyPractice(
        practiceId: string,
    ): CancelablePromise<paths_1v1_1ply_1practice_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/practice/{practiceId}',
            path: {
                'practiceId': practiceId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update a practice
     * @param practiceId
     * @param requestBody
     * @returns any Default response
     * @throws ApiError
     */
    public static postV1PlyPractice1(
        practiceId: string,
        requestBody: paths_1v1_1ply_1practice_post_requestBody_content_application_1json_schema,
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/practice/{practiceId}',
            path: {
                'practiceId': practiceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List locations
     * @param practiceId
     * @returns any List of locations
     * @throws ApiError
     */
    public static getV1PlyPracticeLocation(
        practiceId: string,
    ): CancelablePromise<{
        locations?: Array<paths_1v1_1ply_1location_post_requestBody_content_application_1json_schema>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/practice/{practiceId}/location',
            path: {
                'practiceId': practiceId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List providers
     * @param practiceId
     * @returns any List of providers
     * @throws ApiError
     */
    public static getV1PlyPracticeProvider(
        practiceId: string,
    ): CancelablePromise<{
        providers?: Array<paths_1v1_1ply_1provider_post_requestBody_content_application_1json_schema>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/practice/{practiceId}/provider',
            path: {
                'practiceId': practiceId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List tasks
     * @param practiceId
     * @returns any List of tasks
     * @throws ApiError
     */
    public static getV1PlyPracticeTask(
        practiceId: string,
    ): CancelablePromise<{
        tasks?: Array<paths_1v1_1ply_1task_1_taskId_post_requestBody_content_application_1json_schema>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/practice/{practiceId}/task',
            path: {
                'practiceId': practiceId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List enrollments
     * @param practiceId
     * @returns any List of enrollments
     * @throws ApiError
     */
    public static getV1PlyPracticeEnrollment(
        practiceId: string,
    ): CancelablePromise<{
        enrollments?: Array<paths_1v1_1ply_1enrollment_post_requestBody_content_application_1json_schema>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/practice/{practiceId}/enrollment',
            path: {
                'practiceId': practiceId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List documents
     * @param practiceId
     * @returns any List of documents
     * @throws ApiError
     */
    public static getV1PlyPracticeDocument(
        practiceId: string,
    ): CancelablePromise<{
        documents?: Array<{
            documentId?: string;
            practiceId?: string;
            file_name?: string;
            storage_path?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/practice/{practiceId}/document',
            path: {
                'practiceId': practiceId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Upload a document for a practice
     * Upload a document and associate it with a specific practice
     * @param practiceId
     * @param formData
     * @returns any Document created
     * @throws ApiError
     */
    public static postV1PlyPracticeUpload(
        practiceId: string,
        formData: {
            /**
             * The document file to upload
             */
            file: Blob;
            /**
             * The original name of the file being uploaded
             */
            fileName: string;
        },
    ): CancelablePromise<{
        documentId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/practice/{practiceId}/upload',
            path: {
                'practiceId': practiceId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get a document by ID
     * Retrieve a document by its ID. Returns the actual file content.
     * @param documentId The unique identifier of the document
     * @returns binary Document file content
     * @throws ApiError
     */
    public static getV1PlyDocument(
        documentId: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/document/{documentId}',
            path: {
                'documentId': documentId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a document
     * @param documentId The unique identifier of the document
     * @returns any Default response
     * @throws ApiError
     */
    public static deleteV1PlyDocument(
        documentId: string,
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/ply/document/{documentId}',
            path: {
                'documentId': documentId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create a location
     * @param requestBody
     * @returns any Location created
     * @throws ApiError
     */
    public static postV1PlyLocation(
        requestBody: {
            locationId?: string;
            practiceId?: string;
            address?: string;
        },
    ): CancelablePromise<{
        locationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/location',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Read a location
     * @param locationId
     * @returns paths_1v1_1ply_1location_post_requestBody_content_application_1json_schema read location
     * @throws ApiError
     */
    public static getV1PlyLocation(
        locationId: string,
    ): CancelablePromise<paths_1v1_1ply_1location_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/location/{locationId}',
            path: {
                'locationId': locationId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update a location
     * @param locationId
     * @param requestBody
     * @returns any Default response
     * @throws ApiError
     */
    public static postV1PlyLocation1(
        locationId: string,
        requestBody: paths_1v1_1ply_1location_post_requestBody_content_application_1json_schema,
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/location/{locationId}',
            path: {
                'locationId': locationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a location
     * @param locationId
     * @returns any Default response
     * @throws ApiError
     */
    public static deleteV1PlyLocation(
        locationId: string,
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/ply/location/{locationId}',
            path: {
                'locationId': locationId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create a provider
     * @param requestBody
     * @returns any Provider created
     * @throws ApiError
     */
    public static postV1PlyProvider(
        requestBody: {
            providerId?: string;
            practiceId?: string;
            name?: string;
            ssn?: string;
        },
    ): CancelablePromise<{
        providerId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/provider',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Read a provider
     * @param providerId
     * @returns paths_1v1_1ply_1provider_post_requestBody_content_application_1json_schema read provider
     * @throws ApiError
     */
    public static getV1PlyProvider(
        providerId: string,
    ): CancelablePromise<paths_1v1_1ply_1provider_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/provider/{providerId}',
            path: {
                'providerId': providerId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update a provider
     * @param providerId
     * @param requestBody
     * @returns any Default response
     * @throws ApiError
     */
    public static postV1PlyProvider1(
        providerId: string,
        requestBody: paths_1v1_1ply_1provider_post_requestBody_content_application_1json_schema,
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/provider/{providerId}',
            path: {
                'providerId': providerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a provider
     * @param providerId
     * @returns any Default response
     * @throws ApiError
     */
    public static deleteV1PlyProvider(
        providerId: string,
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/ply/provider/{providerId}',
            path: {
                'providerId': providerId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update a task
     * @param taskId
     * @param requestBody
     * @returns any Default response
     * @throws ApiError
     */
    public static postV1PlyTask(
        taskId: string,
        requestBody: {
            taskId?: string;
            practiceId?: string;
            message?: string;
            status?: string;
        },
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/task/{taskId}',
            path: {
                'taskId': taskId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create an enrollment
     * @param requestBody
     * @returns any Enrollment created
     * @throws ApiError
     */
    public static postV1PlyEnrollment(
        requestBody: {
            enrollmentId?: string;
            practiceId?: string;
            state?: string;
            payer?: string;
            status?: string;
            locationId?: string;
            type?: string;
            providerId?: string;
        },
    ): CancelablePromise<{
        enrollmentId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/enrollment',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Read a enrollment
     * @param enrollmentId
     * @returns paths_1v1_1ply_1enrollment_post_requestBody_content_application_1json_schema read enrollment
     * @throws ApiError
     */
    public static getV1PlyEnrollment(
        enrollmentId: string,
    ): CancelablePromise<paths_1v1_1ply_1enrollment_post_requestBody_content_application_1json_schema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/enrollment/{enrollmentId}',
            path: {
                'enrollmentId': enrollmentId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update a enrollment
     * @param enrollmentId
     * @param requestBody
     * @returns any Default response
     * @throws ApiError
     */
    public static postV1PlyEnrollment1(
        enrollmentId: string,
        requestBody: paths_1v1_1ply_1enrollment_post_requestBody_content_application_1json_schema,
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/ply/enrollment/{enrollmentId}',
            path: {
                'enrollmentId': enrollmentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a enrollment
     * @param enrollmentId
     * @returns any Default response
     * @throws ApiError
     */
    public static deleteV1PlyEnrollment(
        enrollmentId: string,
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/ply/enrollment/{enrollmentId}',
            path: {
                'enrollmentId': enrollmentId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List activities
     * @param enrollmentId
     * @returns any List of activities
     * @throws ApiError
     */
    public static getV1PlyEnrollmentActivity(
        enrollmentId: string,
    ): CancelablePromise<{
        activities?: Array<{
            activityId?: string;
            enrollmentId?: string;
            message?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/ply/enrollment/{enrollmentId}/activity',
            path: {
                'enrollmentId': enrollmentId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
