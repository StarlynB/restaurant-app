import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/models/items.model';
import { ItemDataService } from 'src/app/services/item-data.service';

@Component({
  selector: 'app-display-tems',
  templateUrl: './display-tems.component.html',
  styleUrls: ['./display-tems.component.scss']
})
export class DisplayTemsComponent implements OnInit, AfterViewInit {
  starters: Item[] | undefined = [];
  mains: Item[] | undefined = [];
  desserts: Item[] | undefined = [];
  alcoholicbeverages: Item[] | undefined = [];

  isLoading: boolean = false;
  isLoaded: boolean = false

  sectionName: string = '';

  showCategoryNavbar: boolean = false;

  currentActive: number = 0;

  @ViewChild('startersRef') startersRef: ElementRef | undefined;
  @ViewChild('mainsRef') mainsRef: ElementRef | undefined;
  @ViewChild('dessertsRef') dessertsRef: ElementRef | undefined;
  @ViewChild('alcoholicbeveragesRef') alcoholicbeveragesRef: ElementRef | undefined;

  public startersOffset: Number = 0;
  public mainsOffset: Number = 0;
  public dessertsOffset: Number = 0;
  public alcoholicBeveragesOffset: Number = 0;

  constructor(
    private router: Router,
    private itemDataService: ItemDataService,
    private route: ActivatedRoute
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
      this.alcoholicBeveragesOffset = this.alcoholicbeveragesRef?.nativeElement.offsetTop
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
    this.alcoholicBeveragesOffset = this.alcoholicbeveragesRef?.nativeElement.offsetTop - 200;

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
    this.isLoading = true;

    (await this.itemDataService.getItemsCategoryWise('starters')).subscribe((data) => {
      this.starters = data;
      this.checkAllLoaded();
    });

    (await this.itemDataService.getItemsCategoryWise('mains')).subscribe((data) => {
      this.mains = data;
      this.checkAllLoaded();
    });

    (await this.itemDataService.getItemsCategoryWise('desserts')).subscribe((data) => {
      this.desserts = data;
      this.checkAllLoaded();
    });

    (await this.itemDataService.getItemsCategoryWise('alcoholic-beverages')).subscribe((data) => {
      this.alcoholicbeverages = data;
      this.checkAllLoaded();
    });
  }

  checkAllLoaded() {
    if (this.starters!.length > 0 || this.mains!.length > 0 && this.desserts!.length > 0 || this.alcoholicbeverages!.length > 0) {
      this.isLoading = false;
      this.isLoaded = true;
    }
  }

  onEdit(itemCategory: string, itemId: string) {
    this.router.navigate(['admin/items/edit', itemCategory, itemId]);
  }

  onAdd() {
    this.router.navigate(['admin/items/add']);
  }

  setAvaliabilityStatus(item: any) {
    const status = item.isAvaliable;
    console.log(status);
    item.isAvaliable = !status;
    this.itemDataService.setIsAvaliable(!status, item.category, item.id);
  }
}