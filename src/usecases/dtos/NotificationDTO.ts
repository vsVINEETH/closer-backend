export interface NotificationDTO {
    id: string,
    user: string,
    interactor: string,
    type: string,
    message:string,
    createdAt?:string,
}