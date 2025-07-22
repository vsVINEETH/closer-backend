import { Event } from "../../domain/entities/Event";
import { EventDTO, EventListingDTO } from "../../usecases/dtos/EventDTO";

export function toEventDTO(entity: Event): EventDTO {
    try {
      return {
        id : entity.id,
        title : entity.title,
        description : entity.description,
        image : entity.image,
        location : entity.location,
        locationURL : entity.locationURL,
        eventDate : entity.eventDate,
        slots : entity.slots,
        totalEntries : entity.totalEntries,
        totalSales : entity.totalSales,
        price : entity.price,
        createdAt : entity.createdAt,
        buyers : entity.buyers
      }  
    } catch (error) {
       throw new Error('Something happend in toEventDTO') 
    };
};

export function toEventDTOs(entities: Event[]): EventDTO[] {
    try {
       return entities.map((entity) => ({
            id : entity.id,
            title : entity.title,
            description : entity.description,
            image : entity.image,
            location : entity.location,
            locationURL : entity.locationURL,
            eventDate : entity.eventDate,
            slots : entity.slots,
            totalEntries : entity.totalEntries,
            totalSales : entity.totalSales,
            price : entity.price,
            createdAt : entity.createdAt,
            buyers : entity.buyers
        })); 
    } catch (error) {
       throw new Error('Something happend in toEventDTOs') 
    };
};

export function toEventListingDTO(entities: Event[] | null): EventListingDTO[] {
  try {
      return entities ?entities.map((entity) => ({
            id : entity.id,
            title : entity.title,
            description : entity.description,
            image : entity.image,
            location : entity.location,
            locationURL: entity.locationURL,
            eventDate : entity.eventDate,
            slots : entity.slots,
            price : entity.price,
            createdAt : entity.createdAt,
        })): []; 
  } catch (error) {
    throw new Error('Something happend in toEventListingDTO') 
  }
}

            // "buyers": [],
            // "id": "67dd2e96c40720b7ef1f6b40",
            // "title": "Mumbai Yacht Soirée",
            // "description": "A premium yacht dating events",
            // "image": [
            //     "https://closer-uploads.s3.ap-south-1.amazonaws.com/cm8ikgoea000701rt8tti3rcw-1742548630402-DALL%C3%82%C2%B7E%202025-03-21%2014.39.59%20-%20A%20luxurious%20yacht%20dating%20event%20in%20Mumbai%2C%20India.%20Elegant%20couples%20are%20dressed%20in%20stylish%20evening%20wear%2C%20enjoying%20drinks%20and%20conversations%20under%20warm%20gol.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2UC3EBBKAPDH2C77%2F20250721%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250721T140157Z&X-Amz-Expires=900&X-Amz-Signature=aa6ff0bb95238d23083adbb81bbe36d2b89bf3a8e1b553175e2a736538105278&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
            // ],
            // "location": "Gateway of India, Mumbai",
            // "locationURL": "https://www.google.com/maps/place/Gateway+Of+India+Mumbai/@18.9217565,72.8280082,15.75z/data=!4m10!1m2!2m1!1sgateway+of+india!3m6!1s0x3be7d1c73a0d5cad:0xc70a25a7209c733c!8m2!3d18.9219841!4d72.8346543!15sChBnYXRld2F5IG9mIGluZGlhWhIiEGdhdGV3YXkgb2YgaW5kaWGSARNoaXN0b3JpY2FsX2xhbmRtYXJr4AEA!16zL20vMDJoN3Iy?entry=ttu&g_ep=EgoyMDI1MDMxOC4wIKXMDSoASAFQAw%3D%3D",
            // "eventDate": "2025-07-30T00:00:00.000Z",
            // "slots": 30,
            // "totalEntries": 0,
            // "totalSales": 0,
            // "price": 1500,
            // "createdAt": "2025-03-21T09:17:10.611Z"