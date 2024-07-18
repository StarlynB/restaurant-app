import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../models/items.model';
import { Database, ref, set, push, get, update, remove } from '@angular/fire/database'
import { enviroment } from 'src/environments/environment';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemDataService {
  item!: Item;


  constructor(private _http: HttpClient, private db: Database) { }

  //add item data to Firebase DB
  addItemData(itemData: Item) {
    this.item = itemData;
    const path = enviroment.firebase.databaseURL + '/items/' + itemData.category + '.json';
    return this._http.post<Item>(path, itemData);
  }

  //set item id in Firebase DB
  setItemId(idParams: string) {
    let modifiedIdParam: string = 'S';

    if (this.item.category === 'starters') {
      modifiedIdParam = 'S' + idParams
    } else if (this.item.category === 'mains') {
      modifiedIdParam = 'M' + idParams;
    } else if (this.item.category === 'alcoholic-beverages') {
      modifiedIdParam = 'AB' + idParams;
    } else if (this.item.category === 'desserts') {
      modifiedIdParam = 'D' + idParams;
    }

    const itemRef = ref(this.db, `items/${this.item.category}/${idParams}`);
    return update(itemRef, { id: modifiedIdParam })
  }

  /**get item by category */
  async getItemsCategoryWise(category: string) {
    const path = enviroment.firebase.databaseURL + '/items/' + category + '.json';

    return this._http.get<{ [key: string]: Item }>(path).pipe(
      map((responseData) => {
        const itemArray: Item[] = [];

        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            itemArray.push(responseData[key]);
          }
        }
        return itemArray;
      })
    );
  }

  /** get item by id */
  async getItemById(category: string, id: string) {
    const pathItemId = this.getPathItemId(id);

    const path =
      enviroment.firebase.databaseURL +
      '/items/' +
      category +
      '/' +
      pathItemId +
      '.json';

    return await this._http
      .get(path)
      .pipe(
        map((data) => {
          return data;
        })
      )
      .toPromise();
  }



  // * delete item data from Firebase DB *//
  async deleteItemData(itemCategory: string, itemId: string) {
    const pathItemId = this.getPathItemId(itemId);
    const itemRef = ref(this.db, `items/${itemCategory}/${pathItemId}`)

    return await remove(itemRef);
  }

  /** delete imageUrl value when image deleted from storage */
  async deleteImageUrl(itemCategory: string, itemId: string) {
    const pathItemId = this.getPathItemId(itemId);
    const itemRef = ref(this.db, `items/${itemCategory}/${pathItemId}`);

    return await update(itemRef, { imageUrl: '' });
  }

  /** update item data */
  async updateItemData(item: Item, itemCategory: string, itemId: string) {
    const pathItemId = this.getPathItemId(itemId);
    const itemRef = ref(this.db, `items/${itemCategory}/${pathItemId}`)

    return await update(itemRef, item);
  }

  /** set/toogle item availability status */
  async setIsAvaliable(v: boolean, itemCategory: string, itemId: string) {
    console.log(`Setting isAvaliable to ${v} for item ${itemId} in category ${itemCategory}`);
    const pathItemId = this.getPathItemId(itemId);
    const itemRef = ref(this.db, `items/${itemCategory}/${pathItemId}`);

    try {
      await update(itemRef, { isAvaliable: v });
      console.log('Update successful');
    } catch (error) {
      console.error('Update failed', error);
    }
  }


  /** checks item availability status before confirm order */
  async reportItemAvailability(orders: any[]) {
    let notAvailableItems: any[] = [];

    for (let i in orders) {
      const obj: Item = await this.getItemById(orders[i].category, orders[i].id) as Item;

      if (obj.isAvaliable == false) {
        notAvailableItems.push({ name: obj.name, id: obj.id });
      }
    }

    return notAvailableItems;
  }



  /** utilities */

  getPathItemId(itemId: string): string {
    let pathItemId = '';

    if (!itemId.startsWith('-')) {
      let parts: string[] = itemId.split('-');
      for (let i = 1; i < parts.length; i++) {
        pathItemId += '-' + parts[i];
      }
    } else {
      pathItemId = itemId;
    }

    console.log(`Formatted pathItemId: ${pathItemId}`);
    return pathItemId;
  }

  /** utilities end */
  async getAllItems(): Promise<Item[] | undefined> {
    const path = enviroment.firebase.databaseURL + '/items.json';
    let res: any;

    return this._http.get<{ [category: string]: { [itemId: string]: Item } }>(path).pipe(
      map((responseData) => {
        const itemsArray: Item[] = [];
        for (const category in responseData) {
          if (responseData.hasOwnProperty(category)) {
            for (const item in responseData[category]) {
              itemsArray.push(responseData[category][item])
            }
          }
        }
        return itemsArray;
      })
    )
      .toPromise();
  }

}
