import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { eventUseCase } from "../../../di/general.di";
import { IEventUseCase } from "../../../usecases/interfaces/admin/IEventUseCase";
import { imageFileNormalizer } from "../../utils/imageFileNormalizer";
export class EventManagementController {

    constructor(
        private _eventUseCase : IEventUseCase
    ){};

    fetchEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query)
            const result = await this._eventUseCase.fetchEvents(filterOptions);
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            }
            res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
            return;
        } catch (error) {
            next(error)
        }
    };

    createEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const imageFiles = imageFileNormalizer(req.files)
            const eventData = req.body;
            const filterOptions = await paramsNormalizer(req.query)
            const result = await this._eventUseCase.createEvent( eventData, filterOptions, imageFiles);
    
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            };
            res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_CREATE});
            return;
        } catch (error) {
            next(error)
        }
    };

    updateEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const updatedEventData = req.body;
           const filterOptions = await paramsNormalizer(req.query)
           const result = await this._eventUseCase.updateEvent(updatedEventData, filterOptions);
           if(result){
            res.status(HttpStatus.OK).json(result);
            return;
           }
           res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE})
        } catch (error) {
          next(error)  
        }
    };

    deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const eventId = req.body.id;
           const filterOptions = await paramsNormalizer(req.query);
           const result = await this._eventUseCase.deleteEvent(eventId as string, filterOptions);
           if(result){
            res.status(HttpStatus.OK).json(result);
            return;
           };
           res.status(HttpStatus.BAD_REQUEST).json({message: ResponseMessages.FAILED_TO_DELETE})
        } catch (error) {
            next(error)
        }
    };
    
};

export const eventManagementController = new EventManagementController(eventUseCase);