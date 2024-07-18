export interface ItemsDetails {
    [id: string]: {
        addedOn: string;
        quantity: number;
        itemId: string;
        category: string;
        name: string;
        price: string;
        imageUrl: string;
    };
}