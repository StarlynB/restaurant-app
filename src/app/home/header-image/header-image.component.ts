import { Component, OnInit } from '@angular/core';
import { FetchHeaderImageService } from 'src/app/services/fetch-header-image.service';

@Component({
  selector: 'app-header-image',
  templateUrl: './header-image.component.html',
  styleUrls: ['./header-image.component.scss']
})
export class HeaderImageComponent implements OnInit {

  imageUrl: string | undefined;
  isFetchingImage: boolean = false;

  constructor(private fetchImageService: FetchHeaderImageService) { }

  ngOnInit(): void {
    // this.isFetchingImage = true;

    // this.fetchImageService.fetchImage().subscribe((response) => {
    //   console.log(response);
    // },
    //   (error) => {
    //     this.imageUrl = error.url;
    //     this.isFetchingImage = false;
    //   }
    // )
  }


}
