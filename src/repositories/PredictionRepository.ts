import { predictionService } from "../services/predictionService.service";
import { Prediction } from "../models/Prediction";

export class PredictionRepository {
    async fetch(params: any) {
        const response = await predictionService.getPredictionFeed(params);

        return {
            predictions: Prediction.fromArray(response.data),
            meta: response.meta,
        };
    }
}

export const predictionRepository = new PredictionRepository();
