
export class Event {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public image: string[],
    public location: string,
    public locationURL: string,
    public eventDate: string,
    public slots?: number,
    public totalEntries?: number,
    public totalSales?: number,
    public price?: number,
    public createdAt?: string,
    public buyers: {
      userId: string;
      slotsBooked: number;
      totalPaid: number;
    }[] = [] 
  ) {}
}
