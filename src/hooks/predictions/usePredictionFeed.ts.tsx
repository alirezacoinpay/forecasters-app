import { useState, useEffect, useCallback } from "react";
import { predictionRepository } from "../../repositories/PredictionRepository";
import { Prediction } from "../../models/Prediction";

export function usePredictionFeed(searchQuery?: string) {
    const [predictions, setPredictions] = useState<Prediction[]>([]); // <-- add type here
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 20,
        lastPage: 1,
    });

    const load = useCallback(async () => {
        const params = {
            page: pagination.page,
            paginate: pagination.perPage,
            ...(searchQuery && { search: searchQuery }),
        };

        const { predictions, meta } = await predictionRepository.fetch(params);

        setPredictions(predictions); // now TS knows predictions is Prediction[]
        setPagination({
            page: meta.current_page,
            perPage: meta.per_page,
            lastPage: meta.last_page,
        });
    }, [searchQuery, pagination.page, pagination.perPage]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        predictions,
        pagination,
        setPage: (p: number) => setPagination((prev) => ({ ...prev, page: p })),
    };
}
