export class Event {
    public id: string;
    public title: string;
    public description: string;
    public image: string[];
    public location: string;
    public locationURL: string;
    public eventDate: string;
    public slots?: number;
    public totalEntries?: number;
    public totalSales?: number;
    public price?: number;
    public createdAt?: string;
    public buyers: {
      userId: string;
      slotsBooked: number;
      totalPaid: number;
    }[] = [] 

  constructor(
    props:{
     id: string,
     title: string,
     description: string,
     image: string[],
     location: string,
     locationURL: string,
     eventDate: string,
     slots?: number,
     totalEntries?: number,
     totalSales?: number,
     price?: number,
     createdAt?: string,
     buyers: {
      userId: string;
      slotsBooked: number;
      totalPaid: number;
    }[]
    
  }

  ) {
     this.id = props.id,
     this.title = props.title,
     this.description = props.description;
     this.image = props.image,
     this.location = props.location,
     this.locationURL = props.locationURL,
     this.eventDate = props.eventDate,
     this.slots = props.slots,
     this.totalEntries = props.totalEntries,
     this.totalSales = props.totalSales,
     this.price = props.price,
     this.createdAt = props.createdAt,
     this.buyers = props.buyers
  }
}
