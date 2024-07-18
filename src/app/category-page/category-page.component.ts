import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Item } from '../models/items.model';
import { Cart } from '../models/cart.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDataService } from '../services/item-data.service';
import { HandleCartService } from '../services/handle-cart.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {
  _starters: Item[] = [];
  _mains: Item[] = [];
  _alcoholicBeverages: Item[] = [];
  _desserts: Item[] = [];

  // merged item data with cart data
  starters: any[] = [];
  mains: any[] = [];
  alcoholicBeverages: any[] = [];
  desserts: any[] = [];

  isLoading: boolean = false;
  isLoaded: boolean = false;

  // for cart
  cartData!: Cart;

  sectionName: string = '';

  showCategoryNavbar: boolean = false;
  currentActive: number | undefined;
  @ViewChild('startersRef') startersRef: ElementRef | undefined;
  @ViewChild('mainsRef') mainsRef: ElementRef | undefined;
  @ViewChild('dessertsRef') dessertsRef: ElementRef | undefined;
  @ViewChild('alcoholicBeveragesRef') alcoholicBeveragesRef: ElementRef | undefined;

  public startersOffset: Number = null!;
  public mainsOffset: Number = null!;
  public dessertsOffset: Number = null!;
  public alcoholicBeveragesOffset: Number = null!;

  constructor(
    private router: Router,
    private itemDataService: ItemDataService,
    private route: ActivatedRoute,
    private handleCartService: HandleCartService
  ) {
    this.route.fragment.subscribe((data) => {
      this.sectionName = data!;
    })
  }

  ngOnInit(): void {
    this.fetchItems()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.startersOffset = this.startersRef?.nativeElement.offsetTop;
      this.mainsOffset = this.mainsRef?.nativeElement.offsetTop
      this.dessertsOffset = this.dessertsRef?.nativeElement.offsetTop
      this.alcoholicBeveragesOffset = this.alcoholicBeveragesRef?.nativeElement.offsetTop
      window.addEventListener('scroll', this.checkOffsetTop.bind(this));
      this.checkOffsetTop();
    })

  }

  @HostListener('window:scroll', ['$event'])
  checkOffsetTop() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    this.startersOffset = this.startersRef?.nativeElement.offsetTop + 200;
    this.mainsOffset = this.mainsRef?.nativeElement.offsetTop - 200;
    this.dessertsOffset = this.dessertsRef?.nativeElement.offsetTop - 200;
    this.alcoholicBeveragesOffset = this.alcoholicBeveragesRef?.nativeElement.offsetTop - 200;

    if (scrollPosition >= this.startersOffset.valueOf() && scrollPosition < this.mainsOffset.valueOf()) {
      this.currentActive = 1;
      this.showCategoryNavbar = true;
    } else if (scrollPosition >= this.mainsOffset.valueOf() && scrollPosition < this.dessertsOffset.valueOf()) {
      this.currentActive = 2;
      this.showCategoryNavbar = true;
    } else if (scrollPosition >= this.dessertsOffset.valueOf() && scrollPosition < this.alcoholicBeveragesOffset.valueOf()) {
      this.currentActive = 3;
      this.showCategoryNavbar = true;
    } else if (scrollPosition >= this.alcoholicBeveragesOffset.valueOf()) {
      this.currentActive = 4;
      this.showCategoryNavbar = true;
    } else {
      this.currentActive = 0;
      this.showCategoryNavbar = false;
    }
  }

  scrollTo(el: HTMLElement, v: number) {
    //el.scrollIntoView({ block: 'start', inline: 'nearest' });
    el.scrollIntoView();
    this.currentActive = v;
  }






  async fetchItems() {
    try {
      this.isLoading = true;

      (await this.itemDataService.getItemsCategoryWise('starters')).subscribe((data: Item[]) => {
        this._starters = data;
        console.log('Fetching', this._starters)
        this.mergeItemAndCartData();

      });


      (await this.itemDataService.getItemsCategoryWise('mains')).subscribe((data) => {
        this._mains = data;
        console.log('Fetching', this._mains)
        this.mergeItemAndCartData();

      });

      (await this.itemDataService.getItemsCategoryWise('desserts')).subscribe((data) => {
        this._desserts = data;
        console.log('Fetching', this._mains)
        this.mergeItemAndCartData();

      });

      (await this.itemDataService.getItemsCategoryWise('alcoholic-beverages')).subscribe((data) => {
        this._alcoholicBeverages = data;

      });





      this.isLoading = false;
      this.isLoaded = true;
    }

    catch (error) {
      console.log(error);
    }
  }


  fetchCartData() {
    this.cartData = this.handleCartService.getCartData()!;
  }

  mergeItemAndCartData() {
    this.fetchCartData();

    for (let key in this._starters) {
      let count = 0;
      const id = this._starters[key].id;

      if (this.cartData != null) {
        const itemDetailsObj = this.cartData.items[id];
        if (
          itemDetailsObj != undefined &&
          itemDetailsObj.quantity != undefined
        ) {
          count = this.cartData.items[id].quantity;
        }
      }

      this.starters[key] = { ...this._starters[key], quantity: count };
    }

    for (let key in this._mains) {
      let count = 0;
      const id = this._mains[key].id;

      if (this.cartData != null) {
        const itemDetailsObj = this.cartData.items[id];
        if (
          itemDetailsObj != undefined &&
          itemDetailsObj.quantity != undefined
        ) {
          count = this.cartData.items[id].quantity;
        }
      }

      this.mains[key] = { ...this._mains[key], quantity: count };
    }

    for (let key in this._desserts) {
      let count = 0;
      const id = this._desserts[key].id;

      if (this.cartData != null) {
        const itemDetailsObj = this.cartData.items[id];
        if (
          itemDetailsObj != undefined &&
          itemDetailsObj.quantity != undefined
        ) {
          count = this.cartData.items[id].quantity;
        }
      }

      this.desserts[key] = { ...this._desserts[key], quantity: count };
    }

    for (let key in this._alcoholicBeverages) {
      let count = 0;
      const id = this._alcoholicBeverages[key].id;

      if (this.cartData != null) {
        const itemDetailsObj = this.cartData.items[id];
        if (
          itemDetailsObj != undefined &&
          itemDetailsObj.quantity != undefined
        ) {
          count = this.cartData.items[id].quantity;
        }
      }

      this.alcoholicBeverages[key] = {
        ...this._alcoholicBeverages[key],
        quantity: count,
      };
    }
  }
  //* add to cart */ 
  onAdd(item: any) {
    item.quantity += 1;
    this.handleCartService.addOrUpdate(item);
  }

  //** remove from cart */
  onRemove(item: any) {
    item.quantity -= 1;
    this.handleCartService.removeItem(item);
  }

}
