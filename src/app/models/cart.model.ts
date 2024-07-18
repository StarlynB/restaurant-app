import { ItemsDetails } from "./item-details.model";

export interface Cart {
    items: ItemsDetails;
    totalAmt: number;
}